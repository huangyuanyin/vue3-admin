<template>
  <div class="container">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :inline="false" label-width="180px" class="demo-ruleForm">
      <el-form-item label="网站名称:" prop="name">
        <el-input size="large" v-model="ruleForm.name" placeholder="请填写网站名称" maxlength="20" />
      </el-form-item>
      <el-form-item label="网站分类:" prop="categoryType">
        <el-select v-model="ruleForm.categoryType" class="m-2" placeholder="请选择网站分类" size="large">
          <el-option v-for="item in categoryTypeList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="网站链接:" prop="url">
        <el-input size="large" v-model="ruleForm.url" placeholder="请填写网站链接" />
      </el-form-item>
      <el-form-item label="网站icon:" prop="icon">
        <el-input size="large" v-model="ruleForm.icon" placeholder="请填写以'icon-'开头的icon名称" />
      </el-form-item>
      <el-form-item label="权限配置:">
        <el-form-item>
          <div class="flavorBox">
            <el-button size="large" type="warning" v-if="dishFlavors.length == 0" class="addBut" @click="addFlavore"> + 增加公司</el-button>
            <div v-if="dishFlavors.length != 0" class="flavor">
              <div class="title">
                <span>公司名称</span>
              </div>
              <div class="cont">
                <!-- <el-select size="large" v-model="ruleForm.dishFlavors" filterable placeholder="请选择公司名称">
                  <el-option v-for="item in dishFlavors" :key="item.id" :label="item.name" :value="item.id" />
                </el-select> -->
                <div v-for="(item, index) in dishFlavors" :key="index" class="items">
                  <div class="itTit">
                    <!-- 	<SelectInput :dish-flavors-data="dishFlavorsData" :index="index"
													:value="item.name" @select="selectHandle" /> -->
                    <div class="selectInput">
                      <div>
                        <el-input
                          size="large"
                          v-model="item.name"
                          type="text"
                          style="width: 100%"
                          placeholder="请输入公司名称"
                          @focus="selectFlavor(true, index)"
                          @blur="outSelect(false, index)"
                          @input="inputHandle(index)"
                        />
                      </div>
                      <div v-show="item.showOption" class="flavorSelect">
                        <span v-for="(it, ind) in dishFlavorsData" :key="ind" class="items" @click="checkOption(it, ind, index)">{{ it.name }}</span>
                        <span v-if="dishFlavorsData.length == 0" class="none">无数据</span>
                      </div>
                    </div>
                  </div>
                  <span class="delFlavor delBut non" @click="delFlavor(index)">删除</span>
                </div>
              </div>
              <div class="addBut" @click="addFlavore">添加公司</div>
            </div>
          </div>
        </el-form-item>
      </el-form-item>
      <el-form-item label="网站图片:" prop="image" class="uploadImg">
        <!-- <el-upload class="avatar-uploader" action="/common/upload" :show-file-list="false" :on-success="handleAvatarSuccess" :on-change="onChange" ref="upload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload> -->
        <el-upload
          class="upload-demo"
          drag
          action="http://101.43.127.118:8080/common/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :on-change="onChange"
          ref="upload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <div v-else>
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">拖动文件上传或 <em>点击此处上传</em></div>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="网站描述:">
        <el-input size="large" v-model="ruleForm.description" type="textarea" :rows="3" placeholder="网站描述，最长200字" maxlength="200" />
      </el-form-item>
      <div class="subBox address">
        <el-form-item>
          <el-button size="large" @click="goBack(ruleFormRef)"> 取消 </el-button>
          <el-button size="large" type="primary" @click="submitForm(ruleFormRef, null)"> 保存 </el-button>
          <el-button size="large" v-if="actionType == 'add'" type="primary" class="continue" @click="submitForm(ruleFormRef, 'goAnd')"> 保存并继续添加 </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { getCategoryListApi, addDish, queryDishById, editDish } from '@/api/user'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const actionType = ref('add')
