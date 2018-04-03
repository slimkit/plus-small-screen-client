<template>
  <div class="m-box-model p-info">
    <header class="m-box m-aln-center m-head-top m-pos-f m-main m-bb1">
      <div class="m-flex-grow1 m-flex-shrink1">
        <svg class="m-style-svg m-svg-def" @click="goBack">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-back"></use>
        </svg>
      </div>
      <div class="m-flex-grow1 m-flex-shrink1 m-text-c m-head-top-title">
        <span>个人资料</span>
      </div>
      <div class="m-flex-grow1 m-flex-shrink1 m-text-r">
        <svg v-if="loading" class="m-style-svg m-svg-def rotate">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-loading"></use>
        </svg>
        <a 
          v-else
          class="m-send-btn"
          :class="{ disabled }"
          @click.prevent="handleOk">完成</a>
      </div>
    </header>
    <main style="padding-top: 0.9rem">
      <section class="m-box m-aln-center m-justify-bet m-main m-bb1 p-info-row" @click="beforeSelectFile">
        <div
        class="m-flex-shrink0 m-flex-grow0 m-avatar-box"
        :class="avatarStyles">
          <img :src="avatar" class="m-avatar-img">
        </div>
        <span class="m-flex-grow1 m-flex-shrink1">更换头像</span>
        <svg class="m-style-svg m-svg-def m-entry-append">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
        </svg>
        <input
          type="file" 
          ref="imagefile"
          class="m-rfile"
          accept="image/jpeg,image/webp,image/jpg,image/png,image/bmp"
          @change="selectPhoto">

      </section>
      <section class="m-box m-aln-center m-justify-bet m-main p-info-row">
        <label for="name">用户名</label>
        <div class="m-box m-aln-center m-justify-bet m-flex-grow1 m-flex-shrink1 m-bb1 input">
          <input 
            id="name"
            type="text"
            v-model="name"
            placeholder="请输入用户名"
            @focus="showCleanName = true"
            @blur="showCleanName = false"
            class="m-flex-grow1 m-flex-shrink1">
          <svg v-show="showCleanName && name.length > 0" @click="name=''" class="m-style-svg m-svg-def m-entry-append">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-clean"></use>
          </svg>
        </div>
      </section>
      <section class="m-box m-aln-center m-justify-bet m-main p-info-row">
        <label>性别</label>
        <div class="m-box m-aln-center m-justify-bet m-flex-grow1 m-flex-shrink1 m-bb1 input" @click="switchSex">
          <span :class="{ placeholder: !(sex >= 0) }">{{ sexTxt }}</span>
          <svg class="m-style-svg m-svg-def m-entry-append">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
          </svg>
        </div>
      </section>
      <section class="m-box m-aln-center m-justify-bet m-main p-info-row">
        <label>城市</label>
        <div class="m-box m-aln-center m-justify-bet m-flex-grow1 m-flex-shrink1 m-bb1 input">
          <span :class="{placeholder: !location}">{{ location }}</span>
          <svg class="m-style-svg m-svg-def m-entry-append">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
          </svg>
        </div>
      </section>
      <section class="m-box m-aln-st m-justify-bet m-main p-info-row" @click="switchTags">
        <label>标签</label>
        <div class="m-box m-aln-center m-justify-bet m-flex-grow1 m-flex-shrink1 m-bb1 input">
          <div class="m-tag-list m-tags">
            <span v-if="tags.length === 0" class="placeholder">选择标签</span>
            <span class="m-tag" :key="tag.id" v-for="tag in tags">{{ tag.name }}</span>
          </div>
          <svg class="m-style-svg m-svg-def m-entry-append">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-arrow-r"></use>
          </svg>
        </div>
      </section>
      <section class="m-box m-aln-st m-justify-bet m-main p-info-row">
        <label for="bio">简介</label>
        <div class="m-box m-aln-center m-justify-bet m-flex-grow1 m-flex-shrink1 input">
          <div class="m-box-model m-fd-row m-flex-grow1 m-flex-shrink1 m-aln-end m-justify-end m-wz-def">
            <textarea
            id="bio"
            placeholder="编辑简介"
            v-model="bio"
            maxlength="50"
            :style="{ height: `${scrollHeight}px` }"
            ></textarea>
            <textarea
            row="1"
            ref="bioShadow"
            style="position: absolute; z-index: -9999; visibility: hidden;"
            v-model="bioShadow"></textarea>
            <i 
            v-show="bio.length>25"
            style="font-size: 10px; margin-right: 0.2rem"
            ><b style="color: #f4504d">{{ bio.length }}</b>/50</i>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>
<script>
import bus from "@/bus.js";
import { mapState } from "vuex";
import { getFileUrl } from "@/util/";

