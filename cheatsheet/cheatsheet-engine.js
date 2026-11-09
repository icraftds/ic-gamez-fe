/* ==========================================================================
   CHEATSHEET ENGINE - REUSABLE LIGHTWEIGHT JAVASCRIPT
   Shared Engine for Theme, Sidebar, Copy Toast, Search, Favorites & Quiz
   ========================================================================== */

// Immediately detect if embedded inside GameZ iframe or embed param
(function checkEmbedded() {
  const isEmbedded = (window.self !== window.top) || (window.location.search.indexOf('embed=1') !== -1);
  if (isEmbedded) {
    if (document.documentElement) {
      document.documentElement.classList.add('is-embedded');
    }
    if (document.body) {
      document.body.classList.add('is-embedded');
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        if (document.body) document.body.classList.add('is-embedded');
      });
    }
  }
})();

function setupCheatsheetPage({ catalog = [], questions = [] }) {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    initSharedTheme();
    initSharedSidebar();
    initMateriPagination();
    initSharedCopyButtons();
    initFormulaFavorites();

    if (catalog && catalog.length > 0) {
      initPageLiveSearch(catalog);
      initPageQuickRef(catalog);
    }

    if (questions && questions.length > 0) {
      initPageQuiz(questions);
    }
  });
}

/* 1. Theme Management */
function initSharedTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]');
  const htmlEl = document.documentElement;

  const getPreferredTheme = () => {
    const saved = localStorage.getItem('excel-cheatsheet-theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    htmlEl.setAttribute('data-theme', theme);
    if (metaColorScheme) {
      metaColorScheme.content = theme;
    }
    localStorage.setItem('excel-cheatsheet-theme', theme);
    updateThemeIcon(theme);
  };

  const updateThemeIcon = (theme) => {
    if (!themeToggleBtn) return;
    const isDark = theme === 'dark';
    themeToggleBtn.innerHTML = isDark
      ? '<i data-lucide="sun" class="nav-icon"></i>'
      : '<i data-lucide="moon" class="nav-icon"></i>';
    themeToggleBtn.setAttribute('aria-label', isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap');
    themeToggleBtn.setAttribute('title', isDark ? 'Mode Terang' : 'Mode Gelap');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  };

  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = htmlEl.getAttribute('data-theme') || 'light';
      applyTheme(activeTheme === 'dark' ? 'light' : 'dark');
    });
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('excel-cheatsheet-theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
}