const upload = ref(null)
const dishFlavors = ref([])
const dishFlavorsData = ref([])
const imageUrl = ref('')
let ruleForm = reactive({
  id: '',
  categoryType: '',
  url: '',
  icon: '',
  name: '',
  description: '',
  dishFlavors: [],
  categoryId: '',
  image: '',
  status: ''
})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  url: [{ required: true, message: '请输入网站链接', trigger: 'blur' }],
  categoryType: [{ required: true, message: '请选择网站分类', trigger: 'change' }],
  icon: [{ required: true, message: '请输入网站图标', trigger: 'blur' }],
  name: [{ required: true, message: '请输入网站名', trigger: 'blur' }],
  description: [{ required: true, message: '请输入网站描述', trigger: 'blur' }],
  image: [{ required: true, message: '请上传图片', trigger: 'change' }],
  projectName: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }]
})
const categoryTypeList = ref([
  { label: '智慧管理', value: '智慧管理' },
  { label: '智慧创安', value: '智慧创安' },
  { label: '智慧提质', value: '智慧提质' },
  { label: '智慧创卫', value: '智慧创卫' },
  { label: '智慧建造', value: '智慧建造' },
  { label: '智慧增绿', value: '智慧增绿' }
])

const addFlavore = () => {
  dishFlavors.value.push({
    name: '',
    value: [],
    showOption: false
  })
}

const selectFlavor = (st: any, index: string | number) => {
  console.log('st', st)
  console.log('index', index)
  console.log('this.dishFlavors', dishFlavors.value)
  const obj = JSON.parse(JSON.stringify(dishFlavors.value[index]))
  obj.showOption = st
  dishFlavors.value.splice(index, 1, obj)
  // this.dishFlavors[index].showOption = st
}

const handleAvatarSuccess = (response: { code: number; msg: string; data: any }, file: any, fileList: any) => {
  // 拼接down接口预览
  if (response.code === 0 && response.msg === '未登录') {
    window.top.location.href = '/backend/page/login/login.html'
  } else {
    imageUrl.value = `http://101.43.127.118:8080/common/download?name=${response.data}`
    ruleForm.image = response.data
    console.log(`output->ruleForm.image`, ruleForm.image)
  }
}

const onChange = (file: { name: string; size: number }) => {
  if (file) {
    const suffix = file.name.split('.')[1]
    const size = file.size / 1024 / 1024 < 2
    if (['png', 'jpeg', 'jpg'].indexOf(suffix) < 0) {
      ElMessage.error('上传图片只支持 png、jpeg、jpg 格式！')
      upload.value.clearFiles()
      return false
    }
    if (!size) {
      ElMessage.error('上传文件大小不能超过 2MB!')
      return false
    }
    return file
  }
}

const outSelect = (st: any, index: string | number) => {
  setTimeout(() => {
    const obj = JSON.parse(JSON.stringify(dishFlavors.value[index]))
    obj.showOption = st
    dishFlavors.value.splice(index, 1, obj)
  }, 200)
}

const inputHandle = (index: any) => {
  // this.selectFlavor(false,index)
}

const delFlavor = (ind: any) => {
  dishFlavors.value.splice(ind, 1)
}

const checkOption = (val: { name: any }, ind: any, index: string | number) => {
  selectHandle(val.name, index, ind)
  dishFlavors.value[index].name = val.name
}

const selectHandle = (val: any, key: string | number, ind: string | number) => {
  const arrDate = [...dishFlavors.value]
  arrDate[key] = JSON.parse(JSON.stringify(dishFlavorsData.value[ind]))
  dishFlavors.value = arrDate
}

const goBack = (formEl: FormInstance | undefined) => {
  router.go(-1)
  formEl.resetFields()
}

