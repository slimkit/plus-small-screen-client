<template>
    <div>
        <head-top title='发现' />
        <div></div>
        <transition-group tag="ul" class='entry__group padding' v-for='(group, index) in entrys' :key='`${prefix}-entry-group-${index}`' name="slide">
            <li v-for='{icon,title, path, tips, new_tips} in group' :key='`${prefix}-entry-${icon}`' class="entry__item" @click='to(path)'>
                <v-icon :type='`${prefix}-${icon}`' class='entry__item--prepend' />
                <span>{{ title }}</span>
                <v-badge :dot='new_tips'>{{ tips }}</v-badge>
                <svg class='entry__item--append'>
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
                </svg>
            </li>
        </transition-group>
        <foot-guide></foot-guide>
    </div>
</template>
<script>
import HeadTop from "../../components/HeadTop";
import FootGuide from "../../components/FootGuide";
export default {
  name: "discoverIndex",
  components: {
    HeadTop,
    FootGuide
  },
  data() {
    return {
      prefix: "discover",
      entrys: [
        [
          {
            title: "资讯",
            icon: "news",
            path: "/news",
            new_tips: false,
            tips: ""
          },
          {
            title: "圈子",
            icon: "group",
            path: "/group",
            new_tips: false,
            tips: ""
          },
          {
            title: "问答",
            icon: "question",
            path: "/question",
            new_tips: false,
            tips: ""
          }
        ],
        [
          {
            title: "排行",
            icon: "rank",
            path: "/rank",
            new_tips: false,
            tips: ""
          }
        ],
        [
          {
            title: "找人",
            icon: "find",
            path: "/find",
            new_tips: true,
            tips: "500米内有一大波玩家赶来"
          }
        ]
      ]
    };
  },
  methods: {
    to(path) {
      this.$router.push({ path });
    }
  }
};
</script>
