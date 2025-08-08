import { createRouter, createWebHistory } from "vue-router";

import Home from "../views/Home.vue";
import DataSyncAll from "../views/DataSyncAll.vue";
import DataSyncSingle from "../views/DataSyncSingle.vue";
// import GoldenCross from "../views/GoldenCross.vue";
import LowSignal from "../views/LowSignal.vue";
import LowResult from "../views/LowResult.vue";
// import StockPool from "../views/StockPool.vue";
// import VolumeAnalysis from "../views/VolumeAnalysis.vue";

const routes = [
  { path: "/", component: Home },
  { path: "/sync/all", component: DataSyncAll },
  { path: "/sync/single", component: DataSyncSingle },
  //   { path: "/golden", component: GoldenCross },
  { path: "/low", component: LowSignal },
  { path: "/low-result", component: LowResult },
  //   { path: "/pool", component: StockPool },
  //   { path: "/volume", component: VolumeAnalysis },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
