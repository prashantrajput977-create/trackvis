import { useState, useEffect, useCallback, useRef } from 'react';

// ─────────────────────────────────────────────────────────────
// Constants & tiny helpers
// ─────────────────────────────────────────────────────────────

const LS_KEY   = 'trackvis_v1';
const POLL_MS  = 10_000;
const MAX_ROWS = 100;

const SOURCE_META = {
  'LinkedIn':      { bg: '#0a66c2', label: 'LI' },
  'Google':        { bg: '#4285f4', label: 'G'  },
  'Twitter / X':   { bg: '#000000', label: 'X'  },
  'Bing':          { bg: '#008373', label: 'B'  },
  'DuckDuckGo':    { bg: '#de5833', label: 'DD' },
  'GitHub':        { bg: '#24292e', label: 'GH' },
  'Reddit':        { bg: '#ff4500', label: 'R'  },
  'Hacker News':   { bg: '#f26522', label: 'HN' },
  'Product Hunt':  { bg: '#da552f', label: 'PH' },
  'Facebook':      { bg: '#1877f2', label: 'FB' },
  'Direct':        { bg: '#334155', label: '→'  },
};

const DEMO_COMPANIES = [
  { org: 'Booking Holdings',     city: 'Amsterdam',   country: 'Netherlands',    cc: 'NL' },
  { org: 'Amadeus IT Group',     city: 'Madrid',      country: 'Spain',          cc: 'ES' },
  { org: 'Sabre Corporation',    city: 'Southlake',   country: 'United States',  cc: 'US' },
  { org: 'Expedia Group',        city: 'Seattle',     country: 'United States',  cc: 'US' },
  { org: 'TUI Group',            city: 'Hanover',     country: 'Germany',        cc: 'DE' },
  { org: 'Ryanair Holdings',     city: 'Dublin',      country: 'Ireland',        cc: 'IE' },
  { org: 'Singapore Airlines',   city: 'Singapore',   country: 'Singapore',      cc: 'SG' },
  { org: 'Lufthansa Systems',    city: 'Frankfurt',   country: 'Germany',        cc: 'DE' },
  { org: 'Travelport',           city: 'Langley',     country: 'United Kingdom', cc: 'GB' },
  { org: 'Airbnb Inc',           city: 'San Francisco', country: 'United States', cc: 'US' },
  { org: 'CWT (Carlson Wagonlit)', city: 'Minneapolis', country: 'United States', cc: 'US' },
  { org: 'Delta Air Lines',      city: 'Atlanta',     country: 'United States',  cc: 'US' },
  { org: 'Emirates Group',       city: 'Dubai',       country: 'UAE',            cc: 'AE' },
  { org: 'Finnair',              city: 'Helsinki',    country: 'Finland',        cc: 'FI' },
  { org: 'AS Tallink Group',     city: 'Tallinn',     country: 'Estonia',        cc: 'EE' },
];

const DEMO_SOURCES = [
  { source: 'LinkedIn',    ref: 'https://www.linkedin.com/feed/',      domain: 'linkedin.com' },
  { source: 'Google',      ref: 'https://www.google.com/search?q=...', domain: 'google.com'   },
  { source: 'Direct',      ref: '',                                     domain: 'Direct'        },
  { source: 'Twitter / X', ref: 'https://twitter.com',                 domain: 'twitter.com'  },
  { source: 'Hacker News', ref: 'https://news.ycombinator.com',        domain: 'ycombinator.com' },
  { source: 'GitHub',      ref: 'https://github.com',                  domain: 'github.com'   },
  { source: 'Product Hunt',ref: 'https://www.producthunt.com',         domain: 'producthunt.com' },
];

const DEMO_PAGES = ['/pricing', '/', '/features', '/integrations', '/demo', '/contact', '/blog/gds-guide', '/docs'];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function makeDemoVisit(id, ageMs = 0) {
  const co  = rand(DEMO_COMPANIES);
  const src = rand(DEMO_SOURCES);
  const pg  = rand(DEMO_PAGES);
  return {
    id:             `demo-${id}`,
    timestamp:      new Date(Date.now() - ageMs).toISOString(),
    referrer:       src.ref,
    referrerDomain: src.domain,
    referrerSource: src.source,
    page:           `https://your-travel-saas.com${pg}`,
    ip:             `${10 + Math.floor(Math.random()*200)}.x.x.x`,
    org:            co.org,
    city:           co.city,
    country:        co.country,
    country_code:   co.cc,
    isDemo:         true,
  };
}

