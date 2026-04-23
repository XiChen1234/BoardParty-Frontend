<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
  loading: false,
  disabled: false,
  type: 'button',
})

const buttonClasses = computed(() => [
  'base-button',
  `base-button--${props.variant}`,
  `base-button--${props.size}`,
  {
    'base-button--loading': props.loading,
    'base-button--disabled': props.disabled,
  },
])
</script>

<template>
  <button :class="buttonClasses" :type="type" :disabled="disabled || loading">
    <span v-if="loading" class="button-loading"></span>
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
}

.base-button:active:not(:disabled) {
  transform: scale(0.98);
}

.base-button--small {
  height: 36px;
  padding: 0 16px;
  font-size: 14px;
}

.base-button--medium {
  height: 44px;
  padding: 0 20px;
  font-size: 14px;
}

.base-button--large {
  height: 48px;
  padding: 0 24px;
  font-size: 16px;
}

.base-button--primary {
  color: var(--button-primary-text);
  background: var(--button-primary-bg);
}

.base-button--primary:hover:not(:disabled) {
  background: var(--button-primary-hover);
}

.base-button--secondary {
  color: var(--button-secondary-text);
  background: var(--button-secondary-bg);
  border: 1px solid var(--button-secondary-border);
}

.base-button--secondary:hover:not(:disabled) {
  background: var(--button-secondary-hover);
}

.base-button--danger {
  color: var(--button-danger-text);
  background: var(--button-danger-bg);
}

.base-button--danger:hover:not(:disabled) {
  background: var(--button-danger-hover);
}

.base-button--disabled,
.base-button:disabled {
  cursor: not-allowed;
  transform: none;
}

.base-button--disabled.base-button--primary,
.base-button--primary:disabled {
  background: var(--button-primary-hover);
}

.base-button--disabled.base-button--secondary,
.base-button--secondary:disabled {
  background: var(--button-secondary-hover);
}

.base-button--disabled.base-button--danger,
.base-button--danger:disabled {
  background: var(--button-danger-hover);
}

.base-button--loading {
  cursor: wait;
}

.button-loading {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
