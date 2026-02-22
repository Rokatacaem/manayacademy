<?php
session_start();
require_once 'config.php';
requireLogin();

// Obtener categorías para filtro
$cats = $pdo->query("SELECT DISTINCT categoria FROM contenidos ORDER BY categoria")->fetchAll(PDO::FETCH_COLUMN);

// Filtrar contenidos
$where = "estado = 'activo'";
$params = [];

if (isset($_GET['cat']) && !empty($_GET['cat'])) {
    $where .= " AND categoria = ?";
    $params[] = $_GET['cat'];
}

$stmt = $pdo->prepare("SELECT * FROM contenidos WHERE $where ORDER BY fecha_publicacion DESC");
$stmt->execute($params);
$videos = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Videoteca - Manay Academy</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>

<body>
    <header>
        <div class="container">
            <nav>
                <a href="index.php" class="logo">Manay Academy</a>
                <div class="nav-links">
                    <span>Hola,
                        <?php echo htmlspecialchars($_SESSION['user_name']); ?>
                    </span>
                    <a href="login.php?logout=1" style="font-size: 0.9rem; color: var(--danger);">Salir</a>
                </div>
            </nav>
        </div>
    </header>

    <div class="container">
        <div class="filter-bar">
            <a href="index.php" class="filter-btn <?php echo !isset($_GET['cat']) ? 'active' : ''; ?>">Todos</a>
            <?php foreach ($cats as $cat): ?>
                <a href="index.php?cat=<?php echo urlencode($cat); ?>"
                    class="filter-btn <?php echo (isset($_GET['cat']) && $_GET['cat'] === $cat) ? 'active' : ''; ?>">
                    <?php echo htmlspecialchars($cat); ?>
                </a>
            <?php endforeach; ?>
        </div>

        <div class="grid">
            <?php foreach ($videos as $vid): ?>
                <div class="card">
                    <a href="watch.php?id=<?php echo $vid['id']; ?>">
                        <img src="https://img.youtube.com/vi/<?php echo clean($vid['youtube_id']); ?>/hqdefault.jpg"
                            class="card-img" alt="<?php echo clean($vid['titulo']); ?>">
                    </a>
                    <div class="card-body">
                        <span class="card-category">
                            <?php echo clean($vid['categoria']); ?>
                        </span>
                        <h3 class="card-title">
                            <a href="watch.php?id=<?php echo $vid['id']; ?>" style="text-decoration: none; color: inherit;">
                                <?php echo clean($vid['titulo']); ?>
                            </a>
                        </h3>
                        <p class="card-desc">
                            <?php echo clean($vid['descripcion']); ?>
                        </p>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</body>

</html>