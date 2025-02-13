const dotenv = require("dotenv");
dotenv.config({
  path: ".env",
});
const cors = require("cors");
const express = require("express");
const connection = require("./utils/Connection");
const corsOptions = require("./config/Cors");

const userRouter = require("./routes/User");
const uploadRouter = require("./routes/Uploads");
const groupsRouter = require("./routes/Groups");
const expensesRouter = require("./routes/Expenses");
const { authenticateUser } = require("./middleware/Authentication");

connection(process.env.MONGO_URI);

const app = express();
const port = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/uploads", express.static("public/uploads"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/api/users", userRouter);
app.use("/api/uploads", authenticateUser, uploadRouter);
app.use("/api/groups", authenticateUser, groupsRouter);
app.use("/api/expenses", authenticateUser, expensesRouter);

app.listen(port, () => {
  console.log(`Running on port ${port}`);
});
