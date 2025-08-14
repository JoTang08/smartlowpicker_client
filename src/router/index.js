import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import DataSyncAll from "../views/DataSyncAll.vue";
import DataSyncSingle from "../views/DataSyncSingle.vue";
import SectorBoard from "../views/SectorBoard.vue";
import LowSignal from "../views/LowSignal.vue";
import LowResult from "../views/LowResult.vue";
import WatchedStocks from "../views/WatchedStocks.vue";
import ETFPage from "../views/ETFPage.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/sync/all", component: DataSyncAll },
  { path: "/sync/single", component: DataSyncSingle },
  { path: "/boards", component: SectorBoard },
  { path: "/low", component: LowSignal },
  { path: "/low-result", component: LowResult },
  { path: "/watched-stocks", component: WatchedStocks },
  { path: "/etf-page", component: ETFPage },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
