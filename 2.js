const nodeSchedule = require("node-schedule");
const createRequest = require("./request");
const whileRun = require("./run9");

// 菜婉容
const reqeust = createRequest({
  tk: "wxtoken:9b5fa3afac10a424c5f6222134a5e08b_0632621c37398cfa18e0a26212f8c6fe",
  linkman_id: "2434685",
  month: "2021-09-01",
  userId: "4402163",
});

const baseConfig = {
  id: 3,
  vaccineCode: "8803",
  vaccineIndex: 1,
  departmentCode: "4301020013",
  departmentVaccineId: "21280",
  departmentName: "疾控中心",
  dates: ["2021-09-17", "2021-09-18"],
};

// whileRun(reqeust, baseConfig);
console.log(`定时任务开启`);
nodeSchedule.scheduleJob("59 59 8 * * *", () => {
  whileRun(reqeust, baseConfig);
});
