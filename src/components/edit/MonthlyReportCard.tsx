import { MonthlyExpenseReport } from "../financeTracker/model";
import { Expense } from "./Expense";

interface Props {
  monthlyIndex: number;
  monthlyReport: MonthlyExpenseReport;
  onRemoveMonth: (monthlyIndex: number) => void;
  onRemoveExpense: (monthlyIndex: number, expenseIndex: number) => void;
  onMonthlyReportChange: (
    index: number,
    field: string,
    value: string | number
  ) => void;
  onExpenseChange: (
    monthlyIndex: number,
    expenseIndex: number,
    field: string,
    value: string | number
  ) => void;
}

export const MonthlyReportCard = ({
  monthlyIndex,
  monthlyReport: { month, expenses, salary },
  onExpenseChange,
  onMonthlyReportChange,
  onRemoveExpense,
  onRemoveMonth,
}: Props) => {
  return (
    <section className="mb-6 p-4 border border-gray-300 rounded-lg">
      <header className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold text-gray-700">Month: {month}</h3>
        <button
          type="button"
          className="text-red-500 hover:text-red-700 border rounded py-1 px-2 cursor-pointer border-gray-300"
          onClick={() => onRemoveMonth(monthlyIndex)}
        >
          Remove Month
        </button>
      </header>
      <div className="mb-2">
        <label
          htmlFor={`salary-${monthlyIndex}`}
          className="block text-gray-700"
        >
          Monthly Salary
        </label>
        <input
          id={`salary-${monthlyIndex}`}
          name={`salary-${monthlyIndex}`}
          type="number"
          step="0.01"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
          value={salary}
          onChange={(e) =>
            onMonthlyReportChange(
              monthlyIndex,
              "salary",
              parseFloat(e.target.value)
            )
          }
          required
        />
      </div>
      {expenses.map((expense, expenseIndex) => (
        <Expense
          key={expense.id}
          expense={expense}
          expenseIndex={expenseIndex}
          monthlyIndex={monthlyIndex}
          onExpenseChange={onExpenseChange}
          onRemoveExpense={onRemoveExpense}
        />
      ))}
    </section>
  );
};
