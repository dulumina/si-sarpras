import { PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Head, Link } from '@inertiajs/react';
import { Typography, List, Tag, Button, Tooltip, Space } from 'antd';
import CreateTeamModal from '@/components/create-team-modal';
import { edit, index } from '@/routes/teams';
import type { Team } from '@/types';

const { Title, Text } = Typography;

type Props = {
    teams: Team[];
};

export default function TeamsIndex({ teams }: Props) {
    return (
        <>
            <Head title="Teams" />

            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <Title level={4}>Teams</Title>
                        <Text type="secondary">Manage your teams and team memberships</Text>
                    </div>

                    <CreateTeamModal>
                        <Button type="primary" icon={<PlusOutlined />} size="large">
                            New Team
                        </Button>
                    </CreateTeamModal>
                </div>

                <List
                    itemLayout="horizontal"
                    dataSource={teams}
                    locale={{ emptyText: <Text type="secondary">You don't belong to any teams yet.</Text> }}
                    renderItem={(team) => (
                        <List.Item
                            actions={[
                                <Tooltip title={team.role === 'member' ? 'View Team' : 'Edit Team'} key="action">
                                    <Link href={edit(team.slug).url}>
                                        <Button
                                            icon={team.role === 'member' ? <EyeOutlined /> : <EditOutlined />}
                                            type="text"
                                        />
                                    </Link>
                                </Tooltip>
                            ]}
                            className="bg-white hover:bg-gray-50 transition-colors p-5 rounded-xl mb-3 border border-gray-100 shadow-sm"
                        >
                            <List.Item.Meta
                                title={
                                    <Space>
                                        <Text strong>{team.name}</Text>
                                        {team.isPersonal && (
                                            <Tag color="blue" className="rounded-full">Personal</Tag>
                                        )}
                                    </Space>
                                }
                                description={<Text type="secondary">{team.roleLabel}</Text>}
                            />
                        </List.Item>
                    )}
                />
            </div>
        </>
    );
}

TeamsIndex.layout = {
    breadcrumbs: [
        {
            title: 'Teams',
            href: index().url,
        },
    ],
};
