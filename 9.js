const nodeSchedule = require("node-schedule");
const whileRun = require("./run9");
const baseConfig = {
  id: 3,
  vaccineCode: "8803",
  vaccineIndex: 1,
  depaVaccIds: [21280],
  departmentCode: "4301020013",
  departmentVaccineId: "21280",
  departmentName: "疾控中心",
  dates: ["2021-09-13", "2021-09-12"],
};

// whileRun(baseConfig, 21280);
console.log(`定时任务开启`);
nodeSchedule.scheduleJob("59 59 8 * * *", () => {
  whileRun(baseConfig, 21280);
});
