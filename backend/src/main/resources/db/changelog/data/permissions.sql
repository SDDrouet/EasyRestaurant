-- Permisos de Usuario
INSERT INTO permissions (name, resource, action)
VALUES ('CREATE_USER', 'USER', 'CREATE'),
       ('READ_USER', 'USER', 'READ'),
       ('UPDATE_USER', 'USER', 'UPDATE'),
       ('DELETE_USER', 'USER', 'DELETE'),

-- Permisos de Categoría
       ('CREATE_CATEGORY', 'CATEGORY', 'CREATE'),
       ('READ_CATEGORY', 'CATEGORY', 'READ'),
       ('UPDATE_CATEGORY', 'CATEGORY', 'UPDATE'),
       ('DELETE_CATEGORY', 'CATEGORY', 'DELETE'),

-- Permisos de Producto
       ('CREATE_PRODUCT', 'PRODUCT', 'CREATE'),
       ('READ_PRODUCT', 'PRODUCT', 'READ'),
       ('UPDATE_PRODUCT', 'PRODUCT', 'UPDATE'),
       ('DELETE_PRODUCT', 'PRODUCT', 'DELETE'),
       ('TOGGLE_PRODUCT_AVAILABILITY', 'PRODUCT', 'EXECUTE'),

-- Permisos de Mesa
       ('CREATE_RESTAURANT_TABLE', 'RESTAURANT_TABLE', 'CREATE'),
       ('READ_RESTAURANT_TABLE', 'RESTAURANT_TABLE', 'READ'),
       ('UPDATE_RESTAURANT_TABLE', 'RESTAURANT_TABLE', 'UPDATE'),
       ('CHANGE_RESTAURANT_TABLE_STATUS', 'RESTAURANT_TABLE', 'EXECUTE'),

-- Permisos de Orden
       ('CREATE_ORDER', 'ORDER', 'CREATE'),
       ('READ_ORDER', 'ORDER', 'READ'),
       ('CANCEL_ORDER', 'ORDER', 'DELETE'),
       ('PROCESS_PAYMENT', 'ORDER', 'EXECUTE'),

       ('UPDATE_ORDER_ITEM_STATUS', 'ORDER_ITEM', 'EXECUTE'),

-- Permisos de Reportes
       ('VIEW_DASHBOARD', 'REPORT', 'READ'),
       ('VIEW_SALES_REPORT', 'REPORT', 'READ'),
       ('EXPORT_REPORT', 'REPORT', 'EXECUTE');