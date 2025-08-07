<template>
  <el-menu router default-active="/">
    <el-menu-item index="/">首页</el-menu-item>

    <el-sub-menu index="1">
      <template #title>数据同步</template>
      <el-menu-item index="/sync/all">全量同步</el-menu-item>
      <el-menu-item index="/sync/single">单只股票更新</el-menu-item>
    </el-sub-menu>

    <el-menu-item index="/golden">金叉图生成</el-menu-item>
    <el-menu-item index="/low">低位信号监控</el-menu-item>
    <el-menu-item index="/pool">股票池管理</el-menu-item>
    <el-menu-item index="/volume">成交量 & 资金流向</el-menu-item>
  </el-menu>
</template>
