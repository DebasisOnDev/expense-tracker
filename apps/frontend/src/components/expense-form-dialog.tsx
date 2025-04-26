import {
  CreateExpenseInput,
  UpdateExpenseInput,
  createExpenseSchema,
  updateExpenseSchema,
} from "@expense-manager/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ExpenseFormDialogProps } from "@/lib/types";

export default function ExpenseFormDialog({
  expense,
  onSubmit,
  isLoading,
}: ExpenseFormDialogProps) {
  const form = useForm<CreateExpenseInput | UpdateExpenseInput>({
    resolver: zodResolver(expense ? updateExpenseSchema : createExpenseSchema),
    defaultValues: {
      title: expense?.title || "",
      description: expense?.description || "",
      amount: expense?.amount || 0,
      category: expense?.category || "",
    },
  });

  const handleSubmit = (data: CreateExpenseInput | UpdateExpenseInput) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{expense ? "Edit Expense" : "Add Expense"}</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end gap-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Loading..."
                : expense
                ? "Save Changes"
                : "Add Expense"}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  );
}
