import Card from "../ui/Card";

const DashboardCard = ({ label, value, icon, tone = "brand" }) => {
  const tones = {
    brand: "bg-brand-50 text-brand-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <Card className="flex items-center gap-4 p-5">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-ink-500">{label}</p>
        <p className="font-display text-2xl font-bold text-ink-900">{value}</p>
      </div>
    </Card>
  );
};

export default DashboardCard;
