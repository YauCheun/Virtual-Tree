# vue-virtree
### 基于vue3封装的，大数据量专用的tree组件

## [文档 & 示例](https://yaucheun.github.io/vue-virtree)

## 基本使用

```
npm i vue-virtree
```

全局注册, 但这会丢失类型，如果你用了typescript, 不推荐这种方式
``` js
import { createApp } from 'vue';
import VirTree from 'vue-virtree';

createApp(App).use(VirTree).mount('#app');

In components:
<vir-tree />
```


局部注册, 可以获得完整的类型
``` js
<template>
  <div class="demo">
    <vir-tree" :source="list" />
  </div>
</template>

<script lang="tsx">
  import {defineComponent, onMounted, ref} from 'vue';
  import { VirTree, TreeNodeOptions } from 'vue-virtree';

  export default defineComponent({
    name: 'BaseDemo',
    components: { VirTree },
    setup(props, {emit}) {
      const list = ref<TreeNodeOptions[]>([]);
      return {
        list
      }
    }
  });
</script>

```
