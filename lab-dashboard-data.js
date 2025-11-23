// This is lab-dashboard-data.js
// Standalone Mock Data for LAB Dashboard (100 items, Today)

(function() {
    // --- Local Helpers for this file ---
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    const pad = (num) => String(num).padStart(2, '0');
    
    const getTodayDateStr = () => {
        const now = new Date();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${pad(now.getDate())} ${monthNames[now.getMonth()]} ${now.getFullYear()}`;
    };

    // --- Mock Resource Data ---
    const mockPets = [
        { hn: "52039575", name: "คุณส้มจี๊ด(จี๊ดจ๊าด)", owner: "คุณพ่อส้มจี๊ด" },
        { hn: "52039888", name: "น้องมอมแมม", owner: "คุณสมชาย" },
        { hn: "52040123", name: "พี่ทองแดง", owner: "คุณวิชัย" },
        { hn: "52041555", name: "Lucky", owner: "Mrs. Smith" },
        { hn: "52042999", name: "ถุงเงิน", owner: "คุณยายศรี" },
        { hn: "52043777", name: "เจ้าขาว", owner: "ร้านป้าแต๋น" },
        { hn: "52044111", name: "Maximus", owner: "Mr. John" },
        { hn: "52045222", name: "เฉาก๊วย", owner: "คุณน้าแมว" },
        { hn: "52046666", name: "บุญรอด", owner: "คุณสมร" },
        { hn: "52047777", name: "Coco", owner: "Ms. Anne" }
    ];

    const dvms = ['Dr. AAA', 'Dr. BBB', 'Dr. CCC', 'Dr. Eye', 'Dr. Surg', 'Dr. Med'];
    const depts = ['101 อายุรกรรม', '201 ฉุกเฉิน', '301 คลินิกพิเศษ', '102 ศัลยกรรม', 'IPD ชั้น 2'];
    const users = ['User Nurse', 'User Tech', 'User Admin', 'Dr. AAA'];
    const orderNotes = ['Routine Check', 'Stat', 'Fasting 12 hrs', 'Monitor post-op', 'Pre-anesthetic', '-', '-', 'Re-check kidney'];
    const labNotes = ['Hemolyzed 1+', 'Lipemic 2+', 'Clotted specimen', 'Note: Low sample volume', '-', '-', '-'];

    // --- Generator Function ---
    function generateDashboardData() {
        const data = [];
        const todayStr = getTodayDateStr();

        for (let i = 0; i < 100; i++) {
            // 1. Random Time logic
            // Create time = Random 08:00 - 16:00
            const h = Math.floor(Math.random() * 9) + 8; 
            const m = Math.floor(Math.random() * 60);
            
            // Collected time = Create time + 0-30 mins
            const mColl = m + Math.floor(Math.random() * 30);
            const hColl = h + Math.floor(mColl / 60);
            const minCollFinal = mColl % 60;

            // Update time = Collected time + 10-60 mins
            const mUpd = minCollFinal + Math.floor(Math.random() * 50) + 10;
            const hUpd = hColl + Math.floor(mUpd / 60);
            const minUpdFinal = mUpd % 60;

            const timeCreate = `${pad(h)}:${pad(m)}`;
            const timeCollected = `${pad(hColl)}:${pad(minCollFinal)}`;
            const timeUpdate = `${pad(hUpd)}:${pad(minUpdFinal)}`;

            // 2. Random Attributes
            const pet = getRandom(mockPets);
            const type = Math.random() > 0.3 ? "LIS" : "Pathology"; // 70% LIS, 30% Path
            
            // 3. Determine Status
            const randStatus = Math.random();
            let orderStatus = 'Done';
            if (randStatus > 0.85) orderStatus = 'Pending';
            else if (randStatus > 0.95) orderStatus = 'Disable';

            let labStatus = '-';
            if (orderStatus === 'Done') {
                if (type === 'LIS') labStatus = getRandom(['Waiting', 'Accepted', 'Approved', 'Completed', 'Reported']);
                else labStatus = getRandom(['Received', 'Grossing', 'Processing', 'Review', 'Reported']);
            } else if (orderStatus === 'Disable') {
                labStatus = 'Cancel';
            } else {
                labStatus = 'Waiting';
            }

            // 4. Details & ID
            let details = "";
            let accNo = "-";
            const orderNo = `ORD-${type.substr(0,3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
            
            if (orderStatus !== 'Pending') {
                accNo = `${type.substr(0,3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
            }

            if (type === "LIS") {
                const tests = ["CBC", "CHEM", "LYTES", "UA", "T4", "Cortisol", "Bile Acid", "Coagulation"];
                const t1 = getRandom(tests);
                const t2 = getRandom(tests);
                details = (Math.random() > 0.4) ? t1 : `${t1}, ${t2}`;
            } else {
                const pathItems = ["Biopsy (Skin)", "Biopsy (Mass)", "Cytology", "Fungal Culture"];
                details = getRandom(pathItems);
            }

            // 5. Build Object (16 Columns)
            data.push({
                collected_time: `${todayStr} ${timeCollected}`, // 1. Date/Time (Collected)
                order_no: orderNo,                              // 2. Order No.
                acc_no: accNo,                                  // 3. Acc No.
                patient_info: {                                 // 4. Patient
                    name: pet.name,
                    hn: pet.hn,
                    owner: pet.owner
                },
                tests_detail: details,                          // 5. Tests / Detail
                note: getRandom(labNotes),                      // 6. Note (Lab)
                order_note: getRandom(orderNotes),              // 7. Order Note
                dvm: getRandom(dvms),                           // 8. DVM
                dept: getRandom(depts),                         // 9. Dept
                user_record: getRandom(users),                  // 10. User Record
                create_time: timeCreate,                        // 11. Create Time (Time only for display)
                user_update: getRandom(users),                  // 12. User Update
                update_time: timeUpdate,                        // 13. Update Time (Time only)
                order_status: orderStatus,                      // 14. Order Status
                lab_status: labStatus,                          // 15. Lab Status
                action: true,                                   // 16. Action (Flag to render buttons)
                
                // Hidden fields for logic
                type: type,
                raw_datetime: new Date(`${getTodayDateStr()} ${timeCollected}`)
            });
        }

        // Sort by Collected Time Descending
        return data.sort((a, b) => b.raw_datetime - a.raw_datetime);
    }

    // Export to Global Scope
    window.labDashboardData = generateDashboardData();
    console.log("Lab Dashboard Data Generated:", window.labDashboardData.length);

})();