<template>
  <el-menu router default-active="/">
    <el-menu-item index="/">首页</el-menu-item>

    <el-sub-menu index="1">
      <template #title>数据同步</template>
      <el-menu-item index="/sync/all">全量同步</el-menu-item>
      <el-menu-item index="/sync/single">单只股票更新</el-menu-item>
    </el-sub-menu>

    <!-- <el-menu-item index="/golden">金叉图生成</el-menu-item> -->
    <el-sub-menu index="2">
      <template #title>低位信号监控</template>
      <el-menu-item index="/low">批量分析</el-menu-item>
      <el-menu-item index="/low-result">结果展示</el-menu-item>
      <el-menu-item index="/watched-stocks">关注列表</el-menu-item>
      <el-menu-item index="/etf-page">ETF页面</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="3">
      <template #title>分区信息</template>
      <el-menu-item index="/boards">板块信息</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>
