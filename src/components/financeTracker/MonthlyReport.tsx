import { MonthlyExpenseReportClientData } from "./model";

interface Props {
  monthlyReport: MonthlyExpenseReportClientData;
}

export const MonthlyReport = ({ monthlyReport }: Props) => {
  return (
    <article className="p-3 bg-gray-100 rounded-lg">
      <header className="mb-2">
        <h4 className="text-lg font-medium text-gray-600">
          Month: {monthlyReport.month}
        </h4>
      </header>
      <section className="flex gap-3 mb-2">
        <p className="text-gray-600">
          Salary:{" "}
          <span className="text-green-600">
            {(monthlyReport.salary || 0).toFixed(2)}
          </span>
        </p>
        <p className="text-gray-600">
          Expenses sum:{" "}
          <span className="text-red-600">
            {monthlyReport.monthlyExpenses.toFixed(2)}
          </span>
        </p>
        <p className="text-gray-600">
          Balance:{" "}
          <span
            className={
              monthlyReport.monthlyBalance > 0
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {monthlyReport.monthlyBalance.toFixed(2)}
          </span>
        </p>
      </section>
      <ul className="list-disc list-inside">
        {monthlyReport.expenses.map((expense) => (
          <li key={expense.id} className="text-gray-600">
            {expense.expenseName}: {expense.expenseCost.toFixed(2)}
          </li>
        ))}
      </ul>
    </article>
  );
};
