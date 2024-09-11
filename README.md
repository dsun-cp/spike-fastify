# spike-fastify

## https://github.com/fastify/fastify/issues/5632

To reproduce

1. `npm install`
1. `node index`
1. curl
   ```
   curl --location --request PATCH 'http://localhost:3000/invalid' \
   -H 'Content-Type: application/json' \
   --data '{
       "status": "bar",
       "statusReason": "baz"
   }'
   ```

Expected:

```
{
    "hello": "world"
}
```

Actual:

```
{
    "statusCode": 400,
    "code": "FST_ERR_VALIDATION",
    "error": "Bad Request",
    "message": "body/status must be equal to one of the allowed values, body must have required property 'statusReason', body must match exactly one schema in oneOf"
}
```
