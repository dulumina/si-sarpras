import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons';
import { Button, Image } from 'antd';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { scan } from '@/actions/App/Http/Controllers/Sarpras/AssetController';

interface Props {
    code: string | null;
    name: string;
}

function escapeHtml(value: string) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

export default function AssetQrLabel({ code, name }: Props) {
    const [dataUrl, setDataUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!code) {
            return;
        }

        const url = `${window.location.origin}${scan(code).url}`;

        QRCode.toDataURL(url, { width: 256, margin: 2 })
            .then(setDataUrl)
            .catch(() => setDataUrl(null));
    }, [code]);

    if (!code) {
        return (
            <p className="text-sm text-muted-foreground">
                Aset belum memiliki kode inventaris sehingga label QR tidak
                dapat dibuat.
            </p>
        );
    }

    if (!dataUrl) {
        return (
            <p className="text-sm text-muted-foreground">
                Membuat kode QR…
            </p>
        );
    }

    const labelCode = code;
    const labelDataUrl = dataUrl;

    const printLabel = () => {
        const win = window.open('', '_blank', 'width=420,height=560');

        if (!win) {
            return;
        }

        win.document.write(`<!doctype html>
<html lang="id">
<head><meta charset="utf-8" /><title>Label ${escapeHtml(labelCode)}</title></head>
<body style="font-family: sans-serif; text-align: center; padding: 24px;">
<h2 style="margin: 0 0 4px;">${escapeHtml(name)}</h2>
<p style="margin: 0 0 12px; font-size: 14px;">${escapeHtml(labelCode)}</p>
<img src="${labelDataUrl}" width="256" height="256" />
<script>window.onload = () => window.print();</script>
</body>
</html>`);
        win.document.close();
        win.focus();
    };

    return (
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Image
                src={dataUrl}
                alt={`QR ${code}`}
                width={180}
                height={180}
                preview={false}
                className="rounded-lg border border-border"
            />
            <div className="space-y-1">
                <p className="font-bold">{code}</p>
                <p className="text-sm text-muted-foreground">
                    Pindai kode untuk membuka detail aset ini.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                    <Button icon={<PrinterOutlined />} onClick={printLabel}>
                        Cetak Label
                    </Button>
                    <Button
                        icon={<DownloadOutlined />}
                        href={dataUrl}
                        download={`label-${code}.png`}
                    >
                        Unduh PNG
                    </Button>
                </div>
            </div>
        </div>
    );
}
