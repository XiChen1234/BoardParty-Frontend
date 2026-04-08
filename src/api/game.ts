import type { Game, Tag } from '@/types/game-type'
import type { ApiResponse } from '@/types/common-type'

/**
 * 获取游戏列表
 * @returns 游戏列表数组
 */
export async function fetchGames(): Promise<Game[]> {
  const response = await fetch('/games')
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  const result: ApiResponse<Game[]> = await response.json()
  if (result.code !== 'SUCCESS') {
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
    // 过滤空标签
    if (!game.tags) {
      return
    }

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
