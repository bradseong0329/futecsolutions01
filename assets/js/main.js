// assets/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  // 1) 헤더/푸터 include
  const headerPlaceholder = document.getElementById('header-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');

  const loadHeader = headerPlaceholder
    ? fetch('header.html')
        .then(res => res.text())
        .then(html => {
          headerPlaceholder.innerHTML = html;
        })
        .catch(err => console.error('Header load error:', err))
    : Promise.resolve();

  const loadFooter = footerPlaceholder
    ? fetch('footer.html')
        .then(res => res.text())
        .then(html => {
          footerPlaceholder.innerHTML = html;
        })
        .catch(err => console.error('Footer load error:', err))
    : Promise.resolve();

  // 헤더와 푸터가 로드된 뒤에 초기화
  Promise.all([loadHeader, loadFooter]).then(() => {
    initNavigation();
    initSearchOverlay();
    initComingSoonPage();
    initSearchPage();
  });
});

// 네비게이션(주/서브 메뉴, 햄버거)
function initNavigation() {
  const menuItems = document.querySelectorAll('.menu-item.has-sub');
  const nav = document.querySelector('.main-nav');
  const hamburger = document.querySelector('.hamburger');
  let activeMenu = null;

  menuItems.forEach(item => {
    const link = item.querySelector(':scope > a');
    if (!link) return;

    // 주 메뉴 클릭 시: 파트너 포털/검색 제외하고는 페이지 이동 없음
    link.addEventListener('click', e => {
      const text = link.textContent.trim();
      if (text !== '파트너 포털' && text !== '검색') {
        e.preventDefault();
      }
    });

    // 마우스 오버 시 서브메뉴(메가메뉴) 활성화
    item.addEventListener('mouseenter', () => {
      if (activeMenu && activeMenu !== item) {
        activeMenu.classList.remove('active');
      }
      item.classList.add('active');
      activeMenu = item;
    });
  });

  // 헤더 영역 밖으로 마우스를 빼면 서브메뉴 닫기
  const header = document.querySelector('.site-header');
  if (header) {
    document.addEventListener('mousemove', e => {
      if (!header.contains(e.target)) {
        if (activeMenu) {
          activeMenu.classList.remove('active');
          activeMenu = null;
        }
      }
    });
  }

  // 모바일 햄버거 메뉴
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('active');
    });
  }
}

// 검색 오버레이 + search.html 이동
function initSearchOverlay() {
  const searchOverlay = document.getElementById('searchOverlay');
  const searchToggle = document.querySelector('.btn-search-toggle');
  const searchClose = document.getElementById('searchOverlayClose');
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');

  if (!searchOverlay) return;

  if (searchToggle) {
    searchToggle.addEventListener('click', () => {
      searchOverlay.classList.add('active');
      if (searchInput) searchInput.focus();
    });
  }

  if (searchClose) {
    searchClose.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
    });
  }

  searchOverlay.addEventListener('click', e => {
    if (e.target === searchOverlay) {
      searchOverlay.classList.remove('active');
    }
  });

  if (searchForm) {
    searchForm.addEventListener('submit', e => {
      e.preventDefault();
      const q = searchInput ? searchInput.value.trim() : '';
      if (!q) return;
      window.location.href = 'search.html?q=' + encodeURIComponent(q);
    });
  }
}

// URL 쿼리 파싱
function getQueryParams() {
  const params = {};
  const qs = window.location.search.substring(1);
  if (!qs) return params;
  qs.split('&').forEach(pair => {
    const [key, value] = pair.split('=');
    if (!key) return;
    params[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
  });
  return params;
}

// Coming soon 페이지 초기화
function initComingSoonPage() {
  const csTitleEl = document.getElementById('cs-title');
  const csDescEl = document.getElementById('cs-desc');
  const csBodyEl = document.getElementById('cs-body');
  const csBgEl = document.getElementById('cs-hero-bg');
  if (!csTitleEl || !csDescEl || !csBodyEl || !csBgEl) return;

  const params = getQueryParams();
  const title = params.title || 'Coming soon';
  const category = params.category || 'general';

  csTitleEl.textContent = title;
  csDescEl.textContent = `${title}와(과) 관련된 Futec Solutions의 상세 정보는 준비 중입니다.`;

  csBgEl.classList.add('hero-' + category.replace(/[^a-z0-9_-]/gi, ''));

  csBodyEl.innerHTML =
    `현재 <strong>${escapeHtml(title)}</strong> 페이지는 준비 중입니다.<br>` +
    `곧 Futec Solutions의 솔루션, 아키텍처, 레퍼런스, 파트너 전략 등을 포함하여 업데이트될 예정입니다.`;
}

// 검색 페이지 초기화 (search.html)
function initSearchPage() {
  const queryTextEl = document.getElementById('search-query-text');
  const resultsEl = document.getElementById('search-results');
  if (!queryTextEl || !resultsEl) return;

  const params = getQueryParams();
  const q = (params.q || '').trim();
  if (!q) {
    queryTextEl.textContent = '검색어가 입력되지 않았습니다.';
    resultsEl.innerHTML = '<li>검색어를 입력한 후 다시 시도해 주세요.</li>';
    return;
  }

  queryTextEl.innerHTML = `<strong>"${escapeHtml(q)}"</strong>에 대한 검색 결과입니다.`;

  // 간단한 로컬 검색 데이터
  const pages = [
    {
      title: '비전',
      url: 'company-vision.html',
      keywords: '비전 vision 회사 소개 futec mission'
    },
    {
      title: '인사말',
      url: 'company-greeting.html',
      keywords: '인사 greeting 대표 메세지 ceo message'
    },
    {
      title: 'AI 영상분석 솔루션',
      url: 'coming-soon.html?category=ai-analytics&title=AI%20영상분석%20솔루션',
      keywords: 'AI 영상분석 solution 제품 analytics video'
    },
    {
      title: 'IT 인프라 솔루션',
      url: 'coming-soon.html?category=it-infra&title=IT%20인프라%20솔루션',
      keywords: 'IT 인프라 infra 서버 네트워크 스토리지'
    },
    {
      title: '개인정보처리지침',
      url: 'privacy-policy.html',
      keywords: '개인정보 privacy policy 약관'
    }
  ];

  const lowerQ = q.toLowerCase();
  let found = 0;
  resultsEl.innerHTML = '';

  pages.forEach(page => {
    if (
      page.title.toLowerCase().includes(lowerQ) ||
      page.keywords.toLowerCase().includes(lowerQ)
    ) {
      found++;
      const li = document.createElement('li');
      li.innerHTML = `<a href="${page.url}">${escapeHtml(page.title)}</a>`;
      resultsEl.appendChild(li);
    }
  });

  if (!found) {
    resultsEl.innerHTML = '<li>검색 결과가 없습니다. 다른 키워드로 다시 시도해 주세요.</li>';
  }
}

// XSS 방지용 escape
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
