/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { LayoutOption } from './types';

export const INITIAL_PLACEHOLDERS = [
    "SaaS Analytics Dashboard with MRR & Churn charts",
    "Crypto Portfolio Tracker with live prices",
    "E-commerce Admin Panel with orders table",
    "Server Monitoring Command Center",
    "CRM Lead Management Dashboard",
    "Social Media Marketing Overview",
    "HR Employee Management Portal",
    "IoT Device Status Dashboard"
];

export const LAYOUT_OPTIONS: LayoutOption[] = [
    {
        name: "Standard Sidebar",
        css: "",
        previewHtml: `<div class="preview-box standard"><div class="dash-sidebar"></div><div class="dash-content"><div class="dash-header"></div><div class="dash-grid"><div class="dash-widget"></div><div class="dash-widget"></div><div class="dash-widget lg"></div></div></div></div>`
    },
    {
        name: "Top Navigation",
        css: `
            body { margin: 0; background: #f8fafc; font-family: system-ui, sans-serif; display: flex; flex-direction: column; min-height: 100vh; }
            nav { background: #fff; border-bottom: 1px solid #e2e8f0; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; position: fixed; top: 0; width: 100%; z-index: 50; box-sizing: border-box; }
            .layout-container { margin-top: 64px; padding: 24px; max-width: 1400px; margin-left: auto; margin-right: auto; width: 100%; box-sizing: border-box; }
            /* Force Sidebar to be hidden or converted in this layout if it exists */
            .sidebar, aside { display: none !important; }
        `,
        previewHtml: `<div class="preview-box topnav"><div class="dash-top-bar"></div><div class="dash-content-full"><div class="dash-grid"><div class="dash-widget"></div><div class="dash-widget"></div><div class="dash-widget lg"></div></div></div></div>`
    },
    {
        name: "Glass Command",
        css: `
            body { 
                margin: 0; min-height: 100vh; background: #0f172a; color: #fff; 
                background-image: radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%);
                font-family: 'Inter', sans-serif;
                padding: 20px;
                box-sizing: border-box;
            }
            .layout-container {
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 24px;
                height: calc(100vh - 40px);
                overflow: hidden;
                display: flex;
            }
        `,
        previewHtml: `<div class="preview-box glass"><div class="glass-sidebar"></div><div class="glass-content"><div class="glass-widget"></div><div class="glass-widget"></div></div></div>`
    },
    {
        name: "Neo-Brutalist",
        css: `
            body { margin: 0; background: #FFDEE9; background-image: linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%); font-family: 'Courier New', monospace; padding: 0; }
            .layout-container { display: flex; min-height: 100vh; }
            /* Bold borders for everything */
            * { border-color: #000 !important; }
        `,
        previewHtml: `<div class="preview-box brutal"><div class="brutal-sidebar"></div><div class="brutal-content"><div class="brutal-header"></div><div class="brutal-widget"></div></div></div>`
    },
    {
        name: "Enterprise Light",
        css: `
            body { margin: 0; background: #f1f5f9; color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
            .layout-container { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
            .layout-container > *:first-child { background: #fff; border-right: 1px solid #e2e8f0; }
        `,
        previewHtml: `<div class="preview-box enterprise"><div class="ent-sidebar"></div><div class="ent-content"><div class="ent-widget"></div><div class="ent-widget"></div><div class="ent-table"></div></div></div>`
    },
    {
        name: "Mobile Stack",
        css: `
            body { margin: 0; background: #f3f4f6; display: flex; justify-content: center; padding: 20px; }
            .layout-container { 
                width: 375px; background: #fff; min-height: 812px; border-radius: 40px; 
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); overflow: hidden; position: relative;
                display: flex; flex-direction: column;
            }
            /* Hide desktop sidebars */
            .sidebar, aside { display: none; }
        `,
        previewHtml: `<div class="preview-box mobile"><div class="mobile-frame"><div class="mobile-header"></div><div class="mobile-widget"></div><div class="mobile-widget"></div></div></div>`
    }
];