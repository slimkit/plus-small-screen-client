<template>
  <div class="p-profile-certificate">
    <header class="m-box m-pos-f m-main m-bb1 m-head-top">
      <div
        class="m-box m-aln-center m-flex-none"
        @click="step > 1 ? step-- : goBack()">
        <v-icon type="base-back" />
      </div>
      <div class="m-box m-aln-center m-flex-auto m-justify-center m-head-top-title">
        <span>{{ step === 1 ? '基本信息' : '上传资料' }}</span>
      </div>
      <div class="m-box m-aln-center m-flex-none btn-submit">
        <span
          v-show="step === 2"
          :class="['btn-submit', disabled]"
          @click="onSubmit">提交</span>
      </div>
    </header>

    <transition-group
      :enter-active-class="animated.enter"
      :leave-active-class="animated.leave"
      tag="main"
      class="m-box-model m-flex-grow1 m-flex-shrink1 main"
      style="padding-top: 0.9rem;">
      <template v-if="step === 1">
        <div
          key="step1"
          class="step1">
          <template v-if="type ==='org'">
            <!-- 机构名称 -->
            <div class="m-form-row m-main">
              <label for="org-name">{{ formInfo[type].orgName.label }}</label>
              <div class="m-input">
                <input
                  id="org-name"
                  v-model.trim="orgFields.org_name"
                  :placeholder="formInfo[type].orgName.placeholder"
                  type="text"
                  maxlength="20">
              </div>
              <svg
                v-show="orgFields.org_name.length > 0"
                class="m-style-svg m-svg-def"
                @click="orgFields.org_name = ''">
                <use
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  xlink:href="#base-clean"/>
              </svg>
            </div>
            <!-- 机构地址 -->
            <div class="m-form-row m-main">
              <label for="org-address">{{ formInfo[type].orgAddress.label }}</label>
              <div class="m-input">
                <input
                  id="org-address"
                  v-model.trim="orgFields.org_address"
                  :placeholder="formInfo[type].orgAddress.placeholder"
                  type="text"
                  maxlength="8">
              </div>
              <svg
                v-show="orgFields.org_address.length > 0"
                class="m-style-svg m-svg-def"
                @click="orgFields.org_address = ''">
                <use
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  xlink:href="#base-clean"/>
              </svg>
            </div>
          </template>

          <!-- 真实姓名 / 负责人姓名 -->
          <div class="m-form-row m-main">
            <label for="username">{{ formInfo[type].name.label }}</label>
            <div class="m-input">
              <input
                id="username"
                v-model.trim="fields.name"
                :placeholder="formInfo[type].name.placeholder"
                maxlength="8"
                type="text">
            </div>
          </div>
          <!-- 证件号码 -->
          <div class="m-form-row m-main">
            <label for="number">{{ formInfo[type].number.label }}</label>
            <div class="m-input">
              <input
                id="number"
                v-model.trim="fields.number"
                :placeholder="formInfo[type].number.placeholder"
                maxlength="18"
                type="text"
                pattern="[0-9x]*">
            </div>
          </div>
          <!-- 手机号码 -->
          <div class="m-form-row m-main">
            <label for="phone">{{ formInfo[type].phone.label }}</label>
            <div class="m-input">
              <input
                id="phone"
                v-model="fields.phone"
                :placeholder="formInfo[type].phone.placeholder"
                type="number"
                pattern="[0-9]*"
                oninput="value=value.slice(0, 11)">
            </div>
          </div>
          <!-- 认证描述 -->
          <div class="m-form-row m-main auto-height">
            <label for="desc">{{ formInfo[type].desc.label }}</label>
            <div class="m-input">
              <textarea
                id="desc"
                v-model="fields.desc"
                :placeholder="formInfo[type].desc.placeholder"
                rows="3"/>
            </div>
          </div>
          <div class="m-box m-aln-center m-text-box m-form-err-box">
            <!-- <span>{{ error | plusMessageFirst }}</span> -->
          </div>
          <div
            class="m-form-row"
            style="border: 0">
            <button
              :disabled="loading||disabled"
              class="m-long-btn m-signin-btn"
              @click="step = 2">
              <v-icon
                v-if="loading"
                type="base-loading"/>
              <span v-else>下一步</span>
            </button>
          </div>
        </div>
      </template>

      <template v-if="step === 2">
        <div
          key="step2"
          class="step2">
          <p
            v-if="type === 'user'"
            class="poster-tips">请上传正反面身份证照片</p>
          <p
            v-else
            class="poster-tips">上传企业机构营业执照</p>
          <image-poster
            :poster="poster1"
            @uploaded="uploaded1">
            <span>点击上传正面身份证照片</span>
          </image-poster>
          <template v-if="type=='user' && fields.files.length > 0">
            <image-poster
              :poster="poster2"
              @uploaded="uploaded2">
              <span>点击上传反面身份证照片</span>
            </image-poster>
          </template>
        </div>
      </template>
    </transition-group>
  </div>
