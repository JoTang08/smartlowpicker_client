<template>
  <el-container style="height: 100vh">
    <!-- 左侧菜单 -->
    <el-aside width="220px">
      <Sidebar />
    </el-aside>

    <!-- 主内容区域 -->
    <el-container>
      <el-header style="background: #f5f5f5; padding: 12px">
        <h2 style="margin: 0">Labubu数据分析后台</h2>
      </el-header>
      <el-main style="padding: 24px">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import Sidebar from "./components/Sidebar.vue";
</script>

<style>
body {
  margin: 0;
  font-family: "Helvetica Neue", Arial, sans-serif;
}
</style>
