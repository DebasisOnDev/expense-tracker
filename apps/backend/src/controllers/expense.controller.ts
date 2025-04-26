import { Request, Response } from "express";
import { prisma } from "../lib/db";
import {
  createExpenseSchema,
  updateExpenseSchema,
} from "@expense-manager/types";

export const getAllExpense = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    const expenses = await prisma.expense.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.status(200).json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

// Add Expense
export const addExpense = async (req: Request, res: Response) => {
  try {
    const userId = req.user.userId;
    const data = createExpenseSchema.parse(req.body);

    const expense = await prisma.expense.create({
      data: {
        ...data,
        userId,
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error("Error adding expense:", error);
    res.status(400).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

// Edit Expense
export const editExpense = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.userId;
    const expenseId = req.params.id;
    const data = updateExpenseSchema.parse(req.body);

    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!expense || expense.userId !== userId) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    const updatedExpense = await prisma.expense.update({
      where: { id: expenseId },
      data,
    });

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

// Delete Expense
export const deleteExpense = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.userId;
    const expenseId = req.params.id;

    const expense = await prisma.expense.findUnique({
      where: { id: expenseId },
    });

    if (!expense || expense.userId !== userId) {
      res.status(403).json({ error: "Unauthorized" });
      return;
    }

    await prisma.expense.delete({
      where: { id: expenseId },
    });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};
