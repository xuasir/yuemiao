const nodeSchedule = require("node-schedule");
const createRequest = require("./request");
const whileRun = require("./run9");

// test
const reqeust = createRequest({
  tk: "wxtoken:88aff3450ce810d1d7203aac66e5ed4a_c087631e70904bf837b124f86b213765",
  linkman_id: "9271059",
  month: "2021-09-01",
  userId: "10738861",
});

const baseConfig = {
  id: 3,
  vaccineCode: "8803",
  vaccineIndex: 1,
  departmentCode: "4301020013",
  departmentVaccineId: "21280",
  departmentName: "疾控中心",
  dates: ["2021-09-17"],
};

reqeust
  .findAllMonth({
    depaCode: baseConfig.departmentCode,
    departmentVaccineId: baseConfig.departmentVaccineId,
    vaccCode: baseConfig.vaccineCode,
    vaccIndex: baseConfig.vaccineIndex,
  })
  .then((allMonth) => {
    console.log(allMonth?.data?.dateList);
  });

// whileRun(reqeust, baseConfig);
// console.log(`定时任务开启`);
// nodeSchedule.scheduleJob("59 59 8 * * *", () => {
//   whileRun(reqeust, baseConfig);
// });
