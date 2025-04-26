import ExpenseManager from "@/components/expense-manager";
export default function HomePage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start ">
      <ExpenseManager />
    </div>
  );
}
