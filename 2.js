const nodeSchedule = require("node-schedule");
const createRequest = require("./request");
const whileRun = require("./run9");

const reqeust = createRequest({
  tk: "wxtoken:8e7a5dd7ee7a545f9a2bd13c2c703ba1_fe1365cdd22a6574b8d65f912d2af856",
  linkman_id: "7022656",
  month: "2021-09-01",
  userId: "8444313",
});

const baseConfig = {
  id: 3,
  vaccineCode: "8803",
  vaccineIndex: 1,
  departmentCode: "4301020013",
  departmentVaccineId: "21280",
  departmentName: "疾控中心",
  dates: ["2021-09-15", "2021-09-14"],
};

// whileRun(reqeust, baseConfig);
console.log(`定时任务开启`);
nodeSchedule.scheduleJob("59 59 8 * * *", () => {
  whileRun(reqeust, baseConfig);
});
