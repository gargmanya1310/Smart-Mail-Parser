import { Queue } from "bullmq";

const emailQueue = new Queue("email");

async function addJobs() {
  await emailQueue.add("example", {
    data: "this is some data",
  });
  console.log("Added job to queue successfully");
}
export { addJobs };
