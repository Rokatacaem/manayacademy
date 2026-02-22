const express = require('express');
const path = require('path');
const app = express();
const PORT = 8000;

app.use('/assets', express.static(path.join(__dirname, 'php-platform/assets')));
app.use(express.urlencoded({ extended: true }));

// Mock Data
const mockDB = {
    videos: [
        { id: 1, title: 'Yoga Matutino: Respiración Consciente', description: 'Empieza tu día conectando con tu respiración y movimiento suave.', category: 'Yoga', youtube_id: 'M7lc1UVf-VE' },
        { id: 2, title: 'Meditación para el Estrés', description: 'Técnica de relajación profunda para liberar tensiones acumuladas.', category: 'Meditación', youtube_id: 'inpok4MKVLM' },
        { id: 3, title: 'Gestionando la Ansiedad', description: 'Herramientas psicológicas para entender y manejar la ansiedad.', category: 'Psicología', youtube_id: 'qJq2bY6k0Fw' },
        { id: 4, title: 'Introducción a la Crioterapia', description: 'Beneficios del frío para la recuperación muscular y mental.', category: 'Crioterapia', youtube_id: '123456' },
        { id: 5, title: 'Mindfulness en el Trabajo', description: 'Pequeñas pausas conscientes para mejorar tu productividad.', category: 'Psicología', youtube_id: '789012' }
    ],
    students: [
        { id: 101, name: 'María Gonzalez', email: 'maria@example.com', status: 'active' },
        { id: 102, name: 'Pedro Pascal', email: 'pedro@example.com', status: 'active' },
        { id: 103, name: 'Juan Perez', email: 'juan@example.com', status: 'inactive' }
    ]
};

const getIcon = (cat) => {
    switch (cat) {
        case 'Yoga': return 'fa-yin-yang';
        case 'Meditación': return 'fa-om';
        case 'Psicología': return 'fa-brain';
        case 'Crioterapia': return 'fa-snowflake';
        default: return 'fa-play-circle';
    }
};

// Routes
app.get('/', (req, res) => res.redirect('/index.php'));

// Videoteca (Index)
app.get('/index.php', (req, res) => {
    let gridHtml = mockDB.videos.map(v => `
        <div class="card" data-category="${v.category}">
            <div class="card-img-wrapper">
                <a href="watch.php?id=${v.id}">
                    <img src="https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg" class="card-img" alt="${v.title}">
                </a>
            </div>
            <div class="card-body">
                <div class="card-header-row">
                    <span class="card-category">${v.category}</span>
                    <i class="fas ${getIcon(v.category)} card-icon"></i>
                </div>
                <h3 class="card-title"><a href="watch.php?id=${v.id}">${v.title}</a></h3>
                <p class="card-desc">${v.description}</p>
            </div>
        </div>
    `).join('');

    res.send(renderPage('Videoteca', `
        <div style="text-align: center; margin-bottom: 3rem;">
            <h1 style="color: var(--primary);">Bienvenido a Manay Academy</h1>
            <p style="color: var(--text-light); font-size: 1.1rem;">Psicóloga · Maestra de Yoga · Meditación · Crioterapia</p>
        </div>

        <div class="filter-bar">
            <a href="#" class="filter-btn active">Todos</a>
            <a href="#" class="filter-btn">Yoga</a>
            <a href="#" class="filter-btn">Meditación</a>
            <a href="#" class="filter-btn">Psicología</a>
            <a href="#" class="filter-btn">Crioterapia</a>
        </div>
        <div class="grid">${gridHtml}</div>
    `));
});

