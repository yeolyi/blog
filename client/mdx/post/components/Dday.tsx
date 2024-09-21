export const Dday = ({
  year,
  month,
  date,
}: {
  year: number;
  month: number;
  date: number;
}) => {
  const startDate = new Date(year, month - 1, date);
  const today = new Date();
  return Math.floor(
    (today.getTime() - startDate.getTime()) / 1000 / 60 / 60 / 24,
  );
};