/* 2. Sidebar Management (Desktop Collapse & Mobile Off-canvas) */
function initSharedSidebar() {
  const sidebar = document.getElementById('appSidebar') || document.getElementById('sidebar');
  if (!sidebar) return;

  let backdrop = document.getElementById('sidebarBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'sidebarBackdrop';
    backdrop.className = 'sidebar-backdrop';
    document.body.appendChild(backdrop);
  }

  // Unified Header inside Sidebar
  let drawerHeader = sidebar.querySelector('.sidebar-drawer-header');
  if (!drawerHeader) {
    drawerHeader = document.createElement('div');
    drawerHeader.className = 'sidebar-drawer-header';
    drawerHeader.innerHTML = `
      <span class="sidebar-drawer-title"><i data-lucide="layers" style="width:16px;height:16px;margin-right:6px;"></i>Daftar Isi</span>
      <button class="sidebar-close-btn" aria-label="Tutup Sidebar" title="Tutup Sidebar"><i data-lucide="x" style="width:16px;height:16px;">✕</i></button>
    `;
    sidebar.prepend(drawerHeader);
  }

  // Floating Reopen Button on Desktop when sidebar collapsed
  let reopenBtn = document.getElementById('sidebarReopenBtn');
  if (!reopenBtn) {
    reopenBtn = document.createElement('button');
    reopenBtn.id = 'sidebarReopenBtn';
    reopenBtn.className = 'sidebar-reopen-btn';
    reopenBtn.setAttribute('aria-label', 'Buka Daftar Isi');
    reopenBtn.setAttribute('title', 'Buka Daftar Isi');
    reopenBtn.innerHTML = '<i data-lucide="panel-left-open" style="width:15px;height:15px;margin-right:6px;"></i><span>Daftar Isi</span>';
    document.body.appendChild(reopenBtn);
  }

  const isMobile = () => window.innerWidth <= 860;

  const toggleSidebar = (forceState) => {
    if (isMobile()) {
      const open = typeof forceState === 'boolean' ? forceState : !sidebar.classList.contains('open');
      sidebar.classList.toggle('open', open);
      backdrop.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    } else {
      const isCurrentlyCollapsed = document.body.classList.contains('sidebar-collapsed');
      const shouldCollapse = typeof forceState === 'boolean' ? !forceState : !isCurrentlyCollapsed;
      document.body.classList.toggle('sidebar-collapsed', shouldCollapse);
      try {
        localStorage.setItem('gamez-cheatsheet-sidebar-collapsed', shouldCollapse ? '1' : '0');
      } catch (e) {}
    }
  };

  // Restore saved desktop collapse preference
  try {
    if (!isMobile() && localStorage.getItem('gamez-cheatsheet-sidebar-collapsed') === '1') {
      document.body.classList.add('sidebar-collapsed');
    }
  } catch (e) {}

  drawerHeader.querySelector('.sidebar-close-btn')?.addEventListener('click', () => toggleSidebar(false));
  reopenBtn?.addEventListener('click', () => toggleSidebar(true));
  backdrop?.addEventListener('click', () => toggleSidebar(false));

  const mobileToggle = document.getElementById('mobileMenuToggle');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => toggleSidebar());
  }

  // Floating Action Button for Mobile TOC
  if (!document.getElementById('mobileTocFloatingBtn')) {
    const fab = document.createElement('button');
    fab.id = 'mobileTocFloatingBtn';
    fab.className = 'mobile-toc-fab';
    fab.setAttribute('aria-label', 'Buka Daftar Isi');
    fab.innerHTML = '<i data-lucide="menu">☰</i><span>Daftar Isi</span>';
    fab.addEventListener('click', () => toggleSidebar(true));
    document.body.appendChild(fab);
  }

  // Cross-frame messaging from GameZ reader toolbar
  window.addEventListener('message', (e) => {
    if (e.data && e.data.action === 'toggleSidebar') {
      toggleSidebar();
    }
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* 2B. Per-Materi Focused Learning Mode */
function initMateriPagination() {
  const sections = Array.from(document.querySelectorAll('.category-section, .content-section')).filter(s => s.id);
  if (sections.length <= 1) return;

  const sidebar = document.getElementById('appSidebar') || document.getElementById('sidebar');
  const navLinks = Array.from(document.querySelectorAll('.sidebar-link, .sidebar-nav .nav-item'));
  const heroBanner = document.querySelector('.hero-banner');

  const materiList = sections.map((sec, idx) => {
    const h = sec.querySelector('h2, h3, .section-title, .category-tag, .formula-name');
    let title = h ? h.textContent.replace(/<[^>]+>/g, '').trim() : sec.id;
    title = title.replace(/^[0-9\.\s\-]+/, '').trim();
    return {
      index: idx,
      id: sec.id,
      title: title || `Materi ${idx + 1}`,
      element: sec
    };
  });

  const total = materiList.length;

  materiList.forEach((m, idx) => {
    const sec = m.element;

    // Inject Top Indicator Bar
    if (!sec.querySelector('.materi-top-bar')) {
      const topBar = document.createElement('div');
      topBar.className = 'materi-top-bar';
      const pct = Math.round(((idx + 1) / total) * 100);
      topBar.innerHTML = `
        <span class="materi-badge-pill">
          <i data-lucide="book-marked" style="width:14px;height:14px;"></i>
          <span>Materi ${idx + 1} dari ${total}</span>
        </span>
        <span class="materi-progress-track" title="${pct}% Selesai">
          <span class="materi-progress-fill" style="width: ${pct}%;"></span>
        </span>
      `;
      sec.insertBefore(topBar, sec.firstChild);
    }

    // Inject Bottom Navigation Footer (Prev / Next)
    if (!sec.querySelector('.materi-nav-footer')) {
      const prev = idx > 0 ? materiList[idx - 1] : null;
      const next = idx < total - 1 ? materiList[idx + 1] : null;

      const navFooter = document.createElement('div');
      navFooter.className = 'materi-nav-footer';
      navFooter.innerHTML = `
        <button type="button" class="btn-materi-step btn-prev-materi" ${!prev ? 'disabled' : ''} data-target-index="${idx - 1}">
          <i data-lucide="chevron-left"></i>
          <div class="step-text-col">
            <span class="step-sublabel">Sebelumnya</span>
            <span class="step-title">${prev ? prev.title : 'Awal Modul'}</span>
          </div>
        </button>

        <div class="materi-step-pill">
          <i data-lucide="book-open" style="width:14px;height:14px;"></i>
          <span>${idx + 1} / ${total}</span>
        </div>

        <button type="button" class="btn-materi-step btn-next-materi" ${!next ? 'disabled' : ''} data-target-index="${idx + 1}">
          <div class="step-text-col text-right">
            <span class="step-sublabel">Selanjutnya</span>
            <span class="step-title">${next ? next.title : 'Selesai'}</span>
          </div>
          <i data-lucide="chevron-right"></i>
        </button>
      `;
      sec.appendChild(navFooter);
    }
  });

  let currentActiveIndex = 0;

  const showMateri = (index, shouldScroll = true) => {
    if (index < 0) index = 0;
    if (index >= total) index = total - 1;
    currentActiveIndex = index;

    materiList.forEach((m, idx) => {
      if (idx === index) {
        m.element.classList.add('materi-active');
        m.element.classList.remove('materi-hidden');
        m.element.style.display = 'block';
      } else {
        m.element.classList.remove('materi-active');
        m.element.classList.add('materi-hidden');
        m.element.style.display = 'none';
      }
    });

    if (heroBanner) {
      heroBanner.style.display = index === 0 ? '' : 'none';
    }

    // Update active highlight in sidebar
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' + materiList[index].id) {
        link.classList.add('active');
        if (sidebar && typeof link.scrollIntoView === 'function') {
          link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      } else {
        link.classList.remove('active');
      }
    });

    try {
      history.replaceState(null, '', '#' + materiList[index].id);
    } catch (e) {}

    if (shouldScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const mainContent = document.querySelector('.main-content, .content, .main-container');
      if (mainContent && mainContent.scrollTop) {
        mainContent.scrollTop = 0;
      }
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
  };

  // Click on Prev / Next buttons
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-materi-step');
    if (!btn || btn.disabled) return;
    const targetIdx = parseInt(btn.getAttribute('data-target-index'), 10);
    if (!isNaN(targetIdx) && targetIdx >= 0 && targetIdx < total) {
      showMateri(targetIdx, true);
    }
  });

  // Click on Sidebar Nav Links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const secId = href.substring(1);
        const matchIdx = materiList.findIndex(m => m.id === secId);
        if (matchIdx !== -1) {
          e.preventDefault();
          showMateri(matchIdx, true);
          if (window.innerWidth <= 860 && sidebar) {
            sidebar.classList.remove('open');
            const backdrop = document.getElementById('sidebarBackdrop');
            if (backdrop) backdrop.classList.remove('open');
            document.body.style.overflow = '';
          }
        }
      }
    });
  });

  // Initial load hash detection
  const initialHash = window.location.hash ? window.location.hash.substring(1) : '';
  const initialIdx = materiList.findIndex(m => m.id === initialHash);
  showMateri(initialIdx !== -1 ? initialIdx : 0, false);

  window.addEventListener('hashchange', () => {
    const h = window.location.hash ? window.location.hash.substring(1) : '';
    const idx = materiList.findIndex(m => m.id === h);
    if (idx !== -1 && idx !== currentActiveIndex) {
      showMateri(idx, true);
    }
  });

  // Search compatibility
  const searchInput = document.getElementById('cheatsheetSearch') || document.getElementById('searchRumus');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      if (!q) {
        showMateri(currentActiveIndex, false);
      } else {
        materiList.forEach(m => {
          const cards = m.element.querySelectorAll('.formula-card');
          const hasMatches = Array.from(cards).some(card => {
            return card.textContent.toLowerCase().includes(q);
          });
          if (hasMatches) {
            m.element.classList.remove('materi-hidden');
            m.element.style.display = 'block';
          } else {
            m.element.classList.add('materi-hidden');
            m.element.style.display = 'none';
          }
        });
      }
    });
  }
}


