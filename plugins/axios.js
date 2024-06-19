"use strict";

const fp = require("fastify-plugin");

module.exports = fp(
  async function (fastify, opts) {
    const { SEATGEEK_CLIENT_ID, SEATGEEK_SECRET } = fastify.env;

    fastify.register(require("fastify-axios"), {
      clients: {
        seatGeek: {
          baseURL: "https://api.seatgeek.com/2",
          auth: {
            username: SEATGEEK_CLIENT_ID,
            passsword: SEATGEEK_SECRET,
          },
        },
        ticketmaster: {
          baseURL: "https://app.ticketmaster.com",
        },
      },
    });
  },
  {
    name: "plugin-axios",
    dependencies: ["plugin-env"],
  }
);
