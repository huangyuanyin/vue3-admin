<template>
  <div class="navbar">
    <div class="head-lable">
      <span v-if="goBackFlag" class="goBack" @click="goBack()"><img src="@/assets/images/icons/btn_back@2x.png" alt="" /> 返回</span>
      <span>{{ headTitle }}</span>
    </div>
    <div class="right-menu">
      <div class="avatar-wrapper">{{ userInfo && userInfo.name }}</div>
      <img src="@/assets/images/icons/btn_close@2x.png" class="outLogin" alt="退出" @click="logout" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const goBackFlag = ref(false)
const headTitle = ref('账号管理')
const userInfo = ref()

const goBack = () => {
  // const menu = menuList.value.find((item) => item.id === menuActived.value)
  // menuHandle(menu, false)
}

const logout = () => {
  router.push('/login')
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
}

watch(
  () => {
    return route.path
  },
  (val) => {
    switch (val) {
      case '/member':
        headTitle.value = '账号管理'
        break
      case '/changeMember':
        if (route.query.type === 'add') {
          headTitle.value = '添加账号'
        } else {
          headTitle.value = '修改账号'
        }
        break
      case '/backend':
        headTitle.value = '部门管理'
        break
      case '/jump':
        headTitle.value = '跳转管理'
        break
      case '/addJump':
        if (route.query.id) {
          headTitle.value = '修改跳转'
        } else {
          headTitle.value = '添加跳转'
        }
        break
      case '/notice':
        headTitle.value = '公告管理'
        break
      case '/addNotice':
        if (route.query.type === 'edit') {
          headTitle.value = '修改公告'
        } else if (route.query.type === 'add') {
          headTitle.value = '添加公告'
        } else {
          headTitle.value = '公告详情'
        }
        break
      // case '/backend/food':
      //   goBackFlag.value = true
      //   break
      default:
        break
    }
  }
)

onMounted(() => {
  console.log(`output->`, route)
  switch (route.path) {
    case '/member':
      headTitle.value = '账号管理'
      break
    case '/changeMember':
      console.log(`output->route.query.type`, route.query.type)
      if (route.query.type === 'add') {
        headTitle.value = '添加账号'
      } else {
        headTitle.value = '修改账号'
      }
      break
    case '/backend':
      headTitle.value = '部门管理'
      break
    case '/jump':
      headTitle.value = '跳转管理'
      break
    case '/addJump':
      if (route.query.id) {
        headTitle.value = '修改跳转'
      } else {
        headTitle.value = '添加跳转'
      }
      break
    // case '/backend/category':
    //   goBackFlag.value = true
    //   break
    // case '/backend/food':
    //   goBackFlag.value = true
    //   break
    default:
      break
  }
})
</script>

<style lang="css" scoped>
@import url(@/styles/common.css);
@import url(@/styles/index.css);
@import url(@/styles/icon/iconfont.css);
</style>
