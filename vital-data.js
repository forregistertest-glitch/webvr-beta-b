// Filename: vital-data.js
// Description: ข้อมูลประวัติการวัดสัญญาณชีพ (Vital Signs History)
// Context: New File (Create this file in your project folder)

(function() {
    // =================================================================
    // MOCK DATA GENERATOR - VITAL SIGNS
    // (Source: Extracted & Specialized from app-data.js)
    // =================================================================

    // 1. Config & Helpers
    const MOCK_CONFIG = {
        dates: ["2025-12-30", "2025-12-25", "2025-12-20", "2025-12-10", "2025-12-01"],
        dvms: ['Dr. AAA', 'Dr. BBB', 'Dr. CCC', 'Dr. Nurse'],
        users: ['User Tech', 'User Nurse', 'User Admin'],
        depts: ['101 อายุรกรรม', '201 ฉุกเฉิน', 'IPD']
    };

    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    const getRandomTime = () => {
        const h = String(Math.floor(Math.random() * 12) + 8).padStart(2,'0');
        const m = String(Math.floor(Math.random() * 60)).padStart(2,'0');
        return `${h}:${m}:00`;
    };

    const formatDateStr = (dateStr, timeStr) => {
        const date = new Date(`${dateStr}T${timeStr}`);
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}, ${timeStr}`;
    };

    // 2. Generator Logic
    function generateVitalHistory() {
        let data = [];
        
        // Generate 30 Records
        for (let i = 0; i < 30; i++) {
            // Date Logic
            let dateBase;
            if (i < 10) dateBase = MOCK_CONFIG.dates[0]; 
            else dateBase = MOCK_CONFIG.dates[(i % 4) + 1]; 

            const createTime = getRandomTime();
            const createDateTime = formatDateStr(dateBase, createTime);
            
            // ID Logic
            const ts = Date.now() - (i * 100000) - (Math.random()*10000);
            const entryId = `E-VS-${ts.toFixed(0)}`;
            const orderNo = `ORD-VS-${ts.toFixed(0).substr(-6)}`;

            // Parameter Logic (Vital Signs Specific)
            const params = {
                Temp: (99 + Math.random() * 4).toFixed(1),
                HR: Math.floor(80 + Math.random() * 60),
                RR: Math.floor(20 + Math.random() * 20),
                BP: `${Math.floor(110 + Math.random() * 40)}/${Math.floor(60 + Math.random() * 30)}`,
                Pulse: Math.floor(80 + Math.random() * 60),
                Note: (Math.random() < 0.2) ? "Patient nervous" : "-"
            };

            const userRec = getRandom(MOCK_CONFIG.users);

            data.push({
                entry_id: entryId,
                order_no: orderNo,
                activity_type: 'Vital Signs',
                hn: "52039575", 
                pet_name: "คุณส้มจี๊ด(จี๊ดจ๊าด)", 
                owner_name: "คุณพ่อส้มจี๊ด",
                order_create_date: createDateTime,
                effective_time: createDateTime, // Vital signs usually happen immediately
                parameters: params,
                recorded_by: userRec,
                dvm: getRandom(MOCK_CONFIG.dvms),
                department: getRandom(MOCK_CONFIG.depts)
            });
        }

        return data.sort((a, b) => new Date(b.order_create_date) - new Date(a.order_create_date));
    }

    // Export
    window.vitalHistoryData = generateVitalHistory();
    console.log("Vital Signs Data Generated:", window.vitalHistoryData.length);

})();