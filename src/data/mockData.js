const T = Date.now();
const ago = {
  min: (n) => new Date(T - n * 60_000).toISOString(),
  hour: (n) => new Date(T - n * 3_600_000).toISOString(),
  day: (n) => new Date(T - n * 86_400_000).toISOString(),
};

function fmt(seconds) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}
export { fmt };

export const companies = [
  {
    id: 'stripe',
    name: 'Stripe',
    domain: 'stripe.com',
    logoColor: '#635bff',
    industry: 'Financial Technology',
    size: '4,000–5,000',
    location: 'San Francisco, CA',
    country: 'United States',
    countryCode: 'US',
    description: 'Stripe builds economic infrastructure for the internet. Businesses of every size use Stripe to accept payments, send payouts, and manage their businesses online.',
    founded: '2010',
    funding: '$2.2B raised · Series I',
    valuation: '$65B',
    website: 'https://stripe.com',
    linkedin: '#',
    score: 94,
    intent: 'High',
    totalVisits: 12,
    totalPages: 47,
    avgDuration: 324,
    firstSeen: ago.day(8),
    lastSeen: ago.min(2),
    contacts: [
      { id: 'ct1', name: 'James Harrington', title: 'VP of Platform Engineering', email: 'j.harrington@stripe.com', linkedin: '#', initials: 'JH', color: '#6366f1' },
      { id: 'ct2', name: 'Rachel Torres', title: 'Director of Business Development', email: 'r.torres@stripe.com', linkedin: '#', initials: 'RT', color: '#8b5cf6' },
      { id: 'ct3', name: 'Michael Osei', title: 'Senior Engineering Manager', email: 'm.osei@stripe.com', linkedin: '#', initials: 'MO', color: '#0ea5e9' },
    ],
    sessions: [
      { id: 'ss1', timestamp: ago.min(2), duration: 342, source: 'LinkedIn', sourceColor: '#0a66c2', pages: ['/pricing', '/enterprise', '/features', '/'], city: 'San Francisco', countryCode: 'US' },
      { id: 'ss2', timestamp: ago.hour(3), duration: 198, source: 'LinkedIn', sourceColor: '#0a66c2', pages: ['/pricing', '/integrations'], city: 'San Francisco', countryCode: 'US' },
      { id: 'ss3', timestamp: ago.day(1), duration: 467, source: 'Google', sourceColor: '#4285f4', pages: ['/features', '/integrations', '/pricing', '/security'], city: 'New York', countryCode: 'US' },
      { id: 'ss4', timestamp: ago.day(2), duration: 156, source: 'Direct', sourceColor: '#475569', pages: ['/security', '/enterprise'], city: 'San Francisco', countryCode: 'US' },
      { id: 'ss5', timestamp: ago.day(3), duration: 89, source: 'LinkedIn', sourceColor: '#0a66c2', pages: ['/'], city: 'San Francisco', countryCode: 'US' },
      { id: 'ss6', timestamp: ago.day(5), duration: 211, source: 'Google', sourceColor: '#4285f4', pages: ['/features', '/pricing'], city: 'Austin', countryCode: 'US' },
      { id: 'ss7', timestamp: ago.day(7), duration: 305, source: 'LinkedIn', sourceColor: '#0a66c2', pages: ['/integrations', '/docs'], city: 'San Francisco', countryCode: 'US' },
    ],
  },
  {
    id: 'notion',
    name: 'Notion Labs',
    domain: 'notion.so',
    logoColor: '#000000',
    industry: 'Productivity Software',
    size: '500–1,000',
    location: 'San Francisco, CA',
    country: 'United States',
    countryCode: 'US',
    description: 'Notion is the connected workspace where better, faster work happens. Notion combines notes, docs, wikis, and project management into one tool, used by millions of teams worldwide.',
    founded: '2016',
    funding: '$275M raised · Series C',
    valuation: '$10B',
    website: 'https://notion.so',
    linkedin: '#',
    score: 87,
    intent: 'High',
    totalVisits: 8,
    totalPages: 29,
    avgDuration: 267,
    firstSeen: ago.day(5),
    lastSeen: ago.min(45),
    contacts: [
      { id: 'ct4', name: 'Ivan Zhao', title: 'CEO & Co-founder', email: 'ivan@notion.so', linkedin: '#', initials: 'IZ', color: '#10b981' },
      { id: 'ct5', name: 'Sara Kim', title: 'Director of Partnerships', email: 's.kim@notion.so', linkedin: '#', initials: 'SK', color: '#f59e0b' },
    ],
    sessions: [
      { id: 'ss8', timestamp: ago.min(45), duration: 312, source: 'Google', sourceColor: '#4285f4', pages: ['/pricing', '/integrations', '/features'], city: 'San Francisco', countryCode: 'US' },
      { id: 'ss9', timestamp: ago.hour(5), duration: 198, source: 'Google', sourceColor: '#4285f4', pages: ['/features', '/pricing'], city: 'San Francisco', countryCode: 'US' },
      { id: 'ss10', timestamp: ago.day(1), duration: 445, source: 'Hacker News', sourceColor: '#f26522', pages: ['/blog/roi-guide', '/features', '/pricing', '/contact'], city: 'Remote', countryCode: 'US' },
      { id: 'ss11', timestamp: ago.day(3), duration: 122, source: 'Direct', sourceColor: '#475569', pages: ['/'], city: 'San Francisco', countryCode: 'US' },
    ],
  },
  {
    id: 'linear',
    name: 'Linear',
    domain: 'linear.app',
    logoColor: '#5e6ad2',
    industry: 'Developer Tools',
    size: '50–200',
    location: 'San Francisco, CA',
    country: 'United States',
    countryCode: 'US',
    description: 'Linear is the issue tracking tool that sets the standard for modern software development. Built for speed and efficiency, used by thousands of high-growth engineering teams.',
    founded: '2019',
    funding: '$52M raised · Series B',
    valuation: '$400M',
    website: 'https://linear.app',
    linkedin: '#',
    score: 79,
    intent: 'Medium',
    totalVisits: 6,
    totalPages: 18,
    avgDuration: 189,
    firstSeen: ago.day(4),
    lastSeen: ago.hour(2),
    contacts: [
      { id: 'ct6', name: 'Karri Saarinen', title: 'CEO & Co-founder', email: 'karri@linear.app', linkedin: '#', initials: 'KS', color: '#5e6ad2' },
      { id: 'ct7', name: 'Tuomas Artman', title: 'CTO & Co-founder', email: 't.artman@linear.app', linkedin: '#', initials: 'TA', color: '#8b5cf6' },
    ],
    sessions: [
      { id: 'ss12', timestamp: ago.hour(2), duration: 234, source: 'GitHub', sourceColor: '#24292e', pages: ['/integrations', '/features'], city: 'San Francisco', countryCode: 'US' },
      { id: 'ss13', timestamp: ago.day(1), duration: 167, source: 'GitHub', sourceColor: '#24292e', pages: ['/pricing'], city: 'San Francisco', countryCode: 'US' },
      { id: 'ss14', timestamp: ago.day(3), duration: 298, source: 'Hacker News', sourceColor: '#f26522', pages: ['/features', '/integrations', '/pricing'], city: 'Helsinki', countryCode: 'FI' },
    ],
  },
  {
    id: 'vercel',
    name: 'Vercel',
    domain: 'vercel.com',
    logoColor: '#000000',
    industry: 'Developer Infrastructure',
    size: '500–1,000',
    location: 'San Francisco, CA',
    country: 'United States',
    countryCode: 'US',
    description: 'Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration. Deploy web apps instantly and scale globally.',
    founded: '2015',
    funding: '$313M raised · Series D',
    valuation: '$2.5B',
    website: 'https://vercel.com',
    linkedin: '#',
    score: 83,
    intent: 'High',
    totalVisits: 9,
    totalPages: 31,
    avgDuration: 241,
    firstSeen: ago.day(6),
    lastSeen: ago.hour(1),
    contacts: [
      { id: 'ct8', name: 'Guillermo Rauch', title: 'CEO & Founder', email: 'g.rauch@vercel.com', linkedin: '#', initials: 'GR', color: '#0ea5e9' },
      { id: 'ct9', name: 'Tom Knoll', title: 'Head of Enterprise Sales', email: 't.knoll@vercel.com', linkedin: '#', initials: 'TK', color: '#10b981' },
    ],
    sessions: [
      { id: 'ss15', timestamp: ago.hour(1), duration: 189, source: 'Direct', sourceColor: '#475569', pages: ['/features', '/pricing'], city: 'San Francisco', countryCode: 'US' },
      { id: 'ss16', timestamp: ago.day(1), duration: 312, source: 'LinkedIn', sourceColor: '#0a66c2', pages: ['/enterprise', '/security', '/pricing'], city: 'New York', countryCode: 'US' },
      { id: 'ss17', timestamp: ago.day(4), duration: 267, source: 'GitHub', sourceColor: '#24292e', pages: ['/integrations', '/docs'], city: 'San Francisco', countryCode: 'US' },
    ],
  },
  {
    id: 'figma',
    name: 'Figma',
    domain: 'figma.com',
    logoColor: '#f24e1e',
    industry: 'Design & Collaboration',
    size: '1,000–2,000',
    location: 'San Francisco, CA',
    country: 'United States',
    countryCode: 'US',
    description: 'Figma is a collaborative interface design tool that brings product teams together in one place. From wireframes to handoff, Figma covers the entire design workflow.',
    founded: '2012',
    funding: '$333M raised · Series F',
    valuation: '$20B',
    website: 'https://figma.com',
    linkedin: '#',
    score: 71,
    intent: 'Medium',
    totalVisits: 5,
    totalPages: 14,
    avgDuration: 178,
    firstSeen: ago.day(3),
    lastSeen: ago.hour(4),
    contacts: [
      { id: 'ct10', name: 'Dylan Field', title: 'CEO & Co-founder', email: 'd.field@figma.com', linkedin: '#', initials: 'DF', color: '#f24e1e' },
      { id: 'ct11', name: 'Amanda Zhang', title: 'VP of Sales', email: 'a.zhang@figma.com', linkedin: '#', initials: 'AZ', color: '#a259ff' },
    ],
    sessions: [
      { id: 'ss18', timestamp: ago.hour(4), duration: 223, source: 'Product Hunt', sourceColor: '#da552f', pages: ['/pricing', '/features'], city: 'San Francisco', countryCode: 'US' },
      { id: 'ss19', timestamp: ago.day(2), duration: 145, source: 'Twitter / X', sourceColor: '#000000', pages: ['/features'], city: 'San Francisco', countryCode: 'US' },
    ],
  },
  {
    id: 'datadog',
    name: 'Datadog',
    domain: 'datadoghq.com',
    logoColor: '#632ca6',
    industry: 'Cloud Monitoring & Analytics',
    size: '5,000+',
    location: 'New York, NY',
    country: 'United States',
    countryCode: 'US',
    description: 'Datadog is the observability and security platform for cloud applications. It monitors servers, databases, tools, and services through a SaaS-based analytics platform.',
    founded: '2010',
    funding: 'Public · NYSE: DDOG',
    valuation: '$38B market cap',
    website: 'https://datadoghq.com',
    linkedin: '#',
    score: 88,
    intent: 'High',
    totalVisits: 11,
    totalPages: 38,
    avgDuration: 356,
    firstSeen: ago.day(7),
    lastSeen: ago.min(15),
    contacts: [
      { id: 'ct12', name: 'Olivier Pomel', title: 'CEO & Co-founder', email: 'o.pomel@datadoghq.com', linkedin: '#', initials: 'OP', color: '#632ca6' },
      { id: 'ct13', name: 'Marcus Johnson', title: 'VP of Strategic Partnerships', email: 'm.johnson@datadoghq.com', linkedin: '#', initials: 'MJ', color: '#f59e0b' },
      { id: 'ct14', name: 'Priya Patel', title: 'Enterprise Account Executive', email: 'p.patel@datadoghq.com', linkedin: '#', initials: 'PP', color: '#10b981' },
    ],
    sessions: [
      { id: 'ss20', timestamp: ago.min(15), duration: 412, source: 'Direct', sourceColor: '#475569', pages: ['/enterprise', '/security', '/integrations', '/pricing', '/contact'], city: 'New York', countryCode: 'US' },
      { id: 'ss21', timestamp: ago.hour(6), duration: 289, source: 'LinkedIn', sourceColor: '#0a66c2', pages: ['/integrations', '/features'], city: 'New York', countryCode: 'US' },
      { id: 'ss22', timestamp: ago.day(1), duration: 367, source: 'Google', sourceColor: '#4285f4', pages: ['/features', '/pricing', '/enterprise'], city: 'Austin', countryCode: 'US' },
      { id: 'ss23', timestamp: ago.day(3), duration: 198, source: 'LinkedIn', sourceColor: '#0a66c2', pages: ['/pricing'], city: 'New York', countryCode: 'US' },
    ],
  },
  {
    id: 'rippling',
    name: 'Rippling',
    domain: 'rippling.com',
    logoColor: '#f5a623',
    industry: 'HR & Workforce Management',
    size: '2,000–3,000',
    location: 'San Francisco, CA',
    country: 'United States',
    countryCode: 'US',
    description: "Rippling makes it easy to manage employees' payroll, benefits, expenses, devices, apps, and more in one place. It automates every element of the employee lifecycle.",
    founded: '2016',
    funding: '$1.2B raised · Series D',
    valuation: '$13.4B',
    website: 'https://rippling.com',
    linkedin: '#',
    score: 65,
    intent: 'Medium',
    totalVisits: 4,
    totalPages: 11,
    avgDuration: 143,
    firstSeen: ago.day(2),
    lastSeen: ago.hour(7),
    contacts: [
      { id: 'ct15', name: 'Parker Conrad', title: 'CEO & Co-founder', email: 'p.conrad@rippling.com', linkedin: '#', initials: 'PC', color: '#f5a623' },
    ],
    sessions: [
      { id: 'ss24', timestamp: ago.hour(7), duration: 167, source: 'LinkedIn', sourceColor: '#0a66c2', pages: ['/pricing', '/features'], city: 'San Francisco', countryCode: 'US' },
      { id: 'ss25', timestamp: ago.day(2), duration: 123, source: 'Google', sourceColor: '#4285f4', pages: ['/integrations'], city: 'San Francisco', countryCode: 'US' },
    ],
  },
  {
    id: 'intercom',
    name: 'Intercom',
    domain: 'intercom.com',
    logoColor: '#1f8ded',
    industry: 'Customer Messaging',
    size: '1,000–2,000',
    location: 'Dublin, Ireland',
    country: 'Ireland',
    countryCode: 'IE',
    description: 'Intercom is the complete AI-first customer service platform, giving exceptional experiences for support teams with AI agent, AI copilot, tickets, phone and more.',
    founded: '2011',
    funding: '$241M raised · Series D',
    valuation: '$1.3B',
    website: 'https://intercom.com',
    linkedin: '#',
    score: 76,
    intent: 'Medium',
    totalVisits: 7,
    totalPages: 22,
    avgDuration: 198,
    firstSeen: ago.day(6),
    lastSeen: ago.hour(3),
    contacts: [
      { id: 'ct16', name: 'Eoghan McCabe', title: 'CEO & Co-founder', email: 'e.mccabe@intercom.com', linkedin: '#', initials: 'EM', color: '#1f8ded' },
      { id: 'ct17', name: 'Claire Langan', title: 'Head of EMEA Sales', email: 'c.langan@intercom.com', linkedin: '#', initials: 'CL', color: '#10b981' },
    ],
    sessions: [
      { id: 'ss26', timestamp: ago.hour(3), duration: 245, source: 'LinkedIn', sourceColor: '#0a66c2', pages: ['/features', '/integrations'], city: 'Dublin', countryCode: 'IE' },
      { id: 'ss27', timestamp: ago.day(1), duration: 189, source: 'Google', sourceColor: '#4285f4', pages: ['/pricing', '/enterprise'], city: 'London', countryCode: 'GB' },
      { id: 'ss28', timestamp: ago.day(4), duration: 312, source: 'Direct', sourceColor: '#475569', pages: ['/security', '/integrations', '/pricing'], city: 'Dublin', countryCode: 'IE' },
    ],
  },
  {
    id: 'mixpanel',
    name: 'Mixpanel',
    domain: 'mixpanel.com',
    logoColor: '#7856ff',
    industry: 'Product Analytics',
    size: '500–1,000',
    location: 'San Francisco, CA',
    country: 'United States',
    countryCode: 'US',
    description: 'Mixpanel is a product analytics platform that helps companies make better decisions by measuring what matters, making informed decisions, and experimenting rapidly.',
    founded: '2009',
    funding: '$77M raised · Series C',
    valuation: '$865M',
    website: 'https://mixpanel.com',
    linkedin: '#',
    score: 58,
    intent: 'Low',
    totalVisits: 3,
    totalPages: 7,
    avgDuration: 98,
    firstSeen: ago.day(1),
    lastSeen: ago.hour(9),
    contacts: [
      { id: 'ct18', name: 'Amir Movafaghi', title: 'CEO', email: 'a.movafaghi@mixpanel.com', linkedin: '#', initials: 'AM', color: '#7856ff' },
    ],
    sessions: [
      { id: 'ss29', timestamp: ago.hour(9), duration: 112, source: 'Twitter / X', sourceColor: '#000000', pages: ['/pricing', '/'], city: 'San Francisco', countryCode: 'US' },
      { id: 'ss30', timestamp: ago.day(1), duration: 78, source: 'Direct', sourceColor: '#475569', pages: ['/features'], city: 'San Francisco', countryCode: 'US' },
    ],
  },
  {
    id: 'atlassian',
    name: 'Atlassian',
    domain: 'atlassian.com',
    logoColor: '#0052cc',
    industry: 'Developer Collaboration',
    size: '10,000+',
    location: 'Sydney, Australia',
    country: 'Australia',
    countryCode: 'AU',
    description: 'Atlassian provides collaboration, development, and issue tracking software for teams. Products include Jira, Confluence, Trello, and Bitbucket, used by over 250,000 companies worldwide.',
    founded: '2002',
    funding: 'Public · NASDAQ: TEAM',
    valuation: '$48B market cap',
    website: 'https://atlassian.com',
    linkedin: '#',
    score: 82,
    intent: 'High',
    totalVisits: 10,
    totalPages: 35,
    avgDuration: 287,
    firstSeen: ago.day(9),
    lastSeen: ago.min(30),
    contacts: [
      { id: 'ct19', name: 'Mike Cannon-Brookes', title: 'CEO & Co-founder', email: 'm.cannon-brookes@atlassian.com', linkedin: '#', initials: 'MB', color: '#0052cc' },
      { id: 'ct20', name: 'Scott Farquhar', title: 'CEO & Co-founder', email: 's.farquhar@atlassian.com', linkedin: '#', initials: 'SF', color: '#0ea5e9' },
      { id: 'ct21', name: 'Kelsey Morgan', title: 'VP of Enterprise Sales', email: 'k.morgan@atlassian.com', linkedin: '#', initials: 'KM', color: '#f59e0b' },
    ],
    sessions: [
      { id: 'ss31', timestamp: ago.min(30), duration: 334, source: 'LinkedIn', sourceColor: '#0a66c2', pages: ['/enterprise', '/security', '/integrations'], city: 'Sydney', countryCode: 'AU' },
      { id: 'ss32', timestamp: ago.hour(8), duration: 278, source: 'Direct', sourceColor: '#475569', pages: ['/pricing', '/features'], city: 'San Francisco', countryCode: 'US' },
      { id: 'ss33', timestamp: ago.day(2), duration: 412, source: 'Google', sourceColor: '#4285f4', pages: ['/features', '/integrations', '/enterprise', '/contact'], city: 'Sydney', countryCode: 'AU' },
      { id: 'ss34', timestamp: ago.day(5), duration: 189, source: 'LinkedIn', sourceColor: '#0a66c2', pages: ['/pricing'], city: 'Amsterdam', countryCode: 'NL' },
    ],
  },
];

