<template>
  <footer>©2019 BTL Prof</footer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Header extends Vue { }
</script>

<style scoped lang="less">
footer {
  margin-top: 24px;
  text-align: center;
}
</style>
