// lib/parallel.js
import Parallel from "parallel-web";

export const parallel = new Parallel({
  apiKey: process.env.PARALLEL_API_KEY,
});
