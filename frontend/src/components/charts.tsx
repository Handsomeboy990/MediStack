// Graphiques SVG sans dépendance, en dégradé de vert MTN pour rester sobre.
// Composants purs (aucun hook ni interactivité) : rendus côté serveur.
const GREEN = '#004D40';
export const SERIES = ['#004D40', '#2f8f86', '#55bab3', '#9bd6d0', '#cdeae7'];

type Point = { label: string; value: number };

export function LineChart({ data }: { data: Point[] }) {
  const w = 640;
  const h = 220;
  const pad = { t: 16, r: 16, b: 28, l: 16 };
  const max = Math.max(...data.map((d) => d.value), 1);
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const x = (i: number) => pad.l + (data.length <= 1 ? iw / 2 : (i / (data.length - 1)) * iw);
  const y = (v: number) => pad.t + ih - (v / max) * ih;
  const pts = data.map((d, i) => [x(i), y(d.value)] as const);
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
  const area = `${line} L${x(data.length - 1)},${pad.t + ih} L${x(0)},${pad.t + ih} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      {[0, 0.25, 0.5, 0.75, 1].map((g) => (
        <line key={g} x1={pad.l} x2={w - pad.r} y1={pad.t + ih * g} y2={pad.t + ih * g} stroke="#e5e7eb" strokeWidth={1} />
      ))}
      <path d={area} fill={GREEN} opacity={0.08} />
      <path d={line} fill="none" stroke={GREEN} strokeWidth={2.5} />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r={3.5} fill={GREEN} />
      ))}
      {data.map((d, i) => (
        <text key={i} x={x(i)} y={h - 8} textAnchor="middle" fontSize={11} fill="#6b7280">{d.label}</text>
      ))}
    </svg>
  );
}

export function Donut({ data, format }: { data: Point[]; format?: (n: number) => string }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = 70;
  const c = 90;
  const circ = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg viewBox="0 0 180 180" className="h-44 w-44 -rotate-90">
        <circle cx={c} cy={c} r={r} fill="none" stroke="#eef2f1" strokeWidth={24} />
        {data.map((d, i) => {
          const dash = (d.value / total) * circ;
          const seg = (
            <circle key={i} cx={c} cy={c} r={r} fill="none" stroke={SERIES[i % SERIES.length]} strokeWidth={24} strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset} />
          );
          offset += dash;
          return seg;
        })}
      </svg>
      <div className="space-y-1.5">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-sm" style={{ background: SERIES[i % SERIES.length] }} />
            <span className="text-muted-foreground">{d.label}</span>
            <strong className="ml-6">{format ? format(d.value) : d.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HBars({ data, format }: { data: Point[]; format?: (n: number) => string }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>{d.label}</span>
            <strong>{format ? format(d.value) : d.value}</strong>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full" style={{ width: `${(d.value / max) * 100}%`, background: GREEN }} />
          </div>
        </div>
      ))}
    </div>
  );
}
