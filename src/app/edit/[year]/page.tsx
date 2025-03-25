import { EditYear } from "@/components/financeTracker/EditYear";

// mocked pages since the app is using indexedDb only which runs on client and can't be called here, hence this hacky thing...

export const generateStaticParams = async () => {
  const MOCK_START_YEAR = 1975;
  const currentYear = new Date().getFullYear();
  const allowedYears: { year: string }[] = [];

  for (let i = MOCK_START_YEAR; i <= currentYear; i++) {
    allowedYears.push({ year: i.toString() });
  }

  return allowedYears;
};

const EditYearExpenses = async ({
  params,
}: {
  params: Promise<{ year: string }>;
}) => {
  const { year } = await params;

  return <EditYear year={year} />;
};

export default EditYearExpenses;
