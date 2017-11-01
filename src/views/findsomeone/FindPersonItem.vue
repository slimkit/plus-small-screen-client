<template>
    <li v-if="!noData" :class="$style.findItem" @click="changeUrl(`/users/feeds/${id}`)">
        <user-avatar :sex='sex' :src='avatar || null' />
        <div :class="$style.iteminfo">
            <p :class="$style.itemName">{{name}}</p>
            <p :class="$style.itemBio">{{bio}}</p>
        </div>
        <div :class="$style.itemFollow">
            <div class="actionButton" @click.stop="handleFollowingStatus(followAction.status)">
                <FollowingIcon v-if="followAction.text == '已关注'" height="24" width="24" color="#59b6d7" />
                <UnFollowingIcon v-if="followAction.text == '关注'" height="24" width="24" color="#333" />
                <EachFollowingIcon v-if="followAction.text == '相互关注'" height="24" width="24" color="#59b6d7" />
            </div>
        </div>
    </li>
</template>
<script>
import FollowingIcon from '../../icons/Following';
import UnFollowingIcon from '../../icons/UnFollowing';
import EachFollowingIcon from '../../icons/EachFollowing';

import { getUserInfo } from '../../utils/user';
import { goTo, changeUrl } from '../../utils/changeUrl';
import { followingUser, unFollowingUser } from '../../utils/user';

const FindPersonItem = {
    name: "FindPersonItem",
    components: {
        FollowingIcon,
        UnFollowingIcon,
        EachFollowingIcon
    },
    props: ["item"],
    data: () => ({
        sex: 0,
        id: null,
        bio: null,
        name: null,
        avatar: null,
        follower: false,
        following: false,
        noData: false
    }),
    methods: {
        changeUrl,
        handleFollowingStatus(status) {
            // 关注操作
            if (status) {
                // 取关
                this.handleUnfollowing();
            } else {
                // 加关注
                this.handleFollowing();
            }
        },
        // 取关操作
        handleUnfollowing() {
            unFollowingUser(this.id)
                .then(status => {
                    if (status) {
                        this.follower = false;
                    } else {
                        this.$store.dispatch(NOTICE, cb => {
                            cb({
                                text: '取关失败,可能是还没关注',
                                time: 1500,
                                status: true
                            });
                        });
                    }
                });
        },
        // 关注操作
        handleFollowing() {
            followingUser(this.id)
                .then(status => {
                    if (status) {
                        this.follower = true;
                    } else {
                        this.$store.dispatch(NOTICE, cb => {
                            cb({
                                text: '关注失败,可能是已经关注了',
                                time: 1500,
                                status: true
                            });
                        });
                    }
                })
        },
    },
    computed: {
        followAction() {
            if (this.following && this.follower) {
                return {
                    status: true,
                    text: '相互关注'
                };
            }
            if (!this.follower) {
                return {
                    status: false,
                    text: '关注'
                }
            }
            if (!this.following && this.follower) {
                return {
                    status: true,
                    text: '已关注'
                }
            }
        },
    },
    created() {
        const {
            user_id,

            id,
            bio,
            sex,
            name,
            avatar,
            follower,
            following,
        } = this.item || {};

        if (typeof user_id !== "undefined" && typeof id === 'undefined') {

            getUserInfo(user_id)
            .then((user) => {
                const { id, bio, name, avatar, follower, following } = user;
                this.id = id;
                this.bio = bio || "这家伙很懒，什么也没有留下";
                this.sex = sex;
                this.name = name;
                this.avatar = avatar;
                this.follower = follower;
                this.following = following;
            })
            .catch((error)=>{
                console.log(error);
            });
        }else if(typeof id !== "undefined" && typeof user_id === 'undefined'){
            this.id = id;
            this.bio = bio || "这家伙很懒，什么也没有留下";
            this.sex = sex;
            this.name = name;
            this.avatar = avatar;
            this.follower = follower;
            this.following = following;
        }else{
            this.noData = true;
        }
    }
}

export default FindPersonItem;
</script>
<style lang="scss" module>
.findItem {
    display: flex;
    align-items: center;
    padding: 20px;
    height: 100px;
    border-bottom: 1px solid #ededed;
    > {
        flex: 0 0 auto;
    }
}

.iteminfo {
    overflow: hidden;
    flex-grow: 1;
    margin-left: 25px;
    font-size: 16px;
    >p {
        overflow: hidden;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .itemName {
        color: #333;
    }
    .itemBio {
        font-size: 14px;
        color: #999;
    }
}

.itemFollow {
    display: flex;
    justify-content: center;
}
</style>