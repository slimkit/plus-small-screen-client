<template>
  <a
    :href="ad.data.link"
    class="m-box-model m-card">
    <div class="m-box">
      <avatar :user="ad.data" />
      <section class="m-box-model m-flex-grow1 m-flex-shrink1 m-card-main">
        <header class="m-box m-aln-center m-justify-bet m-card-usr">
          <h4 class="m-flex-grow1 m-flex-shrink1">{{ ad.data.name }}</h4>
          <div class="m-box m-aln-center">
            <span>{{ ad.data.time | formatDate('MM-dd') }}</span>
          </div>
        </header>
        <article class="m-card-body">
          <div
            v-if="ad.data.content.length > 0"
            class="m-card-con">
            <p class="m-text-box m-text-cut-3">{{ ad.data.content }}</p>
            <div class="image">
              <img :src="ad.data.image">
            </div>
          </div>
        </article>
      </section>
    </div>
    <footer class="m-box-model m-card-foot m-bt1">
      <div class="m-box m-aln-center m-card-tools m-lim-width">
        <span class="advertise-badge">广告</span>
      </div>
    </footer>
  </a>
</template>

<script>
/**
 * 模拟动态卡片广告
 */
export default {
  name: "FeedCard",
  props: {
    ad: { type: Object, required: true }
  }
};
</script>

<style lang="less" scoped>
.m-card {
  padding: 30px 20px 0;
  box-sizing: border-box;
  background-color: #fff;

  .m-card-usr {
    font-size: 24px;
    color: #ccc;
    margin-bottom: 30px;
    h4 {
      color: #000;
      font-size: 26px;
    }
    span + span {
      margin-left: 15px;
    }
  }
  .m-card-main {
    margin-left: 20px;
  }
  .m-card-con {
    overflow: hidden;
    font-size: 30px;
    line-height: 42px;
    color: @text-color2;

    .image {
      margin-top: 12px;
      img {
        width: 518px;
      }
    }
  }
  .m-card-body {
    > h2 {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 20px;
    }
  }
  .m-card-foot {
    margin-top: 20px;
    margin-left: -20px;
    margin-right: -20px;
    padding: 0 20px 0 120px;

    .advertise-badge {
      border: 1px solid #ededed;
      padding: 2px 8px;
    }
  }
  .m-card-tools {
    padding: 30px 0;
    color: #b3b3b3;
    font-size: 24px;
    a {
      color: inherit;
      + a {
        margin-left: 60px;
      }
    }
    span {
      margin-left: 10px;
    }
  }
}
</style>
