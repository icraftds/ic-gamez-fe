export function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
}

export function shouldRenderHtmlError({ pathname = '', routeHint = '', method = 'GET', accept = '', secFetchMode = '' } = {}) {
    const normalizedMethod = String(method || 'GET').toUpperCase()
    if (normalizedMethod !== 'GET' && normalizedMethod !== 'HEAD') return false
    const acceptLower = String(accept || '').toLowerCase()
    const fetchMode = String(secFetchMode || '').toLowerCase()
    const isBrowserAuthRoute =
        pathname === '/auth/start' ||
        pathname === '/auth/callback' ||
        routeHint === 'start' ||
        routeHint === 'callback'
    if (isBrowserAuthRoute) {
        return !acceptLower.includes('application/json') || acceptLower.includes('text/html')
    }
    return acceptLower.includes('text/html') && fetchMode === 'navigate'
}

export function resolveSsoErrorDetails({ status = 503, code = 'sso_unavailable', message = '' } = {}) {
    const normalizedMessage = String(message || '').toLowerCase()
    if (code === 'invalid_callback') {
        if (normalizedMessage.includes('expired') || normalizedMessage.includes('used')) {
            return {
                badge: 'Sesi Autentikasi Kadaluarsa',
                title: 'Tautan Autentikasi Sudah Kadaluarsa',
                description: 'Sesi login sementara sudah habis masa berlakunya atau sudah pernah digunakan. Silakan mulai proses masuk kembali.',
            }
        }
        if (normalizedMessage.includes('binding')) {
            return {
                badge: 'Verifikasi Browser Tidak Cocok',
                title: 'Sesi Browser Berubah',
                description: 'Cookie keamanan login tidak ditemukan atau berubah di tab ini. Pastikan cookie browser aktif lalu masuk kembali.',
            }
        }
        return {
            badge: 'Callback Tidak Valid',
            title: 'Autentikasi Tidak Dapat Dilanjutkan',
            description: 'Data balasan autentikasi tidak valid atau tidak lengkap. Silakan ulangi proses masuk dari iC Game Z.',
        }
    }
    if (status === 401 || ['session_expired', 'session_revoked', 'reauthorization_required'].includes(code)) {
        return {
            badge: 'Sesi Berakhir',
            title: 'Sesi Login Anda Telah Habis',
            description: 'Demi keamanan akun, sesi login Anda telah berakhir. Silakan masuk kembali untuk melanjutkan aktivitas belajar.',
        }
    }
    if (code === 'authorization_denied') {
        return {
            badge: 'Akses Dibatalkan',
            title: 'Autentikasi Dibatalkan',
            description: 'Permintaan masuk melalui iCraft SSO dibatalkan atau tidak disetujui.',
        }
    }
    if (status === 404 || code === 'route_missing') {
        return {
            badge: 'Halaman Tidak Ditemukan',
            title: 'Rute Autentikasi Tidak Ditemukan',
            description: 'Alamat autentikasi yang dituju tidak tersedia. Anda dapat langsung masuk ulang atau kembali ke beranda.',
        }
    }
    if (status === 400 || ['invalid_return_path', 'invalid_prompt', 'invalid_path'].includes(code)) {
        return {
            badge: 'Permintaan Tidak Valid',
            title: 'Parameter Autentikasi Tidak Valid',
            description: 'Permintaan tautan masuk tidak sesuai aturan keamanan. Gunakan tombol di bawah untuk masuk dengan aman.',
        }
    }
    return {
        badge: 'Layanan Sedang Sibuk',
        title: 'Layanan Autentikasi Sedang Tidak Tersedia',
        description: 'Koneksi ke server autentikasi SSO sedang terganggu sementara waktu. Silakan coba kembali beberapa saat lagi.',
    }
}

