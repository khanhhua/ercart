%%%-------------------------------------------------------------------
%%% @author khanhhua
%%% @copyright (C) 2018, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 13. Feb 2018 10:23 PM
%%%-------------------------------------------------------------------
-author("khanhhua").

-record(product, {id, name}).
-record(order, {id, items = []}).
-record(order_item, {product, qty}).