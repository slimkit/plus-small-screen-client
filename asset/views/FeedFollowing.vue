<template>
  <div :class="$style.feedContent">
    <div v-if="errors" :class="$style.notice">
      {{ errors.serverError }}
    </div>
    <FeedLists :feeds="feeds"></FeedLists>
  </div>
</template>

<script>
  import FeedLists from '../components/FeedList';
  import request, { createAPI, addAccessToken } from '../utils/request';
  import errorCodes from '../stores/errorCodes';
  import localEvent from '../stores/localStorage';

  const FeedList = {
    components: {
      FeedLists
    },
    data: () => ({
      feeds: [],
      maxId: 0,
      limit: 15,
      errors: {}
    }),
    computed: {
      errors () {
        let errors = Object.values(this.errors);
        return errors[0] || '';
      }
    },
    mounted: function() {
      this.$nextTick(function () {
        let max_id = this.maxId;
        let limit =  this.limit;
        addAccessToken().get(createAPI('feeds/follows'), {
            max_id,
            limit 
          }, {
            validate: status  => status === 200
          }
        )
        .then(response => {
          this.feeds = response.data.data;
          console.log(this.feeds);
        })
        .catch(({ response: { data = {} } = {} } ) => {
          const { code = 'xxxx' } = data;
          this.errors = Object.assign({}, this.errors, { serverError: errorCodes[code] });
        });
      });
    }
  }

  export default FeedList;
</script>

<style lang="scss" module>
  .feedContent {
    padding-top: 49px;
  }
  .notice {
    padding: 10px 0;
    height: 18px;
    background-color: #59b6d7;
    color: #fff;
    text-align: center;
    line-height: 18px;
  }
</style>
