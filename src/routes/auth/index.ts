import { FastifyPluginAsync } from "fastify";
import { LoginOpts, LoginBody, RegisterOpts, RegisterBody } from "./types";
import * as bcrypt from "bcrypt";

const saltRounds = 10;

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{ Body: LoginBody }>(
    "/login",
    LoginOpts,
    async (request, reply) => {
      const { email, password } = request.body;
      const user = await fastify.store.User.findOne({ email }).exec();
      if (!user) {
        return reply.status(404).send();
      }

      bcrypt.compare(password, user.password, (err, isValid) => {
        if (err || !isValid)
          return reply.getHttpError(401, "invalid credentials");

        const token = fastify.generateJWT(user.email);
        reply.status(200).send({ token, ...user.toObject() });
      });

      return reply;
    }
  );

  fastify.post<{ Body: RegisterBody }>(
    "/register",
    RegisterOpts,
    (request, reply) => {
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
        const token = fastify.generateJWT(user.email);
        return reply.status(201).send({ ...res, token });
      });
    }
  );
};

export default example;
