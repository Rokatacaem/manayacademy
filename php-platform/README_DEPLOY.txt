GUÍA DE DESPLIEGUE - MANAY ACADEMY (VERSIÓN PHP)
==================================================

Requisitos del Servidor:
- PHP 8.0 o superior
- MySQL / MariaDB
- Acceso a cPanel (para Cron Jobs y Bases de Datos)

PASO 1: BASE DE DATOS
---------------------
1. Ingresa a phpMyAdmin desde cPanel.
2. Selecciona la base de datos `manayaca_Clientes`.
3. Ve a la pestaña "Importar".
4. Sube el archivo `schema.sql` y presiona "continuar".
   (Esto creará las tablas: contenidos, tracking_videos, email_queue, email_tracking).

PASO 2: ARCHIVOS
----------------
1. Sube todo el contenido de la carpeta `php-platform` a tu servidor.
   - Recomendado: Crear una carpeta `/plataforma` dentro de `public_html`.
2. Edita el archivo `config.php`:
   - DB_USER: Tu usuario de base de datos.
   - DB_PASS: Tu contraseña.
   - BASE_URL: La URL donde subiste los archivos (ej: https://manayacademy.com/plataforma).

PASO 3: TAREA CRON (AUTOMATIZACIÓN)
-----------------------------------
Para que los correos se envíen automáticamente:
1. Ve a "Tareas Cron" en cPanel.
2. Agrega una nueva tarea para que se ejecute "Una vez por hora" (0 * * * *).
3. Comando:
   php -q /home/usuario/public_html/plataforma/cron/process_queue.php

   (Asegúrate de cambiar `/home/usuario/public_html/plataforma` por la ruta real de tu hosting).

PASO 4: PRUEBA
--------------
1. Ingresa a https://manayacademy.com/plataforma/login.php
2. Intenta entrar con el correo de un prospecto real (que exista en la tabla `prospectos`).
3. Si entras, verás la Videoteca.
4. Para administrar, entra a `/admin/dashboard.php`.

NOTAS DE SEGURIDAD
------------------
- El archivo `config.php` contiene contraseñas. Asegúrate de que los permisos sean 644 o 600.
- Cambia la contraseña de tu usuario de base de datos periódicamente.
