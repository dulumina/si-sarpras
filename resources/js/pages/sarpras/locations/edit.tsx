import { Head, useForm } from '@inertiajs/react';
import { App, Button, Form, Input } from 'antd';
import {
    index,
    update,
} from '@/actions/App/Http/Controllers/Sarpras/LocationController';
import PageHeader from '@/components/page-header';
import Panel from '@/components/panel';

interface Props {
    location: {
        id: number;
        name: string;
        description: string | null;
    };
}

export default function LocationEdit({ location }: Props) {
    const { message } = App.useApp();
    const { data, setData, put, processing, errors } = useForm({
        name: location.name,
        description: location.description,
    });

    const onFinish = () => {
        put(update(location.id).url, {
            onSuccess: () => message.success('Lokasi berhasil diperbarui'),
        });
    };

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <Head title={`Edit ${location.name}`} />
            <PageHeader
                eyebrow="Sarana Prasarana / Lokasi"
                title="Edit Lokasi"
                description="Perbarui nama atau deskripsi lokasi."
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
                        Simpan Perubahan
                    </Button>
                </div>
            </Form>
        </div>
    );
}

LocationEdit.layout = (page: Props) => ({
    breadcrumbs: [
        { title: 'Sarana Prasarana', href: '#' },
        { title: 'Lokasi', href: index().url },
        { title: page.location.name, href: '#' },
    ],
});
