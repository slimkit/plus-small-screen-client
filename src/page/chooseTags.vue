<template>
  <transition name="fade">
    <div class="m-box-model m-pos-f p-choose-tags m-main" v-if="show">
      <header class="m-box m-aln-center m-justify-bet m-flex-grow0 m-flex-shrink0 m-head-top m-main m-bb1">
        <div class="m-flex-grow1 m-flex-shrink1">
          <svg class="m-style-svg m-svg-def" @click="nextFuc">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
          </svg>
        </div>
        <div class="m-flex-grow1 m-shrink1 m-head-top-title m-text-c">
          <span>选择标签</span>
        </div>
        <div class="m-flex-grow1 m-flex-shrink1 m-text-r">
        </div>
      </header>
      <main class="m-box-model m-flex-grow1 m-flex-shrink1">
        <section class="m-flex-grow0 m-flex-shrink0 m-tags-group selected m-bb1">
          <span class="m-tags-label">可选择{{ 5 }}个标签，已选择{{ chooseTags.length }}标签</span>
          <transition-group tag="ul"
          style="min-height: 0.9rem"
          class="m-tags"
          >
            <li
            v-for="tag in chooseTags"
            v-if="tag.id"
            :key="`tags-selected-${tag.id}`"
            @click="switchTagStatus(tag, -1)"
            class="m-tag">
              <svg class="m-style-svg m-svg-def">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-clean"></use>
              </svg>
              <span>{{ tag.name }}</span>
            </li>
          </transition-group>
        </section>
        <div class="m-flex-grow1 m-flex-shrink1" style="overflow-y: auto;">
          <section
          :key="group.id"
          v-for="(group, Gindex) in tags"
          class="m-tags-group">
            <span class="m-tags-label">{{ group.name }}</span>
            <transition-group
            tag="ul"
            class="m-tags">
              <li
              v-for="(tag, Tindex) in group.tags"
              v-if="tag.id"
              :key="tag.id"
              @click="switchTagStatus(tag, Gindex, Tindex)"
              :class="{ selected: tag.selected }"
              class="m-tag"><span>{{ tag.name }}</span></li>
            </transition-group>
          </section>
        </div>
      </main>
    </div>
  </transition>
</template>
<script>
import bus from "@/bus.js";
export default {
  name: "choose-tags",
  data() {
    return {
      show: false,
      isFirst: false,
      chooseTags: [],
      loading: false,
      tags: []
    };
  },
  computed: {
    disabled() {
      return this.chooseTags.length === 0;
    }
  },
  created() {
    this.fetchTags();
    bus.$on("choose-tags", ({ nextStep, chooseTags = [] } = {}) => {
      this.isFirst = !this.$lstore.hasData("H5_CHOOSE_TAGS_FIRST");
      typeof nextStep === "function" && (this.nextStep = nextStep);
      chooseTags &&
        chooseTags.length > 0 &&
        this.tags.forEach((g, Gindex) => {
          g.tags.forEach((t, Tindex) => {
            t.Gindex = Gindex;
            t.Tindex = Tindex;
            chooseTags.indexOf(t.id) > -1 &&
              ((t.selected = true), this.chooseTags.push(t));
          });
        });
      this.show = true;
      this.scrollable = false;
      this.isFirst &&
        this.$nextTick(() => {
          bus.$emit("info-tips", {
            content:
              "标签为全局标签，选择合适的标签，系统可推荐你感兴趣的内容，方便找到相同身份或爱好的人，很重要哦！",
            onCancel: () => {
              this.$lstore.setData("H5_CHOOSE_TAGS_FIRST", false);
            }
          });
        });
    });
  },
  methods: {
    nextFuc() {
      // if (this.disabled) return;
      typeof this.nextStep === "function" && this.nextStep(this.chooseTags);
      this.$nextTick(this.cancel);
    },
    nextStep: () => {},
    fetchTags() {
      this.$http.get("/tags").then(({ data }) => {
        this.tags = data;
      });
    },
    switchTagStatus(tag, Gindex, Tindex) {
      const chooseTags = this.chooseTags;
      const isSelected = tag.selected;
      const status = {};
      const obj =
        Gindex > -1
          ? this.tags[Gindex]["tags"][Tindex]
          : this.tags[tag.Gindex]["tags"][tag.Tindex];

      isSelected
        ? (chooseTags.splice(this.chooseTags.indexOf(tag), 1),
          (status.selected = false),
          Object.assign(obj, status),
          this.$http.delete(`/user/tags/${tag.id}`))
        : ((status.selected = true),
          (status.Gindex = Gindex),
          (status.Tindex = Tindex),
          chooseTags.length >= 5
            ? this.$Message.error("标签最多可选5个")
            : (Object.assign(obj, status),
              chooseTags.push(obj),
              this.$http.put(`/user/tags/${tag.id}`)));
      this.$set(this.tags, obj);
      this.chooseTags = chooseTags;
    },
    cancel() {
      this.chooseTags.forEach(tag => {
        delete tag.Gindex;
        delete tag.Tindex;
        delete tag.selected;
      });

      this.show = false;
      this.chooseTags = [];
      this.scrollable = true;
    }
  }
};
</script>
<style lang="less">
.p-choose-tags {
  main {
    overflow-y: auto;
    height: calc(~"100vh - 90px");
  }
  .m-tags-group {
    padding: 0 30px;
    margin-top: 30px;
    &:last-of-type {
      padding-bottom: 30px;
    }
  }
  .m-tags-label {
    font-size: 26px;
    color: @text-color3;
  }

  .m-tags {
    margin-left: -30px;
    margin-top: 0;
    .m-svg-def {
      position: absolute;
      top: 0;
      left: 0;
      width: 30px;
      height: 30px;
      fill: #b3b3b3;
      transform: translate(-50%, -50%);
    }
  }

  .m-tag {
    position: relative;
    margin: 30px 0 0 30px;
    width: calc((1 / 3 * 100%) ~" - 30px");
    height: 60px;
    line-height: 60px;
    border-radius: 3px;
    &.selected {
      background-color: rgba(89, 182, 215, 0.15);
      color: @primary;
    }
    span {
      overflow: hidden;
      width: 100%;
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-align: center;
    }
  }
}
</style>
