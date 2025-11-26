// This is app-logic.js (BETA 6.1 - Final Fix for Data Rewiring)

// =================================================================
// 1. DATA REWIRE ENGINE & NORMALIZER (BETA 6.1)
// รวมข้อมูลและ "ซ่อมแซม" โครงสร้างข้อมูลให้ตรงกับที่ App ต้องการ
// =================================================================

(function() {
    console.log(" [System] Starting Data Rewire (Beta 6.1)...");

    // A. รวบรวมข้อมูล (Safe Fallback)
    const vitals = window.vitalHistoryData || [];
    const eyes = window.eyeHistoryData || [];
    const labs = window.lisHistoryData || window.labHistoryData || [];
    const patho = window.pathoHistoryData || [];
    
    // B. Helper: Date Parser
    const parseSortDate = (item) => {
        if (item.raw_datetime) return new Date(item.raw_datetime);
        const dateStr = (item.effective_time || item.collected_time || item.order_create_date || "").replace(',', '');
        return new Date(dateStr);
    };

    // C. Data Normalizer (ตัวซ่อมข้อมูล)
    // เติม field ที่ขาดหายไปเพื่อให้ app-init.js ทำงานได้
    const normalizeItem = (item, defaultType) => {
        // 1. Map Type -> activity_type
        if (!item.activity_type) {
            item.activity_type = item.type || defaultType;
        }
        
        // 2. Map collected_time -> effective_time (สำหรับ Lab)
        if (!item.effective_time && item.collected_time) {
            item.effective_time = item.collected_time;
        }

        // 3. Set Default Status = 'Done' (ถ้าไม่มี)
        if (!item.order_status) {
            item.order_status = 'Done'; 
        }

        // 4. Ensure Parameters object
        if (!item.parameters) {
            item.parameters = {};
        }

        return item;
    };

    // D. Process & Merge
    const processedVitals = vitals.map(i => normalizeItem(i, 'Vital Signs'));
    const processedEyes = eyes.map(i => normalizeItem(i, 'Eye Exam'));
    const processedLabs = labs.map(i => normalizeItem(i, 'LIS'));
    const processedPatho = patho.map(i => normalizeItem(i, 'Pathology'));

    const aggregatedLogs = [...processedVitals, ...processedEyes, ...processedLabs, ...processedPatho];

    // E. Sort
    aggregatedLogs.sort((a, b) => parseSortDate(b) - parseSortDate(a));

    // F. Expose Global
    window.activityLogData = aggregatedLogs;
    
    // G. Polyfill for Lab Dashboard (Filter for dashboard view)
    window.labDashboardData = aggregatedLogs.filter(item => 
        item.activity_type === 'LIS' || item.activity_type === 'Lab' || item.activity_type === 'Pathology'
    ).map(item => ({
        ...item,
        type: (item.activity_type === 'LIS' || item.activity_type === 'Lab') ? 'LIS' : 'Pathology'
    }));

    // H. Map Patient Queue
    if (window.patientQueueData) {
        window.mockPatients = window.patientQueueData;
    }

    console.log(` [System] Rewire Complete: ${aggregatedLogs.length} items active.`);
})();

// =================================================================
// 2. APP LOGIC FUNCTIONS
// =================================================================

