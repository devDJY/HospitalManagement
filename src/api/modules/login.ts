import { Login } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import authMenuList from "@/assets/json/authMenuList.json";
import authButtonList from "@/assets/json/authButtonList.json";
import http from "@/api";
import { localGet } from "@/utils";
import { useUserStore } from "@/stores/modules/user";
/**
 * @name 登录模块
 */
// 用户登录
export const loginApi = (params: Login.ReqLoginForm) => {
  return http.post<Login.ResLogin>("/userInfo/login", params, { loading: true }); // 正常 post json 请求  ==>  application/json
  // return http.post<Login.ResLogin>(PORT1 + `/login`, params, { loading: true }); // 控制当前请求不显示 loading
  // return http.post<Login.ResLogin>(PORT1 + `/login`, {}, { params }); // post 请求携带 query 参数  ==>  ?username=admin&password=123456
  // return http.post<Login.ResLogin>(PORT1 + `/login`, qs.stringify(params)); // post 请求携带表单参数  ==>  application/x-www-form-urlencoded
  // return http.get<Login.ResLogin>(PORT1 + `/login?${qs.stringify(params, { arrayFormat: "repeat" })}`); // get 请求可以携带数组等复杂参数
};

// 忘记密码
export const forgetPasswordApi = params => {
  return http.post("/userInfo/resetPwd/phone", params, { loading: true });
};
// 修改密码 个人主页-用户修改密码
export const changePasswordApi = params => {
  const userStore = useUserStore();
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/userInfo/update/pwd", pa, { loading: true });
};
// 发送验证码
export const sendCodeApi = params => {
  return http.get("/userInfo/getVerifyCode", params, { loading: true });
};
// 获取菜单列表
export const getAuthMenuListApi = () => {
  let menuList = localGet("routerInfo");
  return menuList;
  //return http.get<Menu.MenuOptions[]>(`/authGroup/groupMenu/list`, {}, { loading: true });
  // 如果想让菜单变为本地数据，注释上一行代码，并引入本地 authMenuList.json 数据
  //return authMenuList;
};

// 获取按钮权限
export const getAuthButtonListApi = () => {
  return http.get<Login.ResAuthButtons>(PORT1 + `/auth/buttons`, {}, { loading: true });
  // 如果想让按钮权限变为本地数据，注释上一行代码，并引入本地 authButtonList.json 数据
  return authButtonList;
};

// 用户退出登录
export const logoutApi = () => {
  return http.post(PORT1 + `/logout`);
};
