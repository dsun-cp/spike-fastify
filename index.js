import Fastify from "fastify";
const fastify = Fastify({
  logger: true,
});

fastify.addSchema({
  $id: "#PatchRequestBroken",
  description: "Request to update",
  oneOf: [
    {
      type: "object",
      required: ["status"],
      properties: {
        status: {
          enum: ["foo"],
        },
      },
      additionalProperties: false,
    },
    {
      type: "object",
      required: ["status", "statusReason"],
      properties: {
        status: {
          enum: ["bar"],
        },
        statusReason: {
          enum: ["baz"],
        },
      },
      additionalProperties: false,
    },
  ],
});

fastify.patch("/invalid", {
  handler: async () => {
    return { hello: "world" };
  },
  schema: {
    body: {
      $ref: "#PatchRequestBroken",
    },
  },
});

fastify.addSchema({
  $id: "#PatchRequestWorking",
  description: "Request to update",
  oneOf: [
    {
      type: "object",
      required: ["status", "statusReason"],
      properties: {
        status: {
          enum: ["bar"],
        },
        statusReason: {
          enum: ["baz"],
        },
      },
      additionalProperties: false,
    },
    {
      type: "object",
      required: ["status"],
      properties: {
        status: {
          enum: ["foo"],
        },
      },
      additionalProperties: false,
    },
  ],
});

fastify.patch("/valid", {
  handler: async () => {
    return { hello: "world" };
  },
  schema: {
    body: {
      $ref: "#PatchRequestWorking",
    },
  },
});

// Run the server!
try {
  await fastify.listen({ port: 3000 });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
