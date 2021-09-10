const moment = require("moment");

const okCode = "0000";

module.exports = async function main(request, config) {
  const {
    vaccineCode,
    vaccineIndex,
    departmentCode,
    departmentVaccineId,
    departmentName,
    dates,
  } = config;
  // 查询接种点信息
  try {
    let ticket;
    // 查询是否可以订阅和票证
    const sub = await request.isCanSub({
      id: departmentVaccineId,
      depaCode: departmentCode,
      vaccineCode,
    });
    if (sub?.data?.ticket) {
      ticket = sub?.data?.ticket;
      console.info(`获取接种点 ${departmentName} 票证 ${ticket} 成功`);
      while (true) {
        // 保存票证;
        // 获取所有可约天数
        for (const subscribeDate of dates) {
          const time = await request.getAllTimes({
            depaCode: departmentCode,
            departmentVaccineId,
            vaccCode: vaccineCode,
            vaccIndex: vaccineIndex,
            subsribeDate: subscribeDate,
          });
          if (time?.data?.times?.data?.length > 0) {
            console.log(
              `尝试预约 ${subscribeDate} 中的 ${time.data.times.data.length} 个可用时间段`
            );
            const daytimes = time.data.times.data.sort(
              (a, b) => Number(b?.maxSub || 0) - Number(a?.maxSub || 0)
            );
            for (const { id: subscirbeTime } of daytimes) {
              // 尝试预约
              let sum = 1;
              while (sum > 0) {
                const res = await request.toSub({
                  depaCode: departmentCode,
                  departmentVaccineId,
                  vaccineCode,
                  vaccineIndex,
                  subscribeDate,
                  subscirbeTime,
                  ticket,
                });
                if (res.code == okCode) {
                  console.info(
                    `[sub:${moment(Date.now()).format(
                      "YYYY-MM-DD-HH:mm:ss"
                    )}]预约接种点 ${departmentName} ${subscribeDate} 成功！！！`
                  );
                  console.log(res);
                  console.log(`预约编号：${res?.data?.subNo}`);
                  return;
                } else {
                  sum--;
                  console.log(res);
                  console.log(
                    `${subscribeDate}-${subscirbeTime} 预约失败3s正在重试`
                  );
                  await sleep(3000);
                }
              }
            }
          } else {
            console.log(`${subscribeDate} 无可预约时间`);
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}
