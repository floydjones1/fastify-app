import { FastifyPluginAsync } from "fastify";

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.addHook("onRequest", async (request, reply) => {
    try {
      const data = await request.jwtVerify();
      const thing = data.valueOf() as { email: string };
      if (!thing.hasOwnProperty("email")) {
        reply.send(new Error("not valid jwt credentials"));
      }

      const user = await fastify.store.User.findOne({
        email: thing.email,
      }).exec();
      if (!user) return reply.send(new Error("cannot find user"));

      request.requestContext.set("user", user.toObject());
    } catch (err) {
      reply.send(err);
    }
  });

  fastify.addHook("preHandler", async (request, reply) => {});

  fastify.get("/", async function (request, reply) {
    console.log(!request.requestContext.get("no exist"));
    return request.requestContext.get("user");
  });
};

export default example;
