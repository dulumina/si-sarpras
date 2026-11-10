import {
    CheckCircleOutlined,
    BookOutlined,
    ToolOutlined,
    CloudServerOutlined,
    DatabaseOutlined,
    CodeOutlined,
    RocketOutlined,
    ArrowLeftOutlined,
    GithubOutlined,
    NodeIndexOutlined,
    UserOutlined,
    SafetyOutlined,
    TeamOutlined,
    BellOutlined,
    SafetyCertificateOutlined,
    AppstoreOutlined,
    DashboardOutlined,
    SettingOutlined,
    CopyOutlined,
    CheckOutlined,
} from '@ant-design/icons';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { useAppearance } from '@/hooks/use-appearance';
import { home } from '@/routes';

const backendPackages = [
    { name: 'laravel/framework', version: '^13.7', description: 'Laravel framework core', color: '#ea580c' },
    { name: 'laravel/fortify', version: '^1.34', description: 'Authentication backend (login, register, 2FA)', color: '#ea580c' },
    { name: 'laravel/wayfinder', version: '^0.1.14', description: 'Type-safe route generation for JavaScript', color: '#ea580c' },
    { name: 'inertiajs/inertia-laravel', version: '^3.0', description: 'Inertia.js server-side adapter', color: '#7c3aed' },
    { name: 'spatie/laravel-permission', version: '^7.4', description: 'Role & permission management', color: '#0891b2' },
    { name: 'laravel/tinker', version: '^3.0', description: 'Interactive PHP REPL', color: '#ea580c' },
];

const devBackendPackages = [
    { name: 'pestphp/pest', version: '^4.7', description: 'Modern PHP testing framework', color: '#059669' },
    { name: 'pestphp/pest-plugin-laravel', version: '^4.1', description: 'Pest integration for Laravel', color: '#059669' },
    { name: 'laravel/pint', version: '^1.27', description: 'PHP code style fixer', color: '#ea580c' },
    { name: 'laravel/sail', version: '^1.58', description: 'Docker development environment', color: '#0369a1' },
    { name: 'laravel/boost', version: '^2.2', description: 'Laravel development assistant (MCP)', color: '#ea580c' },
    { name: 'laravel/pail', version: '^1.2.5', description: 'Log viewer for the terminal', color: '#ea580c' },
    { name: 'fakerphp/faker', version: '^1.24', description: 'Fake data generator for tests', color: '#7c3aed' },
];

const frontendPackages = [
    { name: 'react', version: '^19.2.0', description: 'UI library', color: '#0891b2' },
    { name: 'antd', version: '^6.3.7', description: 'Ant Design component library', color: '#1677ff' },
    { name: '@inertiajs/react', version: '^3.0.0', description: 'Inertia.js React adapter', color: '#7c3aed' },
    { name: '@inertiajs/vite', version: '^3.0.0', description: 'Inertia.js Vite plugin', color: '#7c3aed' },
    { name: 'tailwindcss', version: '^4.0.0', description: 'Utility-first CSS framework', color: '#0891b2' },
    { name: '@headlessui/react', version: '^2.2.0', description: 'Headless UI primitives', color: '#4f46e5' },
    { name: '@radix-ui/*', version: '^1.x', description: 'Accessible UI primitives (avatar, dialog, etc.)', color: '#be185d' },
    { name: 'lucide-react', version: '^0.475.0', description: 'Icon library', color: '#b45309' },
    { name: 'sonner', version: '^2.0.0', description: 'Toast notifications', color: '#059669' },
    { name: 'typescript', version: '^5.7.2', description: 'TypeScript language', color: '#1d4ed8' },
    { name: 'vite', version: '^8.0.0', description: 'Build tool and dev server', color: '#7c3aed' },
];

