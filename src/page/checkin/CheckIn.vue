<template>
  <div @touchmove.prevent>
    <transition name='toast'>
      <div v-if='show' class="m-pop-box" @click='cancel'></div>
    </transition>
    <transition
    enter-active-class="animated jello"
    >
      <div v-if='show' class="m-box-model m-main m-check-in-box">
        <header class="m-box-model m-aln-center m-justify-center m-check-in-head">
          <h2>每日签到</h2>
          <p>累计签到{{ last_checkin_count }}天</p>
          <a class="m-check-in-close" @click="cancel">
            <svg class="m-style-svg m-svg-def">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#base-clean"></use>
            </svg>
          </a>
        </header>
        <main class="m-box-model m-aln-center m-check-in-body">
          <section class="m-check-in-con">
            <h2>+{{ attach_balance }}</h2>
            <p>每日签到得金币</p>
          </section>
          <button class="m-check-in-btn" :disabled="checked_in" @click="fetchCheckIn">{{checked_in ? "已签到" : "签到"}}</button>
          <div class="m-lim-width">
            <ul class="m-box m-lan-center m-justify-center m-check-in-user-list">
              <li 
              v-if="user.id"
              :key="user.id"
              v-for="(user, index) in rank_users"
              class="m-box-model m-aln-center">
                <avatar size="tiny" :user="user" />
                <span>{{ index + 1 }}</span>
              </li>
            </ul>
          </div>
        </main>
      </div>
    </transition>
  </div>
</template>
<script>
import bus from "@/bus.js";
export default {
  name: "check-in",
  data() {
    return {
      show: false,
      scrollTop: 0,
      rank_users: [],
      checked_in: true,
      attach_balance: 0,
      last_checkin_count: 0
    };
  },
  created() {
    this.updateDate();
    bus.$on("check-in", () => {
      this.show = true;
      this.scrollTop = document.scrollingElement.scrollTop;
      document.body.classList.add("m-pop-open");
      document.body.style.top = -this.scrollTop + "px";
    });
  },
  methods: {
    cancel() {
      this.show = false;
      document.body.style.top = "";
      document.body.classList.remove("m-pop-open");
      document.scrollingElement.scrollTop = this.scrollTop;
    },
    updateDate() {
      this.$http
        .get(`/user/checkin`)
        .then(
          ({
            data: {
              checked_in,
              attach_balance,
              rank_users = [],
              // checkin_count = 0,
              last_checkin_count = 0
            } = {}
          }) => {
            this.checked_in = checked_in;
            this.attach_balance = ~~attach_balance;
            this.last_checkin_count = last_checkin_count;
            rank_users && rank_users.length && (this.rank_users = rank_users);
          }
        );
    },
    fetchCheckIn() {
      if (this.checked_in) return;
      this.$http
        .put("/user/checkin", {
          validateStatus: s => s === 204
        })
        .then(() => {
          this.checked_in = true;
          this.updateDate();
        })
        .catch(() => {
          this.$Message.error("签到失败, 请稍后重试");
        });
    }
  }
};
</script>

<style>
.m-check-in-box {
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  height: 600px;
  width: 500px;
  border-radius: 10px;
}

.m-check-in-head {
  color: #fff;
  height: 200px;
  font-size: 24px;
  background-image: linear-gradient(
    148deg,
    #efb946 0%,
    #efa046 50%,
    #ef8a46 100%
  );
}
.m-check-in-head h2 {
  font-size: 44px;
}
.m-check-in-head p {
  margin-top: 20px;
  padding: 0 45px;
  color: #d46c28;
  height: 44px;
  line-height: 44px;
  border-radius: 22px;
  background-color: rgba(255, 255, 255, 0.2);
}

.m-check-in-close {
  display: block;
  width: 36px;
  height: 36px;
  position: absolute;
  top: 15px;
  right: 15px;
  border-radius: 100%;
  overflow: hidden;
  color: rgba(255, 255, 255, 0.8);
}
.m-check-in-close .m-svg-def {
  width: 36px;
  height: 36px;
}
.m-check-in-body {
  padding: 50px;
  font-size: 24px;
  color: #999;
  line-height: 40px;
}
.m-check-in-con {
  text-align: center;
}
.m-check-in-con h2 {
  font-size: 60px;
  color: #ff9400;
  margin-bottom: 20px;
}
.m-check-in-btn {
  margin-top: 40px;
  width: 100%;
  height: 70px;
  line-height: 70px;
  font-size: 30px;
  color: #fff;
  background-image: linear-gradient(92deg, #efab46 0%, #ef8a46 100%);
  border-radius: 6px;
}
.m-check-in-btn[disabled="disabled"] {
  background: #ccc;
}
.m-check-in-user-list {
  margin-top: 30px;
  font-size: 20px;
}
.m-check-in-user-list li + li {
  margin-left: 20px;
}
</style>
