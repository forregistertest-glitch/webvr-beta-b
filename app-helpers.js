// This is app-helpers.js (BETA 3.2 - Updated)

// --- 1. Copy to Clipboard Function (คงเดิม) ---
// (โค้ดส่วนนี้คือของเดิมของคุณครับ ไม่ได้แก้ไข)
function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; 
    textarea.style.opacity = 0;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        return true;
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        return false;
    } finally {
        document.body.removeChild(textarea);
    }
}


// --- 2. Show "Copied!" Sparkle Effect Function (เวอร์ชันรวมร่าง) ---
// (*** นี่คือฟังก์ชัน "เดิม" ที่ถูก "แทนที่" ด้วยเวอร์ชันใหม่ที่รวมทุกอย่างครับ ***)
function showSparkleCopyEffect(buttonElement) {
    if (!buttonElement) return;

    // --- ส่วนที่ 1: ยิง Confetti (แบบพุ่งขึ้น) ---
    try {
        const rect = buttonElement.getBoundingClientRect();
        
        // คำนวณจุดกึ่งกลางของปุ่ม
        const originX = (rect.left + rect.width / 2) / window.innerWidth;
        const originY = (rect.top + rect.height / 2) / window.innerHeight;

        // (ตรวจสอบว่า confetti ถูกโหลดมาหรือยัง)
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 80, // (คือจำนวนอนุภาค)
                spread: 150, // (ปรับมุมกระจายความกว้าง)
                angle: 120,          // (ทิศทางการพุ่ง: 90 = ขึ้นตรง)
                origin: {
                    x: originX,
                    y: originY
                },
                gravity: 0.8,      // (แรงโน้มถ่วง) อธิบาย: 1 คือแรงโน้มถ่วงปกติ (ตกลงพื้น), 0 คือไร้แรงโน้มถ่วง (ลอยค้าง), -1 คือแรงต้านแรงโน้มถ่วง (ลอยขึ้นฟ้า)
                scalar: 1.5,       // (แรงยิง) อธิบาย: ค่ามากขึ้น = ยิงแรงขึ้น
                drift: 2,            // (แรงลมข้าง) อธิบาย: ค่ามากขึ้น = ลอยไปทางขวา, ค่าน้อยลง = ลอยไปทางซ้าย
                // ------------------------------------

                // (ใช้สีจากธีม kahis-theme.css ของคุณ)
                colors: ['#3b82f6', '#10b981', '#f97316', '#ffffff'] 
            });
        } else {
            console.warn("Confetti library is not loaded.");
        }
    } catch (e) {
        console.error("Error firing confetti:", e);
    }

    // --- ส่วนที่ 2: แสดง "Copied!" แบบ Glow (โค้ดเดิมของคุณ) ---
    
    // 2.1 สร้าง element "Copied!"
    const toast = document.createElement('span');
    toast.textContent = 'Copied!';
    
    // (ใช้ Class จาก kahis-theme.css เพื่อให้มี Glow และลอยขึ้น)
    toast.className = 'copied-sparkle-toast'; 
    
    // 2.2 เพิ่มเข้าในหน้าเว็บ
    document.body.appendChild(toast);

    // 2.3 คำนวณตำแหน่ง (ให้อยู่เหนือปุ่ม)
    try {
        const rect = buttonElement.getBoundingClientRect();
        const left = rect.left + (rect.width / 2);
        const top = rect.top - 10; // (เหนือปุ่ม 10px)

        toast.style.left = left + 'px';
        toast.style.top = top + 'px';
        toast.style.transform = 'translateX(-50%)'; // (จัดกึ่งกลาง)
        
        // 2.4 ลบ "Copied!" ออกจากเว็บเมื่ออนิเมชั่นจบ
        // (อนิเมชั่น sparkle-pop ใน CSS ของคุณใช้เวลา 1 วินาที)
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 1000); // 1000ms = 1 วินาที

    } catch (e) {
        console.error("Error positioning sparkle toast:", e);
        // (Fallback กรณีหาตำแหน่งปุ่มไม่ได้)
        toast.style.left = '50%';
        toast.style.top = '50%';
        toast.style.transform = 'translate(-50%, -50%)';
    }
}


// --- 3. ฟังก์ชันสำหรับ Copy และยิง Effect พร้อมกัน (เพิ่มใหม่) ---
// (ฟังก์ชันนี้จำเป็นต้องมี เพื่อเรียกใช้จากปุ่มใน HTML)
function copyAndSparkle(buttonElement, textToCopy) {
    // 1. ลอง Copy ก่อน
    const success = copyToClipboard(textToCopy);
    
    // 2. ถ้า Copy สำเร็จ...
    if (success) {
        // ...ค่อยยิง Effect (โดยเรียกใช้ฟังก์ชันเวอร์ชันรวมร่าง)
        showSparkleCopyEffect(buttonElement);
    }
}