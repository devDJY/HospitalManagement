import http from "@/api";
// 项目文件受控-管理员首页查询
export const getHomeInfoForManager = params => {
  return http.get("/home/getHomeInfoForManager", params, { loading: false });
};
//项目文件受控-首页查询
export const getHomeInfo = params => {
  return http.get("/home/getHomeInfo", params, { loading: false });
};
//项目文件受控-最新动态-管理员
export const getHomeNews = params => {
  return http.get("/home/getHomeNews", params, { loading: false });
};
//项目文件受控-最新动态
export const getHomeNewsForManager = params => {
  return http.get("/home/getHomeNewsForManager", params, { loading: false });
};
//根据projectId获取项目概况-管理员页面
export const overviewByIdForManager = params => {
  return http.get("/project/overviewByIdForManager", params, { loading: false });
};
//根据projectId获取项目概况;
export const overviewById = params => {
  return http.get("/project/overviewById", params, { loading: false });
};
