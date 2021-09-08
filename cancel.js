const createRequest = require("./request.js");

const request = createRequest({
  tk: "wxtoken:88aff3450ce810d1d7203aac66e5ed4a_9ecc964a1751e482e7d4b0dfc24010d8",
  // linkman_id: "9271059"
});

(async () => {
  const res = await request.cancel();
  console.log(res);
})();
