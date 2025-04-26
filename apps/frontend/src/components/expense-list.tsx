import { UpdateExpenseInput } from "@expense-manager/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Edit, Trash } from "lucide-react";
import ExpenseFormDialog from "./expense-form-dialog";
import { ExpenseListProps } from "@/lib/types";

export default function ExpenseList({
  expenses,
  isLoading,
  onEdit,
  onDelete,
  editingExpense,
  onEditSubmit,
  onEditCancel,
  editLoading,
}: ExpenseListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No expenses found
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{expense.title}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>${expense.amount}</TableCell>
                <TableCell>{expense.description || "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog
                      open={editingExpense?.id === expense.id}
                      onOpenChange={(open) => !open && onEditCancel()}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
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
                      size="sm"
                      onClick={() => onDelete(expense.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
