<?php
/**
 * Master Subdomain & App Router for ashbuild.app on Namecheap cPanel
 * 
 * Supports:
 * - ashbuild.app -> Main Developer Portfolio
 * - avolens.ashbuild.app
 * - freed.ashbuild.app
 * - pouched.ashbuild.app
 * - respawn.ashbuild.app
 * - unpopularopinion.ashbuild.app (and unpopular-opinion.ashbuild.app)
 * - duoclash.ashbuild.app
 * 
 * Clean URLs supported automatically:
 * - /policy
 * - /privacy
 * - /terms
 * - /delete-account (or /delete-data)
 * - /support
 */

$host = strtolower($_SERVER['HTTP_HOST'] ?? '');
$host = explode(':', $host)[0]; // Remove port if present

$baseDomain = 'ashbuild.app';
$subdomain = '';

// Check if a subdomain is being accessed
if (str_ends_with($host, '.' . $baseDomain)) {
    $subdomain = substr($host, 0, -strlen('.' . $baseDomain));
    if ($subdomain === 'www') {
        $subdomain = '';
    }
} elseif (isset($_GET['subdomain'])) {
    // Testing override via query param ?subdomain=avolens
    $subdomain = strtolower(trim($_GET['subdomain']));
}

// App directory mapping
$appMap = [
    'avolens' => 'avolens',
    'freed' => 'freed',
    'pouched' => 'pouched',
    'respawn' => 'respawn',
    'unpopularopinion' => 'unpopularopinion',
    'unpopular-opinion' => 'unpopularopinion',
    'duoclash' => 'duoclash',
];

$requestUri = $_SERVER['REQUEST_URI'] ?? '/';
$path = parse_url($requestUri, PHP_URL_PATH);
$path = rtrim($path, '/');
if ($path === '') {
    $path = '/';
}

// HELPER: Serve HTML file with proper headers
function serveHtml($file) {
    if (!file_exists($file)) {
        return false;
    }
    header('Content-Type: text/html; charset=UTF-8');
    readfile($file);
    exit;
}

// HELPER: Serve static asset with appropriate Content-Type
function serveStatic($file) {
    if (!file_exists($file) || is_dir($file)) {
        return false;
    }
    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
    $mimes = [
        'html' => 'text/html; charset=UTF-8',
        'htm'  => 'text/html; charset=UTF-8',
        'css'  => 'text/css; charset=UTF-8',
        'js'   => 'application/javascript; charset=UTF-8',
        'png'  => 'image/png',
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'webp' => 'image/webp',
        'gif'  => 'image/gif',
        'svg'  => 'image/svg+xml',
        'ico'  => 'image/x-icon',
        'json' => 'application/json',
        'xml'  => 'application/xml',
        'txt'  => 'text/plain; charset=UTF-8',
    ];
    $contentType = $mimes[$ext] ?? 'application/octet-stream';
    header('Content-Type: ' . $contentType);
    header('Content-Length: ' . filesize($file));
    readfile($file);
    exit;
}

// GLOBAL: Google AdMob / AdSense verification (app-ads.txt & ads.txt)
if ($path === '/app-ads.txt' || $path === '/ads.txt') {
    $adsFile = __DIR__ . '/app-ads.txt';
    if (file_exists($adsFile)) {
        header('Content-Type: text/plain; charset=UTF-8');
        readfile($adsFile);
        exit;
    }
}

// GLOBAL: Handle /assets/ requests (Pouched & shared assets)
if (strpos($path, '/assets/') === 0) {
    $assetFile = substr($path, strlen('/assets/'));
    $searchDirs = [
        __DIR__ . '/portfolio/assets/',
        __DIR__ . '/apps/pouched/assets/',
        __DIR__ . '/apps/freed/assets/',
        __DIR__ . '/apps/avolens/assets/',
    ];
    foreach ($searchDirs as $dir) {
        if (file_exists($dir . $assetFile)) {
            serveStatic($dir . $assetFile);
        }
    }
}