function seedDemoVisits() {
  return Array.from({ length: 45 }, (_, i) =>
    makeDemoVisit(i, Math.random() * 48 * 3_600_000)
  ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function parseReferrer(ref) {
  if (!ref) return { domain: 'Direct', source: 'Direct' };
  try {
    const hostname = new URL(ref.startsWith('http') ? ref : `https://${ref}`).hostname.replace(/^www\./, '');
    const MAP = {
      'google':       'Google',
      'bing':         'Bing',
      'yahoo':        'Yahoo',
      'duckduckgo':   'DuckDuckGo',
      'linkedin':     'LinkedIn',
      'twitter':      'Twitter / X',
      'x.com':        'Twitter / X',
      'facebook':     'Facebook',
      'instagram':    'Instagram',
      'github':       'GitHub',
      'reddit':       'Reddit',
      'producthunt':  'Product Hunt',
      'ycombinator':  'Hacker News',
    };
    const matched = Object.keys(MAP).find(k => hostname.includes(k));
    return { domain: hostname, source: matched ? MAP[matched] : hostname };
  } catch {
    return { domain: ref.slice(0, 40), source: 'Other' };
  }
}

function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 60)    return `${s}s ago`;
  if (s < 3600)  return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

function flag(cc) {
  if (!cc) return '🌐';
  try { return [...cc.toUpperCase()].map(c => String.fromCodePoint(c.charCodeAt(0) + 127397)).join(''); }
  catch { return '🌐'; }
}

function pagePath(url) {
  try { return new URL(url).pathname || '/'; }
  catch { return url?.slice(0, 30) || '—'; }
}

function lsRead()         { try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; } }
function lsWrite(visits)  { try { localStorage.setItem(LS_KEY, JSON.stringify(visits)); } catch {} }

// ─────────────────────────────────────────────────────────────
// Small UI atoms
// ─────────────────────────────────────────────────────────────

