"use client";

import type { UpdateExpenseInput } from "@expense-manager/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash } from "lucide-react";
import ExpenseFormDialog from "./expense-form-dialog";
import { ExpenseCardsProps } from "@/lib/interfaces";

export default function ExpenseCards({
  expenses,
  isLoading,
  onEdit,
  onDelete,
  editingExpense,
  onEditSubmit,
  onEditCancel,
  editLoading,
}: ExpenseCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      {isLoading ? (
        <div className="col-span-full text-center text-muted-foreground py-8">
          Loading...
        </div>
      ) : expenses.length === 0 ? (
        <div className="col-span-full text-center text-muted-foreground py-8">
          No expenses found
        </div>
      ) : (
        expenses.map((expense) => (
          <Card
            key={expense.id}
            className="flex flex-col min-h-[260px] w-full min-w-0"
          >
            <CardContent className="pt-6 flex-grow overflow-hidden">
              <h3 className="text-lg font-semibold truncate">
                {expense.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                Category: {expense.category}
              </p>
              <p className="text-sm text-muted-foreground">
                Amount: ${expense.amount.toFixed(2)}
              </p>
              <div className="text-sm text-muted-foreground">
                <span>Description: </span>
                <span className="line-clamp-2">
                  {expense.description || "-"}
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 mt-auto">
              <Dialog
                open={editingExpense?.id === expense.id}
                onOpenChange={(open) => !open && onEditCancel()}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(expense)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <ExpenseFormDialog
                  expense={expense}
                  onSubmit={(data) =>
                    onEditSubmit(expense.id, data as UpdateExpenseInput)
                  }
                  isLoading={editLoading}
                />
              </Dialog>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => onDelete(expense.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
}
