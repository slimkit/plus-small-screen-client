<template>
  <div class="p-group-detail"
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
        <svg class='m-style-svg m-svg-def' @click='goBack'>
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
        </svg>
        <svg v-show="updating" class="m-style-svg m-svg-def">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-loading"></use>
        </svg>
      </div>
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-center"></div>
      <div class="m-box m-flex-grow1 m-aln-center m-flex-base0 m-justify-end"></div>
    </header>
    <div v-if="loading" class="m-pos-f m-spinner">
      <div></div>
      <div></div>
    </div>
    <main 
      style="overflow-x: hidden; overflow-y:auto; min-height: 100vh"
      >
      <div ref="banner" class="p-group-detail-banner"
      :style="[groupBackGround,paddingTop, {transitionDuration: dragging ? '0s' : '300ms'}]">
        <div class="m-box m-aln-end m-justify-st m-pos-f p-group-detail-bg-mask">
          <div class="p-group-detail-avatar">
            <img :src="groupAvatar">
          </div>
          <div class="m-box-model m-flex-grow1 m-flex-shrink1 m-flex-base0">
            <h3>{{ group.name }}</h3>
            <p>
              <span append to="member" tag="span">成员:<i>{{ groupUserCount }}</i></span>
            </p>
            <p>
              <span append to="followings" tag="span">地址:<i>位置</i></span>
            </p>
          </div>
          <div class="m-box m-aln-center m-flex-grow0 m-flex-shink0 group-item-action c_fff">
            <button class="m-text-cut" v-if="!joined" :disabled="loading" @click="beforeJoined">
              <svg class="m-style-svg m-svg-def" :style="loading ? {} : {width: '0.2rem', height:'0.2rem'}">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="`#${loading?'base-loading':'foot-plus'}`"></use>
              </svg>
              <span>加入</span>
            </button>
          </div>
        </div>
      </div>
      <div class="m-text-box p-group-detail-info">
        <p>圈主：<span>{{ groupOwner.name }}</span></p>
        <p>简介：<span>{{ summary }}</span></p>
      </div>
      <div 
      v-clickoutside="hidenFilter"
      @click="showFilter = !showFilter" 
      class="m-box m-aln-center m-justify-bet p-group-detail-filter-box" 
      >
        <span>帖子数量<em>{{ groupPostsCount }}</em></span>
        <div class="m-box m-aln-center p-group-detail-filter">
          <span>{{ feedTypes[screen] }}</span>
          <svg class="m-style-svg m-svg-def">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-filter-list"></use>
          </svg>
          <transition v-if="showFilter">
            <ul class="p-group-detail-filter-options">
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
      <ul class="p-group-detail-feeds">
        <li
        v-for="feed in pinneds"
        :key='`gdf-${groupID}-pinned-feed-${feed.id}`'>
          <group-feed-card :pinned="true" :feed="feed" />
        </li>
        <li 
        v-for="feed in posts"
        :key='`gdf-${groupID}-feed-${feed.id}`'>
          <group-feed-card :feed="feed" />
        </li>
      </ul>
      <div class="m-box m-aln-center m-justify-center load-more-box">
        <span v-if="noMoreData" class="load-more-ph">---没有更多---</span>
        <span v-else class="load-more-btn"
          @click.stop="getFeeds(true)"
        >
          {{fetchFeeding ? "加载中..." : "点击加载更多"}}
        </span>
      </div>
    </main>
  </div>
</template>
<script>
import _ from "lodash";
import bus from "@/bus.js";
import GroupFeedCard from "@/components/FeedCard/GroupFeedCard.vue";

