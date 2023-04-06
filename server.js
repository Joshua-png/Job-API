const http = require("http");
const app = require("./app");
const connectDB = require("./db/connect");

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

function start() {
  try {
    connectDB(process.env.MONGODB_URI);
    server.listen(PORT, () => {
      console.log(`Listenig on Port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
