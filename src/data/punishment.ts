import { ref } from 'vue'

/**
 * 惩罚类型枚举
 */
export const PunishmentType = {
  ACTION: 'action',
  TRUTH: 'truth',
  DARE: 'dare'
} as const

export type PunishmentType = typeof PunishmentType[keyof typeof PunishmentType]

/**
 * 惩罚项接口
 */
export interface Punishment {
  id: number
  type: PunishmentType
  content: string
  icon: string
}

/**
 * 惩罚列表
 */
export const punishmentList = ref<Punishment[]>([
  { id: 1, type: PunishmentType.ACTION, content: '学狗叫，直到下一轮结束', icon: 'icon-dog' },
  { id: 2, type: PunishmentType.ACTION, content: '用屁股写自己的名字', icon: 'icon-butt' },
  { id: 3, type: PunishmentType.ACTION, content: '模仿任意一位在场玩家说话', icon: 'icon-mic' },
  { id: 4, type: PunishmentType.ACTION, content: '双手模仿兔子耳朵跳动10秒', icon: 'icon-rabbit' },
  { id: 5, type: PunishmentType.ACTION, content: '学大猩猩走路绕场一圈', icon: 'icon-gorilla' },
  { id: 6, type: PunishmentType.ACTION, content: '扮演机器人，被问话只能回答"是的主人"', icon: 'icon-robot' },
  { id: 7, type: PunishmentType.ACTION, content: '学母鸡下蛋的动作叫3声', icon: 'icon-egg' },
  { id: 8, type: PunishmentType.ACTION, content: '用左手拧自己耳朵10秒', icon: 'icon-ear' },
  { id: 9, type: PunishmentType.TRUTH, content: '说出你手机相册里最近的一张照片', icon: 'icon-camera' },
  { id: 10, type: PunishmentType.TRUTH, content: '坦白你做过的最尴尬的事', icon: 'icon-embarrassed' },
  { id: 11, type: PunishmentType.TRUTH, content: '说出你最喜欢的异性的三个特点', icon: 'icon-heart' },
  { id: 12, type: PunishmentType.TRUTH, content: '坦白你上次哭是什么时候，为什么', icon: 'icon-cry' },
  { id: 13, type: PunishmentType.TRUTH, content: '说出你最喜欢的偶像是谁', icon: 'icon-star' },
  { id: 14, type: PunishmentType.TRUTH, content: '坦白你偷偷喜欢过谁超过3个人', icon: 'icon-love' },
  { id: 15, type: PunishmentType.TRUTH, content: '说出你对自己外表最不满意的的地方', icon: 'icon-mirror' },
  { id: 16, type: PunishmentType.DARE, content: '当场找一个陌生人要微信', icon: 'icon-wechat' },
  { id: 17, type: PunishmentType.DARE, content: '给通讯录第一个人打电话说想TA', icon: 'icon-phone' },
  { id: 18, type: PunishmentType.DARE, content: '喝一杯醋（如果在场有）', icon: 'icon-vinegar' },
  { id: 19, type: PunishmentType.DARE, content: '当场吃一口桌上的任何调料', icon: 'icon-food' },
  { id: 20, type: PunishmentType.DARE, content: '做10个俯卧撑', icon: 'icon-pushup' },
  { id: 21, type: PunishmentType.DARE, content: '模仿网络上流行的段子', icon: 'icon-trend' },
  { id: 22, type: PunishmentType.DARE, content: '当场表演一段freestyle', icon: 'icon-rap' },
  { id: 23, type: PunishmentType.DARE, content: '对在场某人说一句土味情话', icon: 'icon-sweet' },
  { id: 24, type: PunishmentType.DARE, content: '拿着手机前置摄像头绕场走一圈', icon: 'icon-selfie' },
])

/**
 * 获取随机惩罚
 */
export const getRandomPunishment = (): Punishment => {
  const list = punishmentList.value
  if (list.length === 0) {
    throw new Error('惩罚列表为空')
  }
  const randomIndex = Math.floor(Math.random() * list.length)
  return list[randomIndex]!
}
