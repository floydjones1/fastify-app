import { FastifyPluginAsync } from "fastify";
import { RegisterRequest, User } from "./types";
import { Static } from "@sinclair/typebox";
import * as bcrypt from "bcrypt";

const saltRounds = 10;

type RegisterRequest = Static<typeof RegisterRequest>;

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post("/login", async function (request, reply) {
    return reply;
  });

  fastify.post<{ Body: Static<typeof RegisterRequest> }>(
    "/register",
    {
      schema: {
        body: RegisterRequest,
        response: {
          201: User,
        },
      },
    },
    async function (request, reply) {
      const { body } = request;
      const hashPass = bcrypt.hashSync(body.password, saltRounds);
      const user = new fastify.store.User({
        ...body,
        password: hashPass,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      user.save((err, res) => {
        if (err) {
          return reply.status(500).send(err.message);
        }
        return reply.status(201).send(res);
      });
    }
  );
};

export default example;
