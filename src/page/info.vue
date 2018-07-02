<template>
  <div class="m-box-model p-info">
    <header class="m-box m-aln-center m-head-top m-pos-f m-main m-bb1">
      <div class="m-box m-aln-center m-flex-grow1 m-flex-shrink1 m-flex-base0">
        <svg 
          class="m-style-svg m-svg-def" 
          @click="goBack">
          <use 
            xmlns:xlink="http://www.w3.org/1999/xlink" 
            xlink:href="#base-back"/>
        </svg>
      </div>
      <div class="m-box m-aln-center m-flex-grow1 m-flex-shrink1 m-flex-base0 m-justify-center m-head-top-title">
        <span>个人资料</span>
      </div>
      <div class="m-box m-aln-center m-justify-end m-flex-grow1 m-flex-shrink1 m-flex-base0">
        <svg 
          v-if="loading" 
          class="m-style-svg m-svg-def">
          <use 
            xmlns:xlink="http://www.w3.org/1999/xlink" 
            xlink:href="#base-loading"/>
        </svg>
        <a
          v-else
          :class="{ disabled }"
          class="m-send-btn"
          @click.prevent="handleOk">完成</a>
      </div>
    </header>
    <main style="padding-top: 0.9rem; background-color: #fff">
      <section 
        style="margin-left: 0; padding-left: .3rem" 
        class="m-box m-aln-center m-justify-bet m-main m-bb1 p-info-row" 
        @click="beforeSelectFile">
        <div
          :class="avatarStyles"
          class="m-flex-shrink0 m-flex-grow0 m-avatar-box">
          <img 
            :src="avatar" 
            class="m-avatar-img">
        </div>
        <span class="m-flex-grow1 m-flex-shrink1">更换头像</span>
        <svg class="m-style-svg m-svg-def m-entry-append">
          <use 
            xmlns:xlink="http://www.w3.org/1999/xlink" 
            xlink:href="#base-arrow-r"/>
        </svg>
        <input
          ref="imagefile"
          type="file"
          class="m-rfile"
          accept="image/jpeg,image/webp,image/jpg,image/png,image/bmp"
          @change="selectPhoto">

      </section>
      <section class="m-box m-aln-stre m-justify-bet p-info-row m-bb1">
        <label for="name">用户名</label>
        <div class="m-box m-aln-center m-justify-bet m-flex-grow1 m-flex-shrink1 input">
          <input
            id="name"
            v-model="name"
            type="text"
            placeholder="请输入用户名"
            class="m-flex-grow1 m-flex-shrink1"
            @focus="showCleanName = true"
            @blur="showCleanName = false">
          <svg 
            v-show="showCleanName && name.length > 0" 
            class="m-style-svg m-svg-def m-entry-append" 
            @click="name=''">
            <use 
              xmlns:xlink="http://www.w3.org/1999/xlink" 
              xlink:href="#base-clean"/>
          </svg>
        </div>
      </section>
      <section class="m-box m-aln-stre m-justify-bet p-info-row m-bb1">
        <label>性别</label>
        <div 
          class="m-box m-aln-center m-justify-bet m-flex-grow1 m-flex-shrink1 input" 
          @click="switchSex">
          <span :class="{ placeholder: !(sex >= 0) }">{{ sexTxt }}</span>
          <svg class="m-style-svg m-svg-def m-entry-append">
            <use 
              xmlns:xlink="http://www.w3.org/1999/xlink" 
              xlink:href="#base-arrow-r"/>
          </svg>
        </div>
      </section>
      <section class="m-box m-aln-stre m-justify-bet p-info-row m-bb1">
        <label>城市</label>
        <div 
          class="m-box m-aln-center m-justify-bet m-flex-grow1 m-flex-shrink1 input" 
          @click="switchPosition">
          <span :class="{placeholder: !location}">{{ location || "选择居住地" }}</span>
          <svg class="m-style-svg m-svg-def m-entry-append">
            <use 
              xmlns:xlink="http://www.w3.org/1999/xlink" 
              xlink:href="#base-arrow-r"/>
          </svg>
        </div>
      </section>
      <section 
        class="m-box m-aln-stre m-justify-bet p-info-row m-bb1" 
        @click="switchTags">
        <label>标签</label>
        <div class="m-box m-aln-center m-justify-bet m-flex-grow1 m-flex-shrink1 input">
          <span 
            v-if="tags.length === 0" 
            class="placeholder">选择标签</span>
          <div 
            v-else 
            class="m-tag-list m-tags">
            <span 
              v-for="tag in tags" 
              :key="tag.id" 
              class="m-tag">{{ tag.name }}</span>
          </div>
          <svg class="m-style-svg m-svg-def m-entry-append">
            <use 
              xmlns:xlink="http://www.w3.org/1999/xlink" 
              xlink:href="#base-arrow-r"/>
          </svg>
        </div>
      </section>
      <section class="m-box m-aln-stre m-justify-bet p-info-row">
        <label 
          for="bio" 
          class="m-flex-grow0 m-flex-shrink0">简介</label>
        <div class="m-box m-aln-center m-justify-bet m-flex-grow1 m-flex-shrink1 input">
          <span
            v-if="bio.length === 0 && !bioIsFoucs"
            class="placeholder m-flex-grow1"
            @click="editBio">编辑简介</span>
          <div
            v-show="bio.length > 0 || bioIsFoucs"
            class="m-box-model m-fd-row m-flex-grow1 m-flex-shrink1 m-aln-end m-justify-end m-wz-def">
            <div
              ref="bioEditor"
              contenteditable="true"
              class="m-flex-grow1 m-shrink-1 m-flex-base0 m-textarea"
              @input="bioInput"
              @foucs="bioFoucs"
              @blur="bioBlur"/>
            <i style="font-size: 10px; margin-right: 0.2rem">
              <b :style="{color: bio.length > 50 ? `#f4504d`: `inherit`}">{{ bio.length }}</b>/50
            </i>
          </div>
        </div>
      </section>
    </main>
    <location 
      :show="showPosition" 
      :is-component="true" 
      @close="switchPosition" />
  </div>
