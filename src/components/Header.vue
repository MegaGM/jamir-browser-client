<template>
  <a-menu v-model="current" mode="horizontal">
    <template v-for="route in $router.options.routes">
      <a-menu-item :key="route.path" v-if="route.path !== '/XXX'">
        <!-- <a-icon type="mail" /> -->
        <router-link :to="route.path">{{route.name}}</router-link>
      </a-menu-item>
    </template>
  </a-menu>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Header extends Vue {
  @Prop() private msg!: string
  current: Array<string> = ['/']

  mounted() {
    console.info(`this.current`, this.current)
    console.info(`this.$route.path`, this.$route.path)
    setTimeout(() => {
      this.current.splice(0, 1, this.$route.path)
    }, 250)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
