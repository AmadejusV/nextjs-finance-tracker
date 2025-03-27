import { ChangeEvent } from "react";

interface Props {
  selectedYear: string;
  selectedMonth: string;
  years: number[];
  allowedMonths: string[];
  onChangeYear: (year: ChangeEvent<HTMLSelectElement>) => void;
  onMonthChange: (month: ChangeEvent<HTMLSelectElement>) => void;
}

export const FinanceDataFilters = ({
  selectedYear,
  selectedMonth,
  years,
  allowedMonths,
  onChangeYear,
  onMonthChange,
}: Props) => {
  return (
    <>
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
          onChange={onChangeYear}
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
          onChange={onMonthChange}
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
    </>
  );
};
