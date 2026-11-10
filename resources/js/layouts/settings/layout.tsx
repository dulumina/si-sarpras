import {
    BgColorsOutlined,
    LockOutlined,
    SettingOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Link } from '@inertiajs/react';
import { Card, Layout, Menu } from 'antd';
import type { PropsWithChildren } from 'react';
import { useAppearance } from '@/hooks/use-appearance';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { edit as editAppearance } from '@/routes/appearance';
import { edit as editProfile } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import { index as teams } from '@/routes/teams';

const { Content, Sider } = Layout;

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const { resolvedAppearance } = useAppearance();
    const isDark = resolvedAppearance === 'dark';

    const borderColor = isDark ? '#2e2e42' : '#e5e7ef';
    const cardBg = isDark ? '#1e1e2e' : '#ffffff';

    const menuItems = [
        {
            key: editProfile().url,
            icon: <UserOutlined />,
            label: <Link href={editProfile().url}>Profile</Link>,
        },
        {
            key: editSecurity().url,
            icon: <LockOutlined />,
            label: <Link href={editSecurity().url}>Security</Link>,
        },
        {
            key: teams().url,
            icon: <TeamOutlined />,
            label: <Link href={teams().url}>Teams</Link>,
        },
        {
            key: editAppearance().url,
            icon: <BgColorsOutlined />,
            label: <Link href={editAppearance().url}>Appearance</Link>,
        },
    ];

    const selectedKey =
        menuItems.find((item) => isCurrentOrParentUrl(item.key))?.key || editProfile().url;

    return (
        <Content className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Page Header */}
                <div className="mb-6 flex items-center gap-3">
                    <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                        style={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                            boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
                        }}
                    >
                        <SettingOutlined style={{ fontSize: 18 }} />
                    </div>
                    <div>
                        <h2
                            className="text-lg font-bold m-0 leading-tight"
                            style={{ color: isDark ? '#e2e8f0' : '#1e293b' }}
                        >
                            Settings
                        </h2>
                        <p
                            className="text-sm m-0"
                            style={{ color: isDark ? '#94a3b8' : '#64748b' }}
                        >
                            Manage your profile and account settings
                        </p>
                    </div>
                </div>

                <Card
                    bordered={false}
                    style={{
                        background: cardBg,
                        borderRadius: 14,
                        border: `1px solid ${borderColor}`,
                        boxShadow: isDark
                            ? '0 2px 8px rgba(0,0,0,0.3)'
                            : '0 2px 8px rgba(0,0,0,0.06)',
                        overflow: 'hidden',
                    }}
                    styles={{ body: { padding: 0 } }}
                >
                    <Layout style={{ background: 'transparent', minHeight: 500 }}>
                        <Sider
                            width={220}
                            theme="light"
                            style={{
                                background: isDark
                                    ? 'rgba(255,255,255,0.02)'
                                    : 'rgba(99,102,241,0.02)',
                                borderRight: `1px solid ${borderColor}`,
                            }}
                            breakpoint="lg"
                            collapsedWidth={0}
                        >
                            <Menu
                                mode="inline"
                                selectedKeys={[selectedKey]}
                                items={menuItems}
                                style={{
                                    height: '100%',
                                    borderRight: 'none',
                                    background: 'transparent',
                                    paddingTop: 12,
                                    paddingBottom: 12,
                                }}
                            />
                        </Sider>
                        <Content className="p-6 sm:p-8">
                            <div className="max-w-2xl">{children}</div>
                        </Content>
                    </Layout>
                </Card>
            </div>
        </Content>
    );
}
