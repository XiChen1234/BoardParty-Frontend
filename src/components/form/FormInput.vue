<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string
  label?: string
  type?: string
  placeholder?: string
  error?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  placeholder: '',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
})
</script>

<template>
  <div class="form-group">
    <label v-if="label" for="form-input" class="form-label">{{ label }}</label>
    <input id="form-input" v-model="inputValue" :type="type" class="form-input" :class="{ 'form-input--error': error }"
      :placeholder="placeholder" :disabled="disabled" />
    <span v-if="error" class="form-error">{{ error }}</span>
  </div>
</template>

<style scoped>
.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 4px;
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
}
</style>
