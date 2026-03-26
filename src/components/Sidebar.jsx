import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { companies } from '../data/mockData';

// ── Icons ──────────────────────────────────────────────────────────────────────
const IconDashboard = () => (
  <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current" aria-hidden>
    <rect x="2" y="2" width="7" height="7" rx="1.5" />
    <rect x="11" y="2" width="7" height="7" rx="1.5" />
    <rect x="2" y="11" width="7" height="7" rx="1.5" />
    <rect x="11" y="11" width="7" height="7" rx="1.5" />
  </svg>
);
const IconVisitors = () => (
  <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current" aria-hidden>
    <path d="M9 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm8 0a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6 14a5 5 0 0 0-5 5h10a5 5 0 0 0-5-5zm8 0a5 5 0 0 0-4.472 2.764A6.97 6.97 0 0 1 13 19h6a5 5 0 0 0-5-5z" />
  </svg>
);
const IconSettings = () => (
  <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current" aria-hidden>
    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 0 1-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 0 1-.567.267z" />
    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1-13a1 1 0 1 0-2 0v.092a4.535 4.535 0 0 0-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 1 0-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 1 0 2 0v-.092a4.535 4.535 0 0 0 1.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0 0 11 9.092V7.151c.391.127.68.317.843.504a1 1 0 1 0 1.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" />
  </svg>
);
const IconChevron = () => (
  <svg viewBox="0 0 16 16" className="w-3 h-3 fill-current" aria-hidden>
    <path d="M5.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

// ── Sidebar search with instant dropdown ───────────────────────────────────────
function SidebarSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const results = query.length > 1
    ? companies
        .filter(c =>
          c.name.toLowerCase().includes(query.toLowerCase()) ||
          c.domain.toLowerCase().includes(query.toLowerCase()) ||
          c.industry.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
    : [];

  function go(path) {
    navigate(path);
    setQuery('');
    setOpen(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && query.trim())
      go(`/visitors?q=${encodeURIComponent(query.trim())}`);
    if (e.key === 'Escape') { setQuery(''); setOpen(false); }
  }

  return (
    <div className="relative px-3 pb-3">
      <div className="relative">
        <svg viewBox="0 0 16 16" className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 fill-slate-500 pointer-events-none">
          <path d="M6.5 1a5.5 5.5 0 1 0 3.44 9.73l3.41 3.42 1.06-1.06-3.41-3.41A5.5 5.5 0 0 0 6.5 1zm0 1.5a4 4 0 1 1 0 8 4 4 0 0 1 0-8z" />
        </svg>
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder="Search companies…"
          className="w-full bg-[#0b0f1a] border border-[#1e2a45] rounded-lg pl-7 pr-6 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-600 transition-colors"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-[10px]"
          >✕</button>
        )}
      </div>

      {open && (results.length > 0 || query.length > 1) && (
        <div className="absolute left-3 right-3 top-full mt-1 bg-[#111827] border border-[#1e2a45] rounded-xl shadow-2xl z-50 overflow-hidden">
          {results.map(c => (
            <button
              key={c.id}
              onMouseDown={() => go(`/visitors/${c.id}`)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-[#1a2235] transition-colors text-left"
            >
              <div
                className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold shrink-0"
                style={{ background: c.logoColor + '22', color: c.logoColor }}
              >{c.name[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-200 truncate">{c.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{c.industry}</p>
              </div>
            </button>
          ))}
          {query.length > 1 && (
            <button
              onMouseDown={() => go(`/visitors?q=${encodeURIComponent(query.trim())}`)}
              className="w-full px-3 py-2 text-xs text-blue-400 hover:bg-[#1a2235] transition-colors text-left border-t border-[#1e2a45]"
            >
              See all results for &ldquo;{query}&rdquo; →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Nav item ──────────────────────────────────────────────────────────────────
function NavItem({ to, icon, label, badge, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
          isActive
            ? 'bg-blue-600/15 text-blue-400 border border-blue-600/20'
            : 'text-slate-400 hover:text-slate-200 hover:bg-[#1a2235] border border-transparent'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span className={`shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`}>
            {icon}
          </span>
          <span className="flex-1">{label}</span>
          {badge && (
            <span className="text-[10px] font-mono bg-[#1e2a45] text-slate-400 px-1.5 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
export default function Sidebar() {
  return (
    <aside className="w-[220px] shrink-0 h-full bg-[#0d1220] border-r border-[#1e2a45] flex flex-col">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-[#1e2a45]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <svg viewBox="0 0 20 20" aria-hidden>
              <circle cx="10" cy="10" r="3" fill="white" />
              <circle cx="10" cy="10" r="7" fill="none" stroke="white" strokeWidth="1.5" strokeDasharray="3 2.5" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none tracking-tight">TrackVis</p>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-none">Visitor Intelligence</p>
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className="px-4 py-3 border-b border-[#1e2a45]">
        <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-[#111827] border border-[#1e2a45] cursor-pointer hover:border-slate-600 transition-colors">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-[9px] font-bold text-white shrink-0">A</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-300 truncate leading-none">Acme Corp</p>
            <p className="text-[10px] text-slate-600 mt-0.5">Free plan</p>
          </div>
          <IconChevron />
        </div>
      </div>

      {/* Search */}
      <div className="px-0 pt-3">
        <SidebarSearch />
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 px-3 pb-2">Overview</p>
        <NavItem to="/" label="Dashboard" icon={<IconDashboard />} end />
        <NavItem to="/visitors" label="Visitors" icon={<IconVisitors />} badge="47" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 px-3 pb-2 pt-5">Account</p>
        <NavItem to="/settings" label="Settings" icon={<IconSettings />} />
      </nav>

      {/* Live status */}
      <div className="px-4 py-3 border-t border-[#1e2a45]">
        <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-emerald-950/30 border border-emerald-900/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-pulse shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-emerald-400 font-medium leading-none">Tracking active</p>
            <p className="text-[10px] text-emerald-700 mt-0.5">1 domain monitored</p>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="px-3 pb-4">
        <div className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg hover:bg-[#1a2235] cursor-pointer transition-colors group">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">AC</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-200 truncate leading-none">Alex Chen</p>
            <p className="text-[10px] text-slate-600 mt-0.5 truncate">alex@acme.com</p>
          </div>
          <span className="text-slate-700 group-hover:text-slate-500 transition-colors">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current">
              <circle cx="8" cy="3.5" r="1.2" /><circle cx="8" cy="8" r="1.2" /><circle cx="8" cy="12.5" r="1.2" />
            </svg>
          </span>
        </div>
      </div>
    </aside>
  );
}
