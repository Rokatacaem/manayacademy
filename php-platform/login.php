<?php
session_start();
require_once 'config.php';

if (isLoggedIn()) {
    header("Location: index.php");
    exit;
}

$error = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);

    if ($email) {
        $stmt = $pdo->prepare("SELECT id, nombre, correo FROM prospectos WHERE correo = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_name'] = $user['nombre'];
            $_SESSION['user_email'] = $user['correo'];
            header("Location: index.php");
            exit;
        } else {
            $error = "El correo no está registrado en nuestra lista de alumnos.";
        }
    } else {
        $error = "Por favor ingresa un correo válido.";
    }
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Manay Academy</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>

<body>
    <div class="auth-wrapper">
        <div class="auth-card">
            <div style="text-align: center; margin-bottom: 2rem;">
                <h1 style="color: var(--primary);">Manay Academy</h1>
                <p>Ingresa para acceder a la videoteca</p>
            </div>

            <?php if ($error): ?>
                <div class="alert"><?php echo $error; ?></div>
            <?php endif; ?>

            <form method="POST" action="">
                <div class="form-group">
                    <label for="email">Correo Electrónico</label>
                    <input type="email" id="email" name="email" class="form-input" required placeholder="tu@email.com">
                </div>
                <button type="submit" class="btn btn-block">Ingresar</button>
            </form>
        </div>
    </div>
</body>

</html>