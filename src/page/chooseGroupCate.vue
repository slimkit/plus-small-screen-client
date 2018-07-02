<template>
  <transition name="fade">
    <div 
      v-if="show" 
      class="m-box-model m-pos-f p-choose-category m-main">
      <header class="m-box m-aln-center m-justify-bet m-flex-grow0 m-flex-shrink0 m-head-top m-main m-bb1">
        <div class="m-flex-grow1 m-flex-shrink1">
          <svg 
            class="m-style-svg m-svg-def" 
            @click="cancel">
            <use 
              xmlns:xlink="http://www.w3.org/1999/xlink" 
              xlink:href="#base-back"/>
          </svg>
        </div>
        <div class="m-flex-grow1 m-shrink1 m-head-top-title m-text-c">
          <span>{{ title || "圈子分类" }}</span>
        </div>
        <div class="m-flex-grow1 m-flex-shrink1 m-text-r"/>
      </header>
      <main>
        <ul class="m-cates">
          <li
            v-for="cate in GROUP_CATES"
            v-if="cate.id"
            :key="cate.id"
            class="m-cate"
            @click="selected(cate)"><span>{{ cate.name }}</span></li>
        </ul>
      </main>
    </div>
  </transition>
</template>
<script>
import bus from "@/bus.js";
import { mapState } from "vuex";
import { getGroupCates } from "@/api/group.js";
export default {
  name: "ChooseGroupCate",
  data() {
    return {
      show: false,
      title: ""
    };
  },
  computed: {
    ...mapState(["GROUP_CATES"])
  },
  created() {
    getGroupCates().then(data => {
      this.cates = data;
    });
    bus.$on("choose-group-cate", onSelected => {
      typeof onSelected === "function" && (this.onSelected = onSelected);
      this.show = true;
      this.scrollable = false;
    });
  },
  beforeDestroy() {
    bus.$off("choose-group-cate");
  },
  methods: {
    onSelected() {},
    selected(cate) {
      typeof this.onSelected === "function" && this.onSelected(cate);
      this.cancel();
    },
    cancel() {
      this.show = false;
      this.scrollable = true;
    }
  }
};
</script>

<style lang="less">
.p-choose-category {
  .m-cates {
    padding: 30px;
  }
}
.m-cates {
  margin-top: -30px;
  margin-left: -30px;
}

.m-cate {
  display: inline-block;
  padding: 0 10px;
  margin-top: 30px;
  margin-left: 30px;
  width: calc((1 / 4 * 100%) ~" - 30px");
  height: 60px;
  line-height: 60px;
  font-size: 28px;
  background-color: #f4f5f5;
  border-radius: 8px;
  span {
    overflow: hidden;
    width: 100%;
    display: inline-block;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: center;
  }
}
</style>
