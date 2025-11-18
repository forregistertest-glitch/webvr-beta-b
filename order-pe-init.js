// This is order-pe-init.js (BETA 3.2 - Updated File)
// ทำหน้าที่ "เริ่มต้นการทำงาน" (Initialize) ของโมดูล Order PE

// (ตัวแปรชั่วคราวสำหรับเก็บ Order ที่เลือกไว้ก่อนกด Save Set)
let currentOrderSet = [];

// (ฟังก์ชันนี้จะถูกเรียกโดย app-logic.js)
function initializeOrderPEScripts() {
    
    // --- 1. ค้นหา Element ที่ต้องใช้ ---
    const btnOrderVitals = document.getElementById('btn-order-pe-vitals');
    const btnOrderEye = document.getElementById('btn-order-pe-eye');
    // (*** ใหม่: เพิ่ม 2 ปุ่มสีเทา ***)
    const btnOrderOtherA = document.getElementById('btn-order-pe-other-a');
    const btnOrderOtherB = document.getElementById('btn-order-pe-other-b');

    const btnSaveOrderSet = document.getElementById('btn-save-order-set');
    const orderSummaryList = document.getElementById('pe-order-summary-list');
    const summaryPlaceholder = document.getElementById('pe-summary-placeholder');

    // (Elements ของ Modal Order Note)
    const noteModal = document.getElementById('order-note-modal');
    const noteModalClose = document.getElementById('btn-note-modal-close');
    const noteModalCancel = document.getElementById('btn-note-modal-cancel');
    const noteModalAdd = document.getElementById('btn-note-modal-add');
    const noteModalItemName = document.getElementById('note-modal-item-name');
    const noteModalItemType = document.getElementById('note-modal-item-type');
    const noteModalTextarea = document.getElementById('note-modal-textarea');

    // (Elements ของ Target)
    const targetDateInput = document.getElementById('pe-target-date');
    const targetTimeInput = document.getElementById('pe-target-time');
    const targetDvmInput = document.getElementById('pe-target-dvm');
    const targetDeptInput = document.getElementById('pe-target-dept');

    // (ล้างค่า Order Set ชั่วคราวทุกครั้งที่โหลดหน้านี้)
    currentOrderSet = [];
    updateOrderSummaryUI();

    // --- 2. Logic การเปิด Modal Order Note ---
    function openOrderNoteModal(itemType, itemName) {
        noteModalItemName.textContent = itemName;
        noteModalItemType.value = itemType;
        noteModalTextarea.value = ""; // เคลียร์ Note เก่า
        noteModal.classList.remove('hidden');
    }
    
    function closeOrderNoteModal() {
        noteModal.classList.add('hidden');
    }
    
    if (btnOrderVitals) {
        btnOrderVitals.addEventListener('click', () => {
            openOrderNoteModal('Vital Signs', 'Vital Signs');
        });
    }
    if (btnOrderEye) {
        btnOrderEye.addEventListener('click', () => {
            openOrderNoteModal('Eye Exam', 'Eye Exam');
        });
    }

    // (*** ใหม่: ผูก Event ให้ 2 ปุ่มสีเทา ***)
    if (btnOrderOtherA) {
        btnOrderOtherA.addEventListener('click', () => {
            openOrderNoteModal('Other A', 'Order Other A (Test)');
        });
    }
    if (btnOrderOtherB) {
        btnOrderOtherB.addEventListener('click', () => {
            openOrderNoteModal('Other B', 'Order Other B (Test)');
        });
    }
    
    // (ผูก Event ให้ปุ่มใน Modal)
    if (noteModalClose) noteModalClose.addEventListener('click', closeOrderNoteModal);
    if (noteModalCancel) noteModalCancel.addEventListener('click', closeOrderNoteModal);

    // --- 3. Logic การเพิ่ม Order เข้า Set ชั่วคราว ---
    if (noteModalAdd) {
        noteModalAdd.addEventListener('click', () => {
            const itemType = noteModalItemType.value;
            const itemNote = noteModalTextarea.value;

            // (เพิ่ม Item เข้า Array ชั่วคราว)
            currentOrderSet.push({
                type: itemType,
                note: itemNote
            });
            
            // (อัปเดต UI สรุป)
            updateOrderSummaryUI();
            closeOrderNoteModal();
        });
    }

    function updateOrderSummaryUI() {
        if (!orderSummaryList || !summaryPlaceholder) return;
        
        if (currentOrderSet.length === 0) {
            orderSummaryList.innerHTML = ''; // ล้างของเก่า
            summaryPlaceholder.classList.remove('hidden');
        } else {
            summaryPlaceholder.classList.add('hidden');
            orderSummaryList.innerHTML = ''; // เริ่มใหม่
            
            currentOrderSet.forEach((item, index) => {
                const li = document.createElement('li');
                li.className = "flex justify-between items-center bg-white dark:bg-[--color-bg-content] p-2 rounded shadow-sm";
                li.innerHTML = `
                    <div>
                        <span class="font-semibold text-gray-800 dark:text-[--color-text-base]">${item.type}</span>
                        <p class="text-gray-600 dark:text-[--color-text-muted]">${item.note || '(No note)'}</p>
                    </div>
                    <button data-index="${index}" class="btn-remove-order-item text-gray-400 hover:text-red-500 dark:text-[--color-text-muted] dark:hover:text-red-400">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                `;
                orderSummaryList.appendChild(li);
            });

            // (ผูก Event ให้ปุ่มลบ)
            document.querySelectorAll('.btn-remove-order-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const indexToRemove = parseInt(e.currentTarget.dataset.index, 10);
                    currentOrderSet.splice(indexToRemove, 1); // ลบออกจาก Array
                    updateOrderSummaryUI(); // วาด UI ใหม่
                });
            });
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    // --- 4. Logic การ Save Order Set (Workflow B) ---
    if (btnSaveOrderSet) {
        btnSaveOrderSet.addEventListener('click', () => {
            
            // (ดึงข้อมูล Target)
            const targetDate = targetDateInput.value;
            const targetTime = targetTimeInput.value;
            const targetDvm = targetDvmInput.value;
            const targetDept = targetDeptInput.value;

            if (!targetDate || !targetTime) {
                alert("Please select Target Date and Time.");
                return;
            }
            if (currentOrderSet.length === 0) {
                alert("Please add at least one order.");
                return;
            }

            // (สร้าง Target Timestamp)
            // (*** FIX: ใช้ formatKAHISDateTime จาก app-init.js ***)
            const targetTimestamp = formatKAHISDateTime(new Date(`${targetDate}T${targetTime}`));
            
            // (สร้างเวลาที่บันทึกจริง)
            // (*** FIX: ใช้ formatKAHISDateTime จาก app-init.js ***)
            const recordTimestamp = formatKAHISDateTime(new Date()); 
            const orderNo = `ORD-${Date.now()}`;
            const loginUser = "User (Login)"; // (สมมติ User ที่ Login)

            // (วนลูป Array ชั่วคราว เพื่อสร้าง Entry จริง)
            currentOrderSet.forEach(item => {
                
                const newEntry = {
                    entry_id: `E-${Date.now()}-${Math.random()}`,
                    order_no: orderNo,
                    acc_no: null,
                    activity_type: item.type,
                    status: "Order", // สถานะคือ "Order"
                    
                    effective_time: null,
                    target_time: targetTimestamp, // (เวลาเป้าหมาย)
                    order_note: item.note, // (Note แยกของแต่ละ Item)

                    parameters: {}, // (ว่าง)

                    recorded_by: loginUser,
                    dvm: targetDvm || null,
                    department: targetDept || null, // (Department เป้าหมาย)
                    
                    last_updated_by: loginUser,
                    last_updated_on: recordTimestamp, // (เวลาที่กด Save)
                    disable_remark: ""
                };

                // (Push เข้าฐานข้อมูลกลาง - activityLogData มาจาก app-data.js)
                activityLogData.push(newEntry);
            });

            alert(`Order Set (${orderNo}) Saved!\n(${currentOrderSet.length} items added to log)`);
            console.log("New Order Set Added:", currentOrderSet);
            console.log("Current activityLogData:", activityLogData);

            // (เคลียร์ค่าและกลับไปหน้า Assessment)
            currentOrderSet = [];
            updateOrderSummaryUI();
            // (loadModuleContent มาจาก app-logic.js)
            loadModuleContent('assessment_content.html');
        });
    }


    // --- 5. เรียก Lucide ---
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}