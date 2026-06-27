import { CalendarCheck, Car, CircleDollarSign, PhoneCall, TrendingUp, Users } from "lucide-react";
import { BarTrendChart, TrendChart } from "@/components/charts/trend-chart";
import { Card, CardHeader } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { monthlyCommissionTotal, monthlySalesTotal } from "@/lib/analytics";
import { defaultSettings } from "@/lib/scoring";
import { getDemoSalesDays } from "@/lib/sample-data";
import { formatCurrency, percent } from "@/lib/utils";

export default function CareerPage() {
  const days = getDemoSalesDays();
  const carsSold = monthlySalesTotal(days);
  const calls = days.reduce((sum, day) => sum + day.calls, 0);
  const appointments = days.reduce((sum, day) => sum + day.appointments, 0);
  const financeConversions = days.reduce((sum, day) => sum + day.financeConversions, 0);
  const commission = monthlyCommissionTotal(days);
  const progress = percent(carsSold, defaultSettings.monthlySalesTarget);

  const activityData = days.map((day) => ({ date: day.date, carsSold: day.carsSold, appointments: day.appointments, calls: day.calls }));
  const financeData = days.map((day) => ({ date: day.date, financeConversions: day.financeConversions, commission: day.commissionEstimate }));

  return (
    <div className="page-grid">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Career</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-normal text-ink">Control the inputs</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted">Cars sold matter, but calls, appointments, and finance conversations are the daily behaviours.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Cars sold" value={String(carsSold)} detail="This month" icon={<Car size={20} />} />
        <MetricCard label="Appointments" value={String(appointments)} detail="Booked or held" icon={<CalendarCheck size={20} />} accent="focus" />
        <MetricCard label="Calls" value={String(calls)} detail="Sales activity" icon={<PhoneCall size={20} />} accent="amber" />
        <MetricCard label="Finance" value={String(financeConversions)} detail="Conversions" icon={<Users size={20} />} accent="coral" />
        <MetricCard label="Commission" value={formatCurrency(commission)} detail="Estimate" icon={<CircleDollarSign size={20} />} />
      </section>

      <Card>
        <CardHeader title="Monthly target progress" eyebrow="Visual target" action={<TrendingUp size={20} className="text-brand" />} />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-3xl font-semibold text-ink">{carsSold}/{defaultSettings.monthlySalesTarget}</p>
            <p className="mt-1 text-sm text-muted">Cars sold toward monthly target</p>
          </div>
          <p className="text-sm font-semibold text-brand">{progress}%</p>
        </div>
        <ProgressBar value={progress} className="mt-4" />
      </Card>

      <section className="grid gap-4 xl:grid-cols-2">
        <BarTrendChart
          title="Sales activity"
          eyebrow="Daily behaviour"
          data={activityData}
          series={[
            { key: "calls", label: "Calls", color: "#4967c9" },
            { key: "appointments", label: "Appointments", color: "#24786d" },
            { key: "carsSold", label: "Cars", color: "#d18b18" }
          ]}
        />
        <TrendChart
          title="Finance and commission"
          eyebrow="Outcome indicators"
          data={financeData}
          series={[
            { key: "financeConversions", label: "Finance", color: "#24786d" },
            { key: "commission", label: "Commission", color: "#d95f46" }
          ]}
        />
      </section>
    </div>
  );
}
