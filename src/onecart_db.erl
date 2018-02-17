%%%-------------------------------------------------------------------
%%% @author khanhhua
%%% @copyright (C) 2018, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 13. Feb 2018 10:10 PM
%%%-------------------------------------------------------------------
-module(onecart_db).
-author("khanhhua").

-behaviour(gen_server).
-include("records.hrl").
%% API
-export([start_link/0]).
-export([get_products/2, get_orders/2, create_cart/1, get_cart/2, update_cart/3]).

%% gen_server callbacks
-export([init/1,
  handle_call/3,
  handle_cast/2,
  handle_info/2,
  terminate/2,
  code_change/3]).

-define(SERVER, ?MODULE).
-define(CART_TABLE, 'tbl_cart').

-record(state, {}).

%%%===================================================================
%%% API
%%%===================================================================

get_products(AppID, Params) ->
  Products = [
    #product{id = <<"P00001">>, name = <<"Shampoo Clear">>},
    #product{id = <<"P00002">>, name = <<"Tide Pod">>}
  ],

  {ok, Products}.

get_orders(AppID, Params) -> {ok, []}.

%%--------------------------------------------------------------------
%% @doc
%% Create a new cart
%%
%% @end
%%--------------------------------------------------------------------
-spec(create_cart(AppID :: term()) ->
  {ok, CartID :: term()} | {error, Reason :: term()}).
create_cart(AppID) ->
  gen_server:call(?SERVER, {create_cart, AppID}).

get_cart(AppID, CartID) ->
  gen_server:call(?SERVER, {get_cart, AppID, CartID}).

update_cart(AppID, CartID, ItemsToUpdate) ->
  gen_server:call(?SERVER, {update_cart, AppID, CartID, ItemsToUpdate}).
%%--------------------------------------------------------------------
%% @doc
%% Starts the server
%%
%% @end
%%--------------------------------------------------------------------
-spec(start_link() ->
  {ok, Pid :: pid()} | ignore | {error, Reason :: term()}).
start_link() ->
  gen_server:start_link({local, ?SERVER}, ?MODULE, [], []).

%%%===================================================================
%%% gen_server callbacks
%%%===================================================================

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Initializes the server
%%
%% @spec init(Args) -> {ok, State} |
%%                     {ok, State, Timeout} |
%%                     ignore |
%%                     {stop, Reason}
%% @end
%%--------------------------------------------------------------------
-spec(init(Args :: term()) ->
  {ok, State :: #state{}} | {ok, State :: #state{}, timeout() | hibernate} |
  {stop, Reason :: term()} | ignore).
init([]) ->
  io:format("Initializing onecart_db...~n"),

  {ok, DataDir} = application:get_env(onecart, data_dir),
  {ok, cart} = dets:open_file(cart, [
    {keypos, #cart.id},
    {file, filename:join(DataDir, "cart.dat")}
  ]),

  {ok, #state{}}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Handling call messages
%%
%% @end
%%--------------------------------------------------------------------
-spec(handle_call(Request :: term(), From :: {pid(), Tag :: term()},
    State :: #state{}) ->
  {reply, Reply :: term(), NewState :: #state{}} |
  {reply, Reply :: term(), NewState :: #state{}, timeout() | hibernate} |
  {noreply, NewState :: #state{}} |
  {noreply, NewState :: #state{}, timeout() | hibernate} |
  {stop, Reason :: term(), Reply :: term(), NewState :: #state{}} |
  {stop, Reason :: term(), NewState :: #state{}}).
handle_call({create_cart, AppID}, _From, State) ->
  CartID = rand:uniform(1000000),

  case dets:insert_new(cart, #cart{id = CartID, appid = AppID, items = []}) of
    true -> {reply, {ok, CartID}, State};
    {error, Reason} -> {reply, {error, Reason}, State}
  end;
handle_call({get_cart, AppID, CartID}, _From, State) ->
  case dets:lookup(cart, CartID) of
    [Cart] -> {reply, {ok, Cart}, State};
    Anything ->
      io:format("Anything: ~p", [Anything]),
      {reply, {error, "Could not find cart"}, State}
  end;
handle_call({update_cart, AppID, CartID, ItemsToUpdate}, _Frome, State) ->
  case dets:lookup(cart, CartID) of
    [Cart] ->
      UpdatedCart = Cart#cart{items = lists:ukeymerge(#order_item.product, ItemsToUpdate, Cart#cart.items)},
      case dets:insert(cart, UpdatedCart) of
        ok -> {reply, {ok, UpdatedCart}, State};
        {error, Reason} -> {reply, {error, Reason}, State}
      end;
    Anything ->
      io:format("Anything: ~p", [Anything]),
      {reply, {error, "Could not find cart"}, State}
  end;
handle_call(_Request, _From, State) ->
  {reply, ok, State}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Handling cast messages
%%
%% @end
%%--------------------------------------------------------------------
-spec(handle_cast(Request :: term(), State :: #state{}) ->
  {noreply, NewState :: #state{}} |
  {noreply, NewState :: #state{}, timeout() | hibernate} |
  {stop, Reason :: term(), NewState :: #state{}}).
handle_cast(_Request, State) ->
  {noreply, State}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Handling all non call/cast messages
%%
%% @spec handle_info(Info, State) -> {noreply, State} |
%%                                   {noreply, State, Timeout} |
%%                                   {stop, Reason, State}
%% @end
%%--------------------------------------------------------------------
-spec(handle_info(Info :: timeout() | term(), State :: #state{}) ->
  {noreply, NewState :: #state{}} |
  {noreply, NewState :: #state{}, timeout() | hibernate} |
  {stop, Reason :: term(), NewState :: #state{}}).
handle_info(_Info, State) ->
  {noreply, State}.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% This function is called by a gen_server when it is about to
%% terminate. It should be the opposite of Module:init/1 and do any
%% necessary cleaning up. When it returns, the gen_server terminates
%% with Reason. The return value is ignored.
%%
%% @spec terminate(Reason, State) -> void()
%% @end
%%--------------------------------------------------------------------
-spec(terminate(Reason :: (normal | shutdown | {shutdown, term()} | term()),
    State :: #state{}) -> term()).
terminate(_Reason, _State) ->
  dets:close(cart),
  ok.

%%--------------------------------------------------------------------
%% @private
%% @doc
%% Convert process state when code is changed
%%
%% @spec code_change(OldVsn, State, Extra) -> {ok, NewState}
%% @end
%%--------------------------------------------------------------------
-spec(code_change(OldVsn :: term() | {down, term()}, State :: #state{},
    Extra :: term()) ->
  {ok, NewState :: #state{}} | {error, Reason :: term()}).
code_change(_OldVsn, State, _Extra) ->
  {ok, State}.

%%%===================================================================
%%% Internal functions
%%%===================================================================
