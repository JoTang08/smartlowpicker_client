<!-- src/views/SyncSingle.vue -->
<template>
  <div class="sync-single">
    <el-form :inline="true" label-width="80px" class="form">
      <el-form-item label="股票代码">
        <el-input v-model="code" placeholder="请输入股票代码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :loading="loading" @click="updateStock">
          更新
        </el-button>
      </el-form-item>
    </el-form>

    <div v-if="resultMessage">
      <p class="result-text" v-if="resultMessage">
        更新结果：{{ resultMessage }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import request from "@request";
import { stocks_update_code } from "@url";

const code = ref("");
const resultMessage = ref("");
const loading = ref(false);

const updateStock = async () => {
  if (!code.value) {
    ElMessage.warning("请输入股票代码");
    return;
  }
  loading.value = true;
  resultMessage.value = "";

  try {
    const res = await request({
      url: stocks_update_code,
      method: "post",
      data: {
        code: code.value,
      },
    });
    if (res.code === 0) {
      resultMessage.value = res.message || "更新成功";
    } else {
      ElMessage.error(res.messag || "更新失败");
    }
  } catch (err) {
    ElMessage.error(err.message || "更新失败");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.sync-single {
  padding: 24px;
}

.form {
  margin-bottom: 20px;
}

.result-text {
  margin-top: 16px;
  color: #67c23a; /* Element Plus success 绿色 */
  font-weight: bold;
}
</style>
