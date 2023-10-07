
<template>
  <el-config-provider namespace="CRX-el">
    <div class="CRX-content">
        <div class="content-entry" @click="isShowMainDialog=true"></div>
        <!-- <main-dialog :visible="isShowMainDialog" @onClose="() => {isShowMainDialog = false}"></main-dialog> -->
        <component :is="tabs[currentView]" :visible="isShowMainDialog" @onClose="() => {isShowMainDialog = false}"></component>
    </div>
  </el-config-provider>
</template>

<script setup>
  import { ref } from 'vue';
  import Ocean from './components/mainDialog/ocean.vue';
  import Kuaishou from './components/mainDialog/kuaishou.vue';

  const isShowMainDialog = ref(false)
  const currentView = ref('ocean');
  const tabs = {
    ocean: Ocean,
    kuaishou: Kuaishou
  };

</script>

<style scoped lang="stylus">
.CRX-content
    .content-entry
        position: fixed
        z-index: 9999
        bottom: 60px
        right: 20px
        width: 50px
        height: 50px
        background: url('images/content-icon.png')
        background-size: 100% 100%
        cursor: pointer
</style>