</template>
<script>
import bus from "@/bus.js";
import { mapState } from "vuex";
import location from "@/page/location.vue";

// import { getFileUrl } from "@/util/";
import getFirstFrameOfGif from "@/util/getFirstFrameOfGif.js";

/**
 * Canvas toBlob
 */
if (!HTMLCanvasElement.prototype.toBlob) {
  Object.defineProperty(HTMLCanvasElement.prototype, "toBlob", {
    value: function(callback, type, quality) {
      var binStr = atob(this.toDataURL(type, quality).split(",")[1]),
        len = binStr.length,
        arr = new Uint8Array(len);

      for (var i = 0; i < len; i++) {
        arr[i] = binStr.charCodeAt(i);
      }

      callback(new Blob([arr], { type: type || "image/png" }));
    }
  });
}

export default {
  name: "Info",
  components: {
    location
  },
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
      change: false,
      bioIsFoucs: false,

      showPosition: false
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
    // bioShadow() {
    //   return "blank" + this.bio;
    // },
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
    bioIsFoucs(val) {
      val && this.$refs.bioEditor.click() && this.$refs.bioEditor.focus();
    }
  },
  mounted() {
    this.$refs.bioEditor.textContent = this.bio;
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
    this.bio = bio || "";
    this.tags = tags || [];
    this.avatar = avatar;
    this.location = location;
    this.$http
      .get(`users/${this.CURRENTUSER.id}/tags`)
      .then(({ data = [] }) => {
        this.tags = data;
        this.CURRENTUSER.tags = data;
        this.$store.commit("SAVE_CURRENTUSER", this.CURRENTUSER);
      });
  },
  methods: {
    editBio() {
      this.bioIsFoucs = true;
    },
    bioFoucs() {},
    bioBlur() {
      this.$refs.bioEditor.textContent = this.bio;
      this.bioIsFoucs = false;
    },
    bioInput(e) {
      const $el = e.target;
      const value = $el.textContent;
      this.bio = value;
    },
    beforeSelectFile() {
      this.$refs.imagefile.click();
    },
    async selectPhoto(e) {
      let files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      const cropperURL = await getFirstFrameOfGif(files[0]);
      this.$ImgCropper.show({
        url: cropperURL,
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
          }, "image/png");
        }
      });
    },
    handleOk() {
      if (this.disabled) return;
      if (this.loading) return;
      this.change = false;
      this.loading = true;
      // PATCH /user
      if (this.bio.length === 0) {
        this.$Message.error("简介不能为空");
        this.loading = false;
        return false;
      }
      if (this.bio.length > 50) {
        this.$Message.error("简介不能超过50字");
        this.loading = false;
        return false;
      }
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
          this.goBack();
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          return err;
        });
    },
    switchTags() {
      const chooseTags = this.tags.map(t => t.id);
      const nextStep = tags => {
        this.change =
          tags.map(n => n.id).join(",") !== this.CURRENTUSER.tags.join(",");
        this.tags = tags;
      };
      const onSelect = tagId => {
        this.$http.put(`/user/tags/${tagId}`);
      };
      const onRemove = tagId => {
        this.$http.delete(`/user/tags/${tagId}`);
      };
      bus.$emit("choose-tags", { chooseTags, nextStep, onSelect, onRemove });
    },
    switchPosition(val) {
      this.showPosition = !this.showPosition;
      val && (this.location = val.label);
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
  padding: 35px 0 35px 0;
  margin-left: 140px;
  min-height: 100px;
}
.p-info-row .input {
  font-size: 30px;
  line-height: 1;
}
.p-info-row label {
  display: flex;
  align-items: center;
  margin-left: -110px;
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
