<template>
  <div class="dashboard-container" id="food-app">
    <div class="container">
      <div class="tableBar">
        <el-input
          v-model="input"
          placeholder="请输入网站名称"
          style="width: 250px"
          size="large"
          clearable
          @keyup.enter.native="handleQuery"
          @clear="handleQuery"
          :suffix-icon="Search"
        >
        </el-input>
        <div class="tableLab">
          <el-button text type="danger" @click="deleteHandle('批量', null)">批量删除</el-button>
          <el-button text type="primary" @click="statusHandle('1')">批量启用</el-button>
          <el-button text type="danger" style="border: none" @click="statusHandle('0')">批量停用</el-button>
          <el-button type="warning" size="large" @click="addFoodtype('add')"> + 新建链接网站 </el-button>
        </div>
      </div>
      <el-table :data="tableData" class="tableBox" @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="name" label="网站名称"></el-table-column>
        <el-table-column label="访问链接" width="200" show-overflow-tooltip>
          <template #default="scope">
            <a :href="scope.row.url" target="_blank" class="buttonText">{{ scope.row.url }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="image" label="图片" align="center">
          <template #default="scope">
            <!-- <el-image style="width: auto; height: 40px; border: none; cursor: pointer" :src="getImage(row.image)" :preview-src-list="[`/common/download?name=${row.image}`]">
              <div slot="error" class="image-slot">
                <img src="@/assets/images/noImg.png" style="width: auto; height: 40px; border: none" />
              </div>
            </el-image> -->
            <el-image
              style="width: auto; height: 40px; border: none; cursor: pointer"
              :src="getImage(scope.row.image)"
              :preview-src-list="[`http://81.70.224.230:8080/common/download?name=${scope.row.image}`]"
              fit="contain"
              preview-teleported
            >
              <template #error>
                <div class="image-slot">
                  <el-icon><icon-picture /></el-icon>
                </div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            <span style="margin-right: 10px">{{ scope.row.status == '0' ? '停用' : '启用' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="最后操作时间"> </el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button type="text" size="small" class="blueBug" @click="addFoodtype(scope.row.id)"> 修改 </el-button>
            <el-button text type="warning" size="small" class="blueBug" @click="statusHandle(scope.row)"> {{ scope.row.status == '0' ? '启用' : '停用' }} </el-button>
            <el-button v-if="scope.row.status == '0'" text type="danger" size="small" class="delBut non" @click="deleteHandle('单删', scope.row.id)"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="pageList"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="counts"
        @size-change="handleSizeChange"
        :current-page.sync="page"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, nextTick, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { dishPage, dishStatusByStatus, deleteDish } from '@/api/user'
import { Picture as IconPicture } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

interface User {
  id: never
  name: string
  url: string
  image: string
  status: string
  updateTime: string
}

const router = useRouter()
const page = ref(1)
const pageSize = ref(10)
const counts = ref(0)
const input = ref('')
const tableData = ref([])
const checkList = ref([])

const handleSelectionChange = (val: User[]) => {
  checkList.value = []
  val.forEach((n) => {
    checkList.value.push(n.id)
  })
}

const getImage = (image: any) => {
  return `http://81.70.224.230:8080/common/download?name=${image}`
}

const handleQuery = () => {
  page.value = 1
  dishPageList()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  dishPageList()
}
const handleCurrentChange = (val: number) => {
  page.value = val
  dishPageList()
}

const dishPageList = async () => {
  const res = await dishPage({
    page: page.value,
    pageSize: pageSize.value,
    name: input.value ? input.value : undefined
  })
  tableData.value = res.data.records
  counts.value = res.data.total
}

const statusHandle = (row: any) => {
  let params = {
    id: '',
    status: ''
  }
  if (typeof row === 'string') {
    if (checkList.value.length === 0) {
      ElMessage.error('批量操作，请先勾选网站！')
      return false
    }
    params.id = checkList.value.join(',')
    params.status = row
  } else {
    params.id = row.id
    params.status = row.status ? '0' : '1'
  }
  ElMessageBox.confirm('确认更改该网站状态', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    let res = await dishStatusByStatus(params)
    if (res.code == 1) {
      ElMessage.success(res.data || '网站状态已经更改成功！')
      page.value = 1
      dishPageList()
    } else {
      ElMessage.error(res.msg || '操作失败')
    }
  })
}

// 删除
const deleteHandle = (type: string, id: null) => {
  if (type === '批量' && id === null) {
    if (checkList.value.length === 0) {
      return ElMessage.error('请选择删除对象')
    }
  }
  ElMessageBox.confirm('确认删除该网站, 是否继续?', '确定删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消'
  }).then(async () => {
    let res = await deleteDish(type === '批量' ? checkList.value.join(',') : id)
    if (res.code === 1) {
      ElMessage.success('删除成功！')
      page.value = 1
      dishPageList()
      checkList.value = []
    } else {
      ElMessage.error(res.msg || '操作失败')
    }
  })
}

const addFoodtype = (id: string) => {
  if (id === 'add') {
    router.push('/addJump')
  } else {
    router.push(`/addJump?id=${id}`)
  }
}

onMounted(() => {
  dishPageList()
})
</script>

<style scoped>
.container {
  background-color: #fff;
  padding: 30px 28px;
  border-radius: 4px;
}
.tableBar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.pageList {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
