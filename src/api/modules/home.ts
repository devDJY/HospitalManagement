import http from "@/api";
import { useUserStore } from "@/stores/modules/user";
const userStore = useUserStore();
// 项目文件受控-管理员首页查询
export const getHomeInfoForManager = params => {
  return http.get("/home/getHomeInfoForManager", params, { loading: true });
};
//项目文件受控-首页查询
export const getHomeInfo = params => {
  return http.get("/home/getHomeInfo", params, { loading: true });
};
//项目文件受控-最新动态-管理员
export const getHomeNews = params => {
  return http.get("/home/getHomeNews", params, { loading: true });
};
//项目文件受控-最新动态
export const getHomeNewsForManager = params => {
  return http.get("/home/getHomeNewsForManager", params, { loading: true });
};
//根据projectId获取项目概况-管理员页面
export const overviewByIdForManager = params => {
  return http.get("/project/overviewByIdForManager", params, { loading: true });
};
//根据projectId获取项目概况;
export const overviewById = params => {
  return http.get("/project/overviewById", params, { loading: true });
};
// 首页-未读消息
export const queryHomeNews = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/home/queryHomeNews", pa, { loading: true });
};
// 站内消息通知-全部标记为已读
export const updateHomeNewsAll = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/home/homeNews/update/all", pa, { loading: true });
};
// 站内消息通知-单个标记为已读
export const updateHomeNews = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/home/homeNews/update", pa, { loading: true });
};
