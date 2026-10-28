import { LayoutSpec, LayoutElement, ApprovedCopy, CopyAuditItem } from '../types';

/**
 * Sanitizes SVG markup to prevent script execution or unsafe injections
 */
export function sanitizeSvg(svg: string): string {
  if (!svg) return '';
  return svg
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\bon\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\bjavascript:\s*/gi, '')
    .replace(/<foreignObject\b[^<]*(?:(?!<\/foreignObject>)<[^<]*)*<\/foreignObject>/gi, '');
}

/**
 * Converts a structured LayoutSpec into production-grade, layered SVG markup
 */
export function generateSvgFromLayout(spec: LayoutSpec): string {
  const { widthMm, heightMm, bleedMm = 3, title = 'Artwork' } = spec.document;
  const viewBox = `0 0 ${widthMm} ${heightMm}`;

  // Group elements by role
  const groups: Record<string, LayoutElement[]> = {
    background: [],
    'hero-visual': [],
    'brand-elements': [],
    headline: [],
    subheading: [],
    'supporting-information': [],
    'call-to-action': [],
    disclaimer: [],
    footer: [],
  };

  spec.elements.forEach((el) => {
    if (groups[el.role]) {
      groups[el.role].push(el);
    } else {
      groups.background.push(el);
    }
  });

  const renderElement = (el: LayoutElement): string => {
    const opacity = el.opacity !== undefined ? `opacity="${el.opacity}"` : '';
    const stroke = el.stroke ? `stroke="${el.stroke}" stroke-width="${el.strokeWidth || 1}"` : '';

    if (el.type === 'shape') {
      const rx = el.borderRadius ? `rx="${el.borderRadius}" ry="${el.borderRadius}"` : '';
      return `    <rect id="${el.id}" x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="${el.fill || '#1e293b'}" ${rx} ${stroke} ${opacity} data-role="${el.role}" data-editable="${el.editable}" />`;
    }

    if (el.type === 'image') {
      const rawUrl = el.assetUrl || '';

      // Check if this is an embedded SVG (raw <svg, data:image/svg, or encoded SVG)
      if (
        rawUrl.includes('<svg') ||
        rawUrl.includes('%3Csvg') ||
        rawUrl.startsWith('data:image/svg')
      ) {
        let svgContent = rawUrl;
        if (svgContent.startsWith('data:image/svg+xml;utf8,')) {
          svgContent = svgContent.replace('data:image/svg+xml;utf8,', '');
        } else if (svgContent.startsWith('data:image/svg+xml,')) {
          svgContent = svgContent.replace('data:image/svg+xml,', '');
        } else if (svgContent.startsWith('data:image/svg+xml;base64,')) {
          try {
            svgContent = atob(svgContent.replace('data:image/svg+xml;base64,', ''));
          } catch {
            // keep as is
          }
        }

        try {
          if (svgContent.includes('%3C') || svgContent.includes('%20') || svgContent.includes('%23')) {
            svgContent = decodeURIComponent(svgContent);
          }
        } catch {
          // ignore decode error
        }

        // Extract viewBox if present
        const viewBoxMatch = svgContent.match(/viewBox=["']([^"']+)["']/i);
        const vb = viewBoxMatch ? viewBoxMatch[1] : `0 0 ${el.width} ${el.height}`;

        // Extract inner content without <?xml...?> and <svg...> ... </svg>
        const innerContent = svgContent
          .replace(/<\?xml[^>]*\?>/gi, '')
          .replace(/<!DOCTYPE[^>]*>/gi, '')
          .replace(/<svg\b[^>]*>/i, '')
          .replace(/<\/svg>\s*$/i, '');

        return `    <svg id="${el.id}" x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" viewBox="${vb}" ${opacity} data-role="${el.role}" data-asset-id="${el.assetId || ''}" data-editable="${el.editable}" preserveAspectRatio="xMidYMid meet">
${innerContent}
    </svg>`;
      }

      // Raster image fallback (PNG/JPG base64 or URL)
      const safeHref = escapeXml(rawUrl);
      return `    <image id="${el.id}" x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" href="${safeHref}" xlink:href="${safeHref}" preserveAspectRatio="xMidYMid meet" ${opacity} data-role="${el.role}" data-asset-id="${el.assetId || ''}" data-editable="${el.editable}" />`;
    }

    if (el.type === 'text') {
      const fontSize = el.fontSize || 16;
      const fontFamily = el.fontFamily || "'Plus Jakarta Sans', sans-serif";
      const fontWeight = el.fontWeight || 500;
      const fill = el.fill || '#ffffff';
      const anchor = el.textAnchor || 'start';
      const lineHeight = el.lineHeight || fontSize * 1.3;

      // Wrap text into lines if newline exists or estimate multi-line
      const lines = (el.content || '').split('\n');

      const tspans = lines
        .map((line, idx) => {
          const dy = idx === 0 ? '0' : `${lineHeight}`;
          return `<tspan x="${el.x}" dy="${dy}">${escapeXml(line)}</tspan>`;
        })
        .join('');

      return `    <text id="${el.id}" x="${el.x}" y="${el.y}" fill="${fill}" font-family="${fontFamily}" font-size="${fontSize}" font-weight="${fontWeight}" text-anchor="${anchor}" ${opacity} data-role="${el.role}" data-source="${el.contentSource || ''}" data-editable="${el.editable}">${tspans}</text>`;
    }

    return '';
  };

  const groupOrder: Array<keyof typeof groups> = [
    'background',
    'hero-visual',
    'brand-elements',
    'headline',
    'subheading',
    'supporting-information',
    'call-to-action',
    'disclaimer',
    'footer',
  ];

  let body = '';
  for (const role of groupOrder) {
    const list = groups[role];
    if (list && list.length > 0) {
      body += `  <!-- Group: ${role} -->\n`;
      body += `  <g id="group-${role}" data-role="${role}">\n`;
      body += list.map(renderElement).join('\n') + '\n';
      body += `  </g>\n\n`;
    }
  }

  // Defs for subtle gradients, filters, or clip paths
  const defs = `  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${spec.colorPalette?.background || '#090a0f'}" />
      <stop offset="100%" stop-color="#141721" />
    </linearGradient>
    <linearGradient id="accentGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${spec.colorPalette?.accent || '#0284c7'}" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.05" />
    </linearGradient>
  </defs>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  width="100%" height="100%" viewBox="${viewBox}"
  data-title="${escapeXml(title)}" data-bleed-mm="${bleedMm}">
${defs}

${body}
</svg>`;

  return sanitizeSvg(svg);
}

