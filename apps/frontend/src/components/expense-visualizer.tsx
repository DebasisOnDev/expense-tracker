"use client";

import { useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartContainer } from "@/components/ui/chart";
import {
  BarChart3,
  PieChartIcon,
  LineChartIcon,
  DollarSign,
  Calendar,
  Tag,
  ArrowUpCircle,
} from "lucide-react";
import { Expense } from "@/lib/types";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#0088fe",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#a4de6c",
  "#d0ed57",
];

export default function ExpenseDashboard({
  expenses,
}: {
  expenses: Expense[];
}) {
  const [timeRange, setTimeRange] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(expenses.map((expense) => expense.category))
    );
    return uniqueCategories;
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    let filtered = [...expenses];

    if (timeRange !== "all") {
      const now = new Date();
      const pastDate = new Date();

      if (timeRange === "week") {
        pastDate.setDate(now.getDate() - 7);
      } else if (timeRange === "month") {
        pastDate.setMonth(now.getMonth() - 1);
      } else if (timeRange === "year") {
        pastDate.setFullYear(now.getFullYear() - 1);
      }

      filtered = filtered.filter((expense) => {
        const expenseDate = new Date(expense.createdAt);
        return expenseDate >= pastDate && expenseDate <= now;
      });
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (expense) => expense.category === selectedCategory
      );
    }

    return filtered;
  }, [expenses, timeRange, selectedCategory]);

  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [filteredExpenses]);

  const highestExpense = useMemo(() => {
    if (filteredExpenses.length === 0) return { amount: 0, title: "N/A" };
    return filteredExpenses.reduce(
      (max, expense) =>
        expense.amount > max.amount
          ? { amount: expense.amount, title: expense.title }
          : max,
      { amount: 0, title: "" }
    );
  }, [filteredExpenses]);

  const expensesByCategory = useMemo(() => {
    const groupedData: Record<string, number> = {};

    filteredExpenses.forEach((expense) => {
      if (groupedData[expense.category]) {
        groupedData[expense.category] += expense.amount;
      } else {
        groupedData[expense.category] = expense.amount;
      }
    });

    return Object.entries(groupedData).map(([name, value]) => ({
      name,
      value,
    }));
  }, [filteredExpenses]);

  const expensesByDate = useMemo(() => {
    const groupedData: Record<string, number> = {};

    filteredExpenses.forEach((expense) => {
      const date = format(parseISO(expense.createdAt), "yyyy-MM-dd");

      if (groupedData[date]) {
        groupedData[date] += expense.amount;
      } else {
        groupedData[date] = expense.amount;
      }
    });

    return Object.entries(groupedData)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredExpenses]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              {filteredExpenses.length} transactions
            </p>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Highest Expense
            </CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(highestExpense.amount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {highestExpense.title}
            </p>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              Unique expense categories
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <Tag className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="bar">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bar" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Bar Chart</span>
          </TabsTrigger>
          <TabsTrigger value="pie" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Pie Chart</span>
          </TabsTrigger>
          <TabsTrigger value="line" className="flex items-center gap-2">
            <LineChartIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Line Chart</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expenses by Category</CardTitle>
              <CardDescription>
                Breakdown of your expenses by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-auto">
                <ChartContainer
                  config={{
                    value: {
                      label: "Amount",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={expensesByCategory}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 60,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <RechartsTooltip
                        formatter={(value: number) => [
                          formatCurrency(value),
                          "Amount",
                        ]}
                      />
                      <Bar dataKey="value" fill="hsl(var(--chart-1))">
                        {expensesByCategory.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pie" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Distribution</CardTitle>
              <CardDescription>
                Percentage breakdown of your expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-auto">
                <ChartContainer
                  config={{
                    value: {
                      label: "Amount",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expensesByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expensesByCategory.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        formatter={(value: number) => [
                          formatCurrency(value),
                          "Amount",
                        ]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="line" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expense Trends</CardTitle>
              <CardDescription>
                How your expenses have changed over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-auto">
                <ChartContainer
                  config={{
                    amount: {
                      label: "Amount",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={expensesByDate}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 60,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <RechartsTooltip
                        formatter={(value: number) => [
                          formatCurrency(value),
                          "Amount",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="amount"
                        stroke="hsl(var(--chart-1))"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Expense Details</CardTitle>
          <CardDescription>
            Detailed breakdown of your {filteredExpenses.length} expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-5 bg-muted p-3 font-medium">
              <div>Title</div>
              <div>Category</div>
              <div>Amount</div>
              <div>Date</div>
              <div>Description</div>
            </div>
            <div className="divide-y">
              {filteredExpenses.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No expenses found for the selected filters
                </div>
              ) : (
                filteredExpenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="grid grid-cols-5 p-3 text-sm"
                  >
                    <div className="font-medium">{expense.title}</div>
                    <div>{expense.category}</div>
                    <div>{formatCurrency(expense.amount)}</div>
                    <div>
                      {format(new Date(expense.createdAt), "MMM dd, yyyy")}
                    </div>
                    <div
                      className="truncate max-w-[200px]"
                      title={expense.description}
                    >
                      {expense.description || "—"}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
