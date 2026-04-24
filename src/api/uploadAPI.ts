import request from '@/utils/request'

/**
 * 上传图片
 * @param formData 包含图片文件的 FormData 对象
 * @returns 上传后的图片 URL
 */
export function uploadImage(file: File, onProgress?: (percent: number) => void): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  return request.post('/upload/image', formData, {
    onUploadProgress: (progressEvent) => {
      if (!progressEvent.total) return
      const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100)
      onProgress?.(percent)
    },
  })
}
