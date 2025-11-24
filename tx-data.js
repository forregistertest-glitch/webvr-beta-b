// This is tx-data.js
// Master Data for Order Tx (Medication, Procedures, Equipment)
// Expanded to ~20 items per category with specific units

const txServiceCatalog = {
    "MED": {
        name: "Medication (ยา)", icon: "syringe", 
        items: [
            // Antibiotics
            { id: "MED-001", name: "Amoxicillin 250mg", price: 50, container: "Tab", type: "Antibiotic" },
            { id: "MED-002", name: "Amoxicillin/Clavulanate 250mg", price: 85, container: "Tab", type: "Antibiotic" },
            { id: "MED-003", name: "Enrofloxacin 50mg", price: 80, container: "Tab", type: "Antibiotic" },
            { id: "MED-004", name: "Enrofloxacin 150mg", price: 120, container: "Tab", type: "Antibiotic" },
            { id: "MED-005", name: "Doxycycline 100mg", price: 60, container: "Cap", type: "Antibiotic" },
            { id: "MED-006", name: "Metronidazole 200mg", price: 40, container: "Tab", type: "Antibiotic" },
            { id: "MED-007", name: "Cefazolin Injection", price: 150, container: "Vial", type: "Antibiotic" },
            { id: "MED-008", name: "Ceftriaxone Injection", price: 180, container: "Vial", type: "Antibiotic" },
            
            // Pain & Anti-inflammatory
            { id: "MED-009", name: "Tramadol Injection", price: 150, container: "ml", type: "Painkiller" },
            { id: "MED-010", name: "Tramadol 50mg", price: 25, container: "Cap", type: "Painkiller" },
            { id: "MED-011", name: "Gabapentin 100mg", price: 30, container: "Cap", type: "Painkiller" },
            { id: "MED-012", name: "Carprofen 25mg", price: 40, container: "Tab", type: "NSAID" },
            { id: "MED-013", name: "Carprofen Injection", price: 120, container: "ml", type: "NSAID" },
            { id: "MED-014", name: "Meloxicam Injection", price: 100, container: "ml", type: "NSAID" },
            { id: "MED-015", name: "Tolfedine Injection", price: 110, container: "ml", type: "NSAID" },

            // GI & Others
            { id: "MED-016", name: "Omeprazole 10mg", price: 30, container: "Cap", type: "GI" },
            { id: "MED-017", name: "Ondansetron Injection", price: 200, container: "Amp", type: "GI" },
            { id: "MED-018", name: "Furosemide Injection", price: 100, container: "Amp", type: "Diuretic" },
            { id: "MED-019", name: "Vitamin B Complex Inj", price: 80, container: "ml", type: "Supplement" },
            { id: "MED-020", name: "Sterile Water for Inj", price: 20, container: "Vial", type: "Solvent" }
        ]
    },
    "PROC": {
        name: "Procedures (หัตถการ)", icon: "activity",
        items: [
            // Nursing
            { id: "PROC-101", name: "Wound Dressing (Small)", price: 200, container: "Set", type: "Nursing" },
            { id: "PROC-102", name: "Wound Dressing (Large)", price: 350, container: "Set", type: "Nursing" },
            { id: "PROC-103", name: "IV Catheter Placement", price: 350, container: "Time", type: "Nursing" },
            { id: "PROC-104", name: "Subcutaneous Fluid (SQ)", price: 150, container: "Time", type: "Nursing" },
            { id: "PROC-105", name: "Force Feeding", price: 100, container: "Time", type: "Nursing" },
            { id: "PROC-106", name: "Urinary Catheterization", price: 500, container: "Time", type: "Nursing" },
            { id: "PROC-107", name: "Enema (Suan-Tood)", price: 400, container: "Time", type: "Nursing" },
            { id: "PROC-108", name: "Ear Cleaning", price: 250, container: "Time", type: "Nursing" },
            { id: "PROC-109", name: "Eye Cleaning/Flushing", price: 150, container: "Time", type: "Nursing" },
            { id: "PROC-110", name: "Nail Trimming", price: 100, container: "Time", type: "Grooming" },
            
            // Support & Monitoring
            { id: "PROC-111", name: "Oxygen Therapy", price: 150, container: "Hour", type: "Support" },
            { id: "PROC-112", name: "Nebulization", price: 250, container: "Time", type: "Respiratory" },
            { id: "PROC-113", name: "Blood Glucose Check", price: 100, container: "Time", type: "Monitoring" },
            { id: "PROC-114", name: "Blood Pressure Monitor", price: 150, container: "Time", type: "Monitoring" },
            { id: "PROC-115", name: "ECG Monitoring", price: 500, container: "Session", type: "Monitoring" },
            
            // Special
            { id: "PROC-116", name: "Laser Therapy (1 Point)", price: 400, container: "Point", type: "Therapy" },
            { id: "PROC-117", name: "Acupuncture", price: 800, container: "Session", type: "Therapy" },
            { id: "PROC-118", name: "Ultrasound (Quick Scan)", price: 800, container: "Time", type: "Imaging" },
            { id: "PROC-119", name: "Digital X-Ray (1 View)", price: 600, container: "View", type: "Imaging" },
            { id: "PROC-120", name: "Microscope Exam (Skin)", price: 200, container: "Slide", type: "Lab" }
        ]
    },
    "EQUIP": {
        name: "Medical Equipment (เวชภัณฑ์)", icon: "package",
        items: [
            // Injection & IV
            { id: "EQ-001", name: "Syringe 1ml", price: 8, container: "Pcs", type: "Consumable" },
            { id: "EQ-002", name: "Syringe 3ml", price: 10, container: "Pcs", type: "Consumable" },
            { id: "EQ-003", name: "Syringe 5ml", price: 12, container: "Pcs", type: "Consumable" },
            { id: "EQ-004", name: "Syringe 10ml", price: 15, container: "Pcs", type: "Consumable" },
            { id: "EQ-005", name: "Needle No.18-24", price: 5, container: "Pcs", type: "Consumable" },
            { id: "EQ-006", name: "IV Set (Pediatric)", price: 120, container: "Set", type: "Consumable" },
            { id: "EQ-007", name: "IV Set (Adult)", price: 120, container: "Set", type: "Consumable" },
            { id: "EQ-008", name: "Extension Tube", price: 80, container: "Pcs", type: "Consumable" },
            { id: "EQ-009", name: "IV Catheter (Jelco)", price: 50, container: "Pcs", type: "Consumable" },
            { id: "EQ-010", name: "3-Way Stopcock", price: 60, container: "Pcs", type: "Consumable" },
            
            // Dressing & Protection
            { id: "EQ-011", name: "Gauze Pad (Sterile)", price: 15, container: "Pack", type: "Consumable" },
            { id: "EQ-012", name: "Cotton Ball (Sterile)", price: 15, container: "Pack", type: "Consumable" },
            { id: "EQ-013", name: "Acetate Tape 1 inch", price: 50, container: "Roll", type: "Consumable" },
            { id: "EQ-014", name: "Coban / Elastic Bandage", price: 80, container: "Roll", type: "Consumable" },
            { id: "EQ-015", name: "Elastic Bandage 2 inch", price: 45, container: "Roll", type: "Consumable" },
            { id: "EQ-016", name: "Examination Gloves", price: 10, container: "Pair", type: "Consumable" },
            { id: "EQ-017", name: "Elizabethan Collar (Size 10)", price: 150, container: "Pcs", type: "Consumable" },
            { id: "EQ-018", name: "Elizabethan Collar (Size 15)", price: 200, container: "Pcs", type: "Consumable" },
            { id: "EQ-019", name: "Diaper (S)", price: 25, container: "Pcs", type: "Consumable" },
            { id: "EQ-020", name: "Underpad (Blue)", price: 20, container: "Sheet", type: "Consumable" }
        ]
    }
};