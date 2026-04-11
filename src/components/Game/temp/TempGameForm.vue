<script setup lang="ts">
import { ref, reactive } from 'vue'

/**
 * 桌游表单数据类型
 */
interface GameFormData {
  name: string
  description: string
  minPlayer: number | null
  maxPlayer: number | null
  duration: number | null
  images: PreviewImage[]
  star: number
  tags: string[]
}

/**
 * 本地预览图片类型
 */
interface PreviewImage {
  url: string
  name: string
}

/**
 * 表单验证错误类型
 */
interface FormErrors {
  name?: string
  description?: string
  minPlayer?: string
  maxPlayer?: string
  duration?: string
  images?: string
  star?: string
  tags?: string
}

/**
 * 允许的图片类型
 */
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

/**
 * 最大图片大小（5MB）
 */
const MAX_IMAGE_SIZE = 5 * 1024 * 1024

/**
 * 最多图片数量
 */
const MAX_IMAGE_COUNT = 9

/**
 * 弹窗状态
 */
const showModal = ref(false)
const modalMessage = ref('')
const modalType = ref<'success' | 'error'>('success')

/**
 * 表单锁定状态（提交成功后锁定）
 */
const isLocked = ref(false)

/**
 * 表单数据
 */
const formData = reactive<GameFormData>({
  name: '',
  description: '',
  minPlayer: null,
  maxPlayer: null,
  duration: null,
  images: [],
  star: 5,
  tags: []
})

/**
 * 表单验证错误
 */
const errors = reactive<FormErrors>({})

/**
 * 标签输入
 */
const tagInput = ref('')

/**
 * 处理文件选择
 * @param event - 文件选择事件
 */
const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) {
    return
  }

  const files = Array.from(input.files)

  if (formData.images.length + files.length > MAX_IMAGE_COUNT) {
    errors.images = `最多只能上传${MAX_IMAGE_COUNT}张图片`
    input.value = ''
    return
  }

  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      errors.images = '仅支持 JPG、PNG、GIF、WebP 格式图片'
      continue
    }

    if (file.size > MAX_IMAGE_SIZE) {
      errors.images = '单张图片大小不能超过 5MB'
      continue
    }

    const previewUrl = URL.createObjectURL(file)
    formData.images.push({
      url: previewUrl,
      name: file.name
    })
  }

  errors.images = ''
  input.value = ''
}

/**
 * 移除已上传的图片
 * @param index - 图片索引
 */
const removeImage = (index: number) => {
  if (formData.images[index]) {
    URL.revokeObjectURL(formData.images[index]!.url)
  }
  formData.images.splice(index, 1)
}

/**
 * 验证表单数据
 * @returns 是否验证通过
 */
const validateForm = (): boolean => {
  Object.keys(errors).forEach(key => delete (errors as Record<string, unknown>)[key])

  let isValid = true

  if (!formData.name.trim()) {
    errors.name = '请输入桌游名称'
    isValid = false
  } else if (formData.name.length > 50) {
    errors.name = '桌游名称不能超过50个字符'
    isValid = false
  }

  if (!formData.description.trim()) {
    errors.description = '请输入详细描述'
    isValid = false
  } else if (formData.description.length > 500) {
    errors.description = '详细描述不能超过500个字符'
    isValid = false
  }

  if (formData.minPlayer === null || formData.minPlayer < 1) {
    errors.minPlayer = '最小玩家数量不能少于1'
    isValid = false
  }

  if (formData.maxPlayer === null || formData.maxPlayer < 1) {
    errors.maxPlayer = '最大玩家数量不能少于1'
    isValid = false
  }

  if (formData.minPlayer !== null && formData.maxPlayer !== null) {
    if (formData.minPlayer > formData.maxPlayer) {
      errors.minPlayer = '最小玩家数量不能大于最大玩家数量'
      isValid = false
    }
  }

  if (formData.duration === null || formData.duration < 1) {
    errors.duration = '单局持续时间不能少于1分钟'
    isValid = false
  } else if (formData.duration > 600) {
    errors.duration = '单局持续时间不能超过600分钟'
    isValid = false
  }

  if (formData.images.length === 0) {
    errors.images = '请至少上传一张图片'
    isValid = false
  }

  if (formData.star < 1 || formData.star > 10) {
    errors.star = '评分必须在1-10之间'
    isValid = false
  }

  if (formData.tags.length > 10) {
    errors.tags = '标签数量不能超过10个'
    isValid = false
  }

  return isValid
}

