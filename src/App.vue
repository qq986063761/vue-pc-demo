<template>
  <a-layout class="root-wrap">
    <a-layout-sider collapsible>
      <a-avatar :src="avatar" :size="60"/>
      <a-menu 
        theme="dark" 
        mode="inline" 
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
        @select="onSelect">
        <a-sub-menu 
          :key="item.key"
          v-for="item in menus">
          <template #title>
            <calculator-outlined />
            <span>{{item.label}}</span>
          </template>
          <a-menu-item
            :key="chlid.key"
            v-for="chlid in item.children">
            {{chlid.label}}
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout-content>
      <router-view class="root-view"></router-view>
    </a-layout-content>
  </a-layout>
</template>

<script>
import avatar from './assets/avatar.jpg'
import { CalculatorOutlined } from '@ant-design/icons-vue';

export default {
  components: {CalculatorOutlined},
  data() {
    return {
      avatar,
      selectedKeys: ['comment'],
      openKeys: ['comp'],
      menus: [
        {
          label: '组件',
          key: 'comp',
          children: [
            {
              key: 'comment',
              label: '评论'
            },
            {
              key: 'scrollBar',
              label: '悬浮滚动条'
            },
            {
              key: 'scaleTool',
              label: '拖拽缩放控件'
            }
          ]
        },
        {
          label: '指令',
          key: 'dir',
          children: [
            {
              key: 'disableRepeatClick',
              label: '防重复点击'
            },
            {
              key: 'drag',
              label: '拖拽'
            },
            {
              key: 'reasonablePosItem',
              label: '激活到合适的item'
            }
          ]
        },
        {
          label: 'demo',
          key: 'demo',
          children: [
            {
              key: 'carousel',
              label: '轮播'
            }
          ]
        }
      ]
    }
  },
  methods: {
    onSelect({ item, key, selectedKeys }) {
      console.log({ item, key, selectedKeys })
      this.$router.push({name: key})
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

.root-view {
  padding: 20px;
}
</style>
