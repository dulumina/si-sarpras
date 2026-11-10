import {
    DeleteOutlined,
    KeyOutlined,
    PlusOutlined,
    RadarChartOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import { Head, router, useForm } from '@inertiajs/react';
import { App, Button, Empty, Form, Input, Modal, Popconfirm, Tag } from 'antd';
import { useMemo, useState } from 'react';
import {
    destroy,
    index,
    scan,
    store,
} from '@/actions/App/Http/Controllers/Admin/PermissionController';
import PageHeader from '@/components/page-header';
import Panel from '@/components/panel';

interface Permission {
    id: number;
    name: string;
    created_at: string;
}

interface Props {
    permissions: Permission[];
}

export default function PermissionIndex({ permissions }: Props) {
    const { message } = App.useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [query, setQuery] = useState('');
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    const onFinish = () => {
        post(store().url, {
            onSuccess: () => {
                message.success('Permission created successfully');
                reset();
                setIsModalOpen(false);
            },
        });
    };

    const groupedPermissions = useMemo(() => {
        const filtered = permissions.filter((permission) =>
            permission.name.toLowerCase().includes(query.toLowerCase()),
        );

        return filtered.reduce(
            (acc, permission) => {
                const parts = permission.name.split('.');
                const group = parts.length > 1 ? parts[0] : 'general';

                if (!acc[group]) {
                    acc[group] = [];
                }

                acc[group].push(permission);

                return acc;
            },
            {} as Record<string, Permission[]>,
        );
    }, [permissions, query]);

    const groups = Object.keys(groupedPermissions).sort();

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <Head title="Permission Management" />
            <PageHeader
                eyebrow="Admin"
                title="Permissions"
                description={`${permissions.length} permission terdaftar, dikelompokkan berdasarkan fitur.`}
                actions={
                    <>
                        <Button
                            icon={<RadarChartOutlined />}
                            size="large"
                            onClick={() => router.get(scan().url)}
                        >
                            Scan
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            onClick={() => setIsModalOpen(true)}
                        >
                            New Permission
                        </Button>
                    </>
                }
            />

            <Panel
                actions={
                    <Input
                        prefix={
                            <SearchOutlined className="text-muted-foreground" />
                        }
                        placeholder="Filter permissions..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full sm:w-64"
                        allowClear
                    />
                }
            >
                {permissions.length === 0 ? (
                    <Empty description="No permissions found" />
                ) : groups.length === 0 ? (
                    <Empty description={`No permissions match "${query}"`} />
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {groups.map((group) => (
                            <div
                                key={group}
                                className="rounded-xl border border-border bg-muted/30 p-4"
                            >
                                <div className="mb-2 flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2">
                                        <KeyOutlined className="text-primary" />
                                        <h3 className="m-0 text-sm font-semibold text-foreground capitalize">
                                            {group}
                                        </h3>
                                    </div>
                                    <Tag className="!m-0 rounded-full">
                                        {groupedPermissions[group].length}
                                    </Tag>
                                </div>
                                <ul className="m-0 list-none divide-y divide-border p-0">
                                    {groupedPermissions[group].map((item) => (
                                        <li
                                            key={item.id}
                                            className="group flex items-center justify-between gap-2 py-2"
                                        >
                                            <code className="truncate rounded bg-card px-2 py-1 text-xs text-primary">
                                                {item.name}
                                            </code>
                                            <Popconfirm
                                                title="Delete permission"
                                                description="Are you sure to delete this permission?"
                                                onConfirm={() =>
                                                    router.delete(
                                                        destroy(item.id).url,
                                                    )
                                                }
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button
                                                    danger
                                                    type="text"
                                                    size="small"
                                                    icon={<DeleteOutlined />}
                                                    className="opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                                                />
                                            </Popconfirm>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </Panel>

            <Modal
                title="Add New Permission"
                open={isModalOpen}
                onCancel={() => {
                    setIsModalOpen(false);
                    reset();
                }}
                footer={null}
                destroyOnClose
            >
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item
                        label="Permission Name"
                        required
                        validateStatus={errors.name ? 'error' : ''}
                        help={errors.name}
                    >
                        <Input
                            placeholder="e.g. posts.create"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            size="large"
                            autoFocus
                        />
                    </Form.Item>
                    <div className="flex justify-end gap-2">
                        <Button
                            onClick={() => {
                                setIsModalOpen(false);
                                reset();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={processing}
                        >
                            Create Permission
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}

PermissionIndex.layout = () => ({
    breadcrumbs: [
        { title: 'Admin', href: '#' },
        { title: 'Permissions', href: index().url },
    ],
});
