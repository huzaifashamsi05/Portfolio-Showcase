import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];

if (rawPort) {
  const port = Number(rawPort);
  if (Number.isNaN(port) || port <= 0) {
    console.error(`Invalid PORT value: "${rawPort}"`);
    process.exit(1);
  }

  app.listen(port, (err?: Error) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log("Server listening on port", port);
  });
}

export default app;