// Watch Video
app.get('/watch.php', (req, res) => {
    const id = parseInt(req.query.id);
    const v = mockDB.videos.find(v => v.id === id);

    if (!v) return res.send('Video no encontrado');

    res.send(renderPage(v.title, `
        <div style="margin-bottom: 2rem;">
            <a href="/index.php" style="color: var(--text-light); text-decoration: none;">&larr; Volver a la Videoteca</a>
        </div>
        
        <div style="background: black; aspect-ratio: 16/9; border-radius: 8px; overflow: hidden; margin-bottom: 2rem; box-shadow: 0 10px 20px rgba(0,0,0,0.2);">
            <iframe width="100%" height="100%" src="https://www.youtube.com/embed/${v.youtube_id}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>

        <div style="max-width: 800px;">
            <div style="display: flex; align-items: center; margin-bottom: 1rem;">
                <span style="background: var(--surface); border: 1px solid var(--primary); color: var(--primary-dark); padding: 5px 15px; border-radius: 20px; font-size: 0.8rem; font-weight: bold; margin-right: 15px;">${v.category}</span>
                <i class="fas ${getIcon(v.category)}" style="color: var(--primary); font-size: 1.2rem;"></i>
            </div>
            
            <h1 style="margin-bottom: 1rem; font-size: 2rem;">${v.title}</h1>
            <p style="font-size: 1.1rem; color: var(--text-light); line-height: 1.8;">${v.description}</p>
        </div>
    `));
});

// Admin Dashboard
app.get('/admin/dashboard.php', (req, res) => {
    // Mock Statistics for Progress Bar
    const totalUniverse = mockDB.students.length; // 3
    const queueTotal = mockDB.students.length;   // Assume full campaign active
    const queueSent = 1;                         // Mock 1 sent
    const queuePending = totalUniverse - queueSent; // 2 pending
    const progress = Math.round((queueSent / totalUniverse) * 100);

    res.send(renderPage('Admin Dashboard', `
        <h1>Panel de Control</h1>
        
        <!-- Monitor de Campaña en Tiempo Real -->
        <div style="background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); margin-bottom: 2rem; border-left: 5px solid var(--accent);">
            <h2 style="margin-bottom: 1rem; color: var(--primary-dark);">Monitor de Campaña Activa</h2>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span><strong>Universo Total:</strong> ${totalUniverse} suscriptores</span>
                <span><strong>Cola Pendiente:</strong> ${queuePending}</span>
            </div>
            
            <div style="width: 100%; background-color: #f1f1f1; border-radius: 20px; margin: 15px 0; height: 25px; overflow: hidden;">
                <div style="height: 100%; background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%); text-align: center; line-height: 25px; color: white; width: ${progress}%; transition: width 0.5s ease;">
                    ${progress}% Completado
                </div>
            </div>
            
            <div style="text-align: right; font-size: 0.9rem; color: #666;">
                Enviados: <strong>${queueSent}</strong> / ${totalUniverse}
            </div>
        </div>

        <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 2rem;">
            <div class="card" style="padding: 20px; text-align: center;">
                <h2 style="color: var(--primary);">24%</h2>
                <small>TASA APERTURA</small>
            </div>
            <div class="card" style="padding: 20px; text-align: center;">
                <h2 style="color: var(--primary);">${queueSent}</h2>
                <small>EMAILS ENVIADOS</small>
            </div>
            <div class="card" style="padding: 20px; text-align: center;">
                <h2 style="color: var(--primary);">Yoga</h2>
                <small>CATEGORÍA TOP</small>
            </div>
        </div>

        <h2>Gestión Operacional</h2>
        <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 20px;">
             <a href="/admin/students.php" class="card" style="padding: 20px; text-decoration: none; color: inherit; border-left: 4px solid var(--primary);">
                <i class="fas fa-users" style="font-size: 2rem; color: var(--primary); display: block; margin-bottom: 10px;"></i>
                <h3>Estudiantes</h3>
                <p>Gestionar accesos</p>
             </a>
             <a href="#" class="card" style="padding: 20px; text-decoration: none; color: inherit; border-left: 4px solid var(--accent);">
                <i class="fas fa-chart-line" style="font-size: 2rem; color: var(--accent); display: block; margin-bottom: 10px;"></i>
                <h3>Reportes</h3>
                <p>Exportar CSV</p>
             </a>
             <a href="/admin/redactar.php" class="card" style="padding: 20px; text-decoration: none; color: inherit; border-left: 4px solid #F59E0B;">
                <i class="fas fa-paper-plane" style="font-size: 2rem; color: #F59E0B; display: block; margin-bottom: 10px;"></i>
                <h3>Campañas</h3>
                <p>Redactar y Enviar</p>
             </a>
        </div>
    `));
});

