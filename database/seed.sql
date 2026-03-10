-- ================================================================
-- SEED DATA — ProyectoRopa
-- ================================================================
-- Datos de ejemplo para pruebas y demostración.
--
-- ⚠ CUÁNDO EJECUTAR:
--   Después de que todos los servicios Docker estén corriendo
--   (Spring Boot crea las tablas automáticamente al iniciar).
--   Esperar ~90 segundos desde "docker compose up" antes de correr esto.
--
-- 🚀 CÓMO EJECUTAR (desde la raíz del proyecto, con Docker corriendo):
--
--   Windows PowerShell / CMD:
--     docker exec -i postgres-db psql -U postgres < database/seed.sql
--
--   Linux / Mac:
--     docker exec -i postgres-db psql -U postgres < database/seed.sql
--
-- ✅ El script es IDEMPOTENTE para categorías y prendas (ON CONFLICT DO NOTHING).
--    Para sucursales y stock, solo ejecutar en una BD vacía.
-- ================================================================

-- ================================================================
-- BASE DE DATOS: producto_db
-- ================================================================
\connect producto_db

-- Categorías de ropa
INSERT INTO tb_categorias (nombre_categoria) VALUES
    ('Camisas'),
    ('Pantalones'),
    ('Vestidos'),
    ('Abrigos'),
    ('Accesorios')
ON CONFLICT (nombre_categoria) DO NOTHING;

-- Prendas de ejemplo con imágenes de Unsplash (CDN público, sin registro)
-- Columnas: nombre, precio_actual, imagen_url, id_categoria
INSERT INTO tb_prendas (nombre, precio_actual, imagen_url, id_categoria)
SELECT v.nombre, v.precio, v.img, c.id_categoria
FROM (VALUES
    ('Camisa Oxford Azul',       2499.00, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600', 'Camisas'),
    ('Camisa Lino Blanca',       1890.00, 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600', 'Camisas'),
    ('Pantalón Chino Beige',    3200.00, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', 'Pantalones'),
    ('Jean Slim Azul Oscuro',   4100.00, 'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=600', 'Pantalones'),
    ('Vestido Midi Floral',     5600.00, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600', 'Vestidos'),
    ('Vestido Casual Negro',    3800.00, 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600', 'Vestidos'),
    ('Abrigo Largo Camel',      8900.00, 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600', 'Abrigos'),
    ('Campera de Cuero Negra',  7500.00, 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=600', 'Abrigos'),
    ('Bufanda de Lana Gris',     990.00, 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600', 'Accesorios'),
    ('Cinturón Cuero Marrón',  1200.00, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600', 'Accesorios')
) AS v(nombre, precio, img, cat_nombre)
JOIN tb_categorias c ON c.nombre_categoria = v.cat_nombre
ON CONFLICT (nombre) DO NOTHING;

-- ================================================================
-- BASE DE DATOS: compra_db
-- ================================================================
\connect compra_db

-- Sucursales
-- NOTA: el frontend (CheckoutPage.jsx) usa sucursal ID = 1 por defecto.
--       La primera sucursal insertada recibirá ID = 1 (secuencia parte de 1).
-- Solo ejecutar si la tabla está vacía.
INSERT INTO tb_sucursales (nombre_sucursal, direccion_sucursal, telefono_sucursal)
SELECT 'Sucursal Central',  'Av. Corrientes 1234, CABA',    '011-4444-1234'
WHERE NOT EXISTS (SELECT 1 FROM tb_sucursales WHERE nombre_sucursal = 'Sucursal Central');

INSERT INTO tb_sucursales (nombre_sucursal, direccion_sucursal, telefono_sucursal)
SELECT 'Sucursal Palermo',  'Thames 1523, Palermo, CABA',   '011-4444-5678'
WHERE NOT EXISTS (SELECT 1 FROM tb_sucursales WHERE nombre_sucursal = 'Sucursal Palermo');

INSERT INTO tb_sucursales (nombre_sucursal, direccion_sucursal, telefono_sucursal)
SELECT 'Sucursal Belgrano', 'Cabildo 2156, Belgrano, CABA', '011-4444-9012'
WHERE NOT EXISTS (SELECT 1 FROM tb_sucursales WHERE nombre_sucursal = 'Sucursal Belgrano');

-- Stock inicial para la Sucursal Central (id_sucursal = 1)
-- id_prenda referencia los IDs de tb_prendas en producto_db.
-- En una BD recién sembrada, los IDs serán 1-10 en el orden de inserción de arriba.
-- Solo ejecutar si no hay stock cargado.
INSERT INTO tb_stock (cantidad, id_prenda, id_sucursal)
SELECT v.cant, v.prenda_id, 1
FROM (VALUES
    (15, 1), (15, 2), (10, 3), (10, 4),
    (8,  5), (8,  6), (5,  7), (5,  8),
    (20, 9), (20, 10)
) AS v(cant, prenda_id)
WHERE NOT EXISTS (SELECT 1 FROM tb_stock WHERE id_sucursal = 1);
