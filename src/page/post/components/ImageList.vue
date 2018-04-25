<template>
  <div>
    <div class="image-list">
      <div
        :key='img.src'
        v-for='(img, index) in pics'
        class="m-box-center m-box-center-a image-wrap m-trans"
        :class="[picClass, { error: img.error }, { loading: img.loading }, {edit}]"
        >
        <div class="image-placeholder"></div>
        <img
          :id="`compose-photo-${img.id}`"
          :src="img.src"
          class="compose-image"
          :class='{edit, loading: img.loading }'
          @load.stop='loadedImg(img)'
          @error='delPhoto(pics, index)'
          @click='thumbnails(index)'>
        <button class="m-rpic-edit m-box m-trans" v-if="edit && !img.loading"  @click="editImg(img, index)">
          <svg viewBox="0 0 1024 1024" class="m-style-svg m-flex-grow1 m-svg-def">
            <path d="M823.672974 299.313993L679.488107 155.13936l72.121598-72.086805c23.899316-23.86657 62.591547-23.86657 86.48677 0l57.665351 57.659211c23.901363 23.901363 23.901363 62.654992 0 86.549192L823.672974 299.313993 823.672974 299.313993zM404.795884 718.17164L260.615111 573.995983l391.976416-388.894218 144.18282 144.175657L404.795884 718.17164 404.795884 718.17164zM144.786059 836.410578l87.722924-234.313583L375.482255 745.103012 144.786059 836.410578 144.786059 836.410578zM792.286126 885.688911c20.181645 0 36.519752 16.33913 36.519752 36.520775 0 20.152992-16.33913 36.494169-36.519752 36.494169L146.485771 958.703855c-20.147876 0-36.494169-16.341177-36.494169-36.494169 0-20.182668 16.34527-36.520775 36.494169-36.520775L792.286126 885.688911 792.286126 885.688911zM792.286126 885.688911" fill="rgba(255,255,255,.9)"></path>
          </svg>
        </button>
        <button class="m-rpic-close m-trans m-box"
          @click.stop='delPhoto(pics, index)'>
          <svg viewBox="0 0 46 72" class="m-style-svg m-flex-grow1 m-svg-def">
            <path d="M27.243 36l14.88-14.88c1.17-1.17 1.17-3.07 0-4.24-1.172-1.173-3.072-1.173-4.243 0L23 31.757 8.122 16.878c-1.17-1.17-3.07-1.17-4.242 0-1.172 1.172-1.172 3.072 0 4.243L18.758 36 3.878 50.88c-1.17 1.17-1.17 3.07 0 4.24.587.587 1.355.88 2.123.88s1.536-.293 2.122-.88L23 40.243l14.88 14.88c.585.585 1.353.878 2.12.878.768 0 1.535-.293 2.12-.88 1.173-1.17 1.173-3.07 0-4.24L27.244 36z"></path>
          </svg>
        </button>
        <div class="fixed-loading" v-if="!img.error && img.loading">
          <div class="u-loading" style="height: 58px;width: 58px; background-color: transprent">
            <svg class="loading" width="100%" height="100%" viewBox="0 0 29 29">
              <circle class="c1" cx="14.5" cy="14.5" r="12.5" fill="none" stroke-width="4"
              stroke="#b1b1b1" />
              <circle class="c2" cx="14.5" cy="14.5" r="12.5" fill="none" stroke-width="4"
              stroke="#c7c7c7" />
            </svg>
          </div>
        </div>
      </div> 
      <label 
        v-if="showLabel"
        for="selectphoto" 
        class="m-box-center m-box-center-a image-wrap more-image"
        :class='picClass'>
        <div class="image-placeholder"></div>
        <svg viewBox="0 0 24 24" class='m-style-svg m-flex-grow1 m-svg-big'> 
          <path d="M21.8,20.8H2.1c-0.5,0-1.1-0.4-1.1-1V6.3c0-0.5,0.4-1.1,1.1-1.1h4.3L8,3.6c0.1-0.3,0.5-0.4,0.8-0.4H15 c0.3,0,0.5,0.1,0.7,0.3l1.9,1.8h4.3c0.5,0,1.1,0.4,1.1,1.1V20C22.9,20.4,22.5,20.8,21.8,20.8L21.8,20.8z M12,6.6 c-3.4,0-6.1,2.7-6.1,6.1s2.7,6.1,6.1,6.1s6.1-2.7,6.1-6.1S15.4,6.6,12,6.6L12,6.6z M12,16.8c-2.3,0-4.1-1.8-4.1-4.1S9.7,8.6,12,8.6 s4.1,1.8,4.1,4.1S14.3,16.8,12,16.8L12,16.8z"></path> 
        </svg>
      </label>
    </div>
    <input
      type="file" 
      ref="imagefile"
      class="m-rfile"
      id="selectphoto"
      :multiple="multiple" 
      :accept="acceptType" 
      @change="selectPhoto">
    <image-paid-option ref="imageOption"/>
  </div>
</template>
<script>
import bus from "@/bus.js";
import { mapActions } from "vuex";
import sendImage from "@/util/SendImage.js";
import ImagePaidOption from "./ImagePaidOption.vue";
/**
 * ReadAsArrayBuffer
 * 通过文件头判断文件格式
 * @author jsonleex <jsonlseex@163.com>
 * @param  {[type]} file
 * @return {[type]}
 */
