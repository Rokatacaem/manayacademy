<?php
// Script para ejecutar vía Cron Job (ej: cada hora)
// php -q /home/usuario/public_html/cron/process_queue.php

// Evitar acceso web directo si se desea, o proteger con IP
if (php_sapi_name() !== 'cli' && $_SERVER['REMOTE_ADDR'] !== '127.0.0.1') {
    // die("Access Denied"); // Comentar para pruebas web manuales
}

require_once __DIR__ . '/../config.php';

// Limite del lote
$limit = 50;

// Obtener pendientes
$stmt = $pdo->prepare("
    SELECT q.*, p.nombre, p.correo 
    FROM email_queue q 
    JOIN prospectos p ON q.user_id = p.id 
    WHERE q.estado = 'pendiente' 
    LIMIT $limit
");
$stmt->execute();
$emails = $stmt->fetchAll();

$count = 0;

foreach ($emails as $email) {
    // Generar Pixel
    $pixel_id = md5($email['id'] . uniqid() . time());
    $pixel_url = BASE_URL . "/track_pixel.php?pid=" . $pixel_id;

    // Preparar contenido
    // Reemplazo simple de variables
    $body = str_replace('{nombre}', $email['nombre'], $email['cuerpo']);

    // Insertar pixel invisible al final
    $body .= "<img src='$pixel_url' width='1' height='1' style='display:none;' alt=''>";

    // Cabeceras
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8" . "\r\n";
    $headers .= "From: " . SITE_NAME . " <contacto@manayacademy.com>" . "\r\n";
    $headers .= "Reply-To: contacto@manayacademy.com" . "\r\n";

    // Enviar
    if (mail($email['correo'], $email['asunto'], html_entity_decode($body), $headers)) {
        // Marcar enviado
        $pdo->prepare("UPDATE email_queue SET estado = 'enviado', fecha_envio = NOW() WHERE id = ?")->execute([$email['id']]);

        // Registrar tracking pixel esperado
        $pdo->prepare("INSERT INTO email_tracking (pixel_id, user_id, email_queue_id, fecha_apertura) VALUES (?, ?, ?, NULL)")
            ->execute([$pixel_id, $email['user_id'], $email['id']]);

        $count++;
    } else {
        // Marcar fallido
        $pdo->prepare("UPDATE email_queue SET estado = 'fallido' WHERE id = ?")->execute([$email['id']]);
    }
}

echo "Procesados: $count emails.<br>";

// *** Lógica de Notificación a Rodrigo ***
// Verificar si quedan pendientes
$remaining = $pdo->query("SELECT COUNT(*) FROM email_queue WHERE estado = 'pendiente'")->fetchColumn();

if ($remaining == 0 && $count > 0) {
    // Si no quedan pendientes Y acabamos de procesar algunos, significa que TERMINAMOS.

    // Generar reporte rápido
    $total_sent = $pdo->query("SELECT COUNT(*) FROM email_queue WHERE estado = 'enviado' AND fecha_envio > DATE_SUB(NOW(), INTERVAL 24 HOUR)")->fetchColumn();
    $total_failed = $pdo->query("SELECT COUNT(*) FROM email_queue WHERE estado = 'fallido' AND fecha_envio > DATE_SUB(NOW(), INTERVAL 24 HOUR)")->fetchColumn();

    $subject = "✅ Reporte de Campaña Finalizada - Manay Academy";
    $message = "Hola Rodrigo,\n\n";
    $message .= "La cola de envíos ha finalizado exitosamente.\n\n";
    $message .= "Resumen de las últimas 24 horas:\n";
    $message .= "- Enviados: $total_sent\n";
    $message .= "- Fallidos: $total_failed\n";
    $message .= "\nEl sistema está listo para la siguiente noticia.\n";

    // Enviar a Rodrigo (quemado o desde config)
    mail("rodrigo@manayacademy.com", $subject, $message, "From: System <system@manayacademy.com>");

    echo "Notificación enviada a Rodrigo.";
}
