<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { uploadImage, createGame, type ValidationErrors } from '@/api/game'
import type { GameCreateRequest } from '@/types/game-type'

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
  tagNames: string[]
}

/**
 * 本地预览图片类型（带上传状态）
 */
interface PreviewImage {
  id: string
  url: string
  name: string
  file: File
  uploadProgress: number
  uploadedUrl: string | null
  uploadError: string | null
  isUploading: boolean
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
  tagNames?: string
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
 * 提交状态枚举
 */
type SubmitStatus = 'idle' | 'uploading' | 'validating' | 'submitting' | 'success' | 'error'

/**
 * 提交状态
 */
const submitStatus = ref<SubmitStatus>('idle')
const statusMessage = ref('')

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
  tagNames: []
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
 * 生成唯一ID
 */
const generateId = (): string => {
  return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 处理文件选择 - 选择后立即上传
 * @param event - 文件选择事件
 */
const handleFileSelect = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || input.files.length === 0) {
    return
  }

  const files = Array.from(input.files)
  const currentCount = formData.images.length

  if (currentCount + files.length > MAX_IMAGE_COUNT) {
    errors.images = `最多只能上传${MAX_IMAGE_COUNT}张图片`
    input.value = ''
    return
  }

  errors.images = ''

  for (const file of files) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      showErrorModal('仅支持 JPG、PNG、GIF、WebP 格式图片')
      continue
    }

    if (file.size > MAX_IMAGE_SIZE) {
      showErrorModal('单张图片大小不能超过 5MB')
      continue
    }

    const previewUrl = URL.createObjectURL(file)
    const imageId = generateId()

    const newImage = reactive<PreviewImage>({
      id: imageId,
      url: previewUrl,
      name: file.name,
      file: file,
      uploadProgress: 0,
      uploadedUrl: null,
      uploadError: null,
      isUploading: true
    })

    formData.images.push(newImage)

    uploadSingleImage(newImage).catch((error) => {
      console.error(`图片 ${file.name} 上传失败:`, error)
    })
  }

  input.value = ''
}

/**
 * 移除图片 - 仅移除本地引用，服务器图片保留
 * @param index - 图片索引
 */
const removeImage = (index: number) => {
  if (formData.images[index]) {
    URL.revokeObjectURL(formData.images[index]!.url)
  }
  formData.images.splice(index, 1)
  errors.images = ''
}

/**
 * 上传单张图片
 * @param image - 图片对象
 */
const uploadSingleImage = async (image: PreviewImage): Promise<void> => {
  image.isUploading = true
  image.uploadError = null

  try {
    const uploadedUrl = await uploadImage(image.file, (percent) => {
      image.uploadProgress = percent
    })
    image.uploadedUrl = uploadedUrl
    image.uploadProgress = 100
  } catch (error) {
    image.uploadError = error instanceof Error ? error.message : '上传失败'
    throw error
  } finally {
    image.isUploading = false
  }
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

  if (formData.tagNames.length > 10) {
    errors.tagNames = '标签数量不能超过10个'
    isValid = false
  }

  return isValid
}

/**
 * 构建创建桌游请求参数
 * @param icon - icon图片URL
 * @param images - 所有图片URL数组
 * @returns 创建桌游请求对象
 */
const buildCreateRequest = (icon: string, images: string[]): GameCreateRequest => {
  return {
    name: formData.name.trim(),
    description: formData.description.trim(),
    icon: icon,
    images: images,
    minPlayer: formData.minPlayer!,
    maxPlayer: formData.maxPlayer!,
    duration: formData.duration!,
    star: formData.star,
    tagNames: formData.tagNames
  }
}

/**
 * 显示错误弹窗
 * @param message - 错误消息
 */
const showErrorModal = (message: string) => {
  modalType.value = 'error'
  modalMessage.value = message
  showModal.value = true
}

/**
 * 显示成功弹窗
 * @param message - 成功消息
 */
const showSuccessModal = (message: string) => {
  modalType.value = 'success'
  modalMessage.value = message
  showModal.value = true
}

/**
 * 处理表单提交 - 图片已提前上传
 */
