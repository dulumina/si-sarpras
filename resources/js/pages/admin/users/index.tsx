import {
    DeleteOutlined,
    EditOutlined,
    MoreOutlined,
    UserAddOutlined,
} from '@ant-design/icons';
import { Head, Link, router } from '@inertiajs/react';
import { Button, Dropdown, Modal, Space, Tag, Typography } from 'antd';
import type { MenuProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    create,
    destroy,
    edit,
    index,
} from '@/actions/App/Http/Controllers/Admin/UserController';
import DataTable from '@/components/data-table';
import PageHeader from '@/components/page-header';
import Panel from '@/components/panel';

interface User {
    id: number;
    name: string;
    email: string;
    roles: string[];
    created_at: string;
}

interface Props {
    users: User[];
    total: number;
    page: number;
    perPage: number;
    search: string;
}

export default function UserIndex({
    users,
    total,
    page,
    perPage,
    search,
}: Props) {
    const columns: ColumnsType<User> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space direction="vertical" size={0}>
                    <Typography.Text strong>{text}</Typography.Text>
                    <Typography.Text type="secondary">
                        {record.email}
                    </Typography.Text>
                </Space>
            ),
        },
        {
            title: 'Roles',
            dataIndex: 'roles',
            key: 'roles',
            render: (roles: string[]) => (
                <>
                    {roles.map((role) => (
                        <Tag color="blue" key={role}>
                            {role}
                        </Tag>
                    ))}
                </>
            ),
        },
        {
            title: 'Created At',
            dataIndex: 'created_at',
            key: 'created_at',
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 60,
            render: (_, record) => {
                const items: MenuProps['items'] = [
                    {
                        key: 'edit',
                        icon: <EditOutlined />,
                        label: 'Edit',
                        onClick: () => router.get(edit(record.id).url),
                    },
                    { type: 'divider' },
                    {
                        key: 'delete',
                        icon: <DeleteOutlined />,
                        label: 'Delete',
                        danger: true,
                        onClick: () =>
                            Modal.confirm({
                                title: 'Delete user',
                                content: `Are you sure you want to delete "${record.name}"?`,
                                okText: 'Yes',
                                cancelText: 'No',
                                okType: 'danger',
                                onOk: () =>
                                    router.delete(destroy(record.id).url),
                            }),
                    },
                ];

                return (
                    <Dropdown
                        menu={{ items }}
                        trigger={['click']}
                        placement="bottomRight"
                    >
                        <Button
                            type="text"
                            icon={<MoreOutlined />}
                            size="small"
                        />
                    </Dropdown>
                );
            },
        },
    ];

    const navigate = (params: Record<string, any>) => {
        router.get(
            index().url,
            { ...params },
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <Head title="User Management" />
            <PageHeader
                eyebrow="Admin"
                title="User Management"
                description="Kelola akun pengguna dan atur role yang melekat pada tiap akun."
                actions={
                    <Link href={create().url}>
                        <Button
                            type="primary"
                            icon={<UserAddOutlined />}
                            size="large"
                        >
                            New User
                        </Button>
                    </Link>
                }
            />
            <Panel bodyClassName="p-4 sm:p-6">
                <DataTable
                    columns={columns}
                    data={users}
                    rowKey="id"
                    total={total}
                    page={page}
                    perPage={perPage}
                    search={search}
                    onPageChange={(p) => navigate({ page: p, perPage, search })}
                    onPerPageChange={(pp) =>
                        navigate({ page: 1, perPage: pp, search })
                    }
                    onSearchChange={(s) =>
                        navigate({ page: 1, perPage, search: s })
                    }
                    searchPlaceholder="Search users..."
                />
            </Panel>
        </div>
    );
}

UserIndex.layout = () => ({
    breadcrumbs: [
        { title: 'Admin', href: '#' },
        { title: 'Users', href: index().url },
    ],
});
