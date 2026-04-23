<script setup lang="ts">
import { ref, reactive } from 'vue'
import { FormInput, FormCheckbox, BaseButton, ImageUploader } from '@/components/form'

const form = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  rememberMe: false,
  gender: '',
  avatar: '',
  bio: '',
})

const errors = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const isSubmitting = ref(false)

function validateForm(): boolean {
  errors.username = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  let isValid = true

  if (!form.username.trim()) {
    errors.username = '请输入用户名'
    isValid = false
  } else if (form.username.length < 3) {
    errors.username = '用户名至少3个字符'
    isValid = false
  }

  if (!form.email.trim()) {
    errors.email = '请输入邮箱'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = '请输入有效的邮箱地址'
    isValid = false
  }

  if (!form.password) {
    errors.password = '请输入密码'
    isValid = false
  } else if (form.password.length < 6) {
    errors.password = '密码至少6个字符'
    isValid = false
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = '请确认密码'
    isValid = false
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = '两次输入的密码不一致'
    isValid = false
  }

  return isValid
}

async function handleSubmit() {
  console.log('表单提交触发，验证表单...')

  if (!validateForm()) {
    console.log('表单验证失败', errors)
    return
  }

  isSubmitting.value = true
  console.log('表单数据:', {
    username: form.username,
    email: form.email,
    password: form.password,
    rememberMe: form.rememberMe,
    avatar: form.avatar,
  })

  await new Promise((resolve) => setTimeout(resolve, 1000))

  isSubmitting.value = false
  console.log('模拟提交完成')
}

function handleReset() {
  form.username = ''
  form.email = ''
  form.password = ''
  form.confirmPassword = ''
  form.rememberMe = false
  form.avatar = ''
  errors.username = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
  console.log('表单已重置')
}

function handleInputChange(field: string, value: string | boolean) {
  console.log(`输入变化 - ${field}:`, value)
}

function handleAvatarSuccess(url: string) {
  console.log('图片上传成功:', url)
  form.avatar = url
}

function handleAvatarError(error: string) {
  console.log('图片上传失败:', error)
}

console.log('表单组件测试页面已加载')
</script>

<template>
  <div class="test-page">
    <div class="test-container">
      <h1 class="test-title">表单组件测试页面</h1>
      <p class="test-subtitle">测试所有表单组件的功能</p>

      <form class="test-form" @submit.prevent="handleSubmit">
        <div class="form-section">
          <h2 class="section-title">基础信息</h2>

          <FormInput
            v-model="form.username"
            label="用户名"
            placeholder="请输入用户名（至少3个字符）"
            :error="errors.username"
            @update:model-value="(v) => handleInputChange('username', v)"
          />

          <FormInput
            v-model="form.email"
            label="邮箱"
            type="email"
            placeholder="请输入邮箱地址"
            :error="errors.email"
            @update:model-value="(v) => handleInputChange('email', v)"
          />
        </div>

        <div class="form-section">
          <h2 class="section-title">密码设置</h2>

          <FormInput
            v-model="form.password"
            label="密码"
            type="password"
            placeholder="请输入密码（至少6个字符）"
            :error="errors.password"
            @update:model-value="(v) => handleInputChange('password', v)"
          />

          <FormInput
            v-model="form.confirmPassword"
            label="确认密码"
            type="password"
            placeholder="请再次输入密码"
            :error="errors.confirmPassword"
            @update:model-value="(v) => handleInputChange('confirmPassword', v)"
          />
        </div>

        <div class="form-section">
          <h2 class="section-title">偏好设置</h2>

          <FormCheckbox
            v-model="form.rememberMe"
            label="记住登录状态"
            @update:model-value="(v) => handleInputChange('rememberMe', v)"
          />
        </div>

        <div class="form-section">
          <h2 class="section-title">头像上传</h2>
          <p class="section-hint">点击上传真实图片到服务器</p>

          <ImageUploader
            v-model="form.avatar"
            :size="200"
            @upload-success="handleAvatarSuccess"
            @upload-error="handleAvatarError"
          />

          <p v-if="form.avatar" class="upload-result">
            上传成功，URL: {{ form.avatar }}
          </p>
        </div>

        <div class="form-actions">
          <BaseButton type="submit" variant="primary" size="large" :loading="isSubmitting">
            提交表单
          </BaseButton>
          <BaseButton type="button" variant="secondary" size="large" @click="handleReset">
            重置
          </BaseButton>
        </div>
      </form>

      <div class="button-demo">
        <h2 class="section-title">按钮组件示例</h2>
        <div class="button-group">
          <BaseButton variant="primary">Primary</BaseButton>
          <BaseButton variant="secondary">Secondary</BaseButton>
          <BaseButton variant="danger">Danger</BaseButton>
        </div>
        <div class="button-group">
          <BaseButton size="small">Small</BaseButton>
          <BaseButton size="medium">Medium</BaseButton>
          <BaseButton size="large">Large</BaseButton>
        </div>
        <div class="button-group">
          <BaseButton variant="primary" :loading="true">Loading</BaseButton>
          <BaseButton variant="primary" :disabled="true">Disabled</BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.test-page {
  min-height: 100vh;
  background: var(--color-bg);
  padding: 40px 20px;
}

.test-container {
  max-width: 600px;
  margin: 0 auto;
}

.test-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
  text-align: center;
}

.test-subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0 0 32px 0;
  text-align: center;
}

.test-form {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--color-border-soft);
}

.section-hint {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0;
}

.upload-result {
  font-size: 13px;
  color: var(--color-success, #52c41a);
  margin: 8px 0 0 0;
  word-break: break-all;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.form-actions > * {
  flex: 1;
}

.button-demo {
  margin-top: 32px;
  padding: 24px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
}

.button-demo .section-title {
  margin-bottom: 16px;
}

.button-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.button-group:last-child {
  margin-bottom: 0;
}
</style>
