<script setup lang="ts">
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1 class="login-title">欢迎回来</h1>
          <p class="login-subtitle">请登录您的账户以继续</p>
        </div>

        <form class="login-form">
          <div class="form-group">
            <label for="username" class="form-label">用户名 / 邮箱</label>
            <input type="text" id="username" class="form-input" placeholder="请输入用户名或邮箱" />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">密码</label>
            <input type="password" id="password" class="form-input" placeholder="请输入密码" />
          </div>

          <div class="form-options">
            <label class="checkbox-wrapper">
              <input type="checkbox" class="checkbox-input" />
              <span class="checkbox-label">记住登录状态</span>
            </label>
            <a href="#" class="link-forgot">忘记密码？</a>
          </div>

          <button type="submit" class="btn-login">登 录</button>
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