/**
 * 添加标签
 */
const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !formData.tags.includes(tag)) {
    if (formData.tags.length >= 10) {
      errors.tags = '标签数量不能超过10个'
      return
    }
    formData.tags.push(tag)
    tagInput.value = ''
  }
}

/**
 * 移除标签
 * @param index - 标签索引
 */
const removeTag = (index: number) => {
  formData.tags.splice(index, 1)
}

/**
 * 处理键盘事件
 * @param event - 键盘事件
 */
const handleTagKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault()
    addTag()
  }
}

/**
 * 提交表单
 */
const handleSubmit = () => {
  if (validateForm()) {
    modalType.value = 'success'
    modalMessage.value = '提交成功，表单已锁定'
    showModal.value = true
    isLocked.value = true
  } else {
    modalType.value = 'error'
    const errorMessages = Object.values(errors).filter(Boolean)
    if (errorMessages.length > 0) {
      modalMessage.value = errorMessages[0] as string
    } else {
      modalMessage.value = '请检查表单填写'
    }
    showModal.value = true
  }
}

/**
 * 清空表单
 */
const resetForm = () => {
  Object.assign(formData, {
    name: '',
    description: '',
    minPlayer: null,
    maxPlayer: null,
    duration: null,
    images: [],
    star: 5,
    tags: []
  })
  Object.keys(errors).forEach(key => delete (errors as Record<string, unknown>)[key])
  tagInput.value = ''
  isLocked.value = false
}

/**
 * 关闭弹窗
 */
const closeModal = () => {
  showModal.value = false
}

/**
 * 返回上一页
 */
const goBack = () => {
  window.history.back()
}
</script>

