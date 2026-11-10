<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\Category;
use App\Models\Location;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoDataSeeder extends Seeder
{
    /**
     * Seed contoh data master dan pengguna peran untuk lingkungan pengembangan.
     */
    public function run(): void
    {
        // shortcut: data contoh tidak boleh ikut terpasang di produksi
        if (app()->isProduction()) {
            return;
        }

        $categories = [];
        foreach ([
            ['Elektronik', 'Proyektor, TV, komputer, dan perangkat elektronik lainnya'],
            ['Furniture', 'Meja, kursi, lemari, dan perlengkapan ruangan'],
            ['Kendaraan', 'Kendaraan operasional organisasi'],
        ] as [$name, $description]) {
            $categories[$name] = Category::firstOrCreate(['name' => $name], ['description' => $description]);
        }

        $locations = [];
        foreach (['Gedung A - Lantai 1', 'Gedung A - Lantai 2', 'Gedung B - Lantai 1', 'Gudang Sarpras'] as $name) {
            $locations[$name] = Location::firstOrCreate(['name' => $name]);
        }

        foreach ([
            ['Ruang Kelas A101', 'Gedung A - Lantai 1', 40],
            ['Ruang Kelas A201', 'Gedung A - Lantai 2', 40],
            ['Aula Serbaguna', 'Gedung B - Lantai 1', 200],
            ['Ruang Rapat Direksi', 'Gedung B - Lantai 1', 12],
        ] as [$name, $locationName, $capacity]) {
            Room::firstOrCreate(
                ['name' => $name],
                ['capacity' => $capacity, 'location_id' => $locations[$locationName]->id],
            );
        }

        // [kode, nama, kategori, lokasi, merek, tahun, nilai perolehan, kondisi, status]
        foreach ([
            ['INV-00001', 'Proyektor Epson EB-X06', 'Elektronik', 'Gedung A - Lantai 1', 'Epson', 2023, 6500000, 'baik', 'aktif'],
            ['INV-00002', 'Proyektor Epson EB-X49', 'Elektronik', 'Gedung A - Lantai 2', 'Epson', 2024, 7500000, 'baik', 'aktif'],
            ['INV-00003', 'TV Samsung 50 Inch', 'Elektronik', 'Gedung B - Lantai 1', 'Samsung', 2022, 5500000, 'baik', 'aktif'],
            ['INV-00004', 'Laptop Lenovo ThinkPad T14', 'Elektronik', 'Gedung A - Lantai 1', 'Lenovo', 2024, 15000000, 'baik', 'aktif'],
            ['INV-00005', 'Printer HP LaserJet Pro', 'Elektronik', 'Gedung A - Lantai 2', 'HP', 2021, 3200000, 'kurang-baik', 'aktif'],
            ['INV-00006', 'Speaker Aktif Portable', 'Elektronik', 'Gudang Sarpras', 'Yamaha', 2020, 2800000, 'rusak', 'dalam-perbaikan'],
            ['INV-00007', 'Meja Kerja Staf', 'Furniture', 'Gedung A - Lantai 1', null, 2022, 1200000, 'baik', 'aktif'],
            ['INV-00008', 'Kursi Ergonomis', 'Furniture', 'Gedung A - Lantai 1', null, 2022, 800000, 'baik', 'aktif'],
            ['INV-00009', 'Lemari Arsip Besi', 'Furniture', 'Gedung A - Lantai 2', null, 2019, 1500000, 'kurang-baik', 'aktif'],
            ['INV-00010', 'Papan Tulis Whiteboard', 'Furniture', 'Gedung B - Lantai 1', null, 2018, 500000, 'rusak', 'aktif'],
            ['INV-00011', 'Motor Operasional Honda BeAT', 'Kendaraan', 'Gudang Sarpras', 'Honda', 2021, 18000000, 'baik', 'aktif'],
            ['INV-00012', 'Mobil Operasional Toyota Avanza', 'Kendaraan', 'Gudang Sarpras', 'Toyota', 2019, 210000000, 'kurang-baik', 'aktif'],
        ] as [$code, $name, $categoryName, $locationName, $brand, $year, $cost, $condition, $status]) {
            Asset::firstOrCreate(
                ['inventory_code' => $code],
                [
                    'name' => $name,
                    'category_id' => $categories[$categoryName]->id,
                    'location_id' => $locations[$locationName]->id,
                    'brand' => $brand,
                    'acquisition_year' => $year,
                    'acquisition_cost' => $cost,
                    'condition' => $condition,
                    'status' => $status,
                ],
            );
        }

        foreach ([
            ['admin', 'Admin Sarpras'],
            ['pimpinan', 'Pimpinan'],
            ['pegawai', 'Pegawai Contoh'],
        ] as [$local, $name]) {
            User::firstOrCreate(
                ['email' => "{$local}@localhost"],
                ['name' => $name, 'password' => bcrypt('password'), 'email_verified_at' => now()],
            )->assignRole($local);
        }
    }
}