const handleSubmit = async () => {
  if (submitStatus.value !== 'idle') {
    return
  }

  if (!validateForm()) {
    showErrorModal('请检查表单填写')
    return
  }

  const failedImages = formData.images.filter(img => img.uploadError !== null)
  if (failedImages.length > 0) {
    showErrorModal('存在上传失败的图片，请移除后重试')
    return
  }

  const uploadingImages = formData.images.filter(img => img.isUploading)
  if (uploadingImages.length > 0) {
    showErrorModal('仍有图片正在上传，请等待上传完成')
    return
  }

  const uploadedImages = formData.images.filter(img => img.uploadedUrl !== null)
  if (uploadedImages.length === 0) {
    showErrorModal('请至少上传一张图片')
    return
  }

  submitStatus.value = 'submitting'
  statusMessage.value = '正在提交数据...'

  try {
    const icon = uploadedImages[0]!.uploadedUrl!
    const images = uploadedImages.length > 1
      ? uploadedImages.slice(1).map(img => img.uploadedUrl!)
      : []
    const request = buildCreateRequest(icon, images)
    await createGame(request)

    submitStatus.value = 'success'
    statusMessage.value = ''
    showSuccessModal('提交成功！')
  } catch (error) {
    submitStatus.value = 'error'
    statusMessage.value = ''

    if (error instanceof Error) {
      if ('validationErrors' in error) {
        const validationErrors = (error as Error & { validationErrors: ValidationErrors }).validationErrors
        Object.assign(errors, validationErrors)
        showErrorModal('数据验证失败，请检查表单')
      } else {
        showErrorModal(error.message || '提交失败')
      }
    } else {
      showErrorModal('提交失败，请重试')
    }
  }
}

/**
 * 添加标签
 */
const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !formData.tagNames.includes(tag)) {
    if (formData.tagNames.length >= 10) {
      errors.tagNames = '标签数量不能超过10个'
      return
    }
    formData.tagNames.push(tag)
    tagInput.value = ''
    errors.tagNames = ''
  }
}

/**
 * 移除标签
 * @param index - 标签索引
 */