function renderEyeExamHistoryTable(data) {
    const tableBody = document.getElementById('eyeHistoryTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = '';
    
    if (data.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="25" class="p-4 text-center text-[var(--color-text-muted)]">No eye exam history found.</td></tr>`;
        return;
    }

    data.forEach(item => {
        const row = document.createElement('tr');
        row.classList.add('hover:bg-gray-50', 'dark:hover:bg-[--color-bg-secondary]/50');
        
        const imageUrl = item.imageUrl 
            ? `<img src="${item.imageUrl}" alt="Exam" class="history-thumbnail" data-full-src="${item.imageUrl}">`
            : '<span class="text-gray-300 text-xs">-</span>'; 

        const createTime = item.recorded_on ? item.recorded_on.split(',')[1] : '-';
        const updateTime = item.last_updated_on ? item.last_updated_on.split(',')[1] : '-';

        let statusBadge = '';
        if (item.order_status === 'Done') statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 border border-green-200">Done</span>`;
        else if (item.order_status === 'Pending') statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">Plan</span>`;
        else statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200">Cancel</span>`;

        row.innerHTML = `
            <td class="p-3 sticky left-0 bg-white dark:bg-[var(--color-bg-content)] text-[var(--color-text-base)] shadow-sm border-r border-gray-100 dark:border-[var(--color-border-base)] whitespace-nowrap">
                ${item.datetime}
            </td>
            <td class="p-3 text-[var(--color-text-base)]">${item.plr_od || '-'}</td>
            <td class="p-3 text-[var(--color-text-base)]">${item.plr_os || '-'}</td>
            <td class="p-3 text-[var(--color-text-base)]">${item.palpebral_od || '-'}</td>
            <td class="p-3 text-[var(--color-text-base)]">${item.palpebral_os || '-'}</td>
            <td class="p-3 text-[var(--color-text-base)]">${item.dazzle_od || '-'}</td>
            <td class="p-3 text-[var(--color-text-base)]">${item.dazzle_os || '-'}</td>
            <td class="p-3 text-[var(--color-text-base)]">${item.menace_od || '-'}</td>
            <td class="p-3 text-[var(--color-text-base)]">${item.menace_os || '-'}</td>
            <td class="p-3 text-[var(--color-text-base)]">${item.stt_od || '-'}</td>
            <td class="p-3 text-[var(--color-text-base)]">${item.stt_os || '-'}</td>
            <td class="p-3 text-[var(--color-text-base)]">${item.fluorescein_od || '-'}</td>
            <td class="p-3 text-[var(--color-text-base)]">${item.fluorescein_os || '-'}</td>
            <td class="p-3 text-[var(--color-text-base)]">${item.iop_od || '-'}</td>
            <td class="p-3 text-[var(--color-text-base)]">${item.iop_os || '-'}</td>
            <td class="p-3 text-center">${imageUrl}</td>
            <td class="text-[var(--color-text-muted)] p-3 whitespace-nowrap text-xs truncate max-w-[100px]" title="${item.note||''}">${item.note||'-'}</td>
            <td class="text-[var(--color-text-muted)] p-3 whitespace-nowrap text-xs truncate max-w-[100px]" title="${item.order_note||''}">${item.order_note||'-'}</td>
            <td class="p-3 text-[var(--color-text-base)] text-xs whitespace-nowrap">${item.dvm || '-'}</td>
            <td class="p-3 text-[var(--color-text-base)] text-xs whitespace-nowrap">${item.department || '-'}</td>
            <td class="p-3 text-[var(--color-text-base)] text-xs whitespace-nowrap">${item.recorded_by || '-'}</td>
            <td class="p-3 text-[var(--color-text-base)] text-xs text-gray-500 whitespace-nowrap">${createTime}</td>
            <td class="p-3 text-[var(--color-text-base)] text-xs whitespace-nowrap">${item.last_updated_by || '-'}</td>
            <td class="p-3 text-center text-xs text-gray-500 whitespace-nowrap">${updateTime}</td>
            <td class="p-3 text-center">${statusBadge}</td>
            <td class="p-3 text-center">
                <button class="p-1 text-[var(--color-text-muted)] hover:text-[var(--color-primary-500)] transition-colors" title="View/Edit">
                    <i data-lucide="more-vertical" class="w-4 h-4"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

async function loadModuleContent(contentFile) {
    const contentPlaceholder = document.getElementById('emr-content-placeholder');
    if (!contentPlaceholder) return;
    
    if (!contentFile || contentFile === 'undefined' || contentFile === '#') {
        contentPlaceholder.innerHTML = ''; 
        return;
    }

    let html = '';
    try {
        const response = await fetch('./' + contentFile); 
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        html = await response.text();
        contentPlaceholder.innerHTML = html;
    } catch (error) {
        console.error('Error during FETCH:', error);
        contentPlaceholder.innerHTML = `<p class="p-4 text-red-600">Error: Could not FETCH module (${contentFile})</p>`;
        return; 
    }

    try {
        if (contentFile === 'assessment_content.html') {
            initializeAssessmentScripts(); 
        } else if (contentFile === 'ext_doc_content.html') {
            initializeExtDocScripts();
        } else if (contentFile === 'extdoc_page_addnew.html') {
            initializeExtDocAddNewPage();
        } else if (contentFile === 'sys_exam_content.html') {
            if (typeof initializeSysExam === 'function') initializeSysExam();
        } else if (contentFile === 'order_pe_content.html') {
            initializeOrderPEScripts();
        } else if (contentFile === 'order_tx_content.html') {
            if (typeof initializeOrderTxScripts === 'function') initializeOrderTxScripts();
        } else if (contentFile === 'order_rx_content.html') {
            if (typeof initializeOrderRxScripts === 'function') initializeOrderRxScripts();
        } else if (contentFile === 'order_lis_content.html') {
            // *** FIX: เรียกชื่อฟังก์ชันให้ตรงกับใน app-init.js ***
            if (typeof initializeLabScripts === 'function') {
                initializeLabScripts(); 
            } else if (typeof initializeLisScripts === 'function') {
                initializeLisScripts(); // Fallback
            }
        } else if (contentFile === 'order_path_content.html') {
            initializePathologyScripts(); 
        } else if (contentFile === 'lab_viewer_content.html') {
            if (typeof initializeLabViewer === 'function') initializeLabViewer();
        } else if (contentFile === 'lab_dashboard_content.html') { 
            if (typeof initializeLabDashboard === 'function') initializeLabDashboard();
        }
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    } catch (initError) {
        console.error(`Error initialization:`, initError);
    }
}

function initializeTabSwitching() {
    const emrTabs = document.querySelectorAll('.emr-tab');
    emrTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const targetFile = this.dataset.target;
            loadModuleContent(targetFile);
            document.querySelectorAll('.emr-tab').forEach(t => {
                t.classList.remove('tab-active', 'dark:text-[--color-primary-500]', 'dark:border-[--color-primary-500]');
                t.classList.add('tab-inactive', 'dark:text-[--color-text-muted]');
            });
            this.classList.remove('tab-inactive', 'dark:text-[--color-text-muted]');
            this.classList.add('tab-active', 'dark:text-[--color-primary-500]', 'dark:border-[--color-primary-500]');
        });
    });
}

function initializeAssessmentScripts() {
    console.log("Initialize Assessment Scripts (Restored)");

    // 1. Copy Button Logic
    const setupCopyBtn = (btnId, contentId) => {
        const btn = document.getElementById(btnId);
        const content = document.getElementById(contentId);
        
        if (btn && content) {
            // Remove old listeners (clone) to prevent duplicates if re-initialized
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            
            newBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default
                const textToCopy = content.innerText;
                
                // Call Global Helper function
                if (typeof copyAndSparkle === 'function') {
                    copyAndSparkle(newBtn, textToCopy);
                } else {
                    console.warn("copyAndSparkle function not found.");
                    navigator.clipboard.writeText(textToCopy); // Fallback
                }
            });
        }
    };

    // Setup all 3 copy buttons
    setupCopyBtn('copy-assessment-note-btn', 'assessment-note-content');
    setupCopyBtn('copy-problem-list-btn', 'problem-list-content');
    setupCopyBtn('copy-diagnosis-btn', 'diagnosis-content');

    // 2. Problem List Modal Logic
    const openProblemListBtn = document.getElementById('open-problem-list-modal');
    const problemListModal = document.getElementById('problem-list-modal'); 
    if (openProblemListBtn && problemListModal) {
         openProblemListBtn.addEventListener('click', () => problemListModal.classList.remove('hidden'));
         
         const closeBtn = document.getElementById('problem-list-popup-close-x');
         if(closeBtn) closeBtn.addEventListener('click', () => problemListModal.classList.add('hidden'));
         
         const cancelBtn = document.getElementById('problem-list-popup-cancel');
         if(cancelBtn) cancelBtn.addEventListener('click', () => problemListModal.classList.add('hidden'));
    }
    
    // 3. History Table
    const assessmentHistoryTableBody = document.getElementById('assessment-history-table-body');
    if (assessmentHistoryTableBody && typeof assessmentHistoryData !== 'undefined') {
        assessmentHistoryTableBody.innerHTML = '';
        assessmentHistoryData.forEach(item => {
            const row = document.createElement('tr');
            row.className = "hover:bg-gray-50 dark:hover:bg-[--color-bg-secondary]/50 border-b border-gray-100 dark:border-[--color-border-base]";
            row.innerHTML = `
                <td class="p-3 text-gray-700 dark:text-[--color-text-base]">${item.datetimeStr}</td>
                <td class="p-3 text-gray-700 dark:text-[--color-text-base]">${item.dvm}</td>
                <td class="p-3 text-gray-700 dark:text-[--color-text-base]">${item.department}</td>
            `;
            assessmentHistoryTableBody.appendChild(row);
        });
    }
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}