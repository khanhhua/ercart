%%%-------------------------------------------------------------------
%% @doc onecart public API
%% @end
%%%-------------------------------------------------------------------

-module(onecart_app).

-behaviour(application).

%% Application callbacks
-export([start/2, stop/1]).

%%====================================================================
%% API
%%====================================================================

start(_StartType, _StartArgs) ->
  {ok, HashidsSalt} = application:get_env(onecart, hashids_salt),
  HashidsContext = hashids:new([{salt, HashidsSalt}, {min_hash_length, 8}]),

  Dispatch = cowboy_router:compile([
    %% {HostMatch, list({PathMatch, Handler, InitialState})}
    {'_', [
      {"/static/demo/[...]", cowboy_static, {priv_dir, onecart, "static/demo"}},
      {"/static/lib/[...]", cowboy_static, {priv_dir, onecart, "static/lib/onecart-client/build/static"}},
      {"/api/apps", onecart_http, #{resource => 'apps'}},
      {"/:appid/api/cart", onecart_http, #{resource => 'cart'}},
      {"/:appid/api/products", onecart_http, #{resource => 'products'}},
      {"/:appid/api/products/:productid", onecart_http, #{resource => 'products'}},
      {"/:appid/api/checkout", onecart_http, #{resource => 'checkout'}},
      {"/:appid/api/pay", onecart_http, #{resource => 'pay'}},
      {"/:appid/api/complete-payment", onecart_http, #{resource => 'complete_payment'}},
      {"/:appid/api/cancel-payment", onecart_http, #{resource => 'cancel_payment'}},
      {"/:appid/api/orders", onecart_http, #{resource => 'orders', hashids_ctx => HashidsContext}}
    ]}
  ]),
  %% Name, NbAcceptors, TransOpts, ProtoOpts
  cowboy:start_clear(my_http_listener,
    [{port, 8080}],
    #{env => #{dispatch => Dispatch}}
  ),

  onecart_sup:start_link().

%%--------------------------------------------------------------------
stop(_State) ->
  ok.

%%====================================================================
%% Internal functions
%%====================================================================
