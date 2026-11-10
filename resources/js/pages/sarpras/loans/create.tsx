import { Head, useForm } from '@inertiajs/react';
import { App, Button, DatePicker, Form, Input, Select } from 'antd';
import dayjs from 'dayjs';
import {
    index,
    store,
} from '@/actions/App/Http/Controllers/Sarpras/LoanRequestController';
import PageHeader from '@/components/page-header';
import Panel from '@/components/panel';

interface Option {
    value: number;
    label: string;
}

interface Props {
    assets: Option[];
    rooms: Option[];
}

const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm';

export default function LoanCreate({ assets, rooms }: Props) {
    const { message } = App.useApp();
    const { data, setData, post, processing, errors } = useForm({
        purpose: '',
        borrowed_at: '',
        due_at: '',
        asset_ids: [] as number[],
        room_ids: [] as number[],
    });

    const onFinish = () => {
        post(store().url, {
            onSuccess: () => message.success('Pengajuan berhasil dikirim'),
        });
    };

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <Head title="Ajukan Peminjaman" />
            <PageHeader
                eyebrow="Sarana Prasarana / Peminjaman"
                title="Ajukan Peminjaman"
                description="Ajukan peminjaman satu atau beberapa aset dan ruangan sekaligus."
            />

            <Form layout="vertical" onFinish={onFinish}>
                <Panel title="Detail pengajuan">
                    <div className="space-y-6">
                        <Form.Item
                            label="Keperluan"
                            required
                            validateStatus={errors.purpose ? 'error' : ''}
                            help={errors.purpose}
                            className="!mb-0"
                        >
                            <Input.TextArea
                                placeholder="mis. Rapat koordinasi unit"
                                value={data.purpose}
                                onChange={(e) =>
                                    setData('purpose', e.target.value)
                                }
                                rows={3}
                            />
                        </Form.Item>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <Form.Item
                                label="Waktu Mulai"
                                required
                                validateStatus={errors.borrowed_at ? 'error' : ''}
                                help={errors.borrowed_at}
                                className="!mb-0"
                            >
                                <DatePicker
                                    showTime
                                    format={DATETIME_FORMAT}
                                    value={
                                        data.borrowed_at
                                            ? dayjs(data.borrowed_at)
                                            : undefined
                                    }
                                    onChange={(value) =>
                                        setData(
                                            'borrowed_at',
                                            value
                                                ? value.format(DATETIME_FORMAT)
                                                : '',
                                        )
                                    }
                                    className="w-full"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Batas Pengembalian"
                                required
                                validateStatus={errors.due_at ? 'error' : ''}
                                help={errors.due_at}
                                className="!mb-0"
                            >
                                <DatePicker
                                    showTime
                                    format={DATETIME_FORMAT}
                                    value={
                                        data.due_at
                                            ? dayjs(data.due_at)
                                            : undefined
                                    }
                                    onChange={(value) =>
                                        setData(
                                            'due_at',
                                            value
                                                ? value.format(DATETIME_FORMAT)
                                                : '',
                                        )
                                    }
                                    className="w-full"
                                />
                            </Form.Item>
                        </div>
                    </div>
                </Panel>

                <Panel
                    title="Aset dan Ruangan"
                    description="Pilih minimal satu aset atau ruangan. Jadwal yang bertabrakan akan ditolak."
                    className="mt-6"
                >
                    <div className="space-y-6">
                        <Form.Item
                            label="Aset"
                            validateStatus={errors.asset_ids ? 'error' : ''}
                            help={errors.asset_ids}
                            className="!mb-0"
                        >
                            <Select
                                mode="multiple"
                                placeholder="Cari dan pilih aset yang tersedia"
                                showSearch
                                optionFilterProp="label"
                                value={data.asset_ids}
                                onChange={(value) =>
                                    setData('asset_ids', value)
                                }
                                options={assets}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Ruangan"
                            validateStatus={errors.room_ids ? 'error' : ''}
                            help={errors.room_ids}
                            className="!mb-0"
                        >
                            <Select
                                mode="multiple"
                                placeholder="Cari dan pilih ruangan"
                                showSearch
                                optionFilterProp="label"
                                value={data.room_ids}
                                onChange={(value) =>
                                    setData('room_ids', value)
                                }
                                options={rooms}
                            />
                        </Form.Item>
                    </div>
                </Panel>

                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button size="large" href={index().url}>
                        Batal
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={processing}
                        size="large"
                    >
                        Kirim Pengajuan
                    </Button>
                </div>
            </Form>
        </div>
    );
}

LoanCreate.layout = () => ({
    breadcrumbs: [
        { title: 'Sarana Prasarana', href: '#' },
        { title: 'Peminjaman', href: index().url },
        { title: 'Baru', href: '#' },
    ],
});
