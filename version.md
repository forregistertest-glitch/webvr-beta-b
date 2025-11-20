# KAHIS EMR PROTOTYPE - VERSION.MD
(เรียงลำดับจากใหม่ล่าสุดไปเก่าสุด)

## BETA 5.2.4 VERSION (Lab Viewer Dashboard & Order Plan System)
(20 พฤศจิกายน 2025)

### วัตถุประสงค์ (Objective)
สร้างหน้าจอ **Lab Viewer (Dashboard)** เพื่อใช้เป็นศูนย์กลางในการดูรายการสั่งตรวจทั้งหมด (Clinical Lab & Pathology) โดยรองรับการดูสถานะงาน (Pending/Done/Disable), การค้นหาคนไข้, และการจัดการคำสั่งล่วงหน้า (Plan Management) ให้สอดคล้องกับ Workflow ของแพทย์และห้องปฏิบัติการ

### สิ่งที่อัพเดท (Updates)
1.  **Data Model Overhaul:** ปรับโครงสร้างฐานข้อมูลกลาง (`activityLogData`) ครั้งใหญ่ เพิ่มฟิลด์ `order_status` (Pending, Done, Disable), `lis_process_status`, `patient_info` และ Timestamps ละเอียด พร้อมอัดข้อมูลตัวอย่าง (Mock Data) 90 รายการ เพื่อรองรับการทดสอบระบบที่ซับซ้อน
2.  **Lab Viewer Interface:** สร้างหน้าจอ Dashboard ใหม่ที่แยก Tab ระหว่าง **Clinical Lab (LIS)** และ **Pathology** พร้อมระบบ Filter กรองสถานะ และ Search Bar ค้นหา HN/ชื่อสัตว์ป่วย
3.  **Smart Table Logic:** พัฒนาระบบแสดงผลตารางที่:
    * แสดงข้อมูลคนไข้ (Patient Info) ในตารางรวมได้
    * ใช้ Sticky Header และ Sticky First Column (Date) ตามมาตรฐานใหม่
    * แสดง Badge สถานะสีต่าง ๆ (เหลือง=Plan, เขียว=Sent, เทา=Cancel) และสถานะ Lab Process
4.  **Order Management Actions:** เพิ่มปุ่ม Action สำหรับรายการสถานะ Pending (Plan):
    * **Edit Plan:** โหลดข้อมูลกลับเข้า Modal เพื่อแก้ไข (Mock Load)
    * **Cancel Plan:** กดยกเลิกรายการได้ทันที (เปลี่ยนสถานะเป็น Disable) พร้อมบันทึกเวลาและผู้ยกเลิก

### รายละเอียดทางเทคนิค (Implementation Details)
1.  **`app-data.js`:** รีเซ็ต `activityLogData` ใหม่ทั้งหมดเป็น 90 รายการ (VS:20, Eye:20, LIS:30, Path:20) คละสถานะและ HN
2.  **`lab_viewer_content.html`:** สร้าง UI ใหม่ทั้งหมด (Header Controls + Tab Switcher + Table Container แบบ Fixed Height)
3.  **`app-init.js`:**
    * เพิ่มฟังก์ชัน `initializeLabViewer()` สำหรับ Render ตาราง, จัดการ Tab Switching, และ Filter Logic
    * เขียน Logic การแสดงผลแถว (Row Rendering) ให้เป็น Single Line Style ที่อ่านง่าย
    * อัปเดตฟังก์ชัน `disableOrder()` และ `loadOrderForEdit()` ให้รองรับ Status Logic ใหม่
4.  **`app-logic.js`:** เชื่อมต่อ Route `lab_viewer_content.html` ให้เรียก `initializeLabViewer()` ทำงานอัตโนมัติ


## BETA 5.1.2 VERSION (Order Lab UI/UX Polish - Radio Buttons & Blue Theme)
(20 พฤศจิกายน 2025)

### วัตถุประสงค์ (Objective)
แก้ไขปัญหา UX และ Bug ในหน้า Order Lab (LIS) โดยเปลี่ยนการเลือก Priority จากปุ่มกด (Button Toggle) เป็น Radio Button เพื่อความเสถียรในการใช้งาน และปรับปรุงธีมสี (Visual Consistency) ของหน้าจอให้เป็นสีน้ำเงิน (Blue Theme) ทั้งหมดอย่างถูกต้อง

### สิ่งที่อัพเดท (Updates)
1.  **Radio Button Transformation:** เปลี่ยนระบบเลือก Priority (Routine/STAT) เป็น **Radio Button** เพื่อแก้ปัญหาค่าสถานะหลุดเมื่อมีการโต้ตอบกับส่วนอื่นของฟอร์ม และเพื่อให้ผู้ใช้งานแยกแยะสถานะที่ถูกเลือกได้ชัดเจนยิ่งขึ้น
2.  **Theme Color Fix:** แก้ไขโค้ด Checkbox "Patient Fasted" จากสีชมพู (`text-pink-600`) เป็น **สีน้ำเงิน (`text-blue-600`)** เพื่อให้ตรงกับการแสดงผลจริงและเข้าชุดกับ Radio Button ใหม่
3.  **Code Refactor:** ลบ Logic JavaScript ที่ซับซ้อนในการจัดการสีปุ่มออก และเปลี่ยนมาใช้การอ่านค่าจาก Native Input State แทน ทำให้โค้ดสั้นลงและทำงานแม่นยำขึ้น
4.  **Visual Polish:** ปรับแต่ง UI ของส่วน Priority ให้ Routine เป็นสีน้ำเงิน (Default) และ STAT เป็นสีน้ำเงินแต่เน้นตัวหนังสือ **สีแดง** เพื่อความเด่นชัด

### รายละเอียดทางเทคนิค (Implementation Details)
1.  **`order_lis_content.html`:**
    * แทนที่ปุ่ม Priority เดิมด้วย `<input type="radio">`
    * แก้ไข Class ของ Checkbox Fasting ให้ถูกต้องตาม Theme
2.  **`app-init.js`:**
    * เขียน Logic ใหม่ใน `initializeLisScripts` โดยตัดฟังก์ชัน `updatePriorityUI` เดิมทิ้ง
    * เปลี่ยนการอ่านค่า Priority เป็น `document.querySelector('input[name="lis_priority"]:checked')`
    * เพิ่ม Logic การ Reset ค่ากลับเป็น Routine หลังจากกด Save

## BETA 5.1.2 VERSION (Fix Priority Logic & UI / Save State in Order Lab)
(20 พฤศจิกายน 2025)

