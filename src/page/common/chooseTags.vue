<template>
  <transition 
    name="router-slid" 
    mode="out-in">
    <div class="full-page">
      <head-top 
        :go-back="true" 
        :title="$route.meta.title" 
        append="true">
        <div 
          slot="append" 
          @click="ok">{{ selected.length>0 ? '下一步': '取消' }}</div>
      </head-top>
      <div class="user--tags">
        <label class="user--tags-label">可选5个标签, 已选择{{ selected.length }}个标签</label>
        <div class="user--tags-list">
          <div 
            v-for="tag in selected" 
            v-if="tag.id" 
            :key="`group--tag-selected-${tag.id}`" 
            class="user--tags-list-item ellipsis selected" 
            @click="selectTag(tag)">
            <v-icon type="base-clean"/>
            {{ tag.name }}
          </div>
        </div>
      </div>
      <div 
        v-for="group in tags" 
        :key="group.name" 
        class="user--tags">
        <label class="user--tags-label">{{ group["name"] }}</label>
        <div class="user--tags-list">
          <div 
            v-for="tag in group[&quot;tags&quot;]" 
            v-if="tag.id" 
            :class="{active: selected.indexOf(tag) > -1 }" 
            :key="`group--tag-${tag.id}`" 
            class="user--tags-list-item ellipsis" 
            @click="selectTag(tag)">
            {{ tag.name }}
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import { mapState } from "vuex";
import HeadTop from "@/components/HeadTop";

export default {
  name: "ChooseTags",
  components: {
    HeadTop
  },
  data() {
    return {
      selected: []
    };
  },
  computed: {
    ...mapState({
      tags: s => s.USERTAGS,
      cur_selected: s => s.CUR_SELECTED_TAGS
    })
  },
  created() {
    this.$store.dispatch("GET_USER_TAGS");
    this.selected = this.cur_selected;
  },
  methods: {
    ok() {
      this.$store.state.CUR_SELECTED_TAGS = this.selected;
      this.$router.go(this.$route.query.redirect);
    },
    selectTag(tag) {
      const index = this.selected.indexOf(tag);
      if (index > -1) {
        let old = this.selected;
        old.splice(index, 1);
        this.selected = old;
      } else {
        if (this.selected.length < 5) {
          this.selected = Array.from(new Set([...this.selected, tag]));
        } else {
          this.$Message.error("标签最多选择5个");
        }
      }
    }
  }
};
</script>
<style lang='less'>
.user--tags {
  padding-left: 20px;
  padding-right: 20px;
  font-size: 0;
  margin-top: 10px;
  & + & {
  }
  line-height: 1;
  &-label {
    display: block;
    font-size: 26px;
    color: #999;
    padding-bottom: 30px;
  }
  &-list {
    display: flex;
    flex-wrap: wrap;
    margin-left: -30px;
    &-item {
      overflow: visible;
      margin-bottom: 30px;
      margin-left: 30px;
      width: calc(~"1/3*100% - 30px");
      height: 60px;
      line-height: 58px;
      text-align: center;
      color: #666;
      font-size: 28px;
      background-color: #f4f5f5;
      position: relative;
      &.active {
        color: #59b6d7;
        background-color: rgba(89, 182, 215, 0.15);
      }
      &.selected {
        .v-icon {
          width: 30px;
          height: 30px;
          color: #b3b3b3;
          position: absolute;
          top: -16px;
          left: -16px;
        }
      }
    }
  }
}
</style>
