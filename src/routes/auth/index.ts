import { FastifyPluginAsync } from "fastify"

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  console.log(opts)
  fastify.get('/', async function (request, reply) {
    fastify.
    return 'this is an login'
  })
}

export default example;
