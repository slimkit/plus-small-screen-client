<template>
<div :class="$style.rankContainer" v-show="items.length">
  <div :class="$style.header">
    <span :class="$style.headerTitle">{{ title }}</span>
    <span :class="$style.headerAllbtn">
      <span @click='changeUrl(`/rank/show?type=${type}`)'>全部 <RightArrowIcon height="12" width="12" color="#999" /></span>
    </span>
  </div>
  <div :class="$style.content">
    <div :class="$style.user"  v-for="item in items" @click="changeUrl(`/users/feeds/${item.id}`)">
      <div :class="$style.userImageContainer">
        <img v-lazy="item.avatar ? item.avatar : defaultAvatar" :class="$style.userAvatar">
        <img v-if="item.verified" :src="item.verified.icon" :class="$style.userIcon">
      </div>
      <span :class="$style.userName">{{ item.name }}</span>
    </div>
  </div>
</div>
</template>
<script>
  import { changeUrl } from '../../utils/changeUrl';
  import { resolveImage } from '../../utils/resource';
  import RightArrowIcon from '../../icons/RightArrow';

  const defaultAvatar = resolveImage(require('../../statics/images/defaultAvatarx2.png'));
  export default {
    components: {
      RightArrowIcon,
    },
    name: 'rank-show-item',
    props: ['items', 'type', 'title'],
    data(){
      return({
        defaultAvatar,
      })
    },
    computed: {
    },
    methods: {
      changeUrl
    },
    created(){
    }
  }
</script>
</script>
<style lang="less" module>
  .rankContainer {
    background-color: #fff;
    padding: 10px;
    & + .rankContainer{
      margin-top: 4px;
    }
    .header {
      width: 100%;
      height: 20px;
      color: #333;
      .headerTitle {
        display:inline-block;
        float:left;
      }
      .headerAllbtn {
        display:inline-block;
        float:right;
        color: #999;
        font-size: 12px;
      }
    }
    .content {
      margin-top: 10px;
      .user {
        height: 20%;
        width: 20%;
        display: inline-block;
        text-align: center;
        .userImageContainer {
          width: 100%;
          position: relative;
          .userAvatar {
            width:76%;
            border-radius:50%;
          }
          .userIcon {
            width:30%;
            border-radius:50%;
            position: absolute;
            left:60%;
            top:64%;
          }
        }
        .userName {
          font-size: 8px;
          display: inline-block;
          overflow: hidden;
          width: 100%;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
</style>  