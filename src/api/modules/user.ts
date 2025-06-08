import { ResPage, User } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import http from "@/api";

/**
 * @name 用户管理模块
 */
// 获取用户列表
export const getUserList = (params: User.ReqUserParams) => {
  return http.get<ResPage<User.ResUserList>>("/project/authorize/list", params);
};

// 获取树形用户列表
export const getUserTreeList = (params: User.ReqUserParams) => {
  return http.post<ResPage<User.ResUserList>>(PORT1 + `/user/tree/list`, params);
};

// 新增用户
export const addUser = (params: { id: string }) => {
  return http.post(PORT1 + `/user/add`, params);
};

// 批量添加用户
export const BatchAddUser = (params: FormData) => {
  return http.post(PORT1 + `/user/import`, params);
};

// 编辑用户
export const editUser = (params: { id: string }) => {
  return http.post(PORT1 + `/user/edit`, params);
};

// 删除用户
export const deleteUser = (params: { id: string[] }) => {
  return http.post(PORT1 + `/user/delete`, params);
};

// 切换用户状态
export const changeUserStatus = (params: { id: string; status: number }) => {
  return http.post(PORT1 + `/user/change`, params);
};

// 重置用户密码
export const resetUserPassWord = (params: { id: string }) => {
  return http.post(PORT1 + `/user/rest_password`, params);
};

// 导出用户数据
export const exportUserInfo = (params: User.ReqUserParams) => {
  return http.download(PORT1 + `/user/export`, params);
};

// 获取用户状态字典
export const getUserStatus = () => {
  return http.get<User.ResStatus[]>(PORT1 + `/user/status`);
};

// 获取用户性别字典
export const getUserGender = () => {
  return http.get<User.ResGender[]>(PORT1 + `/user/gender`);
};

// 获取用户部门列表
export const getUserDepartment = () => {
  return http.get<User.ResDepartment[]>(PORT1 + `/user/department`, {}, { cancel: false });
};

// 获取用户角色字典
export const getUserRole = () => {
  return http.get<User.ResRole[]>(PORT1 + `/user/role`);
};
//用户管理 - 分页查询;
export const getUserInfoList = params => {
  return http.get("/userInfo/list", params);
};
//用户列表 - 重置密码;
export const resetUserPassword = params => {
  return http.post("/userInfo/resetPwd", params);
};
//用户列表 - 删除用户;
export const deleteUserInfo = params => {
  return http.post("/userInfo/delete", params);
};
//管理员注册用户
export const registerByManager = params => {
  return http.post("/userInfo/register/byManager", params);
};
//用户列表-编辑用户
export const updateUserInfo = params => {
  return http.post("/userInfo/update/userInfo", params);
};
//个人主页-用户修改个人信息
export const updateSelfInfo = params => {
  return http.post("/userInfo/update/selfInfo", params);
};
//个人主页-用户修改密码
export const updateSelfPwd = params => {
  return http.post("/userInfo/update/pwd", params);
};
//用户列表-审核用户
export const updateUserAudit = params => {
  return http.post("/userInfo/update/audit", params);
};
