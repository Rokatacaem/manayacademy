/**
 * Wraps campaign HTML content in a branded email template with Ana's signature.
 * Compatible with major email clients (Gmail, Outlook, Apple Mail).
 */
export function buildEmailTemplate(content: string, subject: string): string {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#faf9f6;font-family:'Georgia',serif;">

  <!-- Wrapper -->
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#faf9f6;">
    <tr>
      <td align="center" style="padding:40px 20px;">

        <!-- Card -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,0.06);">

          <!-- Header Brand Bar -->
          <tr>
            <td style="height:6px;background:linear-gradient(90deg,#7c9082,#d6d2c4);"></td>
          </tr>

          <!-- Header Logo / Name -->
          <tr>
            <td align="center" style="padding:40px 48px 32px;">
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:5px;text-transform:uppercase;color:#7c9082;font-family:Arial,sans-serif;font-weight:700;">
                Centro de Bienestar Integral
              </p>
              <h1 style="margin:0;font-size:26px;color:#2c3e50;font-weight:400;letter-spacing:-0.5px;">
                Ana Katherine Zepeda
              </h1>
              <p style="margin:8px 0 0;font-size:13px;color:#94a3b8;font-style:italic;">
                Psicóloga · Yoga · Meditación · Crioterapia
              </p>
              <div style="width:50px;height:1px;background:#d6d2c4;margin:24px auto 0;"></div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding:0 48px 40px;font-size:16px;line-height:1.8;color:#2c3e50;">
              ${content}
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 48px;">
              <div style="height:1px;background:#f1f5f9;"></div>
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding:36px 48px;">
              <p style="margin:0 0 4px;font-size:13px;color:#64748b;font-family:Arial,sans-serif;">Con cariño,</p>
              <p style="margin:0 0 16px;font-size:20px;color:#2c3e50;font-style:italic;">Ana Katherine Zepeda</p>
              <p style="margin:0;font-size:12px;color:#94a3b8;font-family:Arial,sans-serif;line-height:1.8;">
                Psicóloga Clínica · Instructora de Yoga y Meditación<br>
                <a href="https://manayacademy.com" style="color:#7c9082;text-decoration:none;">manayacademy.com</a> ·
                <a href="mailto:info@manayacademy.com" style="color:#7c9082;text-decoration:none;">info@manayacademy.com</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8f7f4;padding:24px 48px;border-top:1px solid #f1f5f9;">
              <p style="margin:0;font-size:11px;color:#94a3b8;text-align:center;font-family:Arial,sans-serif;line-height:1.8;">
                Recibiste este correo porque te suscribiste a la comunidad Manay Academy.<br>
                <a href="{{unsubscribe_url}}" style="color:#7c9082;text-decoration:underline;">Cancelar suscripción</a>
              </p>
            </td>
          </tr>

        </table>
        <!-- / Card -->

      </td>
    </tr>
  </table>

</body>
</html>`
}
