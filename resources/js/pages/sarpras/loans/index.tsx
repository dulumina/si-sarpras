import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Head, Link, router } from '@inertiajs/react';
import { Button, Select, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    create,
    index,
    show,
} from '@/actions/App/Http/Controllers/Sarpras/LoanRequestController';
import DataTable from '@/components/data-table';
import PageHeader from '@/components/page-header';
import Panel from '@/components/panel';

interface Option {
    value: string;
    label: string;
}

interface Loan {
    id: number;
    borrower: string;
    purpose: string;
    item_count: number;
    borrowed_at: string;
    due_at: string;
    status: Option;
}

interface Props {
    loans: Loan[];
    total: number;
    page: number;
    perPage: number;
    search: string;
    status: string;
    statuses: Option[];
    can_create: boolean;
}

const STATUS_COLORS: Record<string, string> = {
    pending: 'gold',
    approved: 'cyan',
    rejected: 'red',
    active: 'blue',
    returned: 'green',
    cancelled: 'default',
};

export default function LoanIndex({
    loans,
    total,
    page,
    perPage,
    search,
    status,
    statuses,
    can_create,
}: Props) {
    const columns: ColumnsType<Loan> = [
        {
            title: 'Peminjam',
            dataIndex: 'borrower',
            key: 'borrower',
            render: (text) => <span className="font-bold">{text}</span>,
        },
        {
            title: 'Keperluan',
            dataIndex: 'purpose',
            key: 'purpose',
            ellipsis: true,
            render: (text, record) => (
                <Link href={show(record.id).url} className="text-primary">
                    {text}
                </Link>
            ),
        },
        {
            title: 'Item',
            dataIndex: 'item_count',
            key: 'item_count',
            width: 80,
        },
        {
            title: 'Pinjam',
            dataIndex: 'borrowed_at',
            key: 'borrowed_at',
            width: 140,
        },
        {
            title: 'Batas Kembali',
            dataIndex: 'due_at',
            key: 'due_at',
            width: 140,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 170,
            render: (status: Option) => (
                <Tag color={STATUS_COLORS[status.value] ?? 'default'}>
                    {status.label}
                </Tag>
            ),
        },
        {
            title: 'Aksi',
            key: 'actions',
            width: 60,
            render: (_, record) => (
                <Button
                    type="text"
                    icon={<EyeOutlined />}
                    size="small"
                    onClick={() => router.get(show(record.id).url)}
                />
            ),
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
            <Head title="Peminjaman" />
            <PageHeader
                eyebrow="Sarana Prasarana"
                title="Peminjaman"
                description="Ajukan, persetujui, dan pantau peminjaman aset serta ruangan."
                actions={
                    can_create ? (
                        <Link href={create().url}>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size="large"
                            >
                                Ajukan Peminjaman
                            </Button>
                        </Link>
                    ) : undefined
                }
            />
            <Panel bodyClassName="p-4 sm:p-6">
                <div className="mb-4 max-w-xs">
                    <Select
                        placeholder="Status"
                        allowClear
                        className="w-full"
                        value={status || undefined}
                        onChange={(value) =>
                            navigate({
                                page: 1,
                                perPage,
                                search,
                                status: value,
                            })
                        }
                        options={statuses}
                    />
                </div>
                <DataTable
                    columns={columns}
                    data={loans}
                    rowKey="id"
                    total={total}
                    page={page}
                    perPage={perPage}
                    search={search}
                    onPageChange={(p) =>
                        navigate({ page: p, perPage, search, status })
                    }
                    onPerPageChange={(pp) =>
                        navigate({ page: 1, perPage: pp, search, status })
                    }
                    onSearchChange={(s) =>
                        navigate({ page: 1, perPage, search: s, status })
                    }
                    searchPlaceholder="Cari keperluan..."
                />
            </Panel>
        </div>
    );
}

LoanIndex.layout = () => ({
    breadcrumbs: [
        { title: 'Sarana Prasarana', href: '#' },
        { title: 'Peminjaman', href: index().url },
    ],
});
