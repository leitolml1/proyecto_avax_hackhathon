-- Producto de prueba con precio mínimo para testear escrow
-- Reemplaza 'TU_ADDRESS_AQUI' con la dirección de tu wallet en Fuji
INSERT INTO "producto" (id_product, name, seller, nro_pedido, description, category, subcategory, condition, location, price, "create", image_url)
VALUES (
  gen_random_uuid(),
  'Producto Test Escrow',
  'TU_ADDRESS_AQUI',
  'TEST-ESCROW-001',
  'Producto de prueba para testear el flujo de escrow con AVAX mínimo',
  'Electrónica',
  'Accesorios',
  'Nuevo',
  'Fuji Testnet',
  0.0001,
  NOW(),
  'https://placehold.co/400x400/1e1e24/6b7280?text=Test+Escrow'
);
