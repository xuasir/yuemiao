const nodeSchedule = require("node-schedule");
const createRequest = require("./request");
const whileRun = require("./run9");

// t星
const reqeust = createRequest({
  tk: "wxtoken:bd052f7aff88f07bc3c73acc57db1ae1_89c55db08237fbe93b194f0f9f302d7e",
  linkman_id: "2434517",
  month: "2021-09-01",
  userId: "4402013",
});

const baseConfig = {
  id: 3,
  vaccineCode: "8803",
  vaccineIndex: 1,
  departmentCode: "4301020013",
  departmentVaccineId: "21280",
  departmentName: "疾控中心",
  dates: ["2021-09-15", "2021-09-14", "2021-09-13", "2021-09-16"],
};

whileRun(reqeust, baseConfig);
// console.log(`定时任务开启`);
// nodeSchedule.scheduleJob("59 59 8 * * *", () => {
//   whileRun(reqeust, baseConfig);
// });
