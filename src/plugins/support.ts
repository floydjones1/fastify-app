import fp from "fastify-plugin";
import fastifyJwt from "fastify-jwt";
import * as mongoose from "mongoose";
import { UserSchema, User } from "../mongoose/schemas";

export interface SupportPluginOptions {
  thing: string;
  // Specify Support plugin options here
}

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default fp<SupportPluginOptions>(async (fastify, opts) => {
  // console.log(opts)
  // fastify.decorate('someSupport', function (foo: number) {
  //   return 'hugs'
  // })
  fastify.register(fastifyJwt, { secret: "supersecret" });
  const db = await mongoose
    .connect("mongodb://root:example@localhost:27017", {
      dbName: "myDB",
    })
    .then((conn) => {
      fastify.decorate("store", {
        User: conn.model("User", UserSchema),
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
    someSupport(): string;
    store: {
      User: mongoose.Model<User>;
    };
  }
}
