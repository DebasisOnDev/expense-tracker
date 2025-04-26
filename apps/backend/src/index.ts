import "dotenv/config";
import express from "express";
import cors from "cors";
import { authRouter } from "./routes/auth.route";
import { expenseRouter } from "./routes/expense.route";
import { errorHandler } from "./middlewares/error";

const app = express();
const PORT = process.env.BACKEND_APP_PORT || 3001;

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/test", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});
app.use("/api/auth", authRouter);
app.use("/api/expense", expenseRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
