import http from "@/api";
import { useUserStore } from "@/stores/modules/user";
const userStore = useUserStore();
//文件 - 受控 - 待受控列表 - 同意受控;
export const fileControllerFileCert = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/fileController/file/cert", pa, { loading: true });
};
//文件 - 受控 - 已受控列表 - 作废;
export const fileControllerCertCancel = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/fileController/cert/cancel", pa, { loading: true });
};
//文件 - 重新打印 - 待审核 - 审批申请;
export const fileControllerRePrintReview = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/fileController/rePrint/review", pa, { loading: true });
};

//文件 - 回收 - 待回收 - 审批申请;
export const fileControllerRecycleReview = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/fileController/recycle/review", pa, { loading: true });
};
//文件 - 销毁 - 待销毁 - 审批申请;
export const fileControllerDestroyReview = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/fileController/destroy/review", pa, { loading: true });
};
//文件 - 遗失 - 待回收 - 审批申请;
export const fileControllerLoseReview = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/fileController/lose/review", pa, { loading: true });
};
//文件 - 受控 - 待受控列表 - 撤销受控;
export const fileControllerFileCertRevert = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/fileController/file/cert/revert", pa, { loading: true });
};

//文件-已打印-已打印列表-更新状态获取可操作文件
export const fileControllerPrintCertGetWaitFile = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/fileController/print/cert/getWaitFile", pa, { loading: true });
};
//文件-受控-已打印-使用登记
export const fileControllerPrintCertUpdateUsed = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/fileController/print/cert/update/used", pa, { loading: true });
};
//文件-受控-已打印-遗失申报
export const fileControllerPrintCertUpdateLose = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/fileController/print/cert/update/lose", pa, { loading: true });
};
//文件 - 受控 - 已打印 - 回收申报;
export const fileControllerPrintCertUpdateRecycle = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/fileController/print/cert/update/recycle", pa, { loading: true });
};
//文件 - 受控 - 已打印 - 重新打印申报;
export const fileControllerPrintCertUpdateRePrint = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/fileController/print/cert/update/rePrint", pa, { loading: true });
};
//文件 - 受控 - 已受控列表 - 获取受控文件pdf;
export const fileControllerPrintCertQueryFile = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/fileController/cert/print/queryFile", pa, { loading: true });
};
// 文件-重新打印-打印次数查询
export const fileControllerRePrintQueryCount = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/fileController/rePrint/queryCount", pa, { loading: true });
};
// 文件-重新打印-打印文件查询
export const fileControllerRePrintQueryFile = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/fileController/rePrint/queryFile", pa, { loading: true });
};
// 文件-形式审查-通过-审批申请禁用/恢复复用
export const fileInfoReviewEditReuse = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/fileInfo/review/edit/reuse", pa, { loading: true });
};
