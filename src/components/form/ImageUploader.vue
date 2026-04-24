<script setup lang="ts">
import { ref, computed } from 'vue'
import request from '@/utils/request'
import { toast } from '@/utils/toast'
import type { CommonResponse } from '@/types/apiType'

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'

interface Props {
  modelValue?: string
  size?: number
  accept?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  size: 200,
  accept: 'image/jpeg,image/png,image/jpg,image/gif,image/webp',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'upload-success': [url: string]
  'upload-error': [error: string]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const previewUrl = ref('')
const uploadStatus = ref<UploadStatus>('idle')
const uploadProgress = ref(0)
const errorMessage = ref('')
const isHovering = ref(false)
const isEnlarged = ref(false)

const containerStyle = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}))

const isIdle = computed(() => uploadStatus.value === 'idle')
const isUploading = computed(() => uploadStatus.value === 'uploading')
const isSuccess = computed(() => uploadStatus.value === 'success')
const isError = computed(() => uploadStatus.value === 'error')
const showPreview = computed(() => isSuccess.value && previewUrl.value)

function handleClick() {
  if (!isUploading.value) {
    fileInput.value?.click()
  }
}

function handleDragOver(e: DragEvent) {
  e.preventDefault()
  isHovering.value = true
}

function handleDragLeave() {
  isHovering.value = false
}

function handleDrop(e: DragEvent) {
  e.preventDefault()
  isHovering.value = false
  const file = e.dataTransfer?.files[0]
  if (file) {
    validateAndUpload(file)
  }
}

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    validateAndUpload(file)
  }
}

function validateAndUpload(file: File) {
  errorMessage.value = ''

  if (!file.type.startsWith('image/')) {
    errorMessage.value = '请上传图片文件'
    uploadStatus.value = 'error'
    toast.error('请上传图片文件')
    return
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    errorMessage.value = '不支持的图片格式，请上传 JPG、PNG、GIF 或 WebP 格式'
    uploadStatus.value = 'error'
    toast.error('不支持的图片格式')
    return
  }

  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    errorMessage.value = '图片大小不能超过 10MB'
    uploadStatus.value = 'error'
    toast.error('图片大小不能超过 10MB')
    return
  }

  previewUrl.value = URL.createObjectURL(file)
  uploadFile(file)
}

async function uploadFile(file: File) {
  uploadStatus.value = 'uploading'
  uploadProgress.value = 0

  const formData = new FormData()
  formData.append('file', file)

  try {
    const res = await request.post<CommonResponse<string>>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          uploadProgress.value = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
        }
      },
    })

    const fileUrl = res.data?.data ?? null
    if (fileUrl) {
      previewUrl.value = fileUrl
      uploadStatus.value = 'success'
      emit('update:modelValue', fileUrl)
      emit('upload-success', fileUrl)
      toast.success('图片上传成功')
    } else {
      throw new Error('上传响应中未返回文件路径')
    }
  } catch (error) {
    uploadStatus.value = 'error'
    const err = error as { response?: { data?: { message?: string } }; message?: string }
    const message = err.response?.data?.message || err.message || '上传失败，请重试'
    errorMessage.value = message
    emit('upload-error', message)
  }
}

