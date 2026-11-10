import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    FileTextOutlined,
    LeftOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import { Head, router } from '@inertiajs/react';
import { Badge, Button, Space, Tag, Tooltip, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    index,
    store,
    storeBulk,
} from '@/actions/App/Http/Controllers/Admin/PermissionController';
import DataTable from '@/components/data-table';
import PageHeader from '@/components/page-header';
import Panel from '@/components/panel';

const { Text } = Typography;

interface ScanResult {
    name: string;
    feature: string;
    guard_name: string;
    created_at: string | null;
    in_db: boolean;
    in_code: boolean;
    files: string[];
    id: number | null;
}

interface Props {
    scanResults: ScanResult[];
}

export default function PermissionScan({ scanResults }: Props) {
    const handleAddMissing = (name: string) => {
        router.post(store().url, { name });
    };

    const handleAddAllMissing = () => {
        const missingNames = scanResults
            .filter((r) => !r.in_db)
            .map((r) => r.name);

        if (missingNames.length > 0) {
            router.post(storeBulk().url, { names: missingNames });
        }
    };

    const features = Array.from(new Set(scanResults.map((r) => r.feature)));
    const missingCount = scanResults.filter((r) => !r.in_db).length;

    const columns: ColumnsType<ScanResult> = [
        {
            title: 'Feature',
            dataIndex: 'feature',
            key: 'feature',
            render: (text) => <Tag color="blue">{text}</Tag>,
            filters: features.map((f) => ({ text: f, value: f })),
            onFilter: (value, record) => record.feature === value,
        },
        {
            title: 'Permission Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => (
                <Text code className="text-primary">
                    {text}
                </Text>
            ),
        },
        {
            title: 'In DB',
            dataIndex: 'in_db',
            key: 'in_db',
            align: 'center',
            render: (inDb, record) => (
                <Space>
                    {inDb ? (
                        <Tooltip title="Found in database">
                            <CheckCircleOutlined className="text-lg text-emerald-500" />
                        </Tooltip>
                    ) : (
                        <Space>
                            <Tooltip title="Missing from database">
                                <CloseCircleOutlined className="text-lg text-red-500" />
                            </Tooltip>
                            <Button
                                size="small"
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => handleAddMissing(record.name)}
                            >
                                Add
                            </Button>
                        </Space>
                    )}
                </Space>
            ),
        },
        {
            title: 'In Code',
            dataIndex: 'in_code',
            key: 'in_code',
            align: 'center',
            render: (inCode, record) =>
                inCode ? (
                    <Tooltip title={`Found in ${record.files.length} files`}>
                        <CheckCircleOutlined className="text-lg text-emerald-500" />
                    </Tooltip>
                ) : (
                    <Tooltip title="Not found in source code or routes">
                        <Badge status="warning" text="Unused" />
                    </Tooltip>
                ),
        },
        {
            title: 'Files / Locations',
            key: 'files',
            render: (_, record) =>
                record.files.length > 0 ? (
                    <div className="max-w-xs overflow-hidden">
                        {record.files.map((file, i) => (
                            <div
                                key={i}
                                className="mb-1 truncate text-xs text-muted-foreground"
                                title={file}
                            >
                                <FileTextOutlined className="mr-1" />
                                {file}
                            </div>
                        ))}
                    </div>
                ) : (
                    <Text type="secondary" italic>
                        No code matches found
                    </Text>
                ),
        },
    ];

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6">
            <Head title="Scan Permissions" />
            <PageHeader
                eyebrow="Admin / Permissions"
                title="Permission Scanner"
                description="Bandingkan permission di database dengan yang dipakai di kode."
                actions={
                    <>
                        <Button
                            icon={<LeftOutlined />}
                            size="large"
                            onClick={() => router.get(index().url)}
                        >
                            Back
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            size="large"
                            disabled={missingCount === 0}
                            onClick={handleAddAllMissing}
                        >
                            Add all missing ({missingCount})
                        </Button>
                    </>
                }
            />

            <Panel bodyClassName="p-4 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-muted/40 px-4 py-3">
                    <Badge status="success" text="In sync" />
                    <Badge status="error" text="Missing from DB" />
                    <Badge status="warning" text="Unused in code" />
                    <span className="text-xs text-muted-foreground">
                        {scanResults.length} scanned
                    </span>
                </div>
                <DataTable
                    columns={columns}
                    data={scanResults}
                    rowKey="name"
                    clientSide
                    searchPlaceholder="Search permissions..."
                />
            </Panel>
        </div>
    );
}

PermissionScan.layout = () => ({
    breadcrumbs: [
        { title: 'Admin', href: '#' },
        { title: 'Permissions', href: index().url },
        { title: 'Scan', href: '#' },
    ],
});
