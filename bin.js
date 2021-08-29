#!/usr/bin/env node
const yParser = require("yargs-parser");
const config = require("./constants");
const run = require("./main");

const args = yParser(process.argv.slice(2));
// 查询接种点信息 --> 查询是否可订阅并拿到凭证 --> 获取可预约时间，循环预约直到成功

let baseConfig = config._9jia;

if (args?.["2jia"]) {
  baseConfig = config._2jia;
}

if (args?.["4jia"]) {
  baseConfig = config._4jia;
}

(async () => {
  for (const id of baseConfig.depaVaccIds) {
    await run(baseConfig, id);
  }
})();
