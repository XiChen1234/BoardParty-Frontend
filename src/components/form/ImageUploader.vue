<script setup lang="ts">
import { uploadImage } from '@/api/uploadAPI';
import type { CommonError } from '@/types/apiType';
import { toast } from '@/utils/toast';
import { onUnmounted, ref } from 'vue';

type UploadStatus = 'empty' | 'loading' | 'success' | 'fail'
const state = ref<UploadStatus>('empty')
const inputRef = ref<HTMLInputElement | null>(null);
const urlModel = defineModel<string>()
const previewUrl = ref<string>('')
const progress = ref(0)

// 绑定点击事件
const handleClick = () => {
  if (state.value === 'loading' || state.value === 'success') return // 上传中时不允许点击
  inputRef.value?.click()
}

// 绑定文件选择事件
const handleChanged = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    toast.warn('请上传图片文件')
    return
  }

  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value) // 释放旧的URL
  }
  previewUrl.value = URL.createObjectURL(file)

  try {
    state.value = 'loading'
    progress.value = 0

    const url = await uploadImage(file, (percent) => {
      console.log('progress:', percent)
      progress.value = percent
    })

    urlModel.value = url
    toast.success('上传成功')
    state.value = 'success'
  } catch (error) {
    const e = error as CommonError
    console.log(e)
    toast.error('上传失败：' + e.message)
    state.value = 'fail'
  } finally {
    // 清空inputRef
    if (inputRef.value) {
      inputRef.value.value = ''
    }
  }
}

// 删除图片
const handleDelete = (e: MouseEvent) => {
  // 阻止冒泡，否则会触发父级点击（重新选择文件）
  e.stopPropagation()

  urlModel.value = ''
  previewUrl.value = ''
  state.value = 'empty'
}

onUnmounted(() => {
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value) // 释放旧的URL
  }
  previewUrl.value = ''
  if (state.value === 'loading') {
    state.value = 'empty'
  }
})
</script>

<template>
  <div class="image-uploader" @click="handleClick">
    <input type="file" accept="image/*" hidden ref="inputRef" @change="handleChanged">

    <div class="image-uploader__placeholder" v-if="state === 'empty'">
      <i class="iconfont icon-add"></i>
      <span class="image-uploader__text">点击上传图片</span>
      <span class="image-uploader__hint">支持 JPG、PNG 格式</span>
    </div>

    <div class="image-uploader__preview" v-else>
      <img :src="state === 'success' ? urlModel : previewUrl" class="image-uploader__img">

      <div class="image-uploader__mask" v-if="state === 'loading' || state === 'fail'">
        <div class="image-uploader__progress" v-if="state === 'loading'">
          <div class="image-uploader__progress-bar">
            <div class="image-uploader__progress-fill" :style="{ width: progress + '%' }"></div>
          </div>
          <span class="image-uploader__progress-text">{{ progress }}%</span>
        </div>
        <span class="image-uploader__error-text" v-if="state === 'fail'">上传失败</span>
      </div>

      <button class="image-uploader__delete" @click="handleDelete" v-if="state !== 'loading'">
        <i class="iconfont icon-close"></i>
      </button>
    </div>
  </div>
</template>

<style scoped>
.image-uploader {
  position: relative;
  width: 160px;
  height: 160px;
  background: var(--color-bg-card);
  border: 2px dashed var(--color-border);
  border-radius: 12px;
  cursor: pointer;
  transition: border-color 0.2s ease, background-color 0.2s ease;
  overflow: hidden;
}

.image-uploader:hover {
  border-color: var(--color-primary);
  background: var(--color-bg-hover);
}

.image-uploader__placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}

.image-uploader__placeholder .iconfont {
  font-size: 32px;
  color: var(--color-text-tertiary);
  margin-bottom: 8px;
  transition: color 0.2s ease;
}

.image-uploader:hover .image-uploader__placeholder .iconfont {
  color: var(--color-primary);
}

.image-uploader__text {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.image-uploader__hint {
  font-size: 12px;
  color: var(--color-text-placeholder);
}

.image-uploader__preview {
  position: absolute;
  inset: 0;
}

.image-uploader__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-uploader__mask {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--transparent-60);
}

.image-uploader__progress {
  display: flex;
  flex-direction: column;
  width: 80%;
  gap: 8px;
}

.image-uploader__progress-bar {
  width: 100%;
  height: 6px;
  background: var(--transparent-30);
  border-radius: 4px;
  overflow: hidden;
}

.image-uploader__progress-fill {
  height: 100%;
  background: var(--color-success);
  transition: width 0.2s linear;
}

.image-uploader__progress-text {
  text-align: center;
  font-size: 14px;
  color: var(--color-text-inverse);
}

.image-uploader__error-text {
  font-size: 14px;
  color: var(--color-text-inverse);
}

.image-uploader__delete {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 50%;
  background: var(--transparent-30);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: background-color 0.2s ease;
}

.image-uploader__delete:hover {
  background-color: rgba(0, 0, 0, 0.5);
}

.image-uploader__delete .iconfont {
  color: var(--color-danger);
  font-size: 14px;
}
</style>
