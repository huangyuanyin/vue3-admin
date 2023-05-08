<template>
  <div class="dashboard-container" id="member-app">
    <div class="container">
      <div class="tableBar" style="display: flex; justify-content: space-between; padding-right: 35px" v-if="!showDetail">
        <el-button type="primary" size="large" class="continue" @click="addClass('add')"> + 新增公告 </el-button>
      </div>
      <el-table :data="tableData" stripe class="tableBox" border v-if="!showDetail">
        <el-table-column prop="name" label="公告标题"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间">
          <template #default="scope">
            {{ scope.row.updateTime }}
          </template>
        </el-table-column>
        <el-table-column prop="affiliatedCompany" label="更新人">
          <template #default="scope"> 管理员 </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template #default="scope">
            <el-button type="text" size="small" class="blueBug" @click="addClass('edit', scope.row.id)"> 编辑 </el-button>
            <el-button type="text" size="small" class="warnBug" @click="addClass('detail', scope.row.id)"> 详情 </el-button>
            <el-button type="text" size="small" class="delBut non" @click="deleteHandle(scope.row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="!showDetail"
        class="pageList"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="counts"
        :current-page="page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
      <div class="titleWrap" v-if="showDetail">
        <el-button type="text" class="blueBug" size="large" @click="goback()"> 返回 </el-button>
        <p style="margin-left: 30px">当前子公司：{{ queryName }}</p>
      </div>
      <div class="tableBar" style="display: flex; justify-content: space-between; padding-right: 35px" v-if="showDetail"></div>
      <el-table :data="tableData" stripe class="tableBox" border v-if="showDetail">
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="type" label="类型">
          <template #default="scope">
            <span>{{ scope.row.type == '1' ? '分公司' : '项目组' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="操作时间">
          <template #default="scope">
            {{ scope.row.updateTime }}
          </template>
        </el-table-column>
        <el-table-column prop="affiliatedCompany" label="所属公司"></el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template #default="scope">
            <el-button type="text" size="small" class="blueBug" @click="editHandle(scope.row, '2')"> 修改 </el-button>
            <el-button type="text" size="small" class="delBut non" @click="deleteHandle(scope.row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-if="showDetail"
        class="pageList"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="counts"
        :current-page="page"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <el-dialog :title="title" v-model="dialogVisible" width="35%" :before-close="handleClose">
      <el-form label-width="100px" :model="userForm" ref="userRuleFormRef" :rules="userRules">
        <el-form-item label="名称：" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入名称" size="large" maxlength="14" />
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input v-model="userForm.sort" type="number" size="large" placeholder="请输入排序" />
        </el-form-item>
        <el-form-item label="所属公司：" prop="affiliatedCompany">
          <el-input size="large" v-model="userForm.affiliatedCompany" placeholder="请输入公司名称" maxlength="14" disabled />
        </el-form-item>
      </el-form>
      <el-form-item>
        <div class="button-wrap" style="display: flex">
          <el-button size="large" @click="resertForm(userRuleFormRef)">取 消</el-button>
          <el-button type="primary" size="large" @click="submitForm(userRuleFormRef, null)">确 定</el-button>
          <el-button v-if="action != 'edit'" type="primary" size="large" class="continue" @click="submitForm(userRuleFormRef, 'go')"> 保存并继续添加 </el-button>
        </div>
      </el-form-item>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { editCategory, getCategoryPage, addCategoryApi, deleCategory } from '@/api/user'
import { ElMessage, FormInstance, FormRules, ElMessageBox } from 'element-plus'
import type { TabsPaneContext } from 'element-plus'
import { Search } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const queryName = ref('总公司')
const showDetail = ref(false)
const activeName = ref('1')
const headTitle = ref('账号管理')
const action = ref('')
const userInfo = ref(window.localStorage.getItem('userInfo') || {})
const menuActived = ref(false)
const loading = ref(false)
const tableData = ref([])
const page = ref(1)
const pageSize = ref(10)
const counts = ref(0)
const dialogVisible = ref(false)
const title = ref('新增子公司')
let userForm = reactive({
  name: '',
  sort: '',
  affiliatedCompany: '总公司',
  type: ''
})
const userRuleFormRef = ref<FormInstance>()
const userRules = reactive<FormRules>({
  name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
  sort: [{ required: true, message: '请输入排序', trigger: 'blur' }],
  affiliatedCompany: [{ required: true, message: '请输入所属公司', trigger: 'blur' }]
})

const editHandle = (dat: { name: any; sort: any; id: any; affiliatedCompany: any }, type: string) => {
  title.value = '修改信息'
  action.value = 'edit'
  dialogVisible.value = true
  userForm.name = dat.name
  userForm.sort = dat.sort
  userForm.type = type
  type == '1' ? (userForm.affiliatedCompany = '总公司') : (userForm.affiliatedCompany = dat.affiliatedCompany)
  userForm.id = dat.id
}

const goback = () => {
  showDetail.value = false
  activeName.value = '1'
  queryName.value = '总公司'
  init()
}

const handleDetail = (id: any) => {
  queryName.value = id.name
  activeName.value = '2'
  showDetail.value = true
  init()
}

const handleClick = (tab: TabsPaneContext, event: Event) => {
  // activeName.value = tab.paneName
  page.value = 1
  queryName.value = ''
  init()
}

const deleteHandle = (ids: any) => {
  ElMessageBox.confirm('此操作将永久删除该公告, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    let res = await deleCategory(ids)
    if (res.code === 1) {
      ElMessage.success('删除成功！')
      page.value = 1
      init()
    } else {
      ElMessage.error(res.msg || '操作失败')
    }
  })
}

const handleClose = (done: () => void) => {
  dialogVisible.value = false
  // 重置表单
  resertForm(userRuleFormRef.value)
}

const resertForm = (formEl: FormInstance | undefined) => {
  dialogVisible.value = false
  formEl.resetFields()
}

const submitForm = async (formEl: FormInstance | undefined, type: any) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (action.value == 'add') {
        delete userForm.id
        if (title.value === '新增子公司') {
          userForm.type = '1'
          addCategory(userForm, type)
        } else {
          userForm.type = '2'
          addCategory(userForm, type)
        }
      } else {
        let res = await editCategory(userForm)
        if (res.code === 1) {
          ElMessage.success('修改成功')
          resertForm(userRuleFormRef.value)
          dialogVisible.value = false
          init()
        } else {
          ElMessage.error(res.msg)
        }
      }
    }
  })
}

