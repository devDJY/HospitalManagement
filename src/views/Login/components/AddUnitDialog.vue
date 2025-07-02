<template>
  <el-dialog title="新增单位信息" :model-value="visible" @update:model-value="$emit('update:visible', $event)" width="500px" class="add-unit-dialog">
    <el-form :model="form" :rules="rules" ref="formRef" label-width="150px">
      <el-form-item label="单位名称：" prop="unitName">
        <el-input v-model="form.unitName" placeholder="请输入..." clearable />
      </el-form-item>

      <el-form-item label="单位的社会信用代码：" prop="creditCode">
        <el-input v-model="form.creditCode" placeholder="请输入..." clearable>
          <template #append>
            <el-button type="primary" @click="openQichacha" size="small"> 前往企查查 </el-button>
          </template>
        </el-input>
        <div class="tip-text">（可前往企查查获取正确的信用代码 ）</div>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { registerCompany } from "@/api/modules/register";

defineProps({
  visible: Boolean
});

const emit = defineEmits(["update:visible", "confirm"]);

const formRef = ref();
const form = reactive({
  unitName: "",
  creditCode: ""
});

const rules = {
  unitName: [{ required: true, message: "请输入单位名称", trigger: "blur" }],
  creditCode: [
    { required: true, message: "请输入社会信用代码", trigger: "blur" },
    { pattern: /^[0-9A-Z]{18}$/, message: "请输入18位有效的信用代码", trigger: "blur" }
  ]
};

const openQichacha = () => {
  window.open("https://www.qcc.com", "_blank");
};

const handleCancel = () => {
  resetForm();
  emit("update:visible", false);
};
// 重置表单方法
const resetForm = () => {
  formRef.value?.resetFields();
  // 或者手动重置
  // form.unitName = "";
  // form.creditCode = "";
};
const handleConfirm = async () => {
  try {
    await formRef.value.validate();
    const res = await registerCompany({
      companyCode: form.creditCode,
      companyName: form.unitName
    });
    if (res.code === 200) {
      emit("confirm", { ...form });
      emit("update:visible", false);
      ElMessage.success("单位信息添加成功");
      formRef.value.resetFields();
    } else {
      ElMessage.success("单位信息添加错误，请检查。");
    }
  } catch (error) {
    ElMessage.error("请填写完整且正确的信息");
  }
};
</script>

<style scoped>
:deep(.add-unit-dialog .el-dialog__body) {
  padding: 20px;
}
.add-unit-dialog .el-form-item {
  margin-bottom: 20px;
}
.add-unit-dialog .tip-text {
  margin-top: 5px;
  font-size: 12px;
  color: #999999;
}
.add-unit-dialog .dialog-footer {
  display: flex;
  justify-content: flex-end;
}
:deep(.add-unit-dialog .el-input-group__append) {
  padding: 0 10px;
}
</style>
