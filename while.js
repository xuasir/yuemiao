const {
  getItemInfo,
  isCanSub,
  getAllTimes,
  findAllMonth,
  toSub,
} = require("./request.js");
const moment = require("moment");

const okCode = "0000";

module.exports = async function main(config, depaVaccId) {
  const { vaccineCode, vaccineIndex } = config;
  // 查询接种点信息
  try {
    let ticket;
    let iteminfo = await getItemInfo(depaVaccId);
    if (iteminfo?.data?.items?.length > 0) {
      // ok
      iteminfo = iteminfo.data;
      console.info(`获取接种点 ${iteminfo?.departmentName} 成功`);
      while (true) {
        // 查询是否可以订阅和票证
        const sub = await isCanSub({
          id: depaVaccId,
          depaCode: iteminfo.departmentCode,
          vaccineCode,
        });
        if (sub?.data?.ticket) {
          // 保存票证;
          ticket = sub?.data?.ticket;
          console.info(`获取接种点票证 ${ticket} 成功`);
          // 获取所有可约天数
          // while (true) {
          const allMonth = await findAllMonth({
            depaCode: iteminfo.departmentCode,
            departmentVaccineId: iteminfo.departmentVaccineId,
            vaccCode: vaccineCode,
            vaccIndex: vaccineIndex,
          });
          if (allMonth?.data?.dateList?.length > 0) {
            const dates =
              allMonth.data.dateList?.reverse() || allMonth.data.dateList;
            for (const subscribeDate of dates) {
              const time = await getAllTimes({
                depaCode: iteminfo.departmentCode,
                departmentVaccineId: iteminfo.departmentVaccineId,
                vaccCode: vaccineCode,
                vaccIndex: vaccineIndex,
                subsribeDate: subscribeDate,
              });
              if (time?.data?.times?.data?.length > 0) {
                console.log(
                  `[sub:${moment(Date.now()).format(
                    "YYYY-MM-DD-HH:mm:ss"
                  )}] 尝试预约 ${subscribeDate} 中的 ${
                    time.data.times.data.length
                  } 个可用时间段`
                );
                const daytimes = time.data.times.data.sort(
                  (a, b) => Number(b?.maxSub || 0) - Number(a?.maxSub || 0)
                );
                for (const { id: subscirbeTime } of daytimes) {
                  // 尝试预约
                  let sum = 5;
                  while (sum > 0) {
                    const res = await toSub({
                      depaCode: iteminfo.departmentCode,
                      departmentVaccineId: iteminfo.departmentVaccineId,
                      vaccineCode,
                      vaccineIndex,
                      subscribeDate,
                      subscirbeTime,
                      ticket,
                    });
                    if (res.code == okCode) {
                      console.info(
                        `预约接种点 ${iteminfo?.departmentName} ${subscribeDate} 成功！！！`
                      );
                      return;
                    } else {
                      sum--;
                      console.log(res);
                      console.log(
                        `${subscribeDate}-${subscirbeTime} 预约失败2s正在重试`
                      );
                      await sleep(2000);
                    }
                  }
                }
              } else {
                console.log(`${subscribeDate} 无可预约时间`);
              }
            }
          } else {
            console.info(`本月无可预约天数，1秒后重试`);
            console.error(allMonth);
            // retry ?
          }
          // }
        } else {
          // retry ?
        }
      }
    } else {
      console.info(`获取接种点信息失败`);
      console.error(iteminfo);
      // retry ?
      return;
    }
  } catch (error) {
    console.log(error);
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}
