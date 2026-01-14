/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DashboardTemplate {
    id: string;
    name: string;
    category: 'analytics' | 'ecommerce' | 'saas' | 'admin' | 'crm' | 'iot';
    description: string;
    html: string;
}

export const DASHBOARD_TEMPLATES: DashboardTemplate[] = [
    {
        id: 'saas-analytics',
        name: 'SaaS Analytics',
        category: 'saas',
        description: 'Modern dashboard for tracking MRR, churn, and user growth',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SaaS Analytics Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; min-height: 100vh; background: #f8fafc; }
        .sidebar { width: 240px; background: #1e293b; color: #fff; padding: 24px; }
        .sidebar h2 { margin-bottom: 24px; font-size: 1.5rem; }
        .sidebar nav a { display: block; padding: 12px 16px; color: #cbd5e1; text-decoration: none; border-radius: 8px; margin-bottom: 4px; transition: all 0.2s; }
        .sidebar nav a:hover, .sidebar nav a.active { background: #334155; color: #fff; }
        .main { flex: 1; padding: 32px; }
        .header { margin-bottom: 32px; }
        .header h1 { font-size: 2rem; margin-bottom: 8px; color: #0f172a; }
        .header p { color: #64748b; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; margin-bottom: 32px; }
        .stat-card { background: #fff; padding: 24px; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .stat-card .label { color: #64748b; font-size: 0.875rem; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
        .stat-card .value { font-size: 2rem; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
        .stat-card .change { font-size: 0.875rem; color: #10b981; }
    </style>
</head>
<body>
    <aside class="sidebar">
        <h2>DashGen</h2>
        <nav>
            <a href="#" class="active">📊 Overview</a>
            <a href="#">📈 Revenue</a>
            <a href="#">👥 Customers</a>
        </nav>
    </aside>
    <main class="main">
        <header class="header">
            <h1>SaaS Analytics</h1>
            <p>Monitor your key metrics</p>
        </header>
        <section class="stats">
            <div class="stat-card">
                <div class="label">MRR</div>
                <div class="value">$45,231</div>
                <div class="change">+12.5% from last month</div>
            </div>
            <div class="stat-card">
                <div class="label">Active Users</div>
                <div class="value">2,345</div>
                <div class="change">+8.3% from last month</div>
            </div>
        </section>
    </main>
</body>
</html>`
    },
    {
        id: 'ecommerce-admin',
        name: 'E-commerce Admin',
        category: 'ecommerce',
        description: 'Complete e-commerce admin panel with orders and products',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>E-commerce Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', sans-serif; background: #f5f5f5; }
        .header { background: #2c3e50; color: #fff; padding: 16px 32px; }
        .header h1 { font-size: 1.5rem; }
        .container { padding: 32px; }
        .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .stat-box { background: #fff; padding: 24px; border-radius: 8px; }
        .stat-box .value { font-size: 1.8rem; font-weight: 700; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🛍️ E-commerce Dashboard</h1>
    </div>
    <div class="container">
        <div class="stats">
            <div class="stat-box">
                <div class="value">1,234</div>
                <div>Total Orders</div>
            </div>
            <div class="stat-box">
                <div class="value">$84,532</div>
                <div>Revenue</div>
            </div>
        </div>
    </div>
</body>
</html>`
    },
    {
        id: 'crm-dashboard',
        name: 'CRM Dashboard',
        category: 'crm',
        description: 'Customer relationship management with leads and deals',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>CRM Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #fafafa; display: flex; }
        .sidebar { width: 260px; background: linear-gradient(180deg, #4a148c 0%, #7b1fa2 100%); color: #fff; padding: 24px; }
        .main { flex: 1; padding: 32px; }
        .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
        .metric-card { background: #fff; padding: 20px; border-radius: 12px; }
        .metric-card .value { font-size: 1.8rem; font-weight: 700; }
    </style>
</head>
<body>
    <aside class="sidebar">
        <div style="font-size: 1.5rem; margin-bottom: 32px;">CRM Pro</div>
    </aside>
    <main class="main">
        <h1 style="margin-bottom: 32px;">Dashboard</h1>
        <section class="metrics">
            <div class="metric-card">
                <div>Total Deals</div>
                <div class="value">142</div>
            </div>
            <div class="metric-card">
                <div>Pipeline Value</div>
                <div class="value">$2.4M</div>
            </div>
        </section>
    </main>
</body>
</html>`
    },
    {
        id: 'server-monitoring',
        name: 'Server Monitoring',
        category: 'admin',
        description: 'Real-time server and infrastructure monitoring',
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Server Monitoring</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Consolas', monospace; background: #0a0e27; color: #fff; padding: 24px; }
        .header { margin-bottom: 32px; }
        .header h1 { font-size: 1.8rem; color: #00ff88; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .metric { background: #1e2545; padding: 20px; border-radius: 12px; }
        .metric .value { font-size: 2rem; font-weight: 700; color: #00ff88; }
    </style>
</head>
<body>
    <div class="header">
        <h1>⚡ SERVER MONITORING</h1>
    </div>
    <div class="grid">
        <div class="metric">
            <div>CPU Usage</div>
            <div class="value">42%</div>
        </div>
        <div class="metric">
            <div>Memory</div>
            <div class="value">6.2 GB</div>
        </div>
    </div>
</body>
</html>`
    }
];
