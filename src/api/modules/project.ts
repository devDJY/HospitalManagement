import http from "@/api";
import { useUserStore } from "@/stores/modules/user";
const userStore = useUserStore();
// 文件-形式审查-分页查询
export const projectList = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/project/list", pa, { loading: false });
};
// 锁库
export const projectLock = params => {
  return http.post("/project/lock", params, { loading: false });
};
// 删除
export const projectDelete = params => {
  return http.post("/project/delete", params, { loading: false });
};
// 授权列表
export const projectAuthorizeList = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/project/authorize/list", pa, { loading: false });
};
//项目-转移权限-分页查询
export const projectMoveAuthList = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/project/moveAuth/list", pa, { loading: false });
};
///项目-转移权限-查询可向哪些人转移
export const projectMoveAuthUserQuery = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/project/moveAuth/user/query", pa, { loading: false });
};
//项目-添加项目查询审查员
export const projectQueryManager = params => {
  return http.get("/project/query/manager", params, { loading: false });
};
//项目-添加项目查询审查员
export const projectAdd = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/project/add", pa, { loading: false });
};
//编辑项目
export const projectUpdate = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/project/update", pa, { loading: false });
};

//项目 - 项目授权详情 - 分页查询;
export const projectAuthorizeUser = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/project/authorize/user", pa, { loading: false });
};
//项目-项目授权详情-添加用户授权
export const projectAuthorizeUserAdd = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/project/authorize/user/add", pa, { loading: false });
};
//项目-项目授权详情-移除用户授权
export const projectAuthorizeUserDelete = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/project/authorize/user/delete", pa, { loading: false });
};
//项目 - 转移权限 - 转移;
export const projectMoveAuthMove = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/project/moveAuth/move", pa, { loading: false });
};
