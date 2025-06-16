import http from "@/api";
import { useUserStore } from "@/stores/modules/user";
const userStore = useUserStore();
//文件-遗失-查询列表
export const fileControllerLoseList = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/fileController/lose/list", pa, { loading: true });
};
//文件-受控-已作废列表
export const fileControllerCancelCertList = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/fileController/cancel/cert/list", pa, { loading: true });
};
