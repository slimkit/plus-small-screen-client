<template>
  <div class="m-lim-width m-art-comment">
    <div class="m-box m-art-comment-wrap">
      <router-link :to="`/user/${user.id}`" class="m-flex-shrink0 m-flex-grow0 m-avatar-box">
        <img :src="user.avatar">
      </router-link>
      <section class="m-box-model m-flex-grow1 m-flex-shrink1 m-art-comment-body">
        <header class="m-box m-aln-center m-justify-bet m-art-comment-usr">
          <h4 class="m-flex-grow1 m-flex-shrink1">{{ user.name }}</h4>
          <div class="m-box m-aln-center">
            <span v-if="pinned" class="m-art-comment-icon-top">置顶</span>
            <span>{{ time | time2tips }}</span>
          </div>
        </header>
        <article 
        class="m-text-box m-art-comment-con"
        :class="{maxh: !isShowAll}"
        @click="handelClick">
          <template v-if="replyUser">
            <span class="m-art-comment-rep">
              回复<router-link :to='`/user/${replyUser.id}`'>{{ replyUser.name }}</router-link>：
            </span>
          </template>
          {{ body }}
          <span @click.stop="isShowAll = !isShowAll" v-show="body.length > 60 && !isShowAll" class="m-text-more"> >>更多</span>
        </article>
      </section>
    </div>
  </div>
</template>
<script>
export default {
  name: "comment-item",
  props: {
    comment: null,
    pinned: Boolean
  },
  data() {
    return {
      showAll: false
    };
  },
  computed: {
    isShowAll: {
      get() {
        return this.body.length < 60 || this.showAll;
      },
      set(val) {
        this.showAll = val;
      }
    },
    user() {
      const { user } = this.comment;
      return user && user.id ? user : {};
    },
    replyUser() {
      const { reply } = this.comment;
      return reply && reply.id ? reply : null;
    },
    body() {
      return this.comment.body || "";
    },
    time() {
      return this.comment.created_at || "";
    }
  },
  methods: {
    handelClick() {
      if (!this.isShowAll) return (this.isShowAll = !this.isShowAll);
      this.$emit("click", this.user.id, this.user.name, this.comment.id);
    }
  },
  mounted() {
    this.$store.commit("SAVE_USER", this.user);
  }
};
</script>
