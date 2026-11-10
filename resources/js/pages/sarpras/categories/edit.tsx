import { Head, useForm } from '@inertiajs/react';
import { App, Button, Form, Input } from 'antd';
import {
    index,
    update,
} from '@/actions/App/Http/Controllers/Sarpras/CategoryController';
import PageHeader from '@/components/page-header';
import Panel from '@/components/panel';

interface Props {
    category: {
        id: number;
        name: string;
        description: string | null;
    };
}

export default function CategoryEdit({ category }: Props) {
    const { message } = App.useApp();
    const { data, setData, put, processing, errors } = useForm({
        name: category.name,
        description: category.description,
    });

    const onFinish = () => {
        put(update(category.id).url, {
            onSuccess: () => message.success('Kategori berhasil diperbarui'),
        });
    };

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <Head title={`Edit ${category.name}`} />
            <PageHeader
                eyebrow="Sarana Prasarana / Kategori"
                title="Edit Kategori"
                description="Perbarui nama atau deskripsi kategori."
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
                        Simpan Perubahan
                    </Button>
                </div>
            </Form>
        </div>
    );
}

CategoryEdit.layout = (page: Props) => ({
    breadcrumbs: [
        { title: 'Sarana Prasarana', href: '#' },
        { title: 'Kategori', href: index().url },
        { title: page.category.name, href: '#' },
    ],
});