### วัตถุประสงค์ (Objective)
แก้ไข Bug สำคัญในหน้า Order Lab (LIS) ที่ทำให้สถานะ Priority (Routine/STAT) ถูกรีเซ็ตเมื่อมีการโต้ตอบกับ element อื่น และแก้ไขปัญหาค่า Priority ไม่ถูกส่งไปยังหน้ายืนยัน (Success Modal) พร้อมทั้งปรับปรุงสีปุ่มให้สื่อความหมายชัดเจนขึ้น

### สิ่งที่อัพเดท (Updates)
1.  **Fixed Priority State Bug:** แก้ไขปัญหาที่ปุ่ม Priority คืนค่า Default เมื่อกด Checkbox Fasting หรือปุ่มอื่นๆ
2.  **Correct Data Submission:** แก้ไข Logic ปุ่ม Save ให้ส่งค่า Priority (Routine/STAT) และ Fasting Status ล่าสุดไปยัง Success Modal ได้ถูกต้องแม่นยำ
3.  **UI Refinement:** ปรับสีปุ่ม Priority ตาม Requirement:
    * **Active State:** พื้นหลังสีเทาเข้ม (Dark Grey) ทั้งคู่ เพื่อให้รู้ว่าถูกเลือก
    * **STAT Text:** เมื่อเลือก STAT ตัวหนังสือจะเป็น **สีแดง** และมีขอบแดง เพื่อเน้นความเร่งด่วน
4.  **Prevent Form Submission:** เพิ่ม `type="button"` และ `e.preventDefault()` เพื่อป้องกันหน้าเว็บ Refresh ตัวเองโดยไม่ตั้งใจ

### รายละเอียดทางเทคนิค (Implementation Details)
1.  **`order_lis_content.html`:** เพิ่ม `id` (`btn-prio-routine`, `btn-prio-stat`) และ `type="button"`
2.  **`app-init.js`:**
    * เขียนฟังก์ชัน `updatePriorityUI` ใหม่
    * แก้ไข Event Listener ของปุ่ม Save ให้ดึงค่าจาก Global Variable `globalLisPriority` แทนการอ่านจาก DOM โดยตรง

## BETA 5.0-5.1 VERSION (Full Order Lab & Pathology System / Standard Data Integration)
(19 พฤศจิกายน 2025)

### วัตถุประสงค์ (Objective)
ยกระดับระบบสั่งตรวจทางห้องปฏิบัติการ (Order Lab) และพยาธิวิทยา (Order Pathology) ให้มีความสมบูรณ์ระดับ Production-Ready ทั้งในด้านข้อมูล (Data Standard) และประสบการณ์ใช้งาน (UX/UI) โดยอิงมาตรฐานสากล (HL7, LOINC, AAHA) และรองรับการใช้งานบน Tablet อย่างเต็มรูปแบบ

### สิ่งที่อัพเดท (Core Concepts)
1.  **Standardized Data Model:** เปลี่ยนข้อมูลรายการตรวจทั้งหมดเป็นของจริง อ้างอิงรหัสมาตรฐานโลก (LOINC for Tests, SNOMED for Specimens, HL7 Table 0074 for Categories) พร้อมระบุชนิดหลอดเก็บตัวอย่าง (Container) ตามมาตรฐาน ISO 15189
2.  **Hybrid Scroll Layout:** ปรับโครงสร้างหน้าจอเป็นแบบ "Fixed Frame" (Header/Footer ติดตาย) ส่วนเนื้อหาตรงกลางเลื่อนได้อิสระ (Scrollable Workspace) แก้ปัญหาหน้าจอยืดหดไม่สวยงามบน Tablet
3.  **High Contrast UI:** ปรับปรุงการแสดงผลป้ายกำกับ (Tags) และปุ่มสถานะ (Priority) ให้ชัดเจน อ่านง่ายในทุกสภาพแสง (Light/Dark Mode) โดยเฉพาะ Dark Mode ที่จูนสีให้เข้ากับธีม Earth Tone
4.  **Advanced Order Logic:** เพิ่มระบบจัดการสถานะความเร่งด่วน (Routine/STAT), สถานะงดอาหาร (Fasting), และ Logic การกรอกประวัติ Patho ที่ฉลาดขึ้น (จำประวัติเดิม ล้างแค่ตำแหน่ง)

### รายละเอียดการอัพเดท (Implementation Details)

#### ส่วนที่ 1: (Data) ฐานข้อมูลมาตรฐานสากล
1.  **`app-data.js` (Reworked):**
    * ยกเครื่อง `labServiceCatalog` และ `pathologyServiceCatalog` ใหม่ทั้งหมด
    * เพิ่มรายการตรวจละเอียดครบถ้วน: Hematology, Chemistry (Profiles), Immunology (Rapid Test), Urinalysis, Hormones, Drug Levels, PCR
    * เพิ่ม Field มาตรฐาน: `loinc` (รหัสทดสอบ), `snomed` (รหัสสิ่งส่งตรวจ), `container` (ชนิดหลอด/ภาชนะ)

#### ส่วนที่ 2: (UI/UX) หน้าจอสั่งตรวจ
2.  **`order_lis_content.html` (Clinical Lab):**
    * จัด Layout 3 คอลัมน์ (Category -> Item -> Cart) ความสูงคงที่ 650px
    * เพิ่มส่วนเลือก **Priority (Routine/STAT)** และ **Fasting Status** ที่ Footer
    * ปรับสี Header และ Theme ให้เป็นสีชมพู (Pink) ตามมาตรฐาน
3.  **`order_path_content.html` (Anatomic Path):**
    * จัด Layout 3 คอลัมน์ โดยคอลัมน์ขวาสุดเปลี่ยนเป็น **Form (Specimen & History)**
    * เพิ่ม Label บังคับกรอกตามมาตรฐาน AAHA (Site, Clinical History)
    * ปรับสี Header และ Theme ให้เป็นสีม่วง (Fuchsia) เพื่อแยกแยะจาก Lab

