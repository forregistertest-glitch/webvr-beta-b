// This is order-pe-init.js (BETA 5.6 Revised 4 - UI Update)

function initializeOrderPEScripts() {
    
    // 1. Wire up "Vital Signs" Button (Card 1)
    const btnVsPlan = document.getElementById('btn-order-pe-vitals-plan');
    if (btnVsPlan) {
        btnVsPlan.addEventListener('click', () => {
            // ยังคงเปิด Plan Modal ตามเดิม แต่ชื่อปุ่มเปลี่ยน
            if (typeof window.openOrderPlanModal === 'function') {
                window.openOrderPlanModal('Vital Signs', 'Plan: Vital Signs Monitoring');
            } else {
                console.error("Order Plan Modal logic not loaded.");
            }
        });
    }

    // 2. Wire up "Eye Exam" Button (Card 2)
    const btnEyeModule = document.getElementById('btn-order-pe-eye');
    if (btnEyeModule) {
        btnEyeModule.addEventListener('click', () => {
            // เรียกฟังก์ชัน global ที่เราเพิ่ง expose ใน app-init.js
            if (typeof window.openEyeExamModal === 'function') {
                window.openEyeExamModal();
            } else {
                console.error("Eye Exam Modal logic not loaded.");
            }
        });
    }

    // 3. Initialize Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}