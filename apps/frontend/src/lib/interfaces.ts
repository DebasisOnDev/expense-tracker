/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  UserWithoutPasswordField as User,
  UpdateExpenseInput,
} from "@expense-manager/types";
import { Expense } from "./types";

export interface AuthContextProps {
  user?: User | null;
  loading: boolean;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => Promise<void>;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface UserEditDialogProps {
  disabled?: boolean;
}

export interface RefreshTokenQueueItem {
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}

export interface FormErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

export interface ExpenseCardsProps {
  expenses: Expense[];
  isLoading: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
  editingExpense: Expense | null;
  onEditSubmit: (id: string, data: UpdateExpenseInput) => void;
  onEditCancel: () => void;
  editLoading: boolean;
}

export interface ExpenseFiltersProps {
  search: string;
  setSearch: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  categories: string[];
}