// Admin Redactar Campaña (CKEditor)
app.get('/admin/redactar.php', (req, res) => {
    let videoOptions = mockDB.videos.map(v => `<option value="${v.id}">${v.title}</option>`).join('');

    res.send(renderPage('Redactar Campaña', `
        <script src="https://cdn.ckeditor.com/4.22.1/standard/ckeditor.js"></script>

        <h1>Redactar Campaña</h1>
        <div class="card" style="max-width: 900px; margin: 0 auto; padding: 20px;">
            <form action="/admin/send_campaign" method="POST">
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Asunto del Correo</label>
                    <input type="text" name="subject" placeholder="Ej: Nueva clase de Yoga disponible..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;" required>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Video Destacado (Opcional)</label>
                    <select name="video_id" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                        <option value="">-- Seleccionar Video de la Videoteca --</option>
                        ${videoOptions}
                    </select>
                    <small style="color: #777;">El sistema insertará el enlace al video automáticamente.</small>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Contenido del Mensaje</label>
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
        
        <div style="margin-top: 2rem; background: #FFF3CD; color: #856404; padding: 1rem; border-radius: 8px; border: 1px solid #FFEEBA;">
            <i class="fas fa-info-circle"></i> <strong>Nota Técnica:</strong>
            Al hacer clic, se agregarán todos los suscriptores activos a la cola de envío.
            El script <code>enviar_lote.php</code> procesará 50 correos cada hora automáticamente.
        </div>
    `));
});

// Handle Mock Send
app.post('/admin/send_campaign', (req, res) => {
    res.send(renderPage('Campaña Iniciada', `
        <div style="text-align: center; padding: 3rem;">
            <i class="fas fa-rocket" style="font-size: 3rem; color: var(--accent); margin-bottom: 1rem;"></i>
            <h1>¡Campaña Iniciada!</h1>
            <p>Se han añadido <strong>${mockDB.students.length} suscriptores</strong> a la cola de envío.</p>
            <p style="color: grey;">El Monitor de Campaña se actualizará conforme avance el Cron Job.</p>
            <br>
            <a href="/admin/dashboard.php" class="btn">Ir al Monitor de Campaña</a>
        </div>
    `));
});

// Admin Students
app.get('/admin/students.php', (req, res) => {
    let rows = mockDB.students.map(s => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px;">${s.id}</td>
            <td style="padding: 10px;"><b>${s.name}</b></td>
            <td style="padding: 10px;">${s.email}</td>
            <td style="padding: 10px;">
                <span style="background: ${s.status === 'active' ? '#DEF7EC' : '#FDE8E8'}; color: ${s.status === 'active' ? '#03543F' : '#9B1C1C'}; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem;">
                    ${s.status}
                </span>
            </td>
            <td style="padding: 10px;">
                <a href="#" style="color: var(--primary);">Editar</a>
            </td>
        </tr>
    `).join('');

    res.send(renderPage('Gestión Estudiantes', `
        <h1>Estudiantes</h1>
        <div style="margin-bottom: 2rem; display: flex; justify-content: space-between;">
            <input type="text" placeholder="Buscar..." style="padding: 10px; width: 300px; border: 1px solid #ddd; border-radius: 5px;">
            <button class="btn">Exportar CSV</button>
        </div>
        <table style="width: 100%; background: white; border-collapse: collapse; box-shadow: 0 2px 5px rgba(0,0,0,0.05);">
            <thead style="background: #f8f9fa; text-align: left;">
                <tr><th style="padding: 10px;">ID</th><th style="padding: 10px;">Nombre</th><th style="padding: 10px;">Email</th><th style="padding: 10px;">Estado</th><th style="padding: 10px;">Acciones</th></tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `));
});


// Helper
function renderPage(title, content) {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title} - Manay Simulator</title>
        <link rel="stylesheet" href="/assets/css/style.css">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    </head>
    <body>
        <header>
            <div class="container">
                <nav>
                    <a href="/" class="logo"><i class="fas fa-spa" style="color: var(--primary);"></i> Manay Academy</a>
                    <div class="nav-links">
                        <a href="/admin/dashboard.php">Admin Panel</a>
                        <span><i class="fas fa-user-circle"></i> Ana</span>
                    </div>
                </nav>
            </div>
        </header>
        <div class="container">
            ${content}
        </div>
    </body>
    </html>
    `;
}

app.listen(PORT, () => console.log(`Simulador actualizado: http://localhost:${PORT}`));
