<template>
  <div class="scale-tool-demo">
    <div class="scroller" ref="scroller">
      <div ref="content" class="content">
        <div class="item" v-for="item in data" :key="item"></div>
      </div>
    </div>
    <scale-tool :data="data" :scroller="scroller" :content="content"></scale-tool>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        scroller: null,
        content: null,
        data: [{}, {}, {}, {}]
      }
    },
    mounted() {
      this.scroller = this.$refs.scroller
      this.content = this.$refs.content
    }
  }
</script>

<style lang="scss">
  .scale-tool-demo {
    position: relative;
    height: 100%;
    .scroller {
      height: 100%;
    }
    .item {
      width: 200px;
      height: 150px;
      background: #fff;
      + .item {
        margin-top: 10px;
      }
    }
  }
</style>