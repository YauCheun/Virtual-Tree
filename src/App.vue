<template>
  <div class="contianer">
    <list-demo></list-demo>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import treeDemo from "./components/tree/demo.vue";
import listDemo from "./components/VirList/demo.vue";
export default defineComponent({
  name: "App",
  components: {
    // demoInput,
    listDemo,
  },
});
</script>

<style lang="scss">
.contianer {
  color: $text-color;
}
</style>
