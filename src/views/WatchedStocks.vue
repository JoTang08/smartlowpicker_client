<template>
  <el-card>
    <div
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      "
    >
      <h3>我的关注股票列表{{ stocks.length }}</h3>
      <el-button
        type="primary"
        @click="fetchMarginData"
        :loading="loading"
        size="small"
      >
        刷新融资融券
      </el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="stocks"
      style="width: 100%"
      stripe
      border
      height="400"
      v-if="stocks.length > 0"
    >
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="股票代码" label="代码" width="120" />
      <el-table-column prop="股票名称" label="名称" width="180" />
      <el-table-column label="操作" width="320">
        <template #default="{ row }">
          <el-button
            type="success"
            size="small"
            @click="showCachedMarginData(row.股票代码)"
          >
            查看融资融券
          </el-button>
          <el-button
            type="primary"
            size="small"
            style="margin-left: 8px"
            @click="showMainStockHolder(row)"
          >
            股东信息
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-else description="暂无关注股票" style="margin-top: 40px" />

    <el-dialog
      title="融资融券数据"
      v-model="showDialog"
      width="600px"
      @close="clearDialogData"
    >
      <pre
        v-if="dialogData"
        style="white-space: pre-wrap; max-height: 400px; overflow-y: auto"
        >{{ csvText }}</pre
      >
      <div v-else style="text-align: center; padding: 20px">暂无数据</div>

      <template #footer>
        <el-button @click="copyCsvToClipboard" size="small">一键复制</el-button>
        <el-button @click="showDialog = false" size="small">关闭</el-button>
      </template>
    </el-dialog>
    <!-- 股东信息弹窗 -->
    <el-dialog
      :title="holderTitle"
      v-model="showHolderDialog"
      width="700px"
      @close="holderData = []"
    >
      <el-table
        v-if="holderData.length"
        :data="holderData"
        style="width: 100%"
        stripe
        border
        max-height="400"
      >
        <el-table-column type="index" label="序号" width="80" />
        <el-table-column prop="股东名称" label="股东名称" />
        <el-table-column prop="股本性质" label="股本性质" />
        <el-table-column
          prop="持股比例"
          sortable
          label="持股比例"
          width="120"
        />
        <el-table-column prop="持股数量" label="持股数量" width="120" />
        <el-table-column prop="公告日期" label="公告日期" width="120" />
      </el-table>
      <div v-else style="text-align: center; padding: 20px">暂无股东数据</div>

      <template #footer>
        <el-button @click="showHolderDialog = false" size="small"
          >关闭</el-button
        >
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import request from "@request";
import { ElMessage } from "element-plus";
import {
  get_watched_stocks,
  update_margin_data,
  query_margin_data_by_code,
  query_latest_main_stock_holder,
} from "@url";

const stocks = ref([]);
const loading = ref(false);
const curCodeName = ref("");
const showDialog = ref(false);
const dialogData = ref(null);

const showHolderDialog = ref(false); // 控制股东信息弹窗
const holderData = ref([]); // 存放股东信息

const fetchWatchedStocks = async () => {
  loading.value = true;
  try {
    const res = await request({
      url: get_watched_stocks,
      method: "get",
    });
    if (res.code === 0) {
      stocks.value = res.data || [];
    } else {
      ElMessage.error(res.message || "获取关注股票失败");
    }
  } catch (error) {
    ElMessage.error(error.message || "请求异常");
  } finally {
    loading.value = false;
  }
};

const fetchMarginData = async (code) => {
  try {
    const res = await request({
      url: update_margin_data,
      method: "post",
      data: { days: 30 },
    });
    if (res.code === 0) {
      ElMessage.success(res.message || "融资融券数据同步成功");
    } else {
      ElMessage.error(res.message || "融资融券数据同步失败");
    }
  } catch (error) {
    ElMessage.error(res.message || "融资融券数据同步失败");
  }
};

const showCachedMarginData = async (code) => {
  dialogData.value = null;
  showDialog.value = true;
  try {
    const res = await request({
      url: query_margin_data_by_code,
      method: "post",
      data: { code },
    });
    if (res.code === 0 && res.data[0]) {
      const data = res.data[0].data;
      dialogData.value = data.length ? data : { info: "无缓存数据" };
    } else {
      dialogData.value = { error: res.message || "查询失败" };
    }
  } catch (error) {
    dialogData.value = { error: error.message || "请求异常" };
  }
};
const jsonToCsv = (data) => {
  if (!Array.isArray(data) || data.length === 0) return "无数据";

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(",")];

  data.forEach((row) => {
    const values = headers.map((h) => {
      const val = row[h] ?? "";
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(","));
  });

  return csvRows.join("\n");
};

const csvText = computed(() => {
  if (!dialogData.value || !Array.isArray(dialogData.value)) return "无数据";
  return jsonToCsv(dialogData.value);
});

const holderTitle = computed(() => {
  return curCodeName.value + "-" + "股东信息";
});

const clearDialogData = () => {
  dialogData.value = null;
};
const showMainStockHolder = async (row) => {
  curCodeName.value = row.股票名称;
  const code = row.股票代码;
  holderData.value = [];
  showHolderDialog.value = true;
  try {
    const res = await request({
      url: query_latest_main_stock_holder,
      method: "post",
      data: { code: String(code) },
    });
    if (res.code === 0) {
      holderData.value = res.data.length ? res.data : [];
    } else {
      ElMessage.error(res.message || "查询失败");
    }
  } catch (error) {
    ElMessage.error(error.message || "请求异常");
  }
};

const copyCsvToClipboard = async () => {
  try {
    if (!csvText.value) {
      ElMessage.warning("无数据可复制");
      return;
    }
    await navigator.clipboard.writeText(csvText.value);
    ElMessage.success("已复制到剪贴板");
  } catch (error) {
    ElMessage.error("复制失败，请手动复制");
  }
};

onMounted(() => {
  fetchWatchedStocks();
});
</script>
