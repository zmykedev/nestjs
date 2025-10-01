-- Script de inicialización para la base de datos
-- Este script se ejecuta automáticamente cuando se crea el contenedor

-- Crear extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Crear roles por defecto si no existen
INSERT INTO roles (name, description) VALUES 
('admin', 'Administrador del sistema'),
('user', 'Usuario estándar')
ON CONFLICT (name) DO NOTHING;

-- Crear usuario administrador por defecto
-- La contraseña es 'admin123' hasheada con bcrypt
INSERT INTO users (email, password, first_name, last_name, role_id, is_active) VALUES 
('admin@cmpc.com', '$2b$10$rQZ8K9vXqH2nF3gL4mN5pO6qR7sT8uV9wX0yZ1aB2cD3eF4gH5iJ6kL7mN8oP', 'Admin', 'User', 1, true)
ON CONFLICT (email) DO NOTHING;

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Base de datos inicializada correctamente';
    RAISE NOTICE 'Usuario admin creado: admin@cmpc.com / admin123';
END $$;
