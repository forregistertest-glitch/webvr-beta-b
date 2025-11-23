// This is sys-exam-data.js
// Mock Data for Systematic Examination Module (Generates ~3,200 records)

(function() {
    // Configuration for Mock Data
    const dvms = ['AAA', 'BBB', 'CCC', 'DDD', 'EEE', 'FFF'];
    const depts = ['101', '102', '103', '201', '202', '301'];
    
    // Helper: Pad number with leading zero
    const pad = (num) => String(num).padStart(2, '0');
    
    // Helper: Month Names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    function generateSysExamHistory() {
        const data = [];
        // Start from Dec 31, 2025 23:55 (Matching the UI "Last Update")
        const startDate = new Date(2025, 11, 31, 23, 55, 0); 
        
        for (let i = 0; i < 3200; i++) {
            // Clone date and subtract time (simulate history going back)
            let currentDate = new Date(startDate.getTime());
            // Random gap between 30 mins to 4 hours
            const gapMinutes = 30 + Math.floor(Math.random() * 210); 
            currentDate.setMinutes(currentDate.getMinutes() - (i * gapMinutes));
            
            // Format datetime for sorting: YYYY-MM-DD HH:mm
            const yyyy = currentDate.getFullYear();
            const mm = pad(currentDate.getMonth() + 1);
            const dd = pad(currentDate.getDate());
            const hh = pad(currentDate.getHours());
            const min = pad(currentDate.getMinutes());
            const datetimeSort = `${yyyy}-${mm}-${dd} ${hh}:${min}`;
            
            // Format datetime for display: 31 Dec 2025 20:00
            const day = pad(currentDate.getDate());
            const month = monthNames[currentDate.getMonth()];
            const year = currentDate.getFullYear();
            const datetimeStr = `${day} ${month} ${year} ${hh}:${min}`;

            data.push({
                datetime: datetimeSort,
                datetimeStr: datetimeStr,
                dvm: dvms[Math.floor(Math.random() * dvms.length)],
                department: depts[Math.floor(Math.random() * depts.length)]
            });
        }
        return data;
    }

    // Export generated data to Global Scope
    window.sysExamHistoryData = generateSysExamHistory();
    console.log("Sys Exam Mock Data Generated:", window.sysExamHistoryData.length, "items");

})();