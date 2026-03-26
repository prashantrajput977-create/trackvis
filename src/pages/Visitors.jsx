import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { companies, timeAgo, flag, intentColor, scoreColor, fmt } from '../data/mockData';

const INTENT_OPTIONS = ['All', 'High', 'Medium', 'Low'];

function IntentBadge({ intent }) {
  const c = intentColor(intent);
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
      {intent}
    </span>
  );
}

function ScoreDot({ score }) {
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#3b82f6' : '#64748b';
  const r = 18;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <div className="relative w-10 h-10 shrink-0">
      <svg viewBox="0 0 44 44" className="w-10 h-10 -rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke="#1e2a45" strokeWidth="3.5" />
        <circle
          cx="22" cy="22" r={r}
          fill="none"
          stroke={color}
          strokeWidth="3.5"
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-300">
        {score}
      </span>
    </div>
  );
}

export default function Visitors() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [intentFilter, setIntentFilter] = useState('All');
  const [sortField, setSortField] = useState('totalVisits');
  const [sortDir, setSortDir] = useState('desc');

  const filtered = useMemo(() => {
    let list = [...companies];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.domain.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
      );
    }
    if (intentFilter !== 'All') {
      list = list.filter((c) => c.intent === intentFilter);
    }
    list.sort((a, b) => {
      let av = a[sortField], bv = b[sortField];
      if (sortField === 'lastSeen' || sortField === 'firstSeen') {
        av = new Date(av); bv = new Date(bv);
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return list;
  }, [search, intentFilter, sortField, sortDir]);

  function toggleSort(field) {
    if (sortField === field) setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    else { setSortField(field); setSortDir('desc'); }
  }

  function Th({ field, children }) {
    const active = sortField === field;
    return (
      <th
        onClick={() => toggleSort(field)}
        className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 cursor-pointer select-none hover:text-slate-300 transition-colors whitespace-nowrap"
      >
        <span className="flex items-center gap-1">
          {children}
          <span className="text-slate-700">
            {active ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
          </span>
        </span>
      </th>
    );
  }

  const highCount = companies.filter((c) => c.intent === 'High').length;

  return (
    <div className="p-6 space-y-5 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Visitors</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Identified companies visiting your site
          </p>
        </div>
        <button className="flex items-center gap-1.5 text-xs text-slate-400 bg-[#0f1623] border border-[#1e2a45] px-3 py-1.5 rounded-lg hover:border-slate-500 hover:text-white transition-colors">
          <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current">
            <path d="M8 11L4 7h3V1h2v6h3L8 11zM2 13h12v2H2v-2z" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Total identified', value: companies.length, color: 'text-blue-400' },
          { label: 'High intent', value: highCount, color: 'text-emerald-400' },
          { label: 'New this week', value: 6, color: 'text-violet-400' },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-2 bg-[#0f1623] border border-[#1e2a45] rounded-lg px-4 py-2.5">
            <span className={`text-xl font-bold ${s.color}`}>{s.value}</span>
            <span className="text-xs text-slate-500">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div className="bg-[#0f1623] border border-[#1e2a45] rounded-xl overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b border-[#1e2a45]">
          {/* Search */}
          <div className="relative">
            <svg viewBox="0 0 16 16" className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 fill-slate-500 pointer-events-none">
              <path d="M6.5 1a5.5 5.5 0 1 0 3.44 9.73l3.41 3.42 1.06-1.06-3.41-3.41A5.5 5.5 0 0 0 6.5 1zm0 1.5a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search company, industry, location…"
              className="w-64 bg-[#0b0f1a] border border-[#1e2a45] rounded-lg pl-8 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-600 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs">
                ✕
              </button>
            )}
          </div>

          {/* Intent filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-600">Intent:</span>
            {INTENT_OPTIONS.map((opt) => (
              <button
                key={opt}
                onClick={() => setIntentFilter(opt)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  intentFilter === opt
                    ? 'bg-blue-600/15 text-blue-400 border-blue-600/25'
                    : 'text-slate-500 border-transparent hover:border-[#1e2a45] hover:text-slate-300'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 font-mono">
              {filtered.length} of {companies.length}
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="border-b border-[#1e2a45]">
              <tr>
                <Th field="name">Company</Th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">Industry</th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">Last page</th>
                <Th field="avgDuration">Avg. session</Th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 whitespace-nowrap">Location</th>
                <Th field="totalVisits">Visits</Th>
                <Th field="lastSeen">Last seen</Th>
                <Th field="score">Score</Th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Intent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1a2235]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-16 text-center text-slate-600 text-sm">
                    No companies match your filter.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => {
                  const lastSession = c.sessions[0];
                  return (
                    <tr
                      key={c.id}
                      onClick={() => navigate(`/visitors/${c.id}`)}
                      className="group hover:bg-[#131d2e] cursor-pointer transition-colors"
                    >
                      {/* Company */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0"
                            style={{ background: c.logoColor + '20', border: `1px solid ${c.logoColor}40` }}
                          >
                            <span style={{ color: c.logoColor }}>{c.name[0]}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                              {c.name}
                            </p>
                            <p className="text-[11px] text-slate-600 font-mono">{c.domain}</p>
                          </div>
                        </div>
                      </td>

                      {/* Industry */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-slate-400 bg-[#1a2235] px-2 py-0.5 rounded-md">
                          {c.industry}
                        </span>
                      </td>

                      {/* Last page */}
                      <td className="px-4 py-3.5 max-w-[120px]">
                        <span className="text-xs font-mono text-slate-500 truncate block">
                          {lastSession?.pages?.[0] ?? '—'}
                        </span>
                      </td>

                      {/* Avg session */}
                      <td className="px-4 py-3.5">
                        <span className="text-xs text-slate-400 font-mono">{fmt(c.avgDuration)}</span>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base leading-none">{flag(c.countryCode)}</span>
                          <span className="text-xs text-slate-400">{c.location}</span>
                        </div>
                      </td>

                      {/* Visits */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-200">{c.totalVisits}</span>
                          <div className="flex gap-0.5">
                            {Array.from({ length: Math.min(c.totalVisits, 7) }).map((_, i) => (
                              <div key={i} className="w-1 h-3 rounded-sm bg-blue-600/60" />
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Last seen */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="text-xs text-slate-500 font-mono">{timeAgo(c.lastSeen)}</span>
                      </td>

                      {/* Score */}
                      <td className="px-4 py-3.5">
                        <ScoreDot score={c.score} />
                      </td>

                      {/* Intent */}
                      <td className="px-4 py-3.5">
                        <IntentBadge intent={c.intent} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-5 py-2.5 border-t border-[#1e2a45] text-xs text-slate-600">
          Showing {filtered.length} companies · Click any row to view full profile
        </div>
      </div>
    </div>
  );
}
