// Filename: patho-data.js
// Description: เก็บข้อมูลรายการ Pathology (Catalog) และประวัติการส่งตรวจ (History) โดยเฉพาะ
// Context: New File (Create this file in your project folder)

(function() {
    // =================================================================
    // 1. MASTER DATA - PATHOLOGY CATALOG
    // (Source: Extracted from app-data.js)
    // =================================================================
    window.pathologyServiceCatalog = {
        "CY": {
            name: "Cytology (เซลล์วิทยา)", icon: "microscope",
            items: [
                { id: "CY01", name: "Cytology - 1 Site", price: 400, req_site: true },
                { id: "CY02", name: "Cytology - 2 Sites", price: 700, req_site: true }
            ]
        },
        "SP": {
            name: "Biopsy (ชิ้นเนื้อ)", icon: "file-text",
            items: [
                { id: "SP-S", name: "Biopsy - Small", price: 1200, req_site: true },
                { id: "SP-ORG", name: "Biopsy - Whole Organ", price: 2500, req_site: true }
            ]
        }
    };

    // =================================================================
    // 2. MOCK HISTORY GENERATOR (TYPE: PATHOLOGY ONLY)
    // (Source: Logic extracted & adapted from lab-dashboard-data.js)
    // =================================================================
    
    // Local Helpers
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const pad = (num) => String(num).padStart(2, '0');
    
    const getTodayDateStr = () => {
        const now = new Date();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${pad(now.getDate())} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    };

    // Mock Resources (Subset for Pathology)
    const mockPets = [
        { hn: "52042999", name: "ถุงเงิน", owner: "คุณยายศรี" },
        { hn: "52043777", name: "เจ้าขาว", owner: "ร้านป้าแต๋น" },
        { hn: "52044111", name: "Maximus", owner: "Mr. John" },
        { hn: "52046666", name: "บุญรอด", owner: "คุณสมร" },
        { hn: "52045222", name: "เฉาก๊วย", owner: "คุณน้าแมว" }
    ];

    const dvms = ['Dr. Surg', 'Dr. Patho', 'Dr. Med', 'Dr. AAA'];
    const depts = ['102 ศัลยกรรม', 'IPD ชั้น 2', '101 อายุรกรรม'];
    const users = ['User Nurse', 'User Tech', 'User Admin'];
    const pathNotes = ['Specimen in formalin', 'Fresh sample', 'Slide fixed', '-', '-'];
    
    // Status Flow for Pathology
    const pathStatuses = ['Received', 'Grossing', 'Processing', 'Review', 'Reported'];

    function generatePathoHistory() {
        const data = [];
        const todayStr = getTodayDateStr();

        // Generate 20 Pathology Records
        for (let i = 0; i < 20; i++) {
            // 1. Time Logic
            const h = Math.floor(Math.random() * 9) + 8; // 08:00 - 17:00
            const m = Math.floor(Math.random() * 60);
            
            const mColl = m + Math.floor(Math.random() * 30);
            const hColl = h + Math.floor(mColl / 60);
            const minCollFinal = mColl % 60;

            const timeCreate = `${pad(h)}:${pad(m)}`;
            const timeCollected = `${pad(hColl)}:${pad(minCollFinal)}`;

            // 2. Pathology Specific Logic
            const type = "Pathology"; // Forced Type
            const pet = getRandom(mockPets);
            
            // 3. Status Logic
            const randStatus = Math.random();
            let orderStatus = 'Done';
            let labStatus = getRandom(pathStatuses); // Random process stage
            
            if (randStatus > 0.90) { // Less pending than Lab
                orderStatus = 'Pending'; 
                labStatus = 'Waiting'; 
            } else if (randStatus > 0.98) { 
                orderStatus = 'Disable'; 
                labStatus = 'Cancel'; 
            }

            // 4. IDs & Details
            const orderNo = `ORD-PAT-${Math.floor(100000 + Math.random() * 900000)}`;
            const accNo = (orderStatus !== 'Pending') ? `PAT-${Math.floor(100000 + Math.random() * 900000)}` : "-";

            // Random Item Selection
            const pathItems = ["Biopsy (Skin)", "Biopsy (Mass)", "Cytology (FNA)", "Fungal Culture", "Histopathology (Large)"];
            const details = getRandom(pathItems);

            data.push({
                collected_time: `${todayStr} ${timeCollected}`,
                order_no: orderNo,
                acc_no: accNo,
                patient_info: { name: pet.name, hn: pet.hn, owner: pet.owner },
                tests_detail: details,
                note: getRandom(pathNotes),
                order_note: "Mass identification",
                dvm: getRandom(dvms),
                dept: getRandom(depts),
                user_record: getRandom(users),
                create_time: timeCreate,
                order_status: orderStatus,
                lab_status: labStatus,
                action: true,
                type: type, // Identification Tag
                raw_datetime: new Date(`${todayStr} ${timeCollected}`) // For Sorting
            });
        }
        return data.sort((a, b) => b.raw_datetime - a.raw_datetime);
    }

    // Export generated data to Global Scope
    window.pathoHistoryData = generatePathoHistory();
    console.log("Pathology History Data Generated:", window.pathoHistoryData.length, "items");

})();