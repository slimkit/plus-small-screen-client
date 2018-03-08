/**
 * user store module
 */
import localEvent from 'store';
import actions from './actions.js';
import mutations from './mutations.js';
import getters from './getters.js';

const state = {
    users: localEvent.get('users') || {
        user_0: {
            "id": 0,
            "name": "ThinkSNS+",
            "bio": "我是大管理员",
            "sex": 0,
            "location": "中国 四川省 成都市",
            "created_at": "2017-06-02 08:43:54",
            "updated_at": "2017-07-06 07:04:06",
            "following": false,
            "follower": false,
            "avatar": "http://plus.io/api/v2/users/1/avatar",
            "bg": null,
            "verified": {
                "type": "user",
                "icon": null,
                "description": "xxxxx"
            },
            "extra": {
                "user_id": 1,
                "likes_count": 0,
                "comments_count": 0,
                "followers_count": 0,
                "followings_count": 1,
                "updated_at": "2017-07-16 09:44:25",
                "feeds_count": 0
            }
        }
    },
    mine: localEvent.get('mine') || {}
};

export default {
    state,
    getters,
    actions,
    mutations
};