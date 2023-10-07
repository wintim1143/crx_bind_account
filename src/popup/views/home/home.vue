


<template>
    <div class="P-home">
        <h1>Home Page</h1>

        <el-button type="primary" @click="getOrder">test</el-button>
    </div>
</template>

<script setup>
import { apiReqs } from '@/api';

function getOrder() {
  console.log('-0000000000000000000');
  apiReqs.apiFetch({
    method: 'GET',
    url: 'https://pay.qufenqian.vip/api/order/detail/1421540',
    success(data) {
      console.log('success: ', data);
    },
    fail(msg) {
      console.error('error: ', msg);
    }
  });
}
</script>


<style scoped lang="stylus">
.P-home
    position: absolute
    top: 0
    bottom: 0
    width: 100%
    background: linear-gradient(#f48c8d,#f4c58d)
    h1
        margin-top: 50px
        text-align: center
        color: #fff
        font-size: 40px
</style>