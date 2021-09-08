const nodeSchedule = require("node-schedule");
const createRequest = require("../request");
const whileRun = require("../run9");

const reqeust = createRequest({
  tk: "wxtoken:88aff3450ce810d1d7203aac66e5ed4a_9ecc964a1751e482e7d4b0dfc24010d8",
  linkman_id: "9271059",
  month: "2021-09-01",
});

const baseConfig = {
  id: 52,
  vaccineCode: 8806,
  vaccineIndex: 1,
  departmentCode: "4301810007",
  departmentVaccineId: "17152",
  departmentName: "浏阳",
  dates: ["2021-09-23"],
};

whileRun(reqeust, baseConfig);
// console.log(`定时任务开启`);
// nodeSchedule.scheduleJob("59 59 8 * * *", () => {
//   whileRun(reqeust, baseConfig, 16153);
// });
