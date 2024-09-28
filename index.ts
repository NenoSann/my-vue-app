import { Worker } from "node:worker_threads";
const worker = new Worker("./worker.js");
worker.on("message", (data) => {
    console.log(data);
});
worker.postMessage(
    JSON.stringify({
        type: "read",
        limit: 1,
    }),
);
