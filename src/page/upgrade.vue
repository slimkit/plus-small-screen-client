<template>
  <div class="upgrade" @click='$router.go(-1)'>
    <p>网站升级中...</p>
    <div class="icon-large icon-setting">
      <div class="bg">
        <div class="gear-s">
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
        </div>
        <div class="gear-b">
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="teeth"></div>
          <div class="origin">
            <div class="stick"></div>
            <div class="stick"></div>
            <div class="stick"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "upgrade"
};
</script>
<style>
.upgrade {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 24px;
  height: 100%;
}

.upgrade p {
  margin-top: 3rem;
}

.icon-large {
  width: 220px;
  height: 220px;
  border-radius: 38px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.icon-setting {
  background: linear-gradient(to bottom, #dcdcdc, #8c8c8c);
}

.bg {
  width: 192px;
  height: 192px;
  background: linear-gradient(to bottom, #222, #545454);
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes gear-rotate {
  0% {
    transform: translate(-50%, -50%) rotate(0);
  }
  100% {
    transform: translate(-50%, -50%) rotate(230deg);
  }
}

.gear-s {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  border: 10px solid #b5b7ba;
  box-shadow: inset 0 0 15px 5px rgba(0, 0, 0, 0.3),
    0 0 5px 5px rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: gear-rotate 8s linear infinite alternate;
}

.gear-s .teeth {
  width: 3px;
  height: 10px;
  background: #b5b7ba;
  border-radius: 50% 50% 0 0/100% 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.gear-s .teeth:nth-child(1) {
  transform: translate(-50%, -50%) rotate(0deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(2) {
  transform: translate(-50%, -50%) rotate(6deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(3) {
  transform: translate(-50%, -50%) rotate(12deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(4) {
  transform: translate(-50%, -50%) rotate(18deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(5) {
  transform: translate(-50%, -50%) rotate(24deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(6) {
  transform: translate(-50%, -50%) rotate(30deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(7) {
  transform: translate(-50%, -50%) rotate(36deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(8) {
  transform: translate(-50%, -50%) rotate(42deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(9) {
  transform: translate(-50%, -50%) rotate(48deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(10) {
  transform: translate(-50%, -50%) rotate(54deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(11) {
  transform: translate(-50%, -50%) rotate(60deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(12) {
  transform: translate(-50%, -50%) rotate(66deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(13) {
  transform: translate(-50%, -50%) rotate(72deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(14) {
  transform: translate(-50%, -50%) rotate(78deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(15) {
  transform: translate(-50%, -50%) rotate(84deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(16) {
  transform: translate(-50%, -50%) rotate(90deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(17) {
  transform: translate(-50%, -50%) rotate(96deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(18) {
  transform: translate(-50%, -50%) rotate(102deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(19) {
  transform: translate(-50%, -50%) rotate(108deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(20) {
  transform: translate(-50%, -50%) rotate(114deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(21) {
  transform: translate(-50%, -50%) rotate(120deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(22) {
  transform: translate(-50%, -50%) rotate(126deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(23) {
  transform: translate(-50%, -50%) rotate(132deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(24) {
  transform: translate(-50%, -50%) rotate(138deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(25) {
  transform: translate(-50%, -50%) rotate(144deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(26) {
  transform: translate(-50%, -50%) rotate(150deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(27) {
  transform: translate(-50%, -50%) rotate(156deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(28) {
  transform: translate(-50%, -50%) rotate(162deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(29) {
  transform: translate(-50%, -50%) rotate(168deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(30) {
  transform: translate(-50%, -50%) rotate(174deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(31) {
  transform: translate(-50%, -50%) rotate(180deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(32) {
  transform: translate(-50%, -50%) rotate(186deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(33) {
  transform: translate(-50%, -50%) rotate(192deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(34) {
  transform: translate(-50%, -50%) rotate(198deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(35) {
  transform: translate(-50%, -50%) rotate(204deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(36) {
  transform: translate(-50%, -50%) rotate(210deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(37) {
  transform: translate(-50%, -50%) rotate(216deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(38) {
  transform: translate(-50%, -50%) rotate(222deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(39) {
  transform: translate(-50%, -50%) rotate(228deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(40) {
  transform: translate(-50%, -50%) rotate(234deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(41) {
  transform: translate(-50%, -50%) rotate(240deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(42) {
  transform: translate(-50%, -50%) rotate(246deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(43) {
  transform: translate(-50%, -50%) rotate(252deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(44) {
  transform: translate(-50%, -50%) rotate(258deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(45) {
  transform: translate(-50%, -50%) rotate(264deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(46) {
  transform: translate(-50%, -50%) rotate(270deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(47) {
  transform: translate(-50%, -50%) rotate(276deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(48) {
  transform: translate(-50%, -50%) rotate(282deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(49) {
  transform: translate(-50%, -50%) rotate(288deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(50) {
  transform: translate(-50%, -50%) rotate(294deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(51) {
  transform: translate(-50%, -50%) rotate(300deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(52) {
  transform: translate(-50%, -50%) rotate(306deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(53) {
  transform: translate(-50%, -50%) rotate(312deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(54) {
  transform: translate(-50%, -50%) rotate(318deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(55) {
  transform: translate(-50%, -50%) rotate(324deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(56) {
  transform: translate(-50%, -50%) rotate(330deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(57) {
  transform: translate(-50%, -50%) rotate(336deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(58) {
  transform: translate(-50%, -50%) rotate(342deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(59) {
  transform: translate(-50%, -50%) rotate(348deg) translate(0, -54px);
}

.gear-s .teeth:nth-child(60) {
  transform: translate(-50%, -50%) rotate(354deg) translate(0, -54px);
}

.gear-b {
  width: 138px;
  height: 138px;
  border-radius: 50%;
  border: 8px solid #c3c4c7;
  box-shadow: inset 0 0 15px 5px rgba(0, 0, 0, 0.3),
    0 0 20px 0px rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: gear-rotate 4s linear infinite alternate;
}

.gear-b .teeth {
  width: 4px;
  height: 10px;
  background: #c3c4c7;
  border-radius: 50% 50% 0 0/100% 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.gear-b .teeth:nth-child(1) {
  transform: translate(-50%, -50%) rotate(0deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(2) {
  transform: translate(-50%, -50%) rotate(6deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(3) {
  transform: translate(-50%, -50%) rotate(12deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(4) {
  transform: translate(-50%, -50%) rotate(18deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(5) {
  transform: translate(-50%, -50%) rotate(24deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(6) {
  transform: translate(-50%, -50%) rotate(30deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(7) {
  transform: translate(-50%, -50%) rotate(36deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(8) {
  transform: translate(-50%, -50%) rotate(42deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(9) {
  transform: translate(-50%, -50%) rotate(48deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(10) {
  transform: translate(-50%, -50%) rotate(54deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(11) {
  transform: translate(-50%, -50%) rotate(60deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(12) {
  transform: translate(-50%, -50%) rotate(66deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(13) {
  transform: translate(-50%, -50%) rotate(72deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(14) {
  transform: translate(-50%, -50%) rotate(78deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(15) {
  transform: translate(-50%, -50%) rotate(84deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(16) {
  transform: translate(-50%, -50%) rotate(90deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(17) {
  transform: translate(-50%, -50%) rotate(96deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(18) {
  transform: translate(-50%, -50%) rotate(102deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(19) {
  transform: translate(-50%, -50%) rotate(108deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(20) {
  transform: translate(-50%, -50%) rotate(114deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(21) {
  transform: translate(-50%, -50%) rotate(120deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(22) {
  transform: translate(-50%, -50%) rotate(126deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(23) {
  transform: translate(-50%, -50%) rotate(132deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(24) {
  transform: translate(-50%, -50%) rotate(138deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(25) {
  transform: translate(-50%, -50%) rotate(144deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(26) {
  transform: translate(-50%, -50%) rotate(150deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(27) {
  transform: translate(-50%, -50%) rotate(156deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(28) {
  transform: translate(-50%, -50%) rotate(162deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(29) {
  transform: translate(-50%, -50%) rotate(168deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(30) {
  transform: translate(-50%, -50%) rotate(174deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(31) {
  transform: translate(-50%, -50%) rotate(180deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(32) {
  transform: translate(-50%, -50%) rotate(186deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(33) {
  transform: translate(-50%, -50%) rotate(192deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(34) {
  transform: translate(-50%, -50%) rotate(198deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(35) {
  transform: translate(-50%, -50%) rotate(204deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(36) {
  transform: translate(-50%, -50%) rotate(210deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(37) {
  transform: translate(-50%, -50%) rotate(216deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(38) {
  transform: translate(-50%, -50%) rotate(222deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(39) {
  transform: translate(-50%, -50%) rotate(228deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(40) {
  transform: translate(-50%, -50%) rotate(234deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(41) {
  transform: translate(-50%, -50%) rotate(240deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(42) {
  transform: translate(-50%, -50%) rotate(246deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(43) {
  transform: translate(-50%, -50%) rotate(252deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(44) {
  transform: translate(-50%, -50%) rotate(258deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(45) {
  transform: translate(-50%, -50%) rotate(264deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(46) {
  transform: translate(-50%, -50%) rotate(270deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(47) {
  transform: translate(-50%, -50%) rotate(276deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(48) {
  transform: translate(-50%, -50%) rotate(282deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(49) {
  transform: translate(-50%, -50%) rotate(288deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(50) {
  transform: translate(-50%, -50%) rotate(294deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(51) {
  transform: translate(-50%, -50%) rotate(300deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(52) {
  transform: translate(-50%, -50%) rotate(306deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(53) {
  transform: translate(-50%, -50%) rotate(312deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(54) {
  transform: translate(-50%, -50%) rotate(318deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(55) {
  transform: translate(-50%, -50%) rotate(324deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(56) {
  transform: translate(-50%, -50%) rotate(330deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(57) {
  transform: translate(-50%, -50%) rotate(336deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(58) {
  transform: translate(-50%, -50%) rotate(342deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(59) {
  transform: translate(-50%, -50%) rotate(348deg) translate(0, -82px);
}

.gear-b .teeth:nth-child(60) {
  transform: translate(-50%, -50%) rotate(354deg) translate(0, -82px);
}

.origin {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 3px solid #c3c4c7;
  box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.stick {
  height: 67px;
  width: 8px;
  background: #c3c4c7;
  box-shadow: 5px 0 3px -3px rgba(0, 0, 0, 0.5),
    -5px 0 3px -3px rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.stick:before,
.stick:after {
  content: "";
  display: block;
  position: absolute;
}

.stick:before {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 10px 12px;
  border-color: transparent transparent #c3c4c7;
  position: absolute;
  bottom: 2px;
  right: -6px;
}

.stick:after {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 20px 6px;
  border-color: transparent transparent #c3c4c7;
  position: absolute;
  bottom: 2px;
  right: -16px;
}

.stick:nth-child(1) {
  transform: translate(-50%, -50%) rotate(0deg) translate(0, 38px);
}

.stick:nth-child(2) {
  transform: translate(-50%, -50%) rotate(120deg) translate(0, 38px);
}

.stick:nth-child(3) {
  transform: translate(-50%, -50%) rotate(240deg) translate(0, 38px);
}
</style>
