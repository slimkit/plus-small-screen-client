<template>
  <div class="p-user-home"
    @mousedown='startDrag'
    @touchstart='startDrag'
    @mousemove.stop='onDrag'
    @touchmove.stop='onDrag'
    @mouseup='stopDrag'
    @touchend='stopDrag'
    @mouseleave='stopDrag'
    >
    <header 
      ref="head"
      class="m-box m-lim-width m-pos-f m-head-top bg-transp"
      :class="{ 'show-title': scrollTop > 1 / 2 * bannerHeight }">
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0">
        <svg class='m-style-svg m-svg-def' @click='goback'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
        </svg>
        <svg v-show="updating" class="m-style-svg m-svg-def rotate">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-loading"></use>
        </svg>
      </div>
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-center m-trans-y">
        {{ user.name }}
      </div>
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end">
        <svg class="m-style-svg m-svg-def">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#feed-more"></use>
        </svg>
      </div>
    </header>
    <div v-if="loading" class="m-pos-f m-spinner">
      <div></div>
      <div></div>
    </div>
    <main>    
      <div ref="banner" class="m-urh-banner" 
      :style="[userBackGround,paddingTop, {transitionDuration: dragging ? '0s' : '300ms'}]">
        <div class="m-box-model m-aln-center m-justify-end m-pos-f">
          <avatar :user="user" size="big" />
          <h3>{{ user.name }}</h3>
          <p>
            <span>粉丝<i>{{ followersCount | formatNum }}</i></span>
            <span>关注<i>{{ followingsCount | formatNum }}</i></span>
          </p>
        </div>
      </div>
      <div class="m-text-box m-urh-info">
        <p class="m-cf94" v-if="verified">认证：<span>{{ verified.description }}</span></p>
        <p>地址：<span>{{ user.location }}</span></p>
        <p>简介：<span>{{ user.bio }}</span></p>
        <p style="margin-top: 0">
          <i
          v-if="tag.id"
          class="m-urh-tag"
          v-for="tag in tags"
          :key="`tag-${tag.id}`"
          >{{ tag.name }}</i>
        </p>
      </div>
      <div 
      v-clickoutside="hidenFilter"
      @click="showFilter = !showFilter" 
      class="m-box m-aln-center m-justify-bet m-urh-filter-box" 
      >
        <span>{{ feedsCount }}个动态</span>
        <div class="m-box m-aln-center m-urh-filter" v-if="isMine">
          <span>{{ feedTypes[screen] }}</span>
          <svg class="m-style-svg m-svg-def">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-filter-list"></use>
          </svg>
          <transition v-if="showFilter">
            <ul class="m-urh-filter-options">
              <li
              :key="key"
              @click="screen = key"
              v-for="(val, key) of feedTypes"
              class="m-box m-aln-center m-justify-bet"
              >
                <span>{{ val }}</span>
                <svg class="m-style-svg m-svg-def" v-if="screen === key">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-checked"></use>
                </svg>
              </li>
            </ul>
          </transition>
        </div>
      </div>
      <ul class="m-urh-feeds">
        <li 
        v-if="feed.id"
        v-for="feed in feeds"
        :key='`ush-${userID}-feed${feed.id}`'>
          <feed-card
            :feed="feed"
            :timeLine="true" />
        </li>
      </ul>
      <div class="m-box m-aln-center m-justify-center load-more-box">
        <span v-if="noMoreData" class="load-more-ph">---没有更多---</span>
        <span v-else class="load-more-btn" @click.stop="fetchUserFeed(true)">
          {{fetchFeeding ? "加载中..." : "点击加载更多"}}
        </span>
      </div>
    </main>
  </div>
