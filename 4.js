const nodeSchedule = require("node-schedule");
const createRequest = require("./request");
const whileRun = require("./run9");

// 颜星
const reqeust = createRequest({
  tk: "wxtoken:3226396db2d1014ae42584c165b5b201_a922b05d9b3376a7303105b5f78f2c01",
  linkman_id: "18365969",
  month: "2021-09-01",
  userId: "19972693",
});

const baseConfig = {
  id: 3,
  vaccineCode: "8803",
  vaccineIndex: 1,
  departmentCode: "4301020013",
  departmentVaccineId: "21280",
  departmentName: "疾控中心",
  dates: ["2021-09-18", "2021-09-17"],
};

// whileRun(reqeust, baseConfig);
console.log(`定时任务开启`);
nodeSchedule.scheduleJob("0 0 9 * * *", () => {
  whileRun(reqeust, baseConfig);
});
