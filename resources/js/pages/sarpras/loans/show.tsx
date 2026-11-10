import {
    CheckOutlined,
    CloseOutlined,
    DownloadOutlined,
    StopOutlined,
} from '@ant-design/icons';
import { Head, useForm } from '@inertiajs/react';
import {
    App,
    Button,
    Descriptions,
    Input,
    Modal,
    Select,
    Table,
    Tag,
    Timeline,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import {
    approve,
    cancel,
    handover,
    index,
    reject,
    returnLoan,
    show,
} from '@/actions/App/Http/Controllers/Sarpras/LoanRequestController';
import PageHeader from '@/components/page-header';
import Panel from '@/components/panel';

interface Step {
    title: string;
    role: string;
    state: string;
    approval: {
        user: string;
        decision: string;
        note: string | null;
        created_at: string;
    } | null;
}

interface Item {
    id: number;
    type: 'asset' | 'room';
    label: string;
    condition_out: string | null;
    condition_in: string | null;
}

interface Option {
    value: string;
    label: string;
}

interface Props {
    loan: {
        id: number;
        borrower: string;
        purpose: string;
        borrowed_at: string;
        due_at: string;
        handed_at: string | null;
        returned_at: string | null;
        status: Option;
        steps: Step[];
    };
    items: Item[];
    conditions: Option[];
    can_approve: boolean;
    can_handover: boolean;
    can_return: boolean;
    can_cancel: boolean;
}

const STATUS_COLORS: Record<string, string> = {
    pending: 'gold',
    approved: 'cyan',
    rejected: 'red',
    active: 'blue',
    returned: 'green',
    cancelled: 'default',
};

const STEP_COLORS: Record<string, string> = {
    approved: 'green',
    rejected: 'red',
    current: 'blue',
    waiting: 'gray',
};

export default function LoanShow({
    loan,
    items,
    conditions,
    can_approve,
    can_handover,
    can_return,
    can_cancel,
}: Props) {
    const { message } = App.useApp();
    const { data, setData, post, processing, reset } = useForm({
        note: '',
        conditions: {} as Record<number, string>,
    });

    const [decisionOpen, setDecisionOpen] = useState<'approve' | 'reject' | null>(null);
    const [returnOpen, setReturnOpen] = useState(false);

    const assetItems = items.filter((item) => item.type === 'asset');

    const submitDecision = () => {
        const url =
            decisionOpen === 'approve'
                ? approve(loan.id).url
                : reject(loan.id).url;

        post(url, {
            onSuccess: () => {
                setDecisionOpen(null);
                reset('note', 'conditions');
            },
        });
    };

    const submitReturn = () => {
        post(returnLoan(loan.id).url, {
            onSuccess: () => {
                setReturnOpen(false);
                reset('note', 'conditions');
            },
        });
    };

    const itemColumns: ColumnsType<Item> = [
        {
            title: 'Item',
            dataIndex: 'label',
            key: 'label',
            render: (text) => <span className="font-medium">{text}</span>,
        },
        {
            title: 'Tipe',
            dataIndex: 'type',
            key: 'type',
            width: 110,
            render: (type) =>
                type === 'asset' ? (
                    <Tag color="blue">Aset</Tag>
                ) : (
                    <Tag color="purple">Ruangan</Tag>
                ),
        },
        {
            title: 'Kondisi Keluar',
            dataIndex: 'condition_out',
            key: 'condition_out',
            width: 140,
            render: (text) => text ?? '-',
        },
        {
            title: 'Kondisi Kembali',
            dataIndex: 'condition_in',
            key: 'condition_in',
            width: 140,
            render: (text) => text ?? '-',
        },
    ];

    const timelineItems = loan.steps.map((step, index) => ({
        key: index,
        color: STEP_COLORS[step.state] ?? 'gray',
        children: (
            <div>
                <div className="font-semibold">{step.title}</div>
                <div className="text-xs opacity-60">Peran: {step.role}</div>
                {step.approval && (
                    <div className="mt-1 text-sm">
                        {step.approval.user} · {step.approval.decision} ·{' '}
                        {step.approval.created_at}
                        {step.approval.note && (
                            <div className="opacity-70">
                                Catatan: {step.approval.note}
                            </div>
                        )}
                    </div>
                )}
                {step.state === 'current' && (
                    <Tag color="blue" className="mt-1">
                        Menunggu keputusan
                    </Tag>
                )}
                {step.state === 'waiting' && (
                    <Tag className="mt-1">Menunggu giliran</Tag>
                )}
            </div>
        ),
    }));

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <Head title={`Peminjaman #${loan.id}`} />
            <PageHeader
                eyebrow="Sarana Prasarana / Peminjaman"
                title={`Peminjaman #${loan.id}`}
                description={`Diajukan oleh ${loan.borrower}.`}
                actions={
                    <div className="flex flex-wrap gap-2">
                        {can_approve && (
                            <>
                                <Button
                                    type="primary"
                                    icon={<CheckOutlined />}
                                    size="large"
                                    loading={processing}
                                    onClick={() => setDecisionOpen('approve')}
                                >
                                    Setujui
                                </Button>
                                <Button
                                    danger
                                    icon={<CloseOutlined />}
                                    size="large"
                                    onClick={() => setDecisionOpen('reject')}
                                >
                                    Tolak
                                </Button>
                            </>
                        )}
                        {can_handover && (
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                size="large"
                                onClick={() =>
                                    Modal.confirm({
                                        title: 'Serah terima aset',
                                        content:
                                            'Tandai semua aset dalam pengajuan ini sebagai diserahkan dan sedang dipinjam?',
                                        okText: 'Ya',
                                        cancelText: 'Batal',
                                        onOk: () =>
                                            post(handover(loan.id).url),
                                    })
                                }
                            >
                                Serah Terima
                            </Button>
                        )}
                        {can_return && (
                            <Button
                                type="primary"
                                icon={<CheckOutlined />}
                                size="large"
                                onClick={() => {
                                    reset('note', 'conditions');
                                    setReturnOpen(true);
                                }}
                            >
                                Kembalikan
                            </Button>
                        )}
                        {can_cancel && (
                            <Button
                                danger
                                icon={<StopOutlined />}
                                size="large"
                                onClick={() =>
                                    Modal.confirm({
                                        title: 'Batalkan pengajuan',
                                        content:
                                            'Batalkan pengajuan peminjaman ini?',
                                        okText: 'Ya',
                                        cancelText: 'Tidak',
                                        okType: 'danger',
                                        onOk: () => post(cancel(loan.id).url),
                                    })
                                }
                            >
                                Batalkan
                            </Button>
                        )}
                    </div>
                }
            />

            <Panel title="Detail Peminjaman">
                <Descriptions column={{ xs: 1, sm: 2, lg: 3 }}>
                    <Descriptions.Item label="Peminjam">
                        {loan.borrower}
                    </Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag color={STATUS_COLORS[loan.status.value] ?? 'default'}>
                            {loan.status.label}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Keperluan">
                        {loan.purpose}
                    </Descriptions.Item>
                    <Descriptions.Item label="Waktu Mulai">
                        {loan.borrowed_at}
                    </Descriptions.Item>
                    <Descriptions.Item label="Batas Kembali">
                        {loan.due_at}
                    </Descriptions.Item>
                    <Descriptions.Item label="Serah Terima">
                        {loan.handed_at ?? '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Dikembalikan">
                        {loan.returned_at ?? '-'}
                    </Descriptions.Item>
                </Descriptions>
            </Panel>

            <Panel title="Item Dipinjam">
                <Table
                    columns={itemColumns}
                    dataSource={items}
                    rowKey="id"
                    size="small"
                    pagination={false}
                />
            </Panel>

            <Panel
                title="Alur Persetujuan"
                description="Langkah dievaluasi berurutan sesuai konfigurasi alur."
            >
                {timelineItems.length > 0 ? (
                    <Timeline items={timelineItems} />
                ) : (
                    <p className="text-sm opacity-60">
                        Tidak ada langkah persetujuan.
                    </p>
                )}
            </Panel>

            <Modal
                title={
                    decisionOpen === 'approve'
                        ? 'Setujui pengajuan'
                        : 'Tolak pengajuan'
                }
                open={decisionOpen !== null}
                okText={decisionOpen === 'approve' ? 'Setujui' : 'Tolak'}
                okType={decisionOpen === 'reject' ? 'danger' : 'primary'}
                cancelText="Batal"
                confirmLoading={processing}
                onOk={submitDecision}
                onCancel={() => setDecisionOpen(null)}
            >
                <p className="mb-3 text-sm opacity-70">
                    {decisionOpen === 'approve'
                        ? 'Pengajuan diteruskan ke langkah berikutnya (atau disetujui penuh bila ini langkah terakhir).'
                        : 'Pengajuan akan ditolak dan tidak dapat dilanjutkan.'}
                </p>
                <Input.TextArea
                    placeholder="Catatan keputusan (opsional)"
                    value={data.note}
                    onChange={(e) => setData('note', e.target.value)}
                    rows={3}
                />
            </Modal>

            <Modal
                title="Catat pengembalian"
                open={returnOpen}
                okText="Simpan Pengembalian"
                cancelText="Batal"
                confirmLoading={processing}
                onOk={submitReturn}
                onCancel={() => setReturnOpen(false)}
            >
                <p className="mb-4 text-sm opacity-70">
                    Periksa kondisi setiap aset saat diterima kembali. Aset akan
                    kembali berstatus aktif.
                </p>
                <div className="space-y-4">
                    {assetItems.map((item) => (
                        <div
                            key={item.id}
                            className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
                        >
                            <span className="text-sm">{item.label}</span>
                            <Select
                                placeholder="Kondisi saat kembali"
                                className="w-full sm:w-52"
                                value={data.conditions[item.id]}
                                onChange={(value) =>
                                    setData('conditions', {
                                        ...data.conditions,
                                        [item.id]: value,
                                    })
                                }
                                options={conditions}
                            />
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
}

LoanShow.layout = (page: Props) => ({
    breadcrumbs: [
        { title: 'Sarana Prasarana', href: '#' },
        { title: 'Peminjaman', href: index().url },
        { title: `#${page.loan.id}`, href: show(page.loan.id).url },
    ],
});