const submitForm = async (formEl: FormInstance | undefined, type: any) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (dishFlavors.value.length == 0) {
        return ElMessage.error('请添加权限配置')
      }
      let params = { ...ruleForm }
      params.status = ruleForm ? 1 : 0
      params.categoryId = ruleForm.categoryId
      params.flavors = dishFlavors.value.map((obj) => ({
        // ...obj,
        // value: JSON.stringify(obj.value)
        name: obj.name
      }))
      delete params.dishFlavors
      if (actionType.value == 'add') {
        delete params.id
        delete params.categoryId
        let res = await addDish(params)
        if (res.code === 1) {
          ElMessage.success('添加成功！')
          if (!type) {
            goBack(ruleFormRef.value)
          } else {
            ruleFormRef.value.resetFields()
            dishFlavors.value = []
            // this.dishFlavorsData = []
            imageUrl.value = ''
            // goBaruleFormRef.value)
          }
        } else {
          ElMessage.error(res.msg || '操作失败')
        }
      } else {
        params.id = route.query.id
        delete params.updateTime
        let res = await editDish(params)
        if (res.code === 1) {
          ElMessage.success('修改成功！')
          goBack(ruleFormRef.value)
        } else {
          ElMessage.error(res.msg || '操作失败')
        }
      }
    }
  })
}

const getCategoryList = async () => {
  let res = await getCategoryListApi({ type: 1 })
  if (res.code == 1) {
    dishFlavorsData.value = res.data
  }
}

const init = async () => {
  let res = await queryDishById(route.query.id)
  if (res.code == 1) {
    ruleForm.name = res.data.name
    ruleForm.url = res.data.url
    ruleForm.categoryType = res.data.categoryType
    ruleForm.icon = res.data.icon
    ruleForm.description = res.data.description
    ruleForm.image = res.data.image
    ruleForm.status = res.data.status == '1'
    dishFlavors.value =
      res.data.flavors &&
      res.data.flavors.map((obj: { value: any }) => ({
        ...obj,
        value: obj.value,
        showOption: false
      }))
    console.log('this.dishFlavors', dishFlavors.value)
    // this.ruleForm.id = res.data.data.categoryId
    // this.imageUrl = res.data.data.image
    imageUrl.value = `http://101.43.127.118:8080/common/download?name=${res.data.image}`
  } else {
    ElMessage.error(res.msg || '操作失败')
  }
}

onMounted(() => {
  getCategoryList()
  if (route.query.id) {
    actionType.value = 'edit'
    init()
  }
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
.upload-demo {
  min-width: 200px;
  /* min-height: 200px */
}

:deep(.el-input, .el-input__wrapper, ) {
  width: 300px;
}
:deep(.el-input__wrapper) {
  width: 300px;
}
:deep(.el-select) {
  width: 330px;
}

.flavorBox {
  width: 777px;
}
.flavor {
  border: solid 1px #dfe2e8;
  border-radius: 3px;
  padding: 15px;
  background: #fafafb;
}
.flavor .title {
  color: #606168;
  margin-bottom: 10px;
}
.itTit {
  margin-right: 20px;
}
.items {
  display: flex;
  margin: 10px 0;
  align-items: center;
}
.delFlavor {
  cursor: pointer;
}

.addBut {
  background: #ffc200;
  display: inline-block;
  padding: 0px 20px;
  border-radius: 3px;
  line-height: 40px;
  cursor: pointer;
  border-radius: 4px;
  color: #333333;
  font-weight: 500;
}

.selectInput {
  position: relative;
  width: 100%;
  min-width: 100px;
}

.selectInput .flavorSelect {
  position: absolute;
  width: 100%;
  padding: 0 10px;
  border-radius: 3px;
  border: solid 1px #ff903d;
  line-height: 30px;
  text-align: center;
  background: #fff;
  top: 50px;
  z-index: 99;
  height: 400px;
  overflow-y: scroll;
}

.selectInput .flavorSelect .items {
  cursor: pointer;
  display: inline-block;
  width: 100%;
  line-height: 35px;
  border-bottom: solid 1px #f4f4f4;
  color: #666;
}

.selectInput .flavorSelect .none {
  font-size: 14px;
}

#food-add-app .uploadImg .el-form-item__label::before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}
</style>
