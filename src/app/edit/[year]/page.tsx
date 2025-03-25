import { EditYear } from "@/components/financeTracker/EditYear";

const EditYearExpenses = async ({ params }: { params: { year: string } }) => {
  return <EditYear year={params.year} />;
};

export default EditYearExpenses;
