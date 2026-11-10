import { Head, useForm } from '@inertiajs/react';
import { App, Button, Form, Input } from 'antd';
import {
    index,
    store,
} from '@/actions/App/Http/Controllers/Sarpras/LocationController';
import PageHeader from '@/components/page-header';
import Panel from '@/components/panel';

export default function LocationCreate() {
    const { message } = App.useApp();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '' as string | null,
    });

    const onFinish = () => {
        post(store().url, {
            onSuccess: () => message.success('Lokasi berhasil dibuat'),
        });
    };

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <Head title="Lokasi Baru" />
            <PageHeader
                eyebrow="Sarana Prasarana / Lokasi"
                title="Lokasi Baru"
                description="Catat gedung, ruangan, atau area penempatan aset."
            />

            <Form layout="vertical" onFinish={onFinish}>
                <Panel title="Detail lokasi">
                    <div className="space-y-6">
                        <Form.Item
                            label="Nama Lokasi"
                            required
                            validateStatus={errors.name ? 'error' : ''}
                            help={errors.name}
                            className="!mb-0"
                        >
                            <Input
                                placeholder="mis. Gedung A Lt. 2 R. 201"
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
                                placeholder="Deskripsi singkat lokasi (opsional)"
                                value={data.description ?? ''}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                rows={3}
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
                        Simpan Lokasi
                    </Button>
                </div>
            </Form>
        </div>
    );
}

LocationCreate.layout = () => ({
    breadcrumbs: [
        { title: 'Sarana Prasarana', href: '#' },
        { title: 'Lokasi', href: index().url },
        { title: 'Baru', href: '#' },
    ],
});
