import Link from "next/link";
import { YearlyExpenseReportClientData } from "./model";
import { MonthlyReport } from "./MonthlyReport";

interface Props {
  selectedMonth: string;
  yearlyReport: YearlyExpenseReportClientData;
}

export const YearlyReport = ({
  selectedMonth,
  yearlyReport: {
    id,
    year,
    yearlySalary,
    monthlyReports,
    yearlyExpenses,
    yearlyBalance,
  },
}: Props) => {
  return (
    <section
      key={id}
      className="mb-6 p-4 border border-gray-300 rounded-lg hover:shadow-md transition-shadow duration-300"
    >
      <header className="flex justify-between mb-2">
        <h3 className="text-xl font-semibold text-gray-700">Year: {year}</h3>
        <Link
          href={`/edit/${year}`}
          className="text-blue-500 hover:text-blue-700 font-medium transition-colors duration-300 border rounded border-gray-300 px-3"
        >
          Edit
        </Link>
      </header>
      <section className="flex font-semibold gap-3 mb-2">
        <p className="text-gray-600">
          Yearly salary:{" "}
          <span className="text-green-600">{yearlySalary.toFixed(2)}</span>
        </p>
        <p className="text-gray-600">
          Yearly expenses sum:{" "}
          <span className="text-red-600">{yearlyExpenses.toFixed(2)}</span>
        </p>
        <p className="text-gray-600">
          Yearly balance:{" "}
          <span
            className={yearlyBalance > 0 ? "text-green-600" : "text-red-600"}
          >
            {yearlyBalance.toFixed(2)}
          </span>
        </p>
      </section>
      <div className="space-y-4">
        {monthlyReports
          .filter((monthlyReport) =>
            selectedMonth ? monthlyReport.month === selectedMonth : true
          )
          .map((monthlyReport) => (
            <MonthlyReport
              key={monthlyReport.id}
              monthlyReport={monthlyReport}
            />
          ))}
      </div>
    </section>
  );
};
