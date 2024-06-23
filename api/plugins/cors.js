"use strict";

const fp = require("fastify-plugin");

module.exports = fp(async function (fastify, opts) {
  fastify.register(require("@fastify/cors"), {
    // origin: (origin, cb) => {
    //   const hostname = new URL(origin).hostname;
    //   if (hostname === "localhost") {
    //     //  Request from localhost will pass
    //     cb(null, true);
    //     return;
    //   }
    //   // Generate an error on other origins, disabling access
    //   cb(new Error("Not allowed"), false);
    // },
    origin: true,
  });
});