#### ส่วนที่ 3: (Logic) ระบบการทำงาน
4.  **`app-init.js` (Refactored):**
    * **Priority Logic:** เขียน Logic ควบคุมปุ่ม Routine/STAT ให้ทำงานถูกต้อง (Active State เปลี่ยนสีพื้นเทาเข้ม ตัวแดงสำหรับ STAT)
    * **Pathology Logic:** พัฒนาระบบ "Add to Request" ให้ล้างช่อง Site (ตำแหน่ง) แต่ **จำค่า History (ประวัติ)** ไว้เพื่อความสะดวกในการส่งหลายชิ้นเนื้อ
    * **Success Modal:** อัปเกรดหน้าต่างยืนยันผล:
        * แสดงสรุปยอดเงิน, จำนวนรายการ
        * แสดงสถานะ Priority และ Fasting
        * เพิ่มหมายเหตุ (Note) อธิบายความแตกต่างระหว่าง Accession No. และ Order No.
    * **Theme Matching:** แก้ไขป้าย Tag (Container Badge) ให้รองรับ Dark Mode แบบ Earth Tone (พื้นโปร่ง ตัวหนังสือ/ขอบสีน้ำตาลเข้ม) และ Light Mode แบบ High Contrast (พื้นขาว ขอบเทา)

#### ส่วนที่ 4: (Layout) โครงสร้างหลัก
5.  **`index.html` (Tweaked):**
    * ปรับปรุงส่วน `<main>` ให้รองรับ `overflow: hidden` เพื่อทำ Hybrid Scroll
    * ปรับปรุงส่วนแสดงผลสิทธิ์การรักษา (Pet Info) เป็นป้ายกำกับแทน Checkbox
    * จัดระเบียบ Tab Menu และ Footer ใหม่

## BETA 4.0 VERSION (LIS & Path Module Integration / Modal Architecture Refactor)
(18 พฤศจิกายน 2025)

### วัตถุประสงค์ (Objective)
เพิ่มโมดูลการสั่งตรวจทางห้องปฏิบัติการ (LIS Request) และพยาธิวิทยา (Path Request) พร้อมทั้งปรับปรุงโครงสร้างพื้นฐานของ Modal ให้รองรับการแสดงผลแบบ Fixed Layout และ Responsive ที่ดียิ่งขึ้น

### สิ่งที่อัพเดท (Core Concepts)
1.  **LIS Request Module:** เพิ่มระบบสั่งตรวจ Lab ที่มีความซับซ้อน รองรับการเลือก Category, Cost Items และ Preview ก่อนสั่ง
2.  **Path Request Module:** เพิ่มปุ่มและ Modal รองรับระบบ Path Request (Prototype)
3.  **Modal Architecture Refactor:** เปลี่ยนโครงสร้าง CSS ของ Modal ทั้งหมดจาก `sticky` เป็น `Flexbox` เพื่อแก้ปัญหา Header เลื่อนตาม และ Scrollbar ซ้อน
4.  **Standardized Table UI:** ปรับแต่งตาราง History ทั้งหมด (VS, Eye, LIS, Assessment, ExtDoc) ให้มี Sticky Header, Sticky First Column และ Hover Effect ที่เป็นมาตรฐานเดียวกัน
5.  **Tab Menu Update:** เปลี่ยนชื่อแท็บ "Order LOR" เป็น "Order Path"

### แผนการอัพเดท (Implementation Details)

#### ส่วนที่ 1: (HTML/CSS) LIS Module & Modal Refactor
1.  **`index.html` (แก้ไข):**
    * เพิ่มปุ่ม FAB (Floating Action Button) ใหม่ 2 ปุ่ม: **LIS Request** (สีชมพู `#db2777`) และ **Path Request** (สีม่วง `#701a75`)
    * สร้าง Modal `#lis-popup-modal` ใหม่ โดยใช้โครงสร้าง **Flexbox (Header + Sidebar + Main)**
    * กำหนด `max-height: 90vh` และ `overflow: hidden` ที่ Container หลัก เพื่อป้องกันปุ่ม Save ล้นจอ
2.  **`kahis-theme.css` (แก้ไข):**
    * เพิ่มคลาส `.list-frame`, `.list-header`, `.list-body` เพื่อจัดการ Scroll ภายในเฟรมเลือกรายการ (Select Tests)
    * เพิ่ม CSS สำหรับ **Global Sticky Table** เพื่อให้หัวตารางและคอลัมน์แรกของทุกตารางลอยติดขอบจอเสมอ

#### ส่วนที่ 2: (JS) LIS Logic & Interactivity
3.  **`app-init.js` (แก้ไข):**
    * เพิ่ม Logic ควบคุม LIS Modal:
        * **Interactive Selection:** คลิก Category (ซ้าย) -> โหลด Cost Items (กลาง) -> ติ๊กเลือก -> แสดง Preview (ขวา)
        * **Add to List:** ปุ่ม "Add Selected Tests" จะดึงข้อมูลลงตารางสรุปด้านล่างพร้อมปุ่มลบ
        * **Tab Switching:** สลับระหว่างหน้า "New LIS Request" และ "History"
    * เชื่อมต่อปุ่ม "Save LIS Request" ให้สลับไปแสดงหน้า **Summary View** (Success screen)
4.  **`app-data.js` (แก้ไข):**
    * เพิ่มข้อมูลตัวอย่าง (Mock Data) สำหรับ LIS History 20 รายการ ลงใน `activityLogData`

#### ส่วนที่ 3: (HTML/JS) Eye Exam & Vital Signs Polish
5.  **`index.html` (แก้ไข):**
    * ปรับแก้หัวตาราง Eye Exam ให้แสดงผล (OD)/(OS) เป็นบรรทัดใหม่ (`.eye-header-multiline`) เพื่อความสวยงามและประหยัดพื้นที่
6.  **`app-logic.js` (แก้ไข):**
    * อัปเดตฟังก์ชัน `renderEyeExamHistoryTable` ให้รองรับคอลัมน์ Meta Data (DVM, Dept, User, Time) และย้ายคอลัมน์ DVM ไปด้านหลัง
7.  **`app-init.js` (แก้ไข):**
    * กู้คืน Logic ของ **Problem List** ที่หายไป ให้กลับมาทำงานคลิกเลือกหมวดหมู่ได้ปกติ

## BETA 3.4 VERSION (Edit Copy effect Sparking)
(18 พฤศจิกายน 2025)

## คำอธิบายการทำงาน: Effect ปุ่ม Copy (JavaScript)

Effect การ Copy ที่เราสร้างขึ้น (Confetti + "Copied!" Glow) เป็นการทำงานร่วมกันของ 3 ส่วนหลัก:

1.  **`index.html` (หรือไฟล์ Module):** เป็น "ตัวจุดชนวน"
2.  **`app-helpers.js`:** เป็น "สมอง" ที่จัดการ Logic ทั้งหมด
3.  **`kahis-theme.css`:** เป็น "สไตล์" ที่ทำให้ "Copied!" สวยงาม

