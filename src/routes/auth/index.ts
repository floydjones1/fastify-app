import { FastifyPluginAsync } from "fastify";

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  const usersCollection = fastify.mongo.db?.collection("users");
  fastify.post("/login", async function (request, reply) {
    usersCollection?.findOne({ id: 1 }, (err, user) => {
      console.log("here");
      if (err || !user) {
        reply.status(500).send(err);
      }
      reply.status(200).send(user);
    });
    return reply;
  });

  fastify.post("/register", async function (request, reply) {
    return;
  });
};

export default example;
