const domain = import.meta.env.VITE_API_BASE_URL;

// 获取股票总个数
export const stocks_count = domain + "/stocks/count";

// 获取股票列表信息
export const stocks_list = domain + "/stocks/list";

// 单个股票数据更新
export const stocks_update_code = domain + "/stocks/asyncCode";

// 全量更新 - 启动同步任务
export const sync_all_start = domain + "/sync/all-start";

// 全量更新 - 查询同步任务进度
export const sync_all_status = domain + "/sync/all-status";

// 全量更新 - 停止同步任务
export const sync_all_stop = domain + "/sync/all-stop";

// 金叉图生成
export const golden_cross = domain + "/golden_cross";

export const analyze_batch = domain + "/analyze-batch";

export const analyze_result = domain + "/analyze_batch_data";

export const history_cache_count = domain + "/history_cache_count";

export const low_price_stocks = domain + "/low-price-stocks";

export const list_low_price_stock_files =
  domain + "/list_low_price_stock_files";

export const is_fund_inflow_continuous = domain + "/is_fund_inflow_continuous";

export const update_margin_data = domain + "/update_margin_data";

export const add_to_watchlist = domain + "/watchlist/add";
export const remove_from_watchlist = domain + "/watchlist/remove";

export const get_watched_stocks = domain + "/get_watched_stocks";
export const query_margin_data_by_code = domain + "/query_margin_data_by_code";

export const get_boards = domain + "/boards";
export const get_board_members = domain + "/get_board_members";

export const get_margin_stocks = domain + "/get_margin_stocks";

export const query_latest_main_stock_holder =
  domain + "/query_latest_main_stock_holder";
