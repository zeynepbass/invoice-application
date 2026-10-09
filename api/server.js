const { port } = require("./config/env");
const connectDatabase = require("./config/db");
const app = require("./app");

const start = async () => {
  try {
    await connectDatabase();
    app.listen(port, () => {
      console.log(`API listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the API:", error.message);
    process.exit(1);
  }
};

start();
