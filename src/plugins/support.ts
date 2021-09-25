import fp from "fastify-plugin";
import fastifyJwt from "fastify-jwt";
import { fastifyRequestContextPlugin } from "fastify-request-context";
import * as mongoose from "mongoose";
import { UserSchema, User } from "../mongoose/schemas";

export interface SupportPluginOptions {
  thing: string;
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
  fastify.register(fastifyRequestContextPlugin);

  // setup jwt
  fastify.register(fastifyJwt, {
    secret: "supersecret",
    sign: { expiresIn: "15 minute" },
  });

  fastify.decorate("generateJWT", (email: string) => {
    return fastify.jwt.sign({ email });
  });

  // setup mongoose
  const db = await mongoose
    .connect("mongodb://root:example@localhost:27017", {
      dbName: "myDB",
    })
    .then((conn) => {
      fastify.decorate("store", {
        User: conn.model("User", UserSchema),
        db: conn,
      });

      return conn;
    })
    .catch(console.error);

  if (!db) {
    throw Error("cannot connect to database");
  }
});

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
  export interface FastifyInstance {
    generateJWT: (email: string) => string;
    store: {
      User: mongoose.Model<User>;
      db: typeof mongoose;
    };
  }
}

declare module "fastify-request-context" {
  interface RequestContextData {
    user: User;
  }
}
