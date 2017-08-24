<template>
    <li :class="$style.findItem" @click="changeUrl(`/users/feeds/${item.id}`)">
        <div :class="$style.itemHeader">
            <img :src="item.avatar || defaultAvatar" :alt="item.name">
        </div>
        <div :class="$style.iteminfo">
            <p :class="$style.itemName">{{item.name}}</p>
            <p :class="$style.itemBio">{{item.bio || "这家伙很懒，什么也没有留下"}}</p>
        </div>
        <div :class="$style.itemFollow">
            <div class="actionButton" @click.stop="handleFollowingStatus(followAction.status)">
                <FollowingIcon v-if="followAction.text == '已关注'" height="48" width="48" color="#59b6d7"/>
                <UnFollowingIcon v-if="followAction.text == '关注'" height="48" width="48" color="#333"/>
                <EachFollowingIcon v-if="followAction.text == '相互关注'" height="48" width="48" color="#59b6d7"/>
            </div>
        </div>
    </li>
</template>

<script>

import FollowingIcon from '../../icons/Following';
import UnFollowingIcon from '../../icons/UnFollowing';
import EachFollowingIcon from '../../icons/EachFollowing';
import { goTo, changeUrl } from '../../utils/changeUrl';
import { resolveImage } from '../../utils/resource';
import { followingUser, unFollowingUser, getLoggedUserInfo, getUserInfo } from '../../utils/user';

const defaultAvatar = resolveImage(require('../../statics/images/defaultAvatarx2.png'));

const FindItem = {
    name: "findItem",
    components: {
        FollowingIcon,
        UnFollowingIcon,
        EachFollowingIcon
    },
    props: ["item"],
    data: () => ({
        defaultAvatar,
    }),
    methods: {
        changeUrl,
        handleFollowingStatus(status){
            console.log(status);
            // 关注操作
            if(status){
                // 取关
                this.handleUnfollowing();
            }else{
                // 加关注
                this.handleFollowing();
            }
        },
        // 取关操作
      handleUnfollowing () {
        unFollowingUser(this.item.id)
        .then( status => {
          if (status) {
            this.item.follower = false;
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
        followingUser(this.item.id)
        .then( status => {
          if (status) {
            this.item.follower = true;
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
      followAction () {
        if(this.item.following && this.item.follower) {
          return {
            status: true,
            text: '相互关注'
          };
        }
        if(!this.item.follower) {
          return {
            status: false,
            text: '关注'
          }
        }
        if(!this.item.following && this.item.follower) {
          return {
            status: true,
            text: '已关注'
          }
        }
      },
    },
    created() {}
}

export default FindItem;
</script>

<style lang="less" module>
.findItem{
    display: flex;
    align-items: center;
    padding: 20px;
    height: 100px;
    border-bottom: 1px solid #ededed;
}
.itemHeader{
    overflow: hidden;
    width: 50px;
    height: 50px;
    font-size: 10px;
    line-height: 50px;
    border-radius: 50%;
    text-align: center;
    background-color: #ededed;
    >img{
        width: 100%;
    }
}
.iteminfo{
    overflow: hidden;
    flex-grow: 1;
    margin-left: 25px;
    font-size: 16px;
    > p{
        overflow: hidden;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .itemName{
        color: #333;
    }
    .itemBio{
        font-size: 14px;
        color: #999;
    }
}
.itemFollow{
    display: flex;
    justify-content: center;
}
</style>