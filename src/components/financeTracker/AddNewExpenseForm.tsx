"use client";
import { FormEvent, useEffect, useState } from "react";
import {
  AddUpdateYearRequestData,
  ExpenseItem,
  MonthlyExpenseReport,
  MONTHS,
  YearlyExpenseReport,
} from "./model";
import {
  addData,
  getDataByYear,
  DB_STORE_NAME,
  getAllData,
  openDatabase,
  updateData,
} from "@/indexedDb/indexedDb";
import "@/components/styles.css";

const generateUniqueId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

const generateExpenseItem = (
  expenseName: string,
  expenseCost: number
): ExpenseItem => ({
  id: generateUniqueId(),
  expenseName,
  expenseCost,
});

const updateMonthlyReport = (
  report: MonthlyExpenseReport,
  salary: number,
  expenseName: string,
  expenseCost: number
): MonthlyExpenseReport => ({
  ...report,
  salary,
  expenses: [...report.expenses, generateExpenseItem(expenseName, expenseCost)],
});

const addNewExpense = async (
  objectStore: IDBObjectStore,
  foundYearData: YearlyExpenseReport,
  { month, salary, expenseName, expenseCost }: AddUpdateYearRequestData
) => {
  const monthHasData = foundYearData.monthlyReports.some(
    (fmr) => fmr.month === month
  );

  const newMonthlyReports = monthHasData
    ? foundYearData.monthlyReports.map((report) =>
        report.month === month
          ? updateMonthlyReport(report, salary, expenseName, expenseCost)
          : report
      )
    : [
        ...foundYearData.monthlyReports,
        {
          id: generateUniqueId(),
          month,
          salary,
          expenses: [generateExpenseItem(expenseName, expenseCost)],
        },
      ];

  const updatedData = {
    ...foundYearData,
    monthlyReports: newMonthlyReports,
  };

  await updateData(objectStore, updatedData);
};

const addFirstExpenseToYear = async (
  objectStore: IDBObjectStore,
  { year, month, salary, expenseName, expenseCost }: AddUpdateYearRequestData
) => {
  const newData = {
    id: generateUniqueId(),
    year,
    monthlyReports: [
      {
        id: generateUniqueId(),
        month,
        salary,
        expenses: [generateExpenseItem(expenseName, expenseCost)],
      },
    ],
  };

  await addData(objectStore, newData);
};

const currentDate = new Date();
const currentYear = currentDate.getFullYear().toString();
const currentMonth = currentDate.toLocaleString("default", { month: "long" });

const getSalary = (
  year: string,
  month: string,
  yearlyFinanceData: YearlyExpenseReport[]
) => {
  const foundYear = yearlyFinanceData.find(
    (yearlyReport) => yearlyReport.year.toString() === year
  );
  if (foundYear) {
    const foundMonth = foundYear.monthlyReports.find(
      (monthlyReport) => monthlyReport.month === month
    );
    return foundMonth?.salary.toFixed(2) || "";
  }
  return "";
};

interface FormData {
  month: string;
  expenseName: string;
  year: string;
  expenseCost: string;
  salary: string;
}

export const AddNewExpenseForm = () => {
  const [yearlyFinanceData, setYearlyFinanceData] = useState<
    YearlyExpenseReport[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [{ expenseCost, expenseName, month, year, salary }, setExpenseForm] =
    useState<FormData>({
      month: currentMonth,
      expenseName: "",
      year: currentYear,
      expenseCost: "",
      salary: "",
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllData();
        setYearlyFinanceData(data);
        setExpenseForm((prev) => ({
          ...prev,
          salary: getSalary(currentYear, currentMonth, data),
        }));
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAmountChange = (expenseCost: string) => {
    setExpenseForm((prev) => ({
      ...prev,
      expenseCost,
    }));
  };

  const handleYearChange = (year: string) => {
    setExpenseForm((prev) => ({
      ...prev,
      year,
      salary: getSalary(year, prev.month, yearlyFinanceData),
    }));
  };

  const handleSalaryChange = (salary: string) => {
    setExpenseForm((prev) => ({ ...prev, salary }));
  };

  const handleMonthChange = (month: string) => {
    setExpenseForm((prev) => ({
      ...prev,
      month,
      salary: getSalary(prev.year, month, yearlyFinanceData),
    }));
  };

  const handleExpenseNameChange = (expenseName: string) => {
    setExpenseForm((prev) => ({ ...prev, expenseName }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!year || !month || !salary || !expenseName || !expenseCost) {
      alert("All fields are required.");
      return;
    }

    const objectStore = await openDatabase(DB_STORE_NAME, "readwrite");
    const foundYearData = await getDataByYear(objectStore, parseInt(year));

    const formData = {
      month,
      expenseName,
      salary: parseFloat(salary),
      expenseCost: parseFloat(expenseCost),
      year: parseInt(year),
    };

    if (foundYearData) {
      await addNewExpense(objectStore, foundYearData, formData);
    } else {
      await addFirstExpenseToYear(objectStore, formData);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <form
      className="bg-white rounded-2xl shadow-lg p-8 m-4 w-full max-w-md"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add new Expense</h2>
      <div className="mb-4">
        <label htmlFor="year" className="block text-gray-700 mb-2">
          Year
        </label>
        <input
          id="year"
          type="number"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
          value={year}
          onChange={(e) => handleYearChange(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="month" className="block text-gray-700 mb-2">
          Month
        </label>
        <select
          id="month"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none  appearance-none dropdownStyle"
          value={month}
          onChange={(e) => handleMonthChange(e.target.value)}
        >
          <option value="" disabled>
            Select a month
          </option>
          {MONTHS.map(({ value, label }, index) => (
            <option key={index} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="salary" className="block text-gray-700 mb-2">
          Salary
        </label>
        <input
          id="salary"
          type="number"
          step="0.01"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
          value={salary}
          onChange={(e) => handleSalaryChange(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="expense" className="block text-gray-700 mb-2">
          Expense Name
        </label>
        <input
          id="expense"
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
          value={expenseName}
          onChange={(e) => handleExpenseNameChange(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="amount" className="block text-gray-700 mb-2">
          Amount
        </label>
        <input
          id="amount"
          type="number"
          step="0.01"
          min={0}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
          value={expenseCost}
          onChange={(e) => handleAmountChange(e.target.value)}
        />
      </div>
      <button
        type="submit"
        className="cursor-pointer w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300"
      >
        Submit
      </button>
    </form>
  );
};
