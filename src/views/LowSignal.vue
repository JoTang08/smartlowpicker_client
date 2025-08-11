<template>
  <div class="analyze-batch">
    <el-card>
      <el-form label-width="80px" @submit.prevent>
        <el-form-item label="总数量">
          <span>{{ stockCount }}</span>
        </el-form-item>

        <el-form-item label="分析时长">
          <el-radio-group v-model="days">
            <el-radio-button label="90" value="90" />
            <el-radio-button label="180" value="180" />
            <el-radio-button label="270" value="270" />
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            :loading="loading"
            @click="handleStart"
            :disabled="false"
          >
            开始分析
          </el-button>

          <el-button type="primary" @click="getResult" :disabled="false">
            获取结果
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-divider>分析结果，共{{ results.length }}条数据</el-divider>
    <el-table
      v-if="results.length"
      :data="results"
      style="width: 100%"
      stripe
      border
      height="600"
    >
      <el-table-column prop="股票代码" label="代码" width="100" />
      <el-table-column prop="股票名称" label="名称" width="150" />
      <el-table-column prop="当前价" label="当前价" width="100" />
      <el-table-column prop="阶段最低" label="最低价" width="120" />
      <el-table-column prop="阶段最高" label="最高价" width="120" />
      <el-table-column
        prop="涨跌幅（%）"
        sortable
        label="涨跌幅（%）"
        width="100"
      />
    </el-table>

    <el-empty v-else description="暂无数据" style="margin-top: 40px" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import request from "@request";
import { analyze_batch, history_cache_count, analyze_result } from "@url";

const days = ref("90");
const stockCount = ref(0);
const results = ref([]);
const loading = ref(false);

async function fetchHistoryCacheCount() {
  try {
    const res = await request({
      url: history_cache_count,
      method: "get",
    });
    if (res.code === 0) {
      stockCount.value = res.count;
    } else {
      ElMessage.error(res.message || "获取缓存文件数失败");
    }
  } catch (error) {
    ElMessage.error(error.message || "请求异常");
  }
}

const handleStart = async () => {
  try {
    const res = await request({
      url: analyze_batch,
      method: "post",
      data: {
        start: 0,
        end: Number(stockCount.value),
        days: Number(days.value),
      },
      timeout: 60000,
    });
    if (res.code === 0) {
      results.value = res.data;
      ElMessage.success(`分析完成，共 ${res.data.length} 条数据`);
    } else {
      ElMessage.error(res.message || "分析失败");
    }
  } catch (error) {
    ElMessage.error(error.message || "请求异常");
  } finally {
    loading.value = false;
  }
};
const getResult = async () => {
  try {
    const res = await request({
      url: analyze_result,
      method: "post",
      data: {
        days: Number(days.value),
      },
    });
    if (res.code === 0) {
      results.value = res.data;
      ElMessage.success(`成功获取结果，共 ${res.data.length} 条`);
    } else {
      ElMessage.error(res.message || "获取结果失败");
    }
  } catch (error) {
    ElMessage.error(error.message || "请求异常");
  }
};

onMounted(() => {
  fetchHistoryCacheCount();
});
</script>

<style scoped>
.analyze-batch {
  padding: 20px;
}
</style>
