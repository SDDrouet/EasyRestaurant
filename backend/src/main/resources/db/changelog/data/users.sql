-- habilitar funciones de hashing (pgcrypto)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- crear usuarios con contraseñas hasheadas (Seed Data)
INSERT INTO users (username, email, password, first_name, last_name, is_active)
VALUES 
	(
		'admin',
		'admin@easyrestaurant.local',
		crypt('1234', gen_salt('bf', 10)),
		'Admin',
		'User',
		true
	),
	(
		'waiter1',
		'waiter1@easyrestaurant.local',
		crypt('1234', gen_salt('bf', 10)),
		'Waiter',
		'One',
		true
	),
	(
		'kitchen1',
		'kitchen1@easyrestaurant.local',
		crypt('1234', gen_salt('bf', 10)),
		'Kitchen',
		'One',
		true
	),
	(
		'cashier1',
		'cashier1@easyrestaurant.local',
		crypt('1234', gen_salt('bf', 10)),
		'Cashier',
		'One',
		true
	);

-- asignar roles a los usuarios creados
-- Nota: requiere que los roles hayan sido sembrados previamente (ver roles.sql)

-- admin -> ADMIN
INSERT INTO user_roles (user_id, role_id, created_at, updated_at)
SELECT u.id, r.id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u
JOIN roles r ON r.name = 'ADMIN'
WHERE u.username = 'admin';

-- waiter1 -> WAITER
INSERT INTO user_roles (user_id, role_id, created_at, updated_at)
SELECT u.id, r.id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u
JOIN roles r ON r.name = 'WAITER'
WHERE u.username = 'waiter1';

-- kitchen1 -> KITCHEN
INSERT INTO user_roles (user_id, role_id, created_at, updated_at)
SELECT u.id, r.id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u
JOIN roles r ON r.name = 'KITCHEN'
WHERE u.username = 'kitchen1';

-- cashier1 -> CASHIER
INSERT INTO user_roles (user_id, role_id, created_at, updated_at)
SELECT u.id, r.id, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM users u
JOIN roles r ON r.name = 'CASHIER'
WHERE u.username = 'cashier1';
