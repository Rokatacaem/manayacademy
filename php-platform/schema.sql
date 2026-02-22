-- Extension de Base de Datos para Manay Academy (PHP Lite)
-- Base de datos objetivo: manayaca_Clientes
-- Tabla base existente: prospectos (id, nombre, correo, enviado)
-- 1. Tabla de Contenidos (Videoteca)
CREATE TABLE IF NOT EXISTS contenidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100) NOT NULL,
    -- Ej: 'Yoga', 'Meditación', 'Psicología', 'Crioterapia'
    youtube_id VARCHAR(20) NOT NULL,
    -- ID del video de YouTube (ej: dQw4w9WgXcQ)
    fecha_publicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    visitas INT DEFAULT 0,
    estado ENUM('activo', 'inactivo') DEFAULT 'activo'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 2. Tracking de Visualizaciones de Video
CREATE TABLE IF NOT EXISTS tracking_videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    -- Referencia a prospectos.id
    video_id INT NOT NULL,
    fecha_visualizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX (user_id),
    INDEX (video_id),
    FOREIGN KEY (video_id) REFERENCES contenidos(id) ON DELETE CASCADE -- No agregamos FK a prospectos porque a veces las tablas legacy MyISAM no lo soportan, 
    -- pero lógicamente se relaciona con prospectos(id).
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 3. Cola de Envíos de Correo (Throttle)
CREATE TABLE IF NOT EXISTS email_queue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    -- Destinatario (prospectos.id)
    contenido_id INT DEFAULT NULL,
    -- Contenido promocionado (opcional)
    asunto VARCHAR(255) NOT NULL,
    cuerpo TEXT NOT NULL,
    -- HTML del correo
    estado ENUM('pendiente', 'enviado', 'fallido') DEFAULT 'pendiente',
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    fecha_envio DATETIME NULL,
    INDEX (estado)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- 4. Tracking de Pixel de Apertura
CREATE TABLE IF NOT EXISTS email_tracking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pixel_id VARCHAR(64) NOT NULL UNIQUE,
    -- Hash único para la imagen
    user_id INT NOT NULL,
    email_queue_id INT DEFAULT NULL,
    fecha_apertura DATETIME DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
-- Datos de Ejemplo (Seed)
INSERT INTO contenidos (titulo, descripcion, categoria, youtube_id)
VALUES (
        'Introducción al Yoga',
        'Clase básica para principiantes.',
        'Yoga',
        'M7lc1UVf-VE'
    ),
    (
        'Meditación Guiada',
        '5 minutos de paz mental.',
        'Meditación',
        'inpok4MKVLM'
    ),
    (
        'Psicología del Bienestar',
        'Entendiendo tus emociones.',
        'Psicología',
        'qJq2bY6k0Fw'
    );
-- 5. Gestión de Estudiantes (Actualización Logica)
ALTER TABLE prospectos
ADD COLUMN last_login DATETIME NULL;
ALTER TABLE prospectos
ADD COLUMN status ENUM('active', 'inactive') DEFAULT 'active';