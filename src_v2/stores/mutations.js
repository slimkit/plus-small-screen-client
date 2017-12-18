import localEvent from 'store';
export default {
    SAVE_FEED_TYPE(state, type) {
        state.FEEDTYPE = type;
    },
    // 保存当前登录用户信息
    SAVE_CURRENTUSER(state, info) {
        state.CURRENTUSER = info;
        localEvent.set('CURRENTUSER', state.CURRENTUSER);
    },

    // 保存圈子分类信息
    SAVE_GROUP_TYPES(state, list) {
        state.GROUPTYPES = list;
        localEvent.set('GROUPTYPES', state.GROUPTYPES);
    },

    // 保存用户标签数据
    SAVE_USER_TAGS(state, list) {
        state.USERTAGS = list;
        localEvent.set('USERTAGS', state.USERTAGS);
    },

    // 保存定位信息
    SAVE_LOCATION(state, location) {
        state.CUR_LOCATION = location;
        localEvent.set('CUR_LOCATION', state.CUR_LOCATION);
    },

    // 保存热门城市
    SAVE_HOT_CITYS(state, list){
        state.HOTCTIYS = list;
        localEvent.set('HOTCTIYS', state.HOTCTIYS);
    },

    // 注销登录
    LOGOUT(state) {
        state.CURRENTUSER = null;
        console.log('clear all');
        localEvent.clearAll()
    }
}