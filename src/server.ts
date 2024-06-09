import { connectDB } from "./database/database";
import { app } from "./app";
const port = process.env.PORT || 4000;

try {
  if (!process.env.CONNECTION)
    throw new Error("No connection string found in .env file");
  connectDB(process.env.CONNECTION);

  app.listen(port, () => {
    console.log(`Server listening on: http://localhost:${port}/`);
  });
} catch (error) {
  console.error(error);
}