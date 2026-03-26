import { NavLink } from 'react-router-dom';

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

export default function Sidebar() {
  return (
    <aside className="w-[220px] shrink-0 h-full bg-[#0d1220] border-r border-[#1e2a45] flex flex-col">
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

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 px-3 pb-2">Overview</p>
        <NavItem to="/" label="Dashboard" icon={<IconDashboard />} end />
        <NavItem to="/visitors" label="Visitors" icon={<IconVisitors />} badge="47" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-600 px-3 pb-2 pt-5">Account</p>
        <NavItem to="/settings" label="Settings" icon={<IconSettings />} />
      </nav>

      <div className="px-4 py-3 border-t border-[#1e2a45]">
        <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-emerald-950/30 border border-emerald-900/30">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 live-pulse shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-emerald-400 font-medium leading-none">Tracking active</p>
            <p className="text-[10px] text-emerald-700 mt-0.5">1 domain monitored</p>
          </div>
        </div>
      </div>

      <div className="px-3 pb-4">
        <div className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg hover:bg-[#1a2235] cursor-pointer transition-colors group">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">AC</div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-slate-200 truncate leading-none">Alex Chen</p>
            <p className="text-[10px] text-slate-600 mt-0.5 truncate">alex@acme.com</p>
          </div>
          <span className="text-slate-700 group-hover:text-slate-500 transition-colors">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-current">
              <circle cx="8" cy="3.5" r="1.2" />
              <circle cx="8" cy="8" r="1.2" />
              <circle cx="8" cy="12.5" r="1.2" />
            </svg>
          </span>
        </div>
      </div>
    </aside>
  );
}
