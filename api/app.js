"use strict";

const path = require("node:path");
const AutoLoad = require("@fastify/autoload");

// Pass --options via CLI arguments in command to enable these options.
const options = {};

module.exports = async function (fastify, opts) {
  // Connect to Postgres database
  fastify.register(require("@fastify/postgres"), {
    connectionString:
      "postgres://postgres:postgres@show-tracker-api-db-1:5432/postgres",
    // "postgres://postgres:postgres@localhost:5432/postgres",
  });

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
    options: Object.assign({}, opts),
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
    options: Object.assign({}, opts),
  });

  return fastify;
};

module.exports.options = options;
