。
<template>
  <el-dialog title="文件申请" v-model="dialogVisible" width="800px" :close-on-click-modal="false">
    <el-form :model="form" label-width="120px" :rules="rules" ref="formRef" label-position="top">
      <!-- 第一行 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="项目名称" prop="projectId" required>
            <el-select clearable v-model="form.projectId" placeholder="请选择..." @change="selectTheProject" filterable style="width: 100%">
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
        <el-upload multiple action="#" :limit="1" accept=".pdf" :http-request="handleHttpUpload" :file-list="fileList" :before-upload="beforeUpload" :on-remove="handleRemove">
          <el-button v-if="!form.attachmentUrl" type="primary">选择文件</el-button>
          <el-button v-else type="success" @click="documentDetails">文件详情</el-button>
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
          <el-form-item label="份数" prop="fileCount" required>
            <el-input-number v-model="form.fileCount" :min="1" controls-position="right" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="版本号">
            <el-input v-model="form.fileVersion" placeholder="请输入..." />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="版本日期">
            <el-date-picker v-model="form.versionTime" type="date" placeholder="选择日期" value-format="YYYY-MM-DD" style="width: 100%" />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 受控方式 -->
      <el-form-item label="受控方式" prop="checkType" required>
        <el-radio-group v-model="form.checkType">
          <el-radio :value="1">线上受控</el-radio>
          <el-radio :value="2">线下受控</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- 审查人和申请说明 -->
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="审查人" prop="reviewerId" required>
            <el-select v-model="form.reviewerId" placeholder="请选择..." filterable style="width: 100%">
              <el-option v-for="item in reviewerOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="申请说明" prop="applyReason" required>
        <el-input
          v-model="form.applyReason"
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
import { ref, reactive, nextTick } from "vue";
import { ElMessage, UploadUserFile, type FormInstance, type FormRules, type UploadProps } from "element-plus";
import { fileInfoAdd, fileInfoAddGetProjectList, fileInfoAddGetReviewerList, fileInfoReEdit, fileInfoupload } from "@/api/modules/fileInfo";

const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const submitting = ref(false);
const fileList: any = ref([]);

const form: any = reactive({
  projectId: "",
  fileCode: "",
  file: null,
  fileVersion: "",
  fileCount: 1,
  attachmentId: "",
  attachmentUrl: "",
  fileName: "",
  versionTime: "",
  checkType: "0",
  reviewerId: "",
  applyReason: ""
});

const projectOptions = ref();
const reviewerOptions: any = ref([]);

const rules = reactive<FormRules>({
  projectId: [{ required: true, message: "请选择项目名称", trigger: "change" }],
  fileCode: [{ required: true, message: "请输入文件编码", trigger: "blur" }],
  file: [{ required: true, message: "请上传文件", trigger: "change" }],
  fileName: [{ required: true, message: "请输入文件名", trigger: "blur" }],
  fileCount: [
    { required: true, message: "请输入份数", trigger: "blur" },
    { type: "number", min: 1, message: "份数必须大于0", trigger: "blur" }
  ],
  checkType: [{ required: true, message: "请选择受控方式", trigger: "change" }],
  reviewerId: [{ required: true, message: "请选择审查人", trigger: "change" }],
  applyReason: [
    { required: true, message: "请输入申请说明", trigger: "blur" },
    { min: 10, message: "申请说明不能少于10个字符", trigger: "blur" }
  ]
});

// 生成文件编码
const generateFileCode = () => {
  if (!form.projectId) {
    ElMessage.warning("请先选择项目名称");
    return;
  }
  const projectCode = projectOptions.value?.find((p: any) => p.value === form.projectCode)?.value || "PROJ";
  form.fileCode = `${projectCode}-${Date.now().toString().slice(-4)}`;
};
const restForm = () => {
  form.projectId = "";
  form.fileCode = "";
  form.file = null;
  form.fileVersion = "";
  form.fileCount = 1;
  form.attachmentId = "";
  form.attachmentUrl = "";
  form.fileName = "";
  form.versionTime = "";
  form.checkType = "";
  form.reviewerId = "";
  form.applyReason = "";
  fileList.value = [];
};
const handleHttpUpload = async options => {
  let formData = new FormData();
  form.fileName = options.file.name; // 设置文件名
  formData.append("file", options.file);
  try {
    fileInfoupload(formData)
      .then((response: any) => {
        form.attachmentId = response.data.id;
        form.attachmentUrl = response.data.attachmentUrl;
      })
      .catch(error => {
        options.onError(error);
      });
  } catch (error) {
    options.onError(error as any);
  }
};
const selectTheProject = (value: string) => {
  if (!value) {
    reviewerOptions.value = []; // 清空现有选项
    form.reviewer = ""; // 清空选择
    return;
  }
  fileInfoAddGetReviewerList({ projectId: value }).then((response: any) => {
    reviewerOptions.value = response.data.map((item: any) => ({
      value: item.userId,
      label: item.nickName
    }));
  });
};
// 文件上传处理
const beforeUpload: UploadProps["beforeUpload"] = file => {
  if (file.type !== "application/pdf") {
    ElMessage.error("只能上传PDF文件");
    return false;
  }
  form.file = file;
};

const handleRemove = () => {
  form.file = null;
  form.attachmentUrl = "";
};
const documentDetails = () => {
  window.open(form.attachmentUrl, "_blank");
};
const initData = async () => {
  fileInfoAddGetProjectList({}).then((response: any) => {
    projectOptions.value = response.data.map(item => ({
      value: item.projectId,
      label: item.projectName
    }));
  });
};
const edit = ref(false); // 是否编辑状态
// 打开弹窗方法
const openDialog = async (initialData: any) => {
  await restForm();
  initData();
  edit.value = false;
  if (initialData) {
    edit.value = true;
    fileList.value = [
      {
        name: initialData.attachmentName,
        url: initialData.attachmentUrl,
        status: "success", // 必需！标记为已上传成功
        uid: Date.now() // 唯一标识（可选但推荐）
      }
    ];
    form.file = "112121";
    initialData.fileName = initialData.attachmentName;
    Object.assign(form, initialData);
  }

  dialogVisible.value = true;
};
const emit = defineEmits(["refreshData"]);
// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    let obj: any = {
      applyReason: form.applyReason,
      attachmentId: form.attachmentId,
      checkType: form.checkType,
      fileName: form.fileName,
      fileCode: form.fileCode,
      fileCount: form.fileCount,
      fileVersion: form.fileVersion,
      projectId: form.projectId,
      reviewerId: form.reviewerId,
      versionTime: form.versionTime
    };
    if (edit.value) {
      obj.fileId = form.fileId;
      await fileInfoReEdit(obj);
    } else {
      await fileInfoAdd(obj);
    }
    dialogVisible.value = false;
    ElMessage.success("文件提交成功");
    emit("refreshData");
  } catch (error) {
    console.error("表单验证失败:", error);
  } finally {
    submitting.value = false;
    // 通知父节点刷新数据
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

function emit(arg0: string) { throw new Error("Function not implemented."); }