export default {
  name: "info",
  data() {
    return {
      loading: false,
      scrollHeight: 0,
      showCleanName: false,

      sex: 0,
      bio: "",
      name: "",
      tags: [],
      location: "",
      avatar: null,
      change: false
    };
  },
  computed: {
    ...mapState(["CURRENTUSER"]),
    disabled() {
      return !["sex", "bio", "location", "name", this.change].some(
        key =>
          typeof key === "string"
            ? this.$data[key] !== this.CURRENTUSER[key]
            : key
      );
    },
    bioShadow() {
      return "blank" + this.bio;
    },
    avatarStyles() {
      const sex = ["secret", "man", "woman"];
      return ["m-avatar-box-def", `m-avatar-box-${sex[this.sex]}`];
    },
    sexTxt() {
      const sex = ["保密", "男", "女"];
      return sex[this.sex] || "选择性别";
    }
  },
  watch: {
    bio(val, oval) {
      if (val !== oval) {
        this.$nextTick(() => {
          this.scrollHeight = this.$refs.bioShadow.scrollHeight;
        });
      }
    }
  },
  methods: {
    beforeSelectFile() {
      this.$refs.imagefile.click();
    },
    selectPhoto(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.$ImgCropper.show({
        url: getFileUrl(files[0]),
        round: false,
        onCancel: () => {
          this.$refs.imagefile.value = null;
        },
        onOk: screenCanvas => {
          screenCanvas.toBlob(blob => {
            const formData = new FormData();
            formData.append("avatar", blob);
            this.$http
              .post("/user/avatar", formData, {
                validateStatus: s => s === 204
              })
              .then(() => {
                this.$Message.success("头像更新成功");
                this.avatar = screenCanvas.toDataURL();
              })
              .catch((err = {}) => {
                console.log(err);
                const {
                  response: { data = { message: "更新头像失败" } }
                } = err;
                this.$Message.error(data);
              });
            this.$refs.imagefile.value = null;
          });
        }
      });
    },
    handleOk() {
      if (this.disabled) return;
      if (this.loading) return;
      this.change = false;
      this.loading = true;
      // PATCH /user
      const param = {
        name: this.name,
        bio: this.bio,
        sex: this.sex,
        location: this.location
      };
      this.$http
        .patch("/user", param, {
          validateStatus: s => s === 204
        })
        .then(() => {
          this.$store.commit(
            "SAVE_CURRENTUSER",
            Object.assign(this.CURRENTUSER, param)
          );
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          return err;
        });
    },
    switchTags() {
      const chooseTags = this.tags.map(t => t.id);
      /**
       * 打开选择标签页面 (钩子 -> "choose-tags")
       * @author jsonleex <jsonlseex@163.com>
       * @param  {Object} { nextStep, chooseTags }
       *
       *                   nextStep     {Function}     点击下一步的回调, 注入已选择的 tags
       *
       *                   chooseTags   {Object}       初始选择值, 只需传 [tag.id], eg: [1, 2, 3,...]
       */
      bus.$emit("choose-tags", {
        nextStep: tags => {
          this.change =
            tags.map(n => n.id).join(",") !== this.CURRENTUSER.tags.join(",");
          this.tags = tags;
        },
        chooseTags
      });
    },
    switchSex() {
      const options = [
        {
          text: "男",
          method: () => {
            this.sex = 1;
          }
        },
        {
          text: "女",
          method: () => {
            this.sex = 2;
          }
        },
        {
          text: "保密",
          method: () => {
            this.sex = 0;
          }
        }
      ];
      bus.$emit("actionSheet", options, "取消");
    }
  },
  created() {
    const {
      sex = 0,
      bio = "",
      location = "",
      avatar = "",
      tags = [],
      name = ""
    } = this.CURRENTUSER;
    this.name = name;
    this.sex = sex;
    this.bio = bio;
    this.tags = tags;
    this.avatar = avatar;
    this.location = location;
  },
  mounted() {
    this.$http
      .get(`users/${this.CURRENTUSER.id}/tags`)
      .then(({ data = [] }) => {
        this.CURRENTUSER.tags = data;
        this.tags = data;
      });
    this.$nextTick(() => {
      this.scrollHeight = this.$refs.bioShadow.offsetHeight;
    });
  }
};
</script>

<style lang="less">
.p-info input[type="text"] {
  height: 100%;
  font-size: 28px;
  line-height: normal;
  vertical-align: middle;
}
.p-info textarea {
  font-size: inherit;
  font-family: inherit;
  line-height: inherit;
  background-color: transparent;
  outline: 0;
  border: 0;
  resize: none;
  padding: 0;
  margin: 0;
  width: 100%;
  box-sizing: border-box;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
}
.p-info-row {
  position: relative;
  padding: 35px 0 35px 30px;
}
.p-info-row .input {
  margin-bottom: -35px;
  margin-top: -35px;
  padding-top: 35px;
  padding-bottom: 35px;
  font-size: 28px;
  line-height: 1;
}
.p-info-row label {
  flex: 0 0 auto;
  width: 110px;
  font-size: 30px;
  line-height: inherit;
  color: @text-color3;
}
.p-info-row .m-wz-def {
  font-size: 30px;
  line-height: inherit;
}
.p-info-row .placeholder {
  color: #ccc;
}
.p-info .m-avatar-box {
  margin-right: 35px;
}
.p-info .m-send-btn {
  color: @text-color1;
}
.p-info .m-entry-append {
  margin-right: 20px;
}
</style>
