<?php
// Script de exportación de contactos para Manay Academy
require_once 'config.php';

header('Content-Type: application/json; charset=utf-8');

try {
    // Consultar la tabla de prospectos (legacy)
    $stmt = $pdo->query("SELECT id, nombre, correo, status, last_login FROM prospectos");
    $contacts = $stmt->fetchAll();

    // Guardar en un archivo local por seguridad y también mostrarlo
    $jsonData = json_encode($contacts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    file_put_contents('contacts_export.json', $jsonData);

    echo json_encode([
        'status' => 'success',
        'count' => count($contacts),
        'file' => 'contacts_export.json',
        'message' => 'Exportación completada. Descarga el archivo contacts_export.json'
    ]);

} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>