### แผนภาพการทำงาน (Flow)
`HTML (onclick)` → `copyAndSparkle()` → `copyToClipboard()` → (ถ้าสำเร็จ) → `showSparkleCopyEffect()` → (ยิง Confetti + สร้าง "Copied!" Glow)

### 1. (HTML) ตัวจุดชนวน
ในไฟล์ HTML, ปุ่ม Copy จะเรียกใช้ฟังก์ชัน `copyAndSparkle()`
เพิ่ม Script ใน index.html
<script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.0/fabric.min.js"></script>

### 2. (JS) app-helpers.js
ไฟล์นี้มี 3 ฟังก์ชันที่ทำงานประสานกัน:

A. copyAndSparkle(buttonElement, textToCopy)
ฟังก์ชันนี้คือ "ผู้จัดการ" ที่เราเรียกจาก HTML

JavaScript

function copyAndSparkle(buttonElement, textToCopy) {
    // 1. ลอง Copy ก่อน
    const success = copyToClipboard(textToCopy);
    
    // 2. ถ้า Copy สำเร็จ...
    if (success) {
        // ...ค่อยยิง Effect
        showSparkleCopyEffect(buttonElement);
    }
}
หน้าที่: ตรวจสอบว่าการ Copy (โดย copyToClipboard) สำเร็จหรือไม่ (return true) ถ้าสำเร็จ ค่อยสั่งให้ showSparkleCopyEffect ทำงาน

B. copyToClipboard(text)
ฟังก์ชันนี้คือ "คนทำงาน" ที่ทำหน้าที่ Copy อย่างเดียว

JavaScript

function copyToClipboard(text) {
    // สร้าง <textarea> ชั่วคราว
    const textarea = document.createElement('textarea');
    // ... (ตั้งค่า, ใส่ข้อความ) ...
    try {
        // สั่ง Copy
        document.execCommand('copy');
        return true; // สำเร็จ
    } catch (err) {
        return false; // ล้มเหลว
    } finally {
        // ... (ลบ <textarea> ทิ้ง) ...
    }
}
หน้าที่: ใช้เทคนิค document.execCommand('copy') (ซึ่งเป็นวิธีที่ใช้ได้ในสภาพแวดล้อม iFrame) เพื่อคัดลอกข้อความ และส่งผลลัพธ์ true (สำเร็จ) หรือ false (ล้มเหลว) กลับไป

C. showSparkleCopyEffect(buttonElement)
นี่คือ "พระเอก" ของงาน ที่สร้าง Effect ทั้งหมด 2 ส่วนพร้อมกัน

JavaScript

function showSparkleCopyEffect(buttonElement) {
    if (!buttonElement) return;

    // --- ส่วนที่ 1: ยิง Confetti (Sparkles) ---
    try {
        // 1.1 หาตำแหน่งปุ่ม (เป็น Pixel)
        const rect = buttonElement.getBoundingClientRect();
        
        // 1.2 แปลงเป็น % (0.0-1.0) ที่ Confetti ต้องการ
        const originX = (rect.left + rect.width / 2) / window.innerWidth;
        const originY = (rect.top + rect.height / 2) / window.innerHeight;

        // 1.3 สั่งยิง (ถ้า library โหลดมาแล้ว)
        if (typeof confetti === 'function') {
            confetti({
                angle: 270,        // พุ่งขึ้น
                gravity: 0.8,      // ตกลงมา
                scalar: 1.5,       // แรงยิง
                particleCount: 80,
                spread: 80,
                origin: { x: originX, y: originY }
                // ... (และค่าอื่นๆ)
            });
        }
    } catch (e) { /* ... */ }

    // --- ส่วนที่ 2: แสดง "Copied!" แบบ Glow ---
    try {
        // 2.1 สร้าง <span> "Copied!" ขึ้นมาใหม่
        const toast = document.createElement('span');
        toast.textContent = 'Copied!';
        
        // 2.2 (สำคัญ!) ใส่ CSS Class ที่กำหนดใน kahis-theme.css
        toast.className = 'copied-sparkle-toast'; 
        
        // 2.3 เพิ่มเข้าในหน้าเว็บ
        document.body.appendChild(toast);

        // 2.4 คำนวณตำแหน่ง (เหนือปุ่ม)
        const rect = buttonElement.getBoundingClientRect();
        const left = rect.left + (rect.width / 2); // กึ่งกลางปุ่ม
        const top = rect.top - 10;                  // เหนือปุ่ม 10px

        toast.style.left = left + 'px';
        toast.style.top = top + 'px';
        toast.style.transform = 'translateX(-50%)'; // จัดกึ่งกลาง (CSS)
        
        // 2.5 (สำคัญ!) ลบ "Copied!" ทิ้งหลังจาก Animation จบ
        // (ใน CSS, animation 'sparkle-pop' ใช้เวลา 1s หรือ 1000ms)
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 1000); 
    } catch (e) { /* ... */ }
}
สรุปส่วนที่ 2: ฟังก์ชันนี้จะ "ยิง" Confetti จากกึ่งกลางปุ่ม และ "สร้าง" Element <span> "Copied!" ให้ลอยขึ้นจากเหนือปุ่ม (โดยใช้ Animation จาก kahis-theme.css) จากนั้นตั้งเวลา 1 วินาทีเพื่อลบ <span> นั้นทิ้ง


## BETA 3.3 VERSION (Edit UI OrderPE, Ext Doc, Layout button, Copy effect)
(18 พฤศจิกายน 2025)

### วัตถุประสงค์ (Objective)
1.เพิ่ม effect การปุ่ม copy เมื่อกดตามที่วางแผนไว้
2.ขอให้ footer ที่มี hypertext กับ ชื่อโปรแกรม เปลี่ยนตำแหน่ง เป็น ให้ชิดไปด้านซ้ายสำหรับ hypertext และให้ชื่อระบบกับ version อยู่กึ่งกลาง
3.หน้า Order PE ขอปรับให้
   3.1 Target ช่องทั้งสี่ ให้ด้านซ้ายบนคือ Date ตามเดิม และย้าย Time มาอยู่ซ้ายล่าง โดยฝากซ้ายนี้ให้ ปรับความกว้างของช่องให้น้อยกว่านี้เยอะๆ แสดง date และ time ได้เพียงพอก็พอ มีช่องไฟพอสวยงานห่างจากขอบ และ ฝังขวาเป็น DVM บน และ Department ล่าง ความกว้างก็เต็มหน้าไป
   3.2 Select Orders ให้ลดความกว้างของปุ่ม vital sign และ eye exam ลง และขอให้แสดงข้อมูลในวงเล็บให้ครบทุกหัวข้อ) เรียงบนล่างตามเดิม แต่ว่า ให้จำลองปุ่ม Order Other A กับ Order Other B สีเทาๆ เหมือน inactive แต่ให้กดแล้วทำงานเหมือน vital และ eye
