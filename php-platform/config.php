<?php
// Configuración de Base de Datos
// CAMBIAR ESTOS VALORES EN PRODUCCIÓN
define('DB_HOST', 'localhost');
define('DB_NAME', 'manayaca_Clientes');
define('DB_USER', 'manayaca_user'); // Cambiar por usuario real de cPanel
define('DB_PASS', 'password_segura'); // Cambiar por contraseña real

// Configuración General
define('BASE_URL', 'https://manayacademy.com/plataforma'); // Ajustar subdominio/carpeta
define('SITE_NAME', 'Manay Academy');

// Conexión PDO
try {
    $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}

// Funciones Helper
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function requireLogin() {
    if (!isLoggedIn()) {
        header("Location: login.php");
        exit;
    }
}

// Sanitización básica
function clean($data) {
    return htmlspecialchars(strip_tags($data));
}
?>
