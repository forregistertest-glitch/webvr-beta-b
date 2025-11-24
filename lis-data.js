// Filename: lis-data.js
// Description: เก็บข้อมูลรายการ Lab (Catalog) และประวัติการสั่ง Lab (History) โดยเฉพาะ
// Context: New File (Create this file in your project folder)

(function() {
    // =================================================================
    // 1. MASTER DATA - LABORATORY CATALOG
    // (Source: Extracted from app-data.js)
    // =================================================================
    window.labServiceCatalog = {
        "HEM": {
            name: "Hematology (โลหิตวิทยา)", icon: "droplet",
            items: [
                { id: "CBC", name: "Complete Blood Count (CBC)", price: 350, container: "Lavender (EDTA)", type: "Panel" },
                { id: "BLP", name: "Blood Parasite Smear", price: 150, container: "Lavender (EDTA)", type: "Test" },
                { id: "COAG", name: "Coagulation (PT/APTT)", price: 850, container: "Light Blue", type: "Panel" }
            ]
        },
        "CHEM": {
            name: "Clinical Chemistry (เคมีคลินิก)", icon: "flask-conical",
            items: [
                { id: "PREOP", name: "Pre-anesthetic Panel", price: 650, container: "Red/SST", type: "Panel" },
                { id: "COMP", name: "Comprehensive Panel", price: 1400, container: "Red/SST", type: "Panel" },
                { id: "RENAL", name: "Renal Panel", price: 500, container: "Red/SST", type: "Panel" },
                { id: "LIVER", name: "Liver Panel", price: 550, container: "Red/SST", type: "Panel" },
                { id: "ELEC", name: "Electrolytes", price: 350, container: "Red/SST", type: "Panel" },
                { id: "GLU", name: "Glucose", price: 100, container: "Grey", type: "Test" }
            ]
        },
        "IMM": {
            name: "Immunology (ภูมิคุ้มกัน)", icon: "shield-check",
            items: [
                { id: "4DX", name: "4Dx Plus Test", price: 950, container: "Lavender", type: "Rapid" },
                { id: "PARVO", name: "Parvovirus Test", price: 500, container: "Feces", type: "Rapid" }
            ]
        }
    };

    // =================================================================
    // 2. MOCK HISTORY GENERATOR (TYPE: LIS ONLY)
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

    // Mock Resources (Subset for LIS)
    const mockPets = [
        { hn: "52039575", name: "คุณส้มจี๊ด(จี๊ดจ๊าด)", owner: "คุณพ่อส้มจี๊ด" },
        { hn: "52039888", name: "น้องมอมแมม", owner: "คุณสมชาย" },
        { hn: "52040123", name: "พี่ทองแดง", owner: "คุณวิชัย" },
        { hn: "52041555", name: "Lucky", owner: "Mrs. Smith" },
        { hn: "52042999", name: "ถุงเงิน", owner: "คุณยายศรี" },
        { hn: "52044111", name: "Maximus", owner: "Mr. John" }
    ];
    
    const dvms = ['Dr. AAA', 'Dr. BBB', 'Dr. CCC', 'Dr. Med'];
    const depts = ['101 อายุรกรรม', '201 ฉุกเฉิน', '301 คลินิกพิเศษ'];
    const users = ['User Nurse', 'User Tech', 'User Admin'];
    const orderNotes = ['Routine Check', 'Stat', 'Fasting 12 hrs', 'Pre-anesthetic', '-', 'Re-check kidney'];
    const labNotes = ['Hemolyzed 1+', 'Lipemic 2+', 'Clotted specimen', 'Note: Low sample volume', '-', '-', '-'];

    function generateLisHistory() {
        const data = [];
        const todayStr = getTodayDateStr();

        // Generate 50 LIS Records
        for (let i = 0; i < 50; i++) {
            // 1. Time Logic
            const h = Math.floor(Math.random() * 9) + 8; // 08:00 - 17:00
            const m = Math.floor(Math.random() * 60);
            
            const mColl = m + Math.floor(Math.random() * 30);
            const hColl = h + Math.floor(mColl / 60);
            const minCollFinal = mColl % 60;

            const timeCreate = `${pad(h)}:${pad(m)}`;
            const timeCollected = `${pad(hColl)}:${pad(minCollFinal)}`;

            // 2. LIS Specific Logic
            const type = "LIS"; // Forced Type
            const pet = getRandom(mockPets);
            
            // 3. Status
            const randStatus = Math.random();
            let orderStatus = 'Done';
            let labStatus = getRandom(['Waiting', 'Accepted', 'Approved', 'Completed', 'Reported']);
            
            if (randStatus > 0.85) { 
                orderStatus = 'Pending'; 
                labStatus = 'Waiting'; 
            } else if (randStatus > 0.95) { 
                orderStatus = 'Disable'; 
                labStatus = 'Cancel'; 
            }

            // 4. IDs & Details
            const orderNo = `ORD-LIS-${Math.floor(100000 + Math.random() * 900000)}`;
            const accNo = (orderStatus !== 'Pending') ? `LIS-${Math.floor(100000 + Math.random() * 900000)}` : "-";

            // Random Test Selection
            const tests = ["CBC", "CHEM", "LYTES", "UA", "T4", "Cortisol", "Bile Acid"];
            const t1 = getRandom(tests);
            const t2 = getRandom(tests);
            const details = (Math.random() > 0.4) ? t1 : `${t1}, ${t2}`;

            data.push({
                collected_time: `${todayStr} ${timeCollected}`,
                order_no: orderNo,
                acc_no: accNo,
                patient_info: { name: pet.name, hn: pet.hn, owner: pet.owner },
                tests_detail: details,
                note: getRandom(labNotes),
                order_note: getRandom(orderNotes),
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
    window.lisHistoryData = generateLisHistory();
    console.log("LIS History Data Generated:", window.lisHistoryData.length, "items");

})();