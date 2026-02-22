# GUÍA DE DESPLIEGUE - MANAY ACADEMY
# Servidor: Wirenet Chile (cPanel)
# PHP: 8.x
# Base de Datos: manayaca_Clientes

-------------------------------------------------------------------------
PASO 1: ARCHIVOS
-------------------------------------------------------------------------
1. Sube todo el contenido de la carpeta `php-platform` a `public_html`.
   (O a la carpeta del subdominio si usas uno, ej: `academy.manay.com`).

2. Edita `config.php` con las credenciales REALES de tu base de datos:
   - DB_HOST: localhost
   - DB_NAME: manayaca_Clientes
   - DB_USER: (Tu usuario cPanel de BD)
   - DB_PASS: (Tu contraseña de usuario BD)

-------------------------------------------------------------------------
PASO 2: BASE DE DATOS
-------------------------------------------------------------------------
1. Entra a phpMyAdmin en cPanel.
2. Selecciona la base de datos `manayaca_Clientes`.
3. Ve a la pestaña "Importar" y selecciona el archivo `schema.sql`.
   - O copia y pega el contenido en la pestaña "SQL".
   - Esto creará las tablas nuevas (contenidos, tracking_videos, email_queue, email_tracking) 
     sin borrar tu tabla `prospectos` existente.

-------------------------------------------------------------------------
PASO 3: CRON JOB (MOTOR DE MAILING)
-------------------------------------------------------------------------
1. En cPanel, busca "Trabajos de Cron" (Cron Jobs).
2. Añade un nuevo Cron Job con la frecuencia: "Una vez por hora" (0 * * * *).
3. Comando:
   php -q /home/TU_USUARIO/public_html/cron/process_queue.php

   *Reemplaza '/home/TU_USUARIO/public_html' con la ruta real de tu hosting.
   (Puedes verla en el lateral derecho del cPanel, dice "Directorio Principal").

-------------------------------------------------------------------------
PASO 4: VERIFICACIÓN
-------------------------------------------------------------------------
1. Entra a `tu-dominio.com/admin/dashboard.php`.
2. Verifica que veas los gráficos (aunque estén en cero).
3. Ve a "Crear Campaña" y prueba enviarte un correo a ti mismo.
   - Nota: El correo no llegará al instante, llegará cuando corra el Cron (o puedes ejecutar el Cron manualmente desde el navegador visitando `/cron/process_queue.php` si borraste la protección de IP en la línea 6).

-------------------------------------------------------------------------
NOTAS TÉCNICAS
-------------------------------------------------------------------------
- Límite de Envío: 50 correos/hora (Configurado en cron/process_queue.php).
- Notificación: Cuando la cola termine, el sistema enviará un correo a "rodrigo@manayacademy.com".
- Videoteca: Los videos de YouTube deben insertarse solo con el ID (ej: dQw4w9WgXcQ), no la URL completa.