4. Ext Doc ขอให้ข้อมูลในตาราง คอลัม IMG ที่มีเลขจำนวนรูป เป็นการเปิด function เช่นเดียวกับ การกดที่ date time ครับ ส่วน PDF ไม่ต้องเปลี่ยนแปลงทำเป็นเหมือนกดได้แต่เป็น # เหมือนเดิมครับ (ทั้ง by filter และ by date)
5. ปุ่ม Confirm Create Ext. Document ย้ายมากึ่งกลาง และเพิ่มปุ่มสีเทาว่า ยกเลิกไว้คู่กัน ซ้าย ยกเลิก ขวา Confirm

### แผนการทำงาน - 9 ขั้นตอน

#### ส่วนที่ 1: (HTML) อัปเกรดโมดูล Ext Doc (คำขอข้อ 4 และ 5)

1.  **ขั้นตอนที่ 1/9: (ไฟล์: `extdoc_page_addnew.html`)**
    * **เป้าหมาย (ข้อ 5):** ย้ายปุ่ม "Confirm Create Ext. Document" ไปกึ่งกลาง และเพิ่มปุ่ม "ยกเลิก"
    * **เทคนิค:** แก้ไขโค้ด HTML ใน div สุดท้ายของไฟล์ `extdoc_page_addnew.html` จาก `justify-between` เป็น `justify-center` และเพิ่มปุ่มสีเทา (`bg-gray-200`) "ยกเลิก" ทางด้านซ้ายของปุ่ม "Confirm"

2.  **ขั้นตอนที่ 2/9: (ไฟล์: `extdoc-logic.js`)**
    * **เป้าหมาย (ข้อ 4):** ทำให้คอลัมน์ "IMG" (ที่มีตัวเลข) ในตาราง Ext Doc สามารถคลิกเพื่อเปิด Album Lightbox ได้
    * **เทคนิค:** แก้ไขฟังก์ชัน `renderTable` (ใน `extdoc-logic.js`) เราจะเปลี่ยน `<td>` ของคอลัมน์ IMG ให้เป็น `<a>` ที่มี `class="open-album-link"` (เหมือนกับคอลัมน์ Date/Time) และใส่ `data-gallery` ส่วนคอลัมน์ PDF จะคง `href="#"` ไว้ตามเดิม

3.  **ขั้นตอนที่ 3/9: (ไฟล์: `extdoc-init.js`)**
    * **เป้าหมาย (ข้อ 4):** ตรวจสอบว่า Event Listener รองรับการคลิกที่คอลัมน์ IMG
    * **เทคนิค:** (ตรวจสอบ) Logic `extDocTbody.addEventListener('click', ...)` (ใน `extdoc-init.js`) ที่เราเขียนไว้ ถูกต้องอยู่แล้ว (เพราะมันมองหา `e.target.closest('a.open-album-link')`) ดังนั้นขั้นตอนนี้จึงเป็นการยืนยันว่า Logic ที่เราทำในขั้นตอนที่ 2/9 จะทำงานได้ทันที

#### ส่วนที่ 2: (HTML/JS) อัปเกรดหน้า Order PE (คำขอข้อ 3)

4.  **ขั้นตอนที่ 4/9: (ไฟล์: `order_pe_content.html`)**
    * **เป้าหมาย (ข้อ 3.1):** จัด Layout ของ "Target" ใหม่ (Date/Time ซ้าย, DVM/Dept ขวา)
    * **เทคนิค:** เปลี่ยน `grid-cols-1 md:grid-cols-2` (ใน section "Target") ให้เป็น `grid-cols-3` (คอลัมน์ซ้าย `col-span-1`, คอลัมน์ขวา `col-span-2`) และปรับความกว้างของช่อง Date/Time ให้น้อยลง
    * **เป้าหมาย (ข้อ 3.2):** ลดความกว้างปุ่ม, เพิ่มข้อความในวงเล็บ, และเพิ่ม 2 ปุ่มสีเทา
    * **เทคนิค:** แก้ไข `grid-cols-1 md:grid-cols-2` (ใน section "Select Orders") ให้เป็น `grid-cols-3` (เหมือนกัน)
        * (ปุ่ม Vital Signs): เพิ่มข้อความในวงเล็บ (เช่น "...(Temp, HR, RR, BP, Pulse, CRT, FBS, Note)")
        * (ปุ่ม Eye Exam): เพิ่มข้อความในวงเล็บ (เช่น "...(PLR, Palpebral, Dazzle, Menace, STT, Fluorescein, IOP, Note)")
        * (ปุ่มใหม่): เพิ่ม `<button>` ใหม่ 2 ปุ่ม (Order Other A, Order Other B) โดยใช้สีเทา (`bg-gray-400`) และเพิ่ม id (เช่น `btn-order-pe-other-a`)

5.  **ขั้นตอนที่ 5/9: (ไฟล์: `order-pe-init.js`)**
    * **เป้าหมาย (ข้อ 3.2):** ทำให้ 2 ปุ่มสีเทาใหม่ทำงานได้
    * **เทคนิค:** เพิ่ม Event Listener ให้กับ 2 ID ใหม่ (`#btn-order-pe-other-a`, `#btn-order-pe-other-b`) ให้เรียกฟังก์ชัน `openOrderNoteModal()` (เหมือนที่ปุ่ม Vital Signs และ Eye Exam ทำ)

#### ส่วนที่ 3: (HTML) อัปเกรด Footer (คำขอข้อ 2)

6.  **ขั้นตอนที่ 6/9: (ไฟล์: `index.html`)**
    * **เป้าหมาย (ข้อ 2):** จัดตำแหน่งข้อความใน Footer (สีดำ/น้ำตาล) ใหม่
    * **เทคนิค:** ค้นหา `<div class="bg-gray-800 ...">` (ประมาณบรรทัดที่ 359)
        * เปลี่ยน div (container) ภายในจาก `flex justify-between` ให้เป็น `grid grid-cols-3`
        * คอลัมน์ 1: ใส่ Hyperlinks (จัดชิดซ้าย)
        * คอลัมน์ 2: ใส่ "ระบบเวชระเบียน... Version X.X.X.X" (จัดกึ่งกลาง)
        * คอลัมน์ 3: (เว้นว่างไว้ หรือจัดชิดขวา ถ้าจำเป็น)

