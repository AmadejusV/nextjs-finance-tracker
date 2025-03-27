"use client";
import { useState, useEffect } from "react";
import { getAllData } from "@/indexedDb/indexedDb";
import { YearlyExpenseReportClientData } from "./model";
import "@/components/styles.css";
import { mapResponseToClientYearlyData } from "./mappings";
import { FinanceDataFilters } from "./FinanceDataFilters";
import { FinanceDataList } from "./FinanceDataList";

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
        <FinanceDataFilters
          allowedMonths={allowedMonths}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          years={years}
          onChangeYear={handleYearChange}
          onMonthChange={handleMonthChange}
        />

        <FinanceDataList
          financeDataList={filteredData}
          selectedMonth={selectedMonth}
        />
      </main>
    </div>
  );
};
