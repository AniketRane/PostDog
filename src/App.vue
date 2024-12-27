<template>
<a-config-provider :theme="{
  token: {
    colorPrimary: '#00b96b',
  },
  algorithm: theme.darkAlgorithm 
}">

  <a-layout style="min-height: 100vh">

    <a-layout-sider collapsible defaultCollapsed></a-layout-sider>

    <a-layout>
      <!-- <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%', background: '#001529' }">
        <div class="logo" />
        <a-menu theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
          <a-menu-item key="1">nav 1</a-menu-item>
          <a-menu-item key="2">nav 2</a-menu-item>
          <a-menu-item key="3">nav 3</a-menu-item>
        </a-menu>
      </a-layout-header> -->
      <a-layout-content :style="{ marginTop: '0px' }">
        <RouterView />
      </a-layout-content>
      <!-- <a-layout-footer :style="{ textAlign: 'center' }">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer> -->
    </a-layout>
  </a-layout>

</a-config-provider>

</template>
<script>
import { theme } from 'ant-design-vue';
import { RouterLink, RouterView } from 'vue-router'
export default {
  data() {
    return {
      theme
    }
  }
}
</script>