function escapeXml(unsafe: string): string {
  return (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Extracts all text strings from SVG markup
 */
export function extractTextFromSvg(svg: string): string[] {
  const matches = svg.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/gi);
  const results: string[] = [];
  for (const match of matches) {
    const inner = match[1];
    // Remove tspans tags, preserving text
    const clean = inner
      .replace(/<tspan[^>]*>/gi, '')
      .replace(/<\/tspan>/gi, '\n')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .trim();
    if (clean) results.push(clean);
  }
  return results;
}

/**
 * Deterministic copy verification auditing SVG text against approved copy source
 */
export function auditCopyAgainstSvg(svg: string, copy: ApprovedCopy): CopyAuditItem[] {
  const extracted = extractTextFromSvg(svg);
  const joinedSvgText = extracted.join(' ').toLowerCase();

  const normalize = (t: string) =>
    (t || '').toLowerCase().replace(/\s+/g, ' ').replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, '').trim();

  const normalizedSvg = normalize(joinedSvgText);

  const checkField = (field: string, text: string): CopyAuditItem => {
    if (!text || !text.trim()) {
      return {
        field,
        suppliedText: '(none specified)',
        foundInArtwork: true,
        exactMatch: true,
        similarityScore: 100,
      };
    }

    const normTarget = normalize(text);
    const words = normTarget.split(' ').filter(Boolean);

    // Exact substring match check
    const exactMatch = normalizedSvg.includes(normTarget);
    let matchedWords = 0;
    words.forEach((w) => {
      if (normalizedSvg.includes(w)) matchedWords++;
    });

    const similarityScore = words.length > 0 ? Math.round((matchedWords / words.length) * 100) : 0;
    const foundInArtwork = exactMatch || similarityScore >= 75;

    let discrepancyNote: string | undefined;
    if (!foundInArtwork) {
      discrepancyNote = `Missing approved copy or major wording difference (${similarityScore}% word match)`;
    } else if (!exactMatch) {
      discrepancyNote = `Text appears with minor layout formatting or partial word differences (${similarityScore}% match)`;
    }

    return {
      field,
      suppliedText: text,
      foundInArtwork,
      exactMatch,
      similarityScore,
      discrepancyNote,
    };
  };

  const results: CopyAuditItem[] = [
    checkField('Headline', copy.headline),
    checkField('Subheading', copy.subheading),
    checkField('Product Information', copy.productInformation),
    checkField('Call to Action', copy.callToAction),
    checkField('Disclaimer', copy.disclaimer),
    checkField('Footer / Contact', copy.footerText || copy.contactInfo),
  ];

  // Also check individual approved claims
  if (copy.approvedClaims && copy.approvedClaims.length > 0) {
    copy.approvedClaims.forEach((claim, idx) => {
      results.push(checkField(`Approved Claim #${idx + 1}`, claim));
    });
  }

  return results;
}

/**
 * Render SVG to canvas and get PNG Data URL
 */
export async function renderSvgToPngDataUrl(
  svgString: string,
  widthPx = 1200,
  heightPx = 1700
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const sanitized = sanitizeSvg(svgString);
      const blob = new Blob([sanitized], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobUrl = URL.createObjectURL(blob);
      const img = new Image();

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = widthPx;
          canvas.height = heightPx;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            URL.revokeObjectURL(blobUrl);
            reject(new Error('Canvas context unavailable'));
            return;
          }
          // White background
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(0, 0, widthPx, heightPx);
          ctx.drawImage(img, 0, 0, widthPx, heightPx);
          const dataUrl = canvas.toDataURL('image/png');
          URL.revokeObjectURL(blobUrl);
          resolve(dataUrl);
        } catch (err) {
          URL.revokeObjectURL(blobUrl);
          reject(err);
        }
      };

      img.onerror = (err) => {
        URL.revokeObjectURL(blobUrl);
        reject(new Error('Failed to render SVG image onto canvas'));
      };

      img.src = blobUrl;
    } catch (err) {
      reject(err);
    }
  });
}