#### ส่วนที่ 4: (JS/CSS) อัปเกรด Effect ปุ่ม Copy (คำขอข้อ 1)

7.  **ขั้นตอนที่ 7/9: (ไฟล์: `kahis-theme.css`)**
    * **เป้าหมาย (ข้อ 1):** เพิ่ม CSS สำหรับ Animation "Copied! ✨" (Sparkle effect)
    * **เทคนิค:** เพิ่ม CSS Class ใหม่ (เช่น `.copied-sparkle-effect`) ที่ใช้ `animation`, `@keyframes`, `transform`, และ `opacity` เพื่อสร้างเอฟเฟกต์ "เด้งขึ้นและจางหาย" (คล้ายใน lucide.dev)

8.  **ขั้นตอนที่ 8/9: (ไฟล์: `app-helpers.js`)**
    * **เป้าหมาย (ข้อ 1):** "รื้อ" Logic การ Copy
    * **เทคนิค:** แก้ไขฟังก์ชัน `showCopyMessage` ใหม่
        * **Logic ใหม่:** ฟังก์ชันนี้จะรับ `buttonElement` เข้ามา, `document.createElement('span')` (สร้าง "Copied!" ขึ้นมาใหม่), เพิ่ม Class `.copied-sparkle-effect` (จากขั้นตอนที่ 7/9), คำนวณตำแหน่ง (Position) ให้อยู่ข้างๆ ปุ่ม, และใช้ `setTimeout` เพื่อลบ span นั้นทิ้งเมื่อ Animation จบ

9.  **ขั้นตอนที่ 9/9: (ไฟล์: `app-logic.js`)**
    * **เป้าหมาย (ข้อ 1):** เชื่อมต่อ Logic ใหม่
    * **เทคนิค:** แก้ไข Event Listener ของปุ่ม Copy (ใน `initializeAssessmentScripts`)
        * **Logic ใหม่:** เปลี่ยนจากการเรียก `showCopyMessage(assessmentMsg)` เป็น `showCopyMessage(copyAssessmentBtn)` (ส่ง "ตัวปุ่ม" เข้าไปในฟังก์ชันแทน)

## BETA 3.2 VERSION (Floating UI Refactor)
(18 พฤศจิกายน 2025)

### วัตถุประสงค์ (Objective)
"รื้อ" (Refactor) แถบ Footer Bar ด้านล่างที่เกะกะ และแทนที่ด้วย "ปุ่มลอย" (Floating Action Buttons - FABs) เพื่อแก้ปัญหา UI ซ้อนทับ Pop-up และปรับปรุงระบบสลับธีม (2 ธีม)

### สิ่งที่อัพเดท (Core Concepts)
1.  **UI/UX:** เปลี่ยนจาก Footer Bar เป็นปุ่มลอย (FABs) ที่มุมล่างขวา
2.  **Action Menu:** สร้างเมนูซ่อนด้านซ้าย (Slide-out Menu) สำหรับปุ่ม Action (DF, TF, VS, Eye) เพื่อประหยัดพื้นที่และป้องกันการกดซ้อน
3.  **Theme Switcher:** เปลี่ยนจาก Checkbox (`<input>`) เป็นปุ่มกด 2 ปุ่ม (Light/Beige)
4.  **Icons:** เปลี่ยนไอคอนปุ่ม Action เป็น `lucide-icons` ( `stethoscope`, `user-round-pen`, `activity`) แบบ Inline SVG

### แผนการอัพเดท (The 5-Step Plan)
* **เทคนิค:** แก้ไข HTML DOM, เพิ่ม CSS สำหรับ Animation, และย้าย Event Listeners
1.  **`index.html` (แก้ไข):** **ลบ** `<footer ...>...</footer>` (แถบ Bar เดิม) ทิ้งทั้งหมด
2.  **`index.html` (แก้ไข):** **เพิ่ม** โค้ด HTML สำหรับปุ่มลอย 2 ชุด (ชุดเมนูซ้าย และชุดธีม/Go to Top ขวา) (ใช้ Inline SVG จาก Lucide)
3.  **`kahis-theme.css` (แก้ไข):** **เพิ่ม** CSS Class ใหม่สำหรับ `.fab-btn` และ `.action-menu-container` (รวมถึง `transition` และ `transform: translateX` สำหรับ Animation)
4.  **`app-init.js` (แก้ไข):** **ลบ** Logic การสลับธีมแบบ Checkbox (`darkmode-toggle`) **เพิ่ม** Logic ใหม่สำหรับปุ่ม `#theme-btn-light` / `#theme-btn-dark` และ `#go-to-top-btn` (ยังคงใช้ `classList.add/remove('dark')` เหมือนเดิม)
5.  **`app-init.js` (แก้ไข):** **ลบ** Event Listener ของปุ่ม Footer เก่า (`#open-df-popup` ฯลฯ) **เพิ่ม** Logic ใหม่สำหรับปุ่มเมนู (`#menu-toggle-btn`) และ "ต่อสายไฟใหม่" ให้ปุ่ม FABs (`#open-df-popup-fab` ฯลฯ) ไปเรียกฟังก์ชัน `showPopup()`, `showVitalsPopup()` ฯลฯ

## BETA 3.1 VERSION (Bug Fixing & Data Population)
(17 พ.ย. 2025)

### วัตถุประสงค์ (Objective)
แก้ไข Bug ร้ายแรงที่เกิดขึ้นหลังจากเริ่มแผน BETA 3.0 (Data Model Refactor) ซึ่งทำให้หน้า Pop-up (Vital Signs, Eye Exam) ไม่สามารถแสดงข้อมูล History และ Chart ได้, รวมถึงแก้ไข Bug ที่หน้า UI

### สิ่งที่อัพเดท (Bugs Found & Updates)
* **[BUG 1] UI Pop-up พัง:** หน้า "New Vital Signs" มีโค้ดเก่าและใหม่ซ้ำซ้อนกัน ทำให้ส่วน "Note" หายไป และ Title "Effective Date/Time" เพี้ยน
* **[BUG 2] CSS ซ้อนทับ:** หัวตาราง (`thead th`) ของ `historyTable` มี `z-index` สูงหรือเท่ากับคอลัมน์แรก (`sticky-col`) ทำให้ตัวหนังสือซ้อนกัน
* **[BUG 3] History หาย:** ตาราง History (ทั้ง Vital Signs และ Eye Exam) ไม่มีข้อมูลแสดงผล (หรือมี 1 แถว)
* **[BUG 4] Chart ไม่ทำงาน:** ปุ่ม Chart (BP, Vitals) ไม่ทำงาน

