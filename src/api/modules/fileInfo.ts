import http from "@/api";
import { useUserStore } from "@/stores/modules/user";
const userStore = useUserStore();
// 文件-形式审查-分页查询
export const fileInfoList = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/fileInfo/list", pa, { loading: false });
};
///fileController/cert/list
export const fileControllerCertList = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/fileController/cert/list", pa, { loading: false });
};
//件-回收-查询列表
export const fileControllerRecycleList = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/fileController/recycle/list", pa, { loading: false });
};
//文件-销毁-查询列表
export const fileControllerDestroyList = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/fileController/destroy/list", pa, { loading: false });
};
//
//文件-遗失-查询列表
export const fileControllerLoseList = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/fileController/lose/list", pa, { loading: false });
};
