import {
    BellOutlined,
    LogoutOutlined,
    SearchOutlined,
    SettingOutlined,
    SunOutlined,
    MoonOutlined,
    MenuOutlined,
} from '@ant-design/icons';
import { Link, router, usePage } from '@inertiajs/react';
import { Avatar, Breadcrumb, Dropdown, Input } from 'antd';
import type { MenuProps } from 'antd';
import { useAppearance } from '@/hooks/use-appearance';
import { useInitials } from '@/hooks/use-initials';
import { useIsMobile } from '@/hooks/use-mobile';
import { logout } from '@/routes';
import { edit as profileEdit } from '@/routes/profile';
import type { BreadcrumbItem } from '@/types';

type AppSidebarHeaderProps = {
    breadcrumbs?: BreadcrumbItem[];
    onMobileMenuClick?: () => void;
};

export function AppSidebarHeader({ breadcrumbs = [], onMobileMenuClick }: AppSidebarHeaderProps) {
    const page = usePage();
    const { auth } = page.props;
    const getInitials = useInitials();
    const { resolvedAppearance, updateAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const user = auth.user;

    const userMenuItems: MenuProps['items'] = [
        {
            key: 'user-info',
            type: 'group',
            label: (
                <div className="py-1">
                    <div
                        className="font-semibold text-sm"
                        style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}
                    >
                        {user.name}
                    </div>
                    <div
                        className="text-xs"
                        style={{ color: isDark ? '#94a3b8' : '#64748b' }}
                    >
                        {user.email}
                    </div>
                </div>
            ),
        },
        { key: 'divider-1', type: 'divider' },
        {
            key: 'profile',
            icon: <SettingOutlined />,
            label: <Link href={profileEdit()}>Profile Settings</Link>,
        },
        { key: 'divider-2', type: 'divider' },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            danger: true,
            label: 'Sign out',
            onClick: () => router.visit(logout()),
        },
    ];

    const breadcrumbItems = breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return {
            title: isLast ? (
                <span style={{ color: isDark ? '#e2e8f0' : '#1e293b', fontWeight: 500 }}>
                    {item.title}
                </span>
            ) : (
                <Link
                    href={item.href}
                    style={{ color: isDark ? '#94a3b8' : '#64748b' }}
                    className="hover:text-indigo-500 transition-colors"
                >
                    {item.title}
                </Link>
            ),
        };
    });

    const headerBg = isDark
        ? 'rgba(30, 30, 46, 0.8)'
        : 'rgba(255, 255, 255, 0.8)';
    const borderColor = isDark ? '#2e2e42' : '#e5e7ef';

    return (
        <header
            className="flex items-center gap-4 px-4 sm:px-6"
            style={{
                height: 64,
                background: headerBg,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderBottom: `1px solid ${borderColor}`,
                position: 'sticky',
                top: 0,
                zIndex: 50,
            }}
        >
            {/* Mobile Menu Toggle */}
            <button
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl cursor-pointer border-0 transition-all"
                style={{
                    background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.06)',
                    color: isDark ? '#e2e8f0' : '#1e293b',
                }}
                onClick={onMobileMenuClick}
            >
                <MenuOutlined style={{ fontSize: 16 }} />
            </button>

            {/* Breadcrumbs */}
            <div className="flex-1 min-w-0 hidden sm:block">
                {breadcrumbs.length > 0 && (
                    <Breadcrumb
                        items={breadcrumbItems}
                        separator={
                            <span style={{ color: isDark ? '#4a4a6a' : '#cbd5e1' }}>/</span>
                        }
                        className="text-sm"
                    />
                )}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
                {/* Search */}
                <Input
                    prefix={<SearchOutlined style={{ color: isDark ? '#4a4a6a' : '#cbd5e1' }} />}
                    placeholder="Search..."
                    variant="filled"
                    size="small"
                    className="hidden md:flex"
                    style={{
                        width: 200,
                        borderRadius: 8,
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.06)',
                        border: 'none',
                        color: isDark ? '#94a3b8' : '#64748b',
                    }}
                />

                {/* Theme Toggle */}
                <button
                    onClick={() => updateAppearance(isDark ? 'light' : 'dark')}
                    className="w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer border-0 transition-all"
                    style={{
                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.06)',
                        color: isDark ? '#94a3b8' : '#64748b',
                    }}
                    title="Toggle theme"
                >
                    {isDark ? (
                        <SunOutlined style={{ fontSize: 15 }} />
                    ) : (
                        <MoonOutlined style={{ fontSize: 15 }} />
                    )}
                </button>

                {/* Notifications */}
                <Dropdown
                    trigger={['click']}
                    placement="bottomRight"
                    dropdownRender={() => (
                        <div
                            style={{
                                width: 320,
                                background: isDark ? '#1e1e2e' : '#fff',
                                borderRadius: 12,
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                border: `1px solid ${borderColor}`,
                                padding: '12px 0',
                            }}
                        >
                            <div className="px-4 pb-2 flex justify-between items-center border-b" style={{ borderColor }}>
                                <span className="font-semibold" style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}>
                                    Notifications
                                </span>
                                {user.unread_notifications_count !== undefined && user.unread_notifications_count > 0 && (
                                    <button
                                        onClick={() => router.post('/notifications/mark-all-read')}
                                        className="text-xs text-indigo-500 hover:text-indigo-600 border-0 bg-transparent cursor-pointer"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {user.notifications && user.notifications.length > 0 ? (
                                    user.notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className="px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer flex gap-3 transition-colors border-b last:border-0"
                                            style={{ borderColor }}
                                            onClick={() => {
                                                if (!notification.read_at) {
                                                    router.post(`/notifications/${notification.id}/mark-read`, {}, { preserveScroll: true });
                                                }
                                            }}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <div
                                                    className="text-sm"
                                                    style={{
                                                        color: isDark ? '#e2e8f0' : '#1e293b',
                                                        fontWeight: notification.read_at ? 400 : 600,
                                                    }}
                                                >
                                                    {notification.data?.message || 'New notification'}
                                                </div>
                                                <div className="text-xs mt-1" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                                                    {new Date(notification.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                            {!notification.read_at && (
                                                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-sm" style={{ color: isDark ? '#94a3b8' : '#64748b' }}>
                                        No new notifications
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                >
                    <button
                        className="relative w-9 h-9 flex items-center justify-center rounded-xl cursor-pointer border-0 transition-all"
                        style={{
                            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.06)',
                            color: isDark ? '#94a3b8' : '#64748b',
                        }}
                        title="Notifications"
                    >
                        <BellOutlined style={{ fontSize: 15 }} />
                        {user.unread_notifications_count !== undefined && user.unread_notifications_count > 0 && (
                            <span
                                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                                style={{ background: '#ef4444', boxShadow: '0 0 0 2px ' + (isDark ? '#1e1e2e' : '#fff') }}
                            />
                        )}
                    </button>
                </Dropdown>

                {/* User Avatar Dropdown */}
                <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
                    <button
                        className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl cursor-pointer border-0 transition-all"
                        style={{
                            background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.06)',
                        }}
                    >
                        <Avatar
                            src={user.avatar || undefined}
                            size={28}
                            style={{
                                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                fontSize: 11,
                                fontWeight: 600,
                                flexShrink: 0,
                                boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                            }}
                        >
                            {!user.avatar && getInitials(user.name)}
                        </Avatar>
                        <span
                            className="text-xs font-medium hidden sm:block"
                            style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}
                        >
                            {user.name.split(' ')[0]}
                        </span>
                    </button>
                </Dropdown>
            </div>
        </header>
    );
}
