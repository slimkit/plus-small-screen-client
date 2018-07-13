import api from "./api.js";
import lstore from "@/plugins/lstore";
import location from "@/util/location.js";
/**
 * 获取热门城市列表
 * @return {Promise}
 */
export async function getHotCities() {
  if (lstore.hasData("H5_HOT_CITIES")) {
    return lstore.getData("H5_HOT_CITIES");
  }

  let response = await api.get("/locations/hots", {
    validateStatus: status => status === 200
  });
  lstore.setData("H5_HOT_CITIES", response.data);

  return response.data;
}

/**
 * 获取当前定位信息
 * @return {Promise}
 */
export async function getCurrentPosition() {
  let data = await location.getCurrentPosition();
  let { city, district, street } = data.addressComponent || {};

  return {
    lng: data.position.getLng(),
    lat: data.position.getLat(),
    label: street || district || city || "定位成功"
  };
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
 * @param  {String} name
 * @return {Promise -> Array}
 */
export async function searchCityByName(
  name,
  defaultResponseValue = { data: [] }
) {
  if (!name) {
    return defaultResponseValue;
  }

  return await api.get("/locations/search", {
    params: { name },
    validateStatus: status => status === 200
  });
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
 * @export
 * @param {number} adId 从广告类型列表中获取的广告 id
 * @returns
 */
export async function getAdsById(adId, defaultResponseValue = { data: [] }) {
  if (!adId) {
    return defaultResponseValue;
  }

  return await api.get(`/advertisingspace/${adId}/advertising`, {
    validateStatus: status => status === 200
  });
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
