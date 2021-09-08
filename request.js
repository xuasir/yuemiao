const md5 = require("md5");
const moment = require("moment");
const originRequest = require("request");

module.exports = function createRequest({ tk, linkman_id, month }) {
  const request = (url, opts) => {
    return new Promise((resolve, reject) => {
      originRequest(
        url,
        Object.assign(
          {
            headers: {
              tk,
            },
          },
          opts
        ),
        (err, res) => {
          if (err) {
            reject(err);
            return;
          }
          try {
            resolve(JSON.parse(res.body));
          } catch (error) {
            resolve(res.body);
          }
        }
      );
    });
  };

  const host = "https://wx.scmttec.com";

  function toQurey(obj) {
    return (
      "?" +
      Object.keys(obj)
        .map((k) => `${k}=${obj[k] + ""}`)
        .join("&")
    );
  }

  // 通过接种点疫苗类型获取接种点信息
  // id 接种点疫苗code
  function getItemInfo(id) {
    return request(
      host +
        "/base/departmentVaccine/item.do" +
        toQurey({
          id,
          isShowDescribtion: true,
          showOther: true,
        }),
      {
        method: "get",
      }
    );
  }

  // 查询是否可订阅并且拿凭证 res.data.ticket
  /**
   * id 接种点疫苗code
   * depaCode 接种点code
   * vaccineCode 疫苗code
   */
  function isCanSub(obj) {
    return request(
      host +
        "/subscribe/subscribe/isCanSubscribe.do" +
        toQurey({
          ...obj,
          linkmanId: linkman_id,
        }),
      {
        method: "get",
      }
    );
  }

  // 查询所有可订阅的天数 by 月份 res.data.dateList
  /**
   * depaCode 接种点code
   * departmentVaccineId 接种点疫苗code
   * vaccIndex 第几针
   * vaccCode 疫苗code
   */
  function findAllMonth(obj) {
    return request(
      host +
        "/order/subscribe/workDaysByMonth.do" +
        toQurey({
          ...obj,
          month,
          linkmanId: linkman_id,
        }),
      {
        method: "get",
      }
    );
  }

  // 查询某天 可预约时间 res.data.times[n].id [{ maxSub排序, id: 时间 }]
  /**
   * depaCode 接种点code
   * departmentVaccineId 接种点疫苗code
   * vaccIndex 第几针
   * vaccCode 疫苗code
   * subsribeDate	预约时间 2021-08-29
   */
  function getAllTimes(obj) {
    return request(
      host +
        "/subscribe/subscribe/departmentWorkTimes2.do" +
        toQurey({
          ...obj,
          linkmanId: linkman_id,
        }),
      {
        method: "get",
      }
    );
  }

  // 提交预约
  /**
   * depaCode 接种点code
   * departmentVaccineId 接种点疫苗code
   * vaccineIndex 第几针
   * vaccineCode 疫苗code
   * subscribeDate	预约时间 2021-08-29
   * subscirbeTime 预约时间 具体时间 来自 getAllTime
   * ticket 凭证 来自 isCanSub
   */
  function toSub(obj) {
    return request(
      host +
        "/subscribe/subscribe/add.do" +
        toQurey({
          ...obj,
          depaCode:
            obj.depaCode +
            "_" +
            md5(
              moment(Date.now()).format("YYYYMMDDHHmm") +
                obj.subscirbeTime +
                "fuckhacker10000"
            ),
          serviceFee: 0,
          linkmanId: linkman_id,
        }),
      {
        method: "get",
      }
    );
  }

  // 取消
  /**
   * /order/subscribe/cancel.do?reasonCode=9&otherReason=&id=8560450
   */
  async function cancel() {
    const { rows = [] } =
      (
        await request(
          host +
            "/order/subscribe/pageList.do?offset=0&limit=10&t=1631104816000"
        )
      )?.data || {};
    const id = rows?.[0]?.subscribe?.id;
    // status = 0 代表以预约
    return request(
      host +
        "/order/subscribe/cancel.do" +
        toQurey({
          reasonCode: 9,
          otherReason: "",
          id,
        }),
      {
        method: "get",
      }
    );
  }

  return {
    getItemInfo,
    isCanSub,
    findAllMonth,
    getAllTimes,
    toSub,
    cancel,
  };
};
