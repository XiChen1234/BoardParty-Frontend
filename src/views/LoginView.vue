<script setup lang="ts">
import { useUserStore } from '@/store/userStore';
import type { LoginRequest } from '@/types/authType';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const userStore = useUserStore()
// 登录表单数据
const form = reactive({
  username: '',
  password: '',
  rememberLogin: false,
})
const isLoading = ref(false) // 登录中状态
// 登录错误信息
const errors = reactive({
  username: '',
  password: '',
})

async function handleLogin() {
  if (!validateForm()) {
    return
  }
  isLoading.value = true

  try {
    const request: LoginRequest = {
      username: form.username.trim(),
      password: form.password,
    }
    await userStore.loginAction(request, form.rememberLogin)
    router.push('/list')
  } catch (error) {
    console.error('登陆失败:', error)
  } finally {
    isLoading.value = false
  }
}

function validateForm(): boolean {
  errors.username = ''
  errors.password = ''

  if (!form.username.trim()) {
    errors.username = '请输入用户名或邮箱'
  }

  if (!form.password.trim()) {
    errors.password = '请输入密码'
  }
  return !errors.username && !errors.password
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1 class="login-title">欢迎回来</h1>
          <p class="login-subtitle">请登录您的账户以继续</p>
        </div>

        <form class="login-form" @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="username" class="form-label">用户名 / 邮箱</label>
            <input id="username" v-model="form.username" type="text" class="form-input"
              :class="{ 'form-input--error': errors.username }" placeholder="请输入用户名或邮箱" :disabled="isLoading" />
            <span v-if="errors.username" class="form-error">{{ errors.username }}</span>
          </div>

          <div class="form-group">
            <label for="password" class="form-label">密码</label>
            <input id="password" v-model="form.password" type="password" class="form-input"
              :class="{ 'form-input--error': errors.password }" placeholder="请输入密码" :disabled="isLoading" />
            <span v-if="errors.password" class="form-error">{{ errors.password }}</span>
          </div>

          <div class="form-options">
            <label class="checkbox-wrapper">
              <input v-model="form.rememberLogin" type="checkbox" class="checkbox-input" :disabled="isLoading" />
              <span class="checkbox-label">记住登录状态</span>
            </label>
            <a href="#" class="link-forgot">忘记密码？</a>
          </div>

          <button type="submit" class="btn-login" :disabled="isLoading">
            <span v-if="isLoading" class="btn-login__loading">登 录 中...</span>
            <span v-else>登 录</span>
          </button>
        </form>

        <div class="login-footer">
          <span class="footer-text">还没有账户？</span>
          <a href="#" class="link-register">立即注册</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 420px;
}

.login-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--card-radius);
  padding: 48px 40px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
}

.login-subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.form-input {
  width: 100%;
  height: 44px;
  padding: 0 16px;
  font-size: 14px;
  color: var(--color-text-primary);
  background: var(--input-bg);
  border: 1px solid var(--input-border);
  border-radius: 8px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: var(--color-text-placeholder);
}

.form-input:focus {
  border-color: var(--input-focus-border);
  box-shadow: 0 0 0 3px rgba(58, 95, 122, 0.15);
}

.form-input--error {
  border-color: var(--color-danger);
}

.form-input--error:focus {
  box-shadow: 0 0 0 3px rgba(199, 80, 71, 0.15);
}

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-error {
  font-size: 12px;
  color: var(--color-danger);
  margin-top: 4px;
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.checkbox-input {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary);
  cursor: pointer;
}

.checkbox-label {
  color: var(--color-text-secondary);
}

.link-forgot {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.link-forgot:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}

.btn-login {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  color: var(--button-primary-text);
  background: var(--button-primary-bg);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
  margin-top: 8px;
}

.btn-login:hover {
  background: var(--button-primary-hover);
}

.btn-login:active {
  transform: scale(0.98);
}

.btn-login:disabled {
  background: var(--button-primary-hover);
  cursor: not-allowed;
  transform: none;
}

.btn-login__loading {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.login-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border-soft);
}

.footer-text {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.link-register {
  color: var(--color-primary);
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
}

.link-register:hover {
  color: var(--color-primary-hover);
  text-decoration: underline;
}
</style>
