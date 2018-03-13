<template>
  <div>
    <transition name='toast'>
      <div v-if='show' class="m-pop-box" @click='cancel'></div>
    </transition>
    <transition name='pop'>
      <div v-if='show' class="m-acbtn-box">
        <ul class="m-acbtn-list">
          <li v-for='(btn, index) in lists'
            v-if='btn.text'
            :key='btn.text'
            @click='btn.methods(btn, index)'
            ><a href="javascript:;">{{ btn.text }}</a></li>
        </ul>
        <ul class="m-acbtn-list">
          <li @click='cancel'><a href="javascript:;">{{ cancelBtn }}</a></li>
        </ul>
      </div>
    </transition>
  </div>
</template>
<script>
import bus from "@/bus.js";
export default {
  name: "actionsheet",
  data() {
    return {
      lists: [],
      show: false,
      scrollTop: 0,
      cancelBtn: "取消"
    };
  },
  created: function() {
    /**
     * Call actionSheet
     * @author jsonleex <jsonlseex@163.com>
     * @param  {Array}   btnLists   [{ text: "确定", method: () =>{ console.log("确定") } }, ...]
     * @param  {String}  cancelTxt  "取消"
     */
    bus.$on("actionSheet", (btnLists, cancelTxt) => {
      this.call(btnLists, cancelTxt);
    });
  },
  watch: {
    show(val) {
      if (val) {
        this.scrollTop = document.scrollingElement.scrollTop;
        document.body.classList.add("m-pop-open");
        document.body.style.top = -this.scrollTop + "px";
      } else {
        document.body.style.top = "";
        document.body.classList.remove("m-pop-open");
        document.scrollingElement.scrollTop = this.scrollTop;
      }
    }
  },
  methods: {
    call(btnLists, cancelTxt) {
      this.cancelBtn = cancelTxt || this.cancelBtn;
      if (btnLists.length > 0) {
        this.lists = btnLists.map(btn => {
          btn.method &&
            (btn.methods = (btn, index) => {
              btn.method(btn, index);
              this.show = false;
            });
          return btn;
        });
      }
      this.show = true;
    },
    cancel() {
      this.show = false;
    }
  }
};
</script>
