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
  Dispatch = cowboy_router:compile([
    %% {HostMatch, list({PathMatch, Handler, InitialState})}
    {'_', [
      {"/:appid/api/cart", onecart_http, #{resource => 'cart'}},
      {"/:appid/api/products", onecart_http, #{resource => 'products'}},
      {"/:appid/api/orders", onecart_http, #{resource => 'orders'}}
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
