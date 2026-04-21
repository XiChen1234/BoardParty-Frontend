<script setup lang="ts">
import { toast } from '@/utils/toast'

function testSuccess() {
  toast.success('操作成功')
}

function testInfo() {
  toast.info('这是一条提示信息')
}

function testWarn() {
  toast.warn('警告信息')
}

function testError() {
  toast.error('发生了错误错误')
}

function testMany() {
  for (let i = 0; i < 10; i++) {
    toast.info(`toast ${i}`)
  }
}
</script>

<template>
  <div style="padding:40px">
    <h2>Toast 测试</h2>

    <button @click="testSuccess">Success</button>
    <button @click="testInfo">Info</button>
    <button @click="testWarn">Warn</button>
    <button @click="testError">Error</button>
    <button @click="testMany">连续触发</button>
  </div>
</template>
