<template>
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="700px" :close-on-click-modal="false">
    <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
      <el-form-item label="权限组名称" prop="name" required>
        <el-input v-model="form.name" placeholder="请输入..." />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" :rows="3" placeholder="请输入..." />
      </el-form-item>

      <el-form-item label="权限组菜单" prop="menus" required>
        <el-tree
          ref="menuTree"
          :data="menuTreeData"
          show-checkbox
          node-key="id"
          :props="treeProps"
          :default-expand-all="true"
          :check-strictly="false"
          @check-change="handleCheckChange"
        />
      </el-form-item>

      <el-form-item label="其他设置">
        <el-checkbox v-model="form.showOnRegister">用户注册时显示</el-checkbox>
        <el-checkbox v-model="form.isReviewGroup">是否是审核组</el-checkbox>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick } from "vue";
import { type FormInstance, type ElTree, ElMessage } from "element-plus";

interface MenuItem {
  id: string | number;
  name: string;
  children?: MenuItem[];
}

interface FormData {
  id?: string | number;
  name: string;
  description: string;
  menus: (string | number)[];
  showOnRegister: boolean;
  isReviewGroup: boolean;
}

const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const menuTree = ref<InstanceType<typeof ElTree>>();
const mode = ref<"create" | "edit">("create");

// 表单数据
const form = reactive<FormData>({
  name: "",
  description: "",
  menus: [],
  showOnRegister: false,
  isReviewGroup: false
});

// 菜单树数据（示例，实际应从API获取）
const menuTreeData = ref<MenuItem[]>([
  {
    id: "1",
    name: "项目文件受控",
    children: [
      { id: "11", name: "首页-管理员" },
      { id: "12", name: "首页" }
    ]
  },
  {
    id: "2",
    name: "项目",
    children: [
      { id: "21", name: "项目-管理员" },
      { id: "22", name: "项目列表" }
    ]
  },
  {
    id: "3",
    name: "文件",
    children: [
      { id: "31", name: "文件-管理员" },
      { id: "32", name: "形式审查" },
      { id: "33", name: "受控" }
    ]
  },
  {
    id: "4",
    name: "档案库",
    children: [{ id: "41", name: "项目" }]
  },
  {
    id: "5",
    name: "设置",
    children: [
      { id: "51", name: "用户管理" },
      { id: "52", name: "权限组管理" }
    ]
  }
]);

const treeProps = {
  label: "name",
  children: "children"
};

const rules = {
  name: [
    { required: true, message: "请输入权限组名称", trigger: "blur" },
    { min: 2, max: 20, message: "长度在2到20个字符", trigger: "blur" }
  ],
  menus: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (form.menus.length === 0) {
          callback(new Error("请至少选择一个菜单权限"));
        } else {
          callback();
        }
      },
      trigger: "change"
    }
  ]
};

const dialogTitle = computed(() => {
  return mode.value === "create" ? "新增权限组" : "编辑权限组";
});

// 打开弹窗（新增）
const openCreateDialog = () => {
  mode.value = "create";
  resetForm();
  dialogVisible.value = true;
};

// 打开弹窗（编辑）
const openEditDialog = (data: FormData) => {
  mode.value = "edit";
  resetForm();
  Object.assign(form, data);

  // 设置选中的菜单
  nextTick(() => {
    if (menuTree.value) {
      menuTree.value.setCheckedKeys(data.menus);
    }
  });

  dialogVisible.value = true;
};

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields();
  form.menus = [];
  if (menuTree.value) {
    menuTree.value.setCheckedKeys([]);
  }
};

// 菜单选择变化
const handleCheckChange = () => {
  if (menuTree.value) {
    form.menus = menuTree.value.getCheckedKeys();
  }
};

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value?.validate();

    // 获取半选中状态的父菜单
    const halfCheckedKeys = menuTree.value?.getHalfCheckedKeys() || [];
    form.menus = [...form.menus, ...halfCheckedKeys];

    // 这里可以调用API提交表单
    console.log("提交数据:", form);

    dialogVisible.value = false;
    ElMessage.success(`${dialogTitle.value}成功`);

    // 可以emit事件通知父组件
    // emit('success', form)
  } catch (error) {
    console.error("表单验证失败:", error);
  }
};

// 暴露方法给父组件
defineExpose({
  openCreateDialog,
  openEditDialog
});
</script>

<style scoped>
.el-tree {
  max-height: 400px;
  padding: 10px;
  overflow-y: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.el-checkbox {
  margin-right: 15px;
}
</style>
