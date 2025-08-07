<template>
  <div class="sync-all">
    <el-space wrap>
      <el-button
        type="primary"
        :loading="loading"
        :disabled="taskRunning"
        @click="startTask"
      >
        启动任务
      </el-button>
      <el-button @click="checkStatus" :loading="loading"> 查询进度 </el-button>
      <el-button
        type="danger"
        :disabled="false"
        :loading="loading"
        @click="stopTask"
      >
        停止任务
      </el-button>
    </el-space>

    <el-card v-if="statusMessage" class="status-card" shadow="hover">
      <p><strong>任务状态：</strong>{{ taskRunning ? "运行中" : "未运行" }}</p>
      <p><strong>进度：</strong>{{ progress }} / {{ total }}</p>
      <p><strong>已更新条数：</strong>{{ updated }}</p>
      <p><strong>详情：</strong>{{ statusMessage }}</p>
    </el-card>

    <el-alert
      v-if="error"
      class="error-alert"
      title="错误"
      type="error"
      :closable="false"
      description="错误信息: {{ error }}"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import request from "@request"; // 你项目的封装请求库
import { sync_all_start, sync_all_status, sync_all_stop } from "@url"; // 你项目中接口url

const taskRunning = ref(false);
const progress = ref(0);
const total = ref(0);
const updated = ref(0);
const statusMessage = ref("");
const error = ref("");
const loading = ref(false);

const startTask = async () => {
  error.value = "";
  loading.value = true;
  try {
    const res = await request({
      url: sync_all_start,
      method: "post",
    });
    if (res.code === 0) {
      statusMessage.value = res.message || "任务已启动";
      taskRunning.value = true;
      await checkStatus();
    } else {
      ElMessage.error(res.message || "启动任务失败");
    }
  } catch (e) {
    ElMessage.error(e.message || "启动任务失败");
  } finally {
    loading.value = false;
  }
};

const checkStatus = async () => {
  error.value = "";
  loading.value = true;
  try {
    const res = await request({
      url: sync_all_status,
      method: "get",
    });
    if (res.code === 0) {
      taskRunning.value = res.running;
      progress.value = res.progress || 0;
      total.value = res.total || 0;
      updated.value = res.updated || 0;
      statusMessage.value = res.message || "";
    } else {
      error.value = res.message || "查询状态失败";
    }
  } catch (e) {
    error.value = e.message || "查询状态失败";
  } finally {
    loading.value = false;
  }
};

const stopTask = async () => {
  error.value = "";
  loading.value = true;
  try {
    const res = await request({
      url: sync_all_stop,
      method: "post",
    });
    if (res.code === 0) {
      statusMessage.value = res.message || "停止请求已发送";
      taskRunning.value = false;
    } else {
      ElMessage.error(res.message || "停止任务失败");
    }
  } catch (e) {
    ElMessage.error(e.message || "停止任务失败");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.sync-all {
  padding: 24px;
}

.status-card {
  margin-top: 24px;
  font-size: 1rem;
  line-height: 1.6;
}

.error-alert {
  margin-top: 20px;
}
</style>
