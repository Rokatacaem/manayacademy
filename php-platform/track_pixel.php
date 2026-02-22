<?php
require_once 'config.php';

// Desactivar caché
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
header("Content-Type: image/gif");

// Recibir ID del pixel
$pixel_id = isset($_GET['pid']) ? $_GET['pid'] : null;

if ($pixel_id) {
    try {
        // Registrar apertura
        // Primero verificamos si ya existe el registro (creado al enviar)
        $stmt = $pdo->prepare("UPDATE email_tracking SET viewed_at = NOW(), ip_address = ?, user_agent = ? WHERE pixel_id = ? AND viewed_at IS NULL");
        $stmt->execute([
            $_SERVER['REMOTE_ADDR'],
            $_SERVER['HTTP_USER_AGENT'],
            $pixel_id
        ]);

        // Si no existía o ya fue visto, podriamos insertar uno nuevo si queremos tracking múltiple
        // Pero para "Tasa de Apertura Unica", el update con check NULL está bien.
    } catch (Exception $e) {
        // Silencio
    }
}

// Imprimir GIF transparente 1x1
echo base64_decode("R0lGODlhAQABAJAAAP8AAAAAACH5BAUQAAAALAAAAAABAAEAAAICBAEAOw==");
exit;
