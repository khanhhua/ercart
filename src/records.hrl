%%%-------------------------------------------------------------------
%%% @author khanhhua
%%% @copyright (C) 2018, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 13. Feb 2018 10:23 PM
%%%-------------------------------------------------------------------
-author("khanhhua").

-record(app, {id, ownerid, paypal_merchant_id}).
-record(app_stats, {id, last_order_no}).
-record(app_auth, {id, passwd}).
-record(product, {appid_id, name, price}).
-record(cart, {appid_id, items = []}).
-record(order, {appid_id, transactionid, refno, status, items = [], total}).
-record(order_item, {productid, productname, qty, price}).
-record(payment, {paykey, status}).

-define(TO_APPID(AppID_ID), element(1, AppID_ID)).
-define(TO_ID(AppID_ID), element(2, AppID_ID)).
-define(TO_APPID_ID(AppID, ID), {AppID, ID}).

-define(MERGE_RECORD(RecordTag, Dst, Src), lists:foldl(
  fun (Nth, Acc0) ->
    UpdatedValue = if
                     element(Nth, Src) =:= undefined -> element(Nth, Dst);
                     true -> element(Nth, Src)
                   end,

    setelement(Nth, Acc0, UpdatedValue)
  end, Dst, lists:seq(2, record_info(size, RecordTag)))).