import { Login } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";
import authMenuList from "@/assets/json/authMenuList.json";
import authButtonList from "@/assets/json/authButtonList.json";
import http from "@/api";
import { lo } from "element-plus/es/locale";
import { localGet } from "@/utils";

export interface RegisterGroup {
  createTime: string;
  groupDesc: string | null;
  groupName: string;
  id: number;
  isAudit: number;
  isRegisterDisplay: number;
  isSuper: number;
  updateTime: string;
}

export interface CompanyInfo {
  companyCode: string;
  companyName: string;
  createTime: string | null;
  id: number;
  status: number;
  updateTime: string;
}

export interface RegisterParams {
  companyNo: number; // 公司编号
  companyType: number; // 公司类型
  email: string; // 电子邮箱
  mobile: string; // 手机号码
  nickName: string; // 昵称
  password: string; // 密码
  permissionGroupId: number; // 权限组ID
  userName: string; // 用户名
  verifyCode: string; // 验证码
}

export const getRegisterGroups = params => {
  return http.get<Array<RegisterGroup>>("/authGroup/getRegisterGroups ", params, { loading: false });
};

export const companyInfoList = params => {
  return http.get<Array<CompanyInfo>>("/companyInfo/list ", params, { loading: false });
};

export const getVerifyCode = params => {
  return http.get("/userInfo/getVerifyCode", params, { loading: false });
};

export const register = (params: RegisterParams) => {
  return http.post("/userInfo/register", params, { loading: false });
};
