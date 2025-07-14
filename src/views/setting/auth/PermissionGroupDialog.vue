<template>
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="700px" :close-on-click-modal="false">
    <el-form :model="form" label-width="100px" :rules="rules" ref="formRef">
      <el-form-item label="权限组名称" prop="groupName" required>
        <el-input v-model="form.groupName" placeholder="请输入..." />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input v-model="form.groupDesc" type="textarea" :rows="3" placeholder="请输入..." />
      </el-form-item>

      <el-form-item label="权限组菜单" prop="menuId" required>
        <el-tree
          ref="menuTree"
          :data="menuTreeData"
          show-checkbox
          node-key="id"
          :props="treeProps"
          :default-expand-all="false"
          :check-strictly="true"
          @check-change="handleCheckChange"
        />
      </el-form-item>

      <el-form-item label="其他设置">
        <el-checkbox v-model="form.displayFlag">用户注册时显示</el-checkbox>
        <el-checkbox v-model="form.auditFlag">是否是审核组</el-checkbox>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, onMounted } from "vue";
import { type FormInstance, type ElTree, ElMessage } from "element-plus";
import { authGroupAddGroup, authGroupgroupMenu, authGroupMenuList, authGroupUpdateGroupInfo } from "@/api/modules/authGroup";

const dialogVisible = ref(false);
const formRef = ref<FormInstance>();
const menuTree = ref<InstanceType<typeof ElTree>>();
const mode = ref<"create" | "edit">("create");
// 表单数据
const form = reactive({
  groupName: "",
  groupDesc: "",
  groupId: "",
  auditFlag: false,
  displayFlag: false,
  menuId: []
});

// 菜单树数据（示例，实际应从API获取）
const menuTreeData = ref([]);

const treeProps = {
  label: "name",
  children: "children"
};

const rules = {
  name: [
    { required: true, message: "请输入权限组名称", trigger: "blur" },
    { min: 2, max: 20, message: "长度在2到20个字符", trigger: "blur" }
  ],
  menuId: [
    {
      validator: (rule: any, value: any, callback: any) => {
        if (form.menuId.length === 0) {
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
// 页面加载刷新
onMounted(() => {
  initauthGroupMenuList();
});

const initauthGroupMenuList = () => {
  authGroupMenuList({}).then((res: any) => {
    menuTreeData.value = res.data.map((item: any) => ({
      id: item.id,
      name: item.menuName,
      children: item.children.map((child: any) => ({
        id: child.id,
        name: child.menuName
      }))
    }));
  });
};
// 打开弹窗（编辑）
const openEditDialog = data => {
  mode.value = "edit";
  resetForm();
  if ((mode.value = "edit")) {
    form.groupId = data.id;
    (form.auditFlag = data.isAudit == 1 ? true : false), (form.displayFlag = data.isRegisterDisplay == 1 ? true : false);
    Object.assign(form, data);
    // 设置选中的菜单
    nextTick(() => {
      if (menuTree.value) {
        console.log(data.menus);

        menuTree.value.setCheckedKeys(data.menus);
      }
    });
    dialogVisible.value = true;
  } else {
    dialogVisible.value = true;
  }
};

// 重置表单
const resetForm = () => {
  formRef.value?.resetFields();
  form.menuId = [];
  form.groupName = "";
  form.groupDesc = "";
  form.auditFlag = false;
  form.displayFlag = false;
  if (menuTree.value) {
    menuTree.value.setCheckedKeys([]);
  }
};

// 菜单选择变化
const handleCheckChange = () => {
  if (menuTree.value) {
    form.menuId = menuTree.value.getCheckedKeys() as [];
    console.log("选中的菜单:", form.menuId);
  }
};
const emit = defineEmits(["refreshData"]);
// 提交表单
const handleSubmit = async () => {
  try {
    let data = {
      ...form,
      auditFlag: form.auditFlag ? 1 : 0,
      displayFlag: form.displayFlag ? 1 : 0
    };
    await formRef.value?.validate();
    if (mode.value == "create") {
      await authGroupAddGroup(data);
    } else {
      await authGroupUpdateGroupInfo(data);
    }
    dialogVisible.value = false;
    ElMessage.success(`${dialogTitle.value}成功`);
    setTimeout(() => {
      emit("refreshData");
    }, 500);
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
