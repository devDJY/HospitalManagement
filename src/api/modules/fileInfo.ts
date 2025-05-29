import http from "@/api";
import { useUserStore } from "@/stores/modules/user";
const userStore = useUserStore();
// 文件-形式审查-分页查询
export const fileInfoList = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/fileInfo/list", pa, { loading: false });
};
//文件-受控-待受控列表
export const fileControllerWaitList = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/fileController/wait/list", pa, { loading: false });
};
//文件 - 受控 - 已使用列表;
export const fileControllerUsedCertList = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/fileController/used/cert/list", pa, { loading: false });
};
//已受控-查询列表
export const fileControllerCertList = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/fileController/cert/list", pa, { loading: false });
};
//已打印：
export const fileControllerPrintCertList = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/fileController/print/cert/list", pa, { loading: false });
};
//已作废
export const fileControllerCancelCertList = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/fileController/cancel/cert/list", pa, { loading: false });
};
//文件-重新打印-查询列表
export const fileControllerRePrintList = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/fileController/rePrint/list", pa, { loading: false });
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
//----- 操作栏部分--------
export const fileControllerCert = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/fileController/cert", pa, { loading: false });
};

//文件 - 文件申请 - 撤回申请;
export const fileInfoRevoke = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/fileInfo/revoke", pa, { loading: false });
};
//文件-形式审查-申请复用-查询申请记录
export const fileInfoGetReuseList = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/fileInfo/getReuseList", pa, { loading: false });
};
//文件 - 形式审查 - 通过 - 使用复用创建文件;
export const fileInfoAddByReuse = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/fileInfo/addByReuse", pa, { loading: false });
};
//文件 - 形式审查 - 通过 - 获取复用状态修改历史;
export const fileInfoReuseGetHistory = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/fileInfo/reuse/getHistory", pa, { loading: false });
};
//文件-形式审查-通过-审批申请禁用/恢复复用
export const fileInfoReviewEditReuse = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/fileInfo/review/edit/reuse", pa, { loading: false });
};
