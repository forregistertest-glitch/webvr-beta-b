// This is rx-history-data.js
// Mock Data for Order Rx History (Re-med Feature)
// Updated for Beta 6.6 (Fix Missing Container & Used Unit)

(function() {
    
    // --- 1. Local Helpers & Config ---
    const pad = (num) => String(num).padStart(2, '0');
    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
    
    const dvms = ['Dr. AAA', 'Dr. BBB', 'Dr. CCC', 'Dr. Med', 'Dr. Surg'];
    const depts = ['101 อายุรกรรม', '102 ศัลยกรรม', '301 คลินิกพิเศษ'];
    
    // Mock Items Subset (Updated Structure: container + used_unit)
    const mockRxItems = [
        { id: "RX-001", name: "Amoxicillin 250mg", container: "Sachet", used_unit: "Tab", label: "กิน 1 เม็ด หลังอาหาร เช้า-เย็น", price: 50 },
        { id: "RX-002", name: "Amoxi/Clav 250mg", container: "Sachet", used_unit: "Tab", label: "กิน 1 เม็ด หลังอาหาร เช้า-เย็น 7 วัน", price: 85 },
        { id: "RX-004", name: "Enrofloxacin 50mg", container: "Sachet", used_unit: "Tab", label: "กิน 1 เม็ด หลังอาหาร เช้า-เย็น", price: 80 },
        { id: "RX-009", name: "Prednisolone 5mg", container: "Sachet", used_unit: "Tab", label: "กิน 1 เม็ด หลังอาหาร เช้า-เย็น", price: 15 },
        { id: "RX-011", name: "Tramadol 50mg", container: "Sachet", used_unit: "Cap", label: "กิน 1 เม็ด หลังอาหาร เช้า-เย็น", price: 25 },
        { id: "RX-012", name: "Carprofen 25mg", container: "Sachet", used_unit: "Tab", label: "กิน 1 เม็ด หลังอาหาร วันละ 1 ครั้ง", price: 40 },
        { id: "RX-016", name: "Furosemide 40mg", container: "Sachet", used_unit: "Tab", label: "กิน 1 เม็ด เช้า-เย็น", price: 10 },
        { id: "RX-EQ-007", name: "Normal Saline 100ml", container: "Bottle", used_unit: "Bottle", label: "ใช้ล้างแผล", price: 65 },
        { id: "RX-EQ-009", name: "Gauze Pad (Sterile)", container: "Pack", used_unit: "Pack", label: "ใช้ปิดแผล", price: 15 },
        { id: "RX-EQ-016", name: "Elizabethan Collar #10", container: "-", used_unit: "Pcs", label: "ใส่กันเลีย", price: 150 }
    ];

    // --- 2. Generator Function ---
    function generateRxHistory() {
        const data = [];
        const now = new Date();
        
        // 2.1 Generate 20 Random Orders
        for (let i = 0; i < 20; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - Math.floor(Math.random() * 90));
            date.setHours(Math.floor(Math.random() * 9) + 9); 
            date.setMinutes(Math.floor(Math.random() * 60));
            
            const dateStr = `${pad(date.getDate())} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][date.getMonth()]} ${date.getFullYear()}`;
            const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
            
            const itemCount = Math.floor(Math.random() * 4) + 1;
            const selectedItems = [];
            let total = 0;
            
            for(let j=0; j<itemCount; j++) {
                const item = getRandom(mockRxItems);
                const qty = Math.floor(Math.random() * 10) + 1;
                if(!selectedItems.find(it => it.id === item.id)) {
                    selectedItems.push({ ...item, qty: qty.toString() });
                    total += (item.price * qty);
                }
            }

            const randStatus = Math.random();
            let status, accNo, orderStatusDisplay;
            
            if (randStatus > 0.2) {
                status = "Done";
                accNo = `RX-${date.getFullYear().toString().slice(-2)}${pad(date.getMonth()+1)}${pad(i).padStart(4,'0')}`;
                orderStatusDisplay = "Dispensed";
            } else if (randStatus > 0.05) {
                status = "Pending";
                accNo = null;
                orderStatusDisplay = "Pending";
            } else {
                status = "Disable";
                accNo = null;
                orderStatusDisplay = "Cancelled";
            }

            data.push({
                datetime_effective: `${dateStr}, ${timeStr}`,
                raw_datetime: date,
                order_no: `ORD-RX${date.getFullYear().toString().slice(-2)}${pad(i).padStart(5,'0')}`,
                acc_no: accNo,
                status: status,
                status_display: orderStatusDisplay,
                dvm: getRandom(dvms),
                department: getRandom(depts),
                items: selectedItems,
                pharmacy_note: (Math.random() > 0.8) ? "เจ้าของขอแบ่งยาเม็ด" : "-",
                order_note: (Math.random() > 0.8) ? "Stat case" : "-",
                total_price: total
            });
        }

        // 2.2 Insert Special Case (Multiline Labels)
        const specialDate = new Date();
        specialDate.setDate(specialDate.getDate() - 1); // Yesterday
        const specialItems = [];
        
        // Map special drugs to use new structure (container/used_unit)
        const specialDrugs = [
            { id: "RX-001", name: "Amoxicillin 250mg", price: 50, container: "Sachet", used_unit: "Tab" },
            { id: "RX-004", name: "Enrofloxacin 50mg", price: 80, container: "Sachet", used_unit: "Tab" },
            { id: "RX-009", name: "Prednisolone 5mg", price: 15, container: "Sachet", used_unit: "Tab" },
            { id: "RX-014", name: "Pimobendan 5mg", price: 450, container: "Sachet", used_unit: "Tab" },
            { id: "RX-020", name: "Lactulose 100ml", price: 180, container: "Bottle", used_unit: "Bottle" }
        ];

        let specialTotal = 0;
        specialDrugs.forEach((drug, idx) => {
            const qty = 10;
            specialItems.push({
                ...drug,
                qty: qty.toString(),
                label: `กินครั้งละ 1 เม็ด\nหลังอาหาร เช้า-เย็น\nติดต่อกัน 7 วัน\nห้ามหยุดยาเอง\n(ยาฆ่าเชื้อ)` // 5 lines
            });
            specialTotal += (drug.price * qty);
        });

        const specialOrder = {
            datetime_effective: `Yesterday, 10:00`,
            raw_datetime: specialDate,
            order_no: `ORD-RX-SPECIAL-01`,
            acc_no: `RX-SPECIAL-001`,
            status: "Done",
            status_display: "Dispensed",
            dvm: "Dr. AAA",
            department: "101 อายุรกรรม",
            items: specialItems,
            pharmacy_note: "ฉลากยายาว",
            order_note: "ทดสอบฉลากยาว 5 บรรทัด",
            total_price: specialTotal
        };

        data.unshift(specialOrder); // Add to top

        // Sort by Date Descending
        return data.sort((a, b) => b.raw_datetime - a.raw_datetime);
    }

    // --- 3. Export ---
    window.rxHistoryData = generateRxHistory();
    console.log("Rx History Data Generated (Beta 6.6 Fixed):", window.rxHistoryData.length, "items");

})();