const featuresData = [
    {
        icon: <UserOutlined />,
        title: 'Auth & Security',
        accent: '#4f46e5',
        lightBg: '#eef2ff',
        items: [
            'Login & Registration with rate limiting',
            'Password reset via email',
            'Email verification flow',
            'Two-Factor Authentication (2FA / TOTP)',
            'Password confirmation for sensitive actions',
        ],
    },
    {
        icon: <DashboardOutlined />,
        title: 'Dashboard',
        accent: '#0891b2',
        lightBg: '#ecfeff',
        items: [
            'Welcome banner with stats cards',
            'Active users, roles & permissions metrics',
            'Recent activity table & system timeline',
        ],
    },
    {
        icon: <SettingOutlined />,
        title: 'Profile & Settings',
        accent: '#059669',
        lightBg: '#ecfdf5',
        items: [
            'Edit profile (name, email) with re-verification',
            'Account deletion with confirmation',
            'Security settings (password & 2FA management)',
            'Theme appearance (light / dark / system)',
        ],
    },
    {
        icon: <TeamOutlined />,
        title: 'Team Management',
        accent: '#d97706',
        lightBg: '#fffbeb',
        items: [
            'Multi-team support with personal team auto-creation',
            'Team switching & role-based membership',
            'Granular team permissions',
            'Team invitations via email with 3-day expiry',
        ],
    },
    {
        icon: <SafetyCertificateOutlined />,
        title: 'RBAC',
        accent: '#7c3aed',
        lightBg: '#f5f3ff',
        items: [
            'Spatie laravel-permission integration',
            'Super-admin global bypass',
            'Dot-notation permission naming',
            'Flexible role & permission assignment per user',
        ],
    },
    {
        icon: <AppstoreOutlined />,
        title: 'Admin Panel',
        accent: '#be185d',
        lightBg: '#fdf2f8',
        items: [
            'User management (create, edit roles, delete)',
            'Role management (create with permissions)',
            'Permission management (create, bulk-create)',
            'Permission scanner — detect missing permissions',
        ],
    },
    {
        icon: <BellOutlined />,
        title: 'Notifications',
        accent: '#ea580c',
        lightBg: '#fff7ed',
        items: [
            'In-app database notifications',
            'Unread count badge with dropdown',
            'Mark single or all notifications as read',
            'Delete notifications',
        ],
    },
    {
        icon: <SafetyOutlined />,
        title: 'Infrastructure',
        accent: '#0369a1',
        lightBg: '#eff6ff',
        items: [
            'Production-grade password rules (min:12)',
            'Immutable dates with CarbonImmutable',
            'Destructive DB commands prohibited in production',
            'Full TypeScript with strict mode',
        ],
    },
];

const requirements = [
    { icon: <CodeOutlined />, label: 'PHP', value: '^8.3', accent: '#7c3aed', bg: '#f5f3ff' },
    { icon: <DatabaseOutlined />, label: 'Database', value: 'MySQL / PostgreSQL / SQLite', accent: '#d97706', bg: '#fffbeb' },
    { icon: <CloudServerOutlined />, label: 'Web Server', value: 'Apache / Nginx', accent: '#059669', bg: '#ecfdf5' },
    { icon: <NodeIndexOutlined />, label: 'Node.js', value: '>= 18', accent: '#059669', bg: '#ecfdf5' },
    { icon: <ToolOutlined />, label: 'Composer', value: '^2.0', accent: '#ea580c', bg: '#fff7ed' },
    { icon: <GithubOutlined />, label: 'Git', value: 'Any modern version', accent: '#374151', bg: '#f3f4f6' },
];

const installSteps = [
    { step: '01', title: 'Clone the Repository', code: 'git clone https://github.com/dulumina/laravel_rbac.git\ncd laravel_rbac' },
    { step: '02', title: 'Install PHP Dependencies', code: 'composer install' },
    { step: '03', title: 'Environment Configuration', code: 'cp .env.example .env\nphp artisan key:generate' },
    { step: '04', title: 'Database Setup', code: '# Edit .env with your database credentials\nphp artisan migrate' },
    { step: '05', title: 'Install Frontend & Build', code: 'npm install\nnpm run build' },
    { step: '06', title: 'Run the Application', code: 'composer run dev', note: 'Starts Laravel dev server, queue worker, log viewer, and Vite concurrently.' },
];

function CodeBlock({ code, note }: { code: string; note?: string }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div>
            <div style={{ background: '#1e1b4b', borderRadius: 10, overflow: 'hidden' }}>
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.07)',
                }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                        {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
                            <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />
                        ))}
                    </div>
                    <button onClick={handleCopy} style={{
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        color: copied ? '#86efac' : 'rgba(255,255,255,0.4)',
                        fontSize: 11, display: 'flex', alignItems: 'center', gap: 4,
                        padding: '2px 6px', borderRadius: 4, transition: 'color 0.2s', fontFamily: 'inherit',
                    }}>
                        {copied ? <CheckOutlined /> : <CopyOutlined />}
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
                <pre style={{
                    margin: 0, padding: '14px 16px',
                    fontFamily: '"JetBrains Mono", "Cascadia Code", monospace',
                    fontSize: 13, lineHeight: 1.75, color: '#c7d2fe', whiteSpace: 'pre-wrap',
                }}>
                    {code.split('\n').map((line, i) => (
                        <div key={i}>
                            {line.startsWith('#')
                                ? <span style={{ color: '#6272a4' }}>{line}</span>
                                : <><span style={{ color: '#a5b4fc', opacity: 0.5 }}>$ </span><span style={{ color: '#e0e7ff' }}>{line}</span></>
                            }
                        </div>
                    ))}
                </pre>
            </div>
            {note && <p style={{ margin: '8px 0 0', fontSize: 12, color: '#9ca3af', lineHeight: 1.6 }}>{note}</p>}
        </div>
    );
}

