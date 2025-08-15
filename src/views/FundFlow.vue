<template>
  <div>
    <el-card shadow="hover">
      <h2>💹 股票资金流信息</h2>
      <p>
        股票代码：<strong>{{ code }}</strong>
      </p>
    </el-card>

    <el-divider>资金流数据</el-divider>

    <el-table
      v-if="fundFlowData.length"
      :data="fundFlowData"
      border
      stripe
      style="width: 100%"
    >
      <el-table-column
        prop="date"
        label="日期"
        width="160"
        :formatter="(row) => formatDate(row.date)"
      />
      <el-table-column prop="收盘价" label="收盘价" width="100" />
      <el-table-column prop="涨跌幅" label="涨跌幅(%)" width="100" />
      <el-table-column
        prop="主力净流入-净额"
        label="主力净流入(元)"
        width="140"
      />
      <el-table-column
        prop="主力净流入-净占比"
        label="主力占比(%)"
        width="120"
      />
      <el-table-column
        prop="超大单净流入-净额"
        label="超大单净流入(元)"
        width="140"
      />
      <el-table-column
        prop="超大单净流入-净占比"
        label="超大单占比(%)"
        width="140"
      />
      <el-table-column
        prop="大单净流入-净额"
        label="大单净流入(元)"
        width="120"
      />
      <el-table-column
        prop="大单净流入-净占比"
        label="大单占比(%)"
        width="120"
      />
      <el-table-column
        prop="中单净流入-净额"
        label="中单净流入(元)"
        width="120"
      />
      <el-table-column
        prop="中单净流入-净占比"
        label="中单占比(%)"
        width="120"
      />
      <el-table-column
        prop="小单净流入-净额"
        label="小单净流入(元)"
        width="120"
      />
      <el-table-column
        prop="小单净流入-净占比"
        label="小单占比(%)"
        width="120"
      />
      <el-table-column label="资金行为分析" width="300">
        <template #default="scope">
          {{ analyzeFundFlow(scope.row) }}
        </template>
      </el-table-column>
    </el-table>

    <el-empty v-else description="暂无资金流数据"></el-empty>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import request from "@request";
import { query_fund_flow_by_code } from "@url";

const route = useRoute();
const code = ref(route.query.code || ""); // 从url获取code
const fundFlowData = ref([]);

const fetchFundFlow = async () => {
  if (!code.value) return;
  try {
    const res = await request({
      url: query_fund_flow_by_code,
      method: "post",
      data: { code: code.value },
    });
    if (res.code === 0 && res.data) {
      // 这里假设接口返回 data 是数组
      const data = res.data[0].data;
      fundFlowData.value = data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    }
  } catch (err) {
    console.error("获取资金流数据失败", err);
  }
};
// 日期格式化函数
const formatDate = (str) => {
  const d = new Date(str);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
// 分析函数
const analyzeFundFlow = (row) => {
  const {
    "主力净流入-净额": mainFlow,
    "大单净流入-净额": bigFlow,
    "中单净流入-净额": midFlow,
    "小单净流入-净额": smallFlow,
  } = row;

  let reason = "";
  let action = "";

  if (mainFlow > 0) {
    reason += "主力净流入>0，大单同步流入; ";
    action += "主力在买入; ";
  } else if (mainFlow < 0) {
    reason += "主力净流出，大单可能未跟随; ";
    action += "主力在卖出; ";
  } else {
    reason += "主力净流入=0; ";
    action += "主力观望; ";
  }

  if (midFlow + smallFlow > 0) {
    reason += "中小单净流入>0，散户跟进; ";
    action += "散户接盘";
  } else if (midFlow + smallFlow < 0) {
    reason += "中小单净流出>0，散户离场; ";
    action += "散户止盈/观望";
  } else {
    reason += "中小单无明显动作; ";
    action += "散户观望";
  }

  return `【原因】${reason} 【资金行为】${action}`;
};

onMounted(() => {
  fetchFundFlow();
});
</script>
