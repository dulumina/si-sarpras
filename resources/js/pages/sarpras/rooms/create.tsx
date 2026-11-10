import { Head, useForm } from '@inertiajs/react';
import { App, Button, Form, Input, InputNumber, Select, Switch } from 'antd';
import {
    index,
    store,
} from '@/actions/App/Http/Controllers/Sarpras/RoomController';
import PageHeader from '@/components/page-header';
import Panel from '@/components/panel';

interface Props {
    locations: { id: number; name: string }[];
}

export default function RoomCreate({ locations }: Props) {
    const { message } = App.useApp();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '' as string | null,
        capacity: null as number | null,
        location_id: null as number | null,
        is_active: true,
    });

    const onFinish = () => {
        post(store().url, {
            onSuccess: () => message.success('Ruangan berhasil dibuat'),
        });
    };

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <Head title="Ruangan Baru" />
            <PageHeader
                eyebrow="Sarana Prasarana / Ruangan"
                title="Ruangan Baru"
                description="Catat ruangan yang dapat diajukan untuk dipinjam."
            />

            <Form layout="vertical" onFinish={onFinish}>
                <Panel title="Detail ruangan">
                    <div className="space-y-6">
                        <Form.Item
                            label="Nama Ruangan"
                            required
                            validateStatus={errors.name ? 'error' : ''}
                            help={errors.name}
                            className="!mb-0"
                        >
                            <Input
                                placeholder="mis. Aula Utama"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                size="large"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Deskripsi"
                            validateStatus={errors.description ? 'error' : ''}
                            help={errors.description}
                            className="!mb-0"
                        >
                            <Input.TextArea
                                placeholder="Deskripsi singkat ruangan (opsional)"
                                value={data.description ?? ''}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                rows={3}
                            />
                        </Form.Item>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <Form.Item
                                label="Kapasitas (orang)"
                                validateStatus={errors.capacity ? 'error' : ''}
                                help={errors.capacity}
                                className="!mb-0"
                            >
                                <InputNumber
                                    placeholder="mis. 40"
                                    min={1}
                                    max={10000}
                                    value={data.capacity}
                                    onChange={(value) =>
                                        setData('capacity', value)
                                    }
                                    className="w-full"
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Lokasi"
                                validateStatus={errors.location_id ? 'error' : ''}
                                help={errors.location_id}
                                className="!mb-0"
                            >
                                <Select
                                    placeholder="Pilih lokasi gedung"
                                    allowClear
                                    showSearch
                                    optionFilterProp="label"
                                    value={data.location_id ?? undefined}
                                    onChange={(value) =>
                                        setData('location_id', value ?? null)
                                    }
                                    options={locations.map((l) => ({
                                        value: l.id,
                                        label: l.name,
                                    }))}
                                    size="large"
                                />
                            </Form.Item>
                        </div>
                        <Form.Item
                            label="Ruangan Aktif"
                            validateStatus={errors.is_active ? 'error' : ''}
                            help={errors.is_active}
                            className="!mb-0"
                        >
                            <Switch
                                checked={data.is_active}
                                onChange={(checked) =>
                                    setData('is_active', checked)
                                }
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
                        Simpan Ruangan
                    </Button>
                </div>
            </Form>
        </div>
    );
}

RoomCreate.layout = () => ({
    breadcrumbs: [
        { title: 'Sarana Prasarana', href: '#' },
        { title: 'Ruangan', href: index().url },
        { title: 'Baru', href: '#' },
    ],
});
