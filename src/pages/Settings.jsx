import { useState } from 'react';

const TABS = ['Tracking Script', 'Integrations', 'Notifications', 'Team'];

function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-10 h-5.5 rounded-full transition-colors shrink-0 ${enabled ? 'bg-blue-600' : 'bg-[#1e2a45]'}`}
      style={{ height: '22px' }}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-[18px]' : 'translate-x-0'}`}
        style={{ width: '18px', height: '18px' }}
      />
    </button>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div className="mb-5">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
    </div>
  );
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
function TrackingScriptTab() {
  const [copied, setCopied] = useState(false);
  const snippet = `<script src="https://cdn.trackvis.io/tracker.min.js"
  data-site-id="tvs_prod_a1b2c3d4e5f6"
  defer>
</script>`;

  function copy() {
    navigator.clipboard?.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-7">
      <div>
        <SectionHeader
          title="Install tracking script"
          description="Add this snippet to every page you want to track. Paste it before the closing </body> tag."
        />
        <div className="relative">
          <pre className="bg-[#080c14] border border-[#1e2a45] rounded-xl p-5 text-xs font-mono text-blue-300 overflow-x-auto leading-relaxed">
            {snippet}
          </pre>
          <button
            onClick={copy}
            className={`absolute top-3 right-3 text-[11px] px-2.5 py-1.5 rounded-lg border transition-all ${
              copied
                ? 'bg-emerald-950/40 border-emerald-700 text-emerald-400'
                : 'bg-[#111827] border-[#1e2a45] text-slate-400 hover:border-slate-500 hover:text-white'
            }`}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="bg-[#0b0f1a] border border-[#1e2a45] rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Site ID</label>
          <div className="flex gap-2">
            <input
              readOnly
              value="tvs_prod_a1b2c3d4e5f6"
              className="flex-1 bg-[#111827] border border-[#1e2a45] rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none"
            />
            <button className="text-xs text-slate-400 bg-[#111827] border border-[#1e2a45] px-3 py-2 rounded-lg hover:border-slate-500 hover:text-white transition-colors whitespace-nowrap">
              Regenerate
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-1.5">Allowed domains</label>
          <input
            defaultValue="acme.com, app.acme.com"
            className="w-full bg-[#111827] border border-[#1e2a45] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-600 transition-colors placeholder-slate-600"
            placeholder="yourdomain.com"
          />
          <p className="text-[11px] text-slate-600 mt-1.5">Separate multiple domains with commas.</p>
        </div>
      </div>

      <div>
        <SectionHeader title="Verification" description="Check that the script is firing correctly on your site." />
        <div className="flex items-center gap-4 p-4 bg-[#0b0f1a] border border-[#1e2a45] rounded-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-400 live-pulse shrink-0" />
          <div>
            <p className="text-xs font-medium text-emerald-400">Script detected on acme.com</p>
            <p className="text-[11px] text-slate-600 mt-0.5">Last ping received 14 seconds ago</p>
          </div>
          <button className="ml-auto text-xs text-slate-400 hover:text-white transition-colors">
            Check again
          </button>
        </div>
      </div>
    </div>
  );
}

