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
//权限组管理-获取权限组菜单
export const authGroupMenuList = params => {
  return http.get("/authGroup/groupMenu/list", params, { loading: true });
};
//权限组管理 - 分页查询;
export const authGroupList = params => {
  return http.get("/authGroup/list", params, { loading: true });
};
//权限组管理-查询授权人员
export const authGroupQueryUser = params => {
  return http.get("/authGroup/query/user", params, { loading: true });
};
//权限组管理 - 删除授权人员;
export const authGroupDeleteUser = params => {
  return http.post("/authGroup/delete/user", params, { loading: true });
};
//权限组管理-删除权限组
export const authGroupDeleteGroup = params => {
  return http.post("/authGroup/delete/group", params, { loading: true });
};
//权限组管理-更新是否是审核组
export const authGroupUpdateAuditFlag = params => {
  return http.post("/authGroup/update/auditFlag", params, { loading: true });
};
//权限组管理 - 更新用户注册时展示;
export const authGroupUpdateDisplayFlag = params => {
  return http.post("/authGroup/update/displayFlag", params, { loading: true });
};
//权限组管理-添加权限组
export const authGroupAddGroup = params => {
  return http.post("/authGroup/add/group", params, { loading: true });
};
//权限组管理-编辑权限组
export const authGroupUpdateGroupInfo = params => {
  return http.post("/authGroup/update/groupInfo", params, { loading: true });
};

export const authGroupgroupMenu = params => {
  return http.get("/authGroup/groupMenu/list", params, { loading: true });
};
//注册页面获取申请角色列表
export const authGroupgetRegisterGroups = params => {
  return http.get("/authGroup/getRegisterGroups", params, { loading: true });
};
