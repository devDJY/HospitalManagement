import http from "@/api";
// 项目文件受控-管理员首页查询
export const getHomeInfoForManager = params => {
  return http.get("/home/getHomeInfoForManager", params, { loading: false });
};
//项目文件受控-最新动态-管理员
export const getHomeNews = params => {
  return http.get("/home/getHomeNews", params, { loading: false });
};
