<template>
  <div>
    <div class="container">
      <div class="tableBar">
        <el-input v-model="input" placeholder="请输入员工姓名" size="large" style="width: 250px" clearable @keyup.enter.native="handleQuery" :suffix-icon="Search"> </el-input>
        <el-button type="primary" size="large" @click="addMemberHandle('add')"> + 添加员工 </el-button>
      </div>
      <el-table :data="tableData" stripe class="tableBox" border v-loading="loading">
        <el-table-column prop="name" label="员工姓名"></el-table-column>
        <el-table-column prop="username" label="账号"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column label="账号状态">
          <template #default="scope">
            {{ String(scope.row.status) === '0' ? '已禁用' : '正常' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template #default="scope">
            <el-button type="text" size="large" class="blueBug" @click="addMemberHandle(scope.row.id)" :class="{ notAdmin: user !== 'admin' }"> 编辑 </el-button>
            <el-button type="text" size="large" class="delBut non" @click="statusHandle(scope.row)" v-if="user === 'admin'">
              {{ scope.row.status == '1' ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pageList"
        :page-sizes="[10, 20, 30, 40]"
        :current-page.sync="page"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="counts"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import { getMemberListApi, enableOrDisableEmployee } from '@/api/user'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const user = ref(JSON.parse(localStorage.getItem('userInfo')).username) || ''
const input = ref('')
const tableData = ref([])
const loading = ref(false)
const page = ref(1)
const pageSize = ref(10)
const counts = ref(0)

const handleQuery = () => {
  page.value = 1
  getMemberList()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  getMemberList()
}
const handleCurrentChange = (val: number) => {
  page.value = val
  getMemberList()
}

const statusHandle = (row: { id: any; status: any }) => {
  ElMessageBox.confirm('确认调整该账号的状态?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    let res = await enableOrDisableEmployee({ id: row.id, status: !row.status ? 1 : 0 })
    if (res.code === 1) {
      if (String(res.code) === '1') {
        ElMessage.success('账号状态更改成功！')
        getMemberList()
      }
    } else {
      ElMessage.error(res.msg || '账号状态更改失败！')
    }
  })
}

const addMemberHandle = (st: any) => {
  if (st === 'add') {
    router.push('/changeMember?type=add')
  } else {
    router.push('/changeMember?type=edit&id=' + st)
  }
}

const getMemberList = async () => {
  const params = {
    page: page.value,
    pageSize: pageSize.value,
    name: input.value ? input.value : undefined
  }
  loading.value = true
  let res = await getMemberListApi(params)
  loading.value = false
  if (String(res.code) === '1') {
    tableData.value = res.data.records || []
    counts.value = res.data.total
  }
}
onMounted(() => {
  getMemberList()
})
</script>

<style scoped>
@import url(@/styles/common.css);
@import url(@/styles/page.css);
#member-app .notAdmin::after {
  border: 0 !important;
}
.container {
  background-color: #fff;
  padding: 30px 28px;
  border-radius: 4px;
}
.tableBar {
  margin-bottom: 20px;
}
.pageList {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
