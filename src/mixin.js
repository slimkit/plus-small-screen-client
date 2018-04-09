import _ from "lodash";
export default {
  data() {
    return {
      scrollable: true,
      windowScrollTop: 0
    };
  },
  watch: {
    scrollable(val) {
      const el = document.scrollingElement;
      console.log(el);
      if (val) {
        document.body.style.top = "";
        document.body.classList.remove("m-pop-open");
        el && (el.scrollTop = this.windowScrollTop);
      } else {
        document.body.classList.add("m-pop-open");
        this.windowScrollTop = el ? el.scrollTop : 0;
        document.body.style.top = -this.windowScrollTop + "px";
      }
    }
  },
  methods: {
    uniqById(target = [], source = []) {
      return _.unionBy([...target, ...source], "id");
    },
    goBack(num = -1) {
      window.history.length <= 1
        ? this.$router.push("/")
        : this.$router.back(num);
    }
  }
};