const addCategory = async (data: any, type: any) => {
  let res = await addCategoryApi(data)
  if (res.code === 1) {
    ElMessage.success('新增成功')
    resertForm(userRuleFormRef.value)
    init()
    if (type === 'go') {
      dialogVisible.value = true
    } else {
      dialogVisible.value = false
    }
  } else {
    ElMessage.error(res.msg)
  }
}

const addClass = (type: any, id?: any) => {
  if (type == 'add') {
    router.push({ path: '/addNotice', query: { type: 'add' } })
  } else if (type == 'edit') {
    router.push({ path: '/addNotice', query: { id: id, type: 'edit' } })
  } else {
    router.push({ path: '/addNotice', query: { id: id, type: 'detail' } })
  }
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  init()
}
const handleCurrentChange = (val: number) => {
  page.value = val
  init()
}

const handleQuery = () => {
  page.value = 1
  init()
}

const init = async () => {
  let res = await getCategoryPage({ page: page.value, pageSize: pageSize.value, type: activeName.value, name: queryName.value })
  if (String(res.code) === '1') {
    tableData.value = res.data.records
    counts.value = Number(res.data.total)
  } else {
    ElMessage.error(res.msg || '操作失败')
  }
}

onMounted(() => {
  init()
})
</script>

<style scoped>
@import url(../../styles/common.css);
@import url(../../styles/index.css);
@import url(../../styles/icon/iconfont.css);
.container {
  background-color: #fff;
  padding: 30px 28px;
  border-radius: 4px;
}
.tableBar {
  margin-bottom: 20px;
}

.titleWrap {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
}
.pageList {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
:deep(.el-tabs) {
  box-shadow: none;
}
:deep(.el-tabs__content) {
  padding-top: 30px;
}

:deep(.el-pagination__editor) {
  width: 100px !important;
}

:deep(.el-dialog__header) {
  padding: 20px 30px;
  background: #fbfbfa;
  border-radius: 8px 8px 0px 0px;
  border-bottom: 1px solid #e5e4e4;
}
:deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 700;
  color: #333333;
  line-height: 24px;
}
:deep(.el-dialog__body) {
  padding: 43px 90px 21px;
  color: #818693;
  font-size: 14px;
  word-break: break-all;
}
:deep(.el-dialog__footer) {
  padding: 0px 30px 30px;
}
:deep(.button-wrap) {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 20px;
}
:deep(.el-input, .el-input__wrapper) {
  width: 300px;
}
:deep(.el-input__wrapper) {
  width: 300px;
}
/* .body {
  min-width: 1366px;
}
.app-main {
  height: calc(100% - 64px);
}
.app-main .divTmp {
  width: 100%;
  height: 100vh;
}
.sidebar-container {
  background-color: rgb(52, 55, 68);
}
:deep(.el-menu) {
  background-color: rgb(52, 55, 68);
} */
</style>
