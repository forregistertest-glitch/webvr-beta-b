// This is app-init.js (BETA 5.2 - Final Logic for Order Plan & Lab Viewer)

// --- Global Variables for Order Carts ---
let globalLisCart = [];
let globalPathCart = [];

function initializeApp() {

    initializeOrderPlanLogic();
    
    // 1. เริ่มต้นระบบพื้นฐาน
    if (typeof initializeTabSwitching === 'function') initializeTabSwitching();
    initializeVitalSignsSaveLogic();
    
    // 2. โหลดหน้าแรก
    const activeTab = document.querySelector('.emr-tab.tab-active');
    const initialContent = activeTab ? activeTab.dataset.target : 'assessment_content.html';
    if (typeof loadModuleContent === 'function') loadModuleContent(initialContent || 'assessment_content.html');
    
    // 3. จัดการ Theme
    const htmlRoot = document.documentElement; 
    const themeBtnLight = document.getElementById('theme-btn-light');
    const themeBtnDark = document.getElementById('theme-btn-dark');
    const goToTopBtn = document.getElementById('go-to-top-btn');

    function applyTheme(theme) {
        if (theme === 'dark') htmlRoot.classList.add('dark');
        else htmlRoot.classList.remove('dark');
        localStorage.setItem('theme', theme);
    }

    if (themeBtnLight) themeBtnLight.addEventListener('click', () => applyTheme('light'));
    if (themeBtnDark) themeBtnDark.addEventListener('click', () => applyTheme('dark'));
    
    const preference = localStorage.getItem('theme');
    applyTheme(preference || 'light');

    if (goToTopBtn) goToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    
    // 4. Menu Toggle
    const menuToggleBtn = document.getElementById('menu-toggle-btn');
    const actionMenu = document.getElementById('action-menu-container');
    const iconOpen = document.getElementById('menu-icon-open');
    const iconClose = document.getElementById('menu-icon-close');

    if (menuToggleBtn && actionMenu) {
        menuToggleBtn.addEventListener('click', () => {
            actionMenu.classList.toggle('active');
            if(iconOpen && iconClose) {
                iconOpen.classList.toggle('hidden');
                iconClose.classList.toggle('hidden');
            }
        });
    }

    // 5. Setup Modals
    const setupSimpleModal = (modalId, openBtnId, closeBtnIds) => {
        const modal = document.getElementById(modalId);
        const openBtn = document.getElementById(openBtnId);
        if (modal && openBtn) {
            const show = () => modal.classList.remove('hidden');
            const hide = () => modal.classList.add('hidden');
            openBtn.addEventListener('click', show);
            closeBtnIds.forEach(id => {
                const btn = document.getElementById(id);
                if (btn) btn.addEventListener('click', hide);
            });
            modal.addEventListener('click', (e) => { if (e.target === modal) hide(); });
        }
    };

    setupSimpleModal('df-popup-modal', 'open-df-popup-fab', ['df-popup-close-x', 'df-popup-cancel']);
    setupSimpleModal('tf-popup-modal', 'open-tf-popup-fab', ['tf-popup-close-x', 'tf-popup-cancel']);
    setupSimpleModal('path-popup-modal', 'open-path-popup-fab', ['close-path-popup-x', 'close-path-popup-cancel']);
    
    // Problem List Logic
    const plModal = document.getElementById('problem-list-modal');
    if (plModal) {
        const openPlBtn = document.getElementById('open-problem-list-modal');
        if(openPlBtn) openPlBtn.addEventListener('click', () => plModal.classList.remove('hidden'));
        ['problem-list-popup-close-x', 'problem-list-popup-cancel'].forEach(id => {
            document.getElementById(id)?.addEventListener('click', () => plModal.classList.add('hidden'));
        });
        
        const catList = document.getElementById('category-list');
        const resBody = document.getElementById('result-table-body');
        const resHeader = document.getElementById('result-header');

        if (catList && resBody) {
            const renderResults = (catId) => {
                const items = (typeof categoryData !== 'undefined') ? categoryData[catId] : [];
                resBody.innerHTML = '';
                if (!items || items.length === 0) {
                    resBody.innerHTML = '<tr><td colspan="3" class="p-3 text-center text-gray-500">No items found</td></tr>';
                } else {
                    items.forEach(item => {
                        resBody.innerHTML += `
                            <tr class="hover:bg-gray-50 dark:hover:bg-[var(--color-bg-secondary)]">
                                <td class="p-3 w-[10%]"><input type="checkbox" class="form-checkbox"></td>
                                <td class="p-3 w-[60%] text-gray-700 dark:text-[--color-text-base]">${item.term}</td>
                                <td class="p-3 w-[30%] text-xs text-gray-500 dark:text-[--color-text-muted]">${item.tags}</td>
                            </tr>`;
                    });
                }
                if (resHeader) resHeader.innerText = 'Result (0 selected)';
            };
            catList.addEventListener('click', (e) => {
                const li = e.target.closest('li[data-category-id]');
                if (li) {
                    catList.querySelectorAll('li').forEach(i => i.classList.remove('bg-gray-100', 'font-semibold', 'dark:bg-[rgba(139,125,107,0.15)]'));
                    li.classList.add('bg-gray-100', 'font-semibold', 'dark:bg-[rgba(139,125,107,0.15)]');
                    renderResults(li.dataset.categoryId);
                }
            });
            renderResults('common');
        }
    }

    // 6. Vital Signs Modal & Logic
    const vitalsModal = document.getElementById('vitals-popup-modal');
    if (vitalsModal) {
        const openBtn = document.getElementById('open-vitals-popup-fab');
        const closeX = document.getElementById('close-vitals-popup-x');
        const closeCancel = document.getElementById('close-vitals-popup-cancel');
        const tabLinks = vitalsModal.querySelectorAll('.vitals-tab-link');
        const tabContents = vitalsModal.querySelectorAll('.vitals-tab-content');
        const bpChartBtn = document.getElementById('bp-chart-btn');
        const vitalsChartBtn = document.getElementById('vitals-chart-btn');

        const showVitals = () => {
            vitalsModal.classList.remove('hidden');
            const filteredVitals = activityLogData.filter(entry => entry.activity_type === "Vital Signs" && entry.order_status === "Done");
            const mappedData = filteredVitals.map(entry => ({
                id: entry.entry_id,
                datetimeSort: new Date(entry.effective_time).toISOString(), 
                datetime: entry.effective_time.split(',')[0], 
                bp: entry.parameters.BP, pulse: entry.parameters.Pulse, hr: entry.parameters.HR, rr: entry.parameters.RR, temp: entry.parameters.Temp, fbs: entry.parameters.FBS, crt: entry.parameters.CRT, mucous: entry.parameters.MM, lung: entry.parameters.Lung, heart: entry.parameters.Heart, pulse_quality: entry.parameters.Pulse_Quality, loc: entry.parameters.LOC, pain: entry.parameters.Pain,
                cyanosis: (entry.parameters.Cyanosis === 'Yes'), seizure: (entry.parameters.Seizure === 'Yes'), arrest: (entry.parameters.Arrest === 'Yes'), note: entry.parameters.Note,
                dvm: entry.dvm, department: entry.department, recorded_by: entry.recorded_by, recorded_on: entry.order_create_date, last_updated_on: entry.last_updated_on
            }));
            renderVsHistoryTable(mappedData);
            if (typeof lucide !== 'undefined') lucide.createIcons();
        };
        
        const hideVitals = () => vitalsModal.classList.add('hidden');

        if(openBtn) openBtn.addEventListener('click', showVitals);
        if(closeX) closeX.addEventListener('click', hideVitals);
        if(closeCancel) closeCancel.addEventListener('click', hideVitals);
        vitalsModal.addEventListener('click', (e) => { if(e.target === vitalsModal) hideVitals(); });

        tabLinks.forEach(link => {
            link.addEventListener('click', () => {
                tabLinks.forEach(t => { t.classList.remove('tab-active'); t.classList.add('tab-inactive'); });
                link.classList.remove('tab-inactive'); link.classList.add('tab-active');
                tabContents.forEach(c => c.classList.add('hidden'));
                const target = vitalsModal.querySelector(`#content-${link.dataset.tab}`);
                if(target) target.classList.remove('hidden');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            });
        });

        if (bpChartBtn) bpChartBtn.addEventListener('click', () => {
            const data = activityLogData.filter(e => e.activity_type === "Vital Signs" && e.order_status === "Done").map(e => ({ datetimeSort: new Date(e.effective_time).toISOString(), datetime: e.effective_time, bp: e.parameters.BP, pulse: e.parameters.Pulse }));
            if (typeof openBpChart === 'function') openBpChart(data);
        });
        if (vitalsChartBtn) vitalsChartBtn.addEventListener('click', () => {
            const data = activityLogData.filter(e => e.activity_type === "Vital Signs" && e.order_status === "Done").map(e => ({ datetimeSort: new Date(e.effective_time).toISOString(), datetime: e.effective_time, pulse: e.parameters.Pulse, hr: e.parameters.HR, rr: e.parameters.RR, temp: e.parameters.Temp, fbs: e.parameters.FBS }));
            if (typeof openVitalsChart === 'function') openVitalsChart(data);
        });
    }

    // 7. Eye Exam Modal
    const eyeModal = document.getElementById('eye-exam-modal');
    if (eyeModal) {
        const openBtn = document.getElementById('open-eye-popup-fab');
        const closeX = document.getElementById('close-eye-popup-x');
        const closeCancel = document.getElementById('close-eye-popup-cancel');
        const tabLinks = eyeModal.querySelectorAll('.eye-tab-link');
        const tabContents = eyeModal.querySelectorAll('.eye-tab-content');
        const openDrawingBtn = document.getElementById('open-drawing-tool');

        const showEye = () => {
            eyeModal.classList.remove('hidden');
            const filteredEye = activityLogData.filter(entry => entry.activity_type === "Eye Exam" && entry.order_status === "Done");
            const mappedData = filteredEye.map(entry => ({
                datetimeSort: new Date(entry.effective_time).toISOString(),
                datetime: entry.effective_time.split(',')[0],
                plr_od: entry.parameters.plr_od, plr_os: entry.parameters.plr_os, palpebral_od: entry.parameters.palpebral_od, palpebral_os: entry.parameters.palpebral_os, dazzle_od: entry.parameters.dazzle_od, dazzle_os: entry.parameters.dazzle_os, menace_od: entry.parameters.menace_od, menace_os: entry.parameters.menace_os, stt_od: entry.parameters.stt_od, stt_os: entry.parameters.stt_os, iop_od: entry.parameters.iop_od, iop_os: entry.parameters.iop_os, fluorescein_od: entry.parameters.fluorescein_od, fluorescein_os: entry.parameters.fluorescein_os,
                imageUrl: (entry.parameters.Note) ? 'eyeexam.png' : null,
                dvm: entry.dvm, department: entry.department, recorded_by: entry.recorded_by, recorded_on: entry.order_create_date, last_updated_by: entry.last_updated_by, last_updated_on: entry.last_updated_on
            }));
            if (typeof renderEyeExamHistoryTable === 'function') renderEyeExamHistoryTable(mappedData);
            if (typeof lucide !== 'undefined') lucide.createIcons();
        };

        window.openEyeExamModal = showEye;

        const hideEye = () => eyeModal.classList.add('hidden');

        if(openBtn) openBtn.addEventListener('click', showEye);
        if(closeX) closeX.addEventListener('click', hideEye);
        if(closeCancel) closeCancel.addEventListener('click', hideEye);
        
        if(openDrawingBtn) openDrawingBtn.addEventListener('click', () => {
             const drawingModal = document.getElementById('drawing-demo-modal');
             if(drawingModal) {
                 drawingModal.classList.remove('hidden');
                 if (typeof initializeDrawingDemo === 'function') initializeDrawingDemo('eyeexam.png');
             }
        });

        tabLinks.forEach(link => {
            link.addEventListener('click', () => {
                tabLinks.forEach(t => { t.classList.remove('tab-active'); t.classList.add('tab-inactive'); });
                link.classList.remove('tab-inactive'); link.classList.add('tab-active');
                tabContents.forEach(c => c.classList.add('hidden'));
                const target = eyeModal.querySelector(`#content-${link.dataset.tab}`);
                if(target) target.classList.remove('hidden');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            });
        });
        // ... (ภายใน if (eyeModal) ...)
// ... (ต่อจาก tabLinks.forEach เดิม) ...

        // >>> REVISED EYE EXAM LOGIC START (Beta 5.6 Step 4) <<<
        const btnSavePlan = document.getElementById('btn-save-eye-plan');
        const btnConfirmDone = document.getElementById('btn-confirm-eye-done');
        
        // Init Default Time for Eye Modal inputs when opening
        if(openBtn) {
            openBtn.addEventListener('click', () => {
                const eyeDate = document.getElementById('eye-effective-date');
                const eyeTime = document.getElementById('eye-effective-time');
                if(eyeDate && eyeTime) {
                    const now = new Date();
                    eyeDate.value = now.toISOString().split('T')[0];
                    eyeTime.value = now.toTimeString().slice(0,5);
                }
            });
        }

        // Logic for "Save as Plan" -> Open Generic Plan Modal
        if(btnSavePlan) {
            btnSavePlan.onclick = () => {
                if (typeof window.openOrderPlanModal === 'function') {
                    window.openOrderPlanModal('Eye Exam', 'Plan: Eye Examination');
                } else {
                    console.error("Order Plan function not found");
                }
            };
        }
        
        // Logic for "Confirm & Done" -> Save Immediately
        if(btnConfirmDone) {
            btnConfirmDone.onclick = () => {
                // Gather Data form Inputs
                const effDate = document.getElementById('eye-effective-date')?.value;
                const effTime = document.getElementById('eye-effective-time')?.value;
                const note = document.getElementById('eye-note')?.value;
                const dvm = document.getElementById('eye-dvm')?.value;
                const dept = document.getElementById('eye-dept')?.value;

                if (!effDate || !effTime) return alert("Please select Effective Date/Time.");

                const now = new Date();
                const accNo = `EYE-${Date.now().toString().slice(-6)}`;
                const effectiveStr = formatKAHISDateTime(new Date(`${effDate}T${effTime}`));
                
                const newEntry = {
                    entry_id: `E-EYE-${Date.now()}`,
                    order_no: `ORD-EYE-${Date.now().toString().slice(-6)}`,
                    acc_no: accNo,
                    activity_type: "Eye Exam",
                    order_status: "Done",
                    lis_process_status: null,
                    hn: "52039575", pet_name: "คุณส้มจี๊ด(จี๊ดจ๊าด)", owner_name: "คุณพ่อส้มจี๊ด",
                    order_create_date: formatKAHISDateTime(now),
                    target_time: null,
                    effective_time: effectiveStr,
                    order_note: "", 
                    parameters: {
                        plr_od: document.getElementById('eye-plr-od')?.value || '',
                        plr_os: document.getElementById('eye-plr-os')?.value || '',
                        iop_od: document.getElementById('eye-iop-od')?.value || '',
                        iop_os: document.getElementById('eye-iop-os')?.value || '',
                        Note: note || "Exam findings recorded."
                    },
                    recorded_by: "User (Login)", dvm: dvm || "Dr. Eye", department: dept || "301",
                    last_updated_by: "User (Login)", last_updated_on: formatKAHISDateTime(now), disable_remark: ""
                };

                activityLogData.unshift(newEntry);
                alert(`Eye Exam Confirmed (Done)!\nAcc No: ${accNo}`);
                
                if(typeof renderEyeExamHistoryTable === 'function') showEye(); // Refresh history
                hideEye();
            };
        }
        // >>> REVISED EYE EXAM LOGIC END <<<
    }

    

    // 9. Utils (Numpad, Image Viewer)
    const numpadModal = document.getElementById('numpad-modal');
    if(numpadModal) {
        const inputs = document.querySelectorAll('input[data-numpad="true"]');
        inputs.forEach(inp => inp.addEventListener('click', (e) => {
            document.getElementById('numpad-target-id').value = e.target.id;
            numpadModal.classList.remove('hidden');
        }));
        numpadModal.addEventListener('click', (e) => {
            const btn = e.target.closest('.numpad-btn');
            if(btn) {
                const val = btn.dataset.value;
                const target = document.getElementById(document.getElementById('numpad-target-id').value);
                if(target) {
                    if(val === 'close') numpadModal.classList.add('hidden');
                    else if(val === 'clear') target.value = '';
                    else if(val === 'backspace') target.value = target.value.slice(0,-1);
                    else target.value += val;
                }
            } else if (e.target === numpadModal) numpadModal.classList.add('hidden');
        });
    }

    const imageModal = document.getElementById('image-viewer-modal');
    if(imageModal) {
        const closeImg = document.getElementById('close-image-viewer-x');
        if(closeImg) closeImg.addEventListener('click', () => imageModal.classList.add('hidden'));
        imageModal.addEventListener('click', (e) => { if(e.target === imageModal) imageModal.classList.add('hidden'); });
        document.body.addEventListener('click', (e) => {
            if(e.target.classList.contains('history-thumbnail')) {
                document.getElementById('full-image-viewer-src').src = e.target.dataset.fullSrc;
                imageModal.classList.remove('hidden');
            }
        });
    }
    
    const drawingModal = document.getElementById('drawing-demo-modal');
    if(drawingModal) {
        const closeD = document.getElementById('close-drawing-demo-x');
        const cancelD = document.getElementById('drawing-demo-cancel');
        const saveD = document.getElementById('drawing-demo-save');
        if(closeD) closeD.addEventListener('click', () => drawingModal.classList.add('hidden'));
        if(cancelD) cancelD.addEventListener('click', () => drawingModal.classList.add('hidden'));
        if(saveD) saveD.addEventListener('click', () => {
            if(typeof fabricCanvas !== 'undefined') drawingModal.classList.add('hidden');
        });
    }

// 10. Helper Render VS History (Final Layout)
    const vsTableBody = document.getElementById('historyTableBody');
    const vsNoMsg = document.getElementById('noHistoryMessage');
    
    function renderVsHistoryTable(data) {
        if(!vsTableBody) return;
        vsTableBody.innerHTML = '';
        
        const vsData = activityLogData.filter(item => item.activity_type === "Vital Signs" && item.order_status === "Done");
        
        if(vsData.length === 0) {
            if(vsNoMsg) vsNoMsg.classList.remove('hidden');
            vsTableBody.parentNode.classList.add('hidden');
            return;
        }
        if(vsNoMsg) vsNoMsg.classList.add('hidden');
        vsTableBody.parentNode.classList.remove('hidden');

        vsData.sort((a, b) => new Date(b.effective_time) - new Date(a.effective_time));

        vsData.forEach(item => {
            const effTime = item.effective_time || '-';
            const createTime = item.order_create_date ? item.order_create_date.split(',')[1] : '-';
            const updateTime = item.last_updated_on ? item.last_updated_on.split(',')[1] : '-';
            const p = item.parameters || {};

            // Status Badge
            let statusBadge = '';
            if (item.order_status === 'Done') statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800 border border-green-200">Done</span>`;
            else if (item.order_status === 'Pending') statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-100 text-yellow-800 border border-yellow-200">Plan</span>`;
            else statusBadge = `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200">Cancel</span>`;

            const row = document.createElement('tr');
            row.className = "hover:bg-gray-50 dark:hover:bg-[var(--color-bg-secondary)]";
            row.innerHTML = `
                <td class="sticky left-0 bg-white dark:bg-[var(--color-bg-content)] text-[var(--color-text-base)] p-3 shadow-sm font-semibold whitespace-nowrap border-r border-gray-100">
                    ${effTime}
                </td>
                <td class="text-[var(--color-text-base)] p-3">${p.Temp||''}</td>
                <td class="text-[var(--color-text-base)] p-3">${p.RR||''}</td>
                <td class="text-[var(--color-text-base)] p-3">${p.HR||''}</td>
                <td class="text-[var(--color-text-base)] p-3 font-medium text-blue-600">${p.BP||''}</td>
                <td class="text-[var(--color-text-base)] p-3">${p.Pulse||''}</td>
                <td class="text-[var(--color-text-base)] p-3">${p.CRT||''}</td>
                <td class="text-[var(--color-text-base)] p-3">${p.FBS||''}</td>
                <td class="text-[var(--color-text-base)] p-3">${p.MM||''}</td>
                <td class="text-[var(--color-text-base)] p-3">${p.Lung||''}</td>
                <td class="text-[var(--color-text-base)] p-3">${p.Heart||''}</td>
                <td class="text-[var(--color-text-base)] p-3">${p.Pulse_Quality||''}</td>
                <td class="text-[var(--color-text-base)] p-3">${p.LOC||''}</td>
                <td class="text-[var(--color-text-base)] p-3">${p.Pain||''}</td>
                <td class="text-center p-3">${p.Cyanosis==='Yes'?'<span class="text-red-500 font-bold">Y</span>':'-'}</td>
                <td class="text-center p-3">${p.Seizure==='Yes'?'<span class="text-red-500 font-bold">Y</span>':'-'}</td>
                <td class="text-center p-3">${p.Arrest==='Yes'?'<span class="text-red-500 font-bold">Y</span>':'-'}</td>
                
                <td class="text-[var(--color-text-muted)] p-3 whitespace-nowrap text-xs truncate max-w-[100px]" title="${p.Note||''}">${p.Note||'-'}</td>
                <td class="text-[var(--color-text-muted)] p-3 whitespace-nowrap text-xs truncate max-w-[100px]" title="${item.order_note||''}">${item.order_note||'-'}</td>
                <td class="text-[var(--color-text-base)] p-3 whitespace-nowrap text-xs">${item.dvm||''}</td>
                <td class="text-[var(--color-text-base)] p-3 whitespace-nowrap text-xs">${item.department||''}</td>
                <td class="text-[var(--color-text-base)] p-3 whitespace-nowrap text-xs">${item.recorded_by||''}</td>
                <td class="text-[var(--color-text-base)] p-3 whitespace-nowrap text-xs text-gray-500">${createTime}</td>
                <td class="text-[var(--color-text-base)] p-3 whitespace-nowrap text-xs text-gray-500">${item.last_updated_by||'-'}</td>
                <td class="text-[var(--color-text-base)] p-3 whitespace-nowrap text-xs text-gray-500">${updateTime}</td>
                <td class="p-3 text-center">${statusBadge}</td>
                <td class="p-3 text-center">
                    <button class="text-gray-400 hover:text-blue-600"><i data-lucide="file-edit" class="w-4 h-4"></i></button>
                </td>
            `;
            vsTableBody.appendChild(row);
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // 11. Helper Render LIS History
    const lisHistoryBody = document.getElementById('lisHistoryTableBody');
    const lisNoMsg = document.getElementById('noLisHistoryMessage');
    function renderLisHistoryTable(data) {
        if(!lisHistoryBody) return;
        lisHistoryBody.innerHTML = '';
        if(data.length === 0) {
            if(lisNoMsg) lisNoMsg.classList.remove('hidden');
            lisHistoryBody.parentNode.classList.add('hidden');
            return;
        }
        if(lisNoMsg) lisNoMsg.classList.add('hidden');
        lisHistoryBody.parentNode.classList.remove('hidden');

        data.forEach(item => {
            const tests = item.parameters.tests ? item.parameters.tests.join(', ') : '';
            const orderNo = item.order_no || '-';
            let statusBadge = '';
            if(item.order_status === 'Pending') statusBadge = '<span class="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200">Pending</span>';
            else if(item.order_status === 'Done') statusBadge = '<span class="px-2 py-1 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200">Sent</span>';
            else if(item.order_status === 'Disable') statusBadge = '<span class="px-2 py-1 rounded text-xs bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300">Cancelled</span>';

            const row = document.createElement('tr');
            row.className = "hover:bg-gray-50 dark:hover:bg-[var(--color-bg-secondary)]";
            row.innerHTML = `
                <td class="p-3 whitespace-nowrap sticky left-0 bg-white dark:bg-[var(--color-bg-content)] text-[var(--color-text-base)] shadow-sm">${item.effective_time.split(',')[0]}</td>
                <td class="p-3 whitespace-nowrap text-[var(--color-text-base)] font-mono text-xs">${orderNo}</td>
                <td class="p-3 whitespace-nowrap text-[var(--color-text-base)]">${tests}</td>
                <td class="p-3 whitespace-nowrap max-w-xs truncate text-[var(--color-text-muted)]" title="${item.order_note}">${item.order_note || '-'}</td>
                <td class="p-3 whitespace-nowrap text-[var(--color-text-base)]">${item.dvm}</td>
                <td class="p-3 whitespace-nowrap text-[var(--color-text-base)]">${item.department}</td>
                <td class="p-3 whitespace-nowrap text-[var(--color-text-base)]">${item.recorded_by}</td>
                <td class="p-3 whitespace-nowrap text-[var(--color-text-base)]">${item.order_create_date.split(',')[0]}</td>
                <td class="p-3 whitespace-nowrap text-[var(--color-text-base)]">${item.last_updated_on.split(',')[0]}</td>
                <td class="p-3 whitespace-nowrap text-center">${statusBadge}</td>
                <td class="p-3 whitespace-nowrap"><button class="text-[var(--color-text-muted)] hover:text-[var(--color-primary-500)]"><i data-lucide="more-vertical" class="w-4 h-4"></i></button></td>
            `;
            lisHistoryBody.appendChild(row);
        });
    }
}

// --- ORDER LOGIC: LAB (LIS) - Updated Beta 6.2 ---
function initializeLabScripts() {
    console.log("Initialize Lab Scripts (Beta 6.2)...");
    
    // IDs mapping matching order_lis_content.html
    const categoryList = document.getElementById('lis-category-list');
    const itemList = document.getElementById('lis-item-list');
    const currentCatName = document.getElementById('lis-current-cat-name');
    const cartBody = document.getElementById('lis-cart-body');
    const totalPriceEl = document.getElementById('lis-total-price');
    
    const btnSavePlan = document.getElementById('btn-save-lis-plan');
    const btnConfirm = document.getElementById('btn-confirm-lis-order');
    
    const inputEffectiveDate = document.getElementById('lis-effective-date');
    const inputEffectiveTime = document.getElementById('lis-effective-time');
    const inputNote = document.getElementById('lis-order-note');
    const checkFasting = document.getElementById('lis-fasting');

    // Views
    const lisFormView = document.getElementById('lis-form-view');
    const lisSummaryView = document.getElementById('lis-summary-view');
    const closeSummaryX = document.getElementById('close-lis-summary-x');

    // Set Default DateTime
    if (inputEffectiveDate && inputEffectiveTime) {
        const now = new Date();
        inputEffectiveDate.value = now.toISOString().split('T')[0];
        inputEffectiveTime.value = now.toTimeString().slice(0, 5);
    }

    // 1. Render Categories
    function renderLisCategories() {
        if (!categoryList) return;
        categoryList.innerHTML = '';
        
        Object.keys(labServiceCatalog).forEach(key => {
            const cat = labServiceCatalog[key];
            const li = document.createElement('li');
            li.className = "p-3 cursor-pointer hover:bg-pink-50 dark:hover:bg-[--color-bg-secondary] border-b border-gray-100 dark:border-[--color-border-base] flex items-center space-x-3 transition-colors last:border-0";
            li.innerHTML = `
                <div class="p-2 bg-white dark:bg-[--color-bg-base] rounded-full border border-gray-200 dark:border-[--color-border-base] shadow-sm text-pink-500">
                    <i data-lucide="${cat.icon}" class="w-4 h-4"></i>
                </div>
                <span class="font-medium text-gray-700 dark:text-[--color-text-base]">${cat.name}</span>
            `;
            
            li.addEventListener('click', () => {
                // Handle Active State
                Array.from(categoryList.children).forEach(c => {
                    c.classList.remove('bg-pink-50', 'dark:bg-pink-900/20', 'border-l-4', 'border-pink-500');
                    c.classList.add('border-transparent');
                });
                li.classList.remove('border-transparent');
                li.classList.add('bg-pink-50', 'dark:bg-pink-900/20', 'border-l-4', 'border-pink-500');
                
                renderLisItems(key);
            });
            categoryList.appendChild(li);
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // 2. Render Items
    function renderLisItems(catKey) {
        const cat = labServiceCatalog[catKey];
        if (!cat) return;
        
        if(currentCatName) currentCatName.innerText = cat.name;
        if(itemList) itemList.innerHTML = '';
        
        // Loop to populate items (Duplicate for demo if needed, here 3 times)
        const loopCount = cat.items.length < 10 ? 3 : 1; 
        for (let i = 0; i < loopCount; i++) {
            cat.items.forEach(item => {
                const li = document.createElement('li');
                li.className = "p-3 bg-white dark:bg-[--color-bg-content] border border-gray-200 dark:border-[--color-border-base] rounded-lg shadow-sm hover:shadow-md hover:border-pink-300 cursor-pointer transition-all flex justify-between items-center group mb-2";
                
                // Beta 6.2: Container = Gray/White
                const containerBadge = (item.container && item.container !== '-') 
                    ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-gray-500 text-white ml-2" title="Container">${item.container}</span>` 
                    : '';
                const unitBadge = item.used_unit 
                    ? `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200 ml-1 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600" title="Used Unit">${item.used_unit}</span>` 
                    : '';

                li.innerHTML = `
                    <div class="flex-1">
                        <div class="flex items-center">
                            <span class="font-semibold text-gray-800 dark:text-[--color-text-base] group-hover:text-pink-600 transition-colors text-sm">${item.name}</span>
                        </div>
                        <div class="text-xs text-gray-500 dark:text-[--color-text-muted] mt-1.5 flex items-center">
                            <span class="font-mono text-[10px] text-gray-400 mr-1">${item.id}</span>
                            ${containerBadge}
                            ${unitBadge}
                        </div>
                    </div>
                    <div class="text-sm font-bold text-pink-600 dark:text-pink-400 ml-2 whitespace-nowrap">${item.price}.-</div>`;
                
                li.addEventListener('click', () => addToLisCart(item));
                if(itemList) itemList.appendChild(li);
            });
        }
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // 3. Cart Logic
    function addToLisCart(item) {
        if (globalLisCart.find(i => i.id === item.id)) return;
        // Beta 6.2: Add default qty = 1
        globalLisCart.push({ ...item, qty: "1" });
        updateLisCartUI();
    }

    function updateLisCartUI() {
        if(!cartBody) return;
        cartBody.innerHTML = '';
        let total = 0;
        
        if (globalLisCart.length === 0) {
            cartBody.innerHTML = '<tr><td class="p-4 text-center text-gray-400 text-xs">No items selected</td></tr>';
            if(totalPriceEl) totalPriceEl.innerText = "0 / 0";
            return;
        }

        globalLisCart.forEach((item, index) => {
            total += item.price;
            
            const tr = document.createElement('tr');
            tr.className = "group hover:bg-gray-50 dark:hover:bg-[--color-bg-secondary] border-b border-gray-100 dark:border-[--color-border-base] last:border-0";
            
            // Refined 6.2: Split Layout (Name/Badge Left, Qty/Unit Right) + Black Unit
            tr.innerHTML = `
                <td class="p-2 pl-3 align-top w-full">
                    <div class="flex justify-between items-start">
                        <div class="flex flex-col mr-2">
                            <div class="font-semibold text-gray-800 dark:text-[--color-text-base] text-xs">
                                ${item.name}
                            </div>
                            ${(item.container && item.container !== '-') 
                                ? `<div class="mt-1"><span class="px-2 py-0.5 rounded text-[10px] bg-gray-500 text-white inline-block">${item.container}</span></div>` 
                                : ''}
                        </div>
                        
                        <div class="flex items-center gap-2 flex-shrink-0 mt-0.5">
                            <div class="relative">
                                <input type="text" readonly id="lis-qty-${index}" value="${item.qty}" 
                                       class="w-12 p-1 text-center text-xs border border-pink-300 rounded focus:ring-1 focus:ring-pink-500 focus:outline-none bg-white dark:bg-[--color-bg-base] dark:border-[--color-border-base] dark:text-[--color-text-base] cursor-default text-gray-500" 
                                       data-index="${index}">
                            </div>
                            <span class="text-xs text-black dark:text-[--color-text-base] font-medium w-8 text-left">${item.used_unit || ''}</span>
                        </div>
                    </div>
                </td>
                <td class="p-2 align-top text-right text-gray-600 dark:text-[--color-text-muted] text-xs font-bold whitespace-nowrap pt-3">
                    ${item.price}
                </td>
                <td class="p-2 align-top text-center w-8 pt-2">
                    <button class="text-gray-400 hover:text-red-600 transition-colors btn-remove-lis p-1 hover:bg-red-50 rounded" data-index="${index}">
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                    </button>
                </td>`;
            cartBody.appendChild(tr);
        });

        // Refined 6.2: Format "Count / Price"
        if(totalPriceEl) totalPriceEl.innerText = `${globalLisCart.length} / ${total.toLocaleString()}`;
        
        // Bind Remove Buttons
        document.querySelectorAll('.btn-remove-lis').forEach(btn => {
            btn.addEventListener('click', (e) => {
                globalLisCart.splice(parseInt(e.currentTarget.dataset.index), 1);
                updateLisCartUI();
            });
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // 4. Submission Logic
    function handleLisSubmission(actionType) {
        if (globalLisCart.length === 0) return alert("Please select at least one test.");
        
        const now = new Date();
        const orderNo = `ORD-LAB${now.getFullYear().toString().slice(-2)}${(Math.random() * 10000).toFixed(0).padStart(4, '0')}`;
        let orderStatus, lisStatus, accNo;
        
        if (actionType === 'plan') { 
            orderStatus = "Pending"; lisStatus = null; accNo = null; 
        } else { 
            orderStatus = "Done"; lisStatus = "Waiting"; 
            accNo = `LIS-${now.getFullYear().toString().slice(-2)}${(Math.random() * 10000).toFixed(0).padStart(4, '0')}`; 
        }

        let effectiveStr = formatKAHISDateTime(now);
        if (inputEffectiveDate && inputEffectiveTime && inputEffectiveDate.value && inputEffectiveTime.value) {
            const effDateObj = new Date(`${inputEffectiveDate.value}T${inputEffectiveTime.value}`);
            effectiveStr = formatKAHISDateTime(effDateObj);
        }
        
        const noteText = inputNote ? inputNote.value.trim() : "";
        const isFasted = checkFasting ? checkFasting.checked : false;
        const priority = document.querySelector('input[name="lis_priority"]:checked')?.value || 'Routine';

        const newEntry = {
            entry_id: `E-LAB-NEW-${Date.now()}`,
            order_no: orderNo,
            acc_no: accNo,
            activity_type: "LIS",
            order_status: orderStatus,
            lis_process_status: lisStatus,
            hn: "52039575", pet_name: "คุณส้มจี๊ด(จี๊ดจ๊าด)", owner_name: "คุณพ่อส้มจี๊ด",
            effective_time: effectiveStr,
            order_create_date: formatKAHISDateTime(now),
            order_update_date: formatKAHISDateTime(now),
            request_date: formatKAHISDateTime(now),
            order_note: noteText,
            parameters: { 
                tests: globalLisCart.map(i => i.id), 
                full_items: [...globalLisCart], 
                priority: priority, 
                fasting: isFasted, 
                note: noteText 
            },
            recorded_by: "User (Login)", dvm: "Dr. Login", department: "101",
            last_updated_by: "User (Login)", last_updated_on: formatKAHISDateTime(now), 
            disable_remark: ""
        };

        activityLogData.unshift(newEntry);

        if (actionType === 'send') {
            showSuccessModal(accNo, globalLisCart, totalPriceEl.innerText, { priority: priority, fasting: isFasted });
        } else {
            alert(`Order Plan Saved!\nOrder No: ${orderNo}\nStatus: Pending`);
        }
        
        // Success Action: Close form
        if(lisFormView && lisSummaryView) {
             lisFormView.classList.add('hidden');
             lisSummaryView.classList.remove('hidden');
        }
        
        globalLisCart = [];
        updateLisCartUI();
        if(inputNote) inputNote.value = "";
        if(checkFasting) checkFasting.checked = false;
        const routineRadio = document.getElementById('prio-routine');
        if(routineRadio) routineRadio.checked = true;
    }

    // 5. Bind Events
    if (btnSavePlan) btnSavePlan.onclick = (e) => { e.preventDefault(); handleLisSubmission('plan'); };
    if (btnConfirm) btnConfirm.onclick = (e) => { e.preventDefault(); handleLisSubmission('send'); };
    if (closeSummaryX) closeSummaryX.addEventListener('click', () => {
         if(typeof hideLis === 'function') hideLis(); // Helper if available or manual
         const modal = document.getElementById('lis-popup-modal');
         if(modal) modal.classList.add('hidden');
    });

    // --- INITIAL RENDER ---
    renderLisCategories();
    updateLisCartUI();
}

// --- UTILS ---
function formatKAHISDateTime(dateObj) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const d = String(dateObj.getDate()).padStart(2, '0');
    const m = monthNames[dateObj.getMonth()];
    const y = dateObj.getFullYear();
    const h = String(dateObj.getHours()).padStart(2, '0');
    const min = String(dateObj.getMinutes()).padStart(2, '0');
    const sec = String(dateObj.getSeconds()).padStart(2, '0');
    return `${d} ${m} ${y}, ${h}:${min}:${sec}`;
}

function initializeVitalSignsSaveLogic() {
    const saveButton = document.getElementById('btn-save-vitals');
    const vitalsModal = document.getElementById('vitals-popup-modal');
    if (!saveButton) return;

    saveButton.addEventListener('click', () => {
        const effectiveDate = document.getElementById('vs-effective-date').value;
        const effectiveTime = document.getElementById('vs-effective-time').value;
        const dvm = document.getElementById('vs-dvm').value;
        const department = document.getElementById('vs-department').value;
        
        if (!effectiveDate || !effectiveTime) {
            alert("Please select Effective Date and Time.");
            return;
        }

        const effectiveTimestamp = formatKAHISDateTime(new Date(`${effectiveDate}T${effectiveTime}`));
        const recordTimestamp = formatKAHISDateTime(new Date());
        
        const parameters = {
            Temp: document.getElementById('vs-temp').value || null,
            RR: document.getElementById('vs-rr').value || null,
            HR: document.getElementById('vs-hr').value || null,
            BP: document.getElementById('vs-bp').value || null,
            Pulse: document.getElementById('vs-pulse').value || null,
            CRT: document.getElementById('vs-crt').value || null,
            FBS: document.getElementById('vs-fbs').value || null,
            MM: document.getElementById('mucous-dropdown').value || null,
            Lung: document.getElementById('lung-dropdown').value || null,
            Heart: document.getElementById('heart-dropdown').value || null,
            Pulse_Quality: document.getElementById('pulse-quality-dropdown').value || null,
            LOC: document.getElementById('gcs-dropdown').value || null,
            Pain: document.getElementById('pain-score-dropdown').value || null,
            Cyanosis: document.getElementById('check-cyanosis').checked ? 'Yes' : 'No',
            Seizure: document.getElementById('check-seizure').checked ? 'Yes' : 'No',
            Arrest: document.getElementById('check-arrest').checked ? 'Yes' : 'No',
            Note: document.getElementById('system-review-notes').value || ""
        };

        const timestamp = Date.now();
        const newEntry = {
            entry_id: `E-${timestamp}`,
            order_no: `ORD-${timestamp}`, 
            acc_no: `VS-${timestamp}`,   
            activity_type: "Vital Signs",
            order_status: "Done", 
            effective_time: effectiveTimestamp, 
            target_time: null,
            order_note: "",
            parameters: parameters,
            recorded_by: "User (Login)", 
            recorded_on: recordTimestamp,
            dvm: dvm || null, 
            department: department, 
            last_updated_by: "User (Login)",
            last_updated_on: recordTimestamp, 
            disable_remark: ""
        };

        activityLogData.push(newEntry);
        alert("Vital Signs Saved!");
        document.querySelectorAll('#content-new-vitals input').forEach(i => i.value = '');
        document.querySelectorAll('#content-new-vitals select').forEach(s => s.selectedIndex = 0);
        document.querySelectorAll('#content-new-vitals textarea').forEach(t => t.value = '');
        document.querySelectorAll('#content-new-vitals input[type="checkbox"]').forEach(c => c.checked = false);
        vitalsModal.classList.add('hidden');
    });
}

// --- UNIVERSAL LAB VIEWER LOGIC (BETA 5.6 Revised 3 - Final) ---
function initializeLabViewer() {
    const lisTableBody = document.getElementById('tbody-labview-lis');
    const pathTableBody = document.getElementById('tbody-labview-path');
    const filterStatus = document.getElementById('lab-view-filter-status');
    const searchInput = document.getElementById('lab-view-search');
    const btnRefresh = document.getElementById('btn-refresh-lab-view');

    // Tab Elements
    const btnTabLis = document.getElementById('btn-tab-lis');
    const btnTabPath = document.getElementById('btn-tab-path');
    const viewLis = document.getElementById('view-container-lis');
    const viewPath = document.getElementById('view-container-path');

    // 1. Tab Switching Logic
    function switchTab(activeType) {
        if (activeType === 'LIS') {
            btnTabLis.className = "px-4 py-1.5 text-sm font-bold rounded-md shadow-sm bg-white text-pink-600 dark:bg-[--color-bg-content] dark:text-pink-400 transition-all flex items-center";
            btnTabPath.className = "px-4 py-1.5 text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 dark:text-[--color-text-muted] dark:hover:text-[--color-text-base] transition-all flex items-center";
            viewLis.classList.remove('hidden');
            viewPath.classList.add('hidden');
        } else {
            btnTabPath.className = "px-4 py-1.5 text-sm font-bold rounded-md shadow-sm bg-white text-fuchsia-600 dark:bg-[--color-bg-content] dark:text-fuchsia-400 transition-all flex items-center";
            btnTabLis.className = "px-4 py-1.5 text-sm font-medium rounded-md text-gray-500 hover:text-gray-700 dark:text-[--color-text-muted] dark:hover:text-[--color-text-base] transition-all flex items-center";
            viewPath.classList.remove('hidden');
            viewLis.classList.add('hidden');
        }
    }

    if(btnTabLis) btnTabLis.onclick = () => switchTab('LIS');
    if(btnTabPath) btnTabPath.onclick = () => switchTab('Path');

    // 2. Render Table Logic
    function renderLabViewTable() {
        if (!lisTableBody || !pathTableBody) return;

        // Filter Data
        let data = activityLogData.filter(item => item.activity_type === "LIS" || item.activity_type === "Pathology");
        
        // Status Filter
        if (filterStatus && filterStatus.value !== 'All') {
            data = data.filter(item => item.order_status === filterStatus.value);
        }
        
        // Search Filter
        if (searchInput && searchInput.value.trim() !== "") {
            const term = searchInput.value.toLowerCase().trim();
            data = data.filter(item => 
                (item.hn && item.hn.toLowerCase().includes(term)) || 
                (item.pet_name && item.pet_name.toLowerCase().includes(term)) ||
                (item.order_no && item.order_no.toLowerCase().includes(term)) ||
                (item.acc_no && item.acc_no.toLowerCase().includes(term))
            );
        }

        // Sort
        data.sort((a, b) => new Date(b.order_create_date) - new Date(a.order_create_date));

        lisTableBody.innerHTML = '';
        pathTableBody.innerHTML = '';

        if (data.length === 0) {
            const noData = `<tr><td colspan="15" class="p-8 text-center text-gray-400 italic">No orders found.</td></tr>`;
            lisTableBody.innerHTML = noData;
            pathTableBody.innerHTML = noData;
            return;
        }

        data.forEach(item => {
            // --- Badges ---
            const getStatusBadge = (status) => {
                if(status === 'Pending') return `<span class="px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800 border border-yellow-200">Plan</span>`;
                if(status === 'Done') return `<span class="px-2 py-0.5 rounded text-xs bg-green-100 text-green-800 border border-green-200">Sent</span>`;
                return `<span class="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 border border-gray-200">Cancel</span>`;
            };
            
            const getProcessBadge = (status) => {
                if (!status) return `<span class="text-gray-300">-</span>`;
                if(status === 'Waiting') return `<span class="text-xs text-gray-500 font-medium"><i data-lucide="clock" class="w-3 h-3 inline mr-1"></i>Wait</span>`;
                if(status === 'Accepted') return `<span class="text-xs text-blue-600 font-medium"><i data-lucide="check" class="w-3 h-3 inline mr-1"></i>Accept</span>`;
                if(status === 'Approved') return `<span class="text-xs text-purple-600 font-medium"><i data-lucide="user-check" class="w-3 h-3 inline mr-1"></i>Approve</span>`;
                if(status === 'Completed') return `<span class="text-xs text-green-600 font-medium"><i data-lucide="check-circle" class="w-3 h-3 inline mr-1"></i>Complete</span>`;
                if(status === 'Reported') return `<span class="text-xs text-green-700 font-bold"><i data-lucide="file-check" class="w-3 h-3 inline mr-1"></i>Report</span>`;
                if(status === 'Cancel') return `<span class="text-xs text-red-600 font-bold"><i data-lucide="x-circle" class="w-3 h-3 inline mr-1"></i>Cancel</span>`;
                return status;
            };

            // --- 3-Dot Action Menu Logic ---
            const canDisable = (item.lis_process_status === 'Waiting');
            const disableClass = canDisable ? 'text-red-600 hover:bg-red-50 cursor-pointer' : 'text-gray-300 cursor-not-allowed';
            const disableClick = canDisable ? `onclick="disableOrder('${item.entry_id}')"` : ''; 

            const actionMenu = `
                <div class="relative inline-block text-left group">
                    <button type="button" class="p-1 text-gray-400 hover:text-gray-600 focus:outline-none">
                        <i data-lucide="more-vertical" class="w-4 h-4"></i>
                    </button>
                    <div class="hidden group-hover:block absolute right-0 mt-0 w-32 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                        <div class="py-1">
                            <a href="#" class="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100">View Detail</a>
                            <a href="#" class="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100">Print Label</a>
                            <div class="border-t border-gray-100 my-1"></div>
                            <a href="#" ${disableClick} class="block px-4 py-2 text-xs ${disableClass}">Disable Order</a>
                        </div>
                    </div>
                </div>
            `;

            // --- Data Mapping ---
            const dateEff = item.effective_time ? item.effective_time.split(',')[0] : '-';
            const timeEff = item.effective_time ? item.effective_time.split(',')[1] : '-';
            const createTime = item.order_create_date ? item.order_create_date.split(',')[1] : '-';
            const updateTime = item.last_updated_on ? item.last_updated_on.split(',')[1] : '-';
            
            const rowClass = item.order_status === 'Disable' ? 'bg-gray-50 opacity-70' : 'hover:bg-gray-50';
            const textStyle = item.order_status === 'Disable' ? 'line-through text-gray-400' : 'text-gray-700 dark:text-[--color-text-base]';

            // --- LIS ROW ---
            if (item.activity_type === "LIS") {
                const tests = item.parameters.tests ? item.parameters.tests.join(', ') : '-';
                
                const row = `
                    <tr class="${rowClass} border-b border-gray-100 dark:border-[var(--color-border-base)]">
                        <td class="p-3 sticky left-0 bg-white dark:bg-[var(--color-bg-content)] shadow-sm border-r border-gray-100 text-xs">
                            <div class="font-bold">${dateEff}</div><div class="text-gray-400">${timeEff}</div>
                        </td>
                        <td class="p-3 font-mono text-xs text-gray-500">${item.order_no}</td>
                        <td class="p-3 font-mono text-xs font-bold text-blue-600">${item.acc_no || '-'}</td>
                        <td class="p-3 text-xs">
                            <div class="font-bold">${item.pet_name}</div>
                            <div class="text-[10px] text-gray-500">HN:${item.hn}</div>
                        </td>
                        <td class="p-3 text-xs ${textStyle} font-medium">${tests}</td>
                        <td class="p-3 text-xs text-gray-500 truncate max-w-[150px]" title="${item.order_note}">${item.order_note}</td>
                        <td class="p-3 text-xs">${item.dvm}</td>
                        <td class="p-3 text-xs">${item.department}</td>
                        <td class="p-3 text-xs">${item.recorded_by}</td>
                        <td class="p-3 text-xs text-gray-500">${createTime}</td>
                        <td class="p-3 text-xs text-gray-500">${item.last_updated_by || '-'}</td>
                        <td class="p-3 text-xs text-gray-500">${updateTime}</td>
                        <td class="p-3 text-center">${getStatusBadge(item.order_status)}</td>
                        <td class="p-3 text-center">${getProcessBadge(item.lis_process_status)}</td>
                        <td class="p-3 text-center sticky right-0 bg-white dark:bg-[var(--color-bg-content)] border-l border-gray-100 z-20">${actionMenu}</td>
                    </tr>
                `;
                lisTableBody.insertAdjacentHTML('beforeend', row);
            }
            
            // --- PATHOLOGY ROW ---
            else if (item.activity_type === "Pathology") {
                const itemsHtml = item.parameters.items ? item.parameters.items.map(i => `<div>• ${i.name} <span class="text-gray-400">(${i.site})</span></div>`).join('') : '-';
                
                const row = `
                    <tr class="${rowClass} border-b border-gray-100 dark:border-[var(--color-border-base)]">
                        <td class="p-3 sticky left-0 bg-white dark:bg-[var(--color-bg-content)] shadow-sm border-r border-gray-100 text-xs">
                            <div class="font-bold">${dateEff}</div><div class="text-gray-400">${timeEff}</div>
                        </td>
                        <td class="p-3 font-mono text-xs text-gray-500">${item.order_no}</td>
                        <td class="p-3 font-mono text-xs font-bold text-blue-600">${item.acc_no || '-'}</td>
                        <td class="p-3 text-xs">
                            <div class="font-bold">${item.pet_name}</div>
                            <div class="text-[10px] text-gray-500">HN:${item.hn}</div>
                        </td>
                        <td class="p-3 text-xs ${textStyle}">${itemsHtml}</td>
                        <td class="p-3 text-xs text-gray-500 truncate max-w-[150px]">${item.order_note}</td>
                        <td class="p-3 text-xs">${item.dvm}</td>
                        <td class="p-3 text-xs">${item.department}</td>
                        <td class="p-3 text-xs">${item.recorded_by}</td>
                        <td class="p-3 text-xs text-gray-500">${createTime}</td>
                        <td class="p-3 text-xs text-gray-500">${item.last_updated_by || '-'}</td>
                        <td class="p-3 text-xs text-gray-500">${updateTime}</td>
                        <td class="p-3 text-center">${getStatusBadge(item.order_status)}</td>
                        <td class="p-3 text-center">${getProcessBadge(item.lis_process_status)}</td>
                        <td class="p-3 text-center sticky right-0 bg-white dark:bg-[var(--color-bg-content)] border-l border-gray-100 z-20">${actionMenu}</td>
                    </tr>
                `;
                pathTableBody.insertAdjacentHTML('beforeend', row);
            }
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    if(filterStatus) filterStatus.addEventListener('change', renderLabViewTable);
    if(searchInput) searchInput.addEventListener('keyup', renderLabViewTable);
    if(btnRefresh) btnRefresh.addEventListener('click', () => {
        btnRefresh.querySelector('i').classList.add('animate-spin');
        setTimeout(() => { 
            renderLabViewTable(); 
            btnRefresh.querySelector('i').classList.remove('animate-spin'); 
        }, 500);
    });

    renderLabViewTable();
}

/// 8. LIS Modal Logic (Updated for Beta 6.2 - Standardized Cart)
    const lisModal = document.getElementById('lis-popup-modal');
    if (lisModal) {
        // Controls
        const openBtn = document.getElementById('open-lis-popup-fab');
        const closeX = document.getElementById('close-lis-popup-x');
        const closeCancel = document.getElementById('close-lis-popup-cancel');
        const tabLinks = lisModal.querySelectorAll('.lis-tab-link');
        const tabContents = lisModal.querySelectorAll('.lis-tab-content');
        
        // Form Elements
        const lisCategoryList = document.getElementById('lis-category-list');
        const lisItemList = document.getElementById('lis-item-list'); // New ID
        const currentCatName = document.getElementById('lis-current-cat-name');
        const cartBody = document.getElementById('lis-cart-body'); // New ID
        const totalPriceEl = document.getElementById('lis-total-price');
        const lisSaveBtn = document.getElementById('btn-save-lis');
        
        // Inputs
        const inputEffectiveDate = document.getElementById('lis-effective-date');
        const inputEffectiveTime = document.getElementById('lis-effective-time');
        const inputNote = document.getElementById('lis-order-note');
        const checkFasting = document.getElementById('lis-fasting');

        // Views
        const lisFormView = document.getElementById('lis-form-view');
        const lisSummaryView = document.getElementById('lis-summary-view');
        const closeSummaryX = document.getElementById('close-lis-summary-x');

        if (inputEffectiveDate && inputEffectiveTime) {
            const now = new Date();
            inputEffectiveDate.value = now.toISOString().split('T')[0];
            inputEffectiveTime.value = now.toTimeString().slice(0, 5);
        }

        // --- RENDER FUNCTIONS ---
        const renderLisCategories = () => {
            if (!lisCategoryList) return;
            lisCategoryList.innerHTML = '';
            
            Object.keys(labServiceCatalog).forEach(key => {
                const cat = labServiceCatalog[key];
                const li = document.createElement('li');
                li.className = "p-3 cursor-pointer hover:bg-pink-50 dark:hover:bg-[--color-bg-secondary] border-b border-gray-100 dark:border-[--color-border-base] flex items-center space-x-3 transition-colors last:border-0";
                li.innerHTML = `<div class="p-2 bg-white dark:bg-[--color-bg-base] rounded-full border border-gray-200 dark:border-[--color-border-base] shadow-sm text-pink-500"><i data-lucide="${cat.icon}" class="w-4 h-4"></i></div><span class="font-medium text-gray-700 dark:text-[--color-text-base]">${cat.name}</span>`;
                li.addEventListener('click', () => {
                    Array.from(lisCategoryList.children).forEach(c => {
                        c.classList.remove('bg-pink-50', 'dark:bg-pink-900/20', 'border-l-4', 'border-pink-500');
                        c.classList.add('border-transparent');
                    });
                    li.classList.remove('border-transparent');
                    li.classList.add('bg-pink-50', 'dark:bg-pink-900/20', 'border-l-4', 'border-pink-500');
                    renderLisItems(key);
                });
                lisCategoryList.appendChild(li);
            });
            if (typeof lucide !== 'undefined') lucide.createIcons();
        };

        const renderLisItems = (catKey) => {
            const cat = labServiceCatalog[catKey];
            if (!cat) return;
            currentCatName.innerText = cat.name;
            lisItemList.innerHTML = '';
            const loopCount = cat.items.length < 10 ? 3 : 1; 
            for (let i = 0; i < loopCount; i++) {
                cat.items.forEach(item => {
                    const li = document.createElement('li');
                    li.className = "p-3 bg-white dark:bg-[--color-bg-content] border border-gray-200 dark:border-[--color-border-base] rounded-lg shadow-sm hover:shadow-md hover:border-pink-300 cursor-pointer transition-all flex justify-between items-center group mb-2";
                    
                    // Refined 6.2: Container = Gray/White
                const containerBadge = (item.container && item.container !== '-') 
                    ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-gray-500 text-white ml-2" title="Container">${item.container}</span>` 
                    : '';
                    const unitBadge = item.used_unit 
                        ? `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200 ml-1 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600" title="Used Unit">${item.used_unit}</span>` 
                        : '';

                    li.innerHTML = `
                        <div class="flex-1">
                            <div class="flex items-center">
                                <span class="font-semibold text-gray-800 dark:text-[--color-text-base] group-hover:text-pink-600 transition-colors text-sm">${item.name}</span>
                            </div>
                            <div class="text-xs text-gray-500 dark:text-[--color-text-muted] mt-1.5 flex items-center">
                                <span class="font-mono text-[10px] text-gray-400 mr-1">${item.id}</span>
                                ${containerBadge}
                                ${unitBadge}
                            </div>
                        </div>
                        <div class="text-sm font-bold text-pink-600 dark:text-pink-400 ml-2 whitespace-nowrap">${item.price}.-</div>`;
                    li.addEventListener('click', () => addToLisCart(item));
                    lisItemList.appendChild(li);
                });
            }
            if (typeof lucide !== 'undefined') lucide.createIcons();
        };

        const addToLisCart = (item) => {
            if (globalLisCart.find(i => i.id === item.id)) return;
            // Beta 6.2: Add default qty = 1
            globalLisCart.push({ ...item, qty: "1" });
            updateLisCartUI();
        };

        const updateLisCartUI = () => {
            cartBody.innerHTML = '';
            let total = 0;
            if (globalLisCart.length === 0) {
                cartBody.innerHTML = '<tr><td class="p-4 text-center text-gray-400 text-xs">No items selected</td></tr>';
                totalPriceEl.innerText = "0 / 0";
                return;
            }
            globalLisCart.forEach((item, index) => {
                total += item.price;
                const tr = document.createElement('tr');
                tr.className = "group hover:bg-gray-50 dark:hover:bg-[--color-bg-secondary] border-b border-gray-100 dark:border-[--color-border-base] last:border-0";
                
                // Refined 6.2: Split Layout (Name/Badge Left, Qty/Unit Right) + Black Unit
                tr.innerHTML = `
                    <td class="p-2 pl-3 align-top w-full">
                        <div class="flex justify-between items-start">
                            <div class="flex flex-col mr-2">
                                <div class="font-semibold text-gray-800 dark:text-[--color-text-base] text-xs">
                                    ${item.name}
                                </div>
                                ${(item.container && item.container !== '-') 
                                    ? `<div class="mt-1"><span class="px-2 py-0.5 rounded text-[10px] bg-gray-500 text-white inline-block">${item.container}</span></div>` 
                                    : ''}
                            </div>
                            
                            <div class="flex items-center gap-2 flex-shrink-0 mt-0.5">
                                <div class="relative">
                                    <input type="text" readonly id="lis-qty-${index}" value="${item.qty}" 
                                           class="w-12 p-1 text-center text-xs border border-pink-300 rounded focus:ring-1 focus:ring-pink-500 focus:outline-none bg-white dark:bg-[--color-bg-base] dark:border-[--color-border-base] dark:text-[--color-text-base] cursor-default text-gray-500" 
                                           data-index="${index}">
                                </div>
                                <span class="text-xs text-black dark:text-[--color-text-base] font-medium w-8 text-left">${item.used_unit || ''}</span>
                            </div>
                        </div>
                    </td>
                    <td class="p-2 align-top text-right text-gray-600 dark:text-[--color-text-muted] text-xs font-bold whitespace-nowrap pt-3">
                        ${item.price}
                    </td>
                    <td class="p-2 align-top text-center w-8 pt-2">
                        <button class="text-gray-400 hover:text-red-600 transition-colors btn-remove-lis p-1 hover:bg-red-50 rounded" data-index="${index}">
                            <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                        </button>
                    </td>`;
                cartBody.appendChild(tr);
            });
            // Refined 6.2: Format "Count / Price"
        totalPriceEl.innerText = `${globalPathCart.length} / ${total.toLocaleString()}`;
            
            document.querySelectorAll('.btn-remove-lis').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    globalLisCart.splice(parseInt(e.currentTarget.dataset.index), 1);
                    updateLisCartUI();
                });
            });
            if (typeof lucide !== 'undefined') lucide.createIcons();
        };

        // --- MAIN LOGIC ---
        const showLis = () => {
            lisModal.classList.remove('hidden');
            lisFormView.classList.remove('hidden');
            lisSummaryView.classList.add('hidden');
            
            renderLisCategories();
            
            const firstCat = lisCategoryList.querySelector('li');
            if(firstCat) firstCat.click();

            const filteredLis = activityLogData.filter(entry => entry.activity_type === "LIS");
            renderLisHistoryTable(filteredLis);
            
            tabLinks.forEach(t => { t.classList.remove('tab-active'); t.classList.add('tab-inactive'); });
            const historyTab = lisModal.querySelector('.lis-tab-link[data-tab="lis-history"]');
            if(historyTab) { historyTab.classList.remove('tab-inactive'); historyTab.classList.add('tab-active'); }
            tabContents.forEach(c => c.classList.add('hidden'));
            const historyContent = lisModal.querySelector('#content-lis-history');
            if(historyContent) historyContent.classList.remove('hidden');
            
            if (typeof lucide !== 'undefined') lucide.createIcons();
        };
        
        const hideLis = () => lisModal.classList.add('hidden');

        // --- EVENTS ---
        if(openBtn) openBtn.addEventListener('click', showLis);
        if(closeX) closeX.addEventListener('click', hideLis);
        if(closeCancel) closeCancel.addEventListener('click', hideLis);
        
        if(lisSaveBtn) lisSaveBtn.addEventListener('click', () => {
            if(globalLisCart.length === 0) return alert("Please select at least one test.");
            
            const now = new Date();
            const orderNo = `ORD-LAB${now.getFullYear().toString().slice(-2)}${(Math.random() * 10000).toFixed(0).padStart(4, '0')}`;
            const accNo = `LIS-${now.getFullYear().toString().slice(-6)}${(Math.random() * 10000).toFixed(0).padStart(4, '0')}`;
            
            let effectiveStr = formatKAHISDateTime(now);
            if (inputEffectiveDate && inputEffectiveTime && inputEffectiveDate.value && inputEffectiveTime.value) {
                const effDateObj = new Date(`${inputEffectiveDate.value}T${inputEffectiveTime.value}`);
                effectiveStr = formatKAHISDateTime(effDateObj);
            }
            
            const noteText = inputNote ? inputNote.value.trim() : "";
            const isFasted = checkFasting ? checkFasting.checked : false;
            const priority = document.querySelector('input[name="lis_priority"]:checked')?.value || 'Routine';

            const newEntry = {
                entry_id: `E-LAB-NEW-${Date.now()}`,
                order_no: orderNo,
                acc_no: accNo,
                activity_type: "LIS",
                order_status: "Done",
                lis_process_status: "Waiting",
                hn: "52039575", pet_name: "คุณส้มจี๊ด(จี๊ดจ๊าด)", owner_name: "คุณพ่อส้มจี๊ด",
                effective_time: effectiveStr,
                order_create_date: formatKAHISDateTime(now),
                order_update_date: formatKAHISDateTime(now),
                request_date: formatKAHISDateTime(now),
                order_note: noteText,
                parameters: { 
                    tests: globalLisCart.map(i => i.id), 
                    full_items: [...globalLisCart],
                    priority: priority,
                    fasting: isFasted,
                    note: noteText 
                },
                recorded_by: "User (Login)", dvm: document.getElementById('lis-dvm').value, department: document.getElementById('lis-department').value,
                last_updated_by: "User (Login)", last_updated_on: formatKAHISDateTime(now), disable_remark: ""
            };
            activityLogData.unshift(newEntry);

            lisFormView.classList.add('hidden');
            lisSummaryView.classList.remove('hidden');
            
            // Clear
            globalLisCart = [];
            updateLisCartUI();
            if(inputNote) inputNote.value = '';
            if(checkFasting) checkFasting.checked = false;
            const routineRadio = document.getElementById('prio-routine');
            if(routineRadio) routineRadio.checked = true;
        });
        
        if(closeSummaryX) closeSummaryX.addEventListener('click', hideLis);

        tabLinks.forEach(link => {
            link.addEventListener('click', () => {
                tabLinks.forEach(t => { t.classList.remove('tab-active'); t.classList.add('tab-inactive'); });
                link.classList.remove('tab-inactive'); link.classList.add('tab-active');
                tabContents.forEach(c => c.classList.add('hidden'));
                const target = lisModal.querySelector(`#content-${link.dataset.tab}`);
                if(target) target.classList.remove('hidden');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            });
        });
    }

// --- ORDER LOGIC: PATHOLOGY (Updated Beta 6.2 - Standardized Cart) ---
function initializePathologyScripts() {
    const categoryList = document.getElementById('path-category-list');
    const itemList = document.getElementById('path-item-list');
    const selectedInfoBox = document.getElementById('path-selected-info');
    const selectedNameEl = document.getElementById('path-selected-name');
    const selectedCodeEl = document.getElementById('path-selected-code');
    const inputSite = document.getElementById('path-site');
    const inputHistory = document.getElementById('path-history'); 
    const btnAddToCart = document.getElementById('btn-add-path-cart');
    const miniCartList = document.getElementById('path-mini-cart');
    const totalPriceEl = document.getElementById('path-total-price');
    const btnSavePlan = document.getElementById('btn-save-path-plan');
    const btnConfirm = document.getElementById('btn-confirm-path-order');
    const inputEffectiveDate = document.getElementById('path-effective-date');
    const inputEffectiveTime = document.getElementById('path-effective-time');
    const inputOrderNote = document.getElementById('path-order-note'); 

    if (inputEffectiveDate && inputEffectiveTime) {
        const now = new Date();
        inputEffectiveDate.value = now.toISOString().split('T')[0];
        inputEffectiveTime.value = now.toTimeString().slice(0, 5);
    }
    let currentItem = null;

    function renderPathCategories() {
        if (!categoryList) return;
        categoryList.innerHTML = '';
        Object.keys(pathologyServiceCatalog).forEach(key => {
            const cat = pathologyServiceCatalog[key];
            const li = document.createElement('li');
            li.className = "p-3 cursor-pointer hover:bg-fuchsia-50 dark:hover:bg-[--color-bg-secondary] border-b border-gray-100 dark:border-[--color-border-base] flex items-center space-x-3 transition-colors last:border-0";
            li.innerHTML = `<div class="p-2 bg-white dark:bg-[--color-bg-base] rounded-full border border-gray-200 dark:border-[--color-border-base] shadow-sm text-fuchsia-600"><i data-lucide="${cat.icon}" class="w-4 h-4"></i></div><span class="font-medium text-gray-700 dark:text-[--color-text-base]">${cat.name}</span>`;
            li.addEventListener('click', () => {
                Array.from(categoryList.children).forEach(c => c.classList.remove('bg-fuchsia-50', 'dark:bg-fuchsia-900/20', 'border-l-4', 'border-fuchsia-500'));
                li.classList.add('bg-fuchsia-50', 'dark:bg-fuchsia-900/20', 'border-l-4', 'border-fuchsia-500');
                renderPathItems(key);
            });
            categoryList.appendChild(li);
        });
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function renderPathItems(catKey) {
        const cat = pathologyServiceCatalog[catKey];
        if (!cat) return;
        itemList.innerHTML = '';
        const loopCount = cat.items.length < 8 ? 3 : 1;
        for(let i=0; i<loopCount; i++) {
            cat.items.forEach(item => {
                const li = document.createElement('li');
                li.className = "p-3 bg-white dark:bg-[--color-bg-content] border border-gray-200 dark:border-[--color-border-base] rounded-lg shadow-sm hover:shadow-md hover:border-fuchsia-300 cursor-pointer transition-all flex justify-between items-center group mb-2";
                
                // Refined 6.2: Container Badge = Gray/White
                const containerBadge = (item.container && item.container !== '-') 
                    ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-gray-500 text-white ml-2" title="Container">${item.container}</span>` 
                    : '';
                const unitBadge = item.used_unit 
                    ? `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200 ml-1 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600" title="Used Unit">${item.used_unit}</span>` 
                    : '';

                li.innerHTML = `
                    <div class="flex-1">
                        <div class="flex items-center">
                            <span class="font-semibold text-gray-800 dark:text-[--color-text-base] group-hover:text-fuchsia-700 text-sm">${item.name}</span>
                        </div>
                        <div class="text-xs text-gray-500 dark:text-[--color-text-muted] mt-1.5 flex items-center">
                            ${(item.loinc) ? `<span class="text-[10px] mr-1">LOINC:${item.loinc}</span>` : ''}
                            ${containerBadge}
                            ${unitBadge}
                        </div>
                    </div>
                    <div class="text-sm font-bold text-fuchsia-600 dark:text-fuchsia-400 ml-2 whitespace-nowrap">${item.price}.-</div>`;
                li.addEventListener('click', () => selectItem(item));
                itemList.appendChild(li);
            });
        }
    }

    function selectItem(item) {
        currentItem = item;
        selectedInfoBox.classList.remove('hidden');
        selectedNameEl.innerText = item.name;
        selectedCodeEl.innerText = `Code: ${item.id} | Price: ${item.price}.-`;
        btnAddToCart.disabled = false;
        if (item.req_site) inputSite.focus();
    }

    if (btnAddToCart) {
        btnAddToCart.addEventListener('click', () => {
            const site = inputSite.value.trim();
            if (currentItem.req_site && !site) {
                alert("Please specify Specimen Source / Site.");
                inputSite.focus();
                return;
            }
            // Beta 6.2: Add default qty = 1
            globalPathCart.push({ ...currentItem, site: site, qty: "1" });
            updatePathMiniCart();
            inputSite.value = ''; 
            selectedInfoBox.classList.add('hidden');
            btnAddToCart.disabled = true;
            currentItem = null;
        });
    }

    function updatePathMiniCart() {
        miniCartList.innerHTML = '';
        let total = 0;
        if (globalPathCart.length === 0) {
            miniCartList.innerHTML = '<li class="text-center text-xs text-gray-400 italic py-2">No items added yet</li>';
            totalPriceEl.innerText = "0";
            return;
        }
        globalPathCart.forEach((item, index) => {
            total += item.price;
            const li = document.createElement('li');
            li.className = "bg-white dark:bg-[--color-bg-content] p-2 rounded border border-gray-200 dark:border-[--color-border-base] flex justify-between items-center shadow-sm gap-2";
            
            // Refined 6.2: Split Layout (Name/Tag Left, Input/Unit Right) + Black Unit
            li.innerHTML = `
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start">
                        <div class="flex flex-col mr-2">
                            <span class="font-bold text-xs text-gray-700 dark:text-[--color-text-base]">${item.name}</span>
                            ${(item.container && item.container !== '-') ? `<div class="mt-1"><span class="px-2 py-0.5 rounded text-[9px] bg-gray-500 text-white inline-block">${item.container}</span></div>` : ''}
                            ${item.site ? `<div class="text-[10px] text-fuchsia-600 dark:text-fuchsia-400 mt-1 truncate">Site: ${item.site}</div>` : ''}
                        </div>
                        
                        <div class="flex items-center gap-2 flex-shrink-0 mt-0.5">
                             <div class="relative">
                                <input type="text" readonly value="${item.qty}" 
                                       class="w-10 p-0.5 text-center text-[10px] border border-fuchsia-300 rounded bg-gray-50 text-gray-600 cursor-default">
                            </div>
                            <span class="text-[10px] text-black dark:text-[--color-text-base] w-8 text-left">${item.used_unit || ''}</span>
                        </div>
                    </div>
                </div>
                <div class="flex items-center gap-2 pl-2 border-l border-gray-100 dark:border-[--color-border-base] ml-2">
                    <span class="text-xs font-bold text-gray-600 dark:text-[--color-text-muted]">${item.price}</span>
                    <button class="text-gray-400 hover:text-red-500 btn-remove-path p-1 rounded hover:bg-red-50 transition-colors" data-index="${index}"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
                </div>
            `;
            miniCartList.appendChild(li);
        });
        totalPriceEl.innerText = total.toLocaleString();
        document.querySelectorAll('.btn-remove-path').forEach(btn => {
            btn.addEventListener('click', (e) => {
                globalPathCart.splice(parseInt(e.currentTarget.dataset.index), 1);
                updatePathMiniCart();
            });
        });
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    function handlePathSubmission(actionType) {
        if (globalPathCart.length === 0) return alert("Request list is empty.");
        const historyText = inputHistory ? inputHistory.value.trim() : "";
        const orderNoteText = inputOrderNote ? inputOrderNote.value.trim() : "";
        if (!historyText) { alert("Please provide Clinical History."); inputHistory.focus(); return; }

        const now = new Date();
        const orderNo = `ORD-PATH${now.getFullYear().toString().slice(-2)}${(Math.random() * 10000).toFixed(0).padStart(4, '0')}`;
        let orderStatus, lisStatus, accNo;
        if (actionType === 'plan') { orderStatus = "Pending"; lisStatus = null; accNo = null; }
        else { orderStatus = "Done"; lisStatus = "Waiting"; accNo = `PATH-${now.getFullYear().toString().slice(-2)}${(Math.random() * 10000).toFixed(0).padStart(4, '0')}`; }

        let effectiveStr = formatKAHISDateTime(now);
        if (inputEffectiveDate && inputEffectiveTime && inputEffectiveDate.value && inputEffectiveTime.value) {
            const effDateObj = new Date(`${inputEffectiveDate.value}T${inputEffectiveTime.value}`);
            effectiveStr = formatKAHISDateTime(effDateObj);
        }

        const newEntry = {
            entry_id: `E-PATH${Date.now()}`,
            order_no: orderNo,
            acc_no: accNo,
            activity_type: "Pathology",
            order_status: orderStatus,
            lis_process_status: lisStatus,
            hn: "52039575", pet_name: "คุณส้มจี๊ด(จี๊ดจ๊าด)", owner_name: "คุณพ่อส้มจี๊ด",
            effective_time: effectiveStr,
            order_create_date: formatKAHISDateTime(now),
            order_update_date: formatKAHISDateTime(now),
            request_date: (actionType === 'send') ? formatKAHISDateTime(now) : null,
            order_note: orderNoteText,
            parameters: { items: globalPathCart.map(i => ({ id: i.id, name: i.name, price: i.price, site: i.site, history: historyText })), history_main: historyText },
            recorded_by: "User (Login)", dvm: "Dr. Surg", department: "102",
            last_updated_by: "User (Login)", last_updated_on: formatKAHISDateTime(now), disable_remark: ""
        };

        activityLogData.push(newEntry);
        if (actionType === 'send') showSuccessModal(accNo, globalPathCart, totalPriceEl.innerText, {});
        else alert(`Pathology Plan Saved!\nOrder No: ${orderNo}\nStatus: Pending`);

        globalPathCart = [];
        updatePathMiniCart();
        inputSite.value = '';
        inputHistory.value = '';
        if(inputOrderNote) inputOrderNote.value = '';
        selectedInfoBox.classList.add('hidden');
        btnAddToCart.disabled = true;
    }

    if (btnSavePlan) btnSavePlan.onclick = (e) => { e.preventDefault(); handlePathSubmission('plan'); };
    if (btnConfirm) btnConfirm.onclick = (e) => { e.preventDefault(); handlePathSubmission('send'); };

    renderPathCategories();
}

// --- ACTIONS: DISABLE / EDIT (BETA 5.2.2) ---

function disableOrder(entryId) {
    if (!confirm("Are you sure you want to CANCEL this order plan? \n(This action cannot be undone)")) return;
    
    const orderIndex = activityLogData.findIndex(item => item.entry_id === entryId);
    if (orderIndex > -1) {
        // Update Status
        activityLogData[orderIndex].order_status = 'Disable';
        
        // Update Timestamps & User
        const now = new Date();
        activityLogData[orderIndex].last_updated_on = formatKAHISDateTime(now);
        activityLogData[orderIndex].order_update_date = formatKAHISDateTime(now); // Rule: Update date changes on status change
        activityLogData[orderIndex].last_updated_by = "User (Login)"; 
        activityLogData[orderIndex].disable_remark = "User Cancelled via Lab View";

        // Refresh Views
        alert("Order cancelled successfully.");
        
        // Check if Lab Viewer is active, if so refresh it
        const activeTab = document.querySelector('.emr-tab.tab-active');
        if (activeTab && activeTab.dataset.target === 'lab_viewer_content.html') {
             if(typeof initializeLabViewer === 'function') initializeLabViewer(); 
        }
    } else {
        alert("Error: Order not found.");
    }
}

function loadOrderForEdit(entryId, type) {
    const order = activityLogData.find(item => item.entry_id === entryId);
    if (!order) return alert("Order not found.");
    if (order.order_status !== 'Pending') return alert("Only 'Pending' orders can be edited.");

    if (type === 'LIS') {
        // 1. Open LIS Modal
        const openBtn = document.getElementById('open-lis-popup-fab');
        if (openBtn) openBtn.click();
        
        // 2. Populate Data (Delayed to ensure modal rendering)
        setTimeout(() => {
            // Restore Items
            document.querySelectorAll('#lis-cost-item-list input').forEach(cb => cb.checked = false);
            globalLisCart = []; 
            
            if (order.parameters.full_items) {
                // If we saved full objects
                globalLisCart = [...order.parameters.full_items];
            } else if (order.parameters.tests) {
                // Fallback: Try to re-select based on IDs (Mock)
                // In production, we would need the full item details.
                // For Beta 5.2.2 Mock, we will just clear cart or try to match IDs if visible
                console.log("Restoring items by ID:", order.parameters.tests);
            }
            
            // Refresh Cart UI
            // We need to call updateLisCartUI() but it is scoped inside initializeLisScripts
            // Workaround: Trigger Add Button or Re-run logic.
            // Since we are inside app-init, we can't easily access inner functions of another init.
            // Ideally, updateLisCartUI should be global or we re-click buttons.
            // FOR BETA 5.2.2: We will just alert user that data is loaded for Edit.
            
            // Restore Note & Priority
            const noteInput = document.getElementById('lis-order-note');
            if (noteInput) noteInput.value = order.order_note || "";
            
            if (order.parameters.priority === 'STAT') {
                const statRadio = document.getElementById('prio-stat');
                if(statRadio) statRadio.checked = true;
            }

            alert(`Loaded Order ${order.order_no} for editing.\n(Please re-select items if cart is empty)`);
            
        }, 300);

    } else if (type === 'Pathology') {
        // 1. Open Path Modal
        const openBtn = document.getElementById('open-path-popup-fab');
        if (openBtn) openBtn.click();

        // 2. Populate Data
        setTimeout(() => {
            // Restore Note
            const noteInput = document.getElementById('path-order-note');
            if (noteInput) noteInput.value = order.order_note || "";
            
            // Restore History (Main)
            const histInput = document.getElementById('path-history');
            if (histInput && order.parameters.items && order.parameters.items.length > 0) {
                 // Assumes history is same for all or takes from first item for this demo
                 histInput.value = order.parameters.items[0].history || "";
            }

            alert(`Loaded Order ${order.order_no} for editing.\n(Items pending restoration logic)`);
        }, 300);
    }
}

// --- 3. SUCCESS MODAL & PRINT SLIP (Updated Beta 6.10) ---

// 3.1 Global Slip Generator Function
window.generateRxSlip = function(data) {
    // data: { orderNo, accNo, items, total, dvm, dept, orderNote, pharmacyNote, user }
    
    // Open new tab
    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert("Pop-up blocked! Please allow pop-ups.");

    // Date Format
    const now = new Date();
    const dateStr = now.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    const printMeta = `Printed: ${dateStr} ${timeStr} by ${data.user || 'User Login'}`;

    // Generate Items HTML
    const itemsHtml = data.items.map(item => {
        const qty = item.qty || 1;
        const unit = item.unit || item.used_unit || '';
        const price = item.price || 0;
        const lineTotal = (price * qty).toLocaleString();
        
        // Label formatting
        const labelHtml = item.label 
            ? `<div style="font-size: 10px; color: #444; font-style: italic; margin-top: 2px; line-height: 1.2;">${item.label.replace(/\n/g, '<br>')}</div>` 
            : '';

        return `
        <tr style="border-bottom: 1px dashed #eee;">
            <td style="padding: 4px 0; vertical-align: top;">
                <div style="font-weight: bold;">${item.name}</div>
                <div style="font-size: 10px; color: #555;">${item.qty} ${unit} x ${price}</div>
                ${labelHtml}
            </td>
            <td style="padding: 4px 0; text-align: right; vertical-align: top;">${lineTotal}</td>
        </tr>`;
    }).join('');

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Rx Slip - ${data.orderNo}</title>
            <style>
                /* Reset & Page Setup */
                @page { size: auto; margin: 0mm; }
                body {
                    font-family: 'Sarabun', 'Courier New', sans-serif; /* ใช้ Font ที่อ่านง่าย */
                    margin: 0 auto;
                    padding: 10px; /* ระยะขอบรอบด้าน */
                    width: 70mm; /* กำหนดความกว้างเนื้อหา (เผื่อขอบ 5mm ซ้ายขวาจาก 80mm) */
                    font-size: 12px;
                    line-height: 1.3;
                    color: #000;
                }
                
                /* Header */
                .header { text-align: center; margin-bottom: 10px; }
                .title { font-weight: bold; font-size: 16px; margin-bottom: 2px; }
                .subtitle { font-size: 11px; margin-bottom: 2px; }
                .meta { font-size: 9px; color: #555; margin-top: 4px; }
                
                .divider { border-bottom: 1px dashed #000; margin: 8px 0; }
                
                /* Info Section */
                .info-section { font-size: 11px; margin-bottom: 8px; }
                .info-row { display: flex; justify-content: space-between; }
                .info-left { font-weight: bold; margin-right: 5px; white-space: nowrap; }
                .info-right { text-align: right; word-break: break-word; }

                /* Note Section */
                .note-section { 
                    font-size: 11px; 
                    background-color: #f9f9f9; 
                    padding: 5px; 
                    border-radius: 4px; 
                    border: 1px solid #eee;
                    margin-bottom: 10px;
                }
                .note-label { font-weight: bold; display: block; font-size: 10px; color: #555; }
                .note-val { display: block; margin-bottom: 4px; font-style: italic; }

                /* Table */
                table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 11px; }
                
                /* Total */
                .total-section { 
                    font-weight: bold; 
                    font-size: 16px; 
                    display: flex; 
                    justify-content: space-between; 
                    margin-top: 10px; 
                    padding-top: 5px;
                    border-top: 1px solid #000;
                }
                
                /* Screen Only (Hide on Print) */
                @media print {
                    .no-print { display: none; }
                }
                .btn-print {
                    display: block;
                    width: 100%;
                    padding: 10px;
                    background: #22c55e;
                    color: white;
                    text-align: center;
                    border: none;
                    border-radius: 5px;
                    font-weight: bold;
                    cursor: pointer;
                    margin-bottom: 10px;
                }
            </style>
        </head>
        <body>
            <button class="btn-print no-print" onclick="window.print()">Click to Print</button>

            <div class="header">
                <div class="title">Order Rx (ใบสั่งยานำกลับ)</div>
                <div class="subtitle">Kasetsart University Veterinary Teaching Hospital</div>
                <div class="meta">${printMeta}</div>
            </div>
            
            <div class="divider"></div>

            <div class="info-section">
                <div class="info-row"><span class="info-left">Order:</span><span class="info-right">${data.orderNo || '-'}</span></div>
                <div class="info-row"><span class="info-left">Acc:</span><span class="info-right">${data.accNo || '-'}</span></div>
                <div class="info-row"><span class="info-left">HN:</span><span class="info-right">52039575</span></div>
                <div class="info-row"><span class="info-left">Patient:</span><span class="info-right">คุณส้มจี๊ด(จี๊ดจ๊าด)</span></div>
                <div class="info-row"><span class="info-left">Vet:</span><span class="info-right">${data.dvm || '-'} (${data.dept || '-'})</span></div>
            </div>

            ${ (data.orderNote || data.pharmacyNote) ? `
            <div class="note-section">
                ${data.orderNote ? `<div><span class="note-label">Order Note:</span><span class="note-val">${data.orderNote}</span></div>` : ''}
                ${data.pharmacyNote ? `<div><span class="note-label">Pharmacy Note:</span><span class="note-val">${data.pharmacyNote}</span></div>` : ''}
            </div>` : '' }

            <div class="divider"></div>

            <table>
                ${itemsHtml}
            </table>

            <div class="divider"></div>

            <div class="total-section">
                <span>Total</span>
                <span>${data.total}.-</span>
            </div>

            <div class="divider"></div>
            <div style="text-align: center; font-size: 9px; color: #888; margin-top: 5px;">End of Slip</div>

            <script>
                // Auto Print when loaded
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                    }, 500);
                };
            <\/script>
        </body>
        </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
}

// 3.2 Show Success Modal (Updated Beta 6.12.3 - Fixed Color for Beige Theme)
function showSuccessModal(accNo, cartItems, total, extraDetails = {}) {
    let modal = document.getElementById('order-success-modal');
    if (modal) modal.remove(); 

    const div = document.createElement('div');
    
    // Badges
    let priorityBadge = '';
    if (extraDetails && extraDetails.priority === 'STAT') priorityBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white shadow-sm">STAT</span>`;
    else if (extraDetails && extraDetails.priority) priorityBadge = `<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-600 text-white">Routine</span>`;

    const optionBadge = (extraDetails.info) ? `<span class="ml-1 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500 text-white shadow-sm">${extraDetails.info}</span>` : '';
    
    // Info: Order No (Gray)
    const orderNoHtml = extraDetails.orderNo ? `<span class="text-gray-300 mx-2">|</span><span class="font-mono text-gray-500">${extraDetails.orderNo}</span>` : '';
    
    // Meta Info (DVM/Dept) - Always Black text (Fixed for Beige Theme)
    const metaHtml = (extraDetails.dvm || extraDetails.dept) ? 
        `<div class="mt-1 text-[11px] text-black flex items-center justify-center gap-2 bg-white py-0.5 px-3 rounded-full border border-gray-300 inline-flex">
            <span class="flex items-center text-black"><i data-lucide="user" class="w-3 h-3 mr-1 text-gray-500"></i>${extraDetails.dvm || '-'}</span>
            <span class="text-gray-300">|</span>
            <span class="flex items-center text-black"><i data-lucide="building-2" class="w-3 h-3 mr-1 text-gray-500"></i>${extraDetails.dept || '-'}</span>
         </div>` : '';

    // Notes Style (Fixed Colors)
    // Label: Gray-600 (สีเดิมของ value)
    // Value: Black (เข้มกว่าเดิม)
    const noteContainerClass = "mt-1 w-full text-left bg-white border border-gray-300 p-2 rounded text-xs";
    const labelClass = "text-[10px] font-bold text-gray-600 uppercase block mb-0.5";
    const textClass = "text-black font-medium leading-snug";

    const pharmNoteHtml = extraDetails.pharmacyNote ? 
        `<div class="${noteContainerClass}">
            <span class="${labelClass}">Pharmacy Note:</span>
            <div class="${textClass}">${extraDetails.pharmacyNote}</div>
         </div>` : '';

    const orderNoteHtml = extraDetails.orderNote ? 
        `<div class="${noteContainerClass}">
            <span class="${labelClass}">Order Note:</span>
            <div class="${textClass}">${extraDetails.orderNote}</div>
         </div>` : '';

    div.innerHTML = `
        <div id="order-success-modal" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[150] backdrop-blur-sm">
            <div class="bg-white dark:bg-[--color-bg-content] rounded-xl shadow-2xl p-0 max-w-md w-full flex flex-col overflow-hidden border border-gray-200 dark:border-[--color-border-base] animate-fade-in-up relative" style="max-height: 90vh;">
                
                <button onclick="document.getElementById('order-success-modal').remove()" class="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors z-50">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>

                <div class="p-3 bg-white dark:bg-[--color-bg-content] border-b border-gray-100 dark:border-gray-700 flex-shrink-0 shadow-sm z-10">
                    <div class="flex items-center justify-center gap-2 mb-2">
                        <div class="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                            <i data-lucide="check" class="w-4 h-4"></i>
                        </div>
                        <h3 class="text-base font-bold text-gray-800 dark:text-[--color-text-base]">Order Confirmed!</h3>
                    </div>
                    
                    <div class="flex flex-col items-center w-full text-xs">
                        <div class="flex items-center mb-1.5">
                            <span class="font-mono font-bold text-black text-sm">${accNo}</span>
                            ${orderNoHtml}
                        </div>
                        
                        <div class="flex justify-center items-center gap-1 mb-1.5">${priorityBadge}${optionBadge}</div>

                        ${metaHtml}
                        
                        <div class="w-full space-y-1 mt-1.5">
                            ${pharmNoteHtml}
                            ${orderNoteHtml}
                        </div>
                    </div>
                </div>

                <div class="p-0 bg-gray-50 dark:bg-[--color-bg-secondary] flex-1 overflow-y-auto min-h-0">
                    <div class="p-2 px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-wide sticky top-0 bg-gray-50 dark:bg-[--color-bg-secondary] z-10 border-b border-gray-100 dark:border-gray-700 flex justify-between">
                        <span>Items</span>
                        <span>${cartItems ? cartItems.length : 0}</span>
                    </div>
                    <ul id="modal-item-list" class="space-y-0 text-sm divide-y divide-gray-100 dark:divide-gray-700"></ul>
                </div>

                <div class="p-3 border-t border-gray-200 dark:border-[--color-border-base] bg-white dark:bg-[--color-bg-content] flex-shrink-0">
                    <div class="flex justify-between items-center mb-3">
                        <span class="text-gray-600 dark:text-[--color-text-muted] font-medium text-sm">Total Amount</span>
                        <span class="text-lg font-bold text-blue-600 dark:text-blue-400">${total}.-</span>
                    </div>
                    <div class="flex space-x-2">
                        <button id="btn-print-slip" class="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-xs flex items-center justify-center shadow-sm transition-all active:scale-95">
                            <i data-lucide="scroll-text" class="w-4 h-4 mr-2"></i> Print Slip
                        </button>
                        <button id="btn-print-modal" class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs flex items-center justify-center shadow-sm transition-all active:scale-95">
                            <i data-lucide="tags" class="w-4 h-4 mr-2"></i> Print Label
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(div.firstElementChild);
    
    const listContainer = document.getElementById('modal-item-list');
    listContainer.innerHTML = '';
    
    if (cartItems && cartItems.length > 0) {
        cartItems.forEach(item => {
            const li = document.createElement('li');
            li.className = "bg-white dark:bg-[--color-bg-content] p-3 flex justify-between items-start gap-3 hover:bg-gray-50 transition-colors";
            
            let details = '';
            if (item.container && item.container !== '-') {
                details = `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] bg-gray-100 text-gray-500 border border-gray-200 ml-2">${item.container}</span>`;
            }
            
            let subText = '';
            if (item.label) {
                const formattedLabel = item.label.replace(/\n/g, '<br>');
                subText = `<div class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-tight">${formattedLabel}</div>`;
            } else if (item.site) {
                subText = `<div class="text-[10px] text-fuchsia-600 dark:text-fuchsia-400 mt-0.5">Site: ${item.site}</div>`;
            }

            const qtyVal = item.qty ? parseFloat(item.qty) : 1;
            const lineTotal = (item.price * qtyVal).toLocaleString();
            const unitText = item.used_unit || item.unit || '';

            li.innerHTML = `
                <div class="flex-1 min-w-0">
                    <div class="flex flex-wrap items-center gap-1">
                        <span class="font-bold text-xs text-gray-800 dark:text-[--color-text-base]">${item.name}</span>
                        ${details}
                    </div>
                    ${subText}
                </div>
                
                <div class="text-right flex flex-col items-end flex-shrink-0 ml-2">
                    <span class="font-bold text-xs text-gray-800 dark:text-[--color-text-base]">${lineTotal}</span>
                    <div class="text-[10px] text-gray-400 mt-0.5 whitespace-nowrap">
                        ${qtyVal} ${unitText}
                    </div>
                </div>
            `;
            listContainer.appendChild(li);
        });
    } else {
        listContainer.innerHTML = '<li class="p-4 text-center text-gray-400 italic text-xs">No items</li>';
    }
    
    // Bind Print Slip
    const btnPrintSlip = document.getElementById('btn-print-slip');
    if(btnPrintSlip) {
        btnPrintSlip.onclick = () => {
            window.generateRxSlip({
                orderNo: extraDetails.orderNo,
                accNo: accNo,
                items: cartItems,
                total: total,
                dvm: extraDetails.dvm,
                dept: extraDetails.dept,
                orderNote: extraDetails.orderNote,
                pharmacyNote: extraDetails.pharmacyNote,
                user: "User (Login)"
            });
        };
    }

    // Bind Print Label
    const printBtn = document.getElementById('btn-print-modal');
    if(printBtn) {
        printBtn.onclick = () => {
            if (typeof window.openRxPrintModal === 'function') {
                window.openRxPrintModal(cartItems); 
            } else {
                console.error("Function window.openRxPrintModal not found.");
            }
        };
    }
    
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// --- GLOBAL: ORDER PLAN LOGIC (BETA 5.6 Revised 3 - Final) ---
function initializeOrderPlanLogic() {
    const modal = document.getElementById('order-plan-modal');
    if (!modal) return;

    const titleEl = document.getElementById('order-plan-title');
    const dateInput = document.getElementById('plan-target-date');
    const timeInput = document.getElementById('plan-target-time');
    const noteInput = document.getElementById('plan-order-note');
    const deptInput = document.getElementById('plan-target-dept'); // Target Dept
    const dvmInput = document.getElementById('plan-target-dvm'); // Target DVM
    
    const btnCancel = document.getElementById('btn-cancel-plan');
    const btnClose = document.getElementById('close-order-plan-x');
    const btnConfirm = document.getElementById('btn-confirm-plan');

    let currentType = "";

    // Global function to open modal
    window.openOrderPlanModal = (type, title) => {
        currentType = type;
        if (titleEl) titleEl.innerText = title || `Create Order: ${type}`;
        
        // Default to next hour
        const now = new Date();
        now.setHours(now.getHours() + 1);
        now.setMinutes(0);
        
        if(dateInput) dateInput.value = now.toISOString().split('T')[0];
        if(timeInput) timeInput.value = now.toTimeString().slice(0,5);
        if(noteInput) noteInput.value = "";
        
        modal.classList.remove('hidden');
    };

    const closeModal = () => modal.classList.add('hidden');

    if (btnConfirm) {
        btnConfirm.onclick = () => { // Use onclick to prevent multiple listeners
            if (!dateInput.value || !timeInput.value) return alert("Please select Date/Time Plan.");
            
            const now = new Date();
            const targetStr = formatKAHISDateTime(new Date(`${dateInput.value}T${timeInput.value}`));
            // Order No format: ORD-VS-XXXXXX
            const prefix = currentType.replace(/\s/g, '').substring(0,3).toUpperCase();
            const orderNo = `ORD-${prefix}-${Date.now().toString().slice(-6)}`;

            const newEntry = {
                entry_id: `E-PLAN-${Date.now()}`,
                order_no: orderNo,
                acc_no: null, // Plan has no Acc No
                activity_type: currentType,
                order_status: "Pending",
                lis_process_status: null,
                hn: "52039575", pet_name: "คุณส้มจี๊ด(จี๊ดจ๊าด)", owner_name: "คุณพ่อส้มจี๊ด",
                order_create_date: formatKAHISDateTime(now),
                target_time: targetStr,
                effective_time: null,
                order_note: noteInput.value || "-",
                parameters: {},
                recorded_by: "User (Login)", 
                dvm: dvmInput ? dvmInput.value : "Any", 
                department: deptInput ? deptInput.value : "IPD", 
                last_updated_by: "User (Login)", last_updated_on: formatKAHISDateTime(now), disable_remark: ""
            };

            activityLogData.unshift(newEntry);
            alert(`Order Plan Saved!\nOrder No: ${orderNo}\nStatus: Pending\nTarget: ${targetStr}`);
            
            // Refresh Lab Viewer if active
            const activeTab = document.querySelector('.emr-tab.tab-active');
            if (activeTab && activeTab.dataset.target === 'lab_viewer_content.html') {
                 if(typeof initializeLabViewer === 'function') initializeLabViewer(); 
            }

            closeModal();
            
            // Close parent modal if needed (Eye Exam)
            const eyeModal = document.getElementById('eye-exam-modal');
            if (eyeModal && !eyeModal.classList.contains('hidden')) {
                eyeModal.classList.add('hidden');
            }
        };
    }

    if(btnCancel) btnCancel.onclick = closeModal;
    if(btnClose) btnClose.onclick = closeModal;
    modal.onclick = (e) => { if(e.target === modal) closeModal(); };
}