/* 3. Copy to Clipboard & Toast */
function showToast(message = 'Tersalin ke clipboard!') {
  let toast = document.getElementById('copyToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'copyToast';
    toast.className = 'toast-notification';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i data-lucide="check-circle" style="width:18px;height:18px;color:#22c55e;"></i> <span>${message}</span>`;
  if (typeof lucide !== 'undefined') lucide.createIcons();

  toast.classList.add('show');
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function initSharedCopyButtons() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-copy, .copy-btn');
    if (!btn) return;

    let textToCopy = btn.getAttribute('data-copy') || btn.getAttribute('data-clipboard');
    if (!textToCopy) {
      const codeBlock = btn.closest('.formula-syntax, .syntax-block, .example-block, .code-wrapper')?.querySelector('code');
      if (codeBlock) {
        textToCopy = codeBlock.textContent.trim();
      }
    }

    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('Rumus / Kode tersalin ke clipboard!');
        const origHtml = btn.innerHTML;
        btn.innerHTML = '<i data-lucide="check" style="width:14px;height:14px;color:#22c55e;"></i> <span>Disalin!</span>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
        setTimeout(() => {
          btn.innerHTML = origHtml;
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }, 1800);
      }).catch(() => {
        showToast('Gagal menyalin. Silakan salin manual.');
      });
    }
  });

  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/* 4. Formula Favorites (Love / Bintang) System */
function initFormulaFavorites() {
  const cards = document.querySelectorAll('.formula-card');
  if (cards.length === 0) return;

  const pagePath = window.location.pathname.split('/').pop().replace('.html', '') || 'general';
  const storageKey = `fav_formulas_${pagePath}`;
  let favorites = [];
  try {
    favorites = JSON.parse(localStorage.getItem(storageKey) || '[]');
  } catch (e) {
    favorites = [];
  }

  let favFilterActive = false;
  const headerRight = document.querySelector('.header-right');
  let toggleBtn = document.getElementById('favFormulaFilterBtn');

  if (headerRight && !toggleBtn) {
    toggleBtn = document.createElement('button');
    toggleBtn.id = 'favFormulaFilterBtn';
    toggleBtn.className = 'btn-icon';
    toggleBtn.style.position = 'relative';
    toggleBtn.setAttribute('title', 'Tampilkan Hanya Rumus Favorit (Bintang)');
    toggleBtn.setAttribute('aria-label', 'Filter Rumus Favorit');
    toggleBtn.innerHTML = `
      <i data-lucide="star" class="nav-icon"></i>
      <span class="fav-badge-count" id="pageFavBadge">${favorites.length}</span>
    `;
    headerRight.insertBefore(toggleBtn, headerRight.firstChild);
  }

  const updateBadge = () => {
    const badge = document.getElementById('pageFavBadge');
    if (badge) badge.textContent = favorites.length;
    if (toggleBtn) {
      if (favFilterActive) {
        toggleBtn.classList.add('active');
        toggleBtn.style.color = '#f59e0b';
      } else {
        toggleBtn.classList.remove('active');
        toggleBtn.style.color = '';
      }
    }
  };

  cards.forEach((card, index) => {
    const header = card.querySelector('.card-header') || card.querySelector('.formula-card-header');
    const nameEl = card.querySelector('.formula-name') || card.querySelector('h3');
    const formulaId = nameEl ? nameEl.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') : `item-${index}`;

    card.setAttribute('data-formula-id', formulaId);

    if (header && !header.querySelector('.card-fav-btn')) {
      const favBtn = document.createElement('button');
      favBtn.className = 'card-fav-btn';
      favBtn.setAttribute('type', 'button');
      favBtn.setAttribute('title', 'Tandai Favorit (Bintang / Love)');
      favBtn.setAttribute('aria-label', 'Favoritkan Rumus Ini');
      favBtn.innerHTML = `<i data-lucide="star" style="width:15px;height:15px;"></i>`;

      if (favorites.includes(formulaId)) {
        favBtn.classList.add('is-favorited');
        card.classList.add('is-favorited');
      }

      favBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isFav = favorites.includes(formulaId);
        if (isFav) {
          favorites = favorites.filter(id => id !== formulaId);
          favBtn.classList.remove('is-favorited');
          card.classList.remove('is-favorited');
          showToast('Rumus dihapus dari Favorit');
        } else {
          favorites.push(formulaId);
          favBtn.classList.add('is-favorited');
          card.classList.add('is-favorited');
          showToast('Rumus ditambahkan ke Favorit ⭐');
        }

        try {
          localStorage.setItem(storageKey, JSON.stringify(favorites));
        } catch (err) {}

        updateBadge();

        if (favFilterActive) {
          applyFavFilter();
        }

        if (typeof lucide !== 'undefined') lucide.createIcons();
      });

      header.appendChild(favBtn);
    }
  });

  const applyFavFilter = () => {
    cards.forEach(card => {
      const formulaId = card.getAttribute('data-formula-id');
      const isFav = favorites.includes(formulaId);
      if (favFilterActive) {
        card.style.display = isFav ? 'flex' : 'none';
      } else {
        card.style.display = '';
      }
    });

    // Check categories
    document.querySelectorAll('.category-section, .content-section').forEach(sec => {
      if (favFilterActive) {
        const hasVisible = Array.from(sec.querySelectorAll('.formula-card')).some(c => c.style.display !== 'none');
        sec.style.display = hasVisible ? '' : 'none';
      } else {
        sec.style.display = '';
      }
    });
  };

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      favFilterActive = !favFilterActive;
      applyFavFilter();
      updateBadge();
      showToast(favFilterActive ? 'Menampilkan rumus bertanda bintang ⭐' : 'Menampilkan semua rumus');
    });
  }

  updateBadge();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* 5. Live Search for Sub-pages */
function initPageLiveSearch(catalog) {
  const searchInput = document.getElementById('cheatsheetSearch') || document.getElementById('searchRumus');
  if (!searchInput) return;

  const cards = document.querySelectorAll('.formula-card');
  const sections = document.querySelectorAll('.category-section, .content-section');

  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();

    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });

    sections.forEach((sec) => {
      if (sec.id === 'practice-questions' || sec.id === 'quiz-section' || sec.id === 'quick-reference') return;
      const visible = sec.querySelectorAll('.formula-card[style*="display: flex"], .formula-card:not([style*="display: none"])');
      const hasVisible = Array.from(sec.querySelectorAll('.formula-card')).some(c => c.style.display !== 'none');
      sec.style.display = !q || hasVisible ? '' : 'none';
    });
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
  });
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* 6. Quick Reference Table */
function initPageQuickRef(catalog) {
  const tableBody = document.getElementById('quickRefTableBody');
  const searchInput = document.getElementById('quickRefSearchInput');
  const categorySelect = document.getElementById('quickRefCatSelect');
  if (!tableBody) return;

  const renderTable = (filterText = '', selectedCategory = 'ALL') => {
    const q = filterText.trim().toLowerCase();
    const filtered = catalog.filter((item) => {
      const matchCat = selectedCategory === 'ALL' || (item.cat && item.cat.toLowerCase() === selectedCategory.toLowerCase());
      const matchText = !q || item.name.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q) || (item.syntax && item.syntax.toLowerCase().includes(q));
      return matchCat && matchText;
    });

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-subtle);">Tidak ada data yang cocok dengan filter.</td></tr>`;
      return;
    }

    tableBody.innerHTML = filtered.map((item, idx) => `
      <tr>
        <td class="row-num">${idx + 1}</td>
        <td>
          <a href="#${item.section}" style="font-family: var(--font-mono); font-weight:700; color: var(--excel-primary);">
            ${escapeHtml(item.name)}
          </a>
        </td>
        <td><span class="cell-code" style="font-size:0.75rem;">${escapeHtml(item.cat || '')}</span></td>
        <td style="font-size:0.85rem;">${escapeHtml(item.desc)}</td>
        <td><code style="font-size:0.82rem; color: var(--text-code);">${escapeHtml(item.syntax || '')}</code></td>
        <td style="white-space:nowrap;">
          <button class="btn-copy" data-copy="${escapeHtml(item.example || item.syntax || '')}" title="Salin Contoh">
            <i data-lucide="copy" style="width:13px;height:13px;"></i>
            <span>${escapeHtml(item.example ? (item.example.length > 25 ? item.example.slice(0, 25) + '...' : item.example) : 'Salin')}</span>
          </button>
        </td>
      </tr>
    `).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();
  };

  renderTable();

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderTable(searchInput.value, categorySelect ? categorySelect.value : 'ALL');
    });
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      renderTable(searchInput ? searchInput.value : '', categorySelect.value);
    });
  }
}

