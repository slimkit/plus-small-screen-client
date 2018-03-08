<template>
  <section>
    <div :class="`${prefixCls}-item-top`">
      <v-avatar :sex="like.user.sex" :src="like.user.avatar" />
      <section class="userInfo">
        <router-link :class="`${prefixCls}-item-top-link`" :to="`/user/${like.user_id}`">{{ like.user.name }}</router-link>
        <span>赞了你的回答</span>
        <p>{{ like.created_at | time2tips }}</p>
      </section>
    </div>
    <div :class="`${prefixCls}-item-bottom`">
      <section v-if="like.likeable !== null" @click="goToFeedDetail()">
        <div :class="`${prefixCls}-item-bottom-noImg`" class="content">
          {{ like.likeable.body }}
        </div>
        <!-- <div :class="`${prefixCls}-item-bottom-img`" v-else>
          <div class="img">
            <img :src="getImage" :alt="like.user.name">
          </div>
          <div class="content">
            {{ like.likeable.feed_content }}
          </div>
        </div> -->
      </section>
      <section v-if="like.likeable === null">
        <div :class="`${prefixCls}-item-bottom-noImg`" class="content">
          回答已被删除
        </div>
      </section>
    </div>
  </section>
</template>
<script>
const prefixCls = "msgList";
export default {
  name: "questionAnswerItem",
  props: ["like"],
  data: () => ({
    prefixCls
  }),
  methods: {
    /**
     * 进入详情
     * @Author   Wayne
     * @DateTime 2018-01-31
     * @Email    qiaobin@zhiyicx.com
     * @return   {[type]}            [description]
     */
    goToFeedDetail() {
      const { likeable: { id = 0 } } = this.like;
      this.$router.push(`/questions/${id}`);
    }
  },
  computed: {
    /**
     * 获取图片,并计算地址
     * @Author   Wayne
     * @DateTime 2018-01-31
     * @Email    qiaobin@zhiyicx.com
     * @return   {[type]}            [description]
     */
    getImage() {
      const { like } = this;
      const { length } = like.likeable.images;
      if (length > 0) {
        const { 0: img = {} } = like.likeable.images;
        return `/api/v2/files/${img.id}`;
      }

      return false;
    }
  },
  created() {
    // console.log(this.comment)
  }
};
</script>
