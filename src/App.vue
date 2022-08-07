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
    <el-affix :offset="120" id="left-affix">
      <el-link
        :type="currentIndex !== index ? 'default' : 'primary'"
        v-for="(item, index) in linkList"
        :key="item.id"
        :href="item.id"
        :title="item.title"
        >{{ item.title }}</el-link
      >
      <!-- <el-link type="default" href="#base-demo" title="基本用法"
        >基本用法</el-link
      >
      <el-link type="primary" href="#checkbox-demo" title="可勾选"
        >可勾选</el-link
      >
      <el-link type="primary" href="#async-dada-demo" title="异步加载"
        >异步加载</el-link
      >
      <el-link type="primary" href="#custom-node-demo" title="自定义渲染节点"
        >自定义渲染节点</el-link
      >

      <el-link type="primary" href="#custom-icon-demo" title="自定义图标"
        >自定义图标</el-link
      >
      <el-link type="primary" href="#api" title="API">API</el-link>
      <el-link type="primary" href="#vir-list" title="虚拟列表prop"
        >虚拟列表prop</el-link
      > -->
    </el-affix>
    <el-main class="content">
      <doc-container @update-index="updateIndex" />

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
import { defineComponent, onBeforeUnmount, onMounted, ref } from "vue";
import DocContainer from "./doc/index.vue";
export default defineComponent({
  components: { DocContainer },
  setup() {
    let currentIndex = ref(0);
    const linkList = [
      {
        title: "安装使用",
        id: "#usage",
      },
      {
        title: "基本用法",
        id: "#base-demo",
      },
      {
        title: "异步加载",
        id: "#async-dada-demo",
      },
      {
        title: "自定义图标",
        id: "#custom-icon-demo",
      },
      {
        title: "可勾选",
        id: "#checkbox-demo",
      },

      {
        title: "自定义渲染节点",
        id: "#custom-node-demo",
      },

      {
        title: "API",
        id: "#api",
      },
      {
        title: "虚拟列表prop",
        id: "#vir-list",
      },
    ];
    const updateIndex = (index: number) => {
      console.log(index);
      currentIndex.value = index;
    };
    return {
      selectedKeys: ref<string[]>(["2"]),
      linkList,
      currentIndex,
      updateIndex,
    };
  },
});
</script>
<style lang="scss" scoped>
::v-deep.el-link {
  display: block;
  max-width: 100px;
  text-align: center;
}
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
    padding-top: 0;
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
