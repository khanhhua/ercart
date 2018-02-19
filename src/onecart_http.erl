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

  case onecart_db:create_app(maps:get(<<"ownerid">>, Data)) of
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

resource_cart(Req0=#{method := <<"POST">>}, State = #{appid := AppID}) ->
  Headers = #{<<"content-type">> => <<"application/json">>},
  case onecart_db:create_cart(AppID) of
    {ok, CartID} ->
      EncCartID = encrypt_cartid(CartID),

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
resource_cart(Req0=#{method := <<"PUT">>}, State = #{appid := AppID}) ->
  CardID = cart_id(Req0),

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
          qty => It#order_item.qty
        } end,
        Cart#cart.items)
    }), Req0),
  {ok, Req, State};
resource_cart(Req0=#{method := <<"DELETE">>}, State = #{appid := AppID}) ->
  CardID = cart_id(Req0),

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
          qty => It#order_item.qty
        } end,
        Cart#cart.items)
    }), Req0),
  {ok, Req, State};
resource_cart(Req0, State = #{appid := AppID}) ->
  CardID = cart_id(Req0),
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
              qty => It#order_item.qty
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
    name = maps:get(<<"name">>, Data)
  },
  {ok, Product} = onecart_db:create_product(AppID, Product),

  Req = cowboy_req:reply(200, Headers,
    jsx:encode(#{id => Product#product.id, name => Product#product.name}), Req0),
  {ok, Req, State};
resource_products(Req0, State = #{appid := AppID}) ->
  {ok, Products} = onecart_db:get_products(AppID, #{}),

  Req = cowboy_req:reply(200, #{
    <<"content-type">> => <<"application/json">>
  }, jsx:encode(lists:map(
    fun (It) -> #{id => It#product.id, name => It#product.name} end,
    Products)
  ), Req0),
  {ok, Req, State}.

resource_orders(Req0, State = #{appid := AppID}) ->
  {ok, Orders} = onecart_db:get_orders(AppID, #{}),

  Req = cowboy_req:reply(200, #{
    <<"content-type">> => <<"application/json">>
  }, jsx:encode(lists:map(
    fun (It) -> #{id => It#order.id} end,
    Orders)), Req0),
  {ok, Req, State}.

cart_id(Req0) ->
  Based64CardID = cowboy_req:header(<<"x-onecart-cid">>, Req0),
  io:format("Based64CardID: ~p~n", [Based64CardID]),
  decrypt_cartid(base64:decode(Based64CardID)).

encrypt_cartid(CartID) ->
  {ok, RsaPublicPem} = application:get_env(onecart, rsa_public),
  io:format("RsaPublicPem: ~p~n", [RsaPublicPem]),
  {ok, RawPKey} = file:read_file(RsaPublicPem),

  [EncPKey] = public_key:pem_decode(RawPKey),
  PKey = public_key:pem_entry_decode(EncPKey),
  public_key:encrypt_public(integer_to_binary(CartID), PKey).

decrypt_cartid(EncryptedCartID) ->
  {ok, RsaPrivatePem} = application:get_env(onecart, rsa_private),
  io:format("RsaPrivatePem: ~p~n", [RsaPrivatePem]),
  {ok, RawSKey} = file:read_file(RsaPrivatePem),

  [EncSKey] = public_key:pem_decode(RawSKey),
  SKey = public_key:pem_entry_decode(EncSKey),

  public_key:decrypt_private(EncryptedCartID, SKey).