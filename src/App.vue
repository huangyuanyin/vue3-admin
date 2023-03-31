<script setup lang="ts">
import CollapseMenu from '@/components/CollapseMenu.vue'
import Header from '@/components/Header.vue'
import { useRoute } from 'vue-router'

const route = useRoute()

console.log(`output->route`, route)
</script>

<template>
  <div class="common-layout">
    <el-container v-if="route.path !== '/login'">
      <el-aside width="200px"><CollapseMenu /> </el-aside>
      <el-container>
        <el-header><Header /></el-header>
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
    <router-view v-else></router-view>
  </div>
</template>

<style scoped>
.common-layout {
  height: 100vh;
}
:deep(.el-container) {
  height: 100vh;
}
:deep(.el-header) {
  padding: 0px;
}
:deep(.el-main) {
  background-color: #f3f4f7;
}
</style>
