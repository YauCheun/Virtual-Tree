<template>
  <div class="contianer">
    <tree-demo></tree-demo>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import treeDemo from "./components/tree/demo.vue";
// import listDemo from "./components/VirList/demo.vue";
export default defineComponent({
  name: "App",
  components: {
    // demoInput,
    treeDemo,
  },
});
</script>

<style lang="scss">
.contianer {
  color: $text-color;
}
</style>
