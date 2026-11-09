<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            [
                'sku' => 'LAPTOP-001',
                'name' => 'Laptop Gaming Pro',
                'description' => 'Laptop de alto rendimiento con procesador Intel i7, 16GB RAM, 512GB SSD',
                'price' => 1299.99,
                'stock' => 25,
                'image_url' => 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
                'is_active' => true,
            ],
            [
                'sku' => 'PHONE-001',
                'name' => 'Smartphone X Pro',
                'description' => 'Smartphone con pantalla OLED 6.5", 128GB, cámara triple 48MP',
                'price' => 899.99,
                'stock' => 50,
                'image_url' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
                'is_active' => true,
            ],
            [
                'sku' => 'HEAD-001',
                'name' => 'Auriculares Bluetooth Premium',
                'description' => 'Auriculares inalámbricos con cancelación de ruido activa, 30h batería',
                'price' => 249.99,
                'stock' => 100,
                'image_url' => 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
                'is_active' => true,
            ],
            [
                'sku' => 'WATCH-001',
                'name' => 'Smartwatch Fitness',
                'description' => 'Reloj inteligente con monitor cardíaco, GPS, resistente al agua',
                'price' => 199.99,
                'stock' => 75,
                'image_url' => 'https://images.unsplash.com/photo-1660844817855-3ecc7ef21f12?q=80&w=786&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
                'is_active' => true,
            ],
            [
                'sku' => 'TAB-001',
                'name' => 'Tablet 10" HD',
                'description' => 'Tablet con pantalla 10.1" Full HD, 64GB, WiFi + 4G',
                'price' => 349.99,
                'stock' => 40,
                'image_url' => 'https://images.unsplash.com/photo-1527698266440-12104e498b76?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
                'is_active' => true,
            ],
            [
                'sku' => 'CAM-001',
                'name' => 'Cámara Digital 4K',
                'description' => 'Cámara mirrorless con sensor full-frame, video 4K, estabilización',
                'price' => 1599.99,
                'stock' => 15,
                'image_url' => 'https://images.unsplash.com/photo-1623949556303-b0d17d198863?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
                'is_active' => true,
            ],
            [
                'sku' => 'KEY-001',
                'name' => 'Teclado Mecánico RGB',
                'description' => 'Teclado gaming mecánico con switches Cherry MX, retroiluminación RGB',
                'price' => 129.99,
                'stock' => 60,
                'image_url' => 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
                'is_active' => true,
            ],
            [
                'sku' => 'MOUSE-001',
                'name' => 'Mouse Inalámbrico Ergonómico',
                'description' => 'Mouse ergonómico con sensor óptico 4000 DPI, 6 botones programables',
                'price' => 49.99,
                'stock' => 150,
                'image_url' => 'https://images.unsplash.com/photo-1658070429465-848c0796abf3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
                'is_active' => true,
            ],
            [
                'sku' => 'MON-001',
                'name' => 'Monitor 27" 4K',
                'description' => 'Monitor IPS 27" UHD 4K, HDR10, 60Hz, puertos HDMI y DisplayPort',
                'price' => 449.99,
                'stock' => 30,
                'image_url' => 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
                'is_active' => true,
            ],
            [
                'sku' => 'SPEAK-001',
                'name' => 'Altavoz Bluetooth Portátil',
                'description' => 'Altavoz inalámbrico resistente al agua IPX7, 20h batería, sonido 360°',
                'price' => 79.99,
                'stock' => 80,
                'image_url' => 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
                'is_active' => true,
            ],
            [
                'sku' => 'CHARG-001',
                'name' => 'Cargador Rápido USB-C 65W',
                'description' => 'Cargador GaN compacto con 3 puertos: 2 USB-C y 1 USB-A',
                'price' => 39.99,
                'stock' => 200,
                'image_url' => 'https://images.unsplash.com/photo-1731616103600-3fe7ccdc5a59?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
                'is_active' => true,
            ],
            [
                'sku' => 'CASE-001',
                'name' => 'Funda Protectora Smartphone',
                'description' => 'Funda antigolpes con protección militar, compatible con carga inalámbrica',
                'price' => 24.99,
                'stock' => 300,
                'image_url' => 'https://images.unsplash.com/photo-1623393945964-8f5d573f9358?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D',
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
