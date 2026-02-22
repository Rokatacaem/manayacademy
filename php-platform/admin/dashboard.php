<?php
session_start();
require_once '../config.php';
requireLogin();

// Hardcoded Admin Check (Simulado por ahora, o verificar ID específico)
// En producción, agregar columna is_admin a prospectos o tabla admins separada.
// Por simplicidad: dejaremos entrar a cualquier logueado PERO advertimos.
// TODO: Restringir a correo de Ana.

// 1. Top 5 Videos
$topVideos = $pdo->query("SELECT titulo, visitas, categoria FROM contenidos ORDER BY visitas DESC LIMIT 5")->fetchAll();

// 2. Estadísticas de Campaña Actual (Monitor)
$totalUniverse = $pdo->query("SELECT COUNT(*) FROM prospectos")->fetchColumn();
$queueTotal = $pdo->query("SELECT COUNT(*) FROM email_queue")->fetchColumn();
$queueSent = $pdo->query("SELECT COUNT(*) FROM email_queue WHERE estado = 'enviado'")->fetchColumn();
$queuePending = $pdo->query("SELECT COUNT(*) FROM email_queue WHERE estado = 'pendiente'")->fetchColumn();

// Progreso: Basado en el universo total si hay cola activa, o 0 si no.
// Requerimiento: (Enviados / Universo) * 100
$progress = ($totalUniverse > 0 && $queueTotal > 0) ? round(($queueSent / $totalUniverse) * 100) : 0;
// Si la cola está vacía (campaña terminada/reseteada), progreso es 0 o 100 dependiendo de lógica. 
// Asumiremos 0 si no hay campaña activa.

// 3. Categoría más popular
$topCat = $pdo->query("SELECT categoria, SUM(visitas) as total FROM contenidos GROUP BY categoria ORDER BY total DESC LIMIT 1")->fetch();

// 4. Últimos envíos
$lastEmails = $pdo->query("SELECT asunto, fecha_envio, estado FROM email_queue ORDER BY fecha_envio DESC LIMIT 5")->fetchAll();
?>
<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard Admin - Manay Academy</title>
    <link rel="stylesheet" href="../assets/css/style.css">
    <style>
        .kpi-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 2rem;
        }

        .kpi-card {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            text-align: center;
        }

        .kpi-value {
            font-size: 2.5rem;
            font-weight: bold;
            color: var(--primary);
        }

        .kpi-label {
            color: var(--text-light);
            font-size: 0.9rem;
            text-transform: uppercase;
        }

        /* Monitor de Campaña */
        .campaign-monitor {
            background: white;
            padding: 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            margin-bottom: 2rem;
            border-left: 5px solid var(--accent);
        }

        .progress-container {
            width: 100%;
            background-color: #f1f1f1;
            border-radius: 20px;
            margin: 15px 0;
            height: 25px;
            overflow: hidden;
        }

        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%);
            text-align: center;
            line-height: 25px;
            color: white;
            transition: width 0.5s ease;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        th,
        td {
            padding: 1rem;
            text-align: left;
            border-bottom: 1px solid #eee;
        }

        th {
            background-color: #f8f9fa;
        }
    </style>
</head>

<body>
    <header>
        <div class="container">
            <nav>
                <a href="../index.php" class="logo">Manay Admin</a>
                <div class="nav-links">
                    <a href="redactar.php">Redactar Campaña</a>
                    <a href="../index.php">Ver Sitio</a>
                </div>
            </nav>
        </div>
    </header>

    <div class="container">
        <h1>Panel de Control</h1>

        <!-- Monitor de Campaña en Tiempo Real -->
        <div class="campaign-monitor">
            <h2 style="margin-bottom: 1rem; color: var(--primary-dark);">Monitor de Campaña Activa</h2>

            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span><strong>Universo Total:</strong> <?php echo $totalUniverse; ?> suscriptores</span>
                <span><strong>Cola Pendiente:</strong> <?php echo $queuePending; ?></span>
            </div>

            <div class="progress-container">
                <div class="progress-bar" style="width: <?php echo $progress; ?>%"><?php echo $progress; ?>% Completado
                </div>
            </div>

            <div style="text-align: right; font-size: 0.9rem; color: #666;">
                Enviados: <strong><?php echo $queueSent; ?></strong> / <?php echo $totalUniverse; ?>
            </div>
        </div>

        <div class="kpi-grid">
            <div class="kpi-card">
                <div class="kpi-value" style="font-size: 1.5rem; padding-top: 10px;">
                    <?php echo $topCat ? clean($topCat['categoria']) : '-'; ?>
                </div>
                <div class="kpi-label">Categoría Más Vista</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-value"><?php echo $queueSent; ?></div>
                <div class="kpi-label">Emails Enviados (Ciclo)</div>
            </div>
        </div>

        <div class="grid" style="grid-template-columns: 1fr 1fr;">
            <div>
                <h2 style="margin-bottom: 1rem;">Videos Más Vistos</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Video</th>
                            <th>Visitas</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($topVideos as $vid): ?>
                            <tr>
                                <td><?php echo clean($vid['titulo']); ?></td>
                                <td><?php echo $vid['visitas']; ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>

            <div>
                <h2 style="margin-bottom: 1rem;">Últimos Envíos</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Asunto</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($lastEmails as $email): ?>
                            <tr>
                                <td><?php echo clean($email['asunto']); ?></td>
                                <td>
                                    <span style="
                                        padding: 2px 8px; 
                                        border-radius: 10px; 
                                        font-size: 0.8rem;
                                        background: <?php echo $email['estado'] === 'enviado' ? '#DEF7EC' : '#FDE8E8'; ?>;
                                        color: <?php echo $email['estado'] === 'enviado' ? '#03543F' : '#9B1C1C'; ?>;
                                    ">
                                        <?php echo clean($email['estado']); ?>
                                    </span>
                                </td>
                                <td><?php echo $email['fecha_envio']; ?></td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            </table>
        </div>
    </div>

    <h2 style="margin: 2rem 0 1rem 0;">Gestión Operacional</h2>
    <div class="grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
        <a href="students.php" class="card"
            style="text-decoration: none; color: inherit; border-left: 4px solid var(--primary);">
            <div class="card-body" style="align-items: center; text-align: center;">
                <i class="fas fa-users" style="font-size: 2rem; color: var(--primary); margin-bottom: 1rem;"></i>
                <h3 style="font-size: 1.2rem;">Estudiantes</h3>
                <p style="font-size: 0.9rem; color: var(--text-light);">Gestionar accesos</p>
            </div>
        </a>
        <a href="reports.php" class="card"
            style="text-decoration: none; color: inherit; border-left: 4px solid var(--accent);">
            <div class="card-body" style="align-items: center; text-align: center;">
                <i class="fas fa-chart-line" style="font-size: 2rem; color: var(--accent); margin-bottom: 1rem;"></i>
                <h3 style="font-size: 1.2rem;">Reportes</h3>
                <p style="font-size: 0.9rem; color: var(--text-light);">Descargar CSVs</p>
            </div>
        </a>
        <a href="redactar.php" class="card"
            style="text-decoration: none; color: inherit; border-left: 4px solid #F59E0B;">
            <div class="card-body" style="align-items: center; text-align: center;">
                <i class="fas fa-paper-plane" style="font-size: 2rem; color: #F59E0B; margin-bottom: 1rem;"></i>
                <h3 style="font-size: 1.2rem;">Campañas</h3>
                <p style="font-size: 0.9rem; color: var(--text-light);">Redactar y Enviar</p>
            </div>
        </a>
    </div>
    </div>
</body>

</html>