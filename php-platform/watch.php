<?php
session_start();
require_once 'config.php';
requireLogin();

if (!isset($_GET['id'])) {
    header("Location: index.php");
    exit;
}

$id = (int) $_GET['id'];
$stmt = $pdo->prepare("SELECT * FROM contenidos WHERE id = ? AND estado = 'activo'");
$stmt->execute([$id]);
$video = $stmt->fetch();

if (!$video) {
    die("Video no encontrado.");
}

// TRACKING: Registrar visualización
// Insertamos solo si no existe una visualización reciente (ej: última hora) para no inflar,
// o insertamos siempre. El requerimiento dice: "registre cada vez que un usuario registrado hace clic".
try {
    $track = $pdo->prepare("INSERT INTO tracking_videos (user_id, video_id) VALUES (?, ?)");
    $track->execute([$_SESSION['user_id'], $id]);

    // Incrementar contador total en contenidos
    $pdo->prepare("UPDATE contenidos SET visitas = visitas + 1 WHERE id = ?")->execute([$id]);
} catch (Exception $e) {
    // Silencio errores de tracking para no bloquear al usuario
    error_log("Tracking Error: " . $e->getMessage());
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
        <?php echo clean($video['titulo']); ?> - Manay Academy
    </title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>

<body>
    <header>
        <div class="container">
            <nav>
                <a href="index.php" class="logo">Manay Academy</a>
                <div class="nav-links">
                    <a href="index.php">&larr; Volver</a>
                </div>
            </nav>
        </div>
    </header>

    <div class="container">
        <div class="video-container">
            <iframe src="https://www.youtube.com/embed/<?php echo clean($video['youtube_id']); ?>?autoplay=1&rel=0"
                allowfullscreen></iframe>
        </div>

        <div style="max-width: 800px;">
            <span class="card-category">
                <?php echo clean($video['categoria']); ?>
            </span>
            <h1 style="margin-bottom: 1rem;">
                <?php echo clean($video['titulo']); ?>
            </h1>
            <p>
                <?php echo nl2br(clean($video['descripcion'])); ?>
            </p>
        </div>
    </div>
</body>

</html>