import http from "@/api";
// 文件-形式审查-分页查询
export const fileInfoList = params => {
  return http.get("/fileInfo/list", params, { loading: false });
};
