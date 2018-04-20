import api, { get } from "./api.js";
import lstore from "@/plugins/lstore";
import location from "@/util/location.js";
import $Message from "@/plugins/message-box";
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
          console.log(err);
          return [];
        }
      );
}

/**
 * 获取当前定位信息
 * @author jsonleex <jsonlseex@163.com>
 * @return {Promise -> Object || String}
 */

export function getCurrentPosition() {
  return location.getCurrentPosition().then(
    position => {
      console.log(position);
      return position;
    },
    err => {
      throw err;
    }
  );
}

export function getGeo(address) {
  const res = {};
  return get(`around-amap/geo?address=${address}`).then(
    ({
      data: {
        geocodes: [{ city, district, province, location, formatted_address }]
      } = {}
    }) => {
      console.log(city, district, province, location, formatted_address);
      const label = formatted_address;
      const [lng, lat] = location.split(",");
      return Object.assign(res, { lng, lat, label });
    },
    err => {
      console.log(err);
      return res;
    }
  );
}
