<template>
  <div class="topic-card">
    <router-link
      :src="topic.avatar"
      :to="`/question-topics/${topic.id}`"
      tag="img"
      class="topic-image" />
    <router-link
      :to="`/question-topics/${topic.id}`"
      tag="a"
      class="title">
      <div class="topic m-text-cut">{{ topic.name }}</div>
      <div class="label">
        <span>{{ topic.follows_count }}</span>&nbsp;关注
        ·
        <span>{{ topic.questions_count }}</span>&nbsp;问题
      </div>
    </router-link>
    <button
      v-if="topic.has_follow || type === 'follow'"
      class="follow active"
      @click="handleUnfollow(topic)"><span>✓</span>已关注</button>
    <button
      v-else
      class="follow"
      @click="handleFollow(topic)"><span>+</span>关注</button>
  </div>
</template>

<script>
export default {
  props: {
    topic: { type: Object, required: true },
    type: { type: String, default: "hot" }
  },
  methods: {
    handleUnfollow(topic) {
      this.$emit("unfollow", topic);
    },
    handleFollow(topic) {
      this.$emit("follow", topic);
    }
  }
};
</script>

<style lang="less" scoped>
.topic-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 175px;
  padding: 28px;
  background-color: #fff;
  border-bottom: solid 1px #d7d8d8;

  .topic-image {
    flex: none;
    width: 120px;
    height: 120px;
    margin-right: 28px;
    border: none;
    background-color: #d7d8d8;
  }

  .title {
    flex: auto;
    min-width: 0;

    .topic {
      font-size: 32px;
      font-weight: normal;
      font-stretch: normal;
      color: #333;
    }

    .label {
      font-size: 28px;
      font-weight: normal;
      font-stretch: normal;
      color: #666;
      margin-top: 16px;

      > span {
        color: #59b6d7;
      }
    }
  }

  .follow {
    flex: none;
    height: 50px;
    background-color: #fff;
    border-radius: 8px;
    border: solid 2px #59b6d7;
    color: #59b6d7;
    font-size: 26px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 5px;
    letter-spacing: 0px;
    outline: none;

    > span {
      width: 20px;
      height: 20px;
      font-size: 36px;
      margin-right: 2px;
    }

    &.active {
      color: #ccc;
      border: solid 2px #ccc;
    }
  }
}
</style>
