"use strict";

const fp = require("fastify-plugin");

/**
 * This plugins enables interaction with Ticketmaster API
 */
module.exports = fp(
  async function (fastify, opts, done) {
    fastify.decorate("ticketmaster", {
      getAttractionsByKeyword: async (request) => {
        const { TICKETMASTER_API_KEY } = fastify.env;

        try {
          const { data, status } = await fastify.axios.ticketmaster.get(
            `/discovery/v2/attractions.json
            ?apikey=${TICKETMASTER_API_KEY}
            &keyword=${request.params.keyword}`
          );

          const { _embedded } = data;

          return {
            attractions: _embedded?.attractions || [],
            status,
          };
        } catch (error) {
          throw error;
        }
      },
      getEventsByAttractionId: async (request) => {
        const { TICKETMASTER_API_KEY } = fastify.env;

        try {
          // const { data, status } = await fastify.axios.ticketmaster.get(
          //   `/discovery/v2/events.json
          //   ?apikey=${TICKETMASTER_API_KEY}
          //   &attractionId=${request.params.attractionId}
          //   &geoPoint=dr5rkqr
          //   &radius=500`
          // );

          const { data, status } = await fastify.axios.ticketmaster.get(
            `/discovery/v2/events.json
            ?apikey=${TICKETMASTER_API_KEY}
            &attractionId=${request.params.attractionId}
            &postalCode=11217`
          );

          const { _embedded } = data;

          return {
            events: _embedded?.events || [],
            status,
          };
        } catch (error) {
          throw error;
        }
      },
    });

    done();
  },
  {
    name: "plugin-ticketmaster",
    dependencies: ["plugin-env", "plugin-axios"],
  }
);
