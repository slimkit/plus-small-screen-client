<template>
  <div class="feedContent">
    <div v-if="errors.serverError" :class="$style.notice" >
      {{ errors.serverError }}
    </div>
    <div class="feed-list">
      <div class="feed" v-for="feed in feeds">
        <Feed :feed="feed"></Feed>
      </div>
    </div>
  </div>
</template>

<script>
  import request, { createAPI, addAccessToken } from '../utils/request';
  import errorCodes from '../stores/errorCodes';
  import localEvent from '../stores/localStorage';
  import Feed from './Feed';

  const FeedLists = {
    components: {
      Feed
    },
    data: () => ({
      feeds: [],
      maxId: 0,
      limit: 15,
      errors: {}
    }),computed: {
      error: function () {
        let errors = Object.values(this.errors);
        return errors[0] || '';
      }
    },
    computed: {
      error: function () {
        let errors = Object.values(this.errors);
        return errors[0] || '';
      }
    },
    beforeMount () {
      let max_id = this.maxId;
      let limit =  this.limit;
      addAccessToken().get(createAPI('feeds'), {
          max_id,
          limit 
        }, {
          validate: status  => status === 200
        }
      )
      .then(response => {
        this.feeds = response.data.data;
      })
      .catch(({ response: { data = {} } = {} } ) => {
        const { code = 'xxxx' } = data;
        this.errors = Object.assign({}, this.errors, { serverError: errorCodes[code] });
      });
    }
  };

  export default FeedLists;
</script>

<style lang="scss" module>
  .notice {
    padding: 10px 0;
    height: 18px;
    background-color: #59b6d7;
    color: #fff;
    text-align: center;
    line-height: 18px;
  }
</style>
