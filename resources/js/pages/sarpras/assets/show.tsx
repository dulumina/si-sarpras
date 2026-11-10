import { DeleteOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Button, Descriptions, Image, Tag, Timeline } from 'antd';
import {
    destroyImage,
    edit,
    index,
    show,
    storeImage,
} from '@/actions/App/Http/Controllers/Sarpras/AssetController';
import AssetQrLabel from '@/components/asset-qr-label';
import PageHeader from '@/components/page-header';
import Panel from '@/components/panel';

interface AssetImage {
    id: number;
    url: string;
}

interface AssetHistoryItem {
    id: number;
    action: string;
    user: string;
    changes: Record<string, string>;
    created_at: string;
}

interface Props {
    asset: {
        id: number;
        inventory_code: string | null;
        name: string;
        category: string | null;
        location: string | null;
        brand: string | null;
        model: string | null;
        serial_number: string | null;
        acquisition_year: number | null;
        acquisition_date: string | null;
        acquisition_cost: string | null;
        condition: string;
        status: string;
        notes: string | null;
        created_at: string;
    };
    images: AssetImage[];
    histories: AssetHistoryItem[];
}

const CONDITION_COLORS: Record<string, string> = {
    Baik: 'green',
    'Kurang Baik': 'orange',
    Rusak: 'red',
};

const STATUS_COLORS: Record<string, string> = {
    Aktif: 'green',
    Dipinjam: 'blue',
    'Dalam Perbaikan': 'orange',
    Dihapus: 'default',
};

const ACTION_TITLES: Record<string, string> = {
    created: 'Aset dicatat',
    updated: 'Data diperbarui',
    archived: 'Aset diarsipkan',
};

function historyTimelineItem(history: AssetHistoryItem) {
    const title = ACTION_TITLES[history.action] ?? history.action;

    return {
        children: (
            <div key={history.id}>
                <p className="font-medium">{title}</p>
                {Object.values(history.changes).length > 0 && (
                    <ul className="mt-1 list-inside list-disc text-xs text-muted-foreground">
                        {Object.values(history.changes).map((change, i) => (
                            <li key={i}>{change}</li>
                        ))}
                    </ul>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                    {history.user} · {history.created_at}
                </p>
            </div>
        ),
    };
}

export default function AssetShow({ asset, images, histories }: Props) {
    const { auth } = usePage().props;
    const canEdit = (auth.user.permissions as string[]).includes('asset.edit');

    const { setData, post, processing } = useForm<{ image: File | null }>({
        image: null,
    });

    function uploadPhoto(file: File) {
        setData('image', file);
        post(storeImage(asset.id).url, {
            preserveScroll: true,
            forceFormData: true,
        });
    }

    function deletePhoto(image: AssetImage) {
        router.delete(destroyImage([asset.id, image.id]).url, {
            preserveScroll: true,
        });
    }

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6">
            <Head title={asset.name} />
            <PageHeader
                eyebrow="Sarana Prasarana / Aset"
                title={asset.name}
                description={asset.inventory_code ?? undefined}
                actions={
                    <Link href={edit(asset.id).url}>
                        <Button icon={<EditOutlined />} size="large">
                            Edit Aset
                        </Button>
                    </Link>
                }
            />

            <Panel title="Identitas aset">
                <Descriptions
                    column={{ xs: 1, sm: 2, md: 3 }}
                    size="small"
                >
                    <Descriptions.Item label="Kode Inventaris">
                        <span className="font-bold">{asset.inventory_code}</span>
                    </Descriptions.Item>
                    <Descriptions.Item label="Nama">{asset.name}</Descriptions.Item>
                    <Descriptions.Item label="Kategori">
                        {asset.category ?? '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Lokasi">
                        {asset.location ?? '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Kondisi Fisik">
                        <Tag color={CONDITION_COLORS[asset.condition] ?? 'default'}>
                            {asset.condition}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Status Operasional">
                        <Tag color={STATUS_COLORS[asset.status] ?? 'default'}>
                            {asset.status}
                        </Tag>
                    </Descriptions.Item>
                </Descriptions>
            </Panel>

            <Panel
                title="Label QR"
                description="Cetak label dan tempelkan pada aset untuk identifikasi cepat."
            >
                <AssetQrLabel code={asset.inventory_code} name={asset.name} />
            </Panel>

            <Panel title="Spesifikasi dan perolehan">
                <Descriptions
                    column={{ xs: 1, sm: 2, md: 3 }}
                    size="small"
                >
                    <Descriptions.Item label="Merek">
                        {asset.brand ?? '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Model">
                        {asset.model ?? '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Nomor Seri">
                        {asset.serial_number ?? '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tahun Perolehan">
                        {asset.acquisition_year ?? '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tanggal Perolehan">
                        {asset.acquisition_date ?? '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Nilai Perolehan">
                        {asset.acquisition_cost
                            ? `Rp ${Number(asset.acquisition_cost).toLocaleString('id-ID')}`
                            : '-'}
                    </Descriptions.Item>
                </Descriptions>
            </Panel>

            <Panel
                title="Foto aset"
                description="Foto membantu mengidentifikasi aset saat pemeriksaan."
                bodyClassName="space-y-4"
            >
                {images.length > 0 ? (
                    <Image.PreviewGroup>
                        <div className="flex flex-wrap gap-4">
                            {images.map((image) => (
                                <div
                                    key={image.id}
                                    className="relative border border-border rounded-lg"
                                >
                                    <Image
                                        src={image.url}
                                        alt={`Foto ${asset.inventory_code}`}
                                        width={160}
                                        height={160}
                                        className="object-cover"
                                    />
                                    {canEdit && (
                                        <Button
                                            danger
                                            size="small"
                                            icon={<DeleteOutlined />}
                                            className="absolute top-2 right-2"
                                            onClick={() => deletePhoto(image)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </Image.PreviewGroup>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Belum ada foto untuk aset ini.
                    </p>
                )}

                {canEdit && (
                    <>
                        <input
                            id="asset-photo-input"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];

                                if (file) {
                                    uploadPhoto(file);
                                    e.target.value = '';
                                }
                            }}
                        />
                        <label htmlFor="asset-photo-input">
                            <Button
                                icon={<UploadOutlined />}
                                loading={processing}
                            >
                                Unggah Foto
                            </Button>
                        </label>
                    </>
                )}
            </Panel>

            <Panel title="Catatan">
                <p className="text-sm text-foreground">
                    {asset.notes ?? 'Tidak ada catatan.'}
                </p>
                <p className="mt-4 text-xs text-muted-foreground">
                    Dicatat pada {asset.created_at}
                </p>
            </Panel>

            <Panel title="Riwayat perubahan">
                {histories.length > 0 ? (
                    <Timeline
                        items={histories.map(historyTimelineItem)}
                        className="mt-2"
                    />
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Belum ada riwayat perubahan.
                    </p>
                )}
            </Panel>

            <div className="flex justify-start">
                <Button size="large" href={index().url}>
                    Kembali ke Daftar Aset
                </Button>
            </div>
        </div>
    );
}

AssetShow.layout = (page: Props) => ({
    breadcrumbs: [
        { title: 'Sarana Prasarana', href: '#' },
        { title: 'Aset', href: index().url },
        { title: page.asset.inventory_code, href: show(page.asset.id).url },
    ],
});