function handleRetry() {
  errorMessage.value = ''
  uploadStatus.value = 'idle'
  uploadProgress.value = 0
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function handleRemove() {
  previewUrl.value = ''
  uploadStatus.value = 'idle'
  uploadProgress.value = 0
  errorMessage.value = ''
  emit('update:modelValue', '')
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

function openEnlargedPreview() {
  if (showPreview.value) {
    isEnlarged.value = true
  }
}

function closeEnlargedPreview() {
  isEnlarged.value = false
}
</script>

<template>
  <div class="image-uploader">
    <input ref="fileInput" type="file" class="file-input" :accept="accept" @change="handleFileChange" />

    <div class="upload-area" :class="{
      'upload-area--hover': isHovering,
      'upload-area--uploading': isUploading,
      'upload-area--success': isSuccess,
      'upload-area--error': isError,
    }" :style="containerStyle" @click="handleClick" @dragover="handleDragOver" @dragleave="handleDragLeave"
      @drop="handleDrop">
      <div v-if="isIdle" class="upload-idle">
        <i class="iconfont icon-add upload-icon"></i>
        <span class="upload-text">点击上传图片</span>
        <span class="upload-hint">支持 JPG、PNG、GIF、WebP</span>
      </div>

      <div v-else-if="isUploading" class="upload-progress">
        <img v-if="previewUrl" :src="previewUrl" class="progress-preview" alt="预览" />
        <div class="progress-overlay">
          <div class="progress-bar-container">
            <div class="progress-bar" :style="{ width: `${uploadProgress}%` }"></div>
          </div>
          <span class="progress-text">{{ uploadProgress }}%</span>
        </div>
      </div>

      <div v-else-if="isSuccess" class="upload-success">
        <img :src="previewUrl" class="success-preview" alt="预览" />
        <div class="success-overlay">
          <button class="action-btn" @click.stop="openEnlargedPreview">
            <i class="iconfont icon-fullscreen"></i>
          </button>
          <button class="action-btn action-btn--danger" @click.stop="handleRemove">
            <i class="iconfont icon-delete"></i>
          </button>
        </div>
      </div>

      <div v-else-if="isError" class="upload-error">
        <i class="iconfont icon-warning-circle error-icon"></i>
        <span class="error-text">{{ errorMessage || '上传失败' }}</span>
        <button class="retry-btn" @click.stop="handleRetry">重新上传</button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="isEnlarged" class="enlarged-overlay" @click="closeEnlargedPreview">
        <img :src="previewUrl" class="enlarged-image" alt="预览" />
        <button class="enlarged-close">
          <i class="iconfont icon-close"></i>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.image-uploader {
  display: inline-block;
}

.file-input {
  display: none;
}

.upload-area {
  position: relative;
  border: 2px dashed var(--input-border);
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.upload-area:hover {
  border-color: var(--color-primary);
  background-color: rgba(58, 95, 122, 0.05);
}

.upload-area--hover {
  border-color: var(--color-primary);
  background-color: rgba(58, 95, 122, 0.1);
}

.upload-area--uploading {
  border-color: var(--color-primary);
}

.upload-area--success {
  border-color: var(--color-success);
  border-style: solid;
}

.upload-area--error {
  border-color: var(--color-danger);
}

.upload-idle {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  box-sizing: border-box;
}

.upload-icon {
  font-size: 32px;
  color: var(--color-text-placeholder);
}

.upload-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.upload-hint {
  font-size: 12px;
  color: var(--color-text-placeholder);
}

.upload-progress {
  width: 100%;
  height: 100%;
  position: relative;
}

.progress-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.6);
}

.progress-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.progress-bar-container {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: var(--color-primary);
  border-radius: 3px;
  transition: width 0.15s ease;
}

.progress-text {
  font-size: 12px;
  color: #fff;
  font-weight: 500;
}

.upload-success {
  width: 100%;
  height: 100%;
  position: relative;
}

.success-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.success-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.upload-success:hover .success-overlay {
  opacity: 1;
}

.action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: var(--color-text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.2s ease;
}

.action-btn:hover {
  background: #fff;
  transform: scale(1.1);
}

.action-btn--danger:hover {
  background: var(--color-danger);
  color: #fff;
}

.upload-error {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: rgba(211, 64, 59, 0.05);
  box-sizing: border-box;
}

.error-icon {
  font-size: 32px;
  color: var(--color-danger);
}

.error-text {
  font-size: 13px;
  color: var(--color-danger);
  text-align: center;
  line-height: 1.4;
}

.retry-btn {
  padding: 6px 16px;
  border: 1px solid var(--color-danger);
  border-radius: 4px;
  background: transparent;
  color: var(--color-danger);
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;
}

.retry-btn:hover {
  background: var(--color-danger);
  color: #fff;
}

.enlarged-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  cursor: zoom-out;
  animation: fadeIn 0.2s ease;
}

.enlarged-image {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.enlarged-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
}

.enlarged-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
