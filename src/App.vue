<template>
  <a-layout class="root-wrap">
    <a-layout-sider
      collapsible>
      <a-avatar :src="avatar" :size="70"/>
    </a-layout-sider>
    <a-layout-content>
      
    </a-layout-content>
  </a-layout>
</template>

<script>
import avatar from './assets/avatar.jpg'
export default {
  data() {
    return {
      avatar
    }
  }
}
</script>

<style lang="scss">
.root-wrap {
  height: 100vh;
  .ant-avatar {
    display: block;
    margin: 15px auto;
  }
  .ant-layout-content {
    overflow: auto;
  }
}
</style>