import { joinGroup } from "@/api/group.js";
import { getGroupInfoById, getGroudFeedsByType } from "@/api/group.js";
export default {
  name: "group-detail",
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
    GroupFeedCard
  },
  data() {
    return {
      preGID: 0,

      scrollTop: 0,
      bannerHeight: 0,
      loading: true,
      dY: 0,
      startY: 0,
      dragging: !1,
      updating: !1,

      typeFilter: null,
      showFilter: !1,
      screen: "latest_post",

      feedTypes: {
        latest_post: "最新帖子",
        latest_reply: "最新回复"
      },

      noMoreData: false,
      fetchFeeding: false,

      posts: [],
      pinneds: [],
      group: {}
    };
  },
  computed: {
    groupID() {
      return this.$route.params.groupID;
    },
    currentUser() {
      return this.$store.state.CURRENTUSER;
    },
    groupOwner() {
      return (this.group.founder || { user: {} }).user;
    },
    groupUserCount() {
      return ~~this.group.users_count;
    },
    groupPostsCount() {
      return ~~this.group.posts_count;
    },
    summary() {
      const summary = this.group.summary || "";
      return summary;
    },
    groupAvatar() {
      return this.group.avatar;
    },

    groupBackGround() {
      return {
        "background-image": this.groupAvatar ? `url("${this.groupAvatar}")` : ""
      };
    },

    // banner 相关
    paddingTop() {
      return {
        paddingTop:
          ((this.bannerHeight + 80 * Math.atan(this.dY / 200)) /
            (this.bannerHeight * 2)) *
            100 +
          "%"
      };
    },

    joined() {
      return this.group.joined || false;
    }
  },

  methods: {
    beforeJoined() {
      if (this.joined || this.loading) return;
      this.loading = true;
      this.mode === "paid" && this.money > 0
        ? bus.$emit("payfor", {
            title: "申请加入圈子",
            confirmText: "支付并加入",
            amount: this.money,
            content: `您只需支付${this.money}积分来加入圈子`,
            onOk: () => {
              joinGroup(this.group.id).then(
                ({ data: { message = "加圈成功" } }) => {
                  this.$Message.success(message);
                  this.group.joined = true;
                  this.loading = false;
                }
              );
            },
            onCancel: () => {
              this.loading = false;
            }
          })
        : joinGroup(this.group.id).then(() => {
            this.loading = false;
            this.group.joined = true;
          });
    },
    hidenFilter() {
      this.showFilter = false;
    },
    getFeeds(more = false) {
      if (this.fetchFeeding) return;
      this.fetchFeeding = true;
      const offset = more ? this.pinneds.length + this.posts.length : 0;
      getGroudFeedsByType(this.groupID, this.screen, 3, offset).then(
        ({ pinneds = [], posts = [] }) => {
          this.posts = more ? [...this.posts, ...posts] : posts;
          this.pinneds = more ? [...this.pinneds, ...pinneds] : pinneds;

          this.fetchFeeding = false;
          this.noMoreData = posts.length < 3;
        }
      );
    },

    updateData() {
      this.updating = true;
      this.dY = 0;
      getGroupInfoById(this.groupID)
        .then(group => {
          this.group = group;
          this.updating = this.loading = false;
          this.getFeeds();
        })
        .catch(err => {
          this.$Message.error(err.message);
          this.goBack();
        });
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
  created() {
    this.updateData();
  },
  mounted() {
    this.typeFilter = this.$refs.typeFilter;
    this.bannerHeight = this.$refs.banner.getBoundingClientRect().height;
  },

  activated() {
    this.preGID !== this.groupID
      ? ((this.loading = true), (this.feeds = []), this.updateData())
      : setTimeout(() => {
          this.loading = false;
        }, 300);

    window.addEventListener("scroll", this.onScroll);

    this.preGID = this.groupID;
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
.m-user-home-foot {
  height: 90px;
  top: initial;
  bottom: 0;
  font-size: 30px;
  > div {
    width: 1/3 * 100%;
    + div {
      border-left: 1px solid @border-color; /*no*/
    }
  }
  .m-svg-def {
    width: 32px;
    height: 32px;
    margin: 0 10px;
  }
}
.p-group-detail-banner {
  // overflow-x: hidden;
  padding-top: 320/640 * 100%;
  width: 100%;
  transform: translate3d(0, 0, 0);
  background-size: cover;
  background-position: center;
  font-size: 28px;
  color: #fff;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);

  h3 {
    font-size: 32px;
  }
  p {
    span + span {
      margin-left: 40px;
    }
    i {
      margin: 0 5px;
    }
  }

  .p-group-detail-avatar {
    margin-right: 20px;
    overflow: hidden;
    width: 140px;
    height: 140px;
    border: 2px solid #fff;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  //背景虚化
  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -1;
    margin: auto;

    filter: blur(15px);
    transform: scale(1.1);
    background: inherit;
  }
}

.p-group-detail-bg-mask {
  padding: 0 25px 50px;
  background-color: rgba(124, 124, 124, 0.2);
}

.p-group-detail-info {
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

.p-group-detail-tag {
  margin-top: 20px;
  margin-left: 10px;
  display: inline-block;
  padding: 5px 20px;
  font-size: 24px;
  background-color: rgba(102, 102, 102, 0.1);
  border-radius: 18px;
}
.p-group-detail-filter {
  position: relative;
  &-box {
    padding: 25px 20px;
    color: @text-color3;
    font-size: 26px;
    position: sticky;
    top: 88px;
    z-index: 9;
    background-color: #f4f5f6;
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

.p-group-detail-feeds {
  li + li {
    margin-top: 10px;
  }
}

.m-head-top {
  border-bottom: 0;
  &.bg-transp {
    color: #fff;
    transition: background 0.3s ease;
    background-color: transparent;
  }
  &.show-title {
    background-image: none;
    background-color: #fff;
    border-bottom: 1px solid @border-color; /*no*/
    color: #000;
    .m-trans-y {
      transform: none;
    }
  }
  .m-trans-y {
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }
}

.group-item-action {
  button {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 126px;
    height: 50px;

    border: 1px solid currentColor; /*no*/
    border-radius: 8px;
    background-color: #fff;

    font-size: 24px;
    color: @primary;
    transition: all 0.3s ease;
    span {
      transition: all 0.3s ease;
      margin-left: 5px;
    }
    &[disabled] {
      color: @border-color;
      cursor: not-allowed;
      span {
        color: @text-color3;
      }
      svg {
        opacity: 0.5;
      }
    }
  }

  &.c_fff {
    button {
      background-color: transparent;
      color: #fff;
    }
  }
}
</style>