// =========================================================================
// 1. MAIN DOMAIN: Developer Portfolio (ashbuild.app or www.ashbuild.app)
// =========================================================================
if (empty($subdomain)) {
    // Check root files first (app-ads.txt, robots.txt, sitemap.xml, etc.)
    if ($path !== '/') {
        $rootCandidate = __DIR__ . $path;
        if (file_exists($rootCandidate) && !is_dir($rootCandidate)) {
            serveStatic($rootCandidate);
        }
        $portfolioCandidate = __DIR__ . '/portfolio' . $path;
        if (file_exists($portfolioCandidate) && !is_dir($portfolioCandidate)) {
            serveStatic($portfolioCandidate);
        }
    }
    
    // Only serve portfolio index.html if request is root / or html
    $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    if ($ext !== '' && $ext !== 'html' && $ext !== 'htm' && $ext !== 'php') {
        http_response_code(404);
        echo "404 Not Found";
        exit;
    }

    // Serve portfolio main page
    $portfolioFile = __DIR__ . '/portfolio/index.html';
    if (file_exists($portfolioFile)) {
        serveHtml($portfolioFile);
    }
}

// =========================================================================
// 2. APP SUBDOMAINS: appname.ashbuild.app
// =========================================================================
if (isset($appMap[$subdomain])) {
    $appFolder = __DIR__ . '/apps/' . $appMap[$subdomain];

    // ROUTE: /policy OR /privacy
    if ($path === '/policy' || $path === '/privacy') {
        $candidates = [
            $appFolder . '/policy/index.html',
            $appFolder . '/privacy/index.html',
            $appFolder . '/privacy.html',
            $appFolder . '/policy.html'
        ];
        foreach ($candidates as $f) {
            if (file_exists($f)) {
                serveHtml($f);
            }
        }
    }

    // ROUTE: /terms
    if ($path === '/terms') {
        $candidates = [
            $appFolder . '/terms/index.html',
            $appFolder . '/terms.html'
        ];
        foreach ($candidates as $f) {
            if (file_exists($f)) {
                serveHtml($f);
            }
        }
    }

    // ROUTE: /delete-account OR /delete-data
    if ($path === '/delete-account' || $path === '/delete-data') {
        $candidates = [
            $appFolder . '/delete-account/index.html',
            $appFolder . '/delete-data/index.html',
            $appFolder . '/delete-account.html',
            $appFolder . '/delete-data.html'
        ];
        foreach ($candidates as $f) {
            if (file_exists($f)) {
                serveHtml($f);
            }
        }
    }

    // ROUTE: /support
    if ($path === '/support') {
        $candidates = [
            $appFolder . '/support/index.html',
            $appFolder . '/support.html'
        ];
        foreach ($candidates as $f) {
            if (file_exists($f)) {
                serveHtml($f);
            }
        }
    }

    // ROUTE: / (App Landing Page)
    if ($path === '/') {
        $indexFile = $appFolder . '/index.html';
        if (file_exists($indexFile)) {
            serveHtml($indexFile);
        }
    }

    // ROUTE: Static files (CSS, JS, images, icons, etc.)
    $staticFile = $appFolder . $path;
    if (file_exists($staticFile) && !is_dir($staticFile)) {
        serveStatic($staticFile);
    }
}

// =========================================================================
// 3. 404 NOT FOUND FALLBACK
// =========================================================================
http_response_code(404);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Not Found - Ash Build</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background-color: #0f172a;
            color: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            text-align: center;
            padding: 20px;
        }
        .box {
            background: #1e293b;
            border: 1px solid #334155;
            padding: 40px;
            border-radius: 16px;
            max-width: 480px;
        }
        h1 { margin-top: 0; font-size: 2rem; color: #38bdf8; }
        p { color: #94a3b8; font-size: 1.05rem; }
        a.btn {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background: #2563eb;
            color: #fff;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="box">
        <h1>404 - Page Not Found</h1>
        <p>The requested application page could not be located.</p>
        <a href="https://ashbuild.app" class="btn">Return to Ash Build Portfolio</a>
    </div>
</body>
</html>
