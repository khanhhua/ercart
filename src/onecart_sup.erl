%%%-------------------------------------------------------------------
%% @doc onecart top level supervisor.
%% @end
%%%-------------------------------------------------------------------

-module(onecart_sup).

-behaviour(supervisor).

%% API
-export([start_link/0]).

%% Supervisor callbacks
-export([init/1]).

-define(SERVER, ?MODULE).

%%====================================================================
%% API functions
%%====================================================================

start_link() ->
  supervisor:start_link({local, ?SERVER}, ?MODULE, []).

%%====================================================================
%% Supervisor callbacks
%%====================================================================

%% Child :: {Id,StartFunc,Restart,Shutdown,Type,Modules}
init([]) ->
  {ok, { {one_for_all, 0, 1}, [
    { onecart_db, {onecart_db, start_link, []}, permanent, brutal_kill, worker, [] },
    { onecart_paypal, {onecart_paypal, start_link, []}, permanent, brutal_kill, worker, [] }
  ]} }.

%%====================================================================
%% Internal functions
%%====================================================================
