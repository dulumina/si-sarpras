import { SunOutlined, MoonOutlined, DesktopOutlined } from '@ant-design/icons';
import { Segmented, Space } from 'antd';
import type { Appearance } from '@/hooks/use-appearance';
import { useAppearance } from '@/hooks/use-appearance';

export default function AppearanceToggleTab() {
    const { appearance, updateAppearance } = useAppearance();

    const options = [
        { 
            value: 'light', 
            label: (
                <Space>
                    <SunOutlined />
                    <span>Light</span>
                </Space>
            )
        },
        { 
            value: 'dark', 
            label: (
                <Space>
                    <MoonOutlined />
                    <span>Dark</span>
                </Space>
            )
        },
        { 
            value: 'system', 
            label: (
                <Space>
                    <DesktopOutlined />
                    <span>System</span>
                </Space>
            )
        },
    ];

    return (
        <Segmented
            size="large"
            options={options}
            value={appearance}
            onChange={(value) => updateAppearance(value as Appearance)}
            block
        />
    );
}