<template>
  <div class="temp-form-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <button class="back-btn" @click="goBack">
        <i class="iconfont icon-back"></i>
      </button>
      <h1 class="page-title">桌游数据录入</h1>
      <div class="placeholder"></div>
    </div>

    <!-- 表单内容 -->
    <div class="form-content" :class="{ locked: isLocked }">
      <!-- 桌游名称 -->
      <div class="form-group">
        <label class="form-label">
          桌游名称
          <span class="required">*</span>
        </label>
        <input v-model="formData.name" type="text" class="form-input" :class="{ 'input-error': errors.name }"
          placeholder="请输入桌游名称" maxlength="50" :disabled="isLocked" />
        <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
        <span class="char-count">{{ formData.name.length }}/50</span>
      </div>

      <!-- 详细描述 -->
      <div class="form-group">
        <label class="form-label">
          详细描述
          <span class="required">*</span>
        </label>
        <textarea v-model="formData.description" class="form-textarea" :class="{ 'input-error': errors.description }"
          placeholder="请输入详细描述" rows="4" maxlength="500" :disabled="isLocked"></textarea>
        <span v-if="errors.description" class="error-text">{{ errors.description }}</span>
        <span class="char-count">{{ formData.description.length }}/500</span>
      </div>

      <!-- 玩家数量 -->
      <div class="form-group">
        <label class="form-label">
          玩家数量要求
          <span class="required">*</span>
        </label>
        <div class="player-inputs">
          <div class="player-input-item">
            <input v-model.number="formData.minPlayer" type="number" class="form-input"
              :class="{ 'input-error': errors.minPlayer }" placeholder="最小" min="1" max="100" :disabled="isLocked" />
            <span class="input-suffix">人</span>
          </div>
          <span class="range-separator">至</span>
          <div class="player-input-item">
            <input v-model.number="formData.maxPlayer" type="number" class="form-input"
              :class="{ 'input-error': errors.maxPlayer }" placeholder="最大" min="1" max="100" :disabled="isLocked" />
            <span class="input-suffix">人</span>
          </div>
        </div>
        <span v-if="errors.minPlayer || errors.maxPlayer" class="error-text">
          {{ errors.minPlayer || errors.maxPlayer }}
        </span>
      </div>

      <!-- 单局持续时间 -->
      <div class="form-group">
        <label class="form-label">
          单局持续时间
          <span class="required">*</span>
        </label>
        <div class="duration-input">
          <input v-model.number="formData.duration" type="number" class="form-input"
            :class="{ 'input-error': errors.duration }" placeholder="请输入时长" min="1" max="600" :disabled="isLocked" />
          <span class="input-suffix">分钟</span>
        </div>
        <span v-if="errors.duration" class="error-text">{{ errors.duration }}</span>
      </div>

      <!-- 评分 -->
      <div class="form-group">
        <label class="form-label">
          评分
          <span class="required">*</span>
        </label>
        <div class="rating-input">
          <input v-model.number="formData.star" type="number" class="form-input" :class="{ 'input-error': errors.star }"
            placeholder="1-10" min="1" max="10" :disabled="isLocked" />
          <div class="star-display">
            <i v-for="i in 5" :key="i" class="iconfont"
              :class="i <= Math.round(formData.star / 2) ? 'icon-star-full' : 'icon-star-empty'"></i>
          </div>
        </div>
        <span v-if="errors.star" class="error-text">{{ errors.star }}</span>
      </div>

      <!-- Tag列表 -->
      <div class="form-group">
        <label class="form-label">
          Tag列表
        </label>
        <div class="tag-input-container">
          <input v-model="tagInput" type="text" class="form-input tag-input" placeholder="输入标签后按回车添加" maxlength="20"
            @keydown="handleTagKeydown" :disabled="isLocked" />
          <button type="button" class="add-tag-btn" @click="addTag" :disabled="isLocked">添加</button>
        </div>
        <div class="tag-list" v-if="formData.tags.length > 0">
          <span v-for="(tag, index) in formData.tags" :key="index" class="tag-item">
            {{ tag }}
            <span class="tag-remove" @click="removeTag(index)">×</span>
          </span>
        </div>
        <span v-if="errors.tags" class="error-text">{{ errors.tags }}</span>
      </div>

      <!-- 图片列表 -->
      <div class="form-group">
        <label class="form-label">
          图片列表
          <span class="required">*</span>
          <span class="label-hint">（第一张将作为桌游icon）</span>
        </label>

        <!-- 已上传图片预览 -->
        <div class="image-grid" v-if="formData.images.length > 0">
          <div v-for="(image, index) in formData.images" :key="image.url" class="image-item"
            :class="{ 'is-icon': index === 0 }">
            <img :src="image.url" :alt="image.name" />
            <button class="remove-btn" @click="removeImage(index)">
              <i class="iconfont icon-close"></i>
            </button>
            <div v-if="index === 0" class="icon-badge">Icon</div>
          </div>
        </div>

        <!-- 上传按钮 -->
        <div class="upload-container" v-if="formData.images.length < MAX_IMAGE_COUNT && !isLocked">
          <label class="upload-btn" :class="{ disabled: isLocked }">
            <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" multiple @change="handleFileSelect"
              :disabled="isLocked" />
            <i class="iconfont icon-upload"></i>
            <span>上传图片</span>
          </label>
          <span class="upload-hint">支持 JPG、PNG、GIF、WebP 格式，单张最大 5MB</span>
        </div>

        <span v-if="errors.images" class="error-text">{{ errors.images }}</span>
        <div class="selected-info" v-if="formData.images.length > 0">
          已上传 {{ formData.images.length }}/{{ MAX_IMAGE_COUNT }} 张图片
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="form-actions">
        <button type="button" class="submit-btn" :disabled="isLocked" @click="handleSubmit">
          {{ isLocked ? '已提交' : '提交' }}
        </button>
        <button type="button" class="reset-btn" v-if="isLocked" @click="resetForm">
          清空
        </button>
      </div>
    </div>

    <!-- 弹窗 -->
    <div class="modal-overlay" v-if="showModal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-icon" :class="modalType">
          <i class="iconfont" :class="modalType === 'success' ? 'icon-success' : 'icon-error'"></i>
        </div>
        <div class="modal-message">{{ modalMessage }}</div>
        <button class="modal-btn" @click="closeModal">确定</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.temp-form-page {
  min-height: 100vh;
  background: var(--color-bg-page);
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--color-bg-card);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.back-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.back-btn:hover {
  background: var(--color-bg-soft);
}

