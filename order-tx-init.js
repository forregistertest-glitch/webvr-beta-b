// This is order-tx-init.js
// Controller logic for Order Tx (Treatment) Module
// Theme: Blue (Vital Signs style)

let globalTxCart = []; // Local cart for Tx module

function initializeOrderTxScripts() {
    console.log("Initialize Order Tx Module");

    // --- DOM Elements ---
    const categoryList = document.getElementById('tx-category-list');
    const itemList = document.getElementById('tx-item-list');
    const currentCatName = document.getElementById('tx-current-cat-name');
    const cartBody = document.getElementById('tx-cart-body');
    const totalPriceEl = document.getElementById('tx-total-price');
    
    const btnSavePlan = document.getElementById('btn-save-tx-plan');
    const btnConfirm = document.getElementById('btn-confirm-tx-order');
    
    // Form Inputs
    const inputEffectiveDate = document.getElementById('tx-effective-date');
    const inputEffectiveTime = document.getElementById('tx-effective-time');
    const inputNote = document.getElementById('tx-order-note');
    const checkContinuous = document.getElementById('tx-continuous');

    // --- Initialize Date/Time Defaults ---
    if (inputEffectiveDate && inputEffectiveTime) {
        const now = new Date();
        inputEffectiveDate.value = now.toISOString().split('T')[0];
        inputEffectiveTime.value = now.toTimeString().slice(0, 5);
    }

    // --- 1. Render Categories (Blue Theme) ---
    function renderTxCategories() {
        if (!categoryList) return;
        categoryList.innerHTML = '';
        
        if (typeof txServiceCatalog === 'undefined') return;

        Object.keys(txServiceCatalog).forEach(key => {
            const cat = txServiceCatalog[key];
            const li = document.createElement('li');
            
            li.className = "p-3 cursor-pointer hover:bg-blue-50 dark:hover:bg-[--color-bg-secondary] border-b border-gray-100 dark:border-[--color-border-base] flex items-center space-x-3 transition-colors last:border-0";
            
            li.innerHTML = `
                <div class="p-2 bg-white dark:bg-[--color-bg-base] rounded-full border border-gray-200 dark:border-[--color-border-base] shadow-sm text-blue-600">
                    <i data-lucide="${cat.icon}" class="w-4 h-4"></i>
                </div>
                <span class="font-medium text-gray-700 dark:text-[--color-text-base]">${cat.name}</span>
            `;
            
            li.addEventListener('click', () => {
                Array.from(categoryList.children).forEach(c => {
                    c.classList.remove('bg-blue-50', 'dark:bg-blue-900/20', 'border-l-4', 'border-blue-500');
                    c.classList.add('border-transparent');
                });
                li.classList.remove('border-transparent');
                li.classList.add('bg-blue-50', 'dark:bg-blue-900/20', 'border-l-4', 'border-blue-500');
                
                renderTxItems(key);
            });
            categoryList.appendChild(li);
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // --- 2. Render Items (Blue Theme) ---
    function renderTxItems(catKey) {
        const cat = txServiceCatalog[catKey];
        if (!cat) return;
        
        currentCatName.innerText = cat.name;
        itemList.innerHTML = '';
        
        cat.items.forEach(item => {
            const li = document.createElement('li');
            li.className = "p-3 bg-white dark:bg-[--color-bg-content] border border-gray-200 dark:border-[--color-border-base] rounded-lg shadow-sm hover:shadow-md hover:border-blue-300 cursor-pointer transition-all flex justify-between items-center group mb-2";
            
            const containerBadge = item.container ? `<span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200 ml-2 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">${item.container}</span>` : '';
            
            li.innerHTML = `
                <div class="flex-1">
                    <div class="flex items-center">
                        <span class="font-semibold text-gray-800 dark:text-[--color-text-base] group-hover:text-blue-600 transition-colors">${item.name}</span>
                    </div>
                    <div class="text-xs text-gray-500 dark:text-[--color-text-muted] mt-1 flex items-center">
                        Code: ${item.id} ${containerBadge}
                    </div>
                </div>
                <div class="text-sm font-bold text-blue-600 dark:text-blue-400 ml-2 whitespace-nowrap">${item.price}.-</div>
            `;
            
            li.addEventListener('click', () => addToTxCart(item));
            itemList.appendChild(li);
        });
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // --- 3. Cart Logic (Updated: Numpad Integration) ---
    function addToTxCart(item) {
        if (globalTxCart.find(i => i.id === item.id)) return;
        
        // Clone item and add default qty (Empty as requested)
        const cartItem = { ...item, qty: "" };
        globalTxCart.push(cartItem);
        updateTxCartUI();
    }

    function updateTxCartUI() {
        cartBody.innerHTML = '';
        let total = 0;
        
        if (globalTxCart.length === 0) {
            cartBody.innerHTML = '<tr><td colspan="3" class="p-4 text-center text-gray-400 text-xs">No items selected</td></tr>';
            totalPriceEl.innerText = "0";
            return;
        }

        globalTxCart.forEach((item, index) => {
            // Calculate total (Handle empty qty as 0 for calculation)
            const qtyVal = (item.qty === "" || item.qty === null) ? 0 : parseFloat(item.qty);
            const itemTotal = item.price * qtyVal;
            total += itemTotal;
            
            const tr = document.createElement('tr');
            tr.className = "group hover:bg-gray-50 dark:hover:bg-[--color-bg-secondary] border-b border-gray-100 dark:border-[--color-border-base] last:border-0";
            
            tr.innerHTML = `
                <td class="p-3 pl-4 align-middle w-full">
                    <div class="flex items-center justify-between">
                        <div class="font-semibold text-gray-800 dark:text-[--color-text-base] text-xs mr-2">
                            ${item.name}
                        </div>
                        <div class="flex items-center space-x-2 flex-shrink-0">
                            <div class="relative">
                                <input type="text" readonly id="tx-qty-${index}" value="${item.qty}" placeholder="-" 
                                       class="w-12 p-1 text-center text-xs border border-blue-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none bg-white dark:bg-[--color-bg-base] dark:border-[--color-border-base] dark:text-[--color-text-base] cursor-pointer tx-qty-input" 
                                       data-index="${index}">
                            </div>
                            <span class="text-xs font-bold text-blue-600 dark:text-blue-400 w-8 text-left">${item.container}</span>
                        </div>
                    </div>
                </td>
                <td class="p-3 text-right align-middle text-gray-600 dark:text-[--color-text-muted] text-xs font-bold whitespace-nowrap">
                    ${item.price}
                </td>
                <td class="p-3 text-center align-middle w-10">
                    <button class="text-gray-400 hover:text-red-600 transition-colors btn-remove-tx p-0.5 hover:bg-red-50 rounded" data-index="${index}">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </td>
            `;
            cartBody.appendChild(tr);
        });

        totalPriceEl.innerText = total.toLocaleString();
        
        // 1. Bind Remove Buttons
        document.querySelectorAll('.btn-remove-tx').forEach(btn => {
            btn.addEventListener('click', (e) => {
                globalTxCart.splice(parseInt(e.currentTarget.dataset.index), 1);
                updateTxCartUI();
            });
        });

        // 2. Bind Numpad Trigger to Inputs
        document.querySelectorAll('.tx-qty-input').forEach(input => {
            input.addEventListener('click', (e) => {
                const numpadModal = document.getElementById('numpad-modal');
                const targetIdField = document.getElementById('numpad-target-id');
                if(numpadModal && targetIdField) {
                    targetIdField.value = e.target.id; // Send unique ID to numpad
                    numpadModal.classList.remove('hidden');
                }
            });
        });

        // 3. Sync Logic: Detect value changes from Numpad to update Total Price
        const numpadModal = document.getElementById('numpad-modal');
        if(numpadModal && !numpadModal.dataset.txListener) {
            numpadModal.addEventListener('click', () => {
                // Wait for Numpad script to update DOM, then sync back to Cart Model
                setTimeout(() => {
                    const inputs = document.querySelectorAll('.tx-qty-input');
                    let needsUpdate = false;
                    inputs.forEach(inp => {
                        const idx = inp.dataset.index;
                        if(globalTxCart[idx] && globalTxCart[idx].qty !== inp.value) {
                            globalTxCart[idx].qty = inp.value; // Sync DOM -> Model
                            needsUpdate = true;
                        }
                    });
                    // If value changed, re-render to update Total Price
                    if(needsUpdate) updateTxCartUI();
                }, 50);
            });
            numpadModal.dataset.txListener = "true"; // Prevent multiple listeners
        }
        
        if (typeof lucide !== 'undefined') lucide.createIcons();
    }

    // --- 4. Submission Logic ---
    function handleTxSubmission(actionType) {
        if (globalTxCart.length === 0) return alert("Please select at least one item.");
        
        const now = new Date();
        const orderNo = `ORD-TX${now.getFullYear().toString().slice(-2)}${(Math.random() * 10000).toFixed(0).padStart(4, '0')}`;
        
        let orderStatus, accNo;
        if (actionType === 'plan') { 
            orderStatus = "Pending"; 
            accNo = null; 
        } else { 
            orderStatus = "Done"; 
            accNo = `TX-${now.getFullYear().toString().slice(-2)}${(Math.random() * 10000).toFixed(0).padStart(4, '0')}`; 
        }

        let effectiveStr = formatKAHISDateTime(now);
        if (inputEffectiveDate && inputEffectiveTime && inputEffectiveDate.value && inputEffectiveTime.value) {
            const effDateObj = new Date(`${inputEffectiveDate.value}T${inputEffectiveTime.value}`);
            effectiveStr = formatKAHISDateTime(effDateObj);
        }
        
        const noteText = inputNote ? inputNote.value.trim() : "";
        const isContinuous = checkContinuous ? checkContinuous.checked : false;
        const priority = document.querySelector('input[name="tx_priority"]:checked')?.value || 'Routine';

        const newEntry = {
            entry_id: `E-TX${Date.now()}`,
            order_no: orderNo,
            acc_no: accNo,
            activity_type: "Tx", 
            order_status: orderStatus,
            lis_process_status: null,
            hn: "52039575", pet_name: "คุณส้มจี๊ด(จี๊ดจ๊าด)", owner_name: "คุณพ่อส้มจี๊ด",
            effective_time: effectiveStr,
            order_create_date: formatKAHISDateTime(now),
            order_update_date: formatKAHISDateTime(now),
            target_time: (actionType === 'plan') ? effectiveStr : null,
            order_note: noteText,
            parameters: { 
                items: globalTxCart.map(i => ({ id: i.id, name: i.name, qty: i.qty, unit: i.container })), 
                full_items: [...globalTxCart], 
                priority: priority, 
                continuous: isContinuous, 
                note: noteText 
            },
            recorded_by: "User (Login)", dvm: "Dr. Login", department: "101",
            last_updated_by: "User (Login)", last_updated_on: formatKAHISDateTime(now), 
            disable_remark: ""
        };

        if (typeof activityLogData !== 'undefined') {
            activityLogData.push(newEntry);
        }

        if (actionType === 'send') {
            if (typeof showSuccessModal === 'function') {
                showSuccessModal(accNo, globalTxCart, totalPriceEl.innerText, { priority: priority, info: isContinuous ? "Continuous" : "" });
            } else {
                alert(`Order Tx Confirmed!\nAcc No: ${accNo}`);
            }
        } else {
            alert(`Tx Order Plan Saved!\nOrder No: ${orderNo}\nStatus: Pending`);
        }
        
        globalTxCart = [];
        updateTxCartUI();
        if(inputNote) inputNote.value = "";
        if(checkContinuous) checkContinuous.checked = false;
        const routineRadio = document.getElementById('tx-prio-routine');
        if(routineRadio) routineRadio.checked = true;
    }

    // --- 5. Bind Events ---
    if (btnSavePlan) btnSavePlan.onclick = (e) => { e.preventDefault(); handleTxSubmission('plan'); };
    if (btnConfirm) btnConfirm.onclick = (e) => { e.preventDefault(); handleTxSubmission('send'); };

    // --- Initial Call ---
    renderTxCategories();
    updateTxCartUI(); 
}