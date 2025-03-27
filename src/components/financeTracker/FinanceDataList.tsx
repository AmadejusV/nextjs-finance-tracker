import Link from "next/link";
import { YearlyExpenseReportClientData } from "./model";
import { YearlyReport } from "./YearlyReport";

interface Props {
  selectedMonth: string;
  financeDataList: YearlyExpenseReportClientData[];
}

export const FinanceDataList = ({ selectedMonth, financeDataList }: Props) => {
  return (
    <>
      {financeDataList.length > 0 ? (
        financeDataList.map((yearlyData) => (
          <YearlyReport
            key={yearlyData.id}
            selectedMonth={selectedMonth}
            yearlyReport={yearlyData}
          />
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
    </>
  );
};
