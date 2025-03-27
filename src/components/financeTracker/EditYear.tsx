"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DB_STORE_NAME,
  getDataByYear,
  openDatabase,
  updateData,
  deleteData,
} from "@/indexedDb/indexedDb";
import { YearlyExpenseReport } from "./model";
import "@/components/styles.css";
import { toast } from "react-toastify";
import { MonthlyReportCard } from "../edit/MonthlyReportCard";

interface Props {
  year: string;
}

export const EditYear = ({ year }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [yearlyExpenseReport, setYearlyExpenseReport] =
    useState<YearlyExpenseReport | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const store = await openDatabase(DB_STORE_NAME, "readwrite");
        const foundYearData = await getDataByYear(store, parseInt(year));
        setYearlyExpenseReport(foundYearData);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };

    fetchData();
  }, [year]);

  const handleMonthlyReportChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    if (yearlyExpenseReport) {
      const updatedMonthlyReports = yearlyExpenseReport.monthlyReports.map(
        (report, i) => (i === index ? { ...report, [field]: value } : report)
      );
      setYearlyExpenseReport({
        ...yearlyExpenseReport,
        monthlyReports: updatedMonthlyReports,
      });
    }
  };

  const handleExpenseChange = (
    monthlyIndex: number,
    expenseIndex: number,
    field: string,
    value: string | number
  ) => {
    if (yearlyExpenseReport) {
      const updatedMonthlyReports = yearlyExpenseReport.monthlyReports.map(
        (report, i) =>
          i === monthlyIndex
            ? {
                ...report,
                expenses: report.expenses.map((expense, j) =>
                  j === expenseIndex ? { ...expense, [field]: value } : expense
                ),
              }
            : report
      );
      setYearlyExpenseReport({
        ...yearlyExpenseReport,
        monthlyReports: updatedMonthlyReports,
      });
    }
  };

  const handleRemoveExpense = (monthlyIndex: number, expenseIndex: number) => {
    if (yearlyExpenseReport) {
      const updatedMonthlyReports = yearlyExpenseReport.monthlyReports.map(
        (report, i) =>
          i === monthlyIndex
            ? {
                ...report,
                expenses: report.expenses.filter((_, j) => j !== expenseIndex),
              }
            : report
      );
      setYearlyExpenseReport({
        ...yearlyExpenseReport,
        monthlyReports: updatedMonthlyReports,
      });
    }
  };

  const handleRemoveMonth = (monthlyIndex: number) => {
    if (yearlyExpenseReport) {
      const updatedMonthlyReports = yearlyExpenseReport.monthlyReports.filter(
        (_, i) => i !== monthlyIndex
      );
      setYearlyExpenseReport({
        ...yearlyExpenseReport,
        monthlyReports: updatedMonthlyReports,
      });
    }
  };

  const handleDeleteYear = async () => {
    setLoading(true);

    if (yearlyExpenseReport) {
      await deleteData(yearlyExpenseReport.year);
      router.push("/");
      toast.success("Deleted successfully", { position: "bottom-right" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (yearlyExpenseReport) {
      const isValid = yearlyExpenseReport.monthlyReports.every((report) => {
        if (!report.salary) return false;
        return report.expenses.every(
          (expense) => expense.expenseName && expense.expenseCost
        );
      });

      if (!isValid) {
        alert("All fields are required.");
        return;
      }

      const objectStore = await openDatabase(DB_STORE_NAME, "readwrite");
      await updateData(objectStore, yearlyExpenseReport);

      toast.success("Year expenses updated", { position: "bottom-right" });
    }
  };

  if (loading) {
    return <span>Loading...</span>;
  }

  if (!yearlyExpenseReport) {
    return <span>Something went wrong :(</span>;
  }

  return (
    <main className="flex justify-center mt-4">
      <form
        className="bg-white rounded-2xl shadow-lg p-8 m-4 w-full max-w-4xl"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Edit Yearly Expense Report
        </h2>
        {yearlyExpenseReport.monthlyReports.map(
          (monthlyReport, monthlyIndex) => (
            <MonthlyReportCard
              key={monthlyReport.id}
              monthlyIndex={monthlyIndex}
              monthlyReport={monthlyReport}
              onExpenseChange={handleExpenseChange}
              onMonthlyReportChange={handleMonthlyReportChange}
              onRemoveExpense={handleRemoveExpense}
              onRemoveMonth={handleRemoveMonth}
            />
          )
        )}
        <footer className="mt-4">
          <button
            type="submit"
            className="cursor-pointer w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-300 font-bold"
          >
            Save
          </button>
          <button
            type="button"
            className="cursor-pointer w-full bg-red-400 text-white p-3 rounded-lg hover:bg-red-500 transition duration-300 mt-4 font-bold"
            onClick={handleDeleteYear}
          >
            Delete Year
          </button>
        </footer>
      </form>
    </main>
  );
};