function PackageCard({ pkg }: { pkg: { name: string; version: string; description: string; color: string } }) {
    const [hov, setHov] = useState(false);

    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: '#fff', border: `1px solid ${hov ? pkg.color + '50' : '#e5e7eb'}`,
                borderRadius: 10, padding: '13px 15px', display: 'flex', alignItems: 'flex-start', gap: 10,
                boxShadow: hov ? `0 4px 16px ${pkg.color}14` : 'none',
                transform: hov ? 'translateY(-1px)' : 'none',
                transition: 'all 0.18s', cursor: 'default',
            }}
        >
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: pkg.color, flexShrink: 0, marginTop: 5 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: 12, color: '#111827', fontWeight: 500 }}>
                        {pkg.name}
                    </span>
                    <span style={{
                        fontSize: 11, color: pkg.color, background: pkg.color + '14',
                        padding: '2px 8px', borderRadius: 4, fontFamily: 'monospace', flexShrink: 0, fontWeight: 600,
                    }}>
                        {pkg.version}
                    </span>
                </div>
                <p style={{ margin: '3px 0 0', fontSize: 12, color: '#9ca3af', lineHeight: 1.4 }}>{pkg.description}</p>
            </div>
        </div>
    );
}

function Eyebrow({ children, color }: { children: React.ReactNode; color: string }) {
    return (
        <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 10,
            fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color,
        }}>
            <div style={{ width: 18, height: 2, borderRadius: 1, background: color }} />
            {children}
        </div>
    );
}

