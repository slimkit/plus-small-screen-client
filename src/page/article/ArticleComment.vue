<template>
  <div class="m-lim-width m-art-comment">
    <div class="m-box m-art-comment-wrap">
      <avatar :user="user"></avatar>
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
              回复<router-link :to='`/users/${replyUser.id}`'>{{ replyUser.name }}</router-link>：
            </span>
          </template>
          {{ body }}
          <span @click.stop="isShowAll = !isShowAll" v-show="bodyLength > 60 && !isShowAll" class="m-text-more"> >>更多</span>
        </article>
      </section>
    </div>
  </div>
</template>
<script>
/**
 * 字符串长度计算(仅获取中文字符字数)
 * @author jsonleex <jsonlseex@163.com>
 * 按 4个英文字符 = 1个中文字符 计算
 */
function strLength(str) {
  let totalLength = 0;
  let i = 0;
  let charCode;
  for (; i < str.length; i++) {
    charCode = str.charCodeAt(i);
    if (charCode < 0x007f) {
      totalLength = totalLength + 0.25;
    } else if (charCode >= 0x0080 && charCode <= 0x07ff) {
      totalLength += 1;
    } else if (charCode >= 0x0800 && charCode <= 0xffff) {
      totalLength += 1.5;
    }
  }
  return totalLength;
}
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
        return this.bodyLength < 60 || this.showAll;
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
    bodyLength() {
      return strLength(this.body);
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
