import { ExpenseItem } from "../financeTracker/model";

interface Props {
  expenseIndex: number;
  monthlyIndex: number;
  expense: ExpenseItem;
  onExpenseChange: (
    monthlyIndex: number,
    expenseIndex: number,
    field: string,
    value: string | number
  ) => void;
  onRemoveExpense: (monthlyIndex: number, expenseIndex: number) => void;
}

export const Expense = ({
  expenseIndex,
  monthlyIndex,
  expense: { id, expenseName, expenseCost },
  onExpenseChange,
  onRemoveExpense,
}: Props) => {
  return (
    <div key={id} className="mb-2 flex gap-4 items-center">
      <div className="w-1/2">
        <label
          htmlFor={`expenseName-${monthlyIndex}-${expenseIndex}`}
          className="block text-gray-700"
        >
          Expense Name
        </label>
        <input
          id={`expenseName-${monthlyIndex}-${expenseIndex}`}
          name={`expenseName-${monthlyIndex}-${expenseIndex}`}
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
          value={expenseName}
          onChange={(e) =>
            onExpenseChange(
              monthlyIndex,
              expenseIndex,
              "expenseName",
              e.target.value
            )
          }
          required
        />
      </div>
      <div className="w-1/2">
        <label
          htmlFor={`expenseCost-${monthlyIndex}-${expenseIndex}`}
          className="block text-gray-700"
        >
          Expense Cost
        </label>
        <input
          id={`expenseCost-${monthlyIndex}-${expenseIndex}`}
          name={`expenseCost-${monthlyIndex}-${expenseIndex}`}
          type="number"
          step="0.01"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
          value={expenseCost}
          onChange={(e) =>
            onExpenseChange(
              monthlyIndex,
              expenseIndex,
              "expenseCost",
              parseFloat(e.target.value)
            )
          }
          required
        />
      </div>
      <button
        type="button"
        className="text-red-500 hover:text-red-700 self-end border border-gray-300 rounded cursor-pointer"
        onClick={() => onRemoveExpense(monthlyIndex, expenseIndex)}
      >
        Remove Expense
      </button>
    </div>
  );
};
