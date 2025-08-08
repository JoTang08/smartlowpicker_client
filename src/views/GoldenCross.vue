<template>
  <div class="golden-cross">
    <el-card>
      <el-form :inline="true" label-width="100px" @submit.prevent>
        <el-form-item label="股票代码">
          <el-input v-model="code" placeholder="请输入股票代码" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchGoldenCross"
            >查询金叉</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>

    <el-divider>金叉图表</el-divider>

    <v-chart v-if="option" class="chart" :option="option" autoresize />

    <el-divider>金叉数据表格</el-divider>

    <el-table
      v-if="goldenCrossData.length > 0"
      :data="goldenCrossData"
      style="width: 100%"
      stripe
      border
    >
      <el-table-column prop="date" label="日期" width="120" />
      <el-table-column prop="close" label="收盘价" width="100" />
      <el-table-column prop="DIF" label="DIF" width="100" />
      <el-table-column prop="DEA" label="DEA" width="100" />
    </el-table>

    <el-empty
      v-else
      description="暂无金叉数据"
      :image-size="120"
      style="margin-top: 40px"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import request from "@request";
import { golden_cross } from "@url";

const code = ref("");
const goldenCrossData = ref([]);
const option = ref(null);

const fetchGoldenCross = async () => {
  if (!code.value) {
    ElMessage.warning("请输入股票代码");
    return;
  }

  try {
    const res = await request({
      url: golden_cross,
      method: "get",
      params: {
        code: code.value,
      },
    });

    if (res.code === 0) {
      goldenCrossData.value = res.data;
      if (res.data.length === 0) {
        ElMessage.info("近半年没有金叉数据");
        option.value = null;
        return;
      }

      buildChart(res.data);
    } else {
      ElMessage.error(res.message || "获取失败");
    }
  } catch (err) {
    ElMessage.error(err.message || "请求出错");
  }
};

function buildChart(data) {
  const dates = data.map((item) => item.date);
  const difs = data.map((item) => item.DIF);
  const deas = data.map((item) => item.DEA);

  // 金叉点（用 scatter 标记）
  const goldenPoints = data.map((item, idx) => ({
    value: [item.date, item.DIF],
    symbol: "triangle",
    symbolRotate: 0,
    symbolSize: 12,
    itemStyle: { color: "red" },
  }));

  option.value = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["DIF", "DEA", "金叉"],
    },
    xAxis: {
      type: "category",
      data: dates,
      axisLabel: {
        rotate: 45,
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "DIF",
        type: "line",
        data: difs,
        smooth: true,
      },
      {
        name: "DEA",
        type: "line",
        data: deas,
        smooth: true,
      },
      {
        name: "金叉",
        type: "scatter",
        data: goldenPoints,
      },
    ],
  };
}
</script>

<style scoped>
.golden-cross {
  padding: 20px;
}
.chart {
  height: 400px;
  width: 100%;
  margin-bottom: 30px;
}
</style>