</template>
<script>
import _ from "lodash";
import FeedCard from "@/components/FeedCard/FeedCard.vue";
export default {
  name: "user-home",
  directives: {
    clickoutside: {
      bind(el, binding) {
        function documentHandler(e) {
          if (el.contains(e.target)) {
            return false;
          }
          if (binding.expression) {
            binding.value(e);
          }
        }
        el.__vueClickOutside__ = documentHandler;
        document.addEventListener("click", documentHandler);
      },
      unbind(el) {
        document.removeEventListener("click", el.__vueClickOutside__);
        delete el.__vueClickOutside__;
      }
    }
  },
  components: {
    FeedCard
  },
  data() {
    return {
      preID: 0,
      scrollTop: 0,
      bannerHeight: 0,
      loading: true,
      dY: 0,
      startY: 0,
      dragging: !1,
      updating: !1,

      typeFilter: null,
      showFilter: !1,
      screen: "all",

      feeds: [],
      feedTypes: {
        all: "全部动态",
        paid: "付费动态",
        pinned: "置顶动态"
      },
      noMoreData: false,
      fetchFeeding: false,

      tags: []
    };
  },
  computed: {
    currentUser() {
      return this.$store.state.CURRENTUSER;
    },
    userID() {
      return ~~this.$route.params.userID;
    },
    user: {
      get() {
        return this.$store.getters.getUserById(this.userID) || {};
      },
      set(val) {
        this.$store.commit("SAVE_USER", this.user);
      }
    },
    extra() {
      return this.user.extra || {};
    },
    isMine() {
      return this.userID === this.currentUser.id;
    },
    followersCount() {
      return this.extra.followers_count || 0;
    },
    followingsCount() {
      return this.extra.followings_count || 0;
    },
    feedsCount() {
      return this.extra.feeds_count || 0;
    },
    userBackGround() {
      const ubg = this.user.bg;
      return ubg
        ? {
            "background-image": `url("${ubg}")`
          }
        : {};
    },
    verified() {
      return this.user.verified;
    },

    // banner 相关
    paddingTop() {
      return {
        paddingTop:
          (this.bannerHeight + 80 * Math.atan(this.dY / 200)) /
            (this.bannerHeight * 2) *
            100 +
          "%"
      };
    },
    after() {
      const len = this.feeds.length;
      return len > 0 ? this.feeds[len - 1].id : "";
    }
  },
  watch: {
    screen() {
      this.updateData();
    },
    userID(val) {
      val !== this.preID &&
        ((this.loading = true),
        (this.feeds = []),
        (this.tags = []),
        this.updateData());
    }
  },
  methods: {
    goback() {
      this.$router.back();
    },
    hidenFilter() {
      this.showFilter = false;
    },
    fetchUserInfo() {
      this.$http
        .get(`/users/${this.userID}`)
        .then(({ data = {} }) => {
          this.user = Object.assign({}, this.user, data);
          this.preID = this.userID;
          this.loading = false;
        })
        .catch(
          ({ response: { data = { message: "获取用户数据失败" } } = {} }) => {
            this.$Message.error(data);
          }
        );
    },
    fetchUserTags() {
      this.$http.get(`/users/${this.userID}/tags`).then(({ data = [] }) => {
        this.tags = data;
      });
    },

    fetchUserFeed(loadmore) {
      if (this.fetchFeeding) return;
      this.fetchFeeding = true;
      const params = {
        limit: 15,
        type: "users",
        user: this.userID
      };

      loadmore && (params.after = this.after);
      this.isMine && this.screen !== "all" && (params.screen = this.screen);

      this.$http
        .get("/feeds", {
          params
        })
        .then(({ data: { feeds = [] } }) => {
          this.feeds = loadmore ? [...this.feeds, ...feeds] : feeds;
          this.updating = false;
          this.fetchFeeding = false;
          this.noMoreData = feeds.length < params.limit;
        });
    },
    updateData() {
      this.updating = true;
      this.dY = 0;
      this.fetchUserInfo();
      this.fetchUserFeed();
      this.fetchUserTags();
    },
    onScroll: _.debounce(function() {
      this.scrollTop = Math.max(
        0,
        document.body.scrollTop,
        document.documentElement.scrollTop
      );
    }, 1000 / 60),
    startDrag(e) {
      e = e.changedTouches ? e.changedTouches[0] : e;
      if (this.scrollTop <= 0 && !this.updating) {
        this.startY = e.pageY;
        this.dragging = true;
      }
    },
    onDrag(e) {
      const $e = e.changedTouches ? e.changedTouches[0] : e;
      if (this.dragging && $e.pageY - this.startY > 0 && window.scrollY <= 0) {
        // 阻止 原生滚动 事件
        e.preventDefault();
        this.dY = $e.pageY - this.startY;
      }
    },
    stopDrag() {
      this.dragging = false;
      this.dY > 300 && this.scrollTop <= 0 ? this.updateData() : (this.dY = 0);
    }
  },
  mounted() {
    this.typeFilter = this.$refs.typeFilter;
    this.bannerHeight = this.$refs.banner.getBoundingClientRect().height;
  },
  activated() {
    this.preID !== this.userID
      ? this.updateData()
      : setTimeout(() => {
          this.loading = false;
        }, 600);
    window.addEventListener("scroll", this.onScroll);
  },
  deactivated() {
    this.loading = true;
    this.showFilter = false;
    window.removeEventListener("scroll", this.onScroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.onScroll);
  }
};
</script>

<style lang="less" scoped>
.m-urh-banner {
  padding-top: 320/640 * 100%;
  width: 100%;
  transform: translate3d(0, 0, 0);
  background-size: cover;
  background-position: center;
  background-image: url("../images/user_home_default_cover.png");
  font-size: 28px;
  color: #fff;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
  h3 {
    margin: 20px 0;
    font-size: 32px;
  }
  p {
    margin: 0 0 30px 0;
    span + span {
      margin-left: 40px;
    }
    i {
      margin: 0 5px;
    }
  }
}
.m-urh-info {
  background-color: #fff;
  padding: 30px 20px;
  font-size: 26px;
  line-height: 36px;
  color: @text-color3;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.1); /*no*/
  p + p {
    margin-top: 10px;
  }
}

.m-urh-tag {
  margin-top: 10px;
  display: inline-block;
  padding: 0 15px;
  font-size: 20px;
  height: 36px;
  background-color: rgba(102, 102, 102, 0.1);
  border-radius: 18px;
  & + & {
    margin-left: 10px;
  }
}
.m-urh-filter {
  position: relative;
  &-box {
    padding: 25px 20px;
    color: @text-color3;
    font-size: 26px;
    .m-style-svg {
      margin-left: 20px;
    }
  }
  &-options {
    overflow: hidden;
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 9;
    min-width: 200px;
    border-radius: 8px;
    background-color: #fff;
    transform: translate3d(0, 25px, 0);
    box-shadow: 0 0 10px 0 rgba(221, 221, 221, 0.6); /*no*/
    li {
      padding: 25px 20px;
      font-size: 24px;
      color: @text-color3;
      & + li {
        border-top: 1px solid @border-color; /*no*/
      }
    }
  }
}

.m-urh-feeds {
  li + li {
    margin-top: 10px;
  }
}

.m-head-top {
  &.bg-transp {
    transition: background 0.3s ease;
    background-color: transparent;
    color: #fff;
    border-bottom: 1px solid transparent; /*no*/
  }
  &.show-title {
    background-color: #fff;
    color: #000;
    border-bottom-color: @border-color;
    .m-trans-y {
      transform: none;
    }
  }
  .m-trans-y {
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }
}
</style>
