<template>
  <div>
    <head-top :go-back='cancel' append='true' title='圈子'>
      <div slot='append'>
        <v-icon type='base-search' @click.native='to(`/group/search`)'></v-icon>
        <v-icon type='group-add' @click.native='createdGroup'></v-icon>
      </div>
    </head-top>
    <div>
      <!-- 等待加入 -->
      <div class="entry__group padding group-count">
        <div class="entry__item" @click='to(`/group/all`)'>
            <p class="entry__title"><span class="num">{{ count }}</span>个兴趣小组, 等待你的加入</p>
          <svg class='entry__item--append'>
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
          </svg>
        </div>  
      </div>
      <!-- 我加入的 -->
      <div class="group-list-group joined">
        <div class="group-list-label" @click='to(`/group/joined`)'>
          <span>我加入的</span>
          <div class="group-list-more">
            <span>查看更多</span>
            <v-icon type='base-arrow-r'></v-icon>
          </div>
        </div>
        <group-list-item :role='true' v-for='item in joined' v-if='item.id' :key='`group-${item.id}`' :group='item'></group-list-item>
      </div>
      <!-- 我加入的 END -->
      <!-- 推荐 -->
      <div class="group-list-group recommend" v-if='showRecommend'>
        <div class="group-list-label">
          <span>热门推荐</span>
          <div class="group-list-more" @click='getRec'>
            <v-icon type='base-refresh' :style='{ transform: `rotate(${clickCount}turn)` }'></v-icon>
            <span>换一批</span>
          </div>
        </div>
        <group-list-item v-for='item in recommend' v-if='item.id' :key='`group-${item.id}`' :group='item'></group-list-item>
      </div>
      <!-- 推荐 END -->
    </div>
  </div>
</template>
<script>
import HeadTop from "../../components/HeadTop";
import groupListItem from "./components/groupListItem";
export default {
  name: "groupIndex",
  components: {
    HeadTop,
    groupListItem
  },
  data() {
    return {
      joined: [],
      recommend: [],
      count: 0, // 圈子总数
      clickCount: 0
    };
  },
  computed: {
    showRecommend() {
      return this.recommend.length > 0;
    }
  },
  methods: {
    cancel() {
      this.to("/discover");
    },
    to(path) {
      path = typeof path === "string" ? { path } : path;
      if (path) {
        this.$router.push(path);
      }
    },
    createdGroup() {
      this.$router.push("/group/add");
      // this.$Modal.info({
      //     content: '只有认证通过的用户才可以创建圈子, 是否去认证?',
      //     okText: '去认证',
      //     showOk: true,
      //     onOk() {
      //         console.log('去认证');
      //     }
      // })
    },

    // 获取首页圈子
    getGroup() {
      this.$http
        .get("/plus-group/user-groups")
        .then(({ data = [] }) => {
          if (data) {
            this.joined = [...data];
          }
        })
        .catch(err => {
          const {
            response: { data = { message: "获取圈子列表失败" } } = {}
          } = err;
          this.$Message.error(data);
        });

      this.getRec();

      this.$http
        .get("/plus-group/groups/count")
        .then(({ data: { count = 0 } }) => {
          this.count = count;
        })
        .catch(err => {
          console.log(err);
          console.log("获取圈子动态总数失败!");
        });
    },
    // 获取推荐圈子
    getRec() {
      this.$http
        .get("/plus-group/recommend/groups?type=random")
        .then(({ data = [] }) => {
          if (data) {
            this.recommend = [...data];
            this.clickCount += 1;
          }
        });
    }
  },
  created() {
    this.getGroup();
    this.$store.dispatch("GET_GROUP_TYPES");
  }
};
</script>
<style lang="less">
@group-list-prefixCls: group-list;

.entry__group.group-count {
  margin: 10px 0;
  margin-top: 0 !important;
  font-size: 24px;
  span.num {
    margin: 0;
    font-size: 40px;
    color: #f4504d;
  }

  .entry__title {
    margin: 0;
    flex: 1 1 auto;
    color: #999;
  }

  .entry__item--append.v-icon {
    color: #999;
    margin-right: 0;
    width: 24px;
    height: 24px;
  }
}

.@{group-list-prefixCls} {
  &-group {
    background-color: #fff;
    font-size: 26px;
    color: #999;
    & + & {
      margin-top: 10px;
    }
  }
  &-label {
    padding: 0 20px;
    border-bottom: 1px solid #ededed;
    /*no*/
    height: 70px;
    line-height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-more {
    display: flex;
    align-items: center;
    span {
      margin: 0 5px;
    }
    .v-icon {
      width: 24px;
      height: 24px;
      transition: 0.5s ease;
    }
  }
}
</style>
