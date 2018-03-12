<template>
  <div>
    <div class="image-list">
      <div
        :key='img.src'
        v-for='(img, index) in pics'
        class="m-box-center m-box-center-a image-wrap m-trans"
        :class="[picClass, { error: img.error }]"
        >
        <div class="image-placeholder"></div>
        <img 
          :src="img.src"
          class="compose-image"
          :class='{ loading: img.loading }'
          @load.stop='loadedImg(img)'
          @error='delPhoto(pics, index)'
          @click='thumbnails'>
        <button class="m-rpic-close m-trans m-box"
          @click.stop='delPhoto(pics, index)'>
          <svg viewBox="0 0 46 72" class="m-style-svg m-flex-grow1 m-svg-def">
            <path d="M27.243 36l14.88-14.88c1.17-1.17 1.17-3.07 0-4.24-1.172-1.173-3.072-1.173-4.243 0L23 31.757 8.122 16.878c-1.17-1.17-3.07-1.17-4.242 0-1.172 1.172-1.172 3.072 0 4.243L18.758 36 3.878 50.88c-1.17 1.17-1.17 3.07 0 4.24.587.587 1.355.88 2.123.88s1.536-.293 2.122-.88L23 40.243l14.88 14.88c.585.585 1.353.878 2.12.878.768 0 1.535-.293 2.12-.88 1.173-1.17 1.173-3.07 0-4.24L27.244 36z"></path>
          </svg>
        </button>
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
  </div>
</template>
<script>
import { mapActions } from "vuex";
import sendImage from "@/util/SendImage.js";

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
  props: {
    limt: {
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
      return this.pics.length < this.limt;
    },
    multiple() {
      return this.limt > 1;
    },
    picClass() {
      // return `img${this.pics.length > 1 ? 3 : 1}`;
      return `img3`;
    }
  },
  watch: {
    pics() {
      this.updateComposePhoto(this.pics);
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
          this.$Message.error(`最多只能上传${this.limt}张图片`);
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

              console.log(Object.assign({}, this.imgFormat(), imgObj));
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
      // todo
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
    thumbnails() {
      console.log("预览");
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
  overflow: hidden;
  position: relative;
  margin: 0.5%;
  box-sizing: border-box;
  &.img1 {
    flex-basis: 99%;
  }
  &.img3 {
    flex-basis: 32%;
  }
  &.error {
    &:after {
      content: "上传失败";
    }
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
  object-fit: cover;
  &.loading {
    opacity: 0.3;
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
