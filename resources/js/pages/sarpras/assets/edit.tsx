import { Head, useForm } from '@inertiajs/react';
import { App, Button, Form, Input, InputNumber, Select } from 'antd';
import {
    index,
    update,
} from '@/actions/App/Http/Controllers/Sarpras/AssetController';
import PageHeader from '@/components/page-header';
import Panel from '@/components/panel';

interface Option {
    value: number | string;
    label: string;
}

interface Props {
    asset: {
        id: number;
        inventory_code: string;
        name: string;
        category_id: number | null;
        location_id: number | null;
        brand: string | null;
        model: string | null;
        serial_number: string | null;
        acquisition_year: number | null;
        acquisition_date: string | null;
        acquisition_cost: string | null;
        condition: string;
        status: string;
        notes: string | null;
    };
    categories: { id: number; name: string }[];
    locations: { id: number; name: string }[];
    conditions: Option[];
    statuses: Option[];
}

export default function AssetEdit({
    asset,
    categories,
    locations,
    conditions,
    statuses,
}: Props) {
    const { message } = App.useApp();
    const { data, setData, put, processing, errors } = useForm({
        inventory_code: asset.inventory_code,
        name: asset.name,
        category_id: asset.category_id,
        location_id: asset.location_id,
        brand: asset.brand,
        model: asset.model,
        serial_number: asset.serial_number,
        acquisition_year: asset.acquisition_year,
        acquisition_date: asset.acquisition_date,
        acquisition_cost:
            asset.acquisition_cost !== null
                ? Number(asset.acquisition_cost)
                : null,
        condition: asset.condition,
        status: asset.status,
        notes: asset.notes,
    });

    const onFinish = () => {
        put(update(asset.id).url, {
            onSuccess: () => message.success('Aset berhasil diperbarui'),
        });
    };

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <Head title={`Edit ${asset.name}`} />
            <PageHeader
                eyebrow="Sarana Prasarana / Aset"
                title="Edit Aset"
                description="Perbarui data inventaris aset."
            />

            <Form layout="vertical" onFinish={onFinish}>
                <div className="space-y-6">
                    <Panel title="Identitas aset">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <Form.Item
                                label="Kode Inventaris"
                                required
                                validateStatus={errors.inventory_code ? 'error' : ''}
                                help={errors.inventory_code}
                                className="!mb-0"
                            >
                                <Input
                                    placeholder="mis. INV-00001"
                                    value={data.inventory_code}
                                    onChange={(e) =>
                                        setData('inventory_code', e.target.value)
                                    }
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Nama Aset"
                                required
                                validateStatus={errors.name ? 'error' : ''}
                                help={errors.name}
                                className="!mb-0"
                            >
                                <Input
                                    placeholder="mis. Proyektor Epson EB-X06"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Kategori"
                                validateStatus={errors.category_id ? 'error' : ''}
                                help={errors.category_id}
                                className="!mb-0"
                            >
                                <Select
                                    placeholder="Pilih kategori"
                                    allowClear
                                    showSearch
                                    optionFilterProp="label"
                                    value={data.category_id ?? undefined}
                                    onChange={(value) =>
                                        setData('category_id', value ?? null)
                                    }
                                    options={categories.map((c) => ({
                                        value: c.id,
                                        label: c.name,
                                    }))}
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
                                    placeholder="Pilih lokasi"
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
                    </Panel>

                    <Panel title="Spesifikasi">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <Form.Item
                                label="Merek"
                                validateStatus={errors.brand ? 'error' : ''}
                                help={errors.brand}
                                className="!mb-0"
                            >
                                <Input
                                    placeholder="mis. Epson"
                                    value={data.brand ?? ''}
                                    onChange={(e) =>
                                        setData('brand', e.target.value)
                                    }
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Model"
                                validateStatus={errors.model ? 'error' : ''}
                                help={errors.model}
                                className="!mb-0"
                            >
                                <Input
                                    placeholder="mis. EB-X06"
                                    value={data.model ?? ''}
                                    onChange={(e) =>
                                        setData('model', e.target.value)
                                    }
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Nomor Seri"
                                validateStatus={errors.serial_number ? 'error' : ''}
                                help={errors.serial_number}
                                className="!mb-0"
                            >
                                <Input
                                    placeholder="mis. SN-ABC123"
                                    value={data.serial_number ?? ''}
                                    onChange={(e) =>
                                        setData('serial_number', e.target.value)
                                    }
                                    size="large"
                                />
                            </Form.Item>
                        </div>
                    </Panel>

                    <Panel title="Perolehan">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            <Form.Item
                                label="Tahun Perolehan"
                                validateStatus={errors.acquisition_year ? 'error' : ''}
                                help={errors.acquisition_year}
                                className="!mb-0"
                            >
                                <InputNumber
                                    placeholder="mis. 2024"
                                    min={1900}
                                    max={new Date().getFullYear() + 1}
                                    value={data.acquisition_year}
                                    onChange={(value) =>
                                        setData('acquisition_year', value ?? null)
                                    }
                                    className="!w-full"
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Tanggal Perolehan"
                                validateStatus={errors.acquisition_date ? 'error' : ''}
                                help={errors.acquisition_date}
                                className="!mb-0"
                            >
                                <Input
                                    type="date"
                                    value={data.acquisition_date ?? ''}
                                    onChange={(e) =>
                                        setData('acquisition_date', e.target.value)
                                    }
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Nilai Perolehan (Rp)"
                                validateStatus={errors.acquisition_cost ? 'error' : ''}
                                help={errors.acquisition_cost}
                                className="!mb-0"
                            >
                                <InputNumber
                                    placeholder="mis. 5500000"
                                    min={0}
                                    value={data.acquisition_cost}
                                    onChange={(value) =>
                                        setData('acquisition_cost', value ?? null)
                                    }
                                    className="!w-full"
                                    size="large"
                                />
                            </Form.Item>
                        </div>
                    </Panel>

                    <Panel
                        title="Kondisi dan status"
                        description="Kondisi fisik (keadaan barang) berbeda dari status operasional (posisi proses aset)."
                    >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <Form.Item
                                label="Kondisi Fisik"
                                required
                                validateStatus={errors.condition ? 'error' : ''}
                                help={errors.condition}
                                className="!mb-0"
                            >
                                <Select
                                    value={data.condition}
                                    onChange={(value) =>
                                        setData('condition', value)
                                    }
                                    options={conditions}
                                    size="large"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Status Operasional"
                                required
                                validateStatus={errors.status ? 'error' : ''}
                                help={errors.status}
                                className="!mb-0"
                            >
                                <Select
                                    value={data.status}
                                    onChange={(value) =>
                                        setData('status', value)
                                    }
                                    options={statuses}
                                    size="large"
                                />
                            </Form.Item>
                        </div>
                        <Form.Item
                            label="Catatan"
                            validateStatus={errors.notes ? 'error' : ''}
                            help={errors.notes}
                            className="!mt-6 !mb-0"
                        >
                            <Input.TextArea
                                placeholder="Catatan tambahan mengenai aset (opsional)"
                                value={data.notes ?? ''}
                                onChange={(e) =>
                                    setData('notes', e.target.value)
                                }
                                rows={3}
                            />
                        </Form.Item>
                    </Panel>
                </div>

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

AssetEdit.layout = (page: Props) => ({
    breadcrumbs: [
        { title: 'Sarana Prasarana', href: '#' },
        { title: 'Aset', href: index().url },
        { title: page.asset.name, href: '#' },
    ],
});
