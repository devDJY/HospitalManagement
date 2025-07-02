import http from "@/api";
import { useUserStore } from "@/stores/modules/user";
const userStore = useUserStore();
//档案库 - 已作废 - 列表查询;
export const archiveCancelList = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/archive/cancel/list", pa, { loading: true });
};
//档案库 - 已下载 - 列表查询;
export const archiveDownloadList = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/archive/download/list", pa, { loading: true });
};

//档案库 - 导出excel;
export const archiveExcelReport = params => {
  return http.get("/archive/excel/report", params, { loading: true });
};
//档案库 - 全部 - 查看文件 - 添加异常备注;
export const archiveFileAddLog = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/archive/file/addLog", pa, { loading: true });
};
//档案库 - 全部 - 下载文件;
export const archiveFileDownload = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.post("/archive/file/download", pa, { loading: true });
};
//档案库 - 全部 - 文件登记表查询;
export const archiveFileDetail = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/archive/file/detail", pa, { loading: true });
};
//档案库-全部-查看文件列表
export const archiveFileList = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/archive/file/list", pa, { loading: true });
};
//档案库 - 全部 - 查看文件 - 异常备注;
export const archiveFileQueryLog = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/archive/file/queryLog", pa, { loading: true });
};
//档案库 - 列表查询;
export const archiveList = params => {
  let pa = { userId: userStore.userInfo.id, ...params };
  return http.get("/archive/list", pa, { loading: true });
};
