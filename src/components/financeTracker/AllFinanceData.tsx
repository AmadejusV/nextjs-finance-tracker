"use client";
import { useState, useEffect } from "react";
import { getAllData } from "@/indexedDb/indexedDb";
import { YearlyExpenseReportClientData } from "./model";
import "@/components/styles.css";
import { mapResponseToClientYearlyData } from "./mappings";
import Link from "next/link";

export const AllFinanceData = () => {
  const [yearlyFinanceData, setYearlyFinanceData] = useState<
    YearlyExpenseReportClientData[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const years = yearlyFinanceData.map((data) => data.year);
  const monthsInYears = [
    ...new Set(
      yearlyFinanceData.flatMap((data) =>
        data.monthlyReports.map((mr) => mr.month)
      )
    ),
  ];

  const getMonthsOfYear = (year: string) =>
    yearlyFinanceData.reduce<string[]>((acc, mr) => {
      if (year === mr.year.toString()) {
        acc.push(...mr.monthlyReports.map(({ month }) => month));
      }
      return acc;
    }, []);

  const allowedMonths = selectedYear
    ? getMonthsOfYear(selectedYear)
    : monthsInYears;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllData();
        setYearlyFinanceData(
          mapResponseToClientYearlyData(data).sort((a, b) => b.year - a.year)
        );
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(e.target.value);
  };

  const filteredData = yearlyFinanceData.filter((yearlyData) => {
    const matchesYear = selectedYear
      ? yearlyData.year.toString() === selectedYear
      : true;
    const matchesMonth = selectedMonth
      ? yearlyData.monthlyReports.some(
          (monthlyReport) => monthlyReport.month === selectedMonth
        )
      : true;
    return matchesYear && matchesMonth;
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex justify-center mt-4">
      <main className="w-100 flex-col justify-center items-center bg-white rounded-2xl shadow-lg p-8 m-4 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Yearly Finance Data
        </h2>
        <div className="mb-4 flex space-x-4">
          <label htmlFor="year-select" className="sr-only">
            Select Year
          </label>
          <select
            id="year-select"
            value={selectedYear}
            onChange={handleYearChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none appearance-none dropdownStyle"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <label htmlFor="month-select" className="sr-only">
            Select Month
          </label>
          <select
            id="month-select"
            value={selectedMonth}
            onChange={handleMonthChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none appearance-none dropdownStyle"
          >
            <option value="">All Months</option>
            {allowedMonths.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {filteredData.length > 0 ? (
          filteredData.map((yearlyData) => (
            <section
              key={yearlyData.id}
              className="mb-6 p-4 border border-gray-300 rounded-lg hover:shadow-md transition-shadow duration-300"
            >
              <header className="flex justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-700">
                  Year: {yearlyData.year}
                </h3>
                <Link
                  href={`/edit/${yearlyData.year}`}
                  className="text-blue-500 hover:text-blue-700 font-medium transition-colors duration-300 border rounded border-gray-300 px-3"
                >
                  Edit
                </Link>
              </header>
              <section className="flex font-semibold gap-3 mb-2">
                <p className="text-gray-600">
                  Yearly salary:{" "}
                  <span className="text-green-600">
                    {yearlyData.yearlySalary.toFixed(2)}
                  </span>
                </p>
                <p className="text-gray-600">
                  Yearly expenses sum:{" "}
                  <span className="text-red-600">
                    {yearlyData.yearlyExpenses.toFixed(2)}
                  </span>
                </p>
                <p className="text-gray-600">
                  Yearly balance:{" "}
                  <span
                    className={
                      yearlyData.yearlyBalance > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {yearlyData.yearlyBalance.toFixed(2)}
                  </span>
                </p>
              </section>
              <div className="space-y-4">
                {yearlyData.monthlyReports
                  .filter((monthlyReport) =>
                    selectedMonth ? monthlyReport.month === selectedMonth : true
                  )
                  .map((monthlyReport) => (
                    <article
                      key={monthlyReport.id}
                      className="p-3 bg-gray-100 rounded-lg"
                    >
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
                            {expense.expenseName}:{" "}
                            {expense.expenseCost.toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
              </div>
            </section>
          ))
        ) : (
          <p>
            No records yet.{" "}
            <Link
              className="text-blue-400 hover:text-blue-500"
              href="/addNewExpense"
            >
              You can add some here!
            </Link>
          </p>
        )}
      </main>
    </div>
  );
};
