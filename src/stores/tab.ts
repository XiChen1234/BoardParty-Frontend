import { defineStore } from 'pinia'

// Tab 状态管理
const useTabStore = defineStore('tab', {
  state: () => ({
    // 当前选中的 Tab 索引
    activeTabIndex: 0,
    // Tab 配置
    tabs: [
      { name: 'list', label: '桌游', icon: 'icon-list' },
      { name: 'rank', label: '排行', icon: 'icon-rank' },
      { name: 'punishment', label: '惩罚', icon: 'icon-punishment' },
      { name: 'profile', label: '我的', icon: 'icon-profile' }
    ]
  }),
  getters: {
    // 获取当前选中的 Tab
    activeTab: (state) => state.tabs[state.activeTabIndex]
  },
  actions: {
    // 设置选中的 Tab 索引
    setActiveTabIndex(index: number) {
      this.activeTabIndex = index
      // 保存到 localStorage，实现状态持久化
      localStorage.setItem('activeTabIndex', index.toString())
    },
    // 根据 Tab 名称设置选中状态
    setActiveTabByName(name: string) {
      const index = this.tabs.findIndex(tab => tab.name === name)
      if (index !== -1) {
        this.setActiveTabIndex(index)
      }
    },
    // 初始化状态，从 localStorage 恢复
    init() {
      const savedIndex = localStorage.getItem('activeTabIndex')
      if (savedIndex) {
        this.activeTabIndex = parseInt(savedIndex)
      }
    }
  }
})

export default useTabStore
