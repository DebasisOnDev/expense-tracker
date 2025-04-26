import { useQuery } from "@tanstack/react-query";
import ExpenseDashboard from "@/components/expense-visualizer";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";

interface Expense {
  id: string;
  userId: string;
  amount: number;
  title: string;
  category: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const Visualizer = () => {
  const { data: expenses = [], isLoading } = useQuery<Expense[]>({
    queryKey: ["expenses"],
    queryFn: async () => {
      const response = await api.get("/api/expense");
      return response.data;
    },
  });
  return (
    <main className=" p-6 min-h-screen ">
      <h1 className="text-3xl font-bold mb-4">Expense Analytics Dashboard</h1>
      <a className=" p-2  font-medium text-blue-500 underline" href="/home">
        Go back
      </a>
      {isLoading ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <Skeleton className="h-[120px] w-full" />
            <Skeleton className="h-[120px] w-full" />
            <Skeleton className="h-[120px] w-full" />
          </div>
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      ) : (
        <ExpenseDashboard expenses={expenses} />
      )}
    </main>
  );
};

export default Visualizer;