export const chartData = [
  { label: 'Mar 12', date: '2026-03-12', visitors: 23, companies: 8 },
  { label: 'Mar 13', date: '2026-03-13', visitors: 31, companies: 11 },
  { label: 'Mar 14', date: '2026-03-14', visitors: 19, companies: 7 },
  { label: 'Mar 15', date: '2026-03-15', visitors: 28, companies: 10 },
  { label: 'Mar 16', date: '2026-03-16', visitors: 45, companies: 16 },
  { label: 'Mar 17', date: '2026-03-17', visitors: 52, companies: 18 },
  { label: 'Mar 18', date: '2026-03-18', visitors: 38, companies: 14 },
  { label: 'Mar 19', date: '2026-03-19', visitors: 41, companies: 15 },
  { label: 'Mar 20', date: '2026-03-20', visitors: 67, companies: 22 },
  { label: 'Mar 21', date: '2026-03-21', visitors: 59, companies: 20 },
  { label: 'Mar 22', date: '2026-03-22', visitors: 73, companies: 25 },
  { label: 'Mar 23', date: '2026-03-23', visitors: 81, companies: 28 },
  { label: 'Mar 24', date: '2026-03-24', visitors: 76, companies: 26 },
  { label: 'Mar 25', date: '2026-03-25', visitors: 92, companies: 31 },
  { label: 'Today',  date: '2026-03-26', visitors: 47, companies: 18 },
];

