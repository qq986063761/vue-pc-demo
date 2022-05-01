<template>
  <div class="scale-tool-node">
    <div class="node-content" @click="onOpen"></div>
    <div class="children" v-if="open && data.children">
      <node
        :data="item" 
        v-for="item in data.children" 
        :key="item">
      </node>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'node',
    props: {
      data: Object
    },
    data() {
      return {
        open: false
      }
    },
    methods: {
      onOpen() {
        this.open = !this.open
        if (!this.data.children) {
          this.data.children = [{}, {}, {}]
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .scale-tool-node {
    display: flex;
    .node-content {
      width: 200px;
      height: 150px;
      background: #fff;
      cursor: pointer;
      flex-shrink: 0;
      &:hover {
        border: 1px solid blue;
      }
    }
    .children {
      padding-left: 10px;
      flex-shrink: 0;
    }
    + .scale-tool-node {
      margin-top: 10px;
    }
  }
</style>