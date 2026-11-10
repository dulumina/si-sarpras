import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Head, useForm } from '@inertiajs/react';
import { App, Button, Form, Input, Select } from 'antd';
import {
    edit,
    update,
} from '@/actions/App/Http/Controllers/Sarpras/ApprovalFlowController';
import PageHeader from '@/components/page-header';
import Panel from '@/components/panel';

interface Step {
    role: string;
    title: string;
}

interface Props {
    flow: {
        name: string;
        steps: Step[];
    };
    roles: string[];
}

export default function ApprovalFlowEdit({ flow, roles }: Props) {
    const { message } = App.useApp();
    const { data, setData, put, processing, errors } = useForm({
        name: flow.name,
        steps: flow.steps.length
            ? flow.steps
            : [{ role: '', title: '' }],
    });

    const stepErrors = Object.entries(errors)
        .filter(([key]) => key.startsWith('steps'))
        .map(([, value]) => value);

    const setStep = (index: number, patch: Partial<Step>) => {
        setData(
            'steps',
            data.steps.map((step, i) => (i === index ? { ...step, ...patch } : step)),
        );
    };

    const addStep = () => {
        setData('steps', [...data.steps, { role: '', title: '' }]);
    };

    const removeStep = (index: number) => {
        setData(
            'steps',
            data.steps.filter((_, i) => i !== index),
        );
    };

    const onFinish = () => {
        put(update().url, {
            onSuccess: () => message.success('Alur persetujuan disimpan'),
        });
    };

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <Head title="Alur Persetujuan Peminjaman" />
            <PageHeader
                eyebrow="Sarana Prasarana"
                title="Alur Persetujuan Peminjaman"
                description="Tentukan urutan langkah dan peran pemeriksa pengajuan peminjaman."
            />

            <Form layout="vertical" onFinish={onFinish}>
                <Panel title="Pengaturan alur">
                    <div className="space-y-6">
                        <Form.Item
                            label="Nama Alur"
                            required
                            validateStatus={errors.name ? 'error' : ''}
                            help={errors.name}
                            className="!mb-0"
                        >
                            <Input
                                placeholder="mis. Alur Persetujuan Peminjaman"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                size="large"
                            />
                        </Form.Item>
                    </div>
                </Panel>

                <Panel
                    title="Langkah Persetujuan"
                    description="Langkah dievaluasi berurutan dari atas. Pengajuan diteruskan ke langkah berikutnya setelah disetujui."
                    className="mt-6"
                >
                    <div className="space-y-4">
                        {data.steps.map((step, index) => (
                            <div
                                key={index}
                                className="flex flex-col gap-3 sm:flex-row sm:items-start"
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold">
                                    {index + 1}
                                </div>
                                <Select
                                    placeholder="Pilih peran pemeriksa"
                                    showSearch
                                    optionFilterProp="label"
                                    value={step.role || undefined}
                                    onChange={(value) =>
                                        setStep(index, { role: value })
                                    }
                                    options={roles.map((role) => ({
                                        value: role,
                                        label: role,
                                    }))}
                                    className="w-full sm:w-56"
                                />
                                <Input
                                    placeholder="Judul langkah, mis. Verifikasi Admin Sarpras"
                                    value={step.title}
                                    onChange={(e) =>
                                        setStep(index, {
                                            title: e.target.value,
                                        })
                                    }
                                />
                                <Button
                                    icon={<DeleteOutlined />}
                                    danger
                                    onClick={() => removeStep(index)}
                                    disabled={data.steps.length === 1}
                                />
                            </div>
                        ))}
                        {stepErrors.length > 0 && (
                            <div className="text-sm text-red-500">
                                {stepErrors.map((error) => (
                                    <div key={error}>{error}</div>
                                ))}
                            </div>
                        )}
                        <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={addStep}
                            className="w-full"
                        >
                            Tambah Langkah
                        </Button>
                    </div>
                </Panel>

                <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                    <Button size="large" href={edit().url}>
                        Batal
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={processing}
                        size="large"
                    >
                        Simpan Alur
                    </Button>
                </div>
            </Form>
        </div>
    );
}

ApprovalFlowEdit.layout = () => ({
    breadcrumbs: [
        { title: 'Sarana Prasarana', href: '#' },
        { title: 'Alur Persetujuan', href: edit().url },
    ],
});
