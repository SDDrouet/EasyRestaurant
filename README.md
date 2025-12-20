# RestoFlow - Sistema de Comandas y Gestión de Cocina

## 📋 Tabla de Contenidos
1. [Descripción General](#descripción-general)
2. [Actores y Roles del Sistema](#actores-y-roles-del-sistema)
3. [Requisitos Funcionales](#requisitos-funcionales)
4. [Requisitos No Funcionales](#requisitos-no-funcionales)
5. [Modelo de Datos](#modelo-de-datos)
6. [Sistema de Roles y Permisos](#sistema-de-roles-y-permisos)
7. [Reglas de Negocio](#reglas-de-negocio)
8. [Casos de Uso Detallados](#casos-de-uso-detallados)
9. [APIs y Endpoints](#apis-y-endpoints)
10. [Stack Tecnológico](#stack-tecnológico)

---

## 📖 Descripción General

**RestoFlow** es un sistema integral de gestión de comandas para restaurantes que permite la comunicación en tiempo real entre meseros y cocina, optimizando el flujo de trabajo y mejorando la experiencia del cliente.

### Objetivos del Sistema
- Digitalizar el proceso de toma de pedidos
- Comunicación instantánea entre sala y cocina
- Gestión eficiente del estado de las mesas
- Control de acceso basado en roles
- Dashboard administrativo para análisis de ventas

---

## 👥 Actores y Roles del Sistema

### 1. **ADMIN** (Administrador)
**Responsabilidades:**
- Gestión completa del sistema
- Configuración de usuarios y roles
- Administración del menú (productos y categorías)
- Visualización de reportes y estadísticas
- Gestión de mesas y configuración del restaurante

**Accesos:**
- Panel de administración web (escritorio)
- Todas las funcionalidades del sistema

---

### 2. **WAITER** (Mesero)
**Responsabilidades:**
- Gestión del estado de las mesas
- Toma y envío de pedidos
- Seguimiento del estado de los platos
- Generación y cierre de cuentas

**Accesos:**
- Aplicación móvil/tablet
- Vista de mesas y comandas asignadas

---

### 3. **KITCHEN** (Cocina)
**Responsabilidades:**
- Recepción de pedidos en tiempo real
- Actualización del estado de preparación de platos
- Notificación de platos listos para servir

**Accesos:**
- Pantalla de cocina (KDS - Kitchen Display System)
- Vista de pedidos activos

---

### 4. **CASHIER** (Cajero) - *Opcional para MVP*
**Responsabilidades:**
- Procesamiento de pagos
- Cierre de caja
- Generación de reportes de ventas

**Accesos:**
- Terminal de punto de venta
- Vista de cuentas pendientes

---

## ✅ Requisitos Funcionales

### RF-001: Autenticación y Autorización
- El sistema debe permitir login con usuario y contraseña
- Debe implementar autenticación basada en JWT
- Debe validar permisos según el rol del usuario
- Debe cerrar sesión automáticamente después de inactividad

### RF-002: Gestión de Usuarios (ADMIN)
- Crear, editar y eliminar usuarios
- Asignar roles a usuarios
- Cambiar contraseñas
- Activar/desactivar cuentas

### RF-003: Gestión de Menú (ADMIN)
- Crear, editar y eliminar categorías
- Crear, editar y eliminar productos
- Asignar productos a categorías
- Cargar imágenes de productos
- Establecer precios y disponibilidad
- Activar/desactivar productos

### RF-004: Gestión de Mesas (ADMIN/WAITER)
- Visualizar estado de todas las mesas
- Estados: Disponible, Ocupada, Reservada, Sucia
- Asignar mesa a un mesero
- Cambiar estado de mesa
- Configurar número y disposición de mesas

### RF-005: Toma de Pedidos (WAITER)
- Abrir una mesa (cambiar estado a Ocupada)
- Seleccionar productos del menú
- Agregar productos al pedido
- Especificar cantidad de cada producto
- Agregar notas o modificaciones al pedido
- Enviar pedido a cocina
- Modificar pedido antes de ser enviado

### RF-006: Gestión de Comandas (WAITER)
- Ver lista de pedidos activos de sus mesas
- Consultar estado de cada plato
- Recibir notificaciones cuando platos estén listos
- Marcar platos como servidos
- Agregar productos adicionales a comandas existentes

### RF-007: Display de Cocina (KITCHEN)
- Recibir pedidos en tiempo real
- Visualizar pedidos en formato Kanban
- Estados: Pendiente, En Preparación, Listo
- Cambiar estado de cada plato individualmente
- Filtrar por tipo de plato o estación
- Alertas sonoras/visuales para nuevos pedidos
- Ver tiempo transcurrido desde que se ordenó

### RF-008: Cierre de Cuenta (WAITER)
- Generar cuenta detallada con todos los productos
- Calcular subtotal, impuestos y total
- Aplicar descuentos (si tiene permiso)
- Generar recibo/factura
- Registrar método de pago
- Liberar mesa al confirmar pago

### RF-009: Dashboard y Reportes (ADMIN)
- Ver ventas del día en tiempo real
- Productos más vendidos
- Promedio de consumo por mesa
- Tiempo promedio de ocupación de mesas
- Ventas por mesero
- Productos en cocina actualmente
- Exportar reportes a PDF/Excel

### RF-010: Notificaciones en Tiempo Real
- Notificar a cocina cuando llega nuevo pedido
- Notificar a mesero cuando plato está listo
- Notificar a admin sobre eventos importantes

---

## 🔧 Requisitos No Funcionales

### RNF-001: Rendimiento
- El sistema debe soportar al menos 50 mesas simultáneas
- Latencia máxima de 2 segundos para actualización en tiempo real
- Tiempo de respuesta de APIs menor a 500ms

### RNF-002: Seguridad
- Las contraseñas deben almacenarse con encriptación BCrypt
- Comunicación HTTPS obligatoria en producción
- Tokens JWT con expiración de 8 horas
- Validación de entrada en todos los endpoints

### RNF-003: Disponibilidad
- Disponibilidad del sistema 99% durante horarios de operación
- Manejo de errores con mensajes descriptivos
- Logs de todas las operaciones críticas

### RNF-004: Usabilidad
- Interfaz responsiva para móvil y tablet
- Accesibilidad según estándares WCAG 2.1
- Tiempo de aprendizaje menor a 30 minutos para nuevos usuarios

### RNF-005: Escalabilidad
- Arquitectura preparada para múltiples sucursales
- Base de datos optimizada para crecimiento

---

## 🗄️ Modelo de Datos

### Entidad: User (Usuario)
```
User
├── id: BIGINT [PK]
├── username: VARCHAR(50) [UNIQUE, NOT NULL]
├── email: VARCHAR(100) [UNIQUE, NOT NULL]
├── password: VARCHAR(255) [NOT NULL] (BCrypt hash)
├── first_name: VARCHAR(50) [NOT NULL]
├── last_name: VARCHAR(50) [NOT NULL]
├── role_id: BIGINT [FK → Role] [NOT NULL]
├── is_active: BOOLEAN [DEFAULT true]
├── created_at: TIMESTAMP [DEFAULT CURRENT_TIMESTAMP]
├── updated_at: TIMESTAMP [DEFAULT CURRENT_TIMESTAMP]
└── last_login: TIMESTAMP
```

**Relaciones:**
- Un usuario pertenece a un rol (Many-to-One)
- Un usuario puede tener muchas órdenes (One-to-Many)

---

### Entidad: Role (Rol)
```
Role
├── id: BIGINT [PK]
├── name: VARCHAR(20) [UNIQUE, NOT NULL]
│   └── ENUM: ADMIN, WAITER, KITCHEN, CASHIER
├── description: VARCHAR(255)
├── created_at: TIMESTAMP [DEFAULT CURRENT_TIMESTAMP]
└── updated_at: TIMESTAMP
```

**Relaciones:**
- Un rol puede tener muchos usuarios (One-to-Many)
- Un rol tiene muchos permisos (Many-to-Many)

---

### Entidad: Permission (Permiso)
```
Permission
├── id: BIGINT [PK]
├── name: VARCHAR(50) [UNIQUE, NOT NULL]
│   └── Ejemplos: CREATE_ORDER, UPDATE_PRODUCT, VIEW_REPORTS
├── resource: VARCHAR(50) [NOT NULL]
│   └── Ejemplos: ORDER, PRODUCT, USER, TABLE
├── action: VARCHAR(20) [NOT NULL]
│   └── ENUM: CREATE, READ, UPDATE, DELETE, EXECUTE
├── description: VARCHAR(255)
└── created_at: TIMESTAMP [DEFAULT CURRENT_TIMESTAMP]
```

**Relaciones:**
- Un permiso puede estar asignado a muchos roles (Many-to-Many)

---

### Entidad: RolePermission (Tabla Intermedia)
```
RolePermission
├── role_id: BIGINT [FK → Role] [PK]
├── permission_id: BIGINT [FK → Permission] [PK]
└── assigned_at: TIMESTAMP [DEFAULT CURRENT_TIMESTAMP]
```

**Clave Primaria Compuesta:** (role_id, permission_id)

---

### Entidad: Category (Categoría)
```
Category
├── id: BIGINT [PK]
├── name: VARCHAR(50) [UNIQUE, NOT NULL]
├── description: TEXT
├── icon: VARCHAR(100)
├── display_order: INTEGER [DEFAULT 0]
├── is_active: BOOLEAN [DEFAULT true]
├── created_by: BIGINT [FK → User]
├── created_at: TIMESTAMP [DEFAULT CURRENT_TIMESTAMP]
└── updated_at: TIMESTAMP
```

**Relaciones:**
- Una categoría tiene muchos productos (One-to-Many)

---

### Entidad: Product (Producto/Plato)
```
Product
├── id: BIGINT [PK]
├── category_id: BIGINT [FK → Category] [NOT NULL]
├── name: VARCHAR(100) [NOT NULL]
├── description: TEXT
├── price: DECIMAL(10,2) [NOT NULL]
├── image_url: VARCHAR(255)
├── preparation_time: INTEGER (en minutos)
├── is_available: BOOLEAN [DEFAULT true]
├── is_active: BOOLEAN [DEFAULT true]
├── kitchen_station: VARCHAR(20)
│   └── ENUM: GRILL, FRY, COLD, BAR, DESSERT
├── created_by: BIGINT [FK → User]
├── created_at: TIMESTAMP [DEFAULT CURRENT_TIMESTAMP]
└── updated_at: TIMESTAMP
```

**Relaciones:**
- Un producto pertenece a una categoría (Many-to-One)
- Un producto puede estar en muchos items de orden (One-to-Many)

---

### Entidad: Table (Mesa)
```
Table
├── id: BIGINT [PK]
├── table_number: VARCHAR(10) [UNIQUE, NOT NULL]
├── capacity: INTEGER [NOT NULL]
├── status: VARCHAR(20) [NOT NULL]
│   └── ENUM: AVAILABLE, OCCUPIED, RESERVED, DIRTY
├── section: VARCHAR(50)
├── qr_code: VARCHAR(255)
├── is_active: BOOLEAN [DEFAULT true]
├── created_at: TIMESTAMP [DEFAULT CURRENT_TIMESTAMP]
└── updated_at: TIMESTAMP
```

**Relaciones:**
- Una mesa puede tener muchas órdenes (One-to-Many)

---

### Entidad: Order (Comanda/Orden)
```
Order
├── id: BIGINT [PK]
├── order_number: VARCHAR(20) [UNIQUE, NOT NULL] (Auto-generado)
├── table_id: BIGINT [FK → Table] [NOT NULL]
├── waiter_id: BIGINT [FK → User] [NOT NULL]
├── status: VARCHAR(20) [NOT NULL]
│   └── ENUM: PENDING, IN_PROGRESS, READY, SERVED, PAID, CANCELLED
├── subtotal: DECIMAL(10,2) [NOT NULL]
├── tax: DECIMAL(10,2) [DEFAULT 0.00]
├── discount: DECIMAL(10,2) [DEFAULT 0.00]
├── total: DECIMAL(10,2) [NOT NULL]
├── payment_method: VARCHAR(20)
│   └── ENUM: CASH, CARD, TRANSFER, NULL
├── customer_name: VARCHAR(100)
├── notes: TEXT
├── created_at: TIMESTAMP [DEFAULT CURRENT_TIMESTAMP]
├── sent_to_kitchen_at: TIMESTAMP
├── completed_at: TIMESTAMP
└── paid_at: TIMESTAMP
```

**Relaciones:**
- Una orden pertenece a una mesa (Many-to-One)
- Una orden pertenece a un mesero (Many-to-One)
- Una orden tiene muchos items (One-to-Many)

---

### Entidad: OrderItem (Item de Comanda)
```
OrderItem
├── id: BIGINT [PK]
├── order_id: BIGINT [FK → Order] [NOT NULL]
├── product_id: BIGINT [FK → Product] [NOT NULL]
├── quantity: INTEGER [NOT NULL] [DEFAULT 1]
├── unit_price: DECIMAL(10,2) [NOT NULL]
├── subtotal: DECIMAL(10,2) [NOT NULL]
├── status: VARCHAR(20) [NOT NULL]
│   └── ENUM: PENDING, PREPARING, READY, SERVED, CANCELLED
├── notes: TEXT (modificaciones del cliente)
├── kitchen_station: VARCHAR(20)
├── created_at: TIMESTAMP [DEFAULT CURRENT_TIMESTAMP]
├── started_at: TIMESTAMP
├── ready_at: TIMESTAMP
└── served_at: TIMESTAMP
```

**Relaciones:**
- Un item pertenece a una orden (Many-to-One)
- Un item referencia a un producto (Many-to-One)

---

### Entidad: AuditLog (Log de Auditoría)
```
AuditLog
├── id: BIGINT [PK]
├── user_id: BIGINT [FK → User]
├── action: VARCHAR(50) [NOT NULL]
├── resource: VARCHAR(50) [NOT NULL]
├── resource_id: BIGINT
├── old_value: TEXT (JSON)
├── new_value: TEXT (JSON)
├── ip_address: VARCHAR(45)
├── user_agent: VARCHAR(255)
└── created_at: TIMESTAMP [DEFAULT CURRENT_TIMESTAMP]
```

**Propósito:** Rastrear todas las operaciones críticas del sistema

---

## 🔐 Sistema de Roles y Permisos

### Matriz de Permisos

| Recurso | Acción | ADMIN | WAITER | KITCHEN | CASHIER |
|---------|--------|-------|--------|---------|---------|
| **USER** | CREATE | ✅ | ❌ | ❌ | ❌ |
| | READ | ✅ | ❌ | ❌ | ❌ |
| | UPDATE | ✅ | ❌ | ❌ | ❌ |
| | DELETE | ✅ | ❌ | ❌ | ❌ |
| **CATEGORY** | CREATE | ✅ | ❌ | ❌ | ❌ |
| | READ | ✅ | ✅ | ✅ | ✅ |
| | UPDATE | ✅ | ❌ | ❌ | ❌ |
| | DELETE | ✅ | ❌ | ❌ | ❌ |
| **PRODUCT** | CREATE | ✅ | ❌ | ❌ | ❌ |
| | READ | ✅ | ✅ | ✅ | ✅ |
| | UPDATE | ✅ | ❌ | ❌ | ❌ |
| | DELETE | ✅ | ❌ | ❌ | ❌ |
| | TOGGLE_AVAILABILITY | ✅ | ❌ | ✅ | ❌ |
| **TABLE** | CREATE | ✅ | ❌ | ❌ | ❌ |
| | READ | ✅ | ✅ | ❌ | ✅ |
| | UPDATE | ✅ | ✅ | ❌ | ❌ |
| | CHANGE_STATUS | ✅ | ✅ | ❌ | ❌ |
| **ORDER** | CREATE | ✅ | ✅ | ❌ | ❌ |
| | READ | ✅ | ✅ | ✅ | ✅ |
| | UPDATE | ✅ | ✅ | ❌ | ❌ |
| | CANCEL | ✅ | ✅ | ❌ | ❌ |
| | SEND_TO_KITCHEN | ✅ | ✅ | ❌ | ❌ |
| **ORDER_ITEM** | UPDATE_STATUS | ❌ | ❌ | ✅ | ❌ |
| **PAYMENT** | PROCESS | ✅ | ✅ | ❌ | ✅ |
| | APPLY_DISCOUNT | ✅ | ❌ | ❌ | ✅ |
| **REPORTS** | VIEW_DASHBOARD | ✅ | ❌ | ❌ | ✅ |
| | VIEW_SALES | ✅ | ❌ | ❌ | ✅ |
| | EXPORT | ✅ | ❌ | ❌ | ❌ |

### Permisos Predefinidos (Seed Data)

```sql
-- Permisos de Usuario
INSERT INTO permission (name, resource, action) VALUES
('CREATE_USER', 'USER', 'CREATE'),
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
('CREATE_TABLE', 'TABLE', 'CREATE'),
('READ_TABLE', 'TABLE', 'READ'),
('UPDATE_TABLE', 'TABLE', 'UPDATE'),
('CHANGE_TABLE_STATUS', 'TABLE', 'EXECUTE'),

-- Permisos de Orden
('CREATE_ORDER', 'ORDER', 'CREATE'),
('READ_ORDER', 'ORDER', 'READ'),
('UPDATE_ORDER', 'ORDER', 'UPDATE'),
('CANCEL_ORDER', 'ORDER', 'DELETE'),
('SEND_ORDER_TO_KITCHEN', 'ORDER', 'EXECUTE'),
('UPDATE_ORDER_ITEM_STATUS', 'ORDER_ITEM', 'UPDATE'),

-- Permisos de Pago
('PROCESS_PAYMENT', 'PAYMENT', 'EXECUTE'),
('APPLY_DISCOUNT', 'PAYMENT', 'EXECUTE'),

-- Permisos de Reportes
('VIEW_DASHBOARD', 'REPORT', 'READ'),
('VIEW_SALES_REPORT', 'REPORT', 'READ'),
('EXPORT_REPORT', 'REPORT', 'EXECUTE');
```

---

## 📜 Reglas de Negocio

### RN-001: Gestión de Mesas
- Una mesa solo puede tener una orden activa a la vez
- No se puede abrir una mesa que esté en estado OCCUPIED
- Al cerrar una orden, la mesa debe cambiar automáticamente a DIRTY
- Una mesa DIRTY debe limpiarse manualmente para volver a AVAILABLE

### RN-002: Órdenes
- Una orden debe tener al menos un item antes de ser enviada a cocina
- El order_number debe generarse automáticamente con formato: ORD-YYYYMMDD-XXXX
- No se pueden agregar items a una orden que ya fue pagada
- Solo se puede cancelar una orden que no tenga items en estado PREPARING o READY

### RN-003: Items de Orden
- Al enviar una orden a cocina, todos los items pasan a estado PENDING
- Un item solo puede pasar a PREPARING si está en PENDING
- Un item solo puede pasar a READY si está en PREPARING
- Un item solo puede pasar a SERVED si está en READY
- El mesero no puede cambiar el estado de items en cocina

### RN-004: Cálculos Financieros
- subtotal = SUM(quantity × unit_price) de todos los items
- tax = subtotal × 0.12 (12% IVA Ecuador)
- total = subtotal + tax - discount
- El descuento no puede ser mayor al subtotal
- Al guardar un OrderItem, unit_price debe copiarse del Product.price actual

### RN-005: Productos
- Un producto no disponible (is_available = false) no puede agregarse a nuevas órdenes
- Al desactivar un producto, no afecta las órdenes existentes
- El precio debe ser mayor a 0

### RN-006: Seguridad
- Las contraseñas deben tener mínimo 8 caracteres
- Los tokens JWT expiran después de 8 horas
- Después de 3 intentos fallidos de login, bloquear cuenta por 15 minutos
- Todas las operaciones de modificación deben registrarse en AuditLog

### RN-007: Estados de Orden (Flujo)
```
PENDING → IN_PROGRESS → READY → SERVED → PAID
             ↓
          CANCELLED (solo desde PENDING o IN_PROGRESS)
```

### RN-008: Estados de OrderItem (Flujo)
```
PENDING → PREPARING → READY → SERVED
   ↓
CANCELLED (solo desde PENDING)
```

### RN-009: Notificaciones en Tiempo Real
- Al crear una orden, notificar a cocina inmediatamente
- Al cambiar un item a READY, notificar al mesero asignado
- Al cancelar un item en cocina, notificar al mesero

---

## 📝 Casos de Uso Detallados

### CU-001: Autenticación de Usuario

**Actor:** Todos

**Precondiciones:** El usuario debe estar registrado en el sistema

**Flujo Principal:**
1. El usuario accede a la pantalla de login
2. Ingresa username y password
3. El sistema valida las credenciales
4. Si son correctas, genera un token JWT
5. Retorna el token, información del usuario y sus permisos
6. Redirige según el rol:
   - ADMIN → Dashboard administrativo
   - WAITER → Vista de mesas
   - KITCHEN → Display de cocina
   - CASHIER → Terminal de pago

**Flujo Alternativo:**
- 3a. Credenciales incorrectas → mostrar error y registrar intento
- 3b. Usuario inactivo → mostrar mensaje de cuenta bloqueada
- 3c. Tercer intento fallido → bloquear cuenta por 15 minutos

**Postcondiciones:** El usuario tiene acceso al sistema según su rol

---

### CU-002: Crear Nuevo Pedido (Mesero)

**Actor:** WAITER

**Precondiciones:** 
- El mesero debe estar autenticado
- Debe haber al menos una mesa disponible
- Debe haber productos activos en el menú

**Flujo Principal:**
1. El mesero selecciona una mesa AVAILABLE
2. El sistema cambia el estado de la mesa a OCCUPIED
3. El sistema crea una nueva orden en estado PENDING
4. El mesero navega por las categorías del menú
5. Selecciona productos y especifica cantidades
6. Puede agregar notas especiales a cada producto
7. Revisa el resumen del pedido (muestra subtotal)
8. Confirma y envía el pedido a cocina
9. El sistema:
   - Cambia la orden a IN_PROGRESS
   - Actualiza sent_to_kitchen_at
   - Calcula subtotal, tax y total
   - Notifica a la cocina vía WebSocket
   - Crea los OrderItems en estado PENDING

**Flujo Alternativo:**
- 1a. Mesa ocupada → mostrar error
- 4a. No hay productos disponibles → mostrar mensaje
- 8a. Pedido vacío → mostrar error

**Postcondiciones:** 
- La orden está registrada y visible en cocina
- La mesa está ocupada

---

### CU-003: Preparar Platos (Cocina)

**Actor:** KITCHEN

**Precondiciones:**
- El usuario de cocina debe estar autenticado
- Debe haber órdenes con items en estado PENDING

**Flujo Principal:**
1. La pantalla de cocina muestra todas las órdenes activas
2. Los items se organizan en columnas tipo Kanban:
   - PENDING (nuevos)
   - PREPARING (en proceso)
   - READY (listos para servir)
3. El cocinero toca un item PENDING
4. El sistema lo mueve a PREPARING y registra started_at
5. Cuando termina, el cocinero toca el item nuevamente
6. El sistema lo mueve a READY y registra ready_at
7. Notifica al mesero vía WebSocket
8. El item aparece en el dispositivo del mesero como "Listo para servir"

**Flujo Alternativo:**
- 3a. Si todos los items de una orden están READY, la orden cambia a READY

**Postcondiciones:**
- Los items avanzan en su preparación
- El mesero está informado cuando puede recoger

---

### CU-004: Cerrar Cuenta (Mesero)

**Actor:** WAITER

**Precondiciones:**
- La orden debe estar en estado SERVED
- Todos los items deben estar en estado SERVED

**Flujo Principal:**
1. El mesero selecciona la mesa a cerrar
2. El sistema muestra el detalle de la cuenta:
   - Lista de productos con cantidades y precios
   - Subtotal
   - Tax (12%)
   - Total
3. El mesero puede aplicar un descuento (si tiene permiso)
4. Selecciona el método de pago (CASH, CARD, TRANSFER)
5. Confirma el pago
6. El sistema:
   - Cambia la orden a PAID
   - Registra paid_at
   - Actualiza payment_method
   - Cambia la mesa a DIRTY
   - Genera el número de comprobante
7. Muestra recibo digital (opción de imprimir)

**Flujo Alternativo:**
- 1a. Hay items no servidos → mostrar advertencia
- 3a. Descuento sin permiso → denegar
- 3b. Descuento mayor al subtotal → mostrar error

**Postcondiciones:**
- La orden está pagada
- La mesa está sucia y lista para limpieza
- Se registró la venta

---

### CU-005: Gestionar Menú (Admin)

**Actor:** ADMIN

**Precondiciones:** El admin debe estar autenticado

**Flujo Principal - Crear Producto:**
1. El admin accede a la sección "Gestión de Menú"
2. Hace clic en "Nuevo Producto"
3. Completa el formulario:
   - Nombre
   - Descripción
   - Categoría
   - Precio
   - Tiempo de preparación estimado
   - Estación de cocina
   - Imagen (upload)
4. Guarda el producto
5. El sistema valida los datos
6. Crea el producto con is_available = true
7. Registra created_by = admin.id

**Flujo Alternativo:**
- 5a. Datos inválidos → mostrar errores de validación
- 6a. Nombre duplicado → mostrar error

**Flujo Principal - Editar Producto:**
1. Busca el producto
2. Modifica los campos necesarios
3. Guarda cambios
4. El sistema actualiza updated_at

**Flujo Principal - Desactivar Producto:**
1. Selecciona el producto
2. Cambia is_available a false
3. El producto deja de aparecer en nuevos pedidos

**Postcondiciones:** 
- El menú está actualizado
- Los cambios son inmediatos en las apps de meseros

---

### CU-006: Ver Dashboard (Admin)

**Actor:** ADMIN

**Precondiciones:** El admin debe estar autenticado

**Flujo Principal:**
1. El admin accede al dashboard
2. El sistema muestra en tiempo real:
   - **Ventas del día:**
     - Total vendido hoy
     - Número de órdenes
     - Ticket promedio
   - **Productos más vendidos:**
     - Top 10 con cantidades
   - **Estado actual:**
     - Mesas ocupadas/disponibles
     - Órdenes activas en cocina
   - **Gráficos:**
     - Ventas por hora
     - Ventas por categoría
3. Puede filtrar por fecha
4. Puede exportar reportes

**Postcondiciones:** El admin tiene visibilidad completa del negocio

---

## 🌐 APIs y Endpoints

### Base URL
```
http://localhost:8080/api/v1
```

### Autenticación
Todas las APIs (excepto login) requieren header:
```
Authorization: Bearer {JWT_TOKEN}
```

---

### 1. Authentication API

#### POST /auth/login
**Descripción:** Autenticar usuario y obtener token

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "user": {
    "id": 1,
    "username": "juan.perez",
    "email": "juan@restoflow.com",
    "firstName": "Juan",
    "lastName": "Pérez",
    "role": "WAITER",
    "permissions": [
      "CREATE_ORDER",
      "READ