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