.back-btn .iconfont {
  font-size: 24px;
  color: var(--color-text-primary);
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.placeholder {
  width: 32px;
}

.form-content {
  padding: 16px;
  transition: opacity 0.3s;
}

.form-content.locked .form-input,
.form-content.locked .form-textarea {
  opacity: 0.6;
  background: var(--color-bg-disabled, #f5f5f5);
  color: var(--color-text-disabled, #999);
}

.form-content.locked .tag-list .tag-item {
  opacity: 0.6;
}

.form-content.locked .add-tag-btn {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-group {
  margin-bottom: 24px;
  position: relative;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.required {
  color: var(--color-danger);
  margin-left: 2px;
}

.label-hint {
  font-weight: 400;
  color: var(--color-text-tertiary);
  font-size: 12px;
  margin-left: 4px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 12px;
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  color: var(--color-text-primary);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-focus-bg);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: var(--color-text-placeholder);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.input-error {
  border-color: var(--color-danger);
}

.input-error:focus {
  box-shadow: 0 0 0 3px var(--color-error-bg);
}

.error-text {
  display: block;
  color: var(--color-danger);
  font-size: 12px;
  margin-top: 4px;
}

.char-count {
  position: absolute;
  right: 12px;
  bottom: -20px;
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.player-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
}

.player-input-item {
  display: flex;
  align-items: center;
  flex: 1;
}

.player-input-item .form-input {
  flex: 1;
}

.range-separator {
  color: var(--color-text-tertiary);
  font-size: 14px;
}

.input-suffix {
  margin-left: 8px;
  color: var(--color-text-tertiary);
  font-size: 14px;
}

.duration-input {
  display: flex;
  align-items: center;
}

.duration-input .form-input {
  flex: 1;
  max-width: 200px;
}

.rating-input {
  display: flex;
  align-items: center;
  gap: 16px;
}

.rating-input .form-input {
  width: 100px;
}

.star-display {
  display: flex;
  gap: 4px;
}

.star-display .iconfont {
  font-size: 20px;
  color: var(--color-accent);
}

.star-display .icon-star-empty {
  color: var(--gray-300);
}

.tag-input-container {
  display: flex;
  gap: 8px;
}

.tag-input {
  flex: 1;
}

.add-tag-btn {
  padding: 12px 20px;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-tag-btn:hover {
  background: var(--color-primary-hover);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

.tag-list .tag-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--color-bg-soft);
  border-radius: 5px;
  font-size: 14px;
  color: var(--color-text-primary);
  transition: background-color 0.2s, color 0.2s;
}

.tag-list .tag-item:hover {
  background: var(--color-primary-hover);
  color: var(--color-text-inverse);
}

.tag-list .tag-item .tag-remove {
  font-size: 14px;
  cursor: pointer;
  color: var(--color-text-tertiary);
  transition: color 0.2s;
  margin-left: 4px;
  line-height: 1;
}

.tag-list .tag-item .tag-remove:hover {
  color: var(--color-danger);
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.image-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}

.image-item.is-icon {
  border-color: var(--color-primary);
}

.image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.image-item:hover .remove-btn {
  opacity: 1;
}

.remove-btn .iconfont {
  font-size: 14px;
  color: white;
}

.remove-btn:hover .iconfont {
  color: var(--color-danger);
}

.icon-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  padding: 2px 6px;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  font-size: 10px;
  border-radius: 4px;
  font-weight: 600;
}

.upload-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}

.upload-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 32px;
  background: var(--color-bg-soft);
  border: 2px dashed var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-btn:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-card);
}

.upload-btn input {
  display: none;
}

.upload-btn .iconfont {
  font-size: 24px;
  color: var(--color-text-secondary);
}

.upload-btn span {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.upload-hint {
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.selected-info {
  margin-top: 8px;
  font-size: 12px;
  color: var(--color-text-tertiary);
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
  padding-bottom: 32px;
}

.submit-btn {
  flex: 1;
  padding: 14px;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.reset-btn {
  flex: 1;
  padding: 14px;
  background: var(--color-bg-soft);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: var(--color-bg-card);
  border-color: var(--color-primary);
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--color-bg-card);
  border-radius: 12px;
  padding: 24px;
  width: 280px;
  text-align: center;
}

.modal-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.modal-icon.success {
  background: var(--color-success-bg, #e6f7e6);
}

.modal-icon.success .iconfont {
  font-size: 32px;
  color: var(--color-success, #52c41a);
}

.modal-icon.error {
  background: var(--color-error-bg, #fff2f0);
}

.modal-icon.error .iconfont {
  font-size: 32px;
  color: var(--color-error, #ff4d4f);
}

.modal-message {
  font-size: 16px;
  color: var(--color-text-primary);
  margin-bottom: 20px;
}

.modal-btn {
  width: 100%;
  padding: 10px;
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.modal-btn:hover {
  background: var(--color-primary-hover);
}
</style>
