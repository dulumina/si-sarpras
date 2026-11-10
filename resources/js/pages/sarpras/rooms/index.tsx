import {
    DeleteOutlined,
    EditOutlined,
    MoreOutlined,
    PlusOutlined,
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
} from '@/actions/App/Http/Controllers/Sarpras/RoomController';
import DataTable from '@/components/data-table';
import PageHeader from '@/components/page-header';
import Panel from '@/components/panel';

interface Room {
    id: number;
    name: string;
    description: string | null;
    capacity: number | null;
    location: string | null;
    is_active: boolean;
    loan_count: number;
}

interface Props {
    rooms: Room[];
    total: number;
    page: number;
    perPage: number;
    search: string;
}

export default function RoomIndex({
    rooms,
    total,
    page,
    perPage,
    search,
}: Props) {
    const columns: ColumnsType<Room> = [
        {
            title: 'Nama Ruangan',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <span className="font-bold">{text}</span>,
        },
        {
            title: 'Kapasitas',
            dataIndex: 'capacity',
            key: 'capacity',
            width: 110,
            render: (capacity) =>
                capacity ? `${capacity} orang` : '-',
        },
        {
            title: 'Lokasi',
            dataIndex: 'location',
            key: 'location',
            render: (text) => text ?? <Tag>Tanpa lokasi</Tag>,
        },
        {
            title: 'Dipakai',
            dataIndex: 'loan_count',
            key: 'loan_count',
            width: 90,
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
                                title: 'Hapus ruangan',
                                content: `Yakin ingin menghapus "${record.name}"? Ruangan yang pernah dipinjam akan dinonaktifkan.`,
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
            <Head title="Ruangan" />
            <PageHeader
                eyebrow="Sarana Prasarana"
                title="Ruangan"
                description="Kelola ruangan yang dapat dipinjam beserta lokasinya."
                actions={
                    <Link href={create().url}>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                        >
                            Ruangan Baru
                        </Button>
                    </Link>
                }
            />
            <Panel bodyClassName="p-4 sm:p-6">
                <DataTable
                    columns={columns}
                    data={rooms}
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
                    searchPlaceholder="Cari ruangan..."
                />
            </Panel>
        </div>
    );
}

RoomIndex.layout = () => ({
    breadcrumbs: [
        { title: 'Sarana Prasarana', href: '#' },
        { title: 'Ruangan', href: index().url },
    ],
});
