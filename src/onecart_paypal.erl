%%%-------------------------------------------------------------------
%%% @author khanhhua
%%% @copyright (C) 2018, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 21. Feb 2018 11:45 AM
%%%-------------------------------------------------------------------
-module(onecart_paypal).
-author("khanhhua").

-behaviour(gen_server).
-include("records.hrl").

%% API
-export([start_link/1]).
-export([pay/2]).

%% gen_server callbacks
-export([init/1,
    handle_call/3,
    handle_cast/2,
    handle_info/2,
    terminate/2,
    code_change/3]).

-define(SERVER, ?MODULE).

-record(state, {base_url, appid, userid, password, signature, pkey}).

%%%===================================================================
%%% API
%%%===================================================================

%%--------------------------------------------------------------------
%% @doc
%% Starts the server
%%
%% @end
%%--------------------------------------------------------------------
-spec(start_link(Config :: term()) ->
    {ok, Pid :: pid()} | ignore | {error, Reason :: term()}).
start_link(Config) ->
    gen_server:start_link({local, ?SERVER}, ?MODULE, [Config], []).


pay(App, Order) when is_record(Order, order) ->
  gen_server:call(?SERVER, {pay, App, Order}).

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
init([#{pkey := PKey}]) ->
  {ok, BaseURL} = application:get_env(onecart, base_url),
  {ok, PaypalAppID} = application:get_env(onecart, paypal_appid),
  {ok, UserID} = application:get_env(onecart, paypal_userid),
  {ok, Password} = application:get_env(onecart, paypal_password),
  {ok, Signature} = application:get_env(onecart, paypal_signature),

  io:format("Initializing paypal gen_server (~p)~n", [PaypalAppID]),

  {ok, #state{
    base_url = BaseURL,
    appid = PaypalAppID,
    userid = UserID,
    password = Password,
    signature = Signature,
    pkey = PKey
  }}.

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
handle_call({pay, App, Order}, _From, State=#state{base_url = BaseURL, appid = PaypalAppID, userid = UserID, password = Password, signature = Signature, pkey = PKey}) ->
  Url = <<"https://svcs.sandbox.paypal.com/AdaptivePayments/Pay">>,
  Headers = [
    {<<"X-PAYPAL-SECURITY-USERID">>, UserID},
    {<<"X-PAYPAL-SECURITY-PASSWORD">>, Password},
    {<<"X-PAYPAL-SECURITY-SIGNATURE">>, Signature},
    {<<"X-PAYPAL-APPLICATION-ID">>, PaypalAppID},

    {<<"X-PAYPAL-REQUEST-DATA-FORMAT">>, <<"JSON">>},
    {<<"X-PAYPAL-RESPONSE-DATA-FORMAT">>, <<"JSON">>},
    {<<"Content-Type">>, <<"application/json">>}
  ],

  TxID = public_key:encrypt_public(Order#order.transactionid, PKey),
  TxIDUriEncodedBased64 = http_uri:encode(base64:encode(TxID)),

  Payload = jsx:encode(#{
    actionType => <<"PAY">>,
    currencyCode => <<"SGD">>,
    receiverList => #{
      receiver => [#{
        amount => Order#order.total,
        email => App#app.paypal_merchant_id
      }]
    },
    returnUrl => iolist_to_binary(io_lib:format("~s/~s/api/complete-payment?tx=~s",
        [BaseURL, binary_to_list(App#app.id), binary_to_list(TxIDUriEncodedBased64)])),
    cancelUrl => iolist_to_binary(io_lib:format("~s/~s/api/cancel-payment?tx=~s",
        [BaseURL, binary_to_list(App#app.id), binary_to_list(TxIDUriEncodedBased64)])),
    ipnNotificationUrl => iolist_to_binary(io_lib:format("~s/~s/api/ipn?tx=~s",
        [BaseURL, binary_to_list(App#app.id), binary_to_list(TxIDUriEncodedBased64)])),
    requestEnvelope => #{
      errorLanguage => <<"en_US">>,
      detailLevel => <<"ReturnAll">>
    }
  }),
  case hackney:request(post, Url, Headers, Payload, []) of
    {ok, _StatusCode, _Headers, ClientRef} ->
      {ok, Body} = hackney:body(ClientRef),
      Data = jsx:decode(Body),

      io:format("Body: ~p", [Body]),

      Payment = #payment{
        paykey = proplists:get_value(<<"payKey">>, Data),
        status = proplists:get_value(<<"paymentExecStatus">>, Data)
      },
      {reply, {ok, Payment}, State};
    {error, Reason} ->
      {reply, {error, Reason}, State}
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
