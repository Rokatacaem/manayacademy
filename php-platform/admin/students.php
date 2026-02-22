<?php
session_start();
require_once '../config.php';
requireLogin();

// Cambiar estado si se solicita
if (isset($_GET['toggle']) && isset($_GET['id'])) {
    $id = (int) $_GET['id'];
    $current = $_GET['status'] === 'active' ? 'inactive' : 'active';
    // Verificar si existe columna status. Si no, esto fallará salvo que se haya corrido el ALTER.
    // Para robustez, asumimos que existe.
    try {
        $pdo->prepare("UPDATE prospectos SET status = ? WHERE id = ?")->execute([$current, $id]);
    } catch (Exception $e) {
        $error = "Error: Asegúrate de haber actualizado la base de datos (Columna 'status').";
    }
}

// Obtener estudiantes
$search = isset($_GET['q']) ? $_GET['q'] : '';
$sql = "SELECT * FROM prospectos";
$params = [];

if ($search) {
    $sql .= " WHERE nombre LIKE ? OR correo LIKE ?";
    $params[] = "%$search%";
    $params[] = "%$search%";
}

$sql .= " ORDER BY id DESC LIMIT 50";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$students = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestión de Estudiantes - Manay Admin</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
    <!-- FontAwesome Fallback -->
</head>

<body>
    <header>
        <div class="container">
            <nav>
                <a href="dashboard.php" class="logo">Manay Admin</a>
                <div class="nav-links">
                    <a href="dashboard.php">Dashboard</a>
                    <a href="reports.php">Reportes</a>
                </div>
            </nav>
        </div>
    </header>

    <div class="container">
        <h1>Gestión de Estudiantes</h1>

        <?php if (isset($error)): ?>
            <div class="alert">
                <?php echo $error; ?>
            </div>
        <?php endif; ?>

        <div style="margin-bottom: 2rem; display: flex; justify-content: space-between;">
            <form action="" method="GET" style="display: flex; gap: 10px;">
                <input type="text" name="q" placeholder="Buscar por nombre o correo..." class="form-input"
                    value="<?php echo htmlspecialchars($search); ?>">
                <button type="submit" class="btn">Buscar</button>
            </form>
            <a href="reports.php" class="btn" style="background: var(--secondary);">Exportar Todo</a>
        </div>

        <div style="overflow-x: auto;">
            <table
                style="width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <thead>
                    <tr style="background: #f8f9fa; text-align: left;">
                        <th style="padding: 1rem;">ID</th>
                        <th style="padding: 1rem;">Nombre</th>
                        <th style="padding: 1rem;">Correo</th>
                        <th style="padding: 1rem;">Estado</th>
                        <th style="padding: 1rem;">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($students as $s): ?>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td style="padding: 1rem;">
                                <?php echo $s['id']; ?>
                            </td>
                            <td style="padding: 1rem; font-weight: bold;">
                                <?php echo clean($s['nombre']); ?>
                            </td>
                            <td style="padding: 1rem;">
                                <?php echo clean($s['correo']); ?>
                            </td>
                            <td style="padding: 1rem;">
                                <?php
                                $status = isset($s['status']) ? $s['status'] : 'active';
                                $color = $status === 'active' ? '#DEF7EC' : '#FDE8E8';
                                $textColor = $status === 'active' ? '#03543F' : '#9B1C1C';
                                ?>
                                <span
                                    style="background: <?php echo $color; ?>; color: <?php echo $textColor; ?>; padding: 2px 8px; border-radius: 10px; font-size: 0.85rem;">
                                    <?php echo ucfirst($status); ?>
                                </span>
                            </td>
                            <td style="padding: 1rem;">
                                <a href="?toggle=1&id=<?php echo $s['id']; ?>&status=<?php echo isset($s['status']) ? $s['status'] : 'active'; ?>"
                                    style="color: var(--primary); text-decoration: none; font-weight: 500;">
                                    <?php echo (isset($s['status']) && $s['status'] === 'inactive') ? 'Activar' : 'Desactivar'; ?>
                                </a>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>

</html>