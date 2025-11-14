import { d as defineEventHandler, u as useRuntimeConfig, r as readBody, c as createError } from '../../runtime.mjs';
import 'node:http';
import 'node:https';
import 'node:zlib';
import 'node:stream';
import 'node:buffer';
import 'node:util';
import 'node:url';
import 'node:net';
import 'node:fs';
import 'node:path';
import 'fs';
import 'path';
import 'vue';
import 'consola/core';
import 'ipx';

const apiPost = defineEventHandler(async (event) => {
  useRuntimeConfig();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.DIRECTUS_API_KEY}`,
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*"
  };
  const body = await readBody(event);
  const { payload, collection } = body;
  try {
    const response = await fetch(process.env.CMS_URL + "/items/" + collection, {
      method: "POST",
      headers,
      body: JSON.stringify(payload)
    });
    return response;
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      message: "Error interacting with Directus API"
    });
  }
});

export { apiPost as default };
//# sourceMappingURL=api-post.mjs.map
