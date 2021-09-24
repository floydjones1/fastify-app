import fp from "fastify-plugin";
import fastifyJwt from "fastify-jwt";
import mongo from "fastify-mongodb";

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

  fastify.register(mongo, {
    forceClose: true,
    url: "mongodb://root:example@localhost:27017",
    database: "database",
    auth: {
      password: "example",
      username: "root",
    },
  });
});

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
  export interface FastifyInstance {
    someSupport(): string;
    // jwtVerify(): Function
  }
}
