require("dotenv").config();
const app = require("./app");
const { startConsumer } = require("./config/kafka");

const PORT = process.env.PORT || 4002;

async function startServer() {
  try {
    await startConsumer();

    app.listen(PORT, () => {
      console.log(`Profile service listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start Profile service:", error);
    process.exit(1);
  }
}

startServer();