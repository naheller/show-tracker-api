const fp = require("fastify-plugin");
const testEvents = require("./test-events.json");

module.exports = fp(async function (fastify, opts) {
  fastify.get("/events/:performerSlug", async function (request, reply) {
    try {
      const { data, status } = await fastify.axios.seatGeek.get(
        `/events?performers.slug=${request.params.performerSlug}`
      );

      reply.code(status || 200).send(data);
    } catch (err) {
      reply.code(err.status || 500).send(err);
    }
  });

  fastify.get("/tm/attractions/:keyword", async function (request, reply) {
    try {
      const { attractions, status } =
        await fastify.ticketmaster.getAttractionsByKeyword(request);
      reply.code(status || 200).send({ attractions });
    } catch (error) {
      reply.code(error.status || 500).send(error);
    }
  });

  fastify.get("/tm/events/:attractionId", async function (request, reply) {
    const client = await fastify.pg.connect();
    try {
      // const { events, status } =
      //   await fastify.ticketmaster.getEventsByAttractionId(request);
      const events = testEvents.events;

      events.forEach(async (event) => {
        console.log("inserting event name", event.name);
        // await client.query("INSERT INTO shows(name) VALUES($1);", [event.name]);
        await client.query(
          `
          insert into shows(name, idtm) values ($1, $2)
          on conflict (idtm) do nothing;`,
          [event.name, event.id]
        );
      });

      // reply.code(status || 200).send({ events });
      reply.code(200).send({ events });
    } catch (error) {
      reply.code(error.status || 500).send(error);
    } finally {
      client.release();
    }
  });
});
