<template>
  <div>
    <div class="container">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :inline="false" label-width="180px" class="demo-ruleForm">
        <el-form-item label="账号:" prop="username">
          <el-input size="large" v-model="ruleForm.username" placeholder="请输入账号" maxlength="20" />
        </el-form-item>
        <el-form-item label="负责人姓名:" prop="name">
          <el-input size="large" v-model="ruleForm.name" placeholder="请输入负责人姓名" maxlength="20" />
        </el-form-item>
        <el-form-item label="负责人手机号:" prop="phone">
          <el-input size="large" v-model="ruleForm.phone" placeholder="请输入负责人手机号" maxlength="20" />
        </el-form-item>
        <el-form-item label="公司名称:" prop="companyName">
          <el-input size="large" v-model="ruleForm.companyName" placeholder="请输入公司名称" maxlength="20" />
        </el-form-item>
        <el-form-item label="权限:" prop="sex">
          <el-radio-group size="large" v-model="ruleForm.sex">
            <el-radio size="large" label="总公司"></el-radio>
            <el-radio size="large" label="分公司"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="项目名称:" prop="projectName">
          <el-input size="large" v-model="ruleForm.projectName" placeholder="请输入项目名称" maxlength="20" />
        </el-form-item>
        <div class="subBox address">
          <el-form-item>
            <el-button size="large" @click="goBack()">取消 </el-button>
            <el-button size="large" type="primary" @click="submitForm(ruleFormRef, false)"> 保存 </el-button>
            <el-button size="large" v-if="actionType == 'add'" type="primary" class="continue" @click="submitForm(ruleFormRef, true)"> 保存并继续添加 </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { useRouter, useRoute, LocationQueryValue } from 'vue-router'
import { addEmployee, queryEmployeeByIdApi, editEmployee } from '@/api/user'

const route = useRoute()
const router = useRouter()
const actionType = ref()
let ruleForm = reactive({
  username: '',
  name: '',
  phone: '',
  companyName: '',
  sex: '总公司',
  projectName: ''
})
const ruleFormRef = ref<FormInstance>()
var validateMobilePhone = (rule: any, value: string, callback) => {
  if (value === '') {
    callback(new Error('负责人手机号不可为空'))
  } else {
    if (value !== '') {
      var reg = /^1[3456789]\d{9}$/
      if (!reg.test(value)) {
        callback(new Error('请输入有效的手机号码'))
      }
    }
    callback()
  }
}
const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入负责人姓名', trigger: 'blur' }],
  phone: [{ required: true, validator: validateMobilePhone, trigger: 'blur' }],
  sex: [{ required: true, message: '请选择权限', trigger: 'change' }],
  projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }]
})

const goBack = () => {
  router.go(-1)
  resertForm(ruleFormRef.value)
}

const resertForm = (formEl: FormInstance | undefined) => {
  formEl.resetFields()
}

const submitForm = async (formEl: FormInstance | undefined, type: any) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let params = { ...ruleForm }
      params.sex === '总公司' ? (params.sex = '1') : (params.sex = '2')
      route.query.id ? (params.id = route.query.id) : ''
      let res = route.query.id ? await editEmployee(params) : await addEmployee(params)
      if (res.code === 1) {
        ElMessage.success(res.data || '添加成功')
        resertForm(ruleFormRef.value)
        type ? '' : router.go(-1)
      } else {
        ElMessage.error(res.msg)
      }
    }
  })
}

const queryEmployeeById = async (id: string | LocationQueryValue[]) => {
  let res = await queryEmployeeByIdApi(id)
  console.log(res)
  if (String(res.code) === '1') {
    console.log(res.data)
    ruleForm.username = res.data.username
    ruleForm.name = res.data.name
    ruleForm.phone = res.data.phone
    ruleForm.companyName = res.data.companyName
    ruleForm.projectName = res.data.projectName
    ruleForm.sex = res.data.sex === '0' ? '分公司' : '总公司'
  } else {
    ElMessage.error(res.msg || '操作失败')
  }
}

onMounted(() => {
  if (route.query.id) {
    queryEmployeeById(route.query.id)
  }
  actionType.value = route.query.id ? 'edit' : 'add'
})
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
</style>
