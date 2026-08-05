import { getLastResult } from './storage.js';

let allColleges = [];
let filteredColleges = [];
let currentPage = 1;
const ITEMS_PER_PAGE = 20;
let activeQuickChance = 'all';

document.addEventListener('DOMContentLoaded', () => {
  const saved = getLastResult();
  if (!saved || !saved.result) {
    window.location.href = '/predict.html';
    return;
  }

  const { form, result } = saved;
  allColleges = result.colleges || [];
  const filtersMeta = result.filters_meta || {};

  // Setup Header Stats
  const statPct = document.getElementById('statPercentile');
  const statCat = document.getElementById('statCategory');
  const statTot = document.getElementById('statTotal');
  const statBrk = document.getElementById('statBreakdown');

  if (statPct) statPct.textContent = `${form.percentile}%`;
  if (statCat) statCat.textContent = `${form.category} (${form.cap_round})`;
  if (statTot) statTot.textContent = result.total;

  const safeCount = allColleges.filter(c => c.admission_chance === 'safe').length;
  const targetCount = allColleges.filter(c => c.admission_chance === 'target').length;
  const dreamCount = allColleges.filter(c => c.admission_chance === 'dream').length;
  if (statBrk) statBrk.textContent = `${safeCount} S / ${targetCount} T / ${dreamCount} D`;

  // Populate Filter Dropdowns
  const districtFilter = document.getElementById('districtFilter');
  const collegeTypeFilter = document.getElementById('collegeTypeFilter');
  const branchFilter = document.getElementById('branchFilter');

  if (filtersMeta.districts && districtFilter) {
    districtFilter.innerHTML = `<option value="All">All Districts</option>` +
      filtersMeta.districts.map(d => `<option value="${d}">${d}</option>`).join('');
  }
  if (filtersMeta.college_types && collegeTypeFilter) {
    collegeTypeFilter.innerHTML = `<option value="All">All Types</option>` +
      filtersMeta.college_types.map(t => `<option value="${t}">${t}</option>`).join('');
  }
  if (filtersMeta.branches && branchFilter) {
    branchFilter.innerHTML = `<option value="All">All Branches</option>` +
      filtersMeta.branches.map(b => `<option value="${b}">${b}</option>`).join('');
  }

  // Quick Chance Pill Buttons Handler (Mobile)
  document.querySelectorAll('.quick-pill-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.quick-pill-btn').forEach(b => {
        b.className = 'quick-pill-btn px-3 py-1.5 rounded-full text-xs font-bold bg-white text-secondary border border-outline-variant flex-shrink-0';
      });
      const target = e.currentTarget;
      target.className = 'quick-pill-btn active px-3 py-1.5 rounded-full text-xs font-bold bg-primary text-white flex-shrink-0 shadow-sm';
      activeQuickChance = target.getAttribute('data-chance');
      applyFilters();
    });
  });

  // Mobile Filter Drawer Toggle & Apply
  const toggleMobileFiltersBtn = document.getElementById('toggleMobileFiltersBtn');
  const applyMobileFiltersBtn = document.getElementById('applyMobileFiltersBtn');
  const filtersSidebar = document.getElementById('filtersSidebar');

  toggleMobileFiltersBtn?.addEventListener('click', () => {
    if (filtersSidebar) {
      filtersSidebar.classList.toggle('hidden');
      if (!filtersSidebar.classList.contains('hidden')) {
        filtersSidebar.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  applyMobileFiltersBtn?.addEventListener('click', () => {
    applyFilters();
    if (filtersSidebar) {
      filtersSidebar.classList.add('hidden');
    }
    const mobileList = document.getElementById('mobileCollegesList');
    if (mobileList) {
      mobileList.scrollIntoView({ behavior: 'smooth' });
    }
  });

  // Search Input Listeners (Mobile & Desktop Sync)
  const mobileSearch = document.getElementById('mobileSearchInput');
  const desktopSearch = document.getElementById('desktopSearchInput');

  mobileSearch?.addEventListener('input', (e) => {
    if (desktopSearch) desktopSearch.value = e.target.value;
    applyFilters();
  });

  desktopSearch?.addEventListener('input', (e) => {
    if (mobileSearch) mobileSearch.value = e.target.value;
    applyFilters();
  });

  document.getElementById('sortSelect')?.addEventListener('change', applyFilters);
  districtFilter?.addEventListener('change', applyFilters);
  collegeTypeFilter?.addEventListener('change', applyFilters);
  branchFilter?.addEventListener('change', applyFilters);

  document.querySelectorAll('.chance-checkbox').forEach(cb => {
    cb.addEventListener('change', applyFilters);
  });

  document.getElementById('resetFiltersBtn')?.addEventListener('click', () => {
    if (mobileSearch) mobileSearch.value = '';
    if (desktopSearch) desktopSearch.value = '';
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'chance';
    if (districtFilter) districtFilter.value = 'All';
    if (collegeTypeFilter) collegeTypeFilter.value = 'All';
    if (branchFilter) branchFilter.value = 'All';
    document.querySelectorAll('.chance-checkbox').forEach(cb => cb.checked = true);
    activeQuickChance = 'all';
    applyFilters();
  });

  // Export PDF Handlers
  const exportPdfBtn = document.getElementById('exportPdfBtn');
  const mobileFabPdf = document.getElementById('mobileFabPdf');

  const triggerPdf = () => {
    const pdfDateEl = document.getElementById('pdfPrintDate');
    if (pdfDateEl) {
      pdfDateEl.textContent = new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' });
    }
    window.print();
  };

  exportPdfBtn?.addEventListener('click', triggerPdf);
  mobileFabPdf?.addEventListener('click', triggerPdf);

  // Temporarily render all rows when printing to PDF
  window.addEventListener('beforeprint', () => {
    renderDesktopTableForPrint();
  });

  window.addEventListener('afterprint', () => {
    renderTable();
  });

  applyFilters();
});

function applyFilters() {
  const mobileSearch = document.getElementById('mobileSearchInput');
  const desktopSearch = document.getElementById('desktopSearchInput');
  const sortSelect = document.getElementById('sortSelect');
  const districtFilter = document.getElementById('districtFilter');
  const collegeTypeFilter = document.getElementById('collegeTypeFilter');
  const branchFilter = document.getElementById('branchFilter');

  const search = (mobileSearch?.value || desktopSearch?.value || '').toLowerCase().trim();
  const district = districtFilter ? districtFilter.value : 'All';
  const collegeType = collegeTypeFilter ? collegeTypeFilter.value : 'All';
  const branch = branchFilter ? branchFilter.value : 'All';

  const selectedChances = Array.from(document.querySelectorAll('.chance-checkbox:checked')).map(cb => cb.value);

  filteredColleges = allColleges.filter(c => {
    // Quick chance pill filter check
    if (activeQuickChance !== 'all' && c.admission_chance !== activeQuickChance) {
      return false;
    }

    // Sidebar chance checkbox check
    if (selectedChances.length > 0 && !selectedChances.includes(c.admission_chance)) return false;

    if (district !== 'All' && c.district !== district && c.location !== district) return false;
    if (collegeType !== 'All' && c.college_type !== collegeType) return false;
    if (branch !== 'All' && c.branch !== branch) return false;

    if (search) {
      const matchName = (c.college_name || '').toLowerCase().includes(search);
      const matchCode = (c.institute_code || '').toLowerCase().includes(search);
      const matchBranch = (c.branch || '').toLowerCase().includes(search);
      const matchLoc = (c.location || '').toLowerCase().includes(search);
      if (!matchName && !matchCode && !matchBranch && !matchLoc) return false;
    }

    return true;
  });

  // Sorting
  const sortBy = sortSelect ? sortSelect.value : 'chance';
  filteredColleges.sort((a, b) => {
    if (sortBy === 'chance') {
      const rank = { safe: 1, target: 2, dream: 3 };
      return rank[a.admission_chance] - rank[b.admission_chance];
    } else if (sortBy === 'cutoff_desc') {
      return (b.cap_round_1_cutoff || 0) - (a.cap_round_1_cutoff || 0);
    } else if (sortBy === 'cutoff_asc') {
      return (a.cap_round_1_cutoff || 0) - (a.cap_round_1_cutoff || 0);
    } else if (sortBy === 'name') {
      return (a.college_name || '').localeCompare(b.college_name || '');
    }
    return 0;
  });

  currentPage = 1;
  renderTable();
}

function renderTable() {
  const total = filteredColleges.length;
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, total);
  const pageItems = filteredColleges.slice(startIdx, endIdx);

  const resultCountInfo = document.getElementById('resultCountInfo');
  if (resultCountInfo) {
    resultCountInfo.innerHTML = `
      <span>Showing ${total > 0 ? startIdx + 1 : 0}-${endIdx} of ${total} colleges</span>
      <span class="text-tertiary font-bold">${allColleges.length} Total Analyzed</span>
    `;
  }

  // 1. Render Desktop Table View
  const desktopBody = document.getElementById('collegesTableBody');
  if (desktopBody) {
    if (pageItems.length === 0) {
      desktopBody.innerHTML = `
        <tr>
          <td colspan="7" class="py-xl text-center text-secondary font-medium">
            No matching colleges found for the selected filters.
          </td>
        </tr>
      `;
    } else {
      desktopBody.innerHTML = pageItems.map(c => `
        <tr class="hover:bg-surface-container-low transition-colors border-b border-outline-variant/50">
          <td class="py-md px-md font-bold text-primary text-xs">${c.institute_code}</td>
          <td class="py-md px-md">
            <div class="font-bold text-on-surface text-xs max-w-xs">${c.college_name}</div>
            <div class="text-[11px] text-secondary flex items-center gap-xs mt-0.5">
              <span class="material-symbols-outlined text-[12px]">location_on</span>
              <span>${c.district || c.location}</span>
            </div>
          </td>
          <td class="py-md px-md font-medium text-on-surface text-xs">${c.branch}</td>
          <td class="py-md px-md text-center font-semibold text-xs ${c.r1_chance === 'safe' ? 'text-tertiary' : c.r1_chance === 'target' ? 'text-primary' : 'text-secondary'}">
            ${c.cap_round_1_cutoff ? c.cap_round_1_cutoff.toFixed(4) + '%' : 'N/A'}
          </td>
          <td class="py-md px-md text-center font-semibold text-xs ${c.r2_chance === 'safe' ? 'text-tertiary' : c.r2_chance === 'target' ? 'text-primary' : 'text-secondary'}">
            ${c.cap_round_2_cutoff ? c.cap_round_2_cutoff.toFixed(4) + '%' : 'N/A'}
          </td>
          <td class="py-md px-md text-center font-semibold text-xs ${c.r3_chance === 'safe' ? 'text-tertiary' : c.r3_chance === 'target' ? 'text-primary' : 'text-secondary'}">
            ${c.cap_round_3_cutoff ? c.cap_round_3_cutoff.toFixed(4) + '%' : 'N/A'}
          </td>
          <td class="py-md px-md text-center font-semibold text-xs ${c.r4_chance === 'safe' ? 'text-tertiary' : c.r4_chance === 'target' ? 'text-primary' : 'text-secondary'}">
            ${c.cap_round_4_cutoff ? c.cap_round_4_cutoff.toFixed(4) + '%' : 'N/A'}
          </td>
          <td class="py-md px-md text-center">
            <span class="px-2.5 py-1 rounded-full text-xs font-bold inline-block ${
              c.admission_chance === 'safe' ? 'badge-safe' :
              c.admission_chance === 'target' ? 'badge-target' : 'badge-dream'
            }">
              ${c.admission_chance === 'safe' ? '✓ Safe' : c.admission_chance === 'target' ? '◎ Target' : '★ Dream'}
            </span>
          </td>
        </tr>
      `).join('');
    }
  }

  // 2. Render World-Class Mobile Cards View
  const mobileContainer = document.getElementById('mobileCollegesList');
  if (mobileContainer) {
    if (pageItems.length === 0) {
      mobileContainer.innerHTML = `
        <div class="bg-white p-lg rounded-xl border border-outline-variant text-center text-secondary text-xs">
          No matching colleges found for your search filters.
        </div>
      `;
    } else {
      mobileContainer.innerHTML = pageItems.map(c => {
        const badgeClass = c.admission_chance === 'safe' ? 'badge-safe' :
                           c.admission_chance === 'target' ? 'badge-target' : 'badge-dream';
        const chanceLabel = c.admission_chance === 'safe' ? '✓ SAFE (High Odds)' :
                            c.admission_chance === 'target' ? '◎ TARGET (Good Odds)' : '★ DREAM';

        return `
          <div class="bg-white border border-outline-variant/80 rounded-xl p-3.5 shadow-sm space-y-2.5">
            <!-- Header Badges -->
            <div class="flex justify-between items-center text-[10px]">
              <span class="font-bold text-primary bg-primary-container/10 px-2 py-0.5 rounded border border-primary/20">CODE: ${c.institute_code}</span>
              <span class="font-bold px-2.5 py-0.5 rounded-full ${badgeClass}">${chanceLabel}</span>
            </div>

            <!-- College Name & Location -->
            <div>
              <h4 class="font-bold text-on-surface text-sm leading-snug">${c.college_name}</h4>
              <div class="flex items-center gap-1 text-[11px] text-secondary mt-1">
                <span class="material-symbols-outlined text-[13px] text-primary">location_on</span>
                <span class="font-medium">${c.district || c.location}</span>
              </div>
            </div>

            <!-- Branch -->
            <div class="bg-surface-container-low p-2 rounded-lg border border-outline-variant/50">
              <span class="text-[10px] text-secondary font-bold uppercase tracking-wider block">Branch</span>
              <span class="text-xs font-bold text-on-surface block mt-0.5 truncate">${c.branch}</span>
            </div>

            <!-- 4-Round Cutoff Pill Grid -->
            <div class="grid grid-cols-4 gap-1.5 pt-0.5">
              <div class="bg-surface-container-low p-1.5 rounded-lg text-center border border-outline-variant/40">
                <span class="text-[9px] text-secondary font-bold uppercase block">R1 Cutoff</span>
                <span class="text-xs font-bold ${c.r1_chance === 'safe' ? 'text-tertiary' : c.r1_chance === 'target' ? 'text-primary' : 'text-secondary'}">
                  ${c.cap_round_1_cutoff ? c.cap_round_1_cutoff.toFixed(2) + '%' : 'N/A'}
                </span>
              </div>
              <div class="bg-surface-container-low p-1.5 rounded-lg text-center border border-outline-variant/40">
                <span class="text-[9px] text-secondary font-bold uppercase block">R2 Cutoff</span>
                <span class="text-xs font-bold ${c.r2_chance === 'safe' ? 'text-tertiary' : c.r2_chance === 'target' ? 'text-primary' : 'text-secondary'}">
                  ${c.cap_round_2_cutoff ? c.cap_round_2_cutoff.toFixed(2) + '%' : 'N/A'}
                </span>
              </div>
              <div class="bg-surface-container-low p-1.5 rounded-lg text-center border border-outline-variant/40">
                <span class="text-[9px] text-secondary font-bold uppercase block">R3 Cutoff</span>
                <span class="text-xs font-bold ${c.r3_chance === 'safe' ? 'text-tertiary' : c.r3_chance === 'target' ? 'text-primary' : 'text-secondary'}">
                  ${c.cap_round_3_cutoff ? c.cap_round_3_cutoff.toFixed(2) + '%' : 'N/A'}
                </span>
              </div>
              <div class="bg-surface-container-low p-1.5 rounded-lg text-center border border-outline-variant/40">
                <span class="text-[9px] text-secondary font-bold uppercase block">R4 Cutoff</span>
                <span class="text-xs font-bold ${c.r4_chance === 'safe' ? 'text-tertiary' : c.r4_chance === 'target' ? 'text-primary' : 'text-secondary'}">
                  ${c.cap_round_4_cutoff ? c.cap_round_4_cutoff.toFixed(2) + '%' : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        `;

      }).join('');
    }
  }

  // 3. Render Pagination
  renderPagination(total);
}

function renderPagination(total) {
  const container = document.getElementById('paginationControls');
  if (!container) return;

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  if (totalPages <= 1) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <button id="prevPageBtn" ${currentPage === 1 ? 'disabled' : ''} class="px-md py-sm rounded-lg border border-outline-variant bg-white text-xs font-bold text-secondary disabled:opacity-40 hover:bg-surface-container-low transition-colors shadow-sm">
      ← Prev
    </button>
    <span class="text-xs text-secondary font-bold">Page ${currentPage} of ${totalPages}</span>
    <button id="nextPageBtn" ${currentPage === totalPages ? 'disabled' : ''} class="px-md py-sm rounded-lg border border-outline-variant bg-white text-xs font-bold text-secondary disabled:opacity-40 hover:bg-surface-container-low transition-colors shadow-sm">
      Next →
    </button>
  `;

  document.getElementById('prevPageBtn')?.addEventListener('click', () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  document.getElementById('nextPageBtn')?.addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderTable();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

function renderDesktopTableForPrint() {
  const desktopBody = document.getElementById('collegesTableBody');
  if (!desktopBody) return;

  desktopBody.innerHTML = filteredColleges.map((c, idx) => `
    <tr class="border-b border-outline-variant/50">
      <td class="col-code py-1 px-1 font-bold text-primary text-[10px]">${c.institute_code}</td>
      <td class="col-name py-1 px-1 font-bold text-on-surface text-[10px]">${c.college_name} (${c.district || c.location})</td>
      <td class="col-branch py-1 px-1 font-medium text-on-surface text-[10px]">${c.branch}</td>
      <td class="col-r1 py-1 px-1 text-center text-[10px]">${c.cap_round_1_cutoff ? c.cap_round_1_cutoff.toFixed(2) + '%' : 'N/A'}</td>
      <td class="col-r2 py-1 px-1 text-center text-[10px]">${c.cap_round_2_cutoff ? c.cap_round_2_cutoff.toFixed(2) + '%' : 'N/A'}</td>
      <td class="col-r3 py-1 px-1 text-center text-[10px]">${c.cap_round_3_cutoff ? c.cap_round_3_cutoff.toFixed(2) + '%' : 'N/A'}</td>
      <td class="col-r4 py-1 px-1 text-center text-[10px]">${c.cap_round_4_cutoff ? c.cap_round_4_cutoff.toFixed(2) + '%' : 'N/A'}</td>
      <td class="col-chance py-1 px-1 text-center text-[10px] font-bold">${c.admission_chance.toUpperCase()}</td>
    </tr>
  `).join('');
}

