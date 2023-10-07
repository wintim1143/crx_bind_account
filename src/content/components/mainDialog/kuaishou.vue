<template>
  <el-dialog
    v-model="isVisible"
    v-if="isVisible"
    title="快手罗盘账户解绑"
    width="90%"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    style="max-height: 600px; overflow-y: auto;"
  >
    <div class="main-content-con">
      <el-upload :auto-upload="false" :show-file-list="false" :on-change="uploadCsv" accept=".csv">
        <el-button type="primary">上传</el-button>
      </el-upload>

      <el-button @click="getMessageList">getMessages</el-button>

      <p>账户个数：<span>{{ advCount }}</span></p>

      <div class="line" v-for="line in logs" :key="line.id" >
        <span :style="{ color: line.color }" :key="line.index">{{ line.text }}</span>
      </div>
    </div>
    <template #footer>
      <!-- <el-button type="primary" @click="getOrder"> Submit </el-button> -->
    </template>
  </el-dialog>
</template>

<style scoped lang="stylus"></style>

<script setup>
import { ref, computed, reactive } from 'vue'
import { apiReqs } from '@/api'

// 接受父组件传递的方法
const emit = defineEmits(['onClose'])
// 接收父组件传递的参数
const props = defineProps(['visible'])

// 输入框中的内容
const logs = reactive([]);
const advCount = ref(0);

// 是否显示对话框
const isVisible = computed({
    get() {
        return props.visible
    },
    set() {
        // 关闭对话框的时候，会触发对isVisible=false的修改
        // 通知父组件将对话框显示状态设置为false
        emit('onClose')
    },
})


/**
  * ------------------  方法申明 ----------------------
  */
async function getFileContent(file) {
  return new Promise((r) => {
    const reader = new FileReader();
    reader.onload = function fileReadCompleted() {
      // 当读取完成时，内容只在`reader.result`中
      r(reader.result);
    };
    reader.readAsText(file.raw);
  });
}

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function uploadCsv(file) {
  const content = await getFileContent(file);
  const [_, ...advs] = content.split('\n');
  const list = [];
  for (const item of advs) {
    const [ name, id ] = item.split(',');
    if (!name || !id) continue;
    list.push({ name: name.trim(), id: id.trim() });
  }
  advCount.value = list.length

  for (let index=0; index<list.length; index++) {
    const item = list[index];

    await delay(Math.random() * 1000);
    const color = Math.random() > 0.5 ? 'green' : 'red';
    logs.push({ index, color, text: item.id });
  }
}

async function getMessageList() {
  const res = await apiReqs.kuaishou.getMessageList();
  console.log('getMessageList: ', res);
}


</script>

