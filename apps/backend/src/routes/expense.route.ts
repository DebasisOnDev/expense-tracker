import { Router } from "express";
import {
  addExpense,
  editExpense,
  deleteExpense,
  getAllExpense,
} from "../controllers/expense.controller";
import { authenticate } from "../middlewares/auth";

const router: Router = Router();

router.get("/", authenticate, getAllExpense);
router.post("/", authenticate, addExpense);
router.put("/:id", authenticate, editExpense);
router.delete("/:id", authenticate, deleteExpense);

export { router as expenseRouter };
