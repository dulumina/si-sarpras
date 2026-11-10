import {
    ArrowRightOutlined,
    BellOutlined,
    CheckCircleFilled,
    DashboardOutlined,
    GithubOutlined,
    KeyOutlined,
    SafetyCertificateOutlined,
    TeamOutlined,
    ThunderboltOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from 'antd';
import { dashboard, login, readme, register } from '@/routes';

const features = [
    {
        icon: <SafetyCertificateOutlined />,
        title: 'Authentication',
        description:
            'Login, registrasi, verifikasi email, reset password, dan 2FA/TOTP sudah terpasang.',
        accent: 'text-indigo-500',
        bg: 'bg-indigo-500/10',
    },
    {
        icon: <KeyOutlined />,
        title: 'RBAC',
        description:
            'Role dan permission bergaya dot-notation dengan bypass super-admin yang aman.',
        accent: 'text-violet-500',
        bg: 'bg-violet-500/10',
    },
    {
        icon: <TeamOutlined />,
        title: 'Teams',
        description:
            'Multi-team, undangan via email, dan permission granular per anggota tim.',
        accent: 'text-amber-500',
        bg: 'bg-amber-500/10',
    },
    {
        icon: <DashboardOutlined />,
        title: 'Admin Panel',
        description:
            'Kelola user, role, permission, dan pindai permission yang belum terdaftar.',
        accent: 'text-sky-500',
        bg: 'bg-sky-500/10',
    },
    {
        icon: <BellOutlined />,
        title: 'Notifications',
        description:
            'Notifikasi in-app dengan badge unread, tandai dibaca, dan hapus.',
        accent: 'text-rose-500',
        bg: 'bg-rose-500/10',
    },
    {
        icon: <UserOutlined />,
        title: 'Settings',
        description:
            'Profil, keamanan, tema terang/gelap, dan skema warna yang bisa dipilih.',
        accent: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
    },
];

const stack = [
    'Laravel 13',
    'React 19',
    'Inertia.js 3',
    'Ant Design 6',
    'Tailwind 4',
    'TypeScript',
];

const stats = [
    { value: '8', label: 'Feature modules' },
    { value: '13+', label: 'Backend packages' },
    { value: '11+', label: 'Frontend packages' },
    { value: '100%', label: 'TypeScript' },
];

function BrandMark({ size = 36 }: { size?: number }) {
    return (
        <div
            className="flex flex-shrink-0 items-center justify-center rounded-xl font-bold text-white"
            style={{
                width: size,
                height: size,
                fontSize: size * 0.42,
                background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                boxShadow: '0 4px 14px rgba(79,70,229,0.35)',
            }}
        >
            R
        </div>
    );
}

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Laravel RBAC" />

            <div className="min-h-screen bg-background text-foreground">
                <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5 sm:px-6">
                        <Link
                            href="/"
                            className="flex items-center gap-3 no-underline"
                        >
                            <BrandMark size={34} />
                            <div className="leading-tight">
                                <div className="text-sm font-bold tracking-wide text-foreground">
                                    LARAVEL RBAC
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    Full-stack starter kit
                                </div>
                            </div>
                        </Link>

                        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
                            <a
                                href="#features"
                                className="transition-colors hover:text-foreground"
                            >
                                Features
                            </a>
                            <a
                                href="#stack"
                                className="transition-colors hover:text-foreground"
                            >
                                Stack
                            </a>
                            <Link
                                href={readme()}
                                className="transition-colors hover:text-foreground"
                            >
                                Documentation
                            </Link>
                        </nav>

                        <div className="flex items-center gap-2">
                            {auth.user ? (
                                <Link href={dashboard()}>
                                    <Button type="primary" size="large">
                                        Dashboard
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link href={login()}>
                                        <Button size="large" type="text">
                                            Sign in
                                        </Button>
                                    </Link>
                                    {canRegister && (
                                        <Link href={register()}>
                                            <Button type="primary" size="large">
                                                Get started
                                            </Button>
                                        </Link>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main>
                    <section className="relative overflow-hidden px-5 pt-16 pb-16 sm:px-6 lg:pt-24 lg:pb-24">
                        <div className="pointer-events-none absolute top-0 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

                        <div className="relative mx-auto max-w-4xl text-center">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
                                <ThunderboltOutlined />
                                Laravel 13 · React 19 · Inertia.js 3
                            </div>

                            <h1 className="mx-auto max-w-3xl text-4xl leading-[1.08] font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                Role-based access.{' '}
                                <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                                    Ready on day one.
                                </span>
                            </h1>

                            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                                Starter kit production-ready yang menggabungkan
                                Laravel 13, React 19, Inertia.js 3, dan Ant
                                Design 6 — lengkap dengan autentikasi, RBAC,
                                tim, notifikasi, dan admin panel.
                            </p>

                            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                                <Link
                                    href={
                                        auth.user
                                            ? dashboard()
                                            : canRegister
                                              ? register()
                                              : login()
                                    }
                                >
                                    <Button
                                        type="primary"
                                        size="large"
                                        icon={<ArrowRightOutlined />}
                                        style={{
                                            height: 48,
                                            paddingInline: 28,
                                            fontWeight: 600,
                                            background:
                                                'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                            border: 'none',
                                            boxShadow:
                                                '0 8px 24px rgba(79,70,229,0.35)',
                                        }}
                                    >
                                        {auth.user
                                            ? 'Open dashboard'
                                            : 'Start building'}
                                    </Button>
                                </Link>
                                <Link href={readme()}>
                                    <Button
                                        size="large"
                                        style={{
                                            height: 48,
                                            paddingInline: 28,
                                        }}
                                    >
                                        Read the docs
                                    </Button>
                                </Link>
                            </div>

                            <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
                                {[
                                    'Auth & 2FA',
                                    'RBAC',
                                    'Multi-team',
                                    'Admin panel',
                                ].map((item) => (
                                    <li
                                        key={item}
                                        className="flex items-center gap-1.5"
                                    >
                                        <CheckCircleFilled className="text-emerald-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </section>

                    <section className="px-5 pb-4 sm:px-6">
                        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
                            {stats.map((stat) => (
                                <div
                                    key={stat.label}
                                    className="bg-card px-4 py-6 text-center"
                                >
                                    <div className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-2xl font-extrabold text-transparent sm:text-3xl">
                                        {stat.value}
                                    </div>
                                    <div className="mt-1 text-xs font-medium text-muted-foreground">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section
                        id="features"
                        className="px-5 py-16 sm:px-6 lg:py-20"
                    >
                        <div className="mx-auto max-w-6xl">
                            <div className="mb-10 max-w-xl">
                                <p className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
                                    What's included
                                </p>
                                <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
                                    Everything you need, already wired.
                                </h2>
                                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                    Fokus ke fitur produkmu, bukan mengulang
                                    boilerplate autentikasi dan manajemen akses.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {features.map((feature) => (
                                    <div
                                        key={feature.title}
                                        className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                                    >
                                        <div
                                            className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl text-lg ${feature.bg} ${feature.accent}`}
                                        >
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-sm font-semibold text-foreground">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                            {feature.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="stack" className="px-5 pb-16 sm:px-6">
                        <div className="mx-auto max-w-6xl rounded-2xl border border-border bg-card p-6 sm:p-8">
                            <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                                Built with
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {stack.map((tech) => (
                                    <span
                                        key={tech}
                                        className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold text-foreground"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="px-5 pb-20 sm:px-6">
                        <div
                            className="mx-auto flex max-w-4xl flex-col items-center gap-6 overflow-hidden rounded-3xl px-6 py-12 text-center sm:px-12"
                            style={{
                                background:
                                    'linear-gradient(135deg, #4f46e5 0%, #7c3aed 55%, #a855f7 100%)',
                                boxShadow: '0 12px 40px rgba(79,70,229,0.3)',
                            }}
                        >
                            <h2 className="max-w-xl text-2xl font-bold text-white sm:text-3xl">
                                Mulai dari fondasi yang sudah benar.
                            </h2>
                            <p className="max-w-lg text-sm leading-relaxed text-indigo-100">
                                Clone, install, dan langsung bangun fitur bisnis
                                di atas autentikasi serta RBAC yang teruji.
                            </p>
                            <Link
                                href={
                                    auth.user
                                        ? dashboard()
                                        : canRegister
                                          ? register()
                                          : login()
                                }
                            >
                                <Button
                                    size="large"
                                    icon={<ArrowRightOutlined />}
                                    style={{
                                        height: 48,
                                        paddingInline: 28,
                                        fontWeight: 600,
                                        border: 'none',
                                        color: '#4f46e5',
                                    }}
                                >
                                    {auth.user
                                        ? 'Open dashboard'
                                        : 'Create free account'}
                                </Button>
                            </Link>
                        </div>
                    </section>
                </main>

                <footer className="border-t border-border bg-card">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row sm:px-6">
                        <div className="flex items-center gap-2.5">
                            <BrandMark size={28} />
                            <span className="text-sm font-medium text-muted-foreground">
                                Laravel RBAC
                            </span>
                        </div>
                        <div className="flex items-center gap-5 text-sm text-muted-foreground">
                            <Link
                                href={readme()}
                                className="transition-colors hover:text-foreground"
                            >
                                Documentation
                            </Link>
                            <a
                                href="https://laravel.com/docs"
                                target="_blank"
                                rel="noreferrer"
                                className="transition-colors hover:text-foreground"
                            >
                                Laravel
                            </a>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noreferrer"
                                className="transition-colors hover:text-foreground"
                                aria-label="GitHub"
                            >
                                <GithubOutlined className="text-lg" />
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
