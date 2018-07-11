<template>
  <div class="p-profile-certification">
    <header class="m-box m-pos-f m-main m-bb1 m-head-top">
      <div
        class="m-box m-aln-center m-flex-none"
        @click="goBack">
        <v-icon type="base-back" />
      </div>
      <div class="m-box m-aln-center m-flex-auto m-justify-center m-head-top-title">
        <span>{{ type === 'user' ? '个人' : '企业' }}认证</span>
      </div>
      <div class="m-box m-aln-center m-flex-none btn-submit"/>
    </header>
    <main class="m-box-model main">
      <div
        v-if="verified.status === 0"
        class="info-bar">
        认证信息审核中，我们会在7个工作日内给您答复
      </div>
      <div class="info-main">
        <template v-if="type !== 'user'">
          <div class="row">
            <span class="label">{{ formInfo[type].orgName }}</span>
            <span class="value">{{ verified.data.org_name }}</span>
          </div>
          <div class="row">
            <span class="label">{{ formInfo[type].orgAddress }}</span>
            <span class="value">{{ verified.data.org_address }}</span>
          </div>
        </template>
        <div class="row">
          <span class="label">{{ formInfo[type].name }}</span>
          <span class="value">{{ verified.data.name }}</span>
        </div>
        <div class="row">
          <span class="label">{{ formInfo[type].number }}</span>
          <span class="value">{{ verified.data.number }}</span>
        </div>
        <div class="row">
          <span class="label">{{ formInfo[type].phone }}</span>
          <span class="value">{{ verified.data.phone }}</span>
        </div>
        <div class="row">
          <span class="label">{{ formInfo[type].desc }}</span>
          <span class="value">{{ verified.data.desc }}</span>
        </div>
        <div class="row">
          <span class="label">认证资料</span>
          <span class="value">
            <img
              v-for="imageId in verified.data.files"
              :key="imageId"
              :src="getImageSrc(imageId)">
          </span>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
/**
 * 认证状态页面
 */

import _ from "lodash";
import { mapState } from "vuex";

const formInfo = {
  user: {
    name: "真实姓名",
    number: "身份证号码",
    phone: "手机号码",
    desc: "认证描述"
  },
  org: {
    name: "负责人",
    number: "身份证号码",
    phone: "手机号码",
    desc: "认证描述",
    orgName: "机构名称",
    orgAddress: "机构地址"
  }
};

export default {
  name: "Certification",
  data() {
    return {
      formInfo
    };
  },
  computed: {
    ...mapState({
      verified: state => state.USER_VERIFY
    }),
    type() {
      const { certification_name = "user" } = this.verified;
      return certification_name;
    }
  },
  watch: {
    verified(to) {
      console.log(to);
      // 如果被驳回或没有数据则返回个人页面
      if (to.id && ![0, 1].includes(to.status)) {
        this.$router.replace("/profile");
      }
    }
  },
  created() {
    // 如果 store 中没有数据则重新获取认证数据，用于首屏加载
    if (_.isEmpty(this.verified) || !this.verified.id) {
      this.$store.dispatch("FETCH_USER_VERIFY");
    }
  },
  methods: {
    /**
     * @param {number} id
     * @returns {string}
     */
    getImageSrc(id) {
      return `${this.$http.defaults.baseURL}/files/${id}?w=250&h=185`;
    }
  }
};
</script>

<style lang="less" scoped>
.p-profile-certification {
  main {
    padding-top: 0.9rem;

    .info-bar {
      background-color: #4bb893;
      color: #fff;
      font-size: 24px;
      padding: 18px;
      text-align: center;
    }

    .row {
      font-size: 30px;
      line-height: 36px;
      margin: 78px 30px;

      .label {
        display: inline-block;
        width: 5em;
        margin-right: 1em;
        color: #999;
        vertical-align: top;
      }

      img {
        width: ~"calc(50% - 4em)";
        margin-right: 4px;
      }
    }
  }
}
</style>
