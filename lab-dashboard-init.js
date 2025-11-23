// This is lab-dashboard-init.js (FIXED V4 - 50 Items & 3-way Toggle)
// Controller logic for the new LAB Dashboard (Mockup)

function initializeLabDashboard() {
    console.log("Initialize Lab Dashboard: STARTED V4");

    // --- DOM Elements ---
    const tbody = document.getElementById('tbody-lab-dash');
    const searchInput = document.getElementById('lab-dash-search');
    const filterStatus = document.getElementById('lab-dash-filter-status');
    const btnRefresh = document.getElementById('btn-refresh-lab-dash');
    
    // Pagination Elements
    const pageInfo = document.getElementById('lab-dash-page-info');
    const pagePrev = document.getElementById('btn-page-prev');
    const pageNext = document.getElementById('btn-page-next');
    
    // Date Picker Elements
    const btnCalendar = document.getElementById('btn-open-calendar');
    const btnGoToday = document.getElementById('btn-go-today');
    const mockDatePicker = document.getElementById('mock-date-picker');

    // Toggles
    const toggleDateColl = document.getElementById('toggle-date-coll');
    const toggleDateOrd = document.getElementById('toggle-date-ord');
    // Type Toggles (3 Buttons)
    const toggleTypeAll = document.getElementById('toggle-type-all');
    const toggleTypeLis = document.getElementById('toggle-type-lis');
    const toggleTypePath = document.getElementById('toggle-type-path');

    // --- State ---
    let currentPage = 1;
    const itemsPerPage = 50; // CHANGED: 20 -> 50 items
    let currentTypeFilter = 'All'; // Default All

    // --- Helper Functions ---
    function getStatusBadge(status) {
        if (status === 'Pending') return `<span class="px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-200">Pending</span>`;
        if (status === 'Done') return `<span class="px-2 py-0.5 rounded text-xs bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/50 dark:text-green-200">Done</span>`;
        return `<span class="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-700 dark:text-gray-300">Cancel</span>`;
    }

    function getLabBadge(status) {
        if (!status || status === '-') return `<span class="text-gray-300">-</span>`;
        if (['Reported', 'Completed'].includes(status)) return `<span class="text-xs text-green-600 font-bold flex justify-center items-center"><i data-lucide="check-circle" class="w-3 h-3 mr-1"></i>${status}</span>`;
        if (status === 'Cancel') return `<span class="text-xs text-red-600 font-bold flex justify-center items-center"><i data-lucide="x-circle" class="w-3 h-3 mr-1"></i>Cancel</span>`;
        return `<span class="text-xs text-blue-600 font-medium flex justify-center items-center"><i data-lucide="clock" class="w-3 h-3 mr-1"></i>${status}</span>`;
    }

    // --- Core Render Function ---
    function renderTable() {
        try {
            if (!tbody || typeof window.labDashboardData === 'undefined') {
                console.warn("Data or Table Body not found");
                return;
            }

            // 1. Filter Data
            let filtered = [...window.labDashboardData];
            
            // 1.1 Type Filter
            if (currentTypeFilter === 'LIS') {
                filtered = filtered.filter(item => item.type === 'LIS');
            } else if (currentTypeFilter === 'Pathology') {
                filtered = filtered.filter(item => item.type === 'Pathology');
            }

            // 1.2 Status Filter
            if (filterStatus && filterStatus.value !== 'All') {
                filtered = filtered.filter(item => item.order_status === filterStatus.value);
            }
            
            // 1.3 Search Filter
            if (searchInput && searchInput.value.trim() !== "") {
                const term = searchInput.value.toLowerCase().trim();
                filtered = filtered.filter(item => 
                    (item.patient_info && item.patient_info.hn.toLowerCase().includes(term)) || 
                    (item.patient_info && item.patient_info.name.toLowerCase().includes(term)) ||
                    item.order_no.toLowerCase().includes(term) ||
                    item.acc_no.toLowerCase().includes(term)
                );
            }

            // 2. Pagination Logic
            const totalItems = filtered.length;
            const totalPages = Math.ceil(totalItems / itemsPerPage);
            
            if (currentPage > totalPages) currentPage = totalPages || 1;
            
            const startIdx = (currentPage - 1) * itemsPerPage;
            const endIdx = Math.min(startIdx + itemsPerPage, totalItems);
            const pageData = filtered.slice(startIdx, endIdx);

            // Update Pagination UI
            if (pageInfo) {
                const displayTotal = (searchInput.value === "" && filterStatus.value === "All" && currentTypeFilter === 'All') ? 462 : totalItems;
                const startNum = totalItems > 0 ? startIdx + 1 : 0;
                pageInfo.innerHTML = `Showing ${startNum}-${endIdx} of ${displayTotal}`;
            }
            
            if (pagePrev) pagePrev.disabled = currentPage === 1;
            if (pageNext) pageNext.disabled = currentPage >= totalPages && (searchInput.value !== "" || filterStatus.value !== "All" || currentTypeFilter !== 'All');

            // 3. Generate HTML Rows
            tbody.innerHTML = '';
            
            if (pageData.length === 0) {
                tbody.innerHTML = `<tr><td colspan="16" class="p-8 text-center text-gray-400 italic">No records found match your criteria.</td></tr>`;
                return;
            }

            let rowsHTML = '';
            pageData.forEach(item => {
                const rowClass = item.order_status === 'Disable' ? 'bg-gray-50 opacity-70' : 'hover:bg-gray-50 dark:hover:bg-[--color-bg-secondary]';
                const wrapStyle = 'white-space: normal; word-wrap: break-word; min-width: 150px; max-width: 250px;';
                const noteStyle = 'white-space: normal; word-wrap: break-word; min-width: 120px; max-width: 200px; font-size: 0.75rem; color: var(--color-text-muted);';

                rowsHTML += `
                    <tr class="${rowClass} border-b border-gray-100 dark:border-[var(--color-border-base)] transition-colors">
                        <td class="p-3 sticky left-0 bg-white dark:bg-[var(--color-bg-content)] shadow-sm border-r border-gray-100 dark:border-[var(--color-border-base)] z-20 whitespace-nowrap text-xs font-medium">
                            ${item.collected_time}
                        </td>
                        <td class="p-3 text-xs font-mono text-gray-500 whitespace-nowrap">${item.order_no}</td>
                        <td class="p-3 text-xs font-mono font-bold text-indigo-600 whitespace-nowrap">${item.acc_no}</td>
                        <td class="p-3 text-xs whitespace-nowrap">
                            <div class="font-bold text-gray-800 dark:text-[--color-text-base]">${item.patient_info.name}</div>
                            <div class="text-[10px] text-gray-500">HN:${item.patient_info.hn} | ${item.patient_info.owner}</div>
                        </td>
                        <td class="p-3 text-xs text-gray-700 dark:text-[--color-text-base]" style="${wrapStyle}">
                            ${item.tests_detail}
                        </td>
                        <td class="p-3" style="${noteStyle}">
                            ${item.note}
                        </td>
                        <td class="p-3" style="${noteStyle}">
                            <span class="text-indigo-600 dark:text-indigo-400 font-medium">${item.order_note}</span>
                        </td>
                        <td class="p-3 text-xs whitespace-nowrap">${item.dvm}</td>
                        <td class="p-3 text-xs whitespace-nowrap">${item.dept}</td>
                        <td class="p-3 text-xs text-gray-500 whitespace-nowrap">${item.user_record}</td>
                        <td class="p-3 text-xs text-gray-400 whitespace-nowrap font-mono">${item.create_time}</td>
                        <td class="p-3 text-xs text-gray-500 whitespace-nowrap">${item.user_update}</td>
                        <td class="p-3 text-xs text-gray-400 whitespace-nowrap font-mono">${item.update_time}</td>
                        <td class="p-3 text-center whitespace-nowrap">${getStatusBadge(item.order_status)}</td>
                        <td class="p-3 text-center whitespace-nowrap">${getLabBadge(item.lab_status)}</td>
                        <td class="p-3 text-center sticky right-0 bg-white dark:bg-[var(--color-bg-content)] border-l border-gray-100 dark:border-[var(--color-border-base)] z-20 whitespace-nowrap">
                            <button class="p-1 text-gray-400 hover:text-indigo-600 transition-colors rounded hover:bg-gray-100 dark:hover:bg-[--color-bg-secondary]">
                                <i data-lucide="more-vertical" class="w-4 h-4"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });
            
            tbody.innerHTML = rowsHTML;
            
            if (typeof lucide !== 'undefined') lucide.createIcons();

        } catch (err) {
            console.error("Render Table Error:", err);
        }
    }

    // --- Event Listeners ---
    
    if (btnCalendar && mockDatePicker) {
        btnCalendar.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof mockDatePicker.showPicker === 'function') mockDatePicker.showPicker();
            else { mockDatePicker.focus(); mockDatePicker.click(); }
        });
    }

    if (btnGoToday) {
        btnGoToday.addEventListener('click', () => renderTable());
    }

    if(btnRefresh) {
        btnRefresh.onclick = () => {
            const icon = btnRefresh.querySelector('i');
            icon.classList.add('animate-spin');
            setTimeout(() => { 
                if(window.labDashboardData) window.labDashboardData.sort(() => Math.random() - 0.5);
                renderTable(); 
                icon.classList.remove('animate-spin'); 
            }, 600);
        };
    }

    if(filterStatus) filterStatus.onchange = () => { currentPage = 1; renderTable(); };
    if(searchInput) searchInput.onkeyup = () => { currentPage = 1; renderTable(); };

    if (pagePrev) pagePrev.onclick = () => {
        if (currentPage > 1) { currentPage--; renderTable(); }
    };
    if (pageNext) pageNext.onclick = () => { currentPage++; renderTable(); };

    // Standard Toggle Logic (2 Buttons)
    const setupToggle2 = (btn1, btn2) => {
        if(!btn1 || !btn2) return;
        const activeClass = ['bg-white', 'dark:bg-[--color-bg-content]', 'text-indigo-600', 'dark:text-indigo-400', 'shadow-sm', 'font-bold'];
        const inactiveClass = ['text-gray-500', 'hover:text-gray-700', 'dark:text-[--color-text-muted]', 'dark:hover:text-[--color-text-base]', 'font-medium'];
        
        const setActive = (target, other) => {
            target.classList.remove(...inactiveClass);
            target.classList.add(...activeClass);
            other.classList.remove(...activeClass);
            other.classList.add(...inactiveClass);
        };
        btn1.onclick = () => setActive(btn1, btn2);
        btn2.onclick = () => setActive(btn2, btn1);
    };
    setupToggle2(toggleDateColl, toggleDateOrd);

    // Type Toggle Logic (3 Buttons)
    const setupToggle3 = (allBtn, lisBtn, pathBtn) => {
        if(!allBtn || !lisBtn || !pathBtn) return;
        const activeClass = ['bg-white', 'dark:bg-[--color-bg-content]', 'text-indigo-600', 'dark:text-indigo-400', 'shadow-sm', 'font-bold'];
        const inactiveClass = ['text-gray-500', 'hover:text-gray-700', 'dark:text-[--color-text-muted]', 'dark:hover:text-[--color-text-base]', 'font-medium'];
        
        const buttons = [allBtn, lisBtn, pathBtn];
        
        const setActive = (target, type) => {
            // Reset all
            buttons.forEach(btn => {
                btn.classList.remove(...activeClass);
                btn.classList.add(...inactiveClass);
            });
            // Set active
            target.classList.remove(...inactiveClass);
            target.classList.add(...activeClass);
            
            currentTypeFilter = type;
            currentPage = 1;
            renderTable();
        };

        allBtn.onclick = () => setActive(allBtn, 'All');
        lisBtn.onclick = () => setActive(lisBtn, 'LIS');
        pathBtn.onclick = () => setActive(pathBtn, 'Pathology');
    };
    setupToggle3(toggleTypeAll, toggleTypeLis, toggleTypePath);

    // --- Initial Render ---
    renderTable();
}