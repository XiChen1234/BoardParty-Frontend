import type { Game, Tag, GameCreateRequest } from '@/types/game-type'
import type { ApiResponse, ValidationErrorResponse } from '@/types/common-type'

/**
 * 上传进度回调类型
 */
export type UploadProgressCallback = (percent: number) => void

/**
 * 后端 validation 错误映射类型
 */
export type ValidationErrors = Record<string, string>

/**
 * 获取游戏列表
 * @returns 游戏列表数组
 */
export async function fetchGames(): Promise<Game[]> {
  const response = await fetch('/board-party/api/games')
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const result: ApiResponse<Game[]> = await response.json()
  if (result.code !== 200) {
    throw new Error(result.message || '获取游戏列表失败')
  }
  if (!result.data) {
    throw new Error('获取游戏列表失败: 数据为空')
  }
  return result.data
}

/**
 * 从游戏列表中提取所有标签
 * @param games 游戏列表
 * @returns 去重后的标签列表
 */
export function extractTagsFromGames(games: Game[]): Tag[] {
  const tagMap = new Map<number, Tag>()
  games.forEach((game) => {
    if (!game.tags) {
      return
    }
    game.tags.forEach((tag) => {
      if (!tagMap.has(tag.id)) {
        tagMap.set(tag.id, tag)
      }
    })
  })
  return Array.from(tagMap.values())
}

/**
 * 上传图片文件（带进度显示）
 * @param file 文件对象
 * @param onProgress 进度回调函数
 * @returns 后端存储到服务器中的文件路径+文件名
 */
export async function uploadImage(
  file: File,
  onProgress?: UploadProgressCallback,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.append('file', file)

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100)
        onProgress(percent)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const result: ApiResponse<string> = JSON.parse(xhr.responseText)
          if (result.code === 200 && result.data) {
            resolve(result.data)
          } else {
            reject(new Error(result.message || '图片上传失败'))
          }
        } catch {
          reject(new Error('解析响应失败'))
        }
      } else {
        reject(new Error(`HTTP error! status: ${xhr.status}`))
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error('网络错误，请检查网络连接'))
    })

    xhr.addEventListener('abort', () => {
      reject(new Error('上传已取消'))
    })

    xhr.open('POST', '/board-party/api/upload/image')
    xhr.send(formData)
  })
}

/**
 * 解析后端 validation 错误响应
 * @param response Fetch response 对象
 * @returns 解析后的错误映射或抛出错误
 */
export async function parseValidationErrors(response: Response): Promise<ValidationErrors> {
  try {
    const errorData: ValidationErrorResponse = await response.json()
    if (errorData.errors && Array.isArray(errorData.errors)) {
      const errors: ValidationErrors = {}
      errorData.errors.forEach((err) => {
        const fieldName = err.field.charAt(0).toLowerCase() + err.field.slice(1)
        errors[fieldName] = err.message
      })
      return errors
    }
    throw new Error(errorData.message || '请求失败')
  } catch {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
}

/**
 * 创建新桌游
 * @param request 创建桌游请求参数
 * @returns 创建的新桌游ID
 */
export async function createGame(request: GameCreateRequest): Promise<number> {
  const response = await fetch('/board-party/api/games', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    if (response.status === 400) {
      const errors = await parseValidationErrors(response)
      const error = new Error('数据验证失败') as Error & { validationErrors?: ValidationErrors }
      error.validationErrors = errors
      throw error
    }
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result: ApiResponse<number> = await response.json()
  if (result.code !== 200) {
    throw new Error(result.message || '创建桌游失败')
  }
  if (!result.data) {
    throw new Error('创建桌游失败: 数据为空')
  }
  return result.data
}
