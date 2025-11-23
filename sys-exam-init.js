// This is sys-exam-init.js
// Controller logic for Systematic Examination Module

function initializeSysExam() {
    console.log("Initialize Sys Exam Module");

    // --- 1. Dropdown Logic (Placeholder Styling) ---
    const dropdowns = document.querySelectorAll('.sys-exam-select');
    dropdowns.forEach(select => {
        const updateColor = () => {
            if (select.value === "") {
                select.classList.add('text-gray-500', 'dark:text-[--color-text-muted]');
                select.classList.remove('text-gray-900', 'dark:text-[--color-text-base]');
            } else {
                select.classList.remove('text-gray-500', 'dark:text-[--color-text-muted]');
                select.classList.add('text-gray-900', 'dark:text-[--color-text-base]');
            }
        };
        updateColor();
        select.addEventListener('change', updateColor);
    });

    // --- 2. Copy Button Logic ---
    const copyBtn = document.getElementById('copy-sys-exam-btn');
    const contentBox = document.getElementById('sys-exam-read-only-content');
    
    if (copyBtn && contentBox) {
        copyBtn.addEventListener('click', () => {
            const textToCopy = contentBox.innerText; 
            if (typeof copyAndSparkle === 'function') {
                copyAndSparkle(copyBtn, textToCopy);
            } else {
                navigator.clipboard.writeText(textToCopy);
                alert("Copied!");
            }
        });
    }

    // --- 3. Eye Exam Button Logic ---
    const btnEye = document.getElementById('btn-open-eye-exam');
    if (btnEye) {
        btnEye.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof window.openEyeExamModal === 'function') {
                window.openEyeExamModal();
            } else {
                console.error("Error: openEyeExamModal function not found.");
            }
        });
    }

    // --- 4. History Table Logic ---
    const tableBody = document.getElementById('sys-exam-history-body');
    const headers = document.querySelectorAll('#sys-exam-history-table th[data-sort]');
    let currentSort = { column: 'datetime', direction: 'desc' };

    function renderTable() {
        if (!tableBody || typeof window.sysExamHistoryData === 'undefined') return;
        tableBody.innerHTML = '';
        const sortedData = [...window.sysExamHistoryData].sort((a, b) => {
            let valA = a[currentSort.column];
            let valB = b[currentSort.column];
            if (valA < valB) return currentSort.direction === 'asc' ? -1 : 1;
            if (valA > valB) return currentSort.direction === 'asc' ? 1 : -1;
            return 0;
        });
        const displayData = sortedData.slice(0, 50);

        displayData.forEach(item => {
            const row = document.createElement('tr');
            row.className = "hover:bg-gray-50 dark:hover:bg-[--color-bg-secondary] cursor-pointer transition-colors border-b border-gray-100 dark:border-[--color-border-base]";
            row.innerHTML = `
                <td class="p-3 text-xs whitespace-nowrap text-gray-700 dark:text-[--color-text-base] font-mono">${item.datetimeStr}</td>
                <td class="p-3 text-xs whitespace-nowrap text-gray-700 dark:text-[--color-text-base]">${item.dvm}</td>
                <td class="p-3 text-xs whitespace-nowrap text-gray-700 dark:text-[--color-text-base]">${item.department}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.sort;
            currentSort.direction = (currentSort.column === column && currentSort.direction === 'asc') ? 'desc' : 'asc';
            currentSort.column = column;
            
            headers.forEach(h => {
                h.classList.remove('sort-active', 'text-blue-600', 'dark:text-blue-400');
                const icon = h.querySelector('.sort-icon');
                if(icon) icon.setAttribute('data-lucide', 'arrow-up-down');
            });
            header.classList.add('sort-active', 'text-blue-600', 'dark:text-blue-400');
            header.querySelector('.sort-icon').setAttribute('data-lucide', currentSort.direction === 'asc' ? 'arrow-up' : 'arrow-down');
            
            renderTable();
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });
    });

    renderTable();
    if (typeof lucide !== 'undefined') lucide.createIcons();

    // --- 5. Navigation Scroll Logic (Improved: using offsetTop) ---
    const navBtns = document.querySelectorAll('.sys-nav-btn');
    const container = document.getElementById('sys-exam-content-container');

    if (navBtns.length > 0 && container) {
        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default anchor behavior
                
                // UI Active State
                navBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const targetId = btn.dataset.target;
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Use offsetTop relative to the scrolling container
                    // (Requires container to have position: relative, which we added)
                    const offsetTop = targetElement.offsetTop;
                    
                    container.scrollTo({
                        top: offsetTop - 20, // -20 for padding
                        behavior: 'smooth'
                    });
                } else {
                    console.warn("Target element not found:", targetId);
                }
            });
        });
    }
}