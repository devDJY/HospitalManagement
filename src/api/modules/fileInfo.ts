import http from "@/api";
// 文件-形式审查-分页查询
export const fileInfoList = params => {
  return http.get("/fileInfo/list", params, { loading: false });
};
///fileController/cert/list
export const fileControllerCertList = params => {
  return http.get("/fileController/cert/list", params, { loading: false });
};
