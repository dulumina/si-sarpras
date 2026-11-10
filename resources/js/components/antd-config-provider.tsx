import { App, ConfigProvider, theme } from 'antd';
import type { ReactNode } from 'react';
import { useAppearance } from '@/hooks/use-appearance';
import { useColorTheme } from '@/hooks/use-color-theme';

function hexToRgb(hex: string): string {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (!result) {
        return '99, 102, 241';
    }

    return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

export default function AntdConfigProvider({ children }: { children: ReactNode }) {
    const { resolvedAppearance } = useAppearance();
    const { color: primaryColor } = useColorTheme();
    const isDark = resolvedAppearance === 'dark';
    const primaryRgb = hexToRgb(primaryColor);

    return (
        <ConfigProvider
            theme={{
                algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
                token: {
                    colorPrimary: primaryColor,
                    colorSuccess: '#10b981',
                    colorWarning: '#f59e0b',
                    colorError: '#ef4444',
                    colorInfo: '#3b82f6',
                    borderRadius: 10,
                    borderRadiusLG: 14,
                    fontFamily:
                        'Inter Variable, Inter, ui-sans-serif, system-ui, -apple-system, sans-serif',
                    fontSize: 14,
                    colorBgContainer: isDark ? '#1e1e2e' : '#ffffff',
                    colorBgElevated: isDark ? '#2a2a3e' : '#ffffff',
                    colorBgLayout: isDark ? '#13131f' : '#f5f6fa',
                    colorBorder: isDark ? '#2e2e42' : '#e5e7ef',
                    colorText: isDark ? '#e2e8f0' : '#1e293b',
                    colorTextSecondary: isDark ? '#94a3b8' : '#64748b',
                    colorSplit: isDark ? '#2e2e42' : '#e5e7ef',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                    boxShadowSecondary:
                        '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    wireframe: false,
                },
                components: {
                    Layout: {
                        siderBg: isDark ? '#13131f' : '#ffffff',
                        headerBg: isDark ? '#1e1e2e' : '#ffffff',
                        bodyBg: isDark ? '#13131f' : '#f5f6fa',
                        triggerBg: isDark ? '#1e1e2e' : '#f5f6fa',
                        triggerColor: isDark ? '#94a3b8' : '#64748b',
                    },
                    Menu: {
                        darkItemBg: 'transparent',
                        darkSubMenuItemBg: 'transparent',
                        itemBg: 'transparent',
                        subMenuItemBg: 'transparent',
                        itemSelectedBg: isDark ? `rgba(${primaryRgb}, 0.15)` : `rgba(${primaryRgb}, 0.08)`,
                        itemSelectedColor: primaryColor,
                        itemHoverBg: isDark ? 'rgba(255,255,255,0.05)' : `rgba(${primaryRgb}, 0.06)`,
                        itemHoverColor: primaryColor,
                        itemColor: isDark ? '#94a3b8' : '#64748b',
                        itemActiveBg: isDark ? `rgba(${primaryRgb}, 0.2)` : `rgba(${primaryRgb}, 0.1)`,
                        activeBarWidth: 3,
                        activeBarBorderWidth: 3,
                        iconSize: 16,
                        collapsedIconSize: 18,
                    },
                    Card: {
                        headerBg: 'transparent',
                        borderRadiusLG: 14,
                    },
                    Button: {
                        borderRadius: 8,
                        primaryShadow: 'none',
                    },
                    Table: {
                        borderRadius: 10,
                        headerBg: isDark ? '#1e1e2e' : '#f8fafc',
                        rowHoverBg: isDark ? 'rgba(255,255,255,0.03)' : `rgba(${primaryRgb}, 0.04)`,
                    },
                },
            }}
        >
            <App>{children}</App>
        </ConfigProvider>
    );
}
