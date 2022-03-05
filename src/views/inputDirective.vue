<template>
  <div>
    <a-input v-model:value="text" v-input="{length: 10, max: 5000, min: 10}" style="margin-bottom:10px"/>
    <input  v-input="{minus: true}" v-model="text1" style="display:block;margin-bottom:10px">
    <a-button type="primary" @click="onClick">获取最终值</a-button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        text: '',
        text1: ''
      }
    },
    methods: {
      onClick() {
        console.log(this.text, this.text1)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>