### แผนการอัพเดท (The 4-Step Bug Fix Plan)
1.  **`index.html` (แก้ไข):** "รื้อ" โค้ดที่ซ้ำซ้อนกันภายใน `<div id="content-new-vitals">` ทิ้งทั้งหมด และ "แทนที่" ด้วยโค้ดที่ถูกต้อง (ที่มี Section "Note" และ Title `h2` ที่มีสไตล์ครบถ้วน)
2.  **`kahis-theme.css` (แก้ไข):** แก้ไข `z-index` ของ `#historyTable thead th` ให้เป็น `10` (ซึ่งต่ำกว่า `z-index: 20` ของ `th:first-child`) เพื่อแก้ปัญหาการซ้อนทับ
3.  **`app-data.js` (แก้ไข):** "อัดข้อมูล" ตัวอย่าง 33 รายการ (VS 20 "Done", VS 5 "Order/Cancel", Eye 5 "Done", Eye 3 "Order") เข้าไปใน `activityLogData`
4.  **`app-init.js` (แก้ไข):** "ต่อสายไฟใหม่"
    * แก้ไข `showVitalsPopup()` และ `showEyePopup()` ให้ดึงข้อมูลจาก `activityLogData` (โดยกรอง `status: "Done"`)
    * สร้าง "Adapter" (ตัวแปลงข้อมูล) เพื่อแปลง Data Model ใหม่ (26+ fields) กลับไปเป็น Model เก่า (18 fields) ที่ตาราง History (`renderVsHistoryTable`) ต้องการ
    * แก้ไข Logic ของปุ่ม Chart (`bpChartBtn`, `vitalsChartBtn`) ให้ดึงข้อมูลจาก `activityLogData` เช่นกัน

---

## BETA 3.0 VERSION (Data Model Refactor)
(17 พ.ย. 2025)

### วัตถุประสงค์ (Objective)
เพื่อ "ผ่าตัด" ระบบข้อมูล (Data Model) ใหม่ทั้งหมด ให้รองรับแนวคิด **"ระบบ Order" (Order-Based System)** ซึ่งเป็นรากฐานที่จำเป็นก่อนที่จะสร้างแท็บ "Objective (Daily Log)"

### สิ่งที่อัพเดท (Core Concepts)
1.  **Central Database:** สร้างฐานข้อมูลกลาง `activityLogData` เพื่อเก็บ "ทุก" กิจกรรม (Vitals, Eye, Plan, Lab ฯลฯ)
2.  **Order vs Action:** แยก "คำสั่ง" (`order_no`) ออกจาก "การกระทำ" (`acc_no`)
3.  **Lifecycle:** กำหนดวงจรชีวิตของกิจกรรม (`Status: "Order", "Accept", "Process", "Done", "Cancelled"`)
4.  **Timestamping:** แยก "เวลาของข้อมูล" (`effective_time`) ออกจาก "เวลาที่บันทึก" (`last_updated_on` / `record_time`)
5.  **Planning:** เพิ่ม `target_time` (วัน-เวลาเป้าหมาย) และ `order_note` (บันทึกย่อยของแต่ละคำสั่ง)

### แผนการอัพเดท (The 5-Step Plan)
1.  **`app-data.js` (แก้ไข):** ลบ `vsHistoryData` และ `eyeExamHistoryData` สร้าง `activityLogData` ใหม่
2.  **`index.html` (แก้ไข):** อัปเกรด `#vitals-popup-modal` ให้มีช่อง `Effective Date/Time`, `DVM`, `Department`
3.  **`app-init.js` (แก้ไข):** อัปเกรดปุ่ม "Save Vital Signs" ให้บันทึกข้อมูล (Workflow A) ลงใน `activityLogData` (Status: "Done")
4.  **`order_pe_content.html` (แก้ไข):** สร้าง UI (Workflow B) ที่มีช่อง Target Time, DVM, Dept และปุ่ม Order (พร้อม Note Modal)
5.  **`order-pe-init.js` (สร้างใหม่):** สร้างไฟล์ JS นี้เพื่อควบคุม Workflow B ให้บันทึกลง `activityLogData` (Status: "Order") และเชื่อมต่อกับ `app-logic.js` / `index.html`

---

## BETA 2.1 VERSION (Ext Doc Fix - "New Ext Doc" Button)
(17 พ.ย. 2025)

### วัตถุประสงค์ (Objective)
แก้ไข Bug ที่ปุ่ม "New Ext Doc" ไม่ทำงานหลังจากผนวกรวมโมดูล (BETA 2.0)

### สิ่งที่อัพเดท (Bugs Found & Updates)
* **[BUG] "Cannot GET /Extdoc_Module_Addnew.html":** เกิดขึ้นเพราะปุ่มถูกเปลี่ยนเป็น `<a href...>` ซึ่งเป็นการ "ลิงก์" (Navigation) แทนที่จะเป็นการ "โหลด" (Module Loading)
* **[FIX]** เปลี่ยนกลับไปใช้ `<button id="btn-goto-addnew">`
* **[FIX]** สร้างไฟล์ `extdoc_page_addnew.html` (ชิ้นส่วน HTML)
* **[FIX]** สร้างไฟล์ `extdoc-addnew-init.js` เพื่อควบคุมหน้า "Add New" และอัปเกรด Lightbox ให้เป็นแบบ "อัลบั้ม"
* **[FIX]** อัปเกรด `app-logic.js` ให้รู้จัก `extdoc_page_addnew.html`
* **[FIX]** อัปเกรด `extdoc-init.js` ให้ผูก Event Click กับปุ่ม `#btn-goto-addnew`
* **[FIX]** อัปเกรด `index.html` ให้โหลด `<script src="extdoc-addnew-init.js"></script>`

---

## BETA 2.0 VERSION (Ext Doc Integration - Concept)
(17 พ.ย. 2025)

### วัตถุประสงค์ (Objective)
ผนวกรวม (Integrate) ฟีเจอร์จากไฟล์ต้นแบบ `Extdoc_Module_...html` เข้ากับโครงสร้าง SPA (BETA 1.0)