function SourceChip({ source, count, active, onClick }) {
  const meta = SOURCE_META[source] || { bg: '#4f46e5', label: '?' };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all select-none
        ${active
          ? 'border-blue-500 bg-blue-950/60 text-blue-200 shadow shadow-blue-900/40'
          : 'border-[#1e2a45] bg-[#111827] text-slate-400 hover:border-slate-500 hover:text-slate-200'
        }`}
    >
      <span
        className="w-4 h-4 rounded-sm flex items-center justify-center text-[9px] font-bold text-white"
        style={{ background: meta.bg }}
      >
        {meta.label}
      </span>
      {source}
      {count !== undefined && (
        <span className={`ml-0.5 px-1.5 py-px rounded-full font-mono text-[10px] ${active ? 'bg-blue-800 text-blue-100' : 'bg-[#1e2a45] text-slate-400'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function Th({ children, field, sort, onSort }) {
  const active = sort.field === field;
  return (
    <th
      onClick={() => onSort(field)}
      className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500 cursor-pointer select-none whitespace-nowrap hover:text-slate-300 transition-colors"
    >
      <span className="flex items-center gap-1">
        {children}
        <span className="text-slate-700">
          {active ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : ' ↕'}
        </span>
      </span>
    </th>
  );
}

function StatCard({ value, label, sub, color }) {
  return (
    <div className="bg-[#0f1623] border border-[#1e2a45] rounded-xl px-5 py-4">
      <p className={`text-3xl font-bold tabular-nums ${color}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-1">{label}</p>
      {sub && <p className="text-[11px] text-slate-600 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────

export default function App() {
  const [visits,   setVisits]   = useState([]);
  const [filter,   setFilter]   = useState('all');   // source name or 'all'
  const [search,   setSearch]   = useState('');
  const [sort,     setSort]     = useState({ field: 'timestamp', dir: 'desc' });
  const [live,     setLive]     = useState(true);
  const [pulse,    setPulse]    = useState(false);   // header pulse on new visit
  const [newIds,   setNewIds]   = useState(new Set());
  const prevLen = useRef(0);

  // ── Load & merge ────────────────────────────────────────────
  const load = useCallback(async () => {
    let local = lsRead();

    // Try server (only works when vite dev server is running with our plugin)
    try {
      const res = await fetch('/api/visits');
      if (res.ok) {
        const server = await res.json();
        const ids = new Set(local.map(v => v.id));
        server.forEach(v => { if (!ids.has(v.id)) local.push(v); });
        local.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      }
    } catch { /* dev server middleware not available — fine */ }

    // Seed demo if still empty
    if (local.length === 0) {
      local = seedDemoVisits();
      lsWrite(local);
    }

    const slice = local.slice(0, MAX_ROWS);

    // Highlight genuinely new rows
    if (slice.length > prevLen.current && prevLen.current > 0) {
      const fresh = new Set(slice.slice(0, slice.length - prevLen.current).map(v => v.id));
      setNewIds(fresh);
      setPulse(true);
      setTimeout(() => { setNewIds(new Set()); setPulse(false); }, 2500);
    }
    prevLen.current = slice.length;
    setVisits(slice);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Poll
  useEffect(() => {
    if (!live) return;
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [live, load]);

  // Demo: drip-feed a fake new visit every 35 s so the live indicator looks real
  useEffect(() => {
    const id = setInterval(() => {
      const v = makeDemoVisit(`live-${Date.now()}`);
      setVisits(prev => {
        const next = [v, ...prev].slice(0, MAX_ROWS);
        lsWrite(next);
        return next;
      });
      setNewIds(new Set([v.id]));
      setPulse(true);
      prevLen.current += 1;
      setTimeout(() => { setNewIds(new Set()); setPulse(false); }, 2500);
    }, 35_000);
    return () => clearInterval(id);
  }, []);

  // ── Derived data ────────────────────────────────────────────
  const sourceCounts = visits.reduce((acc, v) => {
    const s = v.referrerSource || 'Direct';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {});

  const todayCount  = visits.filter(v => new Date(v.timestamp).toDateString() === new Date().toDateString()).length;
  const uniqueOrgs  = new Set(visits.map(v => v.org).filter(Boolean)).size;
  const topSource   = Object.entries(sourceCounts).sort((a, b) => b[1] - a[1])[0];

  const displayed = visits
    .filter(v => {
      if (filter !== 'all' && (v.referrerSource || 'Direct') !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return [v.org, v.city, v.country, v.referrerSource, v.page, v.ip]
          .some(f => f?.toLowerCase().includes(q));
      }
      return true;
    })
    .sort((a, b) => {
      const av = sort.field === 'timestamp' ? new Date(a[sort.field]) : (a[sort.field] || '');
      const bv = sort.field === 'timestamp' ? new Date(b[sort.field]) : (b[sort.field] || '');
      return sort.dir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });

  function toggleSort(field) {
    setSort(s => ({ field, dir: s.field === field && s.dir === 'desc' ? 'asc' : 'desc' }));
  }

  function exportCSV() {
    const cols = ['Timestamp', 'Company', 'City', 'Country', 'Source', 'Referrer Domain', 'Page', 'IP'];
    const rows = displayed.map(v => [
      v.timestamp, v.org || '', v.city || '', v.country || '',
      v.referrerSource || '', v.referrerDomain || '', v.page || '', v.ip || '',
    ]);
    const csv  = [cols, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    const a    = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: `trackvis-${new Date().toISOString().slice(0, 10)}.csv`,
    });
    a.click();
  }

  function clearData() {
    if (!confirm('Delete all visit data?')) return;
    localStorage.removeItem(LS_KEY);
    setVisits([]);
    prevLen.current = 0;
  }

  // ── Render ──────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0b0f1a] font-sans">

      {/* ── Topbar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-[#0b0f1a]/90 backdrop-blur border-b border-[#1e2a45]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            {/* Logo mark */}
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
              <svg viewBox="0 0 16 16" className="w-4 h-4 fill-white">
                <circle cx="8" cy="8" r="3"/>
                <path d="M8 1v2M8 13v2M1 8h2M13 8h2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-semibold text-white tracking-tight">TrackVis</span>
            <span className="hidden sm:inline text-[11px] text-slate-500 border border-[#1e2a45] rounded px-2 py-0.5">
              Visitor Intelligence
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live toggle */}
            <button
              onClick={() => setLive(l => !l)}
              className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-all ${
                live
                  ? 'border-emerald-700 bg-emerald-950/60 text-emerald-400'
                  : 'border-[#1e2a45] text-slate-500'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${live ? 'bg-emerald-400 live-pulse' : 'bg-slate-600'}`} />
              {live ? 'Live' : 'Paused'}
            </button>

            <button
              onClick={load}
              title="Refresh"
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-[#1e2a45] transition-colors"
            >
              {/* refresh icon */}
              <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current">
                <path d="M4.34 4.34A7 7 0 1 1 3 10H1a9 9 0 1 0 2.05-5.72L1 2.28V7h4.72L4.34 4.34z"/>
              </svg>
            </button>

            <button
              onClick={exportCSV}
              className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current">
                <path d="M8 11L4 7h3V1h2v6h3L8 11zM2 13h12v2H2v-2z"/>
              </svg>
              Export CSV
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-5">

        {/* ── Demo notice ─────────────────────────────────── */}
        <div className="flex items-start gap-3 bg-blue-950/30 border border-blue-800/40 rounded-xl px-4 py-3 text-sm text-blue-300">
          <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current mt-0.5 shrink-0 text-blue-400">
            <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-11H9V5h2v2zm0 6H9V9h2v4z"/>
          </svg>
          <span>
            <strong className="text-blue-200">Demo mode</strong> — showing simulated travel-tech visitors.
            Embed <code className="bg-blue-900/50 px-1 py-0.5 rounded text-xs font-mono">public/tracker.js</code> on
            your site (point it at <code className="bg-blue-900/50 px-1 py-0.5 rounded text-xs font-mono">http://localhost:3000</code>) to capture real visits.
          </span>
        </div>

        {/* ── Stat row ───────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard value={visits.length}  label="Visits tracked"   sub={`${todayCount} today`}                  color="text-blue-400"    />
          <StatCard value={uniqueOrgs}     label="Unique companies" sub="resolved by IP"                         color="text-violet-400"  />
          <StatCard value={Object.keys(sourceCounts).length} label="Traffic sources" sub="distinct referrers"   color="text-sky-400"     />
          <StatCard
            value={topSource?.[0] ?? '—'}
            label="Top source"
            sub={topSource ? `${topSource[1]} visits` : ''}
            color="text-emerald-400"
          />
        </div>

        {/* ── Source filter bar ──────────────────────────── */}
        <div className="bg-[#0f1623] border border-[#1e2a45] rounded-xl px-4 py-3 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Filter by source</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                filter === 'all'
                  ? 'border-slate-400 bg-slate-800 text-white'
                  : 'border-[#1e2a45] text-slate-500 hover:text-slate-300'
              }`}
            >
              All&nbsp;<span className="font-mono opacity-60">{visits.length}</span>
            </button>
            {Object.entries(sourceCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([src, cnt]) => (
                <SourceChip
                  key={src}
                  source={src}
                  count={cnt}
                  active={filter === src}
                  onClick={() => setFilter(filter === src ? 'all' : src)}
                />
              ))}
          </div>
        </div>

        {/* ── Table ─────────────────────────────────────── */}
        <div className="bg-[#0f1623] border border-[#1e2a45] rounded-xl overflow-hidden">

          {/* toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-[#1e2a45]">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white">Visitor log</span>
              <span className="text-xs bg-[#1e2a45] text-slate-400 px-2 py-0.5 rounded-full font-mono">
                {displayed.length}{filter !== 'all' ? ` / ${visits.length}` : ''}
              </span>
              {pulse && (
                <span className="text-xs text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-pulse inline-block" />
                  New visit
                </span>
              )}
            </div>
            {/* Search */}
            <div className="relative">
              <svg viewBox="0 0 16 16" className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 fill-slate-500 pointer-events-none">
                <path d="M6.5 1a5.5 5.5 0 1 0 3.44 9.73l3.41 3.42 1.06-1.06-3.41-3.41A5.5 5.5 0 0 0 6.5 1zm0 1.5a4 4 0 1 1 0 8 4 4 0 0 1 0-8z"/>
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search company, city, page…"
                className="w-56 bg-[#0b0f1a] border border-[#1e2a45] rounded-lg pl-8 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-600 transition-colors"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[680px]">
              <thead className="border-b border-[#1e2a45]">
                <tr>
                  <Th field="timestamp"      sort={sort} onSort={toggleSort}>Time</Th>
                  <Th field="org"            sort={sort} onSort={toggleSort}>Company</Th>
                  <Th field="city"           sort={sort} onSort={toggleSort}>Location</Th>
                  <Th field="referrerSource" sort={sort} onSort={toggleSort}>Source</Th>
                  <Th field="page"           sort={sort} onSort={toggleSort}>Page</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a2235]">
                {displayed.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center text-slate-600">
                      No visits match your filter.
                    </td>
                  </tr>
                ) : displayed.map(v => {
                  const isNew  = newIds.has(v.id);
                  const src    = v.referrerSource || 'Direct';
                  const meta   = SOURCE_META[src] || { bg: '#4f46e5', label: '?' };
                  return (
                    <tr
                      key={v.id}
                      className={`group transition-colors hover:bg-[#131d2e] ${isNew ? 'row-new bg-blue-950/20' : ''}`}
                    >
                      {/* Time */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {isNew && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 live-pulse" />}
                          <span className="font-mono text-xs text-slate-400">{timeAgo(v.timestamp)}</span>
                        </div>
                      </td>

                      {/* Company */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-md bg-[#1a2235] border border-[#263350] flex items-center justify-center text-[11px] font-bold text-slate-400 shrink-0 uppercase">
                            {(v.org || '?')[0]}
                          </div>
                          <div>
                            <p className="text-slate-200 text-xs font-medium leading-tight">{v.org || 'Unknown org'}</p>
                            <p className="font-mono text-[11px] text-slate-600">{v.ip}</p>
                          </div>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <span className="text-base leading-none">{flag(v.country_code)}</span>
                          <span>{v.city || '—'}</span>
                          {v.country_code && (
                            <span className="text-slate-600 font-mono">{v.country_code}</span>
                          )}
                        </div>
                      </td>

                      {/* Source */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium text-white/90"
                          style={{ background: `${meta.bg}33`, border: `1px solid ${meta.bg}55` }}
                        >
                          <span
                            className="w-3 h-3 rounded-sm flex items-center justify-center text-[8px] font-bold text-white"
                            style={{ background: meta.bg }}
                          >
                            {meta.label}
                          </span>
                          {src}
                        </span>
                        {v.referrerDomain && v.referrerDomain !== 'Direct' && (
                          <p className="font-mono text-[10px] text-slate-700 mt-0.5">{v.referrerDomain}</p>
                        )}
                      </td>

                      {/* Page */}
                      <td className="px-4 py-3 max-w-[180px]">
                        <span
                          className="font-mono text-[11px] text-slate-500 group-hover:text-slate-300 transition-colors truncate block"
                          title={v.page}
                        >
                          {pagePath(v.page)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* footer */}
          <div className="px-4 py-2.5 border-t border-[#1e2a45] flex items-center justify-between text-xs text-slate-600">
            <span>Polls every 10 s · max {MAX_ROWS} rows stored</span>
            <button onClick={clearData} className="hover:text-red-400 transition-colors">Clear all data</button>
          </div>
        </div>

        {/* ── Embed snippet ─────────────────────────────── */}
        <div className="bg-[#0f1623] border border-[#1e2a45] rounded-xl px-5 py-4 space-y-3">
          <p className="text-xs font-semibold text-slate-300">Embed tracker on any site</p>
          <pre className="bg-[#0b0f1a] border border-[#1e2a45] rounded-lg p-3 text-xs font-mono text-blue-300 overflow-x-auto">
{`<!-- Add before </body> on every page you want to track -->
<script src="http://localhost:3000/tracker.js"></script>`}
          </pre>
          <p className="text-xs text-slate-600">
            After deploying to Vercel, replace <code className="text-slate-400">localhost:3000</code> with your production URL.
            The tracker calls <code className="text-slate-400">/api/log</code> — CORS is open to all origins.
          </p>
        </div>

      </main>
    </div>
  );
}
