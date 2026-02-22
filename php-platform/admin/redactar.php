<?php
session_start();
require_once '../config.php';
requireLogin();

$videos = $pdo->query("SELECT id, titulo FROM contenidos WHERE estado = 'activo' ORDER BY fecha_publicacion DESC")->fetchAll();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $subject = trim($_POST['subject']);
    $message = trim($_POST['message']); // CKEditor sends HTML
    $videoId = !empty($_POST['video_id']) ? $_POST['video_id'] : null;

    if (empty($subject) || empty($message)) {
        $error = "El asunto y el mensaje son obligatorios.";
    } else {
        // 1. Obtener Universo Total (Dinámico)
        $students = $pdo->query("SELECT id FROM prospectos WHERE status = 'active'")->fetchAll();

        // 2. Llenar Cola
        $stmt = $pdo->prepare("INSERT INTO email_queue (user_id, contenido_id, asunto, cuerpo, estado) VALUES (?, ?, ?, ?, 'pendiente')");

        foreach ($students as $s) {
            $stmt->execute([$s['id'], $videoId, $subject, $message]);
        }

        $success = "Campaña iniciada para " . count($students) . " suscriptores. El cron enviará 50/hora.";
    }
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redactar Campaña - Manay Admin</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <!-- CKEditor 4 CDN -->
    <script src="https://cdn.ckeditor.com/4.22.1/standard/ckeditor.js"></script>
</head>

<body>
    <header>
        <div class="container">
            <nav>
                <a href="dashboard.php" class="logo">Manay Admin</a>
                <div class="nav-links">
                    <a href="dashboard.php">Dashboard</a>
                    <span><i class="fas fa-user-circle"></i> Ana</span>
                </div>
            </nav>
        </div>
    </header>

    <div class="container">
        <h1>Redactar Campaña</h1>

        <?php if (isset($error)): ?>
            <div class="alert" style="background: #FDE8E8; color: #9B1C1C;"><?php echo $error; ?></div>
        <?php endif; ?>

        <?php if (isset($success)): ?>
            <div class="alert" style="background: #DEF7EC; color: #03543F;"><?php echo $success; ?></div>
        <?php endif; ?>

        <div class="card" style="max-width: 900px; margin: 0 auto;">
            <div class="card-body">
                <form action="" method="POST">
                    <div style="margin-bottom: 1.5rem;">
                        <label>Asunto del Correo</label>
                        <input type="text" name="subject" class="form-input" required
                            placeholder="Ej: Nueva clase de Yoga disponible...">
                    </div>

                    <div style="margin-bottom: 1.5rem;">
                        <label>Video Destacado (Opcional)</label>
                        <select name="video_id" class="form-input">
                            <option value="">-- Seleccionar Video de la Videoteca --</option>
                            <?php foreach ($videos as $v): ?>
                                <option value="<?php echo $v['id']; ?>"><?php echo clean($v['titulo']); ?></option>
                            <?php endforeach; ?>
                        </select>
                        <small style="color: var(--text-light);">El sistema insertará el enlace al video
                            automáticamente.</small>
                    </div>

                    <div style="margin-bottom: 1.5rem;">
                        <label>Contenido del Mensaje</label>
                        <textarea name="message" id="editor" rows="10"></textarea>
                        <script>
                            CKEDITOR.replace('editor');
                        </script>
                    </div>

                    <button type="submit" class="btn" style="width: 100%; font-size: 1.1rem;">
                        <i class="fas fa-paper-plane"></i> Iniciar Envío Masivo
                    </button>
                </form>
            </div>
        </div>

        <div class="alert" style="margin-top: 2rem; background: #FFF3CD; color: #856404; border: 1px solid #FFEEBA;">
            <i class="fas fa-info-circle"></i> <strong>Nota Técnica:</strong>
            Al hacer clic, se agregarán todos los suscriptores activos a la cola de envío.
            El script <code>enviar_lote.php</code> procesará 50 correos cada hora automáticamente.
        </div>
    </div>
</body>

</html>