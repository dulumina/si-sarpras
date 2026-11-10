import { Layout, Drawer } from 'antd';
import { useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { useAppearance } from '@/hooks/use-appearance';
import { useIsMobile } from '@/hooks/use-mobile';
import type { AppLayoutProps } from '@/types';

const { Content } = Layout;

export default function AppSidebarLayout({ children, breadcrumbs = [] }: AppLayoutProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { resolvedAppearance } = useAppearance();
    const isMobile = useIsMobile();
    const isDark = resolvedAppearance === 'dark';

    // Close mobile drawer when window resizes to desktop
    if (!isMobile && mobileOpen) {
        setMobileOpen(false);
    }

    const sidebarWidth = isMobile ? 0 : (collapsed ? 64 : 240);
    const contentBg = isDark ? '#13131f' : '#f5f6fa';

    return (
        <Layout style={{ minHeight: '100vh', background: contentBg }}>
            {isMobile ? (
                <Drawer
                    placement="left"
                    closable={false}
                    onClose={() => setMobileOpen(false)}
                    open={mobileOpen}
                    width={240}
                    styles={{
                        body: { padding: 0, overflow: 'hidden' },
                        header: { display: 'none' }
                    }}
                >
                    <AppSidebar collapsed={false} onCollapse={() => setMobileOpen(false)} isMobile={true} />
                </Drawer>
            ) : (
                <AppSidebar collapsed={collapsed} onCollapse={setCollapsed} isMobile={false} />
            )}
            
            <Layout
                style={{
                    marginLeft: sidebarWidth,
                    transition: 'margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: contentBg,
                    minHeight: '100vh',
                }}
            >
                <AppSidebarHeader 
                    breadcrumbs={breadcrumbs} 
                    onMobileMenuClick={() => setMobileOpen(true)} 
                />
                <Content
                    style={{
                        background: contentBg,
                        minHeight: 'calc(100vh - 64px)',
                        padding: isMobile ? '16px' : '24px',
                    }}
                >
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
}
