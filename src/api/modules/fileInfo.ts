import http from "@/api";
// 文件-形式审查-分页查询
export const fileInfoList = params => {
  return http.get("/fileInfo/list", params, { loading: false });
};
///fileController/cert/list
export const fileControllerCertList = params => {
  return http.get("/fileController/cert/list", params, { loading: false });
};
//件-回收-查询列表
export const fileControllerRecycleList = params => {
  return http.get("/fileController/recycle/list", params, { loading: false });
};
//文件-销毁-查询列表
export const fileControllerDestroyList = params => {
  return http.get("/fileController/destroy/list", params, { loading: false });
};
//
//文件-遗失-查询列表
export const fileControllerLoseList = params => {
  return http.get("/fileController/lose/list", params, { loading: false });
};
