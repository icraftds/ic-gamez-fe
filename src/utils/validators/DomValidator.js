/**
 * DomValidator
 * Memvalidasi kode HTML/CSS murid terhadap kondisi DOM/CSS yang diharapkan.
 * 
 * Mendukung:
 * 1. JavaScript Expression dinamis (backward-compatible, contoh: "document.querySelector('img') !== null")
 * 2. DSL Aturan Semantik & DOM (contoh: "doctype:html", "h1{text:Halo Web}", "ul>li{count:2}")
 * 3. DSL Aturan CSS & Layout (contoh: ".baris{display:flex}", ".galeri{grid-template-columns:repeat(3,1fr)}")
 * 4. Aturan Majemuk (dipisahkan dengan "&&" atau ";")
 */

function decodeHtmlEntities(str) {
  if (!str) return '';
  return str
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function normalizeCssVal(val) {
  if (!val) return '';
  return val
    .toLowerCase()
    .replace(/["']/g, '')
    .replace(/\s*([,:;()\/])\s*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeSelector(sel) {
  if (!sel) return '';
  return sel
    .toLowerCase()
    .replace(/\s*([>+~])\s*/g, '$1')
    .replace(/:nth\((\d+)\)/g, ':nth-of-type($1)')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitTopLevel(str, separator) {
  const result = [];
  let current = '';
  let inBrace = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '{') inBrace++;
    else if (char === '}') inBrace--;

    if (inBrace === 0 && str.substr(i, separator.length) === separator) {
      if (current.trim()) result.push(current.trim());
      current = '';
      i += separator.length - 1;
      continue;
    }
    current += char;
  }
  if (current.trim()) result.push(current.trim());
  return result;
}

function parseDeclarations(declBlock) {
  const decls = {};
  if (!declBlock) return decls;
  declBlock.split(';').forEach(d => {
    const parts = d.split(':');
    if (parts.length >= 2) {
      const prop = parts[0].trim().toLowerCase();
      const val = parts.slice(1).join(':').trim();
      decls[prop] = normalizeCssVal(val);
    }
  });
  return decls;
}

function extractRuleBlocks(cssText, media, rules) {
  const ruleRegex = /([^{}]+)\{([^{}]+)\}/g;
  let rMatch;
  while ((rMatch = ruleRegex.exec(cssText)) !== null) {
    const rawSelectors = rMatch[1].split(',');
    const decls = parseDeclarations(rMatch[2]);
    for (const rawSel of rawSelectors) {
      rules.push({
        selector: normalizeSelector(rawSel),
        media: media,
        declarations: decls
      });
    }
  }
}

function parseCssRules(html) {
  const rules = [];

  // 1. Ekstraksi dari tag <style>
  const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let sMatch;
  while ((sMatch = styleRegex.exec(html)) !== null) {
    const cleanCss = sMatch[1].replace(/\/\*[\s\S]*?\*\//g, '');

    // Ekstraksi blok @media
    const mediaRegex = /@media\s*([^{]+)\{([\s\S]*?\}\s*)\}/gi;
    let mMatch;
    let nonMediaCss = cleanCss;
    while ((mMatch = mediaRegex.exec(cleanCss)) !== null) {
      const mediaQuery = normalizeCssVal(mMatch[1]);
      const innerCss = mMatch[2];
      extractRuleBlocks(innerCss, mediaQuery, rules);
      nonMediaCss = nonMediaCss.replace(mMatch[0], '');
    }
    extractRuleBlocks(nonMediaCss, null, rules);
  }

  // 2. Ekstraksi dari inline style
  const inlineRegex = /<([a-z0-9_-]+)([^>]*?)style=["']([^"']+)["'][^>]*>/gi;
  let inMatch;
  while ((inMatch = inlineRegex.exec(html)) !== null) {
    const tagName = inMatch[1].toLowerCase();
    const attrs = inMatch[2];
    const styleContent = inMatch[3];
    const decls = parseDeclarations(styleContent);

    const classMatch = /class=["']([^"']+)["']/i.exec(attrs);
    const idMatch = /id=["']([^"']+)["']/i.exec(attrs);
    const selList = [tagName];
    if (classMatch) {
      classMatch[1].split(/\s+/).forEach(c => selList.push('.' + c.toLowerCase()));
    }
    if (idMatch) {
      selList.push('#' + idMatch[1].toLowerCase());
    }
    for (const sel of selList) {
      rules.push({ selector: sel, media: null, declarations: decls });
    }
  }

  return rules;
}

function evaluateSingleRule(userCode, virtualDoc, rule, cssRules) {
  rule = rule.trim();
  if (!rule) return true;

  // 1. Validasi Doctype
  if (rule.startsWith('doctype:')) {
    const expected = rule.split(':')[1].trim();
    return new RegExp(`<!doctype\\s+${expected}`, 'i').test(userCode);
  }

  // 2. Validasi Komentar HTML
  if (rule.startsWith('comment:')) {
    const text = rule.substring('comment:'.length).trim();
    const commentRegex = /<!--([\s\S]*?)-->/g;
    let m;
    while ((m = commentRegex.exec(userCode)) !== null) {
      if (m[1].toLowerCase().includes(text.toLowerCase())) return true;
    }
    return false;
  }

  // 3. Aturan Media Query Bersarang: e.g. .kartu{@media (min-width: 640px){width:50%}}
  const mediaInBrace = /^([^{]*)\{@media\s*([^{]+)\{([^}]+)\}\}$/i.exec(rule);
  if (mediaInBrace) {
    const sel = normalizeSelector(mediaInBrace[1]);
    const expectedMedia = normalizeCssVal(mediaInBrace[2]);
    const decls = parseDeclarations(mediaInBrace[3]);
    for (const r of cssRules) {
      if (!r.media || !r.media.includes(expectedMedia.replace(/\s+/g, ''))) continue;
      if (!sel || r.selector === sel || r.selector.endsWith(sel) || sel.endsWith(r.selector)) {
        for (const [prop, val] of Object.entries(decls)) {
          if (r.declarations[prop] && (r.declarations[prop] === val || r.declarations[prop].includes(val))) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // 4. Aturan Blok Kurung Kurawal: selector{kunci:nilai}
  const braceMatch = /^([^{]+)\{([^}]+)\}$/.exec(rule);
  if (braceMatch) {
    const sel = normalizeSelector(braceMatch[1]);
    const inside = braceMatch[2].trim();
    const decls = parseDeclarations(inside);

    // 4a. Cek teks konten: selector{text:...}
    if (decls['text']) {
      const expectedTexts = decls['text'].split('|').map(s => s.trim().toLowerCase());
      // Cek melalui virtualDoc jika tersedia
      if (virtualDoc) {
        try {
          const el = virtualDoc.querySelector(sel);
          if (el && el.textContent) {
            const elText = el.textContent.toLowerCase();
            if (expectedTexts.every(t => elText.includes(t))) return true;
          }
        } catch (_) {}
      }
      // Fallback: periksa teks ter-decode dari seluruh dokumen
      const decoded = decodeHtmlEntities(userCode).toLowerCase();
      return expectedTexts.every(t => decoded.includes(t));
    }

    // 4b. Cek jumlah elemen: selector{count:...}
    if (decls['count']) {
      const expectedCount = parseInt(decls['count'], 10);
      if (virtualDoc) {
        try {
          const count = virtualDoc.querySelectorAll(sel).length;
          if (count >= expectedCount) return true;
        } catch (_) {}
      }
      const parts = sel.split(/[>+~ ]/);
      const lastPart = parts[parts.length - 1].replace(/^[.#]/, '');
      const tagRegex = new RegExp(`<${lastPart}[\\s>]`, 'gi');
      const matches = userCode.match(tagRegex) || [];
      return matches.length >= expectedCount;
    }

    // 4c. Cek atribut khusus (alt, content, title)
    if (decls['content'] || decls['alt'] || decls['title']) {
      const targetVal = decls['content'] || decls['alt'] || decls['title'];
      const cleanUserCode = userCode.toLowerCase().replace(/\s*,\s*/g, ',');
      const cleanTarget = targetVal.toLowerCase().replace(/\s*,\s*/g, ',');
      return cleanUserCode.includes(cleanTarget);
    }

    // 4d. Cek Properti CSS
    let allPropsMatched = true;
    for (const [prop, expVal] of Object.entries(decls)) {
      let matchedThisProp = false;
      for (const r of cssRules) {
        if (r.selector === sel || r.selector.endsWith(sel) || sel.endsWith(r.selector) || sel.includes(r.selector)) {
          if (r.declarations[prop]) {
            const actVal = r.declarations[prop];
            if (actVal === expVal || actVal.includes(expVal) || expVal.includes(actVal)) {
              matchedThisProp = true;
              break;
            }
          }
        }
      }
      if (!matchedThisProp) {
        allPropsMatched = false;
        break;
      }
    }
    if (allPropsMatched && Object.keys(decls).length > 0) return true;
    return false;
  }

  // 5. Aturan Selektor Hirarki / DOM Murni
  if (virtualDoc) {
    try {
      // Coba seleksi langsung pada virtualDoc
      const normSel = rule.replace(/:nth\((\d+)\)/g, ':nth-of-type($1)');
      if (virtualDoc.querySelector(normSel)) return true;
    } catch (_) {}
  }

  // Jika dipisah dengan '+', periksa setiap token
  const tokens = splitTopLevel(rule, '+');
  if (tokens.length > 1) {
    return tokens.every(tok => evaluateSingleRule(userCode, virtualDoc, tok, cssRules));
  }

  // Jika dipisah dengan '>', periksa keberadaan rantai elemen
  const subTokens = splitTopLevel(rule, '>');
  return subTokens.every(token => {
    token = token.trim();
    // Atribut [attr=val]
    const attrMatch = /\[([^\]=~]+)([=~]+)([^\]]+)\]/i.exec(token);
    if (attrMatch) {
      const attrName = attrMatch[1].trim();
      const attrVal = attrMatch[3].replace(/["']/g, '').trim();
      const hasAttr = new RegExp(`${attrName}=["']?${attrVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i').test(userCode);
      if (!hasAttr) return false;
    }

    // Hapus bagian [attr=val] dari token sebelum memeriksa class dan id elemen
    const tokenWithoutAttrs = token.replace(/\[[^\]]+\]/g, '');

    // ID atau Class
    const idMatch = /#([a-z0-9_-]+)/i.exec(tokenWithoutAttrs);
    if (idMatch && !userCode.toLowerCase().includes(`id="${idMatch[1].toLowerCase()}"`) && !userCode.toLowerCase().includes(`id='${idMatch[1].toLowerCase()}'`)) {
      return false;
    }
    const classMatch = /\.([a-z0-9_-]+)/i.exec(tokenWithoutAttrs);
    if (classMatch && !new RegExp(`class=["'][^"']*\\b${classMatch[1]}\\b[^"']*["']`, 'i').test(userCode)) {
      return false;
    }

    // Tag HTML dasar
    const lastWord = token.trim().split(/\s+/).pop();
    const tagMatch = /^([a-z0-9_-]+)(?:[.#\[]|$)/i.exec(lastWord);
    if (tagMatch) {
      const cleanTag = tagMatch[1].toLowerCase();
      const validHtmlTags = ['header','nav','main','article','footer','section','div','p','h1','h2','h3','h4','h5','h6','ul','ol','li','table','tr','td','th','form','input','button','textarea','select','option','label','img','a','span','blockquote','cite','details','summary','small','meta','title','head','body','html'];
      if (validHtmlTags.includes(cleanTag)) {
        return new RegExp(`<${cleanTag}[\\s>]`, 'i').test(userCode);
      }
    }
    return true;
  });
}

function evaluateDsl(userCode, virtualDoc, expectedCondition) {
  const cssRules = parseCssRules(userCode);
  let andParts = splitTopLevel(expectedCondition, '&&');
  andParts = andParts.flatMap(p => splitTopLevel(p, ';'));

  return andParts.every(part => {
    part = part.trim();
    if (!part) return true;
    return evaluateSingleRule(userCode, virtualDoc, part, cssRules);
  });
}

export function validateDom(userCode, expectedCondition) {
  if (!userCode || !expectedCondition) return false;

  try {
    let virtualDoc = null;
    if (typeof DOMParser !== 'undefined') {
      const parser = new DOMParser();
      virtualDoc = parser.parseFromString(userCode, 'text/html');
    }

    // 1. Eksekusi sebagai JavaScript Expression (Backward compatibility)
    if (virtualDoc) {
      try {
        const validatorFn = new Function('document', `
          try {
            return !!(${expectedCondition});
          } catch(e) {
            return false;
          }
        `);
        const result = validatorFn(virtualDoc);
        if (result === true) return true;
      } catch (_) {
        // expectedCondition adalah DSL deklaratif
      }
    }

    // 2. Eksekusi melalui DSL Rule Evaluator
    return evaluateDsl(userCode, virtualDoc, expectedCondition);
  } catch (error) {
    console.error('DomValidator error:', error);
    return false;
  }
}
