<template>
  <header>
    <a-menu v-model="currentPath" mode="horizontal">
      <template v-for="route in $router.options.routes">
        <a-menu-item :key="route.path" v-if="shouldMenuItemBeRendered(route.path)">
          <!-- <a-icon type="mail" /> -->
          <router-link :to="route.path">{{route.name}}</router-link>
        </a-menu-item>
      </template>
    </a-menu>
  </header>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'

@Component
export default class Header extends Vue {
  @Prop() private msg!: string
  // currentPath: Array<string> = [this.$route.path]
  currentPath: Array<string> = ['/']

  @Watch('$route', { immediate: true, deep: true })
  onUrlChange(newVal: any) {
    let href = this.$route.path
    // do not account trailing slash
    if (href !== '/' && href[href.length - 1] === '/') {
      href = href.substring(0, href.length - 1)
    }
    this.currentPath.splice(0, 1, href)
  }

  shouldMenuItemBeRendered(path: string) {
    return path !== '/auth'
  }
}
</script>

<style scoped lang="less">
.ant-menu {
  line-height: 64px;
  max-width: 1200px;
  margin: 0 auto;
}
header {
  text-align: center;
  background-color: white;
  margin-bottom: 50px;
}
</style>
