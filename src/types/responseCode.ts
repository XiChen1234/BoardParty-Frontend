export const ResponseCode = {
  SUCCESS: { code: 0, message: '成功' },

  SYSTEM_ERROR: { code: 1000, message: '系统错误' },
  PARAM_ERROR: { code: 1001, message: '参数错误' },
  VALIDATION_ERROR: { code: 1002, message: '数据验证错误' },
  AUTH_NOT_LOGIN: { code: 1003, message: '未登录' },
  AUTH_TOKEN_EXPIRED: { code: 1004, message: '认证已过期' },
  AUTH_FAILED: { code: 1005, message: '权限验证失败' },

  FILE_UPLOAD_FAILED: { code: 2001, message: '文件上传失败' },

  USER_NOT_FOUND: { code: 3001, message: '用户不存在' },
  PASSWORD_ERROR: { code: 3002, message: '用户名或密码错误' },

  GROUP_NOT_FOUND: { code: 4001, message: '小圈不存在' },
  GROUP_ALREADY_EXIST: { code: 4002, message: '小圈名称已存在' },
  GROUP_PERMISSION_DENIED: { code: 4003, message: '没有小圈权限' },

  GAME_NOT_FOUND: { code: 5001, message: '桌游不存在' },
  GAME_ALREADY_EXIST: { code: 5002, message: '桌游已存在' },
} as const

export type ResponseCodeType = (typeof ResponseCode)[keyof typeof ResponseCode]
