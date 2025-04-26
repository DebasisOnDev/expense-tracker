import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateExpenseInput, UpdateExpenseInput } from "@expense-manager/types";
import ExpenseFilters from "./expense-filter";
import ExpenseCards from "./expense-cards";
import ExpenseFormDialog from "./expense-form-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import api from "@/lib/axios";
import { toast } from "sonner";
import useConfirmDialog from "@/hooks/use-confirm-dialog";
import { Expense } from "@/lib/types";

export default function ExpenseManager() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const queryClient = useQueryClient();
  const [ConfirmDialog, confirm] = useConfirmDialog(
    "Delete Expense",
    "Are you sure you want to delete this expense? This action cannot be undone."
  );

  const { data: expenses = [], isLoading } = useQuery<Expense[]>({
    queryKey: ["expenses"],
    queryFn: async () => {
      const response = await api.get("/api/expense");
      return response.data;
    },
  });

  console.log(expenses);

  const addMutation = useMutation({
    mutationFn: async (data: CreateExpenseInput) => {
      const response = await api.post("/api/expense", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setIsAddDialogOpen(false);
      toast.success("Expense added successfully");
    },
    onError: () => {
      toast.error("Failed to add expense");
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: UpdateExpenseInput;
    }) => {
      const response = await api.put(`/api/expense/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      setEditingExpense(null);
      toast.success("Expense updated successfully");
    },
    onError: () => {
      toast.error("Failed to update expense");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/api/expense/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete expense");
    },
  });

  const filteredExpenses = expenses.filter((expense: Expense) => {
    const matchesSearch = expense.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = categoryFilter
      ? expense.category.toLowerCase() === categoryFilter.toLowerCase()
      : true;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    ...new Set(expenses.map((expense: Expense) => expense.category)),
  ] as string[];

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto w-full">
      <ConfirmDialog />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <ExpenseFilters
          search={search}
          setSearch={setSearch}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          categories={categories}
        />
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <Button>
            <a className=" " href="/visualize">
              Visualize Expense
            </a>
          </Button>
          <ExpenseFormDialog
            onSubmit={(data) => addMutation.mutate(data as CreateExpenseInput)}
            isLoading={addMutation.isPending}
          />
        </Dialog>
      </div>
      <ExpenseCards
        expenses={filteredExpenses}
        isLoading={isLoading}
        onEdit={(expense) => setEditingExpense(expense)}
        onDelete={async (id) => {
          const ok = await confirm();
          if (ok) {
            deleteMutation.mutate(id);
          }
        }}
        editingExpense={editingExpense}
        onEditSubmit={(id, data) => editMutation.mutate({ id, data })}
        onEditCancel={() => setEditingExpense(null)}
        editLoading={editMutation.isPending}
      />
    </div>
  );
}
