<template>
  <div>
    <div class="container">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :inline="false" label-width="180px" class="demo-ruleForm">
        <el-form-item label="账号:" prop="username">
          <el-input size="large" v-model="ruleForm.username" placeholder="请输入账号" maxlength="20" />
        </el-form-item>
        <el-form-item label="员工姓名:" prop="name">
          <el-input size="large" v-model="ruleForm.name" placeholder="请输入员工姓名" maxlength="20" />
        </el-form-item>

        <el-form-item label="手机号:" prop="phone">
          <el-input size="large" v-model="ruleForm.phone" placeholder="请输入手机号" maxlength="20" />
        </el-form-item>
        <el-form-item label="性别:" prop="sex">
          <el-radio-group size="large" v-model="ruleForm.sex">
            <el-radio size="large" label="男"></el-radio>
            <el-radio size="large" label="女"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号:" prop="idNumber">
          <el-input size="large" v-model="ruleForm.idNumber" placeholder="请输入身份证号" maxlength="20" />
        </el-form-item>
        <div class="subBox address">
          <el-form-item>
            <el-button size="large" @click="goBack()"> 取消 </el-button>
            <el-button size="large" type="primary" @click="submitForm('ruleForm', false)"> 保存 </el-button>
            <el-button size="large" v-if="actionType == 'add'" type="primary" class="continue" @click="submitForm('ruleForm', true)"> 保存并继续添加 </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const actionType = ref('add')
let ruleForm = reactive({
  username: '',
  name: '',
  phone: '',
  sex: '',
  idNumber: ''
})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  name: [{ required: true, message: '请输入排序', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入所属公司', trigger: 'blur' }],
  sex: [],
  idNumber: []
})

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
@import url(@/styles/common.css);
@import url(@/styles/page.css);
.container {
  background-color: #fff;
  padding: 30px 28px;
  border-radius: 4px;
}

:deep(.el-input, .el-input__wrapper) {
  width: 300px;
}
:deep(.el-input__wrapper) {
  width: 300px;
}

.subBox {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

:deep(.el-radio) {
  /* display: flex;
  flex-direction: column;
  align-items: center; */
}
</style>
