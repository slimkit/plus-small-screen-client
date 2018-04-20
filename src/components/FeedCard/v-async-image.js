import http from "@/http.js";
import _ from "lodash";

function onEvent(el, type, func, capture = false) {
  el.addEventListener(type, func, {
    capture: capture
  });
}
/**
 *  图片懒加载, 支持背景图片
 */

/* eslint-disable no-extend-native */
/**
 * 数组item remove方法
 * @author jsonleex <jsonlseex@163.com>
 */
if (!Array.prototype.remove) {
  Array.prototype.remove = function(item) {
    if (!this.length) return;
    var index = this.indexOf(item);
    if (index > -1) {
      this.splice(index, 1);
      return this;
    }
  };
}
export default Vue => {
  const listenList = [];
  const imageFileCatch = [];
  const imageCatcheList = [];
  const isAlredyLoad = fileID => {
    return imageFileCatch.indexOf(fileID);
  };

  /*
 *  check el is in view
 *  @return {Boolean} el is in view
 */
  const wH = window.innerHeight;
  const wW = window.innerWidth;
  const checkInView = el => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top < wH * 1.3 &&
      rect.bottom > 1.3 &&
      (rect.left < wW * 1.3 && rect.right > 0)
    );
  };
  const isCanShow = item => {
    const { el, file, q = 40 } = item;
    const isIMG = el.nodeName === "IMG";
    if (checkInView(el)) {
      let image = new Image();
      el.classList.add("loading");
      http.get(`/files/${file}?q=${q}&json=true`).then(({ data: { url } }) => {
        image.src = url;
        image.onload = () => {
          isIMG ? (el.src = url) : (el.style.backgroundImage = `url(${url})`);
          listenList.remove(item);
          imageFileCatch.push(file);
          imageCatcheList.push(url);
          image = null;
          el.classList.remove("loading");
        };
        image.onerror = () => {
          listenList.remove(item);
          el.classList.remove("loading");
        };
      });
      return true;
    } else {
      return false;
    }
  };
  const addListener = (el, binding) => {
    const file = binding.value;
    const index = isAlredyLoad(file.file);
    const isIMG = el.nodeName === "IMG";
    if (index > -1)
      return isIMG
        ? (el.src = imageCatcheList[index])
        : (el.style.backgroundImage = `url(${imageCatcheList[index]})`);
    const item = {
      el,
      nodeName: el.nodeName,
      error: false,
      loading: true,
      ...file
    };
    if (isCanShow(item)) return;
    listenList.push(item);
  };
  Vue.directive("async-image", {
    inserted: addListener,
    updated: addListener
  });
  [
    "scroll",
    "wheel",
    "mousewheel",
    "resize",
    "animationend",
    "transitionend",
    "touchmove"
  ].forEach(evt =>
    onEvent(
      window,
      evt,
      _.debounce(() => {
        listenList.map(img => {
          isCanShow(img);
        });
      }, 1000 / 60)
    )
  );
};
