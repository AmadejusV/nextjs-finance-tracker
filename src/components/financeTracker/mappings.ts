import {
  MonthlyExpenseReportClientData,
  YearlyExpenseReport,
  YearlyExpenseReportClientData,
} from "./model";

const monthOrder = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const sortMonthlyReports = (
  monthlyReports: MonthlyExpenseReportClientData[]
) => {
  return monthlyReports.sort(
    (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
  );
};

export const mapResponseToClientYearlyData = (
  yearlyExpensesData: YearlyExpenseReport[]
): YearlyExpenseReportClientData[] =>
  yearlyExpensesData.map(({ monthlyReports, ...yearlyReport }) => {
    const remappedMonthlyExpenses = monthlyReports.map(
      ({ expenses, salary = 0, ...monthlyReport }) => {
        const monthlyExpenses = expenses.reduce(
          (acc, { expenseCost }) => acc + expenseCost,
          0
        );
        const monthlyBalance = salary - monthlyExpenses;

        return {
          ...monthlyReport,
          monthlyExpenses,
          monthlyBalance,
          salary,
          expenses,
        };
      }
    );

    const yearlySalary = remappedMonthlyExpenses.reduce(
      (acc, { salary }) => acc + salary,
      0
    );

    const yearlyExpenses = remappedMonthlyExpenses.reduce(
      (acc, { monthlyExpenses }) => acc + monthlyExpenses,
      0
    );

    const yearlyBalance = yearlySalary - yearlyExpenses;

    return {
      ...yearlyReport,
      monthlyReports: sortMonthlyReports(remappedMonthlyExpenses),
      yearlySalary,
      yearlyExpenses,
      yearlyBalance,
    };
  });
