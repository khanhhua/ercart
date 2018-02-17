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

init(Req0, State = #{resource := Resource}) ->
  AppID = cowboy_req:binding('appid', Req0),
  io:format("AppID: ~p~n", [AppID]),

  {ok, Req, _State} = case Resource of
                        cart -> resource_cart(Req0, State#{appid => AppID});
                        products -> resource_products(Req0, State#{appid => AppID});
                        orders -> resource_orders(Req0, State#{appid => AppID})
                     end,

  {ok, Req, State}.

terminate(_Reason, _Req, _State) ->
  ok.

resource_cart(Req0=#{method := <<"POST">>}, State = #{appid := AppID}) ->
  Headers = #{<<"content-type">> => <<"application/json">>},
  case onecart_db:create_cart(AppID) of
    {ok, CartID} ->
      {ok, cowboy_req:reply(200,
        Headers,
        jsx:encode(#{<<"cid">> => CartID}),
        Req0), State};
    {error, Reason} ->
      {ok, cowboy_req:reply(400,
        Headers,
        jsx:encode(#{<<"error">> => Reason}),
        Req0), State}
  end;
resource_cart(Req0=#{method := <<"PUT">>}, State = #{appid := AppID}) ->
  CardID = cowboy_req:binding(cartid, Req0),
  {ok, Body, _} = cowboy_req:read_body(Req0),
  Data = jsx:decode(Body, [return_maps]),

  ItemsToUpdate = lists:map(
    fun (#{<<"product">> := Product, <<"qty">> := Qty}) ->
      #order_item{product = Product, qty = Qty}
    end, Data),
  io:format("Adding item to cart: ~p Items: ~p", [CardID, ItemsToUpdate]),
  {ok, Cart} = onecart_db:update_cart(AppID, binary_to_integer(CardID), ItemsToUpdate),

  Req = cowboy_req:reply(200, #{
    <<"content-type">> => <<"application/json">>
  }, jsx:encode(
    #{
      <<"cid">> => Cart#cart.id,
      <<"items">> => lists:map(
        fun (It) -> #{product => It#order_item.product, qty => It#order_item.qty} end,
        Cart#cart.items)
    }), Req0),
  {ok, Req, State};
resource_cart(Req0, State = #{appid := AppID}) ->
  CardID = cowboy_req:binding(cartid, Req0),
  case onecart_db:get_cart(AppID, binary_to_integer(CardID)) of
    {ok, Cart} ->
      Req = cowboy_req:reply(200, #{
        <<"content-type">> => <<"application/json">>
      }, jsx:encode(
        #{
          <<"cid">> => Cart#cart.id,
          <<"items">> => lists:map(
            fun (It) -> #{product => It#order_item.product, qty => It#order_item.qty} end,
            Cart#cart.items)
        }), Req0),
      {ok, Req, State};
    {error, Reason} ->
      Req = cowboy_req:reply(400, #{
        <<"content-type">> => <<"application/json">>
      }, jsx:encode(list_to_binary(Reason)), Req0),
      {ok, Req, State}
  end.

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