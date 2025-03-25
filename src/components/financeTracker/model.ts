export interface ExpenseItem {
  id: string;
  expenseName: string;
  expenseCost: number;
}

export interface MonthlyExpenseReport {
  id: string;
  month: string;
  salary: number;
  expenses: ExpenseItem[];
}

export interface YearlyExpenseReport {
  id: string;
  year: number;
  monthlyReports: MonthlyExpenseReport[];
}

export interface MonthlyExpenseReportClientData {
  id: string;
  month: string;
  salary: number;
  monthlyExpenses: number;
  monthlyBalance: number;
  expenses: ExpenseItem[];
}

export interface YearlyExpenseReportClientData {
  id: string;
  year: number;
  yearlySalary: number;
  yearlyExpenses: number;
  yearlyBalance: number;
  monthlyReports: MonthlyExpenseReportClientData[];
}

export interface AddUpdateYearRequestData {
  month: string;
  expenseName: string;
  year: number;
  expenseCost: number;
  salary: number;
}

export const MONTHS = [
  { value: "January", label: "January" },
  { value: "February", label: "February" },
  { value: "March", label: "March" },
  { value: "April", label: "April" },
  { value: "May", label: "May" },
  { value: "June", label: "June" },
  { value: "July", label: "July" },
  { value: "August", label: "August" },
  { value: "September", label: "September" },
  { value: "October", label: "October" },
  { value: "November", label: "November" },
  { value: "December", label: "December" },
];