/* 7. Quiz Engine (List Format) */
function initPageQuiz(rawQuestions) {
  const quizListEl = document.getElementById('quizQuestionsList');
  const quizScoreEl = document.getElementById('quizCurrentScore');
  const quizTotalEl = document.getElementById('quizTotalAnswered');
  const quizPercentEl = document.getElementById('quizCurrentPercent');
  const filterBtns = document.querySelectorAll('.quiz-filter-btn');
  const resetBtn = document.getElementById('btnResetQuiz');
  const shuffleBtn = document.getElementById('btnShuffleQuiz');
  const summaryBox = document.getElementById('quizResultSummary');
  const summaryScore = document.getElementById('resultScoreBig');
  const summaryBadge = document.getElementById('resultBadge');
  const summaryDesc = document.getElementById('resultDesc');
  const restartQuizBtn = document.getElementById('btnRestartFromSummary');

  if (!quizListEl) return;

  let questions = [...rawQuestions];
  let userAnswers = {};
  let currentCategory = 'ALL';

  const updateQuizStats = () => {
    let answeredCount = Object.keys(userAnswers).length;
    let correctCount = 0;

    Object.entries(userAnswers).forEach(([qId, selectedIdx]) => {
      const q = questions.find((item) => item.id === parseInt(qId));
      if (q && q.answer === selectedIdx) {
        correctCount++;
      }
    });

    const percent = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
    if (quizScoreEl) quizScoreEl.textContent = correctCount;
    if (quizTotalEl) quizTotalEl.textContent = answeredCount;
    if (quizPercentEl) quizPercentEl.textContent = `${percent}%`;

    if (answeredCount === questions.length && summaryBox) {
      summaryScore.textContent = `${percent}%`;
      let badgeText = percent >= 80 ? '🏆 Sangat Siap Lolos Tes Kerja!' : (percent >= 60 ? '👍 Pemahaman Baik - Siap Tingkatkan!' : '📖 Perlu Membaca Cheatsheet Kembali');
      let badgeClass = percent >= 80 ? 'success' : (percent >= 60 ? 'info' : 'warning');
      summaryBadge.textContent = badgeText;
      summaryBadge.className = `result-badge ${badgeClass}`;
      summaryDesc.textContent = `Anda berhasil menjawab ${correctCount} dari ${questions.length} pertanyaan dengan benar.`;
      summaryBox.classList.add('show');
      summaryBox.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderQuestions = () => {
    const filtered = questions.filter((q) => {
      return currentCategory === 'ALL' || (q.category && q.category.toLowerCase() === currentCategory.toLowerCase());
    });

    if (filtered.length === 0) {
      quizListEl.innerHTML = '<p style="padding:1.5rem; text-align:center; color:var(--text-subtle);">Tidak ada soal untuk kategori ini.</p>';
      return;
    }

    quizListEl.innerHTML = filtered.map((q, displayIdx) => {
      const isAnswered = userAnswers[q.id] !== undefined;
      const userSelected = userAnswers[q.id];
      const isCorrect = isAnswered && userSelected === q.answer;

      return `
        <div class="quiz-card" id="qcard-${q.id}">
          <div class="quiz-card-meta">
            <span class="question-num-tag">Soal #${displayIdx + 1}</span>
            <span class="question-category-tag">${escapeHtml(q.category || '')}</span>
          </div>
          <div class="question-text">${q.question}</div>
          <div class="options-list">
            ${q.options.map((opt, optIdx) => {
              let optClass = 'option-item';
              if (isAnswered) {
                if (optIdx === q.answer) optClass += ' correct';
                else if (optIdx === userSelected) optClass += ' incorrect';
              }
              const isChecked = userSelected === optIdx ? 'checked' : '';
              const isDisabled = isAnswered ? 'disabled' : '';

              return `
                <label class="${optClass}" data-qid="${q.id}" data-opt="${optIdx}">
                  <input type="radio" name="opt_q_${q.id}" class="option-radio" ${isChecked} ${isDisabled} />
                  <span class="option-label">${opt}</span>
                </label>
              `;
            }).join('')}
          </div>
          <div class="explanation-box ${isAnswered ? 'show' : ''}" id="expl-${q.id}">
            <div class="explanation-header">
              <i data-lucide="${isCorrect ? 'check-circle' : 'info'}" style="width:16px;height:16px;"></i>
              <span>${isCorrect ? 'Jawaban Benar!' : 'Pembahasan Soal:'}</span>
            </div>
            <div>${q.explanation}</div>
          </div>
        </div>
      `;
    }).join('');

    if (typeof lucide !== 'undefined') lucide.createIcons();

    document.querySelectorAll('.option-item').forEach((item) => {
      item.addEventListener('click', () => {
        const qId = parseInt(item.getAttribute('data-qid'));
        const optIdx = parseInt(item.getAttribute('data-opt'));
        if (userAnswers[qId] !== undefined) return;

        userAnswers[qId] = optIdx;
        updateQuizStats();
        renderQuestions();
      });
    });
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-cat') || 'ALL';
      renderQuestions();
    });
  });

  const resetQuiz = () => {
    userAnswers = {};
    if (summaryBox) summaryBox.classList.remove('show');
    updateQuizStats();
    renderQuestions();
  };

  if (resetBtn) resetBtn.addEventListener('click', resetQuiz);
  if (restartQuizBtn) restartQuizBtn.addEventListener('click', resetQuiz);

  if (shuffleBtn) {
    shuffleBtn.addEventListener('click', () => {
      questions = [...questions].sort(() => Math.random() - 0.5);
      resetQuiz();
      showToast('Urutan soal berhasil diacak!');
    });
  }

  updateQuizStats();
  renderQuestions();
}

