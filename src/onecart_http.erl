%%%-------------------------------------------------------------------
%%% @author khanhhua
%%% @copyright (C) 2018, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 13. Feb 2018 9:15 PM
%%%-------------------------------------------------------------------
-module(onecart_http).
-author("khanhhua").

-behavior(cowboy_handler).
-include("records.hrl").
%% API
-export([init/2, terminate/3]).

init(Req0, State = #{resource := apps}) ->
  resource_apps(Req0, State);
init(Req0, State = #{resource := Resource}) ->
  AppID = cowboy_req:binding('appid', Req0),

%% Guard against invalid App IDs
  {ok, Req, _State} = case onecart_db:app_exists(AppID) of
    true -> case Resource of
              cart -> resource_cart(Req0, State#{appid => AppID});
              checkout -> action_checkout(Req0, State#{appid => AppID});
              pay -> action_pay(Req0, State#{appid => AppID});
              ipn -> action_ipn(Req0, State#{appid => AppID});
              complete_payment -> action_complete_payment(Req0, State#{appid => AppID});
              cancel_payment -> action_cancel_payment(Req0, State#{appid => AppID});
              products -> resource_products(Req0, State#{appid => AppID});
              orders -> resource_orders(Req0, State#{appid => AppID})
            end;
    false -> {ok, cowboy_req:reply(403, Req0), State}
  end,

  {ok, Req, State}.

terminate(_Reason, _Req, _State) ->
  ok.

resource_apps(Req0=#{method := <<"POST">>}, State) ->
  Headers = #{<<"content-type">> => <<"application/json">>},
  {ok, Body, _} = cowboy_req:read_body(Req0),
  Data = jsx:decode(Body, [return_maps]),
  App = #app{
    ownerid = maps:get(<<"ownerid">>, Data),
    paypal_merchant_id = maps:get(<<"paypal_merchant_id">>, Data)
  },

  case onecart_db:create_app(App) of
    {ok, AppID} -> {ok, cowboy_req:reply(200,
      Headers,
      jsx:encode(#{<<"appid">> => AppID}),
      Req0), State};
    {error, Reason} ->
      {ok, cowboy_req:reply(400,
        Headers,
        jsx:encode(#{<<"error">> => Reason}),
        Req0), State}
  end.

resource_cart(Req0=#{method := <<"POST">>}, State = #{appid := AppID, pkey := PKey}) ->
  Headers = #{<<"content-type">> => <<"application/json">>},
  case onecart_db:create_cart(AppID) of
    {ok, CartID} ->
      EncCartID = encrypt(CartID, PKey),

      {ok, cowboy_req:reply(200,
        Headers,
        jsx:encode(#{<<"cid">> => base64:encode(EncCartID)}),
        Req0), State};
    {error, Reason} ->
      {ok, cowboy_req:reply(400,
        Headers,
        jsx:encode(#{<<"error">> => Reason}),
        Req0), State}
  end;
resource_cart(Req0=#{method := <<"PUT">>}, State = #{appid := AppID, skey := SKey}) ->
  CardID = cart_id(Req0, SKey),

  {ok, Body, _} = cowboy_req:read_body(Req0),
  Data = jsx:decode(Body, [return_maps]),

  ItemsToUpdate = lists:map(
    fun (#{<<"id">> := ProductID, <<"qty">> := Qty}) ->
      #order_item{productid = ProductID, qty = Qty}
    end, Data),
  io:format("Adding item to cart: ~p Items: ~p", [CardID, ItemsToUpdate]),
  {ok, Cart} = onecart_db:update_cart(AppID, binary_to_integer(CardID), ItemsToUpdate),

  Req = cowboy_req:reply(200, #{
    <<"content-type">> => <<"application/json">>
  }, jsx:encode(
    #{
      <<"items">> => lists:map(
        fun (It) -> #{
          id => It#order_item.productid,
          name => It#order_item.productname,
          qty => It#order_item.qty,
          price => It#order_item.price
        } end,
        Cart#cart.items)
    }), Req0),
  {ok, Req, State};
resource_cart(Req0=#{method := <<"DELETE">>}, State = #{appid := AppID, skey := SKey}) ->
  CardID = cart_id(Req0, SKey),

  {ok, Body, _} = cowboy_req:read_body(Req0),
  Data = jsx:decode(Body, [return_maps]),

  ProductID = maps:get(<<"id">>, Data),
  io:format("Removing item from cart: ~p Items: ~p", [CardID, ProductID]),
  {ok, Cart} = onecart_db:remove_cart_item(AppID, binary_to_integer(CardID), ProductID),

  Req = cowboy_req:reply(200, #{
    <<"content-type">> => <<"application/json">>
  }, jsx:encode(
    #{
      <<"items">> => lists:map(
        fun (It) -> #{
          id => It#order_item.productid,
          name => It#order_item.productname,
          qty => It#order_item.qty,
          price => It#order_item.price
        } end,
        Cart#cart.items)
    }), Req0),
  {ok, Req, State};
resource_cart(Req0, State = #{appid := AppID, skey := SKey}) ->
  CardID = cart_id(Req0, SKey),
  case onecart_db:get_cart(AppID, binary_to_integer(CardID)) of
    {ok, Cart} ->
      io:format("CartID: ~p~n", [Cart#cart.id]),
      Req = cowboy_req:reply(200, #{
        <<"content-type">> => <<"application/json">>
      }, jsx:encode(
        #{
          <<"items">> => lists:map(
            fun (It) -> #{
              id => It#order_item.productid,
              name => It#order_item.productname,
              qty => It#order_item.qty,
              price => It#order_item.price
            } end,
            Cart#cart.items)
        }), Req0),
      {ok, Req, State};
    {error, Reason} ->
      Req = cowboy_req:reply(400, #{
        <<"content-type">> => <<"application/json">>
      }, jsx:encode(list_to_binary(Reason)), Req0),
      {ok, Req, State}
  end.

action_checkout(Req0 = #{method := <<"POST">>}, State = #{appid := AppID}) ->
%%  CardID = cart_id(Req0),

  {ok, Body, _} = cowboy_req:read_body(Req0),
  Data = jsx:decode(Body, [return_maps]),
  Items = maps:get(<<"items">>, Data),

  OrderItems = lists:map(
    fun (It) ->
      #order_item{
        productid = maps:get(<<"id">>, It),
        productname = maps:get(<<"name">>, It),
        qty = maps:get(<<"qty">>, It),
        price = maps:get(<<"price">>, It)
      }
    end, Items),
  case onecart_db:create_order(AppID, OrderItems) of
    {ok, Order} ->
      io:format("OrderID: ~p~n", [Order#order.id]),
      Req = cowboy_req:reply(200, #{
        <<"content-type">> => <<"application/json">>
      }, jsx:encode(
        #{
          <<"id">> => Order#order.id,
          <<"total">> => Order#order.total,
          <<"currency">> => <<"USD">>,
          <<"items">> => lists:map(
            fun (It) -> #{
              id => It#order_item.productid,
              name => It#order_item.productname,
              qty => It#order_item.qty,
              price => It#order_item.price
            } end,
            Order#order.items)
        }), Req0),
      {ok, Req, State};
    {error, Reason} ->
      Req = cowboy_req:reply(400, #{
        <<"content-type">> => <<"application/json">>
      }, jsx:encode(list_to_binary(Reason)), Req0),
      {ok, Req, State}
  end.

action_pay(Req0 = #{method := <<"POST">>}, State = #{appid := AppID}) ->
  {ok, App} = onecart_db:get_app(AppID),
  {ok, Body, _} = cowboy_req:read_body(Req0),
  Data = jsx:decode(Body, [return_maps]),
  OrderID = maps:get(<<"id">>, Data),

  {ok, Order} = onecart_db:get_order(AppID, OrderID),
  {ok, Payment} = onecart_paypal:pay(App, Order),
  Headers = #{<<"content-type">> => <<"application/json">>},
  Req = cowboy_req:reply(200, Headers, jsx:encode(#{
    method => <<"paypal">>,
    payment_url => iolist_to_binary(io_lib:format("https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_ap-payment&paykey=~s", [Payment#payment.paykey]))
  }), Req0),

  {ok, Req, State}.

action_ipn(Req0 = #{method := <<"POST">>}, State = #{appid := AppID, skey := SKey}) ->
  io:format("IPN...~n"),

  #{tx := UrlEncodedTxID} = cowboy_req:match_qs([tx], Req0),
  io:format("UrlEncodedTxID: ~p~n", [UrlEncodedTxID]),
  EncTxID = base64:decode(cow_qs:urldecode(UrlEncodedTxID)),
  TxID = decrypt(EncTxID, SKey),

  case onecart_db:get_order(AppID, {transactionid, TxID}) of
    {ok, Order} ->
      {ok, RefNo} = onecart_db:next_ref_no(AppID),
      {ok, _Order} = onecart_db:update_order(AppID,
        Order#order{
          status = complete,
          refno = iolist_to_binary(io_lib:format("~B~2..0B~6..0B", tuple_to_list(RefNo)))
        }),
      Req = cowboy_req:reply(200, #{}, <<"OK">>, Req0),
      {ok, Req, State};
    {error, Reason} ->
      Req = cowboy_req:reply(400, #{
        <<"content-type">> => <<"application/json">>
      }, jsx:encode(list_to_binary(Reason)), Req0),
      {ok, Req, State}
  end.

action_complete_payment(Req0 = #{method := <<"GET">>}, State = #{appid := AppID, skey := SKey}) ->
  #{tx := UrlEncodedTxID} = cowboy_req:match_qs([tx], Req0),
  io:format("UrlEncodedTxID: ~p~n", [UrlEncodedTxID]),
  EncTxID = base64:decode(cow_qs:urldecode(UrlEncodedTxID)),
  TxID = decrypt(EncTxID, SKey),

  case onecart_db:get_order(AppID, {transactionid, TxID}) of
    {ok, Order} ->
      Req = cowboy_req:reply(200, #{},
        <<"<script>
        window.opener && window.opener.postMessage('onecart.paypal.complete','*');
        setTimeout(function () { window.close() }, 300);
        </script>">>,
        Req0),
      {ok, Req, State};
    {error, Reason} ->
      Req = cowboy_req:reply(400, #{
      <<"content-type">> => <<"application/json">>
      }, jsx:encode(list_to_binary(Reason)), Req0),
      {ok, Req, State}
  end.

action_cancel_payment(Req0 = #{method := <<"GET">>}, State = #{appid := AppID, skey := SKey}) ->
  #{tx := UrlEncodedTxID} = cowboy_req:match_qs([tx], Req0),
  EncTxID = base64:decode(cow_qs:urldecode(UrlEncodedTxID)),
  TxID = decrypt(EncTxID, SKey),

  case onecart_db:get_order(AppID, {transactionid, TxID}) of
    {ok, Order} ->
      {ok, _Order} = onecart_db:update_order(AppID, Order#order{status = cancelled}),

      Req = cowboy_req:reply(200, #{},
        <<"<script>
        window.opener && window.opener.postMessage('onecart.paypal.cancel','*');
        setTimeout(function () { window.close() }, 300);
        </script>">>,
        Req0),
      {ok, Req, State};
    {error, Reason} ->
      Req = cowboy_req:reply(400, #{
        <<"content-type">> => <<"application/json">>
      }, jsx:encode(list_to_binary(Reason)), Req0),
      {ok, Req, State}
  end.

resource_products(Req0 = #{method := <<"GET">>}, State = #{appid := AppID}) ->
  ProductID = cowboy_req:binding(productid, Req0),
  Headers = #{<<"content-type">> => <<"application/json">>},
  {ok,Product} = onecart_db:get_product(AppID, ProductID),
  Req = cowboy_req:reply(200, Headers,
    jsx:encode(#{id => Product#product.id, name => Product#product.name}), Req0),
  {ok, Req, State};
resource_products(Req0 = #{method := <<"POST">>}, State = #{appid := AppID}) ->
  Headers = #{<<"content-type">> => <<"application/json">>},
  {ok, Body, _} = cowboy_req:read_body(Req0),
  Data = jsx:decode(Body, [return_maps]),

  Product = #product{
    id = maps:get(<<"id">>, Data),
    name = maps:get(<<"name">>, Data),
    price = maps:get(<<"price">>, Data)
  },
  {ok, Product} = onecart_db:create_product(AppID, Product),

  Req = cowboy_req:reply(200, Headers,
    jsx:encode(#{
      id => Product#product.id,
      name => Product#product.name,
      price => Product#product.price
    }), Req0),
  {ok, Req, State};
resource_products(Req0, State = #{appid := AppID}) ->
  {ok, Products} = onecart_db:get_products(AppID, #{}),

  Req = cowboy_req:reply(200, #{
    <<"content-type">> => <<"application/json">>
  }, jsx:encode(lists:map(
    fun (It) ->
      #{
        id => It#product.id,
        name => It#product.name,
        price => It#order_item.price
      }
    end, Products)
  ), Req0),
  {ok, Req, State}.

resource_orders(Req0 = #{method := <<"POST">>},
    State = #{
      appid := AppID,
      hashids_ctx := HashidsContext,
      pkey := PKey
    }) ->
  {ok, Body, _} = cowboy_req:read_body(Req0),
  Data = jsx:decode(Body, [return_maps]),
  Id = maps:get(<<"id">>, Data),

  case onecart_db:get_order(AppID, Id) of
    {ok, Order} ->
      TxID = list_to_binary(hashids:encode(HashidsContext, erlang:system_time())),
      {ok, _Order} = onecart_db:update_order(AppID, Order#order{transactionid = TxID}),
      io:format("Order transaction ID: ~p~n", [TxID]),

      {ok, CardID} = onecart_db:create_cart(AppID),
      EncCardID = encrypt(CardID, PKey),
      Req = cowboy_req:reply(200, #{
        <<"content-type">> => <<"application/json">>
      }, jsx:encode(
        #{
          <<"order">> => #{
            <<"id">> => Order#order.id
          },
          <<"next_cid">> => base64:encode(EncCardID)
        }), Req0),
      {ok, Req, State};
    {error, Reason} ->
      Req = cowboy_req:reply(400, #{
        <<"content-type">> => <<"application/json">>
      }, jsx:encode(list_to_binary(Reason)), Req0),
      {ok, Req, State}
  end;
resource_orders(Req0, State = #{appid := AppID}) ->
  {ok, Orders} = onecart_db:get_orders(AppID, #{}),

  Req = cowboy_req:reply(200, #{
    <<"content-type">> => <<"application/json">>
  }, jsx:encode(lists:map(
    fun (It) -> #{id => It#order.id} end,
    Orders)), Req0),
  {ok, Req, State}.

cart_id(Req0, SKey) ->
  Based64CardID = cowboy_req:header(<<"x-onecart-cid">>, Req0),
  io:format("Based64CardID: ~p~n", [Based64CardID]),
  decrypt(base64:decode(Based64CardID), SKey).

encrypt(Input, PKey) when is_integer(Input) ->
  public_key:encrypt_public(integer_to_binary(Input), PKey).

decrypt(Encrypted, SKey) ->
  public_key:decrypt_private(Encrypted, SKey).
