<template>
  <div>
    <a-button type="primary" v-disable-repeat-click @click="onClick">点击</a-button>
  </div>
</template>

<script>
export default {
  methods: {
    onClick() {
      console.log('click')
    }
  }
}
</script>