<template>
  <el-dialog v-model="visible" :title="formTitle" width="800px" :close-on-click-modal="false">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" label-position="right">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="项目立项号" prop="projectCode">
            <el-input :disabled="details" v-model="formData.projectCode" placeholder="请输入（请与CTMS系统立项号一致）" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目名称" prop="projectName">
            <el-input :disabled="details" v-model="formData.projectName" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="药物/器械名称">
            <el-input :disabled="details" v-model="formData.deviceName" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="适应症">
            <el-input :disabled="details" v-model="formData.indication" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="申办方" prop="applicant">
            <el-input :disabled="details" v-model="formData.applicant" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="CRO">
            <el-input :disabled="details" v-model="formData.cro" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="方案编号">
            <el-input :disabled="details" v-model="formData.protocolNumber" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="试验/研究分期" prop="stageNo">
            <el-select :disabled="details" v-model="formData.stageNo" placeholder="请选择" style="width: 100%" clearable>
              <el-option v-for="item in stageNoOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item v-if="details || mode == 'edit'" label="文件审查员" prop='reviewerName'>
            <el-select :disabled="true" v-model="formData.reviewerName" placeholder="请选择" style="width: 100%" clearable>
              <el-option v-for="user in userOptions" :key="user.userId" :label="user.nickName" :value="user.userId" />
            </el-select>
          </el-form-item>
          <el-form-item v-else label="文件审查员" prop="managerId">
            <el-select v-model="formData.managerId" placeholder="请选择" style="width: 100%" clearable>
              <el-option v-for="user in userOptions" :key="user.userId" :label="user.nickName" :value="user.userId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入组例数" prop="enrollCount">
            <el-input :disabled="details" v-model="formData.enrollCount" placeholder="请输入（本中心入组例数）" clearable type="number" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="启动日期" prop="startTime">
            <el-date-picker :disabled="details" v-model="formData.startTime" type="date" placeholder="请选择" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="PM姓名" prop="pmName">
            <el-input :disabled="details" v-model="formData.pmName" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="PM手机" prop="pmMobile">
            <el-input :disabled="details" v-model="formData.pmMobile" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="PM邮箱" prop="pmEmail">
            <el-input :disabled="details" v-model="formData.pmEmail" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="试验介绍">
        <el-input :disabled="details" v-model="formData.projectDesc" type="textarea" :rows="4" placeholder="请输入" />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { projectGetInfoById } from "@/api/modules/project";

interface ProjectForm {
  projectCode: string;
  projectName: string;
  deviceName: string;
  indication: string;
  applicant: string;
  cro: string;
  protocolNumber: string;
  stageNo: string;
  managerId: string;
  enrollCount: string;
  startTime: string;
  pmName: string;
  pmMobile: string;
  pmEmail: string;
  projectDesc: string;
  reviewerName: string;
}

interface UserOption {
  userId: string;
  nickName: string;
}

const props = defineProps<{
  userOptions: UserOption[]; // 用户选项列表
}>();

const emit = defineEmits<{
  (e: "submit", data: ProjectForm): void;
}>();
const details = ref(false);
const visible = ref(false);
const formRef = ref<FormInstance>();
const mode = ref<"add" | "edit">("add");
const currentId = ref<string>("");

const formData = reactive<ProjectForm>({
  projectCode: "",
  projectName: "",
  deviceName: "",
  indication: "",
  applicant: "",
  cro: "",
  protocolNumber: "",
  stageNo: "",
  managerId: "",
  enrollCount: "",
  startTime: "",
  pmName: "",
  pmMobile: "",
  pmEmail: "",
  projectDesc: "",
  reviewerName: ""
});

const stageNoOptions = [
  { value: "1", label: "I期/BE" },
  { value: "2", label: "II期" },
  { value: "3", label: "III期" },
  { value: "4", label: "IV期" },
  { value: "5", label: "医疗器械" },
  { value: "6", label: "医疗器械II类" },
  { value: "7", label: "医疗器械III类" },
  { value: "8", label: "体外诊断试剂II类" },
  { value: "9", label: "体外诊断试剂III类" },
  { value: "10", label: "IIT" },
  { value: "11", label: "其他" }
];

const formRules = reactive<FormRules<ProjectForm>>({
  projectCode: [{ required: true, message: "请输入项目立项号", trigger: "blur" }],
  projectName: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
  applicant: [{ required: true, message: "请输入申办方", trigger: "blur" }],
  stageNo: [{ required: true, message: "请选择试验分期", trigger: "change" }],
  managerId: [{ required: true, message: "请选择文件审查员", trigger: "change" }],
  enrollCount: [{ required: true, message: "请输入入组例数", trigger: "blur" }],
  startTime: [{ required: true, message: "请选择启动日期", trigger: "change" }],
  pmName: [{ required: true, message: "请输入PM姓名", trigger: "blur" }],
  pmMobile: [
    { required: true, message: "请输入PM手机", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号", trigger: "blur" }
  ],
  pmEmail: [
    { required: true, message: "请输入PM邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }
  ]
});

const formTitle = computed(() => {
  if (details.value) {
    return "项目详情";
  }
  return mode.value === "add" ? "新增项目" : "编辑项目";
});
const initFormData = () => {
  formData.projectCode = "";
  formData.projectName = "";
  formData.deviceName = "";
  formData.indication = "";
  formData.applicant = "";
  formData.cro = "";
  formData.protocolNumber = "";
  formData.stageNo = "";
  formData.managerId = "";
  formData.enrollCount = "";
  formData.startTime = "";
  formData.pmName = "";
  formData.pmMobile = "";
  formData.pmEmail = "";
  formData.projectDesc = "";
};
// 打开弹窗（新增）
const openAddDialog = () => {
  mode.value = "add";
  resetForm();
  visible.value = true;
};
// 打开弹窗（编辑）
const openEditDialog = (data, bl: boolean = false) => {
  details.value = bl;
  mode.value = "edit";
  resetForm();
  projectGetInfoById({ projectId: data.projectId }).then((res: any) => {
    Object.assign(formData, res.data);
    formData.stageNo = formData.stageNo + "";
  });
  visible.value = true;
};

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields();
  initFormData();
  currentId.value = "";
};

// 取消
const handleCancel = () => {
  visible.value = false;
};

// 提交
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    emit("submit", { ...formData });
    visible.value = false;
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};

defineExpose({
  openAddDialog,
  openEditDialog,
  mode
});
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