function IntegrationsTab() {
  const [states, setStates] = useState({
    hubspot: true,
    salesforce: false,
    slack: true,
    segment: false,
    zapier: false,
    webhook: false,
  });

  const toggle = (key) => setStates((s) => ({ ...s, [key]: !s[key] }));

  const integrations = [
    {
      key: 'hubspot',
      name: 'HubSpot',
      description: 'Sync identified companies and contacts directly to HubSpot CRM.',
      logo: '🟠',
      badge: 'Connected',
    },
    {
      key: 'salesforce',
      name: 'Salesforce',
      description: 'Push high-intent leads to Salesforce as accounts and contacts.',
      logo: '🔵',
      badge: null,
    },
    {
      key: 'slack',
      name: 'Slack',
      description: 'Get real-time alerts in Slack when high-intent companies visit.',
      logo: '🟣',
      badge: 'Connected',
    },
    {
      key: 'segment',
      name: 'Segment',
      description: 'Send TrackVis events to Segment for downstream tools.',
      logo: '🟢',
      badge: null,
    },
    {
      key: 'zapier',
      name: 'Zapier',
      description: 'Automate workflows by triggering Zaps on visitor events.',
      logo: '🟡',
      badge: null,
    },
    {
      key: 'webhook',
      name: 'Webhooks',
      description: 'POST visitor data to any custom endpoint in real time.',
      logo: '⚙️',
      badge: null,
    },
  ];

  return (
    <div className="space-y-3">
      <SectionHeader
        title="Integrations"
        description="Connect TrackVis to your existing stack to automate lead workflows."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {integrations.map((int) => (
          <div
            key={int.key}
            className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
              states[int.key]
                ? 'bg-blue-950/10 border-blue-800/30'
                : 'bg-[#0b0f1a] border-[#1e2a45]'
            }`}
          >
            <span className="text-2xl shrink-0 mt-0.5">{int.logo}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-slate-200">{int.name}</p>
                {int.badge && (
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/30 px-1.5 py-0.5 rounded-full">
                    {int.badge}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{int.description}</p>
              {states[int.key] && (
                <button className="text-[11px] text-blue-400 hover:text-blue-300 mt-2 transition-colors">
                  Configure →
                </button>
              )}
            </div>
            <Toggle enabled={states[int.key]} onChange={() => toggle(int.key)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [slackNotifs, setSlackNotifs] = useState(true);
  const [digestFreq, setDigestFreq] = useState('daily');

  const triggers = [
    { key: 'high_intent', label: 'High-intent company detected', description: 'Score ≥ 80, first visit', default: true },
    { key: 'return_visit', label: 'Return company visit', description: 'Company visits for the 3rd+ time', default: true },
    { key: 'pricing_page', label: 'Pricing page viewed', description: 'Any visitor hits /pricing', default: false },
    { key: 'enterprise_page', label: 'Enterprise page viewed', description: 'Visitor hits /enterprise', default: true },
    { key: 'contact_page', label: 'Contact page viewed', description: 'Visitor views /contact', default: false },
    { key: 'new_company', label: 'New company identified', description: 'First-ever visit from a company', default: false },
  ];

  const [triggerStates, setTriggerStates] = useState(
    Object.fromEntries(triggers.map((t) => [t.key, t.default]))
  );

  return (
    <div className="space-y-7">
      {/* Channels */}
      <div>
        <SectionHeader title="Notification channels" description="Choose how you want to receive alerts." />
        <div className="space-y-3">
          {[
            { key: 'email', label: 'Email notifications', sub: 'alex@acme.com', enabled: emailNotifs, setEnabled: setEmailNotifs },
            { key: 'slack', label: 'Slack notifications', sub: '#sales-alerts channel', enabled: slackNotifs, setEnabled: setSlackNotifs },
          ].map((ch) => (
            <div key={ch.key} className="flex items-center justify-between p-4 bg-[#0b0f1a] border border-[#1e2a45] rounded-xl">
              <div>
                <p className="text-sm font-medium text-slate-200">{ch.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{ch.sub}</p>
              </div>
              <Toggle enabled={ch.enabled} onChange={ch.setEnabled} />
            </div>
          ))}
        </div>
      </div>

      {/* Digest */}
      <div>
        <SectionHeader title="Daily digest" description="Summary of all visitor activity." />
        <div className="flex gap-2">
          {['off', 'daily', 'weekly'].map((f) => (
            <button
              key={f}
              onClick={() => setDigestFreq(f)}
              className={`text-xs px-4 py-2 rounded-lg border font-medium capitalize transition-all ${
                digestFreq === f
                  ? 'bg-blue-600/15 text-blue-400 border-blue-600/25'
                  : 'text-slate-500 border-[#1e2a45] hover:border-slate-500 hover:text-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Triggers */}
      <div>
        <SectionHeader title="Alert triggers" description="Choose which events send you a notification." />
        <div className="space-y-2">
          {triggers.map((t) => (
            <div key={t.key} className="flex items-center justify-between p-4 bg-[#0b0f1a] border border-[#1e2a45] rounded-xl">
              <div>
                <p className="text-sm font-medium text-slate-200">{t.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>
              </div>
              <Toggle
                enabled={triggerStates[t.key]}
                onChange={(v) => setTriggerStates((s) => ({ ...s, [t.key]: v }))}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamTab() {
  const [inviteEmail, setInviteEmail] = useState('');
  const members = [
    { name: 'Alex Chen', email: 'alex@acme.com', role: 'Owner', initials: 'AC', color: '#3b82f6', lastActive: '2 min ago' },
    { name: 'Jordan Park', email: 'j.park@acme.com', role: 'Admin', initials: 'JP', color: '#8b5cf6', lastActive: '1h ago' },
    { name: 'Morgan Ellis', email: 'm.ellis@acme.com', role: 'Member', initials: 'ME', color: '#10b981', lastActive: '3d ago' },
  ];

  const ROLE_COLORS = {
    Owner: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    Admin: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    Member: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  };

  return (
    <div className="space-y-7">
      {/* Members */}
      <div>
        <SectionHeader title="Team members" description="Manage who has access to your TrackVis workspace." />
        <div className="space-y-2">
          {members.map((m) => (
            <div key={m.email} className="flex items-center gap-4 p-4 bg-[#0b0f1a] border border-[#1e2a45] rounded-xl">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                style={{ background: m.color + '33', border: `1px solid ${m.color}66` }}
              >
                <span style={{ color: m.color }}>{m.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200">{m.name}</p>
                <p className="text-xs text-slate-500 font-mono">{m.email}</p>
              </div>
              <p className="text-[11px] text-slate-600 hidden sm:block">{m.lastActive}</p>
              <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${ROLE_COLORS[m.role]}`}>
                {m.role}
              </span>
              {m.role !== 'Owner' && (
                <button className="text-xs text-slate-600 hover:text-red-400 transition-colors shrink-0">
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Invite */}
      <div>
        <SectionHeader title="Invite team member" description="Invite someone by email to join your workspace." />
        <div className="flex gap-2">
          <input
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@company.com"
            className="flex-1 bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-blue-600 transition-colors placeholder-slate-600"
          />
          <select className="bg-[#0b0f1a] border border-[#1e2a45] rounded-lg px-3 py-2 text-xs text-slate-400 focus:outline-none focus:border-blue-600 transition-colors">
            <option>Member</option>
            <option>Admin</option>
          </select>
          <button className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap">
            Send invite
          </button>
        </div>
      </div>

      {/* Plan */}
      <div className="p-4 bg-gradient-to-br from-blue-950/30 to-violet-950/20 border border-blue-800/30 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Free plan · 3 / 3 seats used</p>
            <p className="text-xs text-slate-500 mt-0.5">Upgrade to Pro for unlimited seats and advanced features.</p>
          </div>
          <button className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap">
            Upgrade →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Settings() {
  const [activeTab, setActiveTab] = useState(0);

  const tabContent = [
    <TrackingScriptTab key="script" />,
    <IntegrationsTab key="integrations" />,
    <NotificationsTab key="notifications" />,
    <TeamTab key="team" />,
  ];

  return (
    <div className="p-6 max-w-[900px] space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white">Settings</h1>
        <p className="text-sm text-slate-500 mt-0.5">Configure tracking, integrations, and your workspace</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-[#1e2a45] pb-0">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-all ${
              activeTab === i
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>{tabContent[activeTab]}</div>
    </div>
  );
}