</template>

<script>
/**
 * 认证表单页面
 */

import ContentText from "@/page/post/components/ContentText.vue";
import ImagePoster from "@/components/ImagePoster.vue";
import * as api from "@/api/user.js";

const formInfo = {
  user: {
    name: { label: "真实姓名", placeholder: "输入真实姓名" },
    number: { label: "身份证号码", placeholder: "输入正确的身份证号码" },
    phone: { label: "手机号码", placeholder: "输入11位手机号码" },
    desc: { label: "认证描述", placeholder: "该描述会影响审核，请慎重填写" }
  },
  org: {
    name: { label: "负责人", placeholder: "输入机构负责人" },
    number: { label: "身份证号码", placeholder: "输入负责人身份证号码" },
    phone: { label: "手机号码", placeholder: "输入11位手机号码" },
    desc: { label: "认证描述", placeholder: "该描述会影响审核，请慎重填写" },
    orgName: { label: "机构名称", placeholder: "输入机构名称" },
    orgAddress: { label: "机构地址", placeholder: "输入机构地址" }
  }
};

export default {
  name: "Certificate",
  components: {
    ContentText,
    ImagePoster
  },
  data() {
    return {
      loading: false,
      step: 1,
      formInfo,
      status: 0, // 认证状态
      fields: {
        name: "",
        number: "",
        phone: "",
        desc: "",
        files: []
      },
      orgFields: {
        org_name: "", // ignore camelcase
        org_address: "" // ignore camelcase
      },
      animated: {
        enter: "animated slideInRight",
        leave: "animated slideOutLeft"
      }
    };
  },
  computed: {
    /**
     * 认证类型. 必须是 (user|org)
     * @returns {string}
     */
    type: {
      get() {
      return this.$route.query.type || "user";
    },
      set(val) {
        const { path, query } = this.$route;
        query.type = val;
        this.$router.push({ path, query });
      }
    },
    /**
     * 待提交表单
     * @returns {Object}
     */
    formData: {
      get() {
        const ret =
          this.type === "user"
            ? this.fields
            : Object.assign({}, this.fields, this.orgFields);
        ret.type = this.type;
        return ret;
      },
      set(val) {
        // TODO: 优化这里
        const { name, phone, number, desc, files, org_name, org_address } = val; // ignore camelcase
        this.fields = Object.assign({}, this.fields, {
          name,
          phone,
          desc,
          number,
          files
        });
        this.orgFields = Object.assign({}, this.orgFields, {
          org_name,
          org_address
        });
      }
    },
    /**
     * 下一步可用性
     */
    disabled() {
      switch (this.step) {
        case 1: {
          return !Object.values(this.formData).every(v => v);
        }
      }
    },
    poster1() {
      const id = this.fields.files[0];
      return { id, src: `${this.$http.defaults.baseURL}/files/${id}` };
    },
    poster2() {
      const id = this.fields.files[1];
      return { id, src: `${this.$http.defaults.baseURL}/files/${id}` };
    }
  },
  watch: {
    /**
     * 步骤切换动画
     */
    step(to, from) {
      to > from
        ? (this.animated = {
            enter: "animated slideInRight",
            leave: "animated slideOutLeft"
          })
        : (this.animated = {
            enter: "animated slideInLeft",
            leave: "animated slideOutRight"
          });
    }
  },
  mounted() {
    this.$store.dispatch("FETCH_USER_VERIFY").then(data => {
      this.formData = data.data || {};
      this.type = data.certification_name;
      this.status = data.status;
    });
  },
  methods: {
    onSubmit() {
      if (this.status === 0) {
        api.postCertification(this.formData).then(() => {
          this.$Message.success("提交成功，请等待审核");
        this.goBack();
      });
      } else {
        api.patchCertification(this.formData).then(() => {
          this.$Message.success("提交成功，请等待审核");
          this.goBack();
        });
      }
    },
    uploaded1(poster) {
      this.$set(this.fields.files, 0, poster.id);
    },
    uploaded2(poster) {
      if (this.type === "org") return;
      this.$set(this.fields.files, 1, poster.id);
    }
  }
};
</script>

<style lang="less" scoped>
.p-profile-certificate {
  header {
    .btn-submit {
      width: 2em;
    }
  }

  main {
    [class*="step"] {
      position: fixed;
      top: 0.9rem;
      width: 100%;
      background-color: #fff;
      height: 100vh;
    }

    .m-form-row {
      label {
        width: 5.5em;
        flex: none;

        &::before {
          content: "*";
          color: red;
        }
      }

      &.auto-height {
        align-items: flex-start;
        min-height: 1.1rem;
        height: auto;
        padding-top: 0.4rem;
        padding-bottom: 0.4rem;

        textarea {
          width: 100%;
          line-height: 1.4;
          font-size: 0.28rem;
        }
      }
    }

    .step2 {
      padding: 20px;
    }

    .poster-tips {
      color: #666;
      font-size: 80%;
    }
  }
}
</style>
