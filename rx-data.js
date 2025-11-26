// This is rx-data.js
// Master Data for Order Rx (Home Medication & Supplies)
// Created for Beta 6.3

(function() {
    window.rxServiceCatalog = {
        "MED_HOME": {
            name: "Rx Medicine (ยานำกลับ)", 
            icon: "pill", 
            items: [
                // Antibiotics & Anti-infectives
                { id: "RX-001", name: "Amoxicillin 250mg", price: 50, container: "Sachet", used_unit: "Tab", type: "Oral", default_label: "กิน 1 เม็ด หลังอาหาร เช้า-เย็น" },
                { id: "RX-002", name: "Amoxi/Clav 250mg", price: 85, container: "Sachet", used_unit: "Tab", type: "Oral", default_label: "กิน 1 เม็ด หลังอาหาร เช้า-เย็น ติดต่อกัน 7 วัน" },
                { id: "RX-003", name: "Doxycycline 100mg", price: 60, container: "Sachet", used_unit: "Cap", type: "Oral", default_label: "กิน 1 เม็ด หลังอาหาร วันละ 1 ครั้ง (ห้ามป้อนน้ำตาม)" },
                { id: "RX-004", name: "Enrofloxacin 50mg", price: 80, container: "Sachet", used_unit: "Tab", type: "Oral", default_label: "กิน 1 เม็ด หลังอาหาร เช้า-เย็น" },
                { id: "RX-005", name: "Metronidazole 200mg", price: 40, container: "Sachet", used_unit: "Tab", type: "Oral", default_label: "กิน 1/2 เม็ด หลังอาหาร เช้า-เย็น" },
                { id: "RX-006", name: "Cephalexin 250mg", price: 55, container: "Sachet", used_unit: "Cap", type: "Oral", default_label: "กิน 1 เม็ด หลังอาหาร เช้า-เย็น" },
                { id: "RX-007", name: "Clindamycin 150mg", price: 70, container: "Sachet", used_unit: "Cap", type: "Oral", default_label: "กิน 1 เม็ด หลังอาหาร เช้า-เย็น" },
                { id: "RX-008", name: "Itraconazole 100mg", price: 120, container: "Sachet", used_unit: "Cap", type: "Oral", default_label: "กิน 1 เม็ด หลังอาหาร วันละ 1 ครั้ง" },
                
                // Anti-inflammatory & Pain
                { id: "RX-009", name: "Prednisolone 5mg", price: 15, container: "Sachet", used_unit: "Tab", type: "Oral", default_label: "กิน 1 เม็ด หลังอาหาร เช้า-เย็น (ลดบวม/คัน)" },
                { id: "RX-010", name: "Gabapentin 100mg", price: 30, container: "Sachet", used_unit: "Cap", type: "Oral", default_label: "กิน 1 เม็ด หลังอาหาร เช้า-เย็น (ระงับปวด)" },
                { id: "RX-011", name: "Tramadol 50mg", price: 25, container: "Sachet", used_unit: "Cap", type: "Oral", default_label: "กิน 1 เม็ด หลังอาหาร เช้า-เย็น (แก้ปวด)" },
                { id: "RX-012", name: "Carprofen 25mg", price: 40, container: "Sachet", used_unit: "Tab", type: "Oral", default_label: "กิน 1 เม็ด หลังอาหาร วันละ 1 ครั้ง (แก้ปวดลดอักเสบ)" },
                
                // Cardio & Renal
                { id: "RX-013", name: "Pimobendan 1.25mg", price: 250, container: "Sachet", used_unit: "Tab", type: "Oral", default_label: "กิน 1 เม็ด ก่อนอาหาร 1 ชั่วโมง เช้า-เย็น" },
                { id: "RX-014", name: "Pimobendan 5mg", price: 450, container: "Sachet", used_unit: "Tab", type: "Oral", default_label: "กิน 1 เม็ด ก่อนอาหาร 1 ชั่วโมง เช้า-เย็น" },
                { id: "RX-015", name: "Benazepril 5mg", price: 180, container: "Sachet", used_unit: "Tab", type: "Oral", default_label: "กิน 1 เม็ด วันละ 1 ครั้ง" },
                { id: "RX-016", name: "Furosemide 40mg", price: 10, container: "Sachet", used_unit: "Tab", type: "Oral", default_label: "กิน 1 เม็ด เช้า-เย็น (ขับน้ำ)" },
                
                // GI & Liver
                { id: "RX-017", name: "Omeprazole 20mg", price: 30, container: "Sachet", used_unit: "Cap", type: "Oral", default_label: "กิน 1 เม็ด ก่อนอาหาร 30 นาที วันละ 1 ครั้ง" },
                { id: "RX-018", name: "Maropitant 16mg", price: 350, container: "Box", used_unit: "Tab", type: "Oral", default_label: "กิน 1 เม็ด วันละ 1 ครั้ง (แก้อาเจียน)" },
                { id: "RX-019", name: "Silymarin 140mg", price: 150, container: "Sachet", used_unit: "Cap", type: "Oral", default_label: "กิน 1 เม็ด หลังอาหาร เช้า-เย็น (บำรุงตับ)" },
                { id: "RX-020", name: "Lactulose 100ml", price: 180, container: "Bottle", used_unit: "Bottle", type: "Syrup", default_label: "ป้อน 3 cc เช้า-เย็น (ช่วยระบาย)" }
            ]
        },
        "EQUIP_HOME": {
            name: "Rx Medical Equipment (เวชภัณฑ์นำกลับ)", 
            icon: "package",
            items: [
                // Syringes & Needles
                { id: "RX-EQ-001", name: "Syringe 1ml (Insulin)", price: 10, container: "Bag", used_unit: "Pcs", type: "Consumable", default_label: "ใช้ป้อนยา/อาหาร ตามแพทย์สั่ง" },
                { id: "RX-EQ-002", name: "Syringe 3ml", price: 10, container: "Bag", used_unit: "Pcs", type: "Consumable", default_label: "ใช้ป้อนยา/อาหาร ตามแพทย์สั่ง" },
                { id: "RX-EQ-003", name: "Syringe 5ml", price: 12, container: "Bag", used_unit: "Pcs", type: "Consumable", default_label: "ใช้ป้อนยา/อาหาร ตามแพทย์สั่ง" },
                { id: "RX-EQ-004", name: "Syringe 10ml", price: 15, container: "Bag", used_unit: "Pcs", type: "Consumable", default_label: "ใช้ป้อนยา/อาหาร หรือล้างแผล" },
                { id: "RX-EQ-005", name: "Needle 18G", price: 5, container: "Box", used_unit: "Pcs", type: "Consumable", default_label: "ใช้ดูดน้ำเกลือ" },
                { id: "RX-EQ-006", name: "Needle 21G", price: 5, container: "Box", used_unit: "Pcs", type: "Consumable", default_label: "ใช้ฉีดยา/น้ำเกลือ ตามแพทย์สั่ง" },
                
                // Wound Care
                { id: "RX-EQ-007", name: "Normal Saline 100ml", price: 65, container: "Bottle", used_unit: "Bottle", type: "Liquid", default_label: "ใช้ล้างแผล วันละ 1-2 ครั้ง" },
                { id: "RX-EQ-008", name: "Normal Saline 1000ml", price: 120, container: "Bottle", used_unit: "Bottle", type: "Liquid", default_label: "ใช้ล้างแผล หรือให้น้ำเกลือ" },
                { id: "RX-EQ-009", name: "Gauze Pad (Sterile)", price: 15, container: "Pack", used_unit: "Pack", type: "Dressing", default_label: "ใช้ปิดแผล/เช็ดแผล" },
                { id: "RX-EQ-010", name: "Cotton Ball (Sterile)", price: 15, container: "Pack", used_unit: "Pack", type: "Dressing", default_label: "ใช้เช็ดทำความสะอาดแผล" },
                { id: "RX-EQ-011", name: "Micropore Tape 1/2\"", price: 45, container: "Box", used_unit: "Roll", type: "Dressing", default_label: "ใช้ติดผ้าก๊อซ" },
                { id: "RX-EQ-012", name: "Transpore Tape 1\"", price: 55, container: "Box", used_unit: "Roll", type: "Dressing", default_label: "ใช้ติดผ้าก๊อซ (แบบใส)" },
                { id: "RX-EQ-013", name: "Coban (Self-adherent)", price: 80, container: "Box", used_unit: "Roll", type: "Dressing", default_label: "ใช้พันแผล (ห้ามรัดแน่นเกินไป)" },
                { id: "RX-EQ-014", name: "Elastic Bandage 2\"", price: 45, container: "Box", used_unit: "Roll", type: "Dressing", default_label: "ใช้พันกระชับ/พันแผล" },
                { id: "RX-EQ-015", name: "Elastic Bandage 4\"", price: 65, container: "Box", used_unit: "Roll", type: "Dressing", default_label: "ใช้พันกระชับ/พันแผล" },
                
                // Protection & Others
                { id: "RX-EQ-016", name: "Elizabethan Collar #10", price: 150, container: "-", used_unit: "Pcs", type: "Protection", default_label: "ใส่กันเลียตลอดเวลา" },
                { id: "RX-EQ-017", name: "Elizabethan Collar #15", price: 180, container: "-", used_unit: "Pcs", type: "Protection", default_label: "ใส่กันเลียตลอดเวลา" },
                { id: "RX-EQ-018", name: "Elizabethan Collar #20", price: 220, container: "-", used_unit: "Pcs", type: "Protection", default_label: "ใส่กันเลียตลอดเวลา" },
                { id: "RX-EQ-019", name: "Diaper (Size S)", price: 250, container: "Pack", used_unit: "Pack", type: "Hygiene", default_label: "สวมใส่เพื่อรองรับสิ่งขับถ่าย" },
                { id: "RX-EQ-020", name: "Underpad (แผ่นรองซับ)", price: 150, container: "Pack", used_unit: "Pack", type: "Hygiene", default_label: "ใช้รองกรง/รองนอน" }
            ]
        }
    };
})();