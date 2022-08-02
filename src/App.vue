<template>
  <el-container class="app-layout">
    <el-header class="header">
      <h2 class="title">vue-virtree</h2>
      <a
        class="link"
        href="https://github.com/YauCheun/vue-virtree"
        target="_blank"
        >github</a
      >
    </el-header>
    <el-affix :offset="120">
      <el-link type="primary" href="#usage" title="安装使用">安装使用</el-link
      ><br />
      <el-link type="primary" href="#usage" title="安装使用">安装使用</el-link
      ><br />
      <el-link type="primary" href="#usage" title="安装使用">安装使用</el-link
      ><br />
      <el-link type="primary" href="#usage" title="安装使用">安装使用</el-link
      ><br />
      <el-link type="primary" href="#usage" title="安装使用">安装使用</el-link>
    </el-affix>
    <el-main class="content">
      <doc-container />

      <!-- <a href="#usage" title="安装使用" />
        <a href="#base-demo" title="基本用法" />
        <a href="#checkbox-demo" title="可勾选" />
        <a href="#async-dada-demo" title="异步加载" />
        <a href="#custom-node-demo" title="自定义渲染节点" />
        <a href="#custom-icon-demo" title="自定义图标" />
        <a href="#api" title="API" />
      -->
    </el-main>
    <el-footer class="footer"> Vue-virtree by YauCheun </el-footer>
  </el-container>
</template>
<script lang="tsx">
import { defineComponent, ref } from "vue";
import DocContainer from "./doc/index.vue";
export default defineComponent({
  components: { DocContainer },
  setup() {
    return {
      selectedKeys: ref<string[]>(["2"]),
    };
  },
});
</script>
<style lang="scss" scoped>
$top-bottom-height: 64px;
.app-layout {
  .header {
    display: flex;
    align-items: center;
    color: $primary-color;
    height: $top-bottom-height;
    .title {
      color: inherit;
      margin: 0;
    }
    .link {
      margin-left: 20px;
      font-size: $font-size-mid;
    }
  }
  .el-affix {
    height: auto !important;
  }
  .content {
    position: relative;
    padding: 40px;
    min-height: calc(100vh - #{$top-bottom-height * 2});
    background-color: $white-color;
    // .anchor {
    //   position: absolute;
    //   right: 50px;
    //   top: 30px;
    // }
  }
  .footer {
    text-align: center;
  }
}
</style>
