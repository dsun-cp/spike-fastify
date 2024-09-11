import Fastify from "fastify";
const fastify = Fastify({
  logger: true,
});

fastify.addSchema({
  $id: "#Fpm9676PatchRequest",
  description: "FPM-9676 Patch Request",
  oneOf: [
    {
      type: "object",
      properties: {
        userFeeNotNullable: {
          description: "fee number",
          type: "integer",
        },
        userFeeWorking: {
          description: "use anyOf works",
          anyOf: [
            {
              type: "integer",
            },
            {
              type: "null",
            },
          ],
        },
        userFeeBad: {
          description: "0 value would fail because ajv typeCoersion in fastify",
          oneOf: [
            {
              type: "integer",
            },
            {
              type: "null",
            },
          ],
        },
      },
      additionalProperties: false,
    },
  ],
});

fastify.patch("/fpm-9676", {
  handler: async () => {
    return { hello: "world" };
  },
  schema: {
    body: {
      $ref: "#Fpm9676PatchRequest",
    },
  },
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
