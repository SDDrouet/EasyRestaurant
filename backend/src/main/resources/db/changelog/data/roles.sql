-- crear roles (Seed Data)
INSERT INTO roles (name, description)
VALUES ('ADMIN', 'Administrador del sistema con acceso total'),
       ('WAITER', 'Mesero encargado de tomar y gestionar órdenes'),
       ('KITCHEN', 'Personal de cocina encargado de preparar pedidos'),
       ('CASHIER', 'Cajero encargado de cobros y facturación');