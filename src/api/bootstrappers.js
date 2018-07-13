import api from "./api.js";
import lstore from "@/plugins/lstore";
import location from "@/util/location.js";
/**
 * 获取热门城市列表
 * @author jsonleex <jsonlseex@163.com>
 * @return {Promise -> Array}
 */
export function getHotCities() {
  const hasData = lstore.hasData("H5_HOT_CITIES");
  return hasData
    ? Promise.resolve(lstore.getData("H5_HOT_CITIES"))
    : api.get("/locations/hots").then(
        ({ data }) => {
          const res = data ? data : [];
          lstore.setData("H5_HOT_CITIES", res);
          return res;
        },
        err => {
          console.warn(err);
          return [];
        }
      );
}

/**
 * 获取当前定位信息
 * @author jsonleex <jsonlseex@163.com>
 * @return {Promise -> Object}
 */
export function getCurrentPosition() {
  return location.getCurrentPosition().then(
    data => {
      //   str.push("经度：" + position.getLng());
      //   str.push("纬度：" + position.getLat());
      const { addressComponent: { city, district, street = "" } = {} } = data;
      const res = {
        lng: data.position.getLng(),
        lat: data.position.getLat(),
        label: street || district || city || "定位成功"
      };
      return res;
    },
    err => {
      console.warn(err);
      throw err;
    }
  );
}

export function getGeo(address) {
  const res = {};
  return api.get(`around-amap/geo?address=${address}`).then(
    ({
      data: {
        geocodes: [
          { /*city, district, province, */ location, formatted_address }
        ]
      } = {}
    }) => {
      // city, district, province, location, formatted_address;
      const label = formatted_address;
      const [lng, lat] = location.split(",");
      return Object.assign(res, { lng, lat, label });
    },
    err => {
      console.warn(err);
      return res;
    }
  );
}

/**
 * 搜索城市
 * @author jsonleex <jsonlseex@163.com>
 * @param  {String} name
 * @return {Promise -> Array}
 */
export function searchCityByName(name) {
  if (!name) return Promise.resolve({ data: [] });
  return api.get(`/locations/search?name=${name}`);
}

/**
 * 查询所有广告位
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @returns
 */
export function getAdvertiseType() {
  return api.get("/advertisingspace", { validateStatus: s => s === 200 });
}

/**
 * 获取启动信息
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @returns
 */
export function getBootstrappers() {
  return api.get("/bootstrappers", { validateStatus: s => s === 200 });
}

/**
 * 根据广告位 id 获取一个广告位的广告列表
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number} adId 从广告类型列表中获取的广告 id
 * @returns
 */
export function getAdsById(adId) {
  if (!adId) return Promise.resolve({ data: [] });
  const url = `/advertisingspace/${adId}/advertising`;
  return api.get(url, { validateStatus: s => s === 200 });
}

/**
 * 批量获取广告列表 必须传入数组
 * @author mutoe <mutoe@foxmail.com>
 * @export
 * @param {number[]} adIds
 * @returns
 */
export function getAdsByIds(adIds) {
  const url = "/advertisingspace/advertising";
  const params = { space: adIds.join(",") };
  return api.get(url, { params, validateStatus: s => s === 200 });
}
