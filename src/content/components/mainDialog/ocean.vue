<template>
  <el-dialog
    v-model="isVisible"
    v-if="isVisible"
    title="巨量账户换绑"
    width="90%"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    style="max-height: 600px; overflow-y: auto;"
  >
    <div class="main-content-con">
      <el-form label-width="120px">
        <el-form-item label="csv文件上传：">
          <el-upload :auto-upload="false" :show-file-list="false" :on-change="uploadCsv" accept=".csv">
            <el-button type="primary" size="small">上传</el-button>
            <template #tip>
              <div class="el-upload__tip">
                账户个数：<span>{{ advCount }}</span>
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="新管家账户：">
          <el-input v-model.trim="email"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" @click="bindAccountBatch">开始</el-button>
        </el-form-item>
      </el-form>
      
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
import { ElMessage } from 'element-plus'
import { useCookies } from "vue3-cookies";

const { cookies } = useCookies();

// 接受父组件传递的方法
const emit = defineEmits(['onClose'])
// 接收父组件传递的参数
const props = defineProps(['visible'])

// 输入框中的内容
const logs = reactive([]);
const advCount = ref(0);
const list = ref([]);
const groupId = '2607691052891134';
const email = ref('');

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
    reader.readAsText(file.raw, 'gbk');
  });
}

async function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function uploadCsv(file) {
  const content = await getFileContent(file);
  const [_, ...advs] = content.split('\n');

  list.value = [];
  for (const item of advs) {
    const [ name, id ] = item.split(',');
    if (!name || !id) continue;
    list.value.push({ name: name.trim(), id: id.trim() });
  }
  advCount.value = list.value.length

  
}

async function bindAccountBatch() {
  if (!email.value) {
    return ElMessage({ message: '换绑的管家账户不能为空', type: 'error' });
  }
  if (!list.value.length)  {
    return ElMessage({ message: '账户列表为空', type: 'error' });
  }

  const { name, id } = list.value[0];
  if (!/^\d{16}$/.test(id)) {
    return ElMessage({ message: '必须账户名在第一列，账户id在第二列', type: 'error' });
  }

  const token = cookies.get('csrftoken');
  if (!token) {
    return ElMessage({ message: '请重新登陆', type: 'error' });
  }

  for (let index=0; index<list.value.length; index++) {
    const item = list.value[index];
    await bindAccount(item, index, token);
    // if (index >= 3) return;
  }
}

// 账户绑定
async function bindAccount(item, i, token) {
  const { name, id } = item;
  try {
    const options = {
      url: `https://business.oceanengine.com/nbs/api/bm/adv_account/change_bind_adv_account?group_id=${groupId}`,
      method: 'POST',
      data: {
        "account_id": id,
        "adv_type": 1,
        "collaborator": false,
        "email": email.value,
        "group_id": groupId,
        "op_type": 1,
        "role": 2,
      },
      headers: {
        'x-csrftoken': token,
      },
    };
    // const { code, msg } = await axios.request(options).then(res => res.data);
    const { code, msg } = await apiReqs.oceanRequest(options);

    if (code !== 0) throw new Error(`${code} ${msg}`);
    logs.push({ index: i, color: 'green', text: `${i}: [${id}](${name})转绑成功` });
  } catch(err) {
    const text = `${i}: [${id}](${name})转绑失败:` + ( err.message || '未知错误' ) ;
    logs.push({ index: i, color: 'red', text });
  } finally {
    await delay(1000);
  }
}

</script>