export default function Readme() {
    return (
        <>
            <Head title="README — Laravel RBAC" />
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                .rbac * { box-sizing: border-box; }
                .rbac {
                    background: #f8fafc;
                    min-height: 100vh;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    color: #111827;
                    -webkit-font-smoothing: antialiased;
                }
                .rbac-nav {
                    position: sticky; top: 0; z-index: 50;
                    background: rgba(248,250,252,0.9);
                    backdrop-filter: blur(16px);
                    border-bottom: 1px solid #e5e7eb;
                }
                .rbac-wrap { max-width: 1060px; margin: 0 auto; padding: 0 24px; }
                .rbac-back {
                    display: inline-flex; align-items: center; gap: 7px;
                    padding: 7px 14px; background: #fff; border: 1px solid #e5e7eb;
                    border-radius: 8px; color: #374151; text-decoration: none;
                    font-size: 13px; font-family: 'Plus Jakarta Sans', sans-serif;
                    font-weight: 500; cursor: pointer; transition: all 0.15s;
                }
                .rbac-back:hover { border-color: #c7d2fe; background: #eef2ff; color: #4f46e5; }
                .hr { border: none; height: 1px; background: linear-gradient(90deg, transparent, #e5e7eb 25%, #e5e7eb 75%, transparent); margin: 0; }
                .feat-card { transition: box-shadow 0.2s, transform 0.2s; }
                .feat-card:hover { box-shadow: 0 8px 28px rgba(0,0,0,0.07); transform: translateY(-2px); }
                @media (max-width: 768px) {
                    .two-col { grid-template-columns: 1fr !important; }
                    .three-col { grid-template-columns: 1fr 1fr !important; }
                    .hero-h1 { font-size: 38px !important; }
                    .sdiv { display: none !important; }
                    .stats-inner { gap: 20px !important; }
                    .badges { gap: 6px !important; }
                }
                @media (max-width: 480px) {
                    .three-col { grid-template-columns: 1fr !important; }
                }
            `}</style>

            <div className="rbac">
                {/* NAV */}
                <nav className="rbac-nav">
                    <div className="rbac-wrap" style={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{
                                width: 32, height: 32, borderRadius: 8,
                                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono',
                            }}>R</div>
                            <span style={{ fontSize: 14, fontWeight: 700, color: '#1e1b4b', letterSpacing: '0.04em' }}>
                                LARAVEL RBAC
                            </span>
                        </div>
                        <Link href={home()}>
                            <div className="rbac-back">
                                <ArrowLeftOutlined style={{ fontSize: 11 }} />
                                Back to Home
                            </div>
                        </Link>
                    </div>
                </nav>

                <div className="rbac-wrap" style={{ paddingBottom: 80 }}>

                    {/* HERO */}
                    <section style={{ padding: '72px 0 60px', textAlign: 'center', position: 'relative' }}>
                        <div style={{
                            position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)',
                            width: 800, height: 340,
                            background: 'radial-gradient(ellipse at center, rgba(79,70,229,0.07) 0%, transparent 65%)',
                            pointerEvents: 'none',
                        }} />
                        <div style={{ position: 'relative' }}>
                            <Eyebrow color="#4f46e5">Full-Stack Starter Kit</Eyebrow>

                            <h1 className="hero-h1" style={{
                                fontSize: 60, fontWeight: 800, letterSpacing: '-0.035em',
                                lineHeight: 1.05, margin: '10px 0 20px', color: '#0f0a3c',
                            }}>
                                Laravel{' '}
                                <span style={{
                                    backgroundImage: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #be185d 100%)',
                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                }}>RBAC</span>
                            </h1>

                            <p style={{ fontSize: 17, color: '#6b7280', maxWidth: 540, margin: '0 auto 32px', lineHeight: 1.75 }}>
                                A production-ready starter combining{' '}
                                <strong style={{ color: '#374151', fontWeight: 600 }}>Laravel 13</strong>,{' '}
                                <strong style={{ color: '#374151', fontWeight: 600 }}>React 19</strong>,{' '}
                                <strong style={{ color: '#374151', fontWeight: 600 }}>Inertia.js 3</strong>, and{' '}
                                <strong style={{ color: '#374151', fontWeight: 600 }}>Ant Design 6</strong>{' '}
                                with RBAC, authentication, and team management built-in.
                            </p>

                            {/* Tech badges */}
                            <div className="badges" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8 }}>
                                {[
                                    { label: 'Laravel 13', color: '#ea580c', bg: '#fff7ed' },
                                    { label: 'React 19', color: '#0891b2', bg: '#ecfeff' },
                                    { label: 'Inertia.js 3', color: '#7c3aed', bg: '#f5f3ff' },
                                    { label: 'Ant Design 6', color: '#1677ff', bg: '#eff6ff' },
                                    { label: 'TypeScript', color: '#1d4ed8', bg: '#eff6ff' },
                                    { label: 'Tailwind 4', color: '#0891b2', bg: '#ecfeff' },
                                ].map((t, i) => (
                                    <span key={i} style={{
                                        display: 'inline-flex', alignItems: 'center',
                                        padding: '5px 13px', borderRadius: 100,
                                        fontSize: 12, fontWeight: 600, color: t.color,
                                        background: t.bg, border: `1px solid ${t.color}28`,
                                    }}>{t.label}</span>
                                ))}
                            </div>

                            {/* Stats card */}
                            <div style={{
                                marginTop: 44, background: '#fff',
                                border: '1px solid #e5e7eb', borderRadius: 16,
                                boxShadow: '0 4px 24px rgba(79,70,229,0.06)',
                                padding: '24px 40px',
                            }}>
                                <div className="stats-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
                                    {[
                                        { num: '8', label: 'Feature Modules' },
                                        { num: '13+', label: 'Backend Packages' },
                                        { num: '11+', label: 'Frontend Packages' },
                                        { num: '100%', label: 'TypeScript' },
                                    ].map((s, i, arr) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{
                                                    fontSize: 30, fontWeight: 800, fontFamily: 'JetBrains Mono',
                                                    backgroundImage: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                                                    backgroundClip: 'text', lineHeight: 1,
                                                }}>{s.num}</div>
                                                <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 5, fontWeight: 500 }}>{s.label}</div>
                                            </div>
                                            {i < arr.length - 1 && (
                                                <div className="sdiv" style={{ width: 1, height: 36, background: '#e5e7eb' }} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <hr className="hr" />

                    {/* FEATURES */}
                    <section style={{ padding: '60px 0' }}>
                        <div style={{ marginBottom: 36 }}>
                            <Eyebrow color="#7c3aed">What's Included</Eyebrow>
                            <h2 style={{ fontSize: 30, fontWeight: 800, margin: '8px 0 0', letterSpacing: '-0.025em', color: '#0f0a3c' }}>Features</h2>
                        </div>
                        <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                            {featuresData.map((f, i) => (
                                <div key={i} className="feat-card" style={{
                                    background: '#fff', border: '1px solid #e5e7eb',
                                    borderRadius: 14, padding: '20px',
                                    borderTop: `3px solid ${f.accent}`,
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                                        <div style={{
                                            width: 36, height: 36, borderRadius: 9,
                                            background: f.lightBg, color: f.accent,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                                        }}>{f.icon}</div>
                                        <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{f.title}</span>
                                    </div>
                                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                                        {f.items.map((item, j) => (
                                            <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>
                                                <CheckCircleOutlined style={{ color: f.accent, fontSize: 12, marginTop: 2, flexShrink: 0 }} />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    <hr className="hr" />

                    {/* REQUIREMENTS */}
                    <section style={{ padding: '60px 0' }}>
                        <div style={{ marginBottom: 36 }}>
                            <Eyebrow color="#059669">Prerequisites</Eyebrow>
                            <h2 style={{ fontSize: 30, fontWeight: 800, margin: '8px 0 0', letterSpacing: '-0.025em', color: '#0f0a3c' }}>System Requirements</h2>
                        </div>
                        <div className="three-col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                            {requirements.map((r, i) => (
                                <div key={i} style={{
                                    background: '#fff', border: '1px solid #e5e7eb',
                                    borderRadius: 12, padding: '18px 20px', transition: 'all 0.18s', cursor: 'default',
                                }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLDivElement).style.borderColor = r.accent + '50';
                                        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 4px 16px ${r.accent}14`;
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e7eb';
                                        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{
                                        width: 36, height: 36, borderRadius: 8, background: r.bg,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: r.accent, fontSize: 17, marginBottom: 12,
                                    }}>{r.icon}</div>
                                    <div style={{ fontSize: 11, color: '#9ca3af', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
                                        {r.label}
                                    </div>
                                    <div style={{ fontSize: 13, color: '#111827', fontFamily: 'JetBrains Mono', fontWeight: 500 }}>
                                        {r.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <hr className="hr" />

                    {/* INSTALLATION */}
                    <section style={{ padding: '60px 0' }}>
                        <div style={{ marginBottom: 36 }}>
                            <Eyebrow color="#d97706">Get Started</Eyebrow>
                            <h2 style={{ fontSize: 30, fontWeight: 800, margin: '8px 0 0', letterSpacing: '-0.025em', color: '#0f0a3c' }}>Installation Guide</h2>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {installSteps.map((s, i) => (
                                <div key={i} style={{ display: 'flex', gap: 20 }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 52, flexShrink: 0 }}>
                                        <div style={{
                                            width: 40, height: 40, borderRadius: 10, flexShrink: 0, zIndex: 1,
                                            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 600, color: '#fff',
                                        }}>{s.step}</div>
                                        {i < installSteps.length - 1 && (
                                            <div style={{ width: 2, flex: 1, margin: '6px 0', borderRadius: 1, background: 'linear-gradient(#c7d2fe, #ddd6fe)' }} />
                                        )}
                                    </div>
                                    <div style={{ flex: 1, paddingBottom: i < installSteps.length - 1 ? 24 : 0, paddingTop: 7 }}>
                                        <h4 style={{ fontSize: 14, fontWeight: 700, color: '#1f2937', margin: '0 0 10px' }}>{s.title}</h4>
                                        <CodeBlock code={s.code} note={s.note} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <hr className="hr" />

                    {/* PACKAGES */}
                    <section style={{ padding: '60px 0' }}>
                        <div style={{ marginBottom: 36 }}>
                            <Eyebrow color="#0891b2">Dependencies</Eyebrow>
                            <h2 style={{ fontSize: 30, fontWeight: 800, margin: '8px 0 0', letterSpacing: '-0.025em', color: '#0f0a3c' }}>Vendors & Packages</h2>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
                            {[
                                { label: 'Backend (PHP / Composer)', dot: '#ea580c', packages: backendPackages },
                                { label: 'Backend Dev (PHP / Composer)', dot: '#059669', packages: devBackendPackages },
                                { label: 'Frontend (npm)', dot: '#7c3aed', packages: frontendPackages },
                            ].map((group, gi) => (
                                <div key={gi}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: group.dot }} />
                                        <span style={{ fontSize: 12, fontWeight: 700, color: '#374151', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                                            {group.label}
                                        </span>
                                    </div>
                                    <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                        {group.packages.map((pkg, i) => <PackageCard key={i} pkg={pkg} />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Footer */}
                    <footer style={{
                        borderTop: '1px solid #e5e7eb', paddingTop: 28,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{
                                width: 26, height: 26, borderRadius: 6,
                                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: 11, fontWeight: 800, color: '#fff', fontFamily: 'JetBrains Mono',
                            }}>R</div>
                            <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>Laravel RBAC</span>
                        </div>
                        <p style={{ fontSize: 12, color: '#d1d5db', margin: 0, fontFamily: 'JetBrains Mono' }}>
                            Laravel 13 · React 19 · Inertia.js 3 · Ant Design 6
                        </p>
                    </footer>
                </div>
            </div>
        </>
    );
}