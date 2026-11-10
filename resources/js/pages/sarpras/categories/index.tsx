import {
    DeleteOutlined,
    EditOutlined,
    MoreOutlined,
    TagsOutlined,
} from '@ant-design/icons';
import { Head, Link, router } from '@inertiajs/react';
import { Button, Dropdown, Modal, Tag } from 'antd';
import type { MenuProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    create,
    destroy,
    edit,
    index,
} from '@/actions/App/Http/Controllers/Sarpras/CategoryController';
import DataTable from '@/components/data-table';
import PageHeader from '@/components/page-header';
import Panel from '@/components/panel';

interface Category {
    id: number;
    name: string;
    description: string | null;
    is_active: boolean;
    assets_count: number;
    created_at: string;
}

interface Props {
    categories: Category[];
    total: number;
    page: number;
    perPage: number;
    search: string;
}

export default function CategoryIndex({
    categories,
    total,
    page,
    perPage,
    search,
}: Props) {
    const columns: ColumnsType<Category> = [
        {
            title: 'Nama',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span className="font-bold">{text}</span>,
        },
        {
            title: 'Deskripsi',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: 'Jumlah Aset',
            dataIndex: 'assets_count',
            key: 'assets_count',
            width: 120,
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            width: 100,
            render: (isActive: boolean) =>
                isActive ? (
                    <Tag color="green">Aktif</Tag>
                ) : (
                    <Tag color="default">Nonaktif</Tag>
                ),
        },
        {
            title: 'Dibuat',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 160,
        },
        {
            title: 'Aksi',
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
                        label: 'Hapus',
                        danger: true,
                        onClick: () =>
                            Modal.confirm({
                                title: 'Hapus kategori',
                                content: `Yakin ingin menghapus "${record.name}"? Kategori yang masih dipakai aset akan dinonaktifkan.`,
                                okText: 'Ya',
                                cancelText: 'Batal',
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
            <Head title="Kategori Aset" />
            <PageHeader
                eyebrow="Sarana Prasarana"
                title="Kategori Aset"
                description="Kelola kategori untuk mengelompokkan aset inventaris."
                actions={
                    <Link href={create().url}>
                        <Button
                            type="primary"
                            icon={<TagsOutlined />}
                            size="large"
                        >
                            Kategori Baru
                        </Button>
                    </Link>
                }
            />
            <Panel bodyClassName="p-4 sm:p-6">
                <DataTable
                    columns={columns}
                    data={categories}
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
                    searchPlaceholder="Cari kategori..."
                />
            </Panel>
        </div>
    );
}

CategoryIndex.layout = () => ({
    breadcrumbs: [
        { title: 'Sarana Prasarana', href: '#' },
        { title: 'Kategori', href: index().url },
    ],
});
