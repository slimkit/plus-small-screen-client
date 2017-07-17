<template>
  <mt-popup
    v-model="showPopup.show"
    position="bottom"
    style="width: 100%;"
    :class="$style.showPopUp"
  >
    <div>
      <Button 
        @click="handleCollection(true, showPopup.feed_id)" 
        size="large" 
        :class="$style.sexOptions" 
        type="text" 
        :long="true"
        v-if="!showPopup.isCollection"
      >
        收藏
      </Button>
      <Button
        @click="handleCollection(false, showPopup.feed_id)" 
        size="large" 
        :class="$style.sexOptions" 
        type="text" 
        :long="true"
        v-else
      >
        取消收藏
      </Button>
      <Button 
        @click="handleDelete(showPopup.feed_id)" 
        size="large" 
        :class="$style.sexOptions" 
        type="text" 
        :long="true"
        v-if="showPopup.me"
      >
        删除动态
      </Button>
      <Button 
        @click="handleClosePopup(false)" 
        size="large" 
        :class="$style.sexOptions" 
        type="text" 
        :long="true"
      >
        取消
      </Button>
    </div>
  </mt-popup>
</template>

<script>
  import { 
    SHOWPOPUP, 
    CLOSEPOPUP, 
    FEEDSLIST, 
    DELETEFEED, 
    NEWFEEDS, 
    NEWIDS, 
    FOLLOWINGFEEDS, 
    FOLLOWINGIDS, 
    HOTFEEDS, 
    HOTIDS,
    GETUSERFEEDS,
    COLLECTIONFEEDS,
    COLLECTIONFEEDSIDS,
    USERFEEDS
  } from '../stores/types';
  import { createAPI, addAccessToken } from '../utils/request';

  const showFeedPopup = {
    computed: {
      showPopup () {
        return this.$store.getters[SHOWPOPUP];
      },
      feed () {
        let feed = this.$store.getters[FEEDSLIST][this.showPopup.feed_id];
        return feed;
      }
    },
    methods: {
      /**
       * 收起popup
       * @return {[type]} [description]
       */
      handleClosePopup() {
        this.$store.dispatch(CLOSEPOPUP);
      },
      /**
       * 删除动态
       * @param  {[type]} feed_id [description]
       * @return {[type]}         [description]
       */
      handleDelete ( feed_id ) {
        addAccessToken().delete(createAPI(`feeds/${feed_id}`), {}, {
          validateStatus: status => status === 204
        })
        .then( () => {
          let collectionLists = this.$store.getters[COLLECTIONFEEDS];
          let collectionIndex = collectionLists.findIndex( item => { return item.id === feed_id; });
          let collectionIds = this.$store.getters[COLLECTIONFEEDSIDS];
          let collectionIdsIndx = collectionIds.findIndex( item => { return item === feed_id; });
          if(collectionIdsIndx !== -1) {
            this.$store.getters[COLLECTIONFEEDSIDS].splice(collectionIdsIndx, 1);
          }
          if(collectionIndex !== -1) {
            this.$store.getters[COLLECTIONFEEDS].splice(collectionIndex, 1);
          }

          let userLists = this.$store.getters[USERFEEDS];
          let userIndex = userLists.findIndex( item => { return item.id === feed_id; });
          if(collectionIndex !== -1) {
            this.$store.getters[USERFEEDS].splice(userIndex, 1);
          }

          let newLists = this.$store.getters[NEWFEEDS];
          let newIndex = newLists.findIndex( item => { return item.id === feed_id; });
          let newIds = this.$store.getters[NEWIDS];
          let newIdsIndx = newIds.findIndex( item => { return item === feed_id; });
          if(newIdsIndx !== -1) {
            this.$store.getters[NEWIDS].splice(newIdsIndx, 1);
          }
          if(newIndex !== -1) {
            this.$store.getters[NEWFEEDS].splice(newIndex, 1);
          }

          let hotLists = this.$store.getters[HOTFEEDS];
          let hotIndex = hotLists.findIndex( item => { return item.id === feed_id; });
          let hotIds = this.$store.getters[HOTIDS];
          let hotIdsIndx = hotIds.findIndex( item => { return item === feed_id; });
          if(hotIdsIndx !== -1) {
            this.$store.getters[HOTIDS].splice(hotdsIndx, 1);
          }
          if(hotIndex !== -1) {
            this.$store.getters[HOTFEEDS].splice(hotIndex, 1);
          }

          let followingLists = this.$store.getters[FOLLOWINGFEEDS];
          let followingIndex = followingLists.findIndex( item => { return item.id === feed_id; });
          let followingIds = this.$store.getters[FOLLOWINGIDS];
          let followingIdsIndx = followingIds.findIndex( item => { return item === feed_id; });
          if(followingIdsIndx !== -1) {
            this.$store.getters[FOLLOWINGIDS].splice(followingIdsIndx, 1);
          }
          if(followingIndex !== -1) {
            this.$store.getters[FOLLOWINGFEEDS].splice(followingIndex, 1);
          }

          this.$delete(this.$store.getters[FEEDSLIST], feed_id);
          this.handleClosePopup();
        });
      },
      /**
       * 收藏/取消搜藏动态
       * @return {[type]} [description]
       */
      handleCollection(status, feed_id) {
        if(status) {
          addAccessToken().post(createAPI(`feeds/${feed_id}/collections`), {}, {
            validateStatus: status => status === 201
          })
          .then( response => {
            this.$set(this.feed, 'has_collect', true);
            this.handleClosePopup();
          })
        } else {
          addAccessToken().delete(createAPI(`feeds/${feed_id}/uncollect`), {}, {
            validateStatus: status => status === 204
          })
          .then( response => {
            this.$set(this.feed, 'has_collect', false);
            this.handleClosePopup();
          })
        }
      },
    }
  }

  export default showFeedPopup;
</script>

<style lang="less" module>
  div.showPopUp {
    width: 100%;
    background-color: #e2e3e3;
    .sexOptions {
      border-bottom: 1px solid #e2e3e3;
      color: #333;
      border-radius: 0;
      font-size: 16px;
      &:last-child {
        margin-top: 5px;
      }
    }
  }
</style>