export function renderSsoErrorHtml({ status = 503, code = 'sso_unavailable', message = '', retryHref = '/auth/start?return_to=%2Fdashboard' } = {}) {
    const details = resolveSsoErrorDetails({ status, code, message })
    const safeStatus = escapeHtml(status)
    const safeCode = escapeHtml(code)
    const safeBadge = escapeHtml(details.badge)
    const safeTitle = escapeHtml(details.title)
    const safeDescription = escapeHtml(details.description)
    const safeRetryHref = escapeHtml(retryHref)

    return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <title>${safeTitle} — iC Game Z</title>
  <style>
    :root {
      color-scheme: dark;
      --bg: #0b0e14;
      --card: #131824;
      --border: rgba(148, 163, 184, 0.16);
      --text: #f8fafc;
      --muted: #94a3b8;
      --accent: #38bdf8;
      --accent-2: #6366f1;
      --badge-bg: rgba(56, 189, 248, 0.12);
      --badge-text: #7dd3fc;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      padding: 24px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background:
        radial-gradient(circle at 15% 15%, rgba(56, 189, 248, 0.12), transparent 42%),
        radial-gradient(circle at 85% 85%, rgba(99, 102, 241, 0.12), transparent 42%),
        var(--bg);
      color: var(--text);
    }
    main {
      width: 100%;
      max-width: 480px;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 32px 28px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.45);
    }
    .brand {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      font-weight: 800;
      font-size: 0.95rem;
      letter-spacing: 0.02em;
      color: var(--text);
      margin-bottom: 20px;
    }
    .brand-dot {
      width: 10px;
      height: 10px;
      border-radius: 999px;
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      box-shadow: 0 0 14px rgba(56, 189, 248, 0.65);
    }
    .badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 0.78rem;
      font-weight: 600;
      background: var(--badge-bg);
      color: var(--badge-text);
      border: 1px solid rgba(56, 189, 248, 0.25);
      margin-bottom: 14px;
    }
    h1 {
      margin: 0 0 10px;
      font-size: 1.45rem;
      line-height: 1.3;
      letter-spacing: -0.02em;
    }
    p {
      margin: 0 0 24px;
      color: var(--muted);
      font-size: 0.95rem;
      line-height: 1.6;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 1 1 180px;
      padding: 12px 18px;
      border-radius: 12px;
      font-size: 0.92rem;
      font-weight: 600;
      text-decoration: none;
      transition: transform 0.15s ease, opacity 0.15s ease, border-color 0.15s ease;
    }
    .btn:hover { transform: translateY(-1px); }
    .btn-primary {
      background: linear-gradient(135deg, var(--accent), var(--accent-2));
      color: #ffffff;
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.04);
      color: var(--text);
      border: 1px solid var(--border);
    }
    .btn-secondary:hover {
      border-color: rgba(148, 163, 184, 0.35);
    }
    .meta {
      margin-top: 22px;
      padding-top: 16px;
      border-top: 1px solid var(--border);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.75rem;
      color: var(--muted);
    }
  </style>
</head>
<body>
  <main role="main">
    <div class="brand"><span class="brand-dot" aria-hidden="true"></span> iC Game Z</div>
    <span class="badge">${safeBadge}</span>
    <h1>${safeTitle}</h1>
    <p>${safeDescription}</p>
    <div class="actions">
      <a class="btn btn-primary" href="${safeRetryHref}">Masuk Ulang</a>
      <a class="btn btn-secondary" href="/">Kembali ke Beranda</a>
    </div>
    <div class="meta">Status ${safeStatus} &bull; ${safeCode}</div>
  </main>
</body>
</html>`
}

export function buildSsoErrorResponse({ status = 503, code = 'sso_unavailable', message = 'SSO service is unavailable.', headers, html = false, method = 'GET' } = {}) {
    const responseHeaders = new Headers(headers)
    const isHead = String(method || 'GET').toUpperCase() === 'HEAD'
    if (html) {
        responseHeaders.set('content-type', 'text/html; charset=utf-8')
        return new Response(isHead ? null : renderSsoErrorHtml({ status, code, message }), { status, headers: responseHeaders })
    }
    responseHeaders.set('content-type', 'application/json; charset=utf-8')
    return new Response(isHead ? null : JSON.stringify({ message, code }), { status, headers: responseHeaders })
}
