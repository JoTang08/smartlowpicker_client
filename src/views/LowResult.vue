<template>
  <div class="low-result">
    <el-card>
      <template #header>
        <div class="header">
          <el-form
            :inline="true"
            class="demo-form-inline"
            label-width="80px"
            size="large"
          >
            <el-form-item label="分析周期">
              <el-select
                v-model="selectedDays"
                style="width: 240px"
                @change="fetchLowPriceStocks"
              >
                <el-option
                  v-for="option in availableDays"
                  :key="option"
                  :label="`${option} 天`"
                  :value="option"
                />
              </el-select>
            </el-form-item>
          </el-form>
          <span>低价股票列表（共 {{ count }} 条）</span>
        </div>
      </template>

      <el-table
        v-loading="loading"
        :data="data"
        style="width: 100%"
        stripe
        border
        height="600"
      >
        <el-table-column type="index" label="序号" width="80" />
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
        <el-table-column label="操作" width="280">
          <template #default="{ row }">
            <el-button type="success" size="small" @click="addToWatchlist(row)">
              关注
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="removeFromWatchlist(row.股票代码)"
            >
              取关
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty
        v-if="!data.length && !loading"
        description="暂无数据"
        style="margin-top: 40px"
      />

      <!-- 资金流入结果弹窗 -->
      <el-dialog title="资金流入情况" :visible.sync="showDialog" width="400px">
        <div v-if="selectedFundInfo">
          <p><strong>股票代码：</strong>{{ selectedFundInfo.code }}</p>
          <p>
            <strong>资金持续流入：</strong>
            <el-tag :type="selectedFundInfo.fund_inflow ? 'success' : 'info'">
              {{ selectedFundInfo.fund_inflow ? "是" : "否" }}
            </el-tag>
          </p>
          <p>
            <strong>净流入额：</strong>{{ selectedFundInfo.net_inflow_amount }}
          </p>
          <p>
            <strong>融资余额变动百分比：</strong>
            {{ selectedFundInfo.financing_balance_change_pct.toFixed(2) }}%
          </p>
          <p v-if="selectedFundInfo.error" style="color: red">
            错误信息: {{ selectedFundInfo.error }}
          </p>
        </div>
        <div v-else>加载中...</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="showDialog = false">关闭</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
import request from "@request";
import {
  low_price_stocks,
  list_low_price_stock_files,
  is_fund_inflow_continuous,
  add_to_watchlist,
  remove_from_watchlist,
} from "@url";

// 新增单个资金流入接口地址
const fund_inflow_api = is_fund_inflow_continuous;

const data = ref([]);
const count = ref(0);
const loading = ref(false);
const availableDays = ref([]);
const selectedDays = ref(null);

const showDialog = ref(false);
const selectedFundInfo = ref(null);

const fetchAvailableDays = async () => {
  try {
    const res = await request({
      url: list_low_price_stock_files,
      method: "get",
    });
    if (res.code === 0) {
      availableDays.value = res.options || [];
      selectedDays.value = availableDays.value[0] || null;
      if (selectedDays.value !== null) {
        fetchLowPriceStocks();
      }
    } else {
      ElMessage.error(res.message || "获取周期选项失败");
    }
  } catch (error) {
    ElMessage.error(error.message || "请求周期失败");
  }
};

const fetchLowPriceStocks = async () => {
  if (!selectedDays.value) return;
  loading.value = true;
  try {
    const res = await request({
      url: `${low_price_stocks}?days=${selectedDays.value}`,
      method: "get",
    });
    if (res.code === 0) {
      data.value = res.data || [];
      count.value = res.count || 0;
    } else {
      ElMessage.error(res.message || "获取低价股票数据失败");
    }
  } catch (error) {
    ElMessage.error(error.message || "请求失败");
  } finally {
    loading.value = false;
  }
};

// 添加到关注列表
const addToWatchlist = async (row) => {
  try {
    const res = await request({
      url: add_to_watchlist,
      method: "post",
      data: {
        code: row.股票代码,
        name: row.股票名称,
      },
    });
    if (res.code === 0) {
      ElMessage.success("已添加到关注列表");
    } else {
      ElMessage.error(res.message || "添加失败");
    }
  } catch (error) {
    ElMessage.error(error.message || "添加失败");
  }
};

// 从关注列表移除
const removeFromWatchlist = async (code) => {
  try {
    const res = await request({
      url: remove_from_watchlist,
      method: "post",
      data: { code },
    });
    if (res.code === 0) {
      ElMessage.success("已从关注列表移除");
    } else {
      ElMessage.error(res.message || "移除失败");
    }
  } catch (error) {
    ElMessage.error(error.message || "移除失败");
  }
};

onMounted(() => {
  fetchAvailableDays();
});
</script>

<style scoped>
.low-result {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
