<template>
  <el-card>
    <div
      class="header"
      style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;
      "
    >
      <h3>板块列表（{{ boards.length }}）</h3>
      <el-button
        type="primary"
        @click="fetchBoards"
        :loading="loading"
        size="small"
        >刷新板块</el-button
      >
    </div>
    <el-row :gutter="20">
      <el-col
        :span="6"
        style="
          max-height: 500px;
          overflow-y: auto;
          border-right: 1px solid #ebeef5;
        "
      >
        <el-button-group
          style="display: flex; flex-direction: column; width: 100%"
        >
          <el-button
            v-for="board in boards"
            :key="board.板块名称"
            :type="board.板块名称 === selectedBoard ? 'primary' : 'default'"
            @click="handleSelect(board.板块名称)"
            style="text-align: left; width: 100%; margin-bottom: 5px"
          >
            {{ board.板块名称 }}
          </el-button>
        </el-button-group>
      </el-col>

      <el-col :span="18">
        <el-table
          :data="members"
          stripe
          border
          style="width: 100%"
          height="500"
          v-if="members.length > 0"
        >
          <el-table-column prop="代码" label="代码" width="120" />
          <el-table-column prop="名称" label="名称" width="180" />
          <el-table-column prop="最新价" label="最新价" width="120" />
          <el-table-column label="涨跌幅(%)" sortable width="120">
            <template #default="{ row }">
              <span
                :style="{
                  color:
                    row?.涨跌幅 > 0
                      ? 'green'
                      : row?.涨跌幅 < 0
                      ? 'red'
                      : 'black',
                }"
              >
                {{ Number(row.涨跌幅).toFixed(2) }}
              </span>
            </template>
          </el-table-column>
        </el-table>

        <el-empty v-else description="暂无成分股数据" />
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import { ref, onMounted } from "vue";
import request from "@request";
import { ElMessage } from "element-plus";
import { get_boards, get_board_members } from "@url"; // 你可以自己定义这两个接口路径

const boards = ref([]);
const members = ref([]);
const selectedBoard = ref(null);
const loading = ref(false);

const fetchBoards = async () => {
  loading.value = true;
  try {
    const res = await request({ url: get_boards, method: "get" });
    if (res.code === 0) {
      boards.value = res.data || [];
      if (boards.value.length > 0) {
        selectedBoard.value = boards.value[0].板块名称;
        fetchMembers(selectedBoard.value);
      }
    } else {
      ElMessage.error(res.message || "获取板块失败");
    }
  } catch (error) {
    ElMessage.error(error.message || "请求异常");
  } finally {
    loading.value = false;
  }
};

const fetchMembers = async (boardName) => {
  try {
    members.value = [];
    let res = await request({
      url: get_board_members,
      method: "post",
      data: { boardName },
    });
    if (res.code === 0) {
      members.value = res.data || [];
      console.log("members===>", members.value);
    } else {
      ElMessage.error(res.message || "获取成分股失败");
      members.value = [];
    }
  } catch (error) {
    ElMessage.error(error.message || "请求异常");
    members.value = [];
  }
};

const handleSelect = (key) => {
  selectedBoard.value = key;
  fetchMembers(key);
};

onMounted(() => {
  fetchBoards();
});
</script>

<style scoped>
.board-menu {
  border-right: none;
}
</style>
