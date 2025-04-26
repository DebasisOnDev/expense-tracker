import type {
  CreateExpenseInput,
  UpdateExpenseInput,
} from "@expense-manager/types";
export type Expense = CreateExpenseInput & {
  id: string;
  createdAt: string;
  userId: string;
};

export interface ExpenseFormDialogProps {
  expense?: Expense;
  onSubmit: (data: CreateExpenseInput | UpdateExpenseInput) => void;
  isLoading?: boolean;
}

export interface ExpenseListProps {
  expenses: Expense[];
  isLoading: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  editingExpense: Expense | null;
  onEditSubmit: (id: string, data: UpdateExpenseInput) => void;
  onEditCancel: () => void;
  editLoading: boolean;
}