export const sourceBreakdown = [
  { source: 'LinkedIn',     pct: 38, count: 142, color: '#0a66c2' },
  { source: 'Google',       pct: 24, count: 90,  color: '#4285f4' },
  { source: 'Direct',       pct: 18, count: 67,  color: '#475569' },
  { source: 'Hacker News',  pct: 9,  count: 34,  color: '#f26522' },
  { source: 'GitHub',       pct: 6,  count: 22,  color: '#24292e' },
  { source: 'Product Hunt', pct: 5,  count: 19,  color: '#da552f' },
];

export const recentActivity = companies
  .flatMap((c) => c.sessions.map((s) => ({ ...s, company: c })))
  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  .slice(0, 12);

export function timeAgo(iso) {
  const s = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function flag(cc) {
  if (!cc) return '\uD83C\uDF10';
  try {
    return [...cc.toUpperCase()].map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397)).join('');
  } catch { return '\uD83C\uDF10'; }
}

export function intentColor(intent) {
  if (intent === 'High')   return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' };
  if (intent === 'Medium') return { bg: 'bg-amber-500/10',   text: 'text-amber-400',   border: 'border-amber-500/20'   };
  return                          { bg: 'bg-slate-500/10',   text: 'text-slate-400',   border: 'border-slate-500/20'   };
}

export function scoreColor(score) {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-blue-400';
  return 'text-slate-400';
}
