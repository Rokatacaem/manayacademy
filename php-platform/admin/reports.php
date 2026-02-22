<?php
session_start();
require_once '../config.php';
requireLogin();

if (isset($_GET['export'])) {
    $type = $_GET['export'];

    if ($type === 'students') {
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="estudiantes.csv"');
        $output = fopen('php://output', 'w');
        fputcsv($output, ['ID', 'Nombre', 'Correo', 'Estado']);

        $rows = $pdo->query("SELECT id, nombre, correo, status FROM prospectos")->fetchAll(PDO::FETCH_ASSOC);
        foreach ($rows as $row)
            fputcsv($output, $row);
        fclose($output);
        exit;
    }

    if ($type === 'engagement') {
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="engagement.csv"');
        $output = fopen('php://output', 'w');
        fputcsv($output, ['Estudiante', 'Video', 'Categoria', 'Fecha Visualizacion']);

        $sql = "SELECT p.nombre, c.titulo, c.categoria, t.fecha_visualizacion 
                FROM tracking_videos t
                JOIN prospectos p ON t.user_id = p.id
                JOIN contenidos c ON t.video_id = c.id
                ORDER BY t.fecha_visualizacion DESC";

        $rows = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
        foreach ($rows as $row)
            fputcsv($output, $row);
        fclose($output);
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reportes - Manay Admin</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
</head>

<body>
    <header>
        <div class="container">
            <nav>
                <a href="dashboard.php" class="logo">Manay Admin</a>
                <div class="nav-links">
                    <a href="dashboard.php">Dashboard</a>
                    <a href="students.php">Estudiantes</a>
                </div>
            </nav>
        </div>
    </header>

    <div class="container">
        <h1>Reportes Operacionales</h1>

        <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); margin-top: 2rem;">
            <!-- Reporte 1 -->
            <div class="card" style="border-top: 4px solid var(--primary);">
                <div class="card-body">
                    <h3 class="card-title">Base de Estudiantes</h3>
                    <p class="card-desc">Descarga la lista completa de prospectos con su estado actual.</p>
                    <a href="?export=students" class="btn" style="width: 100%; text-align: center; margin-top: 1rem;">
                        <i class="fas fa-file-csv"></i> Descargar CSV
                    </a>
                </div>
            </div>

            <!-- Reporte 2 -->
            <div class="card" style="border-top: 4px solid var(--accent);">
                <div class="card-body">
                    <h3 class="card-title">Engagement de Contenido</h3>
                    <p class="card-desc">Detalle de qué estudiante vio qué video y cuándo.</p>
                    <a href="?export=engagement" class="btn" style="width: 100%; text-align: center; margin-top: 1rem;">
                        <i class="fas fa-file-csv"></i> Descargar CSV
                    </a>
                </div>
            </div>
        </div>
    </div>
</body>

</html>