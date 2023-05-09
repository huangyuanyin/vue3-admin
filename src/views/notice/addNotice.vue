<template>
  <div class="container">
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :inline="false" label-width="180px" class="demo-ruleForm">
      <el-form-item label="公告标题:" prop="title">
        <el-input size="large" :disabled="disabled" v-model="ruleForm.title" placeholder="请填写公告标题" maxlength="100" />
      </el-form-item>
      <el-form-item label="公告内容:" prop="notice">
        <Markdown v-if="!disabled" style="z-index: 99999" :data="md" @input="getMd" @fullScreen="fullScreen"></Markdown>
        <MarkdownPreview v-else :data="ruleForm.notice" @fullScreen="fullScreen" />
        <!-- <TinymceCom v-model="tinyValue" placeholder="请输入帖子详情内容(不少于10个字)" /> -->
      </el-form-item>
      <div class="subBox address">
        <el-form-item v-if="!disabled">
          <el-button size="large" @click="goBack(ruleFormRef)"> 取消 </el-button>
          <el-button size="large" type="primary" @click="submitForm(ruleFormRef, null)"> 发布文章 </el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button size="large" type="primary" @click="goBack(ruleFormRef)"> 返回 </el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, FormInstance, FormRules } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'
import { getCategoryListApi, addNoticeListApi, getNoticeDetailApi, editNoticeListApi } from '@/api/user'
import { useRoute, useRouter } from 'vue-router'
import TinymceCom from '@/components/Tinymce/index.vue'
import Markdown from '@/components/Markdown/index.vue'
import MarkdownPreview from '@/components/markdown/preview.vue'

const route = useRoute()
const router = useRouter()
const tinyValue = ref('')
const md = ref('')
const actionType = ref('add')
const upload = ref(null)
const dishFlavors = ref([])
const dishFlavorsData = ref([])
const imageUrl = ref('')
let ruleForm = reactive({
  id: '',
  title: '',
  notice: ''
})
const ruleFormRef = ref<FormInstance>()
const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入公告标题', trigger: 'blur' }],
  notice: [{ required: true, message: '请输入公告内容', trigger: 'blur' }]
})
const disabled = ref(false)

const getMd = (val: any) => {
  md.value = val
}

const fullScreen = (val: any) => {
  console.log(`output->fullScreen`, val)
}

const goBack = (formEl: FormInstance | undefined) => {
  router.go(-1)
  formEl.resetFields()
}

const submitForm = async (formEl: FormInstance | undefined, type: any) => {
  ruleForm.notice = md.value
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (route.query.type === 'add') {
        let { id, ...params } = ruleForm
        let res = await addNoticeListApi(params)
        if (res.code == 1) {
          ElMessage.success('添加成功')
          router.go(-1)
        } else {
          ElMessage.error(res.msg || '添加失败')
        }
      } else {
        ruleForm.id = route.query.id as string
        let res = await editNoticeListApi(ruleForm)
        if (res.code == 1) {
          ElMessage.success('编辑成功')
          router.go(-1)
        } else {
          ElMessage.error(res.msg || '编辑失败')
        }
      }
    }
  })
}

const init = async () => {
  let res = await getNoticeDetailApi(route.query.id)
  if (res.code == 1) {
    ruleForm.title = res.data.title
    md.value = ruleForm.notice = res.data.notice
  } else {
    ElMessage.error(res.msg || '请求失败')
  }
}

onMounted(() => {
  if (route.query.type !== 'add') {
    init()
  }
  if (route.query.type === 'detail') {
    disabled.value = true
  }
})
</script>

<style scoped>
@import url(../../styles/common.css);
@import url(../../styles/index.css);
@import url(../../styles/icon/iconfont.css);
.container {
  background-color: #fff;
  padding: 30px 28px 1px 28px;
  border-radius: 4px;
}
:deep(.el-input__wrapper) {
  width: 70vw;
}
.upload-demo {
  min-width: 200px;
  /* min-height: 200px */
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
