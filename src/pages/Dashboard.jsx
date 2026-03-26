import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  companies, chartData, sourceBreakdown, recentActivity,
  generateLiveVisitor, timeAgo, flag, intentColor,
} from '../data/mockData';

// ── Area chart ─────────────────────────────────────────────────────────────────
function AreaChart({ data, metric }) {
  const [hovered, setHovered] = useState(null);
  const W = 800, H = 180;
  const pad = { t: 16, r: 16, b: 36, l: 42 };
  const cw = W - pad.l - pad.r;
  const ch = H - pad.t - pad.b;
  const max = Math.max(...data.map((d) => d[metric]), 1);

  const pts = data.map((d, i) => ({
    x: pad.l + (i / (data.length - 1)) * cw,
    y: pad.t + ch - (d[metric] / max) * ch,
    ...d,
  }));

  const linePath = pts.reduce((path, p, i) => {
    if (i === 0) return `M ${p.x},${p.y}`;
    const prev = pts[i - 1];
    const cpx = (p.x + prev.x) / 2;
    return `${path} C ${cpx},${prev.y} ${cpx},${p.y} ${p.x},${p.y}`;
  }, '');

  const areaPath = `${linePath} L ${pts[pts.length - 1].x},${pad.t + ch} L ${pts[0].x},${pad.t + ch} Z`;
  const gridVals = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({ y: pad.t + ch * (1 - pct), val: Math.round(max * pct) }));

  const zoneWidth = (i) => {
    if (data.length < 2) return cw;
    const prev = i > 0 ? (pts[i].x + pts[i - 1].x) / 2 : pts[0].x - 10;
    const next = i < pts.length - 1 ? (pts[i].x + pts[i + 1].x) / 2 : pts[pts.length - 1].x + 10;
    return { x: prev, width: next - prev };
  };

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ height: H + 'px' }}
        onMouseLeave={() => setHovered(null)}
      >
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
        </defs>

        {gridVals.map(({ y, val }) => (
          <g key={val}>
            <line x1={pad.l} y1={y} x2={pad.l + cw} y2={y} stroke="#1e2a45" strokeWidth={1} />
            <text x={pad.l - 8} y={y + 4} textAnchor="end" fontSize={10} fill="#475569" fontFamily="DM Mono, monospace">
              {val}
            </text>
          </g>
        ))}

        <path d={areaPath} fill="url(#chartGrad)" />
        <path d={linePath} fill="none" stroke="#3b82f6" strokeWidth={2.5} strokeLinecap="round" />

        {hovered !== null && (
          <line
            x1={pts[hovered].x} y1={pad.t}
            x2={pts[hovered].x} y2={pad.t + ch}
            stroke="#3b82f6" strokeWidth={1} strokeOpacity={0.5} strokeDasharray="3 2"
          />
        )}

        {pts.map((p, i) => {
          const z = zoneWidth(i);
          return (
            <g key={i}>
              <rect x={z.x} y={pad.t} width={z.width} height={ch} fill="transparent"
                onMouseEnter={() => setHovered(i)} />
              {hovered === i && (
                <circle cx={p.x} cy={p.y} r={4.5} fill="#3b82f6" stroke="#0b0f1a" strokeWidth={2.5} />
              )}
            </g>
          );
        })}

        {pts.map((p, i) =>
          i % 2 === 0 ? (
            <text key={i} x={p.x} y={H - 6} textAnchor="middle" fontSize={10} fill="#475569" fontFamily="DM Sans, sans-serif">
              {data[i].label}
            </text>
          ) : null
        )}
      </svg>

      {hovered !== null && (
        <div
          className="absolute pointer-events-none bg-[#1a2235] border border-[#2d3f62] rounded-lg px-3 py-2 text-xs shadow-xl z-10"
          style={{
            left: `clamp(10px, ${((pts[hovered].x / W) * 100).toFixed(1)}%, calc(100% - 120px))`,
            top: '8px',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
          }}
        >
          <p className="text-slate-400 text-[11px]">{data[hovered].label}</p>
          <p className="text-white font-semibold mt-0.5">
            {data[hovered][metric]} {metric}
          </p>
          {metric === 'visitors' && (
            <p className="text-slate-500 text-[11px]">{data[hovered].companies} companies</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Stat card ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, delta, icon, accent = 'blue' }) {
  const colors = {
    blue: 'text-blue-400 bg-blue-500/10',
    violet: 'text-violet-400 bg-violet-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
  };
  return (
    <div className="bg-[#0f1623] border border-[#1e2a45] rounded-xl px-5 py-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${colors[accent]}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-xs text-slate-500">{sub}</p>
          {delta && (
            <span className="text-[11px] text-emerald-400 font-medium">{delta}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [chartMetric, setChartMetric] = useState('visitors');
  const [liveFeed, setLiveFeed] = useState(() => recentActivity.slice(0, 8));
  const [selectedSource, setSelectedSource] = useState(null);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  // Auto-update live feed every 5s
  useEffect(() => {
    timerRef.current = setInterval(() => {
      const newEntry = generateLiveVisitor();
      setLiveFeed((prev) => [newEntry, ...prev].slice(0, 10));
      // Clear isNew flag after animation completes
      setTimeout(() => {
        setLiveFeed((prev) =>
          prev.map((e) => e.id === newEntry.id ? { ...e, isNew: false } : e)
        );
      }, 800);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const todayVisitors = chartData[chartData.length - 1].visitors;
  const todayCompanies = chartData[chartData.length - 1].companies;
  const totalVisitors = chartData.reduce((s, d) => s + d.visitors, 0);

  const topCompanies = [...companies].sort((a, b) => b.totalVisits - a.totalVisits).slice(0, 5);

  const filteredFeed = selectedSource
    ? liveFeed.filter((a) => a.source === selectedSource)
    : liveFeed;

  function toggleSource(sourceName) {
    setSelectedSource((prev) => (prev === sourceName ? null : sourceName));
  }

  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Thursday, March 26, 2026 · Last updated just now
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-900/30 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-pulse" />
            Live
          </div>
          <button className="text-xs text-slate-400 bg-[#0f1623] border border-[#1e2a45] px-3 py-1.5 rounded-lg hover:border-slate-500 hover:text-white transition-colors">
            Export report
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Visitors today"
          value={todayVisitors}
          sub="page sessions"
          delta="↑ 22% vs yesterday"
          accent="blue"
          icon={
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current">
              <path d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-7 9a7 7 0 1 1 14 0H1z" />
            </svg>
          }
        />
        <StatCard
          label="Companies identified"
          value={todayCompanies}
          sub="unique organizations"
          delta="↑ 4 new"
          accent="violet"
          icon={
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current">
              <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5V5h2V2.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7H11v2h2.5A1.5 1.5 0 0 1 15 10.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5V11H7v2.5A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3A1.5 1.5 0 0 1 2.5 9H5V7H2.5A1.5 1.5 0 0 1 1 5.5v-3z" />
            </svg>
          }
        />
        <StatCard
          label="Avg. session time"
          value="4m 12s"
          sub="across all visitors"
          delta="↑ 18s vs last week"
          accent="emerald"
          icon={
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current">
              <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
            </svg>
          }
        />
        <StatCard
          label="Top source"
          value="LinkedIn"
          sub={`${totalVisitors} total visits`}
          accent="amber"
          icon={
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current">
              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
            </svg>
          }
        />
      </div>

      {/* Chart + Sources row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Chart */}
        <div className="xl:col-span-2 bg-[#0f1623] border border-[#1e2a45] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Visitor trends</h2>
              <p className="text-xs text-slate-500 mt-0.5">Last 15 days</p>
            </div>
            <div className="flex gap-1 bg-[#0b0f1a] border border-[#1e2a45] rounded-lg p-0.5">
              {['visitors', 'companies'].map((m) => (
                <button
                  key={m}
                  onClick={() => setChartMetric(m)}
                  className={`px-3 py-1 text-xs rounded-md font-medium transition-all capitalize ${
                    chartMetric === m
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <AreaChart data={chartData} metric={chartMetric} />
        </div>

        {/* Traffic sources — clickable to filter feed */}
        <div className="bg-[#0f1623] border border-[#1e2a45] rounded-xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">Traffic sources</h2>
              <p className="text-xs text-slate-500 mt-0.5">Last 30 days · click to filter</p>
            </div>
            {selectedSource && (
              <button
                onClick={() => setSelectedSource(null)}
                className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                Clear ✕
              </button>
            )}
          </div>
          <div className="space-y-3.5">
            {sourceBreakdown.map((s) => {
              const isSelected = selectedSource === s.source;
              const isDimmed = selectedSource && !isSelected;
              return (
                <button
                  key={s.source}
                  onClick={() => toggleSource(s.source)}
                  className={`w-full text-left transition-opacity ${isDimmed ? 'opacity-40' : 'opacity-100'}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-sm shrink-0"
                        style={{ background: s.color }}
                      />
                      <span className={`text-xs ${isSelected ? 'text-white font-medium' : 'text-slate-300'}`}>
                        {s.source}
                      </span>
                      {isSelected && (
                        <span className="text-[10px] text-blue-400 bg-blue-600/15 px-1.5 py-0.5 rounded-full border border-blue-600/20">
                          filtered
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-mono">{s.count}</span>
                      <span className="text-xs text-slate-400 font-medium w-8 text-right">{s.pct}%</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-[#1e2a45] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${s.pct}%`, background: s.color, opacity: isSelected ? 1 : 0.85 }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-[#1e2a45]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Total sessions</span>
              <span className="text-slate-300 font-semibold font-mono">374</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1.5">
              <span className="text-slate-500">Unique companies</span>
              <span className="text-slate-300 font-semibold font-mono">128</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top companies + Recent activity */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Top companies */}
        <div className="xl:col-span-3 bg-[#0f1623] border border-[#1e2a45] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e2a45]">
            <div>
              <h2 className="text-sm font-semibold text-white">Top companies</h2>
              <p className="text-xs text-slate-500 mt-0.5">Highest engagement this week</p>
            </div>
            <button
              onClick={() => navigate('/visitors')}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              View all →
            </button>
          </div>
          <div className="divide-y divide-[#1a2235]">
            {topCompanies.map((c, idx) => {
              const ic = intentColor(c.intent);
              return (
                <div
                  key={c.id}
                  onClick={() => navigate(`/visitors/${c.id}`)}
                  className="flex items-center gap-4 px-5 py-3.5 hover:bg-[#131d2e] cursor-pointer transition-colors"
                >
                  <span className="text-xs text-slate-600 font-mono w-4 shrink-0">{idx + 1}</span>
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: c.logoColor + '22', border: `1px solid ${c.logoColor}44` }}
                  >
                    <span style={{ color: c.logoColor }}>{c.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{c.name}</p>
                    <p className="text-xs text-slate-500 truncate">{c.industry}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-slate-200">{c.totalVisits}</p>
                    <p className="text-[11px] text-slate-600">visits</p>
                  </div>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${ic.bg} ${ic.text} ${ic.border}`}
                  >
                    {c.intent}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent activity — live feed */}
        <div className="xl:col-span-2 bg-[#0f1623] border border-[#1e2a45] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1e2a45]">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Recent activity</h2>
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-pulse" />
                Live
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedSource ? (
                <span>
                  Filtered: <span className="text-blue-400">{selectedSource}</span>
                  {' · '}
                  <button onClick={() => setSelectedSource(null)} className="text-slate-500 hover:text-slate-300 underline">
                    show all
                  </button>
                </span>
              ) : (
                'Latest page visits · updates every 5s'
              )}
            </p>
          </div>
          <div className="divide-y divide-[#1a2235] overflow-y-auto max-h-[340px]">
            {filteredFeed.length === 0 ? (
              <div className="px-5 py-10 text-center text-slate-600 text-xs">
                No activity from {selectedSource} yet.
              </div>
            ) : (
              filteredFeed.map((a) => (
                <div
                  key={a.id}
                  onClick={() => navigate(`/visitors/${a.company.id}`)}
                  className={`flex items-start gap-3 px-5 py-3 hover:bg-[#131d2e] cursor-pointer transition-colors${a.isNew ? ' slide-in' : ''}`}
                >
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5"
                    style={{ background: a.company.logoColor + '22', color: a.company.logoColor }}
                  >
                    {a.company.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-300 truncate">{a.company.name}</p>
                    <p className="text-[11px] text-slate-600 truncate font-mono mt-0.5">
                      {a.pages[0]}
                    </p>
                    {a.source && (
                      <span
                        className="inline-block text-[10px] px-1.5 py-0.5 rounded mt-0.5 font-medium"
                        style={{ background: (a.sourceColor || '#475569') + '22', color: a.sourceColor || '#94a3b8' }}
                      >
                        {a.source}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-600 whitespace-nowrap shrink-0 mt-0.5">
                    {timeAgo(a.timestamp)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
