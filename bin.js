#!/usr/bin/env node
const yParser = require("yargs-parser");
const config = require("./constants");
const once = require("./once");
const whileF = require("./while");
const nodeSchedule = require("node-schedule");

const args = yParser(process.argv.slice(2));
// 查询接种点信息 --> 查询是否可订阅并拿到凭证 --> 获取可预约时间，循环预约直到成功

let baseConfig = config._9jia;

if (args?.["2jia"]) {
  baseConfig = config._2jia;
}

if (args?.["4jia"]) {
  baseConfig = config._4jia;
}

let run = once;

if (args?.w) {
  run = whileF;
}

if (args?.i) {
  (async () => {
    for (const id of baseConfig.depaVaccIds) {
      await run(baseConfig, id);
    }
  })();
} else {
  console.log(`开始定时任务每三十秒，等待执行`);
  const rule = new nodeSchedule.RecurrenceRule();
  rule.second = [0, 15, 30, 45];
  nodeSchedule.scheduleJob(rule, () => {
    (async () => {
      for (const id of baseConfig.depaVaccIds) {
        await run(baseConfig, id);
      }
    })();
  });
}
