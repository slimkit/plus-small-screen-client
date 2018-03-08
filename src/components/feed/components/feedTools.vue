<template>
    <div class="feed-tool">
        <div class="feed-tool-item" :class='{hasLike}' @click.stop='likeFeed'>
            <v-icon :type='`${ hasLike ? "feed-like":"feed-unlike"}`' class='feed-tool-icon'></v-icon>
            <span>{{ likeCount }}</span>
        </div>
        <div class="feed-tool-item" @click.stop='commentFeed'>
            <v-icon type='feed-comment' class='feed-tool-icon'></v-icon>
            <span>{{ commentCount }}</span>
        </div>
        <div class="feed-tool-item">
            <v-icon type='feed-eye' class='feed-tool-icon'></v-icon>
            <span>{{ viewCount }}</span>
        </div>
        <div class="feed-tool-item" @click.stop='moreAction'>
            <v-icon type='feed-more' class='feed-tool-icon'></v-icon>
        </div>
    </div>
</template>
<script>
const isNum = {
  validator (val) {
    return typeof (+val) === 'number'
  }
}
export default {
  name: 'feedTool',
  props: {
    hasLike: {
      type: Boolean,
      required: true
    },
    likeCount: {
      type: [Number, String],
      required: true,
      ...isNum
    },
    viewCount: {
      type: [Number, String],
      required: true,
      ...isNum
    },

    commentCount: {
      type: [Number, String],
      required: true,
      ...isNum
    }
  },
  methods: {
    likeFeed () {
      this.$emit('likeFeed')
    },
    commentFeed () {
      this.$emit('commentFeed', this.com)
    },
    moreAction () {
      this.$emit('moreAction')
    }
  }
}
</script>
<style lang='less' scoped>
@prefix: feed-tool;
.@{prefix} {
    width: 100%;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &-item {
        display: flex;
        color: #b3b3b3;
        font-size: 24px;
        align-items: center;
        span {
            margin-left: 10px;
        }
        &.hasLike {
            color: #f4504d
        }
    }
    &-icon {
        width: 40px;
        height: 40px;
    }
}
</style>