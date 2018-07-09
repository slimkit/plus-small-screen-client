// vuex utils
import { mapActions, mapState } from "vuex";

// components
import PSWP from "./components/pswp";
import PostMenu from "./page/PostMenu";
import Payable from "./components/payfor";
import ActionSheet from "./components/actionsheet";
import CommentInput from "./components/commentInput";
import SvgIcon from "./components/common/svgIcon";
import CheckIn from "./page/checkin/CheckIn";
import Reward from "./components/reward";
import ChooseTags from "./page/chooseTags";
import ChooseGroupCate from "./page/chooseGroupCate";
import InfoTips from "./components/infoTips";
import ApplyTop from "./components/applyForTop";

export default {
  render() {
    return (
      <div id="app" class="wap-wrap">
        {this.keepAlive ? (
          <keep-alive>
            <router-view />
          </keep-alive>
        ) : (
          <router-view />
        )}
        <div>
          <SvgIcon />
          <PSWP />
          <PostMenu />
          <Payable />
          <ActionSheet />
          <CommentInput />
          <CheckIn />
          <Reward />
          <ChooseTags />
          <ChooseGroupCate />
          <InfoTips />
          <ApplyTop />
        </div>
      </div>
    );
  },
  name: "App",
  /**
   * The App data.
   *
   * @return {Object}
   */
  data: () => ({
    title: "Plus (ThinkSNS+)"
  }),
  computed: {
    keepAlive() {
      return this.$route.meta.keepAlive || false;
    },
    ...mapState({
      /**
       * Global user id.
       *
       * @param  {Object} state
       *
       * @return {number}
       */
      UID: state => state.CURRENTUSER.id,
      /**
       * Easemob status.
       *
       * @param  {Object} state
       *
       */
      status: state => state.EASEMOB.status
    })
  },
  watch: {
    /**
     * `$route` watcher.
     *
     * @param  {Object} newRoute
     *
     * @return {void}
     */
    $route(newRoute) {
      let { title } = newRoute.meta || {};

      if (title) {
        this.title = title;
      }
    },
    /**
     * Set document title.
     *
     * @param  {string} newTitle
     *
     * @return {void}
     */
    title(newTitle) {
      if (newTitle) {
        document.title = newTitle;
      }
    }
  },
  methods: mapActions({
    bootstrapHandle: "BOOTSTRAPPERS"
  }),
  /**
   * The created hook.
   * @return {void}
   */
  created() {
    this.bootstrapHandle();
  }
};
