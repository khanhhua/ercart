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

  {ok, RsaPublicPem} = application:get_env(onecart, rsa_public),
  io:format("RsaPublicPem: ~p~n", [RsaPublicPem]),
  {ok, RawPKey} = file:read_file(RsaPublicPem),
  [EncPKey] = public_key:pem_decode(RawPKey),
  PKey = public_key:pem_entry_decode(EncPKey),

  {ok, RsaPrivatePem} = application:get_env(onecart, rsa_private),
  io:format("RsaPrivatePem: ~p~n", [RsaPrivatePem]),
  {ok, RawSKey} = file:read_file(RsaPrivatePem),
  [EncSKey] = public_key:pem_decode(RawSKey),
  SKey = public_key:pem_entry_decode(EncSKey),

  {ok, Salt} = application:get_env(onecart, salt),

  Dispatch = cowboy_router:compile([
    %% {HostMatch, list({PathMatch, Handler, InitialState})}
    {'_', [
      {"/static/demo/[...]", cowboy_static, {priv_dir, onecart, "static/demo"}},
      {"/static/lib/[...]", cowboy_static, {priv_dir, onecart, "static/lib/static"}},
      {"/api/apps", onecart_http, #{resource => 'apps'}},
      {"/:appid/api/cart", onecart_http, #{resource => 'cart', pkey => PKey, skey => SKey}},
      {"/:appid/api/checkout", onecart_http, #{resource => 'checkout'}},
      {"/:appid/api/pay", onecart_http, #{resource => 'pay'}},
      {"/:appid/api/ipn", onecart_http, #{resource => 'ipn', skey => SKey}},
      {"/:appid/api/complete-payment", onecart_http, #{resource => 'complete_payment', skey => SKey}},
      {"/:appid/api/cancel-payment", onecart_http, #{resource => 'cancel_payment', skey => SKey}},
      {"/:appid/api/orders", onecart_http, #{resource => 'orders', hashids_ctx => HashidsContext, pkey => PKey}}
    ]}
  ]),
  %% Name, NbAcceptors, TransOpts, ProtoOpts
  cowboy:start_clear(public_http_listener,
    [{port, 8080}],
    #{env => #{dispatch => Dispatch}}
  ),
  cowboy:start_clear(cpanel_http_listener,
    [{port, 9090}],
    #{env => #{dispatch => cowboy_router:compile([
      %% {HostMatch, list({PathMatch, Handler, InitialState})}
      {'_', [
        {"/api/auth/public-enc-key", onecart_cpanel, #{resource => 'public-enc-key', pkeyraw => RawPKey}},
        {"/api/auth/login", onecart_cpanel, #{action => 'login', pkey => PKey, skey => SKey, salt => Salt}},
        {"/api/products", onecart_cpanel, #{resource => 'products', skey => SKey}},
        {"/api/products/:productid", onecart_cpanel, #{resource => 'products', skey => SKey}},

        {"/assets/[...]", cowboy_static, {priv_dir, onecart, "static/cpanel/assets"}},
        {"/[...]", cowboy_static, {priv_file, onecart, "static/cpanel/index.html"}},
        {"/", cowboy_static, {priv_file, onecart, "static/cpanel/index.html"}}
      ]}
    ])}}
  ),

  onecart_sup:start_link(#{pkey => PKey}).

%%--------------------------------------------------------------------
stop(_State) ->
  ok.

%%====================================================================
%% Internal functions
%%====================================================================
