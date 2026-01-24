
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const extractBodyContent = (html: string): { body: string; scripts: string; styles: string } => {
    if (!html) return { body: '', scripts: '', styles: '' };
    
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Extract Scripts
    const scripts = Array.from(doc.querySelectorAll('script')).map(s => s.outerHTML).join('\n');
    doc.querySelectorAll('script').forEach(s => s.remove());

    // Extract Styles
    const styles = Array.from(doc.querySelectorAll('style')).map(s => s.outerHTML).join('\n');
    doc.querySelectorAll('style').forEach(s => s.remove());

    // Extract Layout Wrapper Content if present, otherwise body content
    const layoutContainer = doc.querySelector('.layout-container');
    const bodyContent = layoutContainer ? layoutContainer.innerHTML : doc.body.innerHTML;

    return { body: bodyContent, scripts, styles };
};
