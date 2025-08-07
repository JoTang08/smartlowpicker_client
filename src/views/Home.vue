<template>
  <div>
    <el-card shadow="hover">
      <h2>👋 欢迎使用 Labubu数据分析后台系统</h2>
      <p>您当前使用的是[低吸型投资策略]支持系统</p>
    </el-card>

    <el-divider>系统概览</el-divider>

    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div>股票总数</div>
          <h3>{{ stockCount }}</h3>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div>最近一次同步</div>
          <h3>{{ lastSyncTime }}</h3>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div>低位信号股票</div>
          <h3>{{ lowSignalCount }}</h3>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div>我的关注股票池</div>
          <h3>{{ watchlistCount }}</h3>
        </el-card>
      </el-col>
    </el-row>

    <el-divider>快捷入口</el-divider>

    <el-row :gutter="16">
      <el-col :span="6">
        <el-button type="primary" @click="go('/sync/all')" block
          >🔄 数据同步</el-button
        >
      </el-col>
      <el-col :span="6">
        <el-button type="success" @click="go('/low')" block
          >📉 低位信号</el-button
        >
      </el-col>
      <el-col :span="6">
        <el-button type="warning" @click="go('/pool')" block
          >📦 股票池管理</el-button
        >
      </el-col>
      <el-col :span="6">
        <el-button type="info" @click="go('/volume')" block
          >💰 成交量分析</el-button
        >
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from "vue";
import { useRouter } from "vue-router";
import request from "@request";
import { stocks_count } from "@url";

const stockCount = ref(0);
const lastSyncTime = ref("2025-07-29 22:11");
const fetchStocksCount = async () => {
  try {
    const res = await request({
      url: stocks_count,
      method: "get",
    });
    console.log("stock数量", res);
    if (res.code == 200) {
      stockCount.value = res.stock_count;
    }
  } catch (err) {
    console.error("获取stock数量失败", err);
  }
};
onBeforeMount(() => {
  fetchStocksCount();
});
const lowSignalCount = ref(12);
const watchlistCount = ref(38);

const router = useRouter();
const go = (path) => {
  router.push(path);
};
</script>
