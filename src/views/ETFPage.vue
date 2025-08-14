<template>
  <el-card>
    <div
      class="header"
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      "
    >
      <h3>ETF 列表（{{ etfList.length }}）</h3>
      <div style="display: flex; gap: 8px; align-items: center">
        <el-input
          v-model="keyword"
          placeholder="输入关键词"
          size="small"
          @keyup.enter="fetchETF"
          style="width: 200px"
        />
        <el-button
          type="primary"
          @click="fetchETF"
          :loading="loading"
          size="small"
          >查询</el-button
        >
      </div>
    </div>

    <el-table
      :data="etfList"
      stripe
      border
      style="width: 100%"
      height="500"
      v-if="etfList.length > 0"
    >
      <el-table-column prop="标的证券简称" label="名称" width="200" />
      <el-table-column prop="标的证券代码" label="代码" width="120" />
      <el-table-column label="操作" width="220">
        <template #default="{ row }">
          <el-button
            type="success"
            size="small"
            @click="showCachedMarginData(row.标的证券代码)"
          >
            查看数据
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-else description="暂无数据" />
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
  </el-card>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import request from "@request";
import { ElMessage } from "element-plus";
import { get_margin_stocks, query_margin_data_by_code } from "@url";

const etfList = ref([]);
const keyword = ref("ETF"); // 默认值为ETF
const loading = ref(false);

// 获取ETF列表
const fetchETF = async () => {
  if (!keyword.value) {
    ElMessage.warning("请输入关键词");
    return;
  }

  loading.value = true;
  try {
    const res = await request({
      url: get_margin_stocks, // 后端POST接口
      method: "post",
      data: { keyword: keyword.value },
    });

    if (res.code === 0 && res.data) {
      etfList.value = res.data || [];
    } else {
      etfList.value = [];
      ElMessage.warning("暂无数据");
    }
  } catch (error) {
    ElMessage.error(error.message || "请求异常");
  } finally {
    loading.value = false;
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

const showDialog = ref(false);
const dialogData = ref(null);
const csvText = computed(() => {
  if (!dialogData.value || !Array.isArray(dialogData.value)) return "无数据";
  return jsonToCsv(dialogData.value);
});

const showCachedMarginData = async (code) => {
  dialogData.value = null;
  showDialog.value = true;
  try {
    const res = await request({
      url: query_margin_data_by_code,
      method: "post",
      data: { code: String(code) },
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
  fetchETF();
});
</script>

<style scoped>
.header {
  font-weight: bold;
}
</style>