/* 8. Stepper Quiz Engine (for TypeScript, K8s, Figma, Security, Postman, etc.) */
function initStepperQuiz(quizData) {
  const cardEl = document.getElementById('quizCard');
  const questionEl = document.getElementById('quizQuestion');
  const optionsEl = document.getElementById('quizOptions');
  const feedbackEl = document.getElementById('quizFeedback');
  const nextBtn = document.getElementById('quizNextBtn');
  const progressEl = document.getElementById('quizProgress');
  const scoreEl = document.getElementById('quizScore');
  const resultEl = document.getElementById('quizResult');
  const finalScoreEl = document.getElementById('quizFinalScore');
  const summaryTextEl = document.getElementById('quizSummaryText');
  const restartBtn = document.getElementById('quizRestartBtn');

  if (!cardEl || !questionEl || !optionsEl || !quizData || quizData.length === 0) return;

  let currentIdx = 0;
  let score = 0;
  let isAnswered = false;

  const renderCurrentQuestion = () => {
    isAnswered = false;
    const current = quizData[currentIdx];

    if (progressEl) progressEl.textContent = `Pertanyaan ${currentIdx + 1} dari ${quizData.length}`;
    if (scoreEl) scoreEl.textContent = `Skor: ${score}`;
    if (questionEl) questionEl.innerHTML = current.question;

    if (feedbackEl) {
      feedbackEl.style.display = 'none';
      feedbackEl.innerHTML = '';
      feedbackEl.className = 'quiz-feedback';
    }

    if (nextBtn) nextBtn.style.display = 'none';

    if (optionsEl) {
      optionsEl.innerHTML = current.options.map((opt, idx) => `
        <button class="quiz-option" data-idx="${idx}">${opt}</button>
      `).join('');

      optionsEl.querySelectorAll('.quiz-option').forEach((btn) => {
        btn.addEventListener('click', () => handleOptionClick(parseInt(btn.getAttribute('data-idx'))));
      });
    }

    if (typeof lucide !== 'undefined') lucide.createIcons();
  };

  const handleOptionClick = (selectedIdx) => {
    if (isAnswered) return;
    isAnswered = true;

    const current = quizData[currentIdx];
    const isCorrect = selectedIdx === current.answer;
    const allOptions = optionsEl.querySelectorAll('.quiz-option');

    allOptions.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === current.answer) {
        btn.classList.add('correct');
      } else if (idx === selectedIdx) {
        btn.classList.add('incorrect');
      }
    });

    if (isCorrect) score++;
    if (scoreEl) scoreEl.textContent = `Skor: ${score}`;

    if (feedbackEl) {
      feedbackEl.style.display = 'block';
      feedbackEl.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
      feedbackEl.innerHTML = `
        <div style="font-weight:700; margin-bottom:0.35rem;">${isCorrect ? '✅ Jawaban Benar!' : '❌ Jawaban Kurang Tepat'}</div>
        <div>${current.explanation}</div>
      `;
    }

    if (nextBtn) {
      nextBtn.style.display = 'inline-flex';
      nextBtn.innerHTML = currentIdx === quizData.length - 1 ? 'Lihat Hasil Akhir 🎉' : 'Lanjut <i data-lucide="arrow-right" style="width:16px;height:16px;"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIdx < quizData.length - 1) {
        currentIdx++;
        renderCurrentQuestion();
      } else {
        // Show result
        if (cardEl) cardEl.style.display = 'none';
        if (resultEl) {
          resultEl.style.display = 'block';
          if (finalScoreEl) finalScoreEl.textContent = `Skor Akhir Anda: ${score} / ${quizData.length}`;
          const pct = Math.round((score / quizData.length) * 100);
          let summary = pct >= 80 ? 'Luar biasa! Pemahaman Anda sangat matang untuk tes teknis.' : (pct >= 60 ? 'Bagus! Sedikit lagi review materi agar skor Anda sempurna.' : 'Perlu memperdalam cheatsheet kembali sebelum menghadapi tes teknis.');
          if (summaryTextEl) summaryTextEl.textContent = `${summary} (Akurasi: ${pct}%)`;
        }
      }
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      currentIdx = 0;
      score = 0;
      if (resultEl) resultEl.style.display = 'none';
      if (cardEl) cardEl.style.display = 'block';
      renderCurrentQuestion();
    });
  }

  renderCurrentQuestion();
}

/* 9. Global CheatsheetEngine Object */
window.CheatsheetEngine = {
  init: function(opts = {}) {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    initSharedTheme();
    initSharedSidebar();
    initMateriPagination();
    initSharedCopyButtons();
    initFormulaFavorites();
    initPageLiveSearch();

    if (opts.quizData && opts.quizData.length > 0) {
      initStepperQuiz(opts.quizData);
    }
  }
};
