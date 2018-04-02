<template>
  <div @touchmove.prevent>
    <transition name='toast'>
      <div v-if='show' class="m-pop-box" style="background-color: rgba(255, 255, 255, .95)" @click='cancel'></div>
    </transition>
    <transition @after-enter="transitionComplete">
      <div class="m-box-model m-post-menu-con" v-if="show">
        <transition-group
        tag="div"
        enter-active-class="animated bounceIn"
        class="m-box m-aln-center m-post-menu-list">
          <!-- @click="to('/post/feed?type=1')" -->
          <div 
          v-if="open"
          key="ico_word"
          @click="to('/post/text')"
          class="m-box-model m-aln-center m-post-menu-item">
            <img src="../images/ico_word@3x.png">
            <span>文字</span>
          </div>
          <!-- @click="to('/post/feed?type=2')" -->
          <div 
          v-if="open"
          key="ico_potoablum"
          @click="to('/post/pic')"
          class="m-box-model m-aln-center m-post-menu-item">
            <img src="../images/ico_potoablum@3x.png">
            <span>图片</span>
          </div>
          <div
          v-if="open"
          key="ico_contribute"
          @click="to('/post/release')"
          class="m-box-model m-aln-center m-post-menu-item">
            <img src="../images/ico_contribute@3x.png">
            <span>投稿</span>
          </div>
          <div 
          v-if="open && checkin"
          key="ico_attendance"
          @click="showCheckIn"
          class="m-box-model m-aln-center m-post-menu-item">
            <img src="../images/ico_attendance@3x.png">
            <span>签到</span>
          </div>
          <div v-if="open" key="ico_question" class="m-box-model m-aln-center m-post-menu-item">
            <img src="../images/ico_question@3x.png">
            <span>提问</span>
          </div>
<!--           <div 
          v-if="open"
          key="ico_fatie"
          @click="to('/post/fatie')"
          class="m-box-model m-aln-center m-post-menu-item">
            <img src="../images/ico_fatie@3x.png">
            <span>发帖</span>
          </div> -->
        </transition-group>
        <transition name="pop">        
          <button
          @click="cancel"
          class="m-post-menu-btn"
          :class="{open}">
            <span></span>
            <span></span>
          </button>
        </transition>
      </div>
    </transition>
  </div>
</template>
<script>
import bus from "@/bus.js";
export default {
  name: "post-menu",
  data() {
    return {
      show: false,
      open: false,
      scrollTop: 0
    };
  },
  created() {
    bus.$on("post-menu", () => {
      this.show = true;
      this.scrollTop = document.scrollingElement.scrollTop;
      document.body.classList.add("m-pop-open");
      document.body.style.top = -this.scrollTop + "px";
    });
  },
  computed: {
    login() {
      return !!this.$store.state.CURRENTUSER.id;
    },
    /**
     * 检查后台是否开启签到功能
     * @author jsonleex <jsonlseex@163.com>
     * @return {Boolean}
     */
    checkin() {
      return this.$store.state.CONFIG.checkin || true;
    }
  },
  methods: {
    to(path) {
      path = this.login ? path : `/signin?redirect=${path}`;
      !this.login && this.$Message.error("请登录");
      this.$router.push(path);
      this.$nextTick(this.cancel);
    },
    showCheckIn() {
      this.login
        ? bus.$emit("check-in")
        : (this.$Message.error("请登录"), this.$router.push(`/signin`));
      this.$nextTick(this.cancel);
    },
    cancel() {
      this.show = false;
      this.open = false;
      document.body.style.top = "";
      document.body.classList.remove("m-pop-open");
      document.scrollingElement.scrollTop = this.scrollTop;
    },
    transitionComplete() {
      this.$nextTick(() => {
        this.open = true;
      });
    }
  }
};
</script>

<style lang="less">
.m-post-menu-con {
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 102;
}
.m-post-menu-list {
  padding: 6%;
  flex-wrap: wrap;
  justify-content: space-between;
}
.m-post-menu-item {
  margin: 3% 6%;
  width: 1/3 * 100 - 12%;
  font-size: 28px;
  img {
    width: 100%;
  }
  span {
    color: #575757;
    margin-top: 25px;
  }
}
.m-post-menu-btn {
  position: relative;
  height: 100px;
  width: 100%;
  background-color: #fff;
  box-shadow: 0 -1px 3px rgba(26, 26, 26, 0.1);
  span {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    display: block;
    width: 60px;
    height: 2.5px; /*no*/
    border-radius: 100%;
    background-color: @primary;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.22, 1);
  }
  &.open {
    span {
      &:nth-of-type(1) {
        transform: rotate(45deg);
      }
      &:nth-of-type(2) {
        transform: rotate(-45deg);
      }
    }
  }
}

.fadeIn-enter-active,
.fadeIn-leave-active {
  transition: all 1s ease;
}
.fadeIn-enter-active,
.fadeIn-leave {
  opacity: 1;
}
.fadeIn-enter,
.fadeIn-leave-active {
  opacity: 0;
}
</style>
