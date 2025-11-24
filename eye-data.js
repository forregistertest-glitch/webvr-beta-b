// Filename: eye-data.js
// Description: ข้อมูลประวัติการตรวจตา (Eye Exam History)
// Context: New File (Create this file in your project folder)

(function() {
    // =================================================================
    // MOCK DATA GENERATOR - EYE EXAM
    // (Source: Extracted & Specialized from app-data.js)
    // =================================================================

    // 1. Config & Helpers
    const MOCK_CONFIG = {
        dates: ["2025-12-30", "2025-12-28", "2025-12-15", "2025-11-20"],
        dvms: ['Dr. Eye', 'Dr. AAA', 'Dr. Optic'],
        users: ['User Tech', 'User Nurse', 'Dr. Eye'],
        depts: ['301 คลินิกพิเศษ', '101 อายุรกรรม']
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
    function generateEyeHistory() {
        let data = [];
        
        // Generate 20 Records (increased from 15 to match other modules)
        for (let i = 0; i < 20; i++) {
            // Date Logic
            let dateBase = MOCK_CONFIG.dates[i % MOCK_CONFIG.dates.length];
            const createTime = getRandomTime();
            const createDateTime = formatDateStr(dateBase, createTime);
            
            // ID Logic
            const ts = Date.now() - (i * 200000) - (Math.random()*10000);
            const entryId = `E-EYE-${ts.toFixed(0)}`;
            const orderNo = `ORD-EYE-${ts.toFixed(0).substr(-6)}`;
            const accNo = `EYE-${ts.toFixed(0).substr(-6)}`;

            // Parameter Logic (Eye Exam Specific)
            const params = {
                plr_od: getRandom(['+', '-', 'Sluggish', 'Fixed']),
                plr_os: getRandom(['+', '-', 'Sluggish']),
                palpebral_od: getRandom(['+', '+']),
                palpebral_os: getRandom(['+', '+']),
                dazzle_od: getRandom(['+', '-']),
                dazzle_os: getRandom(['+', '+']),
                menace_od: getRandom(['+', '-']),
                menace_os: getRandom(['+', '+']),
                stt_od: Math.floor(10 + Math.random() * 15),
                stt_os: Math.floor(10 + Math.random() * 15),
                iop_od: Math.floor(10 + Math.random() * 15), // Normal 10-25
                iop_os: Math.floor(10 + Math.random() * 15),
                fluorescein_od: (Math.random() > 0.8) ? "Positive" : "Negative",
                fluorescein_os: "Negative",
                Note: (Math.random() < 0.3) ? "Re-check in 2 weeks" : (Math.random() < 0.5 ? "Normal findings" : "")
            };

            const userRec = getRandom(MOCK_CONFIG.users);

            data.push({
                entry_id: entryId,
                order_no: orderNo,
                acc_no: accNo,
                activity_type: 'Eye Exam',
                order_status: 'Done', // Important: Must be 'Done' to show in history table
                hn: "52039575", 
                pet_name: "คุณส้มจี๊ด(จี๊ดจ๊าด)", 
                owner_name: "คุณพ่อส้มจี๊ด",
                order_create_date: createDateTime,
                effective_time: createDateTime,
                parameters: params,
                recorded_by: userRec,
                dvm: getRandom(MOCK_CONFIG.dvms),
                department: getRandom(MOCK_CONFIG.depts),
                last_updated_on: createDateTime,
                last_updated_by: userRec
            });
        }

        return data.sort((a, b) => new Date(b.order_create_date) - new Date(a.order_create_date));
    }

    // Export
    window.eyeHistoryData = generateEyeHistory();
    console.log("Eye Exam Data Generated:", window.eyeHistoryData.length);

})();