<script setup lang="ts">
import { useUserStore } from '@/store/userStore';
import type { LoginRequest } from '@/types/authType';
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import PageLoading from '@/components/loading/PageLoading.vue';
import { toast } from '@/utils/toast';
import { FormInput, FormCheckbox, BaseButton } from '@/components/form'
import type { CommonError } from '@/types/apiType';

const router = useRouter()
const userStore = useUserStore()
const form = reactive({
  username: '',
  password: '',
  rememberLogin: false,
})
const isLoading = ref(false)
const errors = reactive({
  username: '',
  password: '',
})

/**
 * 处理登录提交
 * 验证表单，调用登录接口，成功后跳转到列表页
 * 失败后显示错误提示
 * @param event 登录表单提交事件
 */
async function handleLogin() {
  if (!validateForm()) {
    return
  }
  errors.username = ''
  errors.password = ''
  isLoading.value = true

  try {
    const payload: LoginRequest = {
      username: form.username.trim(),
      password: form.password,
    }

    await userStore.loginAction(payload, form.rememberLogin)

    router.push('/list')
    toast.success('欢迎您，' + (userStore.userInfo?.username || '尊敬的用户'))
  } catch (error) {
    const e = error as CommonError
    console.error('登陆失败:', e)
    toast.error(e.message || '登录失败，请检查用户名和密码')
  } finally {
    isLoading.value = false
  }
}

/**
 * 验证登录表单
 * 检查用户名和密码是否为空
 * @returns 如果用户名和密码都非空，返回true，否则返回false
 */
function validateForm(): boolean {
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
          <FormInput v-model="form.username" label="用户名 / 邮箱" placeholder="请输入用户名或邮箱" :error="errors.username"
            :disabled="isLoading" />

          <FormInput v-model="form.password" type="password" label="密码" placeholder="请输入密码" :error="errors.password"
            :disabled="isLoading" />

          <div class="form-options">
            <FormCheckbox v-model="form.rememberLogin" label="记住登录状态" :disabled="isLoading" />
            <a href="#" class="link-forgot">忘记密码？</a>
          </div>

          <BaseButton type="submit" variant="primary" size="large" :loading="isLoading" :disabled="isLoading">
            登 录
          </BaseButton>
        </form>

        <div class="login-footer">
          <span class="footer-text">还没有账户？</span>
          <a href="#" class="link-register">立即注册</a>
        </div>
      </div>
    </div>
  </div>
  <PageLoading :show="isLoading" text="登录中..." />
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

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
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
