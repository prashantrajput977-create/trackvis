import { useParams, useNavigate } from 'react-router-dom';
import { companies, timeAgo, flag, intentColor, scoreColor, fmt } from '../data/mockData';

function ContactCard({ c }) {
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#0b0f1a] border border-[#1e2a45] hover:border-slate-600 transition-colors">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
        style={{ background: c.color + '33', border: `1px solid ${c.color}66` }}
      >
        <span style={{ color: c.color }}>{c.initials}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200">{c.name}</p>
        <p className="text-xs text-slate-500 mt-0.5">{c.title}</p>
        <p className="text-xs text-slate-600 font-mono mt-1 truncate">{c.email}</p>
      </div>
      <div className="flex flex-col gap-1.5 shrink-0">
        <button className="text-[11px] text-blue-400 hover:text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-md transition-colors whitespace-nowrap">
          LinkedIn →
        </button>
        <button
          onClick={() => navigator.clipboard?.writeText(c.email)}
          className="text-[11px] text-slate-500 hover:text-slate-300 bg-[#1a2235] border border-[#2d3f62] px-2 py-1 rounded-md transition-colors"
        >
          Copy email
        </button>
      </div>
    </div>
  );
}

function SessionCard({ s }) {
  return (
    <div className="relative pl-6">
      {/* Timeline dot */}
      <div className="absolute left-0 top-3 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-[#0f1623]" />
      <div className="ml-2 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-slate-500 font-mono">{timeAgo(s.timestamp)}</span>
          <span
            className="text-[11px] px-2 py-0.5 rounded-md font-medium text-white/80"
            style={{ background: s.sourceColor + '33', border: `1px solid ${s.sourceColor}55` }}
          >
            {s.source}
          </span>
          <span className="text-[11px] text-slate-600 font-mono">{fmt(s.duration)}</span>
          <span className="text-base leading-none">{flag(s.countryCode)}</span>
          <span className="text-[11px] text-slate-600">{s.city}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {s.pages.map((p, i) => (
            <span
              key={i}
              className="font-mono text-[11px] bg-[#0b0f1a] border border-[#1e2a45] text-slate-400 px-2 py-0.5 rounded-md"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, href }) {
  return (
    <div className="flex items-start justify-between py-2.5 border-b border-[#1a2235] last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      {href ? (
        <a href={href} target="_blank" rel="noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors text-right">
          {value}
        </a>
      ) : (
        <span className="text-xs text-slate-300 text-right max-w-[55%]">{value}</span>
      )}
    </div>
  );
}

export default function CompanyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const company = companies.find((c) => c.id === id);

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3">
        <p className="text-lg font-semibold">Company not found</p>
        <button onClick={() => navigate('/visitors')} className="text-blue-400 text-sm hover:underline">
          ← Back to visitors
        </button>
      </div>
    );
  }

  const ic = intentColor(company.intent);

  return (
    <div className="p-6 space-y-6 max-w-[1200px]">
      {/* Back */}
      <button
        onClick={() => navigate('/visitors')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-200 transition-colors"
      >
        <svg viewBox="0 0 16 16" className="w-4 h-4 fill-current">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        Back to Visitors
      </button>

      {/* Company header */}
      <div className="bg-[#0f1623] border border-[#1e2a45] rounded-xl p-6">
        <div className="flex items-start gap-5">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0"
            style={{ background: company.logoColor + '20', border: `1.5px solid ${company.logoColor}50` }}
          >
            <span style={{ color: company.logoColor }}>{company.name[0]}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-white">{company.name}</h1>
              <span className="text-sm text-slate-500 font-mono">{company.domain}</span>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${ic.bg} ${ic.text} ${ic.border}`}>
                {company.intent} intent
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-2 leading-relaxed max-w-2xl">
              {company.description}
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              {[
                { label: 'Industry', value: company.industry },
                { label: 'Size', value: company.size + ' employees' },
                { label: 'Location', value: `${flag(company.countryCode)} ${company.location}` },
                { label: 'Founded', value: company.founded },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-[10px] text-slate-600 uppercase tracking-wider">{item.label}</p>
                  <p className="text-xs text-slate-300 mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Score */}
          <div className="shrink-0 flex flex-col items-center gap-1">
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 56 56" className="w-16 h-16 -rotate-90">
                <circle cx="28" cy="28" r="24" fill="none" stroke="#1e2a45" strokeWidth="4" />
                <circle
                  cx="28" cy="28" r="24"
                  fill="none"
                  stroke={company.score >= 80 ? '#10b981' : company.score >= 60 ? '#3b82f6' : '#64748b'}
                  strokeWidth="4"
                  strokeDasharray={`${(company.score / 100) * 2 * Math.PI * 24} ${2 * Math.PI * 24}`}
                  strokeLinecap="round"
                />
              </svg>
              <span className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${scoreColor(company.score)}`}>
                {company.score}
              </span>
            </div>
            <p className="text-[10px] text-slate-600 uppercase tracking-wider">Lead score</p>
          </div>
        </div>

        {/* Visit stats */}
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#1e2a45]">
          {[
            { label: 'Total visits', value: company.totalVisits },
            { label: 'Page views', value: company.totalPages },
            { label: 'Avg. duration', value: fmt(company.avgDuration) },
            { label: 'First seen', value: timeAgo(company.firstSeen) },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Three-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        {/* Activity timeline */}
        <div className="xl:col-span-3 bg-[#0f1623] border border-[#1e2a45] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#1e2a45]">
            <h2 className="text-sm font-semibold text-white">Activity timeline</h2>
            <p className="text-xs text-slate-500 mt-0.5">{company.sessions.length} sessions recorded</p>
          </div>
          <div className="p-5">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[3px] top-3 bottom-3 w-px bg-[#1e2a45]" />
              {company.sessions.map((s) => (
                <SessionCard key={s.id} s={s} />
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Contacts + Company info */}
        <div className="xl:col-span-2 space-y-4">
          {/* Contacts */}
          <div className="bg-[#0f1623] border border-[#1e2a45] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1e2a45] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-white">Employee contacts</h2>
                <p className="text-xs text-slate-500 mt-0.5">{company.contacts.length} identified</p>
              </div>
              <button className="text-xs text-blue-400 hover:text-blue-300 border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 rounded-lg transition-colors">
                Find more
              </button>
            </div>
            <div className="p-4 space-y-3">
              {company.contacts.map((c) => (
                <ContactCard key={c.id} c={c} />
              ))}
            </div>
          </div>

          {/* Company info */}
          <div className="bg-[#0f1623] border border-[#1e2a45] rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#1e2a45]">
              <h2 className="text-sm font-semibold text-white">Company info</h2>
            </div>
            <div className="px-5 py-2">
              <InfoRow label="Funding" value={company.funding} />
              <InfoRow label="Valuation" value={company.valuation} />
              <InfoRow label="Employees" value={company.size} />
              <InfoRow label="Industry" value={company.industry} />
              <InfoRow label="Founded" value={company.founded} />
              <InfoRow label="Website" value={company.domain} href={company.website} />
              <InfoRow label="LinkedIn" value="View profile" href={company.linkedin} />
            </div>
            <div className="px-5 pb-4 pt-2">
              <button className="w-full text-xs bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Save to CRM
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
