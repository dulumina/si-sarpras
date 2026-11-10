import { Head, useForm } from '@inertiajs/react';
import { App, Button, Form, Input } from 'antd';
import {
    index,
    store,
} from '@/actions/App/Http/Controllers/Sarpras/CategoryController';
import PageHeader from '@/components/page-header';
import Panel from '@/components/panel';

export default function CategoryCreate() {
    const { message } = App.useApp();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '' as string | null,
    });

    const onFinish = () => {
        post(store().url, {
            onSuccess: () => message.success('Kategori berhasil dibuat'),
        });
    };

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <Head title="Kategori Baru" />
            <PageHeader
                eyebrow="Sarana Prasarana / Kategori"
                title="Kategori Baru"
                description="Beri nama kategori dan deskripsi singkat untuk pengelompokan aset."
            />

            <Form layout="vertical" onFinish={onFinish}>
                <Panel title="Detail kategori">
                    <div className="space-y-6">
                        <Form.Item
                            label="Nama Kategori"
                            required
                            validateStatus={errors.name ? 'error' : ''}
                            help={errors.name}
                            className="!mb-0"
                        >
                            <Input
                                placeholder="mis. Elektronik, Meubelair"
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
                                placeholder="Deskripsi singkat kategori (opsional)"
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
                        Simpan Kategori
                    </Button>
                </div>
            </Form>
        </div>
    );
}

CategoryCreate.layout = () => ({
    breadcrumbs: [
        { title: 'Sarana Prasarana', href: '#' },
        { title: 'Kategori', href: index().url },
        { title: 'Baru', href: '#' },
    ],
});
