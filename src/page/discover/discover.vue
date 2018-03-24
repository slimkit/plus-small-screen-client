<template>
  <div class="p-discover">
    <header class="m-box m-pos-f m-main m-bb1 m-head-top">
      <div class="m-box m-aln-center m-flex-grow1 m-flex-base0"></div>
      <div class="m-box m-aln-center m-flex-grow1 m-flex-base0 m-justify-center m-head-top-title">
        <span>发现</span>
      </div>
      <div class="m-box m-aln-center m-flex-grow1 m-flex-base0"></div>
    </header>
    <main style="padding-top: 0.9rem">
      <ul class='entry__group padding' v-for='(group, index) in entrys' :key='`${prefix}-entry-group-${index}`'>
        <li @click='to(path)' class="entry__item" :key='`${prefix}-entry-${icon}`' v-for='{icon,title, path, tips, new_tips} in group'>
          <svg class="m-style-svg m-svg-def entry__item--prepend">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="`#${prefix}-${icon}`"></use>
          </svg>
          <span>{{ title }}</span>
          <v-badge :dot='new_tips'>{{ tips }}</v-badge>
          <svg class='m-style-svg m-svg-def entry__item--append'>
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
          </svg>
        </li>
      </ul>
    </main>
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