const removeTag = (index: number) => {
  formData.tagNames.splice(index, 1)
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
 * 重置表单
 */
const resetForm = () => {
  formData.images.forEach(img => URL.revokeObjectURL(img.url))
  Object.assign(formData, {
    name: '',
    description: '',
    minPlayer: null,
    maxPlayer: null,
    duration: null,
    images: [],
    star: 5,
    tagNames: []
  })
  Object.keys(errors).forEach(key => delete (errors as Record<string, unknown>)[key])
  tagInput.value = ''
  submitStatus.value = 'idle'
  statusMessage.value = ''
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
  if (submitStatus.value !== 'idle' && submitStatus.value !== 'success') {
    if (!confirm('当前正在提交中，确定要返回吗？')) {
      return
    }
  }
  window.history.back()
}

/**
 * 检查是否可以提交
 */
const canSubmit = (): boolean => {
  return submitStatus.value === 'idle' || submitStatus.value === 'error'
}

/**
 * 获取提交按钮文本
 */
const getSubmitButtonText = (): string => {
  switch (submitStatus.value) {
    case 'submitting':
      return '提交中...'
    case 'success':
      return '已提交'
    case 'error':
      return '重新提交'
    default:
      return '提交'
  }
}

/**
 * 已上传成功的图片数量
 */
const uploadedCount = computed(() => {
  return formData.images.filter(img => img.uploadedUrl !== null && !img.uploadError).length
})

/**
 * 上传失败的图片数量
 */
const failedCount = computed(() => {
  return formData.images.filter(img => img.uploadError !== null).length
})

/**
 * 正在上传的图片数量
 */
const uploadingCount = computed(() => {
  return formData.images.filter(img => img.isUploading).length
})
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

    <!-- 状态消息 -->
    <div v-if="statusMessage" class="status-bar" :class="submitStatus">
      <div class="status-spinner" v-if="submitStatus === 'uploading' || submitStatus === 'submitting'"></div>
      <span class="status-text">{{ statusMessage }}</span>
    </div>

    <!-- 表单内容 -->
    <div class="form-content" :class="{ locked: submitStatus === 'success' }">
      <!-- 桌游名称 -->
      <div class="form-group">
        <label class="form-label">
          桌游名称
          <span class="required">*</span>
        </label>
        <input v-model="formData.name" type="text" class="form-input" :class="{ 'input-error': errors.name }"
          placeholder="请输入桌游名称" maxlength="50" :disabled="submitStatus === 'success'" />
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
          placeholder="请输入详细描述" rows="4" maxlength="500" :disabled="submitStatus === 'success'"></textarea>
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
              :class="{ 'input-error': errors.minPlayer }" placeholder="最小" min="1" max="100"
              :disabled="submitStatus === 'success'" />
            <span class="input-suffix">人</span>
          </div>
          <span class="range-separator">至</span>
          <div class="player-input-item">
            <input v-model.number="formData.maxPlayer" type="number" class="form-input"
              :class="{ 'input-error': errors.maxPlayer }" placeholder="最大" min="1" max="100"
              :disabled="submitStatus === 'success'" />
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
            :class="{ 'input-error': errors.duration }" placeholder="请输入时长" min="1" max="600"
            :disabled="submitStatus === 'success'" />
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
            placeholder="1-10" min="1" max="10" :disabled="submitStatus === 'success'" />
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
            @keydown="handleTagKeydown" :disabled="submitStatus === 'success'" />
          <button type="button" class="add-tag-btn" @click="addTag" :disabled="submitStatus === 'success'">添加</button>
        </div>
        <div class="tag-list" v-if="formData.tagNames.length > 0">
          <span v-for="(tag, index) in formData.tagNames" :key="index" class="tag-item">
            {{ tag }}
            <span class="tag-remove" @click="removeTag(index)">×</span>
          </span>
        </div>
        <span v-if="errors.tagNames" class="error-text">{{ errors.tagNames }}</span>
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
          <div v-for="(image, index) in formData.images" :key="image.id" class="image-item"
            :class="{ 'is-icon': index === 0 }">
            <img :src="image.url" :alt="image.name" />
            <!-- 上传进度遮罩 -->
            <div v-if="image.isUploading" class="upload-overlay">
              <div class="upload-progress-circle">
                <svg viewBox="0 0 36 36">
                  <path class="progress-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path class="progress-fill" :stroke-dasharray="`${image.uploadProgress}, 100`"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <span class="progress-text">{{ image.uploadProgress }}%</span>
              </div>
            </div>
            <!-- 上传失败遮罩 -->
            <div v-if="image.uploadError" class="error-overlay">
              <i class="iconfont icon-error"></i>
              <span>上传失败</span>
            </div>
            <!-- 移除按钮 -->
            <button v-if="!image.isUploading && submitStatus !== 'success'" class="remove-btn"
              @click="removeImage(index)">
              <i class="iconfont icon-close"></i>
            </button>
            <div v-if="index === 0" class="icon-badge">Icon</div>
          </div>
        </div>

        <!-- 上传按钮 -->
        <div class="upload-container" v-if="formData.images.length < MAX_IMAGE_COUNT && submitStatus !== 'success'">
          <label class="upload-btn">
            <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" multiple @change="handleFileSelect" />
            <i class="iconfont icon-upload"></i>
            <span>上传图片</span>
          </label>
          <span class="upload-hint">支持 JPG、PNG、GIF、WebP 格式，单张最大 5MB</span>
        </div>

        <span v-if="errors.images" class="error-text">{{ errors.images }}</span>
        <div class="selected-info" v-if="formData.images.length > 0">
          <span>已上传 {{ uploadedCount }}/{{ formData.images.length }} 张</span>
          <span v-if="failedCount > 0" class="upload-failed-count">，{{ failedCount }}张失败</span>
          <span v-if="uploadingCount > 0" class="upload-ing-count">，{{ uploadingCount }}张上传中</span>
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="form-actions">
        <button type="button" class="submit-btn" :disabled="!canSubmit()" @click="handleSubmit">
          {{ getSubmitButtonText() }}
        </button>
        <button type="button" class="reset-btn" v-if="submitStatus === 'success' || submitStatus === 'error'"
          @click="resetForm">
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

.status-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.status-bar.uploading,
.status-bar.submitting {
  color: var(--color-primary);
}

.status-bar.success {
  color: var(--color-success, #52c41a);
}

.status-bar.error {
  color: var(--color-danger);
}

.status-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
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

.upload-overlay,
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 12px;
}

.upload-progress-circle {
  position: relative;
  width: 48px;
  height: 48px;
}

.upload-progress-circle svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.3);
  stroke-width: 3;
}

.progress-fill {
  fill: none;
  stroke: var(--color-primary);
  stroke-width: 3;
  stroke-linecap: round;
  transition: stroke-dasharray 0.3s;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  font-weight: 600;
}

.error-overlay .iconfont {
  font-size: 24px;
  margin-bottom: 4px;
}

.error-overlay span {
  font-size: 12px;
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

.upload-failed-count {
  color: var(--color-danger);
}

.upload-ing-count {
  color: var(--color-primary);
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
