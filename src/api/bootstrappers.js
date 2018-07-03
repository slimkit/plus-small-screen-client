import { get } from "./api.js";
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
    : get("/locations/hots").then(
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
  return get(`around-amap/geo?address=${address}`).then(
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
  return get(`/locations/search?name=${name}`);
}
