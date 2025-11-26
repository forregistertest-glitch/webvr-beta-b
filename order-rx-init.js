// This is order-rx-init.js
// Controller logic for Order Rx (Home Medication) Module
// Theme: Dark Orange (Pill Icon)
// Updated: Beta 6.9 (Print Label & Note Passing)

let globalRxCart = [];
let currentRxCategory = null; 

function initializeOrderRxScripts() {
    console.log("Initialize Order Rx Module (Beta 6.9)");

    // --- DOM Elements ---
    const categoryList = document.getElementById('rx-category-list');
    const itemList = document.getElementById('rx-item-list');
    const currentCatName = document.getElementById('rx-current-cat-name');
    const searchInput = document.getElementById('rx-search');
    
    // Form Elements
    const selectedInfoBox = document.getElementById('rx-selected-info');
    const selectedNameEl = document.getElementById('rx-selected-name');
    const selectedCodeEl = document.getElementById('rx-selected-code');
    const inputDrugLabel = document.getElementById('rx-drug-label');
    const inputPharmacyNote = document.getElementById('rx-pharmacy-note');
    const btnAddToCart = document.getElementById('btn-add-rx-cart');
    
    // Cart Elements
    const miniCartList = document.getElementById('rx-mini-cart');
    const totalPriceEl = document.getElementById('rx-total-price');
    
    // Re-med Elements
    const btnOpenReMed = document.getElementById('btn-open-remed');
    const remedModal = document.getElementById('rx-remed-modal');
    const closeRemedX = document.getElementById('close-remed-modal-x');
    const closeRemedBtn = document.getElementById('close-remed-modal-btn');
    const remedTableBody = document.getElementById('rx-remed-table-body');

    // Print Modal Elements (New Beta 6.9)
    const printModal = document.getElementById('rx-print-modal');
    const closePrintX = document.getElementById('close-print-modal-x');
    const closePrintBtn = document.getElementById('close-print-modal-btn');
    const printList = document.getElementById('rx-print-list');

    // Footer Actions
    const btnSavePlan = document.getElementById('btn-save-rx-plan');
    const btnConfirm = document.getElementById('btn-confirm-rx-order');
    const inputEffectiveDate = document.getElementById('rx-effective-date');
    const inputEffectiveTime = document.getElementById('rx-effective-time');
    const inputOrderNote = document.getElementById('rx-order-note');
    
    // Record Meta
    const selectRxDvm = document.getElementById('rx-dvm');
    const selectRxDept = document.getElementById('rx-dept');

    // --- Initialize Date/Time Defaults ---
    if (inputEffectiveDate && inputEffectiveTime) {
        const now = new Date();
        inputEffectiveDate.value = now.toISOString().split('T')[0];
        inputEffectiveTime.value = now.toTimeString().slice(0, 5);
    }

    // Helper: Auto-resize Textarea
    const autoResize = (el) => {
        if (!el) return;
        el.style.height = 'auto'; 
        el.style.height = el.scrollHeight + 'px'; 
    };

    if (inputDrugLabel) {
        inputDrugLabel.addEventListener('input', () => autoResize(inputDrugLabel));
    }

    let currentItem = null;

    // --- 1. Render Categories ---
    function renderRxCategories() {
        if (!categoryList) return;
        categoryList.innerHTML = '';
        
        if (typeof rxServiceCatalog === 'undefined') return;

        Object.keys(rxServiceCatalog).forEach(key => {
            const cat = rxServiceCatalog[key];
            const li = document.createElement('li');
            
            li.className = "p-3 cursor-pointer hover:bg-orange-50 dark:hover:bg-[--color-bg-secondary] border-b border-gray-100 dark:border-[--color-border-base] flex items-center space-x-3 transition-colors last:border-0";
            
            li.innerHTML = `
                <div class="p-2 bg-white dark:bg-[--color-bg-base] rounded-full border border-gray-200 dark:border-[--color-border-base] shadow-sm text-orange-700 dark:text-orange-500">
                    <i data-lucide="${cat.icon}" class="w-4 h-4"></i>
                </div>
                <span class="font-medium text-gray-700 dark:text-[--color-text-base]">${cat.name}</span>
            `;
            
            li.addEventListener('click', () => {
                Array.from(categoryList.children).forEach(c => {
                    c.classList.remove('bg-orange-50', 'dark:bg-orange-900/20', 'border-l-4', 'border-orange-600');
                    c.classList.add('border-transparent');
                });
                li.classList.remove('border-transparent');
                li.classList.add('bg-orange-50', 'dark:bg-orange-900/20', 'border-l-4', 'border-orange-600');
                
                if(searchInput) searchInput.value = ""; 
                currentRxCategory = key;
                renderRxItems(key);
            });
            categoryList.appendChild(li);
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // --- 2. Render Items ---
    function renderRxItems(catKey, filterText = "") {
        const cat = rxServiceCatalog[catKey];
        if (!cat) return;
        
        currentCatName.innerText = cat.name;
        itemList.innerHTML = '';
        
        const itemsToRender = cat.items.filter(item => {
            if (!filterText) return true;
            return item.name.toLowerCase().includes(filterText.toLowerCase()) || 
                   item.id.toLowerCase().includes(filterText.toLowerCase());
        });

        if (itemsToRender.length === 0) {
            itemList.innerHTML = `<li class="text-center text-gray-400 mt-10 text-sm">No items found matching "${filterText}"</li>`;
            return;
        }
        
        itemsToRender.forEach(item => {
            const li = document.createElement('li');
            li.className = "p-3 bg-white dark:bg-[--color-bg-content] border border-gray-200 dark:border-[--color-border-base] rounded-lg shadow-sm hover:shadow-md hover:border-orange-300 cursor-pointer transition-all flex justify-between items-center group mb-2";
            
            const containerBadge = (item.container && item.container !== '-') 
                ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-gray-500 text-white ml-2" title="Container">${item.container}</span>` 
                : '';
            
            const unitBadge = item.used_unit 
                ? `<span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200 ml-1 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600" title="Used Unit">${item.used_unit}</span>` 
                : '';
            
            li.innerHTML = `
                <div class="flex-1">
                    <div class="flex items-center">
                        <span class="font-semibold text-gray-800 dark:text-[--color-text-base] group-hover:text-orange-700 transition-colors text-sm">${item.name}</span>
                    </div>
                    <div class="text-xs text-gray-500 dark:text-[--color-text-muted] mt-1.5 flex items-center">
                        <span class="font-mono text-[10px] text-gray-400 mr-1">${item.id}</span>
                        ${containerBadge}
                        ${unitBadge}
                    </div>
                </div>
                <div class="text-sm font-bold text-orange-700 dark:text-orange-500 ml-2 whitespace-nowrap">${item.price}.-</div>
            `;
            
            li.addEventListener('click', () => selectRxItem(item));
            itemList.appendChild(li);
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // --- 3. Selection Logic ---
    function selectRxItem(item) {
        currentItem = item;
        
        selectedInfoBox.classList.remove('hidden');
        selectedNameEl.innerText = item.name;
        selectedCodeEl.innerText = `Code: ${item.id} | Price: ${item.price}.- | ${item.used_unit}`;
        
        if (inputDrugLabel) {
            inputDrugLabel.value = item.default_label || "";
            autoResize(inputDrugLabel); 
            inputDrugLabel.focus(); 
        }
        
        btnAddToCart.disabled = false;
    }

    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (currentRxCategory) {
                renderRxItems(currentRxCategory, e.target.value);
            }
        });
    }

    // --- 5. Cart Logic ---
    if (btnAddToCart) {
        btnAddToCart.addEventListener('click', () => {
            if (!currentItem) return;
            
            const label = inputDrugLabel ? inputDrugLabel.value.trim() : "";
            if (!label && currentItem.default_label) {
                alert("Please specify Drug Label / Instruction.");
                inputDrugLabel.focus();
                return;
            }

            addToRxCart({
                ...currentItem,
                label: label,
                qty: "1" 
            });

            inputDrugLabel.value = "";
            selectedInfoBox.classList.add('hidden');
            btnAddToCart.disabled = true;
            currentItem = null;
        });
    }

    function addToRxCart(item) {
        const existing = globalRxCart.find(i => i.id === item.id);
        if (existing) {
            alert("This item is already in the list. Please remove it first if you want to add again.");
            return;
        }
        globalRxCart.push(item);
        updateRxCartUI();
    }

    function updateRxCartUI() {
        miniCartList.innerHTML = '';
        let total = 0;
        
        if (globalRxCart.length === 0) {
            miniCartList.innerHTML = '<li class="text-center text-xs text-gray-400 italic py-2">No items added yet</li>';
            totalPriceEl.innerText = "0 / 0";
            return;
        }

        globalRxCart.forEach((item, index) => {
            const qty = parseFloat(item.qty) || 0;
            const itemTotal = item.price * qty;
            total += itemTotal;
            
            const li = document.createElement('li');
            li.className = "bg-white dark:bg-[--color-bg-content] p-2 rounded border border-gray-200 dark:border-[--color-border-base] flex flex-col gap-2 shadow-sm";
            
            li.innerHTML = `
                <div class="flex justify-between items-start w-full">
                    <div class="flex flex-col mr-2 flex-1">
                        <span class="font-bold text-xs text-gray-700 dark:text-[--color-text-base] truncate">${item.name}</span>
                        
                        ${(item.container && item.container !== '-') 
                            ? `<div class="mt-1"><span class="px-2 py-0.5 rounded text-[10px] bg-gray-500 text-white inline-block">${item.container}</span></div>` 
                            : ''}
                    </div>
                    
                    <div class="flex items-center gap-2 flex-shrink-0 mt-0.5">
                         <div class="relative">
                            <input type="text" readonly id="rx-qty-${index}" value="${item.qty}" data-index="${index}"
                                   class="rx-qty-input w-12 p-1 text-center text-xs border border-orange-300 rounded bg-white focus:ring-1 focus:ring-orange-500 outline-none text-gray-700 cursor-pointer">
                        </div>
                        <span class="text-[10px] text-black dark:text-[--color-text-base] w-8 text-left">${item.used_unit || ''}</span>
                        
                        <div class="flex items-center pl-2 border-l border-gray-100 dark:border-[--color-border-base] ml-2">
                            <span class="text-xs font-bold text-gray-600 dark:text-[--color-text-muted] min-w-[30px] text-right">${itemTotal.toLocaleString()}</span>
                            <button class="text-gray-400 hover:text-red-500 btn-remove-rx p-1 rounded hover:bg-red-50 transition-colors ml-1" data-index="${index}">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="w-full">
                    <textarea rows="1" data-index="${index}"
                        class="rx-label-input w-full text-[11px] text-orange-700 dark:text-orange-400 p-1.5 border border-orange-100 rounded bg-orange-50 focus:ring-1 focus:ring-orange-500 outline-none overflow-hidden resize-none placeholder-orange-300"
                        placeholder="ระบุฉลากยา...">${item.label || ''}</textarea>
                </div>
            `;
            miniCartList.appendChild(li);
        });

        totalPriceEl.innerText = `${globalRxCart.length} / ${total.toLocaleString()}`;
        
        // Bind Events
        document.querySelectorAll('.btn-remove-rx').forEach(btn => {
            btn.addEventListener('click', (e) => {
                globalRxCart.splice(parseInt(e.currentTarget.dataset.index), 1);
                updateRxCartUI();
            });
        });

        // Numpad Trigger
        document.querySelectorAll('.rx-qty-input').forEach(input => {
            input.addEventListener('click', (e) => {
                const numpadModal = document.getElementById('numpad-modal');
                const targetIdField = document.getElementById('numpad-target-id');
                if(numpadModal && targetIdField) {
                    targetIdField.value = e.target.id; 
                    numpadModal.classList.remove('hidden');
                }
            });
        });

        // Sync Logic from Numpad
        const numpadModal = document.getElementById('numpad-modal');
        if(numpadModal && !numpadModal.dataset.rxListener) {
            numpadModal.addEventListener('click', () => {
                setTimeout(() => {
                    const inputs = document.querySelectorAll('.rx-qty-input');
                    let needsUpdate = false;
                    inputs.forEach(inp => {
                        const idx = parseInt(inp.dataset.index);
                        if(globalRxCart[idx] && globalRxCart[idx].qty !== inp.value) {
                            globalRxCart[idx].qty = inp.value; 
                            needsUpdate = true;
                        }
                    });
                    if(needsUpdate) updateRxCartUI();
                }, 50);
            });
            numpadModal.dataset.rxListener = "true";
        }

        document.querySelectorAll('.rx-label-input').forEach(input => {
            autoResize(input); 
            input.addEventListener('input', (e) => {
                autoResize(e.target);
                const idx = parseInt(e.target.dataset.index);
                globalRxCart[idx].label = e.target.value;
            });
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // --- 6. Submission Logic ---
    function handleRxSubmission(actionType) {
        if (globalRxCart.length === 0) return alert("Rx List is empty.");
        
        const pharmacyNote = inputPharmacyNote ? inputPharmacyNote.value.trim() : "";
        const orderNoteText = inputOrderNote ? inputOrderNote.value.trim() : "";
        
        const dvmValue = selectRxDvm ? selectRxDvm.value : "";
        const deptValue = selectRxDept ? selectRxDept.value : "";

        const now = new Date();
        const orderNo = `ORD-RX${now.getFullYear().toString().slice(-2)}${(Math.random() * 10000).toFixed(0).padStart(4, '0')}`;
        let orderStatus, accNo;
        
        if (actionType === 'plan') { 
            orderStatus = "Pending"; accNo = null; 
        } else { 
            orderStatus = "Done"; accNo = `RX-${now.getFullYear().toString().slice(-2)}${(Math.random() * 10000).toFixed(0).padStart(4, '0')}`; 
        }

        let effectiveStr = formatKAHISDateTime(now);
        if (inputEffectiveDate && inputEffectiveTime && inputEffectiveDate.value && inputEffectiveTime.value) {
            const effDateObj = new Date(`${inputEffectiveDate.value}T${inputEffectiveTime.value}`);
            effectiveStr = formatKAHISDateTime(effDateObj);
        }

        const newEntry = {
            entry_id: `E-RX${Date.now()}`,
            order_no: orderNo,
            acc_no: accNo,
            activity_type: "Order Rx",
            order_status: orderStatus,
            lis_process_status: (orderStatus === 'Done') ? "Waiting" : null,
            hn: "52039575", pet_name: "คุณส้มจี๊ด(จี๊ดจ๊าด)", owner_name: "คุณพ่อส้มจี๊ด",
            effective_time: effectiveStr,
            order_create_date: formatKAHISDateTime(now),
            order_update_date: formatKAHISDateTime(now),
            request_date: (actionType === 'send') ? formatKAHISDateTime(now) : null,
            order_note: orderNoteText,
            parameters: { 
                items: globalRxCart.map(i => ({ 
                    id: i.id, name: i.name, qty: i.qty, unit: i.used_unit, label: i.label, container: i.container, price: i.price
                })), 
                pharmacy_note: pharmacyNote 
            },
            recorded_by: "User (Login)", 
            dvm: dvmValue || "Dr. Login", 
            department: deptValue || "101", 
            last_updated_by: "User (Login)", last_updated_on: formatKAHISDateTime(now), 
            disable_remark: ""
        };

        activityLogData.unshift(newEntry); 

        if (actionType === 'send') {
            if (typeof showSuccessModal === 'function') {
                // Pass extra notes to Modal
                showSuccessModal(accNo, globalRxCart, totalPriceEl.innerText.split('/')[1].trim(), { 
                    orderNo: orderNo,
                    dvm: dvmValue,
                    dept: deptValue,
                    priority: "Routine",
                    info: "Sent to Pharmacy",
                    pharmacyNote: pharmacyNote, // New
                    orderNote: orderNoteText // New
                });
            } else {
                alert(`Order Rx Confirmed!\nAcc No: ${accNo}`);
            }
        } else {
            alert(`Rx Plan Saved!\nOrder No: ${orderNo}\nStatus: Pending`);
        }

        // Clear UI
        globalRxCart = [];
        updateRxCartUI();
        if(inputPharmacyNote) inputPharmacyNote.value = "";
        if(inputOrderNote) inputOrderNote.value = "";
        selectedInfoBox.classList.add('hidden');
        btnAddToCart.disabled = true;
    }

    // --- 7. Print Modal Logic (New) ---
    function openRxPrintModal(items) {
        if (!printList || !printModal) return;
        printList.innerHTML = '';
        
        items.forEach(item => {
            const li = document.createElement('li');
            li.className = "bg-white dark:bg-[--color-bg-content] p-3 rounded border border-gray-200 dark:border-[--color-border-base] shadow-sm flex justify-between items-center";
            
            // Multiline Label Display
            const labelDisplay = item.label ? item.label.replace(/\n/g, '<br>') : '-';
            
            li.innerHTML = `
                <div class="flex-1 text-sm">
                    <div class="font-bold text-gray-800 dark:text-[--color-text-base]">${item.name} <span class="text-gray-500 font-normal">x${item.qty} ${item.unit||item.used_unit||''}</span></div>
                    <div class="text-xs text-orange-600 dark:text-orange-400 mt-1 pl-2 border-l-2 border-orange-200 leading-relaxed">${labelDisplay}</div>
                </div>
                <button class="ml-3 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-xs font-bold transition-colors btn-print-pdf">
                    <i data-lucide="printer" class="w-3 h-3 inline mr-1"></i> Print PDF
                </button>
            `;
            
            // Bind Print Alert
            li.querySelector('.btn-print-pdf').addEventListener('click', () => {
                alert(`สร้าง PDF ฉลากยา: ${item.name}\n(Mockup Function)`);
            });
            
            printList.appendChild(li);
        });
        
        printModal.classList.remove('hidden');
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }
    
    // Expose to Global for app-init.js
    window.openRxPrintModal = openRxPrintModal;

    const closePrintModal = () => {
        if (printModal) printModal.classList.add('hidden');
    };

    if(closePrintX) closePrintX.addEventListener('click', closePrintModal);
    if(closePrintBtn) closePrintBtn.addEventListener('click', closePrintModal);
    if(printModal) printModal.addEventListener('click', (e) => { if(e.target === printModal) closePrintModal(); });


    // --- 8. Re-med Logic (Updated) ---
    if (btnOpenReMed) {
        btnOpenReMed.addEventListener('click', (e) => {
            e.preventDefault();
            if (remedModal) {
                remedModal.classList.remove('hidden');
                renderReMedTable();
            }
        });
    }

    const closeReMed = () => {
        if (remedModal) remedModal.classList.add('hidden');
    };

    if (closeRemedX) closeRemedX.addEventListener('click', closeReMed);
    if (closeRemedBtn) closeRemedBtn.addEventListener('click', closeReMed);
    if (remedModal) remedModal.addEventListener('click', (e) => { if (e.target === remedModal) closeReMed(); });

    function renderReMedTable() {
        if (!remedTableBody || typeof window.rxHistoryData === 'undefined') return;
        remedTableBody.innerHTML = '';

        window.rxHistoryData.forEach(order => {
            const row = document.createElement('tr');
            row.className = "hover:bg-gray-50 dark:hover:bg-[--color-bg-secondary] border-b border-gray-100 dark:border-[--color-border-base] transition-colors";
            
            const itemsSummary = order.items.map(i => `<div>• ${i.name} <span class="text-gray-400">x${i.qty}</span></div>`).join('');
            
            let statusBadge = '';
            if (order.status === 'Done') statusBadge = `<span class="px-2 py-0.5 rounded text-xs bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/50 dark:text-green-200">${order.status_display}</span>`;
            else if (order.status === 'Pending') statusBadge = `<span class="px-2 py-0.5 rounded text-xs bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-200">${order.status_display}</span>`;
            else statusBadge = `<span class="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-700 dark:text-gray-300">${order.status_display}</span>`;

            const canSelect = true; 
            
            // Button Styling: Select (Green), Print (Blue - Only if Done)
            const canPrint = (order.status === 'Done' && order.acc_no);
            const printBtnClass = canPrint ? "bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-200" : "bg-gray-100 text-gray-400 cursor-not-allowed";

            row.innerHTML = `
                <td class="p-3 text-xs text-gray-700 dark:text-[--color-text-base] whitespace-nowrap align-top">${order.datetime_effective}</td>
                <td class="p-3 text-xs text-gray-500 font-mono whitespace-nowrap align-top">${order.order_no}</td>
                <td class="p-3 text-xs text-blue-600 font-bold font-mono whitespace-nowrap align-top">${order.acc_no || '-'}</td>
                <td class="p-3 text-xs text-gray-700 dark:text-[--color-text-base] align-top whitespace-pre-wrap">${itemsSummary}</td>
                <td class="p-3 text-xs text-gray-600 align-top">${order.order_note || '-'}</td>
                <td class="p-3 text-xs text-gray-500 align-top italic">${order.pharmacy_note}</td>
                <td class="p-3 text-xs text-gray-700 dark:text-[--color-text-base] align-top">${order.dvm}</td>
                <td class="p-3 text-xs text-gray-700 dark:text-[--color-text-base] align-top">${order.department || '-'}</td>
                <td class="p-3 text-center align-top">${statusBadge}</td>
                <td class="p-3 text-center align-top sticky right-0 bg-white dark:bg-[--color-bg-content] shadow-l border-l border-gray-100 dark:border-[--color-border-base]">
                    <div class="flex flex-col gap-2">
                        <button class="px-3 py-1 rounded text-xs font-bold transition-all bg-orange-500 hover:bg-orange-600 text-white shadow-sm btn-select-remed">
                            Select
                        </button>
                        <button class="px-3 py-1 rounded text-xs font-bold transition-all ${printBtnClass} btn-print-remed" ${!canPrint ? 'disabled' : ''}>
                            <i data-lucide="printer" class="w-3 h-3 inline"></i> Print
                        </button>
                    </div>
                </td>
            `;
            
            // Bind Select
            row.querySelector('.btn-select-remed').onclick = () => selectReMedOrder(order);
            
            // Bind Print
            if (canPrint) {
                row.querySelector('.btn-print-remed').onclick = () => openRxPrintModal(order.items);
            }

            remedTableBody.appendChild(row);
        });
    }

    function selectReMedOrder(order) {
        if (!confirm(`Load ${order.items.length} items from Order ${order.order_no}?`)) return;
        
        let addedCount = 0;
        order.items.forEach(item => {
            if(!globalRxCart.find(i => i.id === item.id)) {
                globalRxCart.push({
                    ...item, 
                    qty: item.qty || "1" 
                });
                addedCount++;
            }
        });
        
        updateRxCartUI();
        closeReMed();
        
        if(addedCount < order.items.length) {
            alert(`Added ${addedCount} items. (${order.items.length - addedCount} items were duplicates).`);
        }
    }

    // --- 9. Bind Events ---
    if (btnSavePlan) btnSavePlan.onclick = (e) => { e.preventDefault(); handleRxSubmission('plan'); };
    if (btnConfirm) btnConfirm.onclick = (e) => { e.preventDefault(); handleRxSubmission('send'); };

    // --- Initial Call ---
    renderRxCategories();
}