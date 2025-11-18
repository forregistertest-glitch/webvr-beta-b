// This is app-init.js (BETA 4.0 - Final Verified & Completed)

function initializeApp() {
    
    // 1. เริ่มต้นระบบพื้นฐาน
    initializeTabSwitching(); // (มาจาก app-logic.js)
    initializeVitalSignsSaveLogic(); // (เรียกฟังก์ชันที่อยู่ด้านล่างสุดของไฟล์นี้)
    
    // 2. โหลดหน้าแรก (Assessment)
    const activeTab = document.querySelector('.emr-tab.tab-active');
    const initialContent = activeTab ? activeTab.dataset.target : 'assessment_content.html';
    loadModuleContent(initialContent || 'assessment_content.html'); // (มาจาก app-logic.js)
    
    // 3. จัดการ Theme (Light/Dark)
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
    

    // 4. จัดการปุ่มเมนู (Menu Toggle)
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

    // ============================================================
    // [PATCH] Problem List Logic (เติมส่วนนี้เข้าไป)
    // ============================================================
    const plModal = document.getElementById('problem-list-modal');
    if (plModal) {
        // 1. จัดการปุ่มเปิด (จากหน้า Assessment) และปุ่มปิด
        const openPlBtn = document.getElementById('open-problem-list-modal');
        if(openPlBtn) openPlBtn.addEventListener('click', () => plModal.classList.remove('hidden'));
        
        ['problem-list-popup-close-x', 'problem-list-popup-cancel'].forEach(id => {
            document.getElementById(id)?.addEventListener('click', () => plModal.classList.add('hidden'));
        });

        // 2. จัดการ Logic การเลือกหมวดหมู่ (Category)
        const catList = document.getElementById('category-list');
        const resBody = document.getElementById('result-table-body');
        const resHeader = document.getElementById('result-header');

        if (catList && resBody) {
            // ฟังก์ชัน Render ตารางขวา
            const renderResults = (catId) => {
                // ดึงข้อมูลจาก app-data.js (categoryData)
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

            // Event: เมื่อคลิกเลือกหมวดหมู่
            catList.addEventListener('click', (e) => {
                const li = e.target.closest('li[data-category-id]');
                if (li) {
                    // เปลี่ยนสี Highlight
                    catList.querySelectorAll('li').forEach(i => i.classList.remove('bg-gray-100', 'font-semibold', 'dark:bg-[rgba(139,125,107,0.15)]'));
                    li.classList.add('bg-gray-100', 'font-semibold', 'dark:bg-[rgba(139,125,107,0.15)]');
                    
                    // เรียกฟังก์ชัน Render
                    renderResults(li.dataset.categoryId);
                }
            });

            // Event: เมื่อติ๊ก Checkbox (นับจำนวน)
            resBody.addEventListener('change', () => {
                const count = resBody.querySelectorAll('input:checked').length;
                if (resHeader) resHeader.innerText = `Result (${count} selected)`;
            });

            // เริ่มต้น: โหลดหมวดแรก (Common)
            renderResults('common');
        }
    }
    // ============================================================

    // 5. Helper สำหรับ Modal ทั่วไป (DF, TF, Path)
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
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) hide();
            });
        }
    };

    // --- Setup Modals ---
    setupSimpleModal('df-popup-modal', 'open-df-popup-fab', ['df-popup-close-x', 'df-popup-cancel']);
    setupSimpleModal('tf-popup-modal', 'open-tf-popup-fab', ['tf-popup-close-x', 'tf-popup-cancel']);
    setupSimpleModal('path-popup-modal', 'open-path-popup-fab', ['close-path-popup-x', 'close-path-popup-cancel']);


    // 6. จัดการ Vital Signs Modal (ซับซ้อน)
    const vitalsModal = document.getElementById('vitals-popup-modal');
    if (vitalsModal) {
        const openBtn = document.getElementById('open-vitals-popup-fab');
        const closeX = document.getElementById('close-vitals-popup-x');
        const closeCancel = document.getElementById('close-vitals-popup-cancel');
        const tabLinks = vitalsModal.querySelectorAll('.vitals-tab-link');
        const tabContents = vitalsModal.querySelectorAll('.vitals-tab-content');
        
        // Chart Buttons
        const bpChartBtn = document.getElementById('bp-chart-btn');
        const vitalsChartBtn = document.getElementById('vitals-chart-btn');

        const showVitals = () => {
            vitalsModal.classList.remove('hidden');
            // Render History
            const filteredVitals = activityLogData.filter(entry => entry.activity_type === "Vital Signs" && entry.status === "Done");
            const mappedData = filteredVitals.map(entry => ({
                id: entry.entry_id,
                datetimeSort: new Date(entry.effective_time).toISOString(), 
                datetime: entry.effective_time.split(',')[0], 
                bp: entry.parameters.BP, pulse: entry.parameters.Pulse, hr: entry.parameters.HR, rr: entry.parameters.RR, temp: entry.parameters.Temp, fbs: entry.parameters.FBS, crt: entry.parameters.CRT, mucous: entry.parameters.MM, lung: entry.parameters.Lung, heart: entry.parameters.Heart, pulse_quality: entry.parameters.Pulse_Quality, loc: entry.parameters.LOC, pain: entry.parameters.Pain,
                cyanosis: (entry.parameters.Cyanosis === 'Yes'), seizure: (entry.parameters.Seizure === 'Yes'), arrest: (entry.parameters.Arrest === 'Yes'), note: entry.parameters.Note,
                // Meta
                dvm: entry.dvm, department: entry.department, recorded_by: entry.recorded_by, recorded_on: entry.recorded_on, last_updated_on: entry.last_updated_on
            }));
            renderVsHistoryTable(mappedData); // (Function defined below)
            if (typeof lucide !== 'undefined') lucide.createIcons();
        };
        
        const hideVitals = () => vitalsModal.classList.add('hidden');

        if(openBtn) openBtn.addEventListener('click', showVitals);
        if(closeX) closeX.addEventListener('click', hideVitals);
        if(closeCancel) closeCancel.addEventListener('click', hideVitals);
        vitalsModal.addEventListener('click', (e) => { if(e.target === vitalsModal) hideVitals(); });

        // Tab Switching
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

        // Chart Logic
        if (bpChartBtn) bpChartBtn.addEventListener('click', () => {
            const data = activityLogData.filter(e => e.activity_type === "Vital Signs" && e.status === "Done").map(e => ({ datetimeSort: new Date(e.effective_time).toISOString(), datetime: e.effective_time, bp: e.parameters.BP, pulse: e.parameters.Pulse }));
            openBpChart(data);
        });
        if (vitalsChartBtn) vitalsChartBtn.addEventListener('click', () => {
            const data = activityLogData.filter(e => e.activity_type === "Vital Signs" && e.status === "Done").map(e => ({ datetimeSort: new Date(e.effective_time).toISOString(), datetime: e.effective_time, pulse: e.parameters.Pulse, hr: e.parameters.HR, rr: e.parameters.RR, temp: e.parameters.Temp, fbs: e.parameters.FBS }));
            openVitalsChart(data);
        });
    }

    // 7. จัดการ Eye Exam Modal
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
            const filteredEye = activityLogData.filter(entry => entry.activity_type === "Eye Exam" && entry.status === "Done");
            const mappedData = filteredEye.map(entry => ({
                datetimeSort: new Date(entry.effective_time).toISOString(),
                datetime: entry.effective_time.split(',')[0],
                plr_od: entry.parameters.plr_od, plr_os: entry.parameters.plr_os, palpebral_od: entry.parameters.palpebral_od, palpebral_os: entry.parameters.palpebral_os, dazzle_od: entry.parameters.dazzle_od, dazzle_os: entry.parameters.dazzle_os, menace_od: entry.parameters.menace_od, menace_os: entry.parameters.menace_os, stt_od: entry.parameters.stt_od, stt_os: entry.parameters.stt_os, iop_od: entry.parameters.iop_od, iop_os: entry.parameters.iop_os, fluorescein_od: entry.parameters.fluorescein_od, fluorescein_os: entry.parameters.fluorescein_os,
                imageUrl: (entry.parameters.Note) ? 'eyeexam.png' : null,
                dvm: entry.dvm, department: entry.department, recorded_by: entry.recorded_by, recorded_on: entry.recorded_on, last_updated_on: entry.last_updated_on
            }));
            renderEyeExamHistoryTable(mappedData); // (Defined in app-logic.js)
            if (typeof lucide !== 'undefined') lucide.createIcons();
        };
        const hideEye = () => eyeModal.classList.add('hidden');

        if(openBtn) openBtn.addEventListener('click', showEye);
        if(closeX) closeX.addEventListener('click', hideEye);
        if(closeCancel) closeCancel.addEventListener('click', hideEye);
        
        if(openDrawingBtn) openDrawingBtn.addEventListener('click', () => {
             const drawingModal = document.getElementById('drawing-demo-modal');
             if(drawingModal) {
                 drawingModal.classList.remove('hidden');
                 initializeDrawingDemo('eyeexam.png');
             }
        });

        // Tab Switching (Eye)
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
    }

    // 8. จัดการ LIS Modal (Interactive + History)
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
        const lisCostItemList = document.getElementById('lis-cost-item-list');
        const lisPreviewList = document.getElementById('lis-preview-list');
        const lisPreviewPlaceholder = document.getElementById('lis-preview-placeholder');
        const checkAllLis = document.getElementById('check-all-tests');
        const btnAddSelected = document.getElementById('btn-add-selected-tests');
        const lisSelectedTableBody = document.getElementById('lis-selected-table-body');
        const lisSelectedCount = document.getElementById('lis-selected-count');
        const lisSaveBtn = document.getElementById('btn-save-lis');
        
        // Views
        const lisFormView = document.getElementById('lis-form-view');
        const lisSummaryView = document.getElementById('lis-summary-view');
        const closeSummaryX = document.getElementById('close-lis-summary-x');
        
        // Mock Data
        const lisMockData = {
            "health_s": [
                { id: "CBC", name: "CBC (120)", kind: "Hemato", unit: "รายการ", preview: "Hematology: CBC" },
                { id: "BP", name: "Blood Parasite (50)", kind: "BP", unit: "รายการ", preview: "Blood parasite: BP" },
                { id: "BUN", name: "BUN (50)", kind: "BC", unit: "รายการ", preview: "Blood Chem: BUN" },
                { id: "CRE", name: "Creatinine (50)", kind: "BC", unit: "รายการ", preview: "Blood Chem: Creatinine" },
                { id: "ALT", name: "ALT (50)", kind: "BC", unit: "รายการ", preview: "Blood Chem: ALT" },
                { id: "UA", name: "UA (100)", kind: "UA", unit: "รายการ", preview: "Urinalysis: UA" }
            ],
             "health_m": [
                { id: "CBC", name: "CBC (120)", kind: "Hemato", unit: "รายการ", preview: "Hematology: CBC" },
                { id: "BUN", name: "BUN (50)", kind: "BC", unit: "รายการ", preview: "Blood Chem: BUN" },
                { id: "CRE", name: "Creatinine (50)", kind: "BC", unit: "รายการ", preview: "Blood Chem: Creatinine" }
            ],
            "health_l": [
                { id: "CBC", name: "CBC (120)", kind: "Hemato", unit: "รายการ", preview: "Hematology: CBC" },
                { id: "BUN", name: "BUN (50)", kind: "BC", unit: "รายการ", preview: "Blood Chem: BUN" },
                { id: "CRE", name: "Creatinine (50)", kind: "BC", unit: "รายการ", preview: "Blood Chem: Creatinine" },
                { id: "ALT", name: "ALT (50)", kind: "BC", unit: "รายการ", preview: "Blood Chem: ALT" },
                { id: "UA", name: "UA (100)", kind: "UA", unit: "รายการ", preview: "Urinalysis: UA" }
            ],
            "detail_1": [{ id: "TEST2", name: "Test D1 (400)", kind: "Other", unit: "Set", preview: "Test: D1" }],
            "detail_2": [{ id: "TEST3", name: "Test D2 (500)", kind: "Other", unit: "Set", preview: "Test: D2" }]
        };
        let currentSelectedRows = [];

        // Render Functions
        const renderCostItems = (catKey) => {
            const items = lisMockData[catKey] || [];
            lisCostItemList.innerHTML = items.length ? '' : '<li class="p-3 text-center text-gray-500 dark:text-[--color-text-muted]">No items</li>';
            items.forEach(item => {
                lisCostItemList.innerHTML += `
                    <li class="checkbox-label hover:bg-gray-50 dark:hover:bg-[var(--color-bg-secondary)] p-2 cursor-pointer">
                        <div class="flex items-center">
                            <input type="checkbox" class="form-checkbox mr-2" data-id="${item.id}" data-name="${item.name}" data-kind="${item.kind}" data-unit="${item.unit}">
                            <span class="text-[var(--color-text-base)]">${item.name}</span>
                        </div>
                    </li>`;
            });
            if(checkAllLis) checkAllLis.checked = false;
            updatePreview();
        };

        const updatePreview = () => {
            const checked = lisCostItemList.querySelectorAll('input:checked');
            lisPreviewList.querySelectorAll('p[data-lis-item]').forEach(p => p.remove()); // Clear dynamic
            lisPreviewPlaceholder.classList.remove('hidden');
            
            if (checked.length > 0) {
                lisPreviewPlaceholder.classList.add('hidden');
                checked.forEach(cb => {
                    // Find item in any category (simplified to health_s or active category)
                    // For simplicity in this demo, searching in current rendered mock data key
                    // Real app would have flat list or lookup
                    let item = null;
                    for (const key in lisMockData) {
                        item = lisMockData[key].find(i => i.id === cb.dataset.id);
                        if(item) break;
                    }
                    
                    if(item) {
                        const p = document.createElement('p');
                        p.className = "text-gray-700 dark:text-[--color-text-base]";
                        p.setAttribute('data-lis-item', item.id);
                        p.innerText = item.preview;
                        lisPreviewList.insertBefore(p, lisPreviewPlaceholder);
                    }
                });
            }
        };

        const renderSelectedTable = () => {
            lisSelectedTableBody.innerHTML = currentSelectedRows.length ? '' : '<tr><td colspan="6" class="p-3 text-center text-gray-500 dark:text-[--color-text-muted]">No tests added</td></tr>';
            currentSelectedRows.forEach((row, index) => {
                lisSelectedTableBody.innerHTML += `
                    <tr class="hover:bg-gray-50 dark:hover:bg-[var(--color-bg-secondary)]">
                        <td class="p-2 text-[var(--color-text-base)]">${index + 1}</td>
                        <td class="p-2 text-[var(--color-text-base)]">${row.name}</td>
                        <td class="p-2 text-[var(--color-text-base)]">${row.kind}</td>
                        <td class="p-2 text-[var(--color-text-base)]">1</td>
                        <td class="p-2 text-[var(--color-text-base)]">${row.unit}</td>
                        <td class="p-2 text-center"><i data-lucide="x" class="w-4 h-4 text-red-500 cursor-pointer btn-remove-row" data-index="${index}"></i></td>
                    </tr>`;
            });
            lisSelectedCount.innerText = currentSelectedRows.length;
            if(typeof lucide !== 'undefined') lucide.createIcons();
        };

        // LIS Logic
        const showLis = () => {
            lisModal.classList.remove('hidden');
            // Reset
            lisFormView.classList.remove('hidden');
            lisSummaryView.classList.add('hidden');
            
            // Reset Selection
            if (lisCategoryList) {
                 lisCategoryList.querySelectorAll('li').forEach(item => {
                    item.classList.remove('font-semibold', 'bg-gray-100', 'dark:bg-[rgba(139,125,107,0.15)]');
                });
                const defaultCat = lisCategoryList.querySelector('li[data-category="health_s"]');
                if(defaultCat) defaultCat.classList.add('font-semibold', 'bg-gray-100', 'dark:bg-[rgba(139,125,107,0.15)]');
            }
            renderCostItems('health_s');
            currentSelectedRows = []; // Clear selected on reopen? Or keep? User preference. Let's clear for now.
            renderSelectedTable();
            
            // Render History Table (BETA 4.0 Step 9)
            const filteredLis = activityLogData.filter(entry => entry.activity_type === "LIS");
            renderLisHistoryTable(filteredLis);
            
            // Default Tab
            tabLinks.forEach(t => { t.classList.remove('tab-active'); t.classList.add('tab-inactive'); });
            const historyTab = lisModal.querySelector('.lis-tab-link[data-tab="lis-history"]');
            if(historyTab) { historyTab.classList.remove('tab-inactive'); historyTab.classList.add('tab-active'); }
            tabContents.forEach(c => c.classList.add('hidden'));
            const historyContent = lisModal.querySelector('#content-lis-history');
            if(historyContent) historyContent.classList.remove('hidden');
            
            if (typeof lucide !== 'undefined') lucide.createIcons();
        };
        const hideLis = () => lisModal.classList.add('hidden');

        if(openBtn) openBtn.addEventListener('click', showLis);
        if(closeX) closeX.addEventListener('click', hideLis);
        if(closeCancel) closeCancel.addEventListener('click', hideLis);

        // LIS Form Events
        if(lisCategoryList) {
            lisCategoryList.addEventListener('click', (e) => {
                const li = e.target.closest('li');
                if(li && li.dataset.category) {
                    lisCategoryList.querySelectorAll('li').forEach(i => i.classList.remove('font-semibold', 'bg-gray-100', 'dark:bg-[rgba(139,125,107,0.15)]'));
                    li.classList.add('font-semibold', 'bg-gray-100', 'dark:bg-[rgba(139,125,107,0.15)]');
                    renderCostItems(li.dataset.category);
                }
            });
        }
        if(lisCostItemList) lisCostItemList.addEventListener('change', updatePreview);
        if(checkAllLis) checkAllLis.addEventListener('change', () => {
            lisCostItemList.querySelectorAll('input').forEach(cb => cb.checked = checkAllLis.checked);
            updatePreview();
        });
        if(btnAddSelected) btnAddSelected.addEventListener('click', () => {
            const checked = lisCostItemList.querySelectorAll('input:checked');
            checked.forEach(cb => {
                if(!currentSelectedRows.some(r => r.id === cb.dataset.id)) {
                    currentSelectedRows.push({ id: cb.dataset.id, name: cb.dataset.name, kind: cb.dataset.kind, unit: cb.dataset.unit });
                }
            });
            renderSelectedTable();
        });
        if(lisSelectedTableBody) lisSelectedTableBody.addEventListener('click', (e) => {
            if(e.target.classList.contains('btn-remove-row')) {
                currentSelectedRows.splice(e.target.dataset.index, 1);
                renderSelectedTable();
            }
        });
        if(lisSaveBtn) lisSaveBtn.addEventListener('click', () => {
            lisFormView.classList.add('hidden');
            lisSummaryView.classList.remove('hidden');
        });
        if(closeSummaryX) closeSummaryX.addEventListener('click', hideLis);

        // LIS Tab Switching
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

    // 9. General Utils (Numpad, Image Viewer, Drawing Modal Close)
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
        // (Thumbnail click logic is inside render functions or delegated)
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
            if(typeof fabricCanvas !== 'undefined') {
                // (In real app: save image data)
                drawingModal.classList.add('hidden');
            }
        });
    }

    // 10. Helper: Render VS History (Local function for VS Modal)
    const vsTableBody = document.getElementById('historyTableBody');
    const vsNoMsg = document.getElementById('noHistoryMessage');
    function renderVsHistoryTable(data) {
        if(!vsTableBody) return;
        vsTableBody.innerHTML = '';
        if(data.length === 0) {
            if(vsNoMsg) vsNoMsg.classList.remove('hidden');
            vsTableBody.parentNode.classList.add('hidden');
            return;
        }
        if(vsNoMsg) vsNoMsg.classList.add('hidden');
        vsTableBody.parentNode.classList.remove('hidden');

        data.forEach(item => {
            const row = document.createElement('tr');
            row.className = "hover:bg-gray-50 dark:hover:bg-[var(--color-bg-secondary)]";
            row.innerHTML = `
                <td class="sticky left-0 bg-white dark:bg-[var(--color-bg-content)] text-[var(--color-text-base)] p-3">${item.datetime}</td>
                <td class="text-[var(--color-text-base)] p-3">${item.temp||''}</td><td class="text-[var(--color-text-base)] p-3">${item.rr||''}</td><td class="text-[var(--color-text-base)] p-3">${item.hr||''}</td><td class="text-[var(--color-text-base)] p-3">${item.bp||''}</td><td class="text-[var(--color-text-base)] p-3">${item.pulse||''}</td><td class="text-[var(--color-text-base)] p-3">${item.crt||''}</td><td class="text-[var(--color-text-base)] p-3">${item.fbs||''}</td><td class="text-[var(--color-text-base)] p-3">${item.mucous||''}</td><td class="text-[var(--color-text-base)] p-3">${item.lung||''}</td><td class="text-[var(--color-text-base)] p-3">${item.heart||''}</td><td class="text-[var(--color-text-base)] p-3">${item.pulse_quality||''}</td><td class="text-[var(--color-text-base)] p-3">${item.loc||''}</td><td class="text-[var(--color-text-base)] p-3">${item.pain||''}</td>
                <td class="text-center p-3">${item.cyanosis?'Yes':'No'}</td><td class="text-center p-3">${item.seizure?'Yes':'No'}</td><td class="text-center p-3">${item.arrest?'Yes':'No'}</td>
                <td class="text-[var(--color-text-muted)] p-3" title="${item.note||''}">${(item.note && item.note.length>10)?item.note.substring(0,10)+'...':item.note||''}</td>
                <td class="text-[var(--color-text-base)] p-3">${item.dvm||''}</td><td class="text-[var(--color-text-base)] p-3">${item.department||''}</td><td class="text-[var(--color-text-base)] p-3">${item.recorded_by||''}</td><td class="text-[var(--color-text-base)] p-3">${item.recorded_on?item.recorded_on.split(',')[0]:''}</td><td class="text-[var(--color-text-base)] p-3">${item.last_updated_on?item.last_updated_on.split(',')[0]:''}</td>
                <td class="p-3"><button class="text-[var(--color-text-muted)] hover:text-[var(--color-primary-500)]"><i data-lucide="more-vertical" class="w-4 h-4"></i></button></td>
            `;
            vsTableBody.appendChild(row);
        });
    }

    // 11. Helper: Render LIS History (Local function for LIS Modal)
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
            const row = document.createElement('tr');
            row.className = "hover:bg-gray-50 dark:hover:bg-[var(--color-bg-secondary)]";
            row.innerHTML = `
                <td class="p-3 whitespace-nowrap sticky left-0 bg-white dark:bg-[var(--color-bg-content)] text-[var(--color-text-base)] shadow-sm">${item.effective_time.split(',')[0]}</td>
                <td class="p-3 whitespace-nowrap text-[var(--color-text-base)]">${item.acc_no}</td>
                <td class="p-3 whitespace-nowrap text-[var(--color-text-base)]">${tests}</td>
                <td class="p-3 whitespace-nowrap max-w-xs truncate text-[var(--color-text-muted)]" title="${item.parameters.note}">${item.parameters.note}</td>
                <td class="p-3 whitespace-nowrap text-[var(--color-text-base)]">${item.dvm}</td>
                <td class="p-3 whitespace-nowrap text-[var(--color-text-base)]">${item.department}</td>
                <td class="p-3 whitespace-nowrap text-[var(--color-text-base)]">${item.recorded_by}</td>
                <td class="p-3 whitespace-nowrap text-[var(--color-text-base)]">${item.recorded_on.split(',')[0]}</td>
                <td class="p-3 whitespace-nowrap text-[var(--color-text-base)]">${item.last_updated_on.split(',')[0]}</td>
                <td class="p-3 whitespace-nowrap text-center"><span class="px-2 py-1 rounded text-xs ${item.status==='Done'?'bg-green-100 text-green-800':item.status==='Pending'?'bg-yellow-100 text-yellow-800':'bg-red-100 text-red-800'}">${item.status}</span></td>
                <td class="p-3 whitespace-nowrap"><button class="text-[var(--color-text-muted)] hover:text-[var(--color-primary-500)]"><i data-lucide="more-vertical" class="w-4 h-4"></i></button></td>
            `;
            lisHistoryBody.appendChild(row);
        });
    }
}

// =================================================================
// START: Helper Functions (Previously Missing)
// =================================================================

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
            status: "Done", 
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
        alert("Vital Signs Saved!\n(Check activityLogData in console)");
        
        // Clear form
        document.querySelectorAll('#content-new-vitals input').forEach(i => i.value = '');
        document.querySelectorAll('#content-new-vitals select').forEach(s => s.selectedIndex = 0);
        document.querySelectorAll('#content-new-vitals textarea').forEach(t => t.value = '');
        document.querySelectorAll('#content-new-vitals input[type="checkbox"]').forEach(c => c.checked = false);

        vitalsModal.classList.add('hidden');
    });
}

// =================================================================
// END: BETA 4.0 - Final Verified
// =================================================================