### แผนการอัพเดท (The 9-Step Plan)
1.  **สร้าง `extdoc_tab_date.html`** (ชิ้นส่วน HTML)
2.  **สร้าง `extdoc_tab_filter.html`** (ชิ้นส่วน HTML)
3.  **อัปเกรด `ext_doc_content.html`** (ให้เป็น Container)
4.  **อัปเกรด `index.html`** (เพิ่ม `#lightbox-album-modal`)
5.  **สร้าง `extdoc-data.js`** (ย้าย Data)
6.  **สร้าง `extdoc-logic.js`** (ย้าย Functions/Lightbox Logic)
7.  **สร้าง `extdoc-init.js`** (สร้าง `initializeExtDocScripts()`)
8.  **อัปเกรด `app-logic.js`** (สอน `loadModuleContent` ให้รู้จัก `initializeExtDocScripts()`)
9.  **อัปเกรด `index.html`** (เพิ่ม `<script>` ใหม่ 3 ไฟล์)

---

## BETA 1.0 VERSION (Core Refactor)
(16-17 พ.ย. 2025)

### วัตถุประสงค์ (Objective)
แก้ปัญหาไฟล์ `app.js` (Alpha) ที่มีขนาดใหญ่เกินไป (Monolithic) โดยการ "หั่น" (Refactor) ไฟล์ออกเป็นไฟล์ย่อยๆ ตามหน้าที่

### แผนการอัพเดท (The 8-Step Refactor)
1.  **`app-data.js` (ใหม่):** เก็บข้อมูลดิบ (Data Arrays)
2.  **`app-helpers.js` (ใหม่):** เก็บฟังก์ชันช่วยเหลือ (เช่น `copyToClipboard`)
3.  **`app-drawing.js` (ใหม่):** เก็บ Logic ของ Fabric.js
4.  **`app-charts.js` (ใหม่):** เก็บ Logic ของ Chart.js
5.  **`app-logic.js` (ใหม่):** เก็บ Logic หลัก (เช่น `loadModuleContent`)
6.  **`app-init.js` (ใหม่):** เก็บโค้ด `DOMContentLoaded` ทั้งหมด
7.  **`app.js` (แก้ไข):** ลบโค้ดทั้งหมดออก ให้เหลือแค่ตัวเรียก `initializeApp()`
8.  **`index.html` (แก้ไข):** เปลี่ยนไปเรียก `<script>` ทั้ง 7 ไฟล์ตามลำดับ

---

## END ALPHA VERSION (Initial Analysis)
(16 พ.ย. 2025)

### วัตถุประสงค์ (Objective)
วิเคราะห์โปรเจค EMR ที่ได้รับมา (ไฟล์ `index.html`, `app.js`, `kahis-theme.css`, และโมดูล HTML)

### สิ่งที่อัพเดท (Analysis Summary)
* **สถาปัตยกรรม:** เป็น SPA (Single Page Application) แบบ "Shell"
* **Logic:** `app.js` ทำหน้าที่เป็น Monolithic Controller โดยใช้ `fetch()` และ `innerHTML` เพื่อสลับโมดูล (`assessment_content.html`, ฯลฯ)
* **เทคโนโลยี:** Tailwind CSS, Alpine.js, Chart.js, Fabric.js, Lucide Icons
* **ฟีเจอร์:** Dark Mode, Modals (Vital Signs, Eye Exam), Dynamic History Tables (Sortable), Client-Side Data (Hardcoded Arrays)

### บทวิเคราะห์โปรเจค (Project Analysis)
นี่คือโปรเจค Front-End สำหรับ **ระบบเวชระเบียนอิเล็กทรอนิกส์ (EMR)** ซึ่งดูเหมือนจะเป็นหน้าจอสำหรับสัตวแพทย์ (DVM) เพื่อบันทึกข้อมูลการตรวจรักษา โดยมีชื่อระบบคือ **KAHIS** โปรเจคนี้เป็นเว็บแอปพลิเคชันแบบหน้าเดียว (Single Page Application - SPA) ที่ใช้การโหลดเนื้อหาแบบไดนามิก

### 1. สถาปัตยกรรมและโครงสร้าง (Architecture)
* **`index.html` (ไฟล์หลัก):** ทำหน้าที่เป็น "Shell" หรือ "เปลือก" ของแอปพลิเคชัน มีโครงสร้างถาวร เช่น Header (เมนู), Pet Info Bar (ข้อมูลสัตว์เลี้ยง), และ Footer (ปุ่ม Vital Signs, Dark Mode)
* **`app.js` (ไฟล์ควบคุม):** นี่คือหัวใจของโปรเจค
* **ไฟล์ `.html` อื่นๆ (Module Content):** ไฟล์เช่น `assessment_content.html`, `subj_content.html`, `plan_content.html` ฯลฯ ไม่ใช่หน้าเว็บที่สมบูรณ์ แต่เป็น "ชิ้นส่วน" ของ HTML ที่จะถูกดึง (fetch) โดย `app.js` และนำมาแสดงในช่องว่าง `#emr-content-placeholder` ใน `index.html`

### 2. เทคโนโลยีหลักที่ใช้ (Technology Stack)
1.  **Tailwind CSS:** ใช้สำหรับจัดสไตล์และ Layout ทั้งหมด
2.  **Alpine.js:** ใช้จัดการ UI เล็กๆ น้อยๆ ที่มีการโต้ตอบ (Interactivity) เช่น การเปิด-ปิด Dropdown Menu ใน Header
3.  **Chart.js:** ใช้สำหรับสร้างกราฟที่แสดงใน Pop-up (เช่น กราฟ BP Chart และ Vital Signs Chart)
4.  **Fabric.js:** ใช้สำหรับทำ "Drawing Tool" (เครื่องมือวาดภาพ/เขียนข้อความ) บน `eyeexam.png`
5.  **Lucide Icons:** ใช้สำหรับไอคอนทั้งหมดในหน้าเว็บ

### 3. ฟีเจอร์หลัก (Key Features)
* **Dark Mode / Theme:** มีระบบสลับ Theme (Light/Dark) ซึ่งถูกกำหนดค่าสีไว้ใน `kahis-theme.css` (โดย Dark Mode เป็นธีมสีเบจ/น้ำตาล)
* **Modals (Pop-ups) ที่ซับซ้อน:** (Vital Signs, Eye Exam, Problem List) ที่มี Logic การทำงานภายในตัวเอง
* **Dynamic History Tables:** ตารางประวัติ (ใน Assessment, Vital Signs, Eye Exam) ถูกสร้างขึ้นด้วย JavaScript และมีระบบ Sort ข้อมูล


* **Client-Side Data:** ข้อมูลประวัติทั้งหมด (`vsHistoryData`, `eyeExamHistoryData`, `categoryData`) ถูกเก็บไว้ในตัวแปร JavaScript (Hardcoded)