function readAsArrayBuffer(file) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = event => {
      const uint8 = new Uint8Array(event.target.result).subarray(0, 4);
      let res = "";
      for (let i = 0; i < uint8.length; i++) {
        res += uint8[i].toString(16);
      }

      let mimeType = "";
      switch (res) {
        case "89504e47":
          mimeType = "png";
          break;
        case "47494638":
          mimeType = "gif";
          break;
        case "52494646":
          mimeType = "webp";
          break;
        default:
          res.indexOf("424d") === 0
            ? (mimeType = "bmp")
            : res.indexOf("ffd8ffe") === 0 && (mimeType = "jpeg");
      }
      file.mimeType = mimeType;
      resolve(mimeType);
    };
    reader.readAsArrayBuffer(file);
  });
}
/**
 * Check image types
 * @author jsonleex <jsonlseex@163.com>
 * @param  {[type]} files
 * @return {[type]}
 */
function checkImageType(files) {
  return new Promise((resolve, reject) => {
    const exts = ["png", "jpg", "jpeg", "gif", "bmp", "webp"];
    const blobs = [];
    for (let index = 0; index < files.length; index++) {
      const fileName = files[index].name.split(".");
      if (fileName.length > 1) {
        const ext = fileName.pop().toLowerCase();
        exts.indexOf(ext) < 0
          ? reject(new Error("不支持的文件格式"))
          : (files[index].mimeType = ext);
      } else {
        blobs.push(readAsArrayBuffer(files[index]));
      }
    }
    resolve(files);
  });
}
export default {
  name: "image-list",
  components: {
    ImagePaidOption
  },
  props: {
    edit: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 9
    },
    accept: {
      type: [Array, String],
      default() {
        return [
          "image/gif",
          "image/jpeg",
          "image/webp",
          "image/jpg",
          "image/png",
          "image/bmp"
        ];
      }
    }
  },
  data() {
    return {
      pics: []
    };
  },
  computed: {
    acceptType() {
      return typeof this.accept === "string"
        ? this.accept
        : this.accept.join(",");
    },
    showLabel() {
      return this.pics.length < this.limit;
    },
    multiple() {
      return this.limit > 1;
    },
    picClass() {
      // return `img${this.pics.length > 1 ? 3 : 1}`;
      return `img3`;
    }
  },
  watch: {
    pics() {
      this.updateComposePhoto(this.pics);
    },
    edit(val) {
      val ||
        this.pics.forEach((pic /*, index*/) => {
          delete pic.amount;
          delete pic.amountType;
          // this.$set(this.pics, index, pic);
        });
    }
  },
  methods: {
    ...mapActions(["updateComposePhoto"]),
    imgFormat() {
      return {
        id: "",
        src: "",
        type: "",
        width: 0,
        height: 0,
        file: null,
        error: false,
        loading: false
      };
    },
    selectPhoto() {
      this.addPhoto(this.$refs.imagefile);
    },
    addPhoto($input) {
      const files = $input.files;
      if (files && files.length > 0) {
        if (files.length + this.pics.length > this.limit) {
          this.$Message.error(`最多只能上传${this.limit}张图片`);
          $input.value = "";
          return false;
        }
        checkImageType(files)
          .then(() => {
            for (let i = 0; i < files.length; i++) {
              const imgObj = {
                file: files[i],
                type: files[i].mimeType,
                src: window.URL.createObjectURL(files[i]),
                loading: true
              };
              this.pics.push(Object.assign({}, this.imgFormat(), imgObj));
            }
            $input.value = "";
          })
          .catch(() => {
            this.$Message.info("请上传正确格式的图片文件");
            $input.value = "";
          });
      }
    },
    loadedImg(img) {
      // TODO
      // 前端图片压缩
      sendImage(img.file)
        .then(id => {
          Object.assign(img, {
            id,
            file: null,
            loading: !1,
            error: !1
          });
          this.updateComposePhoto(this.pics);
        })
        .catch(() => {
          img.error = !0;
        });
    },
    delPhoto(pics, index) {
      pics.splice(index, 1);
    },
    editImg(img, index) {
      this.$refs.imageOption.show(img, index);
    },
    // 图片预览
    thumbnails(index) {
      const images = this.pics.map((img, index) => {
        const el = this.$el.querySelectorAll(`img.compose-image`)[index];
        return {
          el,
          index,
          ...img,
          w: el.naturalWidth,
          h: el.naturalHeight
        };
      });
      bus.$emit("mvGallery", {
        fid: -1,
        index,
        images
      });
    }
  },
  destroyed() {
    this.updateComposePhoto(null);
  }
};
</script>

<style lang='less'>
.image-list {
  display: flex;
  flex-wrap: wrap;
  user-select: none;
}
.image-wrap {
  transition: all 0.4s ease;
  overflow: hidden;
  position: relative;
  margin: 0.5%;
  box-sizing: border-box;
  border: 1px solid @border-color; /*no*/
  &.img1 {
    flex-basis: 99%;
  }
  &.img3 {
    flex-basis: 32%;
  }
  &.loading:before {
    content: "";
    display: ;
  }
  &.error {
    &:after {
      content: "上传失败";
    }
  }
  &.edit:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 2;
    background-color: rgba(0, 0, 0, 0.4);
    pointer-events: none;
  }
}
.image-placeholder {
  padding-top: 100%;
}
.compose-image {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  object-fit: cover;
  transition: all 0.4s ease;

  &.loading {
    opacity: 0.3;
  }
}
.m-rpic-edit {
  z-index: 9;
  position: relative;
  background: transparent;
  transition: all 0.4s ease;

  .m-svg-def {
    width: 60px;
    height: 60px;
  }
}
.m-rpic-close {
  overflow: hidden;
  position: absolute;
  top: 0;
  right: 0;
  background-color: #000;
  opacity: 0.4;
  padding: 0;
  border: 0;
  outline: none;
  color: #fff;
  z-index: 3;
  .m-style-svg {
    width: 42px;
    height: 42px;
  }
}
.more-image {
  border: 1px dashed @gray; /*no*/
  color: @gray;
}
</style>
