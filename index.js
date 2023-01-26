import path from "path";
import config from "config";
import express from "express";
import mongoose from "mongoose";
import AuthRouter from "./router/AuthRouter.js";
import LinkRouter from "./router/LinkRouter.js";
import RedirectRouter from "./router/RedirectRouter.js";
mongoose.set("strictQuery", false);

const app = express();
const port = config.get("port") || 4001;

app.use(express.json());
app.use("/t", RedirectRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/link", LinkRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

mongoose
  .connect(config.get("db_url"))
  .then(() => console.log(`DB has benn connected!`))
  .then(() => {
    app.listen(port, () =>
      console.log(`Server is started on the port ${port}`)
    );
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });
