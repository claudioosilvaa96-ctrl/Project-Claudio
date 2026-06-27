import { Landmark, PiggyBank, Shield, TrendingUp, WalletCards } from "lucide-react";
import { BarTrendChart, TrendChart } from "@/components/charts/trend-chart";
import { Card, CardHeader } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { defaultSettings } from "@/lib/scoring";
import { getDemoFinanceSnapshots } from "@/lib/sample-data";
import { formatCurrency, percent } from "@/lib/utils";

export default function MoneyPage() {
  const snapshots = getDemoFinanceSnapshots();
  const latest = snapshots.at(-1) ?? snapshots[0];
  const saving = latest.monthlyIncome - latest.monthlySpending;
  const savingRate = Math.round((saving / latest.monthlyIncome) * 100);
  const depositProgress = percent(latest.mortgageFund, defaultSettings.houseDepositTarget);
  const emergencyProgress = percent(latest.emergencyFund, defaultSettings.emergencyFundTarget);

  const fundData = snapshots.map((item) => ({
    date: item.date,
    mortgageFund: item.mortgageFund,
    emergencyFund: item.emergencyFund,
    investments: item.investments,
    currentSavings: item.currentSavings
  }));

  const cashflowData = snapshots.map((item) => ({
    date: item.date,
    spending: item.monthlySpending,
    saving: item.monthlyIncome - item.monthlySpending
  }));

  return (
    <div className="page-grid">
      <header>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-muted">Money</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-normal text-ink">House deposit momentum</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-muted">A calm money view for savings, protection, investments, spending, and monthly saving rate.</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Current savings" value={formatCurrency(latest.currentSavings)} detail="All accessible savings" icon={<PiggyBank size={20} />} />
        <MetricCard label="Mortgage fund" value={formatCurrency(latest.mortgageFund)} detail="House deposit" icon={<Landmark size={20} />} accent="focus" />
        <MetricCard label="Emergency fund" value={formatCurrency(latest.emergencyFund)} detail="Protection" icon={<Shield size={20} />} accent="amber" />
        <MetricCard label="Investments" value={formatCurrency(latest.investments)} detail="Long term" icon={<TrendingUp size={20} />} accent="coral" />
        <MetricCard label="Saving rate" value={String(savingRate) + "%"} detail="This month" icon={<WalletCards size={20} />} />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader title="House deposit" eyebrow="Mortgage fund" />
          <p className="text-3xl font-semibold text-ink">{formatCurrency(latest.mortgageFund)}</p>
          <p className="mt-1 text-sm text-muted">Target {formatCurrency(defaultSettings.houseDepositTarget)}</p>
          <ProgressBar value={depositProgress} className="mt-5" />
          <p className="mt-3 text-sm font-semibold text-brand">{depositProgress}% complete</p>
        </Card>
        <Card>
          <CardHeader title="Emergency fund" eyebrow="Safety net" />
          <p className="text-3xl font-semibold text-ink">{formatCurrency(latest.emergencyFund)}</p>
          <p className="mt-1 text-sm text-muted">Target {formatCurrency(defaultSettings.emergencyFundTarget)}</p>
          <ProgressBar value={emergencyProgress} className="mt-5" />
          <p className="mt-3 text-sm font-semibold text-brand">{emergencyProgress}% complete</p>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <TrendChart
          title="Savings and investments"
          eyebrow="Balance progression"
          data={fundData}
          series={[
            { key: "mortgageFund", label: "Mortgage", color: "#24786d" },
            { key: "emergencyFund", label: "Emergency", color: "#4967c9" },
            { key: "investments", label: "Investments", color: "#d18b18" }
          ]}
          kind="area"
        />
        <BarTrendChart
          title="Monthly spending and saving"
          eyebrow="Cashflow"
          data={cashflowData}
          series={[
            { key: "spending", label: "Spending", color: "#d95f46" },
            { key: "saving", label: "Saving", color: "#24786d" }
          ]}
        />
      </section>
    </div>
  );
}
