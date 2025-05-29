。
<template>
  <el-dialog title="文件申请" v-model="dialogVisible" width="800px" :close-on-click-modal="false">
    <el-form :model="form" label-width="120px" :rules="rules" ref="formRef" label-position="top">
      <!-- 第一行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="项目名称" prop="projectName" required>
            <el-select v-model="form.projectName" placeholder="请选择..." filterable style="width: 100%">
              <el-option v-for="item in projectOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="文件编码" prop="fileCode" required>
            <el-input v-model="form.fileCode" placeholder="文件名编号...">
              <template #append>
                <el-button @click="generateFileCode">生成</el-button>
              </template>
            </el-input>
            <div class="form-tip">编码规则：项目立项号-文件名编号-文件版本号(非必填)。请勿输入中文和特殊字符，连接符请用-</div>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 文件上传 -->
      <el-form-item label="文件" prop="file" required>
        <el-upload action="#" :limit="1" accept=".pdf" :file-list="fileList" :before-upload="beforeUpload" :on-remove="handleRemove">
          <el-button type="primary">选择文件</el-button>
          <template #tip>
            <div class="upload-tip">
              <p>注意：类似于《如何同意书》这种"一式两份"的文件若整合在同一个PDF进行申请受控，需确保《如何同意书》为偶数项。</p>
              <p>若为单数项在本页添加空白页，避免页面打印时的文件页面混印在同一张纸上！</p>
              <p>只能上传pdf格式文件，且文件纸张大小为A4</p>
            </div>
          </template>
        </el-upload>
      </el-form-item>

      <!-- 第二行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="文件名" prop="fileName" required>
            <el-input v-model="form.fileName" placeholder="请输入..." />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="份数" prop="quantity" required>
            <el-input-number v-model="form.quantity" :min="1" controls-position="right" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="版本号">
            <el-input v-model="form.fileName" placeholder="请输入..." />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="版本日期">
            <el-date-picker v-model="form.version" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 受控方式 -->
      <el-form-item label="受控方式" prop="controlType" required>
        <el-radio-group v-model="form.controlType">
          <el-radio label="online">线上受控</el-radio>
          <el-radio label="offline">线下受控</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 审查人和申请说明 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="审查人" prop="reviewer" required>
            <el-select v-model="form.reviewer" placeholder="请选择..." filterable style="width: 100%">
              <el-option v-for="item in reviewerOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="申请说明" prop="reason" required>
        <el-input
          v-model="form.reason"
          type="textarea"
          :rows="4"
          placeholder="请描述份数申请说明。例：每位受试者每次访视需要用的受控文件，预计三个月内将进行5次访视，待申请10份受控文件。"
          show-word-limit
          maxlength="500"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="submitting">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { ElMessage, type FormInstance, type FormRules, type UploadProps, type UploadUserFile } from "element-plus";

interface FormData {
  projectName: string;
  fileCode: string;
  file: File | null;
  fileName: string;
  quantity: number;
  version: string;
  controlType: "online" | "offline";
  reviewer: string;
  reason: string;
}

const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const submitting = ref(false);
const fileList = ref<UploadUserFile[]>([]);

const form = reactive<FormData>({
  projectName: "",
  fileCode: "",
  file: null,
  fileName: "",
  quantity: 1,
  version: "",
  controlType: "online",
  reviewer: "",
  reason: ""
});

const projectOptions = [
  { value: "project1", label: "项目A" },
  { value: "project2", label: "项目B" }
];

const reviewerOptions = [
  { value: "reviewer1", label: "审查人1" },
  { value: "reviewer2", label: "审查人2" }
];

const rules = reactive<FormRules>({
  projectName: [{ required: true, message: "请选择项目名称", trigger: "change" }],
  fileCode: [
    { required: true, message: "请输入文件编码", trigger: "blur" },
    { pattern: /^[a-zA-Z0-9-]+$/, message: "只能包含字母、数字和连接符(-)", trigger: "blur" }
  ],
  file: [{ required: true, message: "请上传文件", trigger: "change" }],
  fileName: [{ required: true, message: "请输入文件名", trigger: "blur" }],
  quantity: [
    { required: true, message: "请输入份数", trigger: "blur" },
    { type: "number", min: 1, message: "份数必须大于0", trigger: "blur" }
  ],
  controlType: [{ required: true, message: "请选择受控方式", trigger: "change" }],
  reviewer: [{ required: true, message: "请选择审查人", trigger: "change" }],
  reason: [
    { required: true, message: "请输入申请说明", trigger: "blur" },
    { min: 10, message: "申请说明不能少于10个字符", trigger: "blur" }
  ]
});

// 生成文件编码
const generateFileCode = () => {
  if (!form.projectName) {
    ElMessage.warning("请先选择项目名称");
    return;
  }
  const projectCode = projectOptions.find(p => p.value === form.projectName)?.label || "PROJ";
  form.fileCode = `${projectCode}-${Date.now().toString().slice(-4)}`;
};

// 文件上传处理
const beforeUpload: UploadProps["beforeUpload"] = file => {
  if (file.type !== "application/pdf") {
    ElMessage.error("只能上传PDF文件");
    return false;
  }
  form.file = file;
  return false; // 手动上传
};

const handleRemove = () => {
  form.file = null;
};

// 打开弹窗方法
const openDialog = (initialData?: Partial<FormData>) => {
  if (initialData) {
    Object.assign(form, initialData);
  }
  dialogVisible.value = true;
  fileList.value = [];
};

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;

    // 这里可以调用API提交表单
    const formData = new FormData();
    Object.keys(form).forEach(key => {
      if (key === "file" && form.file) {
        formData.append(key, form.file);
      } else {
        formData.append(key, form[key as keyof FormData] as string);
      }
    });

    // console.log("提交数据:", Object.fromEntries(formData.entries()));
    await new Promise(resolve => setTimeout(resolve, 1000)); // 模拟API调用

    dialogVisible.value = false;
    ElMessage.success("文件申请提交成功");
  } catch (error) {
    console.error("表单验证失败:", error);
  } finally {
    submitting.value = false;
  }
};

// 暴露方法给父组件
defineExpose({
  openDialog
});
</script>

<style scoped>
.form-tip,
.upload-tip {
  margin-top: 4px;
  font-size: 12px;
  line-height: 1.5;
  color: #909399;
}
.upload-tip p {
  margin: 2px 0;
}
:deep(.el-form-item__label) {
  padding-bottom: 0;
  font-weight: bold;
  color: #333333;
}
:deep(.el-upload__tip) {
  margin-top: 5px;
}
</style>
