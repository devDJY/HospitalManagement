<template>
  <el-dialog v-model="visible" :title="formTitle" width="800px" :close-on-click-modal="false">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" label-position="right">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="项目立项号" prop="projectCode">
            <el-input v-model="formData.projectCode" placeholder="请输入（请与CTMS系统立项号一致）" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="formData.projectName" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="药物/器械名称">
            <el-input v-model="formData.drugName" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="适应症">
            <el-input v-model="formData.indication" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="申办方" prop="sponsor">
            <el-input v-model="formData.sponsor" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="CRO">
            <el-input v-model="formData.cro" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="方案编号">
            <el-input v-model="formData.protocolNumber" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="试验/研究分期" prop="phase">
            <el-select v-model="formData.phase" placeholder="请选择" style="width: 100%" clearable>
              <el-option v-for="item in phaseOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="文件审查员" prop="reviewer">
            <el-select v-model="formData.reviewer" placeholder="请选择" style="width: 100%" clearable>
              <el-option v-for="user in userOptions" :key="user.id" :label="user.name" :value="user.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="入组例数" prop="enrollment">
            <el-input v-model="formData.enrollment" placeholder="请输入（本中心入组例数）" clearable type="number" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="启动日期" prop="startDate">
            <el-date-picker
              v-model="formData.startDate"
              type="date"
              placeholder="请选择"
              style="width: 100%"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="PM姓名" prop="pmName">
            <el-input v-model="formData.pmName" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="PM手机" prop="pmPhone">
            <el-input v-model="formData.pmPhone" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="PM邮箱" prop="pmEmail">
            <el-input v-model="formData.pmEmail" placeholder="请输入" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="试验介绍">
        <el-input v-model="formData.description" type="textarea" :rows="4" placeholder="请输入" />
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

interface ProjectForm {
  projectCode: string;
  projectName: string;
  drugName: string;
  indication: string;
  sponsor: string;
  cro: string;
  protocolNumber: string;
  phase: string;
  reviewer: string;
  enrollment: string;
  startDate: string;
  pmName: string;
  pmPhone: string;
  pmEmail: string;
  description: string;
}

interface UserOption {
  id: string;
  name: string;
}

const props = defineProps<{
  userOptions: UserOption[]; // 用户选项列表
}>();

const emit = defineEmits<{
  (e: "submit", data: ProjectForm): void;
}>();

const visible = ref(false);
const formRef = ref<FormInstance>();
const mode = ref<"add" | "edit">("add");
const currentId = ref<string>("");

const formData = reactive<ProjectForm>({
  projectCode: "",
  projectName: "",
  drugName: "",
  indication: "",
  sponsor: "",
  cro: "",
  protocolNumber: "",
  phase: "",
  reviewer: "",
  enrollment: "",
  startDate: "",
  pmName: "",
  pmPhone: "",
  pmEmail: "",
  description: ""
});

const phaseOptions = [
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
  sponsor: [{ required: true, message: "请输入申办方", trigger: "blur" }],
  phase: [{ required: true, message: "请选择试验分期", trigger: "change" }],
  reviewer: [{ required: true, message: "请选择文件审查员", trigger: "change" }],
  enrollment: [{ required: true, message: "请输入入组例数", trigger: "blur" }],
  startDate: [{ required: true, message: "请选择启动日期", trigger: "change" }],
  pmName: [{ required: true, message: "请输入PM姓名", trigger: "blur" }],
  pmPhone: [
    { required: true, message: "请输入PM手机", trigger: "blur" },
    { pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号", trigger: "blur" }
  ],
  pmEmail: [
    { required: true, message: "请输入PM邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" }
  ]
});

const formTitle = computed(() => {
  return mode.value === "add" ? "新增项目" : "编辑项目";
});

// 打开弹窗（新增）
const openAddDialog = () => {
  mode.value = "add";
  resetForm();
  visible.value = true;
};

// 打开弹窗（编辑）
const openEditDialog = (data: ProjectForm) => {
  mode.value = "edit";
  resetForm();
  Object.assign(formData, data);
  visible.value = true;
};

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields();
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
    ElMessage.success(mode.value === "add" ? "新增成功" : "编辑成功");
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};

defineExpose({
  openAddDialog,
  openEditDialog
});
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
