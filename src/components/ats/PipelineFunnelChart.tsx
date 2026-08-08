import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { STAGE_LABELS } from "@/lib/ats";
import { ApplicationStage, PipelineFunnel } from "@/types";

interface PipelineFunnelChartProps {
  funnel: PipelineFunnel;
}

/** Bars share one hue so the chart reads as a single series, not a category set. */
const BAR_COLORS: Record<string, string> = {
  APPLIED: "hsl(215 20% 65%)",
  SCREENING: "hsl(217 91% 60%)",
  INTERVIEW: "hsl(258 90% 66%)",
  OFFER: "hsl(38 92% 50%)",
  HIRED: "hsl(160 84% 39%)",
  REJECTED: "hsl(350 89% 60%)",
  WITHDRAWN: "hsl(215 16% 47%)",
};

const PipelineFunnelChart = ({ funnel }: PipelineFunnelChartProps) => {
  const data = (Object.keys(funnel.byStage) as ApplicationStage[]).map((stage) => ({
    stage,
    label: STAGE_LABELS[stage],
    count: funnel.byStage[stage],
    rate: funnel.conversionRates[stage],
  }));

  const hasCandidates = funnel.totalApplications > 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Pipeline</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasCandidates ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            No applications yet — the funnel appears once candidates apply.
          </p>
        ) : (
          <>
            {/*
              Horizontal bars: the stage names are long and this chart sits in a
              narrow sidebar, where vertical bars collide their axis labels.
            */}
            <div
              style={{ height: data.length * 30 + 16 }}
              role="img"
              aria-label="Applications by pipeline stage"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data}
                  layout="vertical"
                  margin={{ top: 0, right: 24, bottom: 0, left: 0 }}
                  barCategoryGap={4}
                >
                  <XAxis type="number" allowDecimals={false} hide />
                  <YAxis
                    type="category"
                    dataKey="label"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={68}
                    interval={0}
                  />
                  <Tooltip
                    cursor={{ fill: "hsl(var(--muted))" }}
                    formatter={(value: number, _name, entry) => [
                      `${value} candidate${value === 1 ? "" : "s"} (${entry.payload.rate}%)`,
                      "",
                    ]}
                    labelFormatter={(label) => String(label)}
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} minPointSize={2}>
                    <LabelList
                      dataKey="count"
                      position="right"
                      style={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    />
                    {data.map((entry) => (
                      <Cell key={entry.stage} fill={BAR_COLORS[entry.stage]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* The numbers a chart alone would hide from a screen reader. */}
            <dl className="grid grid-cols-3 gap-3 pt-3 border-t mt-2 text-center">
              <div>
                <dt className="text-xs text-muted-foreground">Total</dt>
                <dd className="text-lg font-semibold">{funnel.totalApplications}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Awaiting review</dt>
                <dd className="text-lg font-semibold">{funnel.awaitingReview}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Strong match</dt>
                <dd className="text-lg font-semibold">{funnel.strongMatches}</dd>
                <dd className="text-[10px] text-muted-foreground">{funnel.strongMatchThreshold}%+</dd>
              </div>
            </dl>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PipelineFunnelChart;
