import localEvent from 'store'
export default {
  SAVE_FEED_TYPE (state, type) {
    state.FEEDTYPE = type
  },
  // 保存当前登录用户信息
  SAVE_CURRENTUSER (state, info) {
    state.CURRENTUSER = info
    localEvent.set('CURRENTUSER', state.CURRENTUSER)
  },

  // 保存圈子分类信息
  SAVE_GROUP_TYPES (state, list) {
    state.GROUPTYPES = list
    localEvent.set('GROUPTYPES', state.GROUPTYPES)
  },

  // 保存用户标签数据
  SAVE_USER_TAGS (state, list) {
    state.USERTAGS = list
    localEvent.set('USERTAGS', state.USERTAGS)
  },

  // 保存定位信息
  SAVE_LOCATION (state, location) {
    state.LOCATION = location
    localEvent.set('LOCATION', state.LOCATION)
  },

  // 保存创建圈子时选择的位置 临时数据
  SAVE_GROUP_LOCATION (state, location) {
    state.CUR_GROUP_LOCATION = location
  },

  // 保存热门城市
  SAVE_HOT_CITYS (state, list) {
    state.HOTCTIYS = list
    localEvent.set('HOTCTIYS', state.HOTCTIYS)
  },

  // 保存用户搜索历史
  ADD_SEARCH_HISTORY (state, list) {
    const old = state.SEARCHHISTORY
    state.SEARCHHISTORY = Array.from(new Set([list, ...old]))
    localEvent.set('SEARCHHISTORY', state.SEARCHHISTORY)
  },

  // 清空搜索历史
  CLEAN_SEARCH_HISTORY (state, data) {
    const index = state.SEARCHHISTORY.indexOf(data)
    if (data && index >= 0) {
      state.SEARCHHISTORY.splice(index, 1)
    } else {
      state.SEARCHHISTORY = []
      localEvent.remove('SEARCHHISTORY')
    }
  },

  // 注销登录
  LOGOUT (state) {
    state.CURRENTUSER = null
    console.log('clear all')
    localEvent.clearAll()
  }
}
