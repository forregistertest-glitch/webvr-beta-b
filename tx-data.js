// This is tx-data.js
// Master Data for Order Tx (Medication, Procedures, Equipment)
// Updated for Beta 6.2 (Split Container vs Used Unit)

const txServiceCatalog = {
    "MED": {
        name: "Medication (ยา)", icon: "syringe", 
        items: [
            // Antibiotics (Oral -> Container: Bottle/Box, Unit: Tab/Cap)
            { id: "MED-001", name: "Amoxicillin 250mg", price: 50, container: "Bottle", used_unit: "Tab", type: "Antibiotic" },
            { id: "MED-002", name: "Amoxicillin/Clavulanate 250mg", price: 85, container: "Box", used_unit: "Tab", type: "Antibiotic" },
            { id: "MED-003", name: "Enrofloxacin 50mg", price: 80, container: "Bottle", used_unit: "Tab", type: "Antibiotic" },
            { id: "MED-004", name: "Enrofloxacin 150mg", price: 120, container: "Bottle", used_unit: "Tab", type: "Antibiotic" },
            { id: "MED-005", name: "Doxycycline 100mg", price: 60, container: "Bottle", used_unit: "Cap", type: "Antibiotic" },
            { id: "MED-006", name: "Metronidazole 200mg", price: 40, container: "Bottle", used_unit: "Tab", type: "Antibiotic" },
            // Antibiotics (Inj -> Container: Vial, Unit: ml/Vial)
            { id: "MED-007", name: "Cefazolin Injection", price: 150, container: "Vial", used_unit: "Vial", type: "Antibiotic" },
            { id: "MED-008", name: "Ceftriaxone Injection", price: 180, container: "Vial", used_unit: "Vial", type: "Antibiotic" },
            
            // Pain (Inj -> Container: Amp, Unit: ml)
            { id: "MED-009", name: "Tramadol Injection", price: 150, container: "Amp", used_unit: "ml", type: "Painkiller" },
            { id: "MED-010", name: "Tramadol 50mg", price: 25, container: "Bottle", used_unit: "Cap", type: "Painkiller" },
            { id: "MED-011", name: "Gabapentin 100mg", price: 30, container: "Bottle", used_unit: "Cap", type: "Painkiller" },
            { id: "MED-012", name: "Carprofen 25mg", price: 40, container: "Bottle", used_unit: "Tab", type: "NSAID" },
            { id: "MED-013", name: "Carprofen Injection", price: 120, container: "Vial", used_unit: "ml", type: "NSAID" },
            { id: "MED-014", name: "Meloxicam Injection", price: 100, container: "Vial", used_unit: "ml", type: "NSAID" },
            { id: "MED-015", name: "Tolfedine Injection", price: 110, container: "Vial", used_unit: "ml", type: "NSAID" },

            // Others
            { id: "MED-016", name: "Omeprazole 10mg", price: 30, container: "Bottle", used_unit: "Cap", type: "GI" },
            { id: "MED-017", name: "Ondansetron Injection", price: 200, container: "Amp", used_unit: "ml", type: "GI" },
            { id: "MED-018", name: "Furosemide Injection", price: 100, container: "Amp", used_unit: "ml", type: "Diuretic" },
            { id: "MED-019", name: "Vitamin B Complex Inj", price: 80, container: "Vial", used_unit: "ml", type: "Supplement" },
            { id: "MED-020", name: "Sterile Water for Inj", price: 20, container: "Vial", used_unit: "ml", type: "Solvent" }
        ]
    },
    "PROC": {
        name: "Procedures (หัตถการ)", icon: "activity",
        items: [
            // Procedure หน่วยจะเป็น Time/Session/Point (Container = N/A หรือ -)
            { id: "PROC-101", name: "Wound Dressing (Small)", price: 200, container: "-", used_unit: "Set", type: "Nursing" },
            { id: "PROC-102", name: "Wound Dressing (Large)", price: 350, container: "-", used_unit: "Set", type: "Nursing" },
            { id: "PROC-103", name: "IV Catheter Placement", price: 350, container: "-", used_unit: "Time", type: "Nursing" },
            { id: "PROC-104", name: "Subcutaneous Fluid (SQ)", price: 150, container: "-", used_unit: "Time", type: "Nursing" },
            { id: "PROC-105", name: "Force Feeding", price: 100, container: "-", used_unit: "Time", type: "Nursing" },
            { id: "PROC-106", name: "Urinary Catheterization", price: 500, container: "-", used_unit: "Time", type: "Nursing" },
            { id: "PROC-107", name: "Enema (Suan-Tood)", price: 400, container: "-", used_unit: "Time", type: "Nursing" },
            { id: "PROC-108", name: "Ear Cleaning", price: 250, container: "-", used_unit: "Time", type: "Nursing" },
            { id: "PROC-109", name: "Eye Cleaning/Flushing", price: 150, container: "-", used_unit: "Time", type: "Nursing" },
            { id: "PROC-110", name: "Nail Trimming", price: 100, container: "-", used_unit: "Time", type: "Grooming" },
            
            { id: "PROC-111", name: "Oxygen Therapy", price: 150, container: "-", used_unit: "Hour", type: "Support" },
            { id: "PROC-112", name: "Nebulization", price: 250, container: "-", used_unit: "Time", type: "Respiratory" },
            { id: "PROC-113", name: "Blood Glucose Check", price: 100, container: "-", used_unit: "Time", type: "Monitoring" },
            { id: "PROC-114", name: "Blood Pressure Monitor", price: 150, container: "-", used_unit: "Time", type: "Monitoring" },
            { id: "PROC-115", name: "ECG Monitoring", price: 500, container: "-", used_unit: "Session", type: "Monitoring" },
            
            { id: "PROC-116", name: "Laser Therapy (1 Point)", price: 400, container: "-", used_unit: "Point", type: "Therapy" },
            { id: "PROC-117", name: "Acupuncture", price: 800, container: "-", used_unit: "Session", type: "Therapy" },
            { id: "PROC-118", name: "Ultrasound (Quick Scan)", price: 800, container: "-", used_unit: "Time", type: "Imaging" },
            { id: "PROC-119", name: "Digital X-Ray (1 View)", price: 600, container: "-", used_unit: "View", type: "Imaging" },
            { id: "PROC-120", name: "Microscope Exam (Skin)", price: 200, container: "-", used_unit: "Slide", type: "Lab" }
        ]
    },
    "EQUIP": {
        name: "Medical Equipment (เวชภัณฑ์)", icon: "package",
        items: [
            // Equipment (Container: Box/Pack, Unit: Pcs/Pair/Set)
            { id: "EQ-001", name: "Syringe 1ml", price: 8, container: "Box", used_unit: "Pcs", type: "Consumable" },
            { id: "EQ-002", name: "Syringe 3ml", price: 10, container: "Box", used_unit: "Pcs", type: "Consumable" },
            { id: "EQ-003", name: "Syringe 5ml", price: 12, container: "Box", used_unit: "Pcs", type: "Consumable" },
            { id: "EQ-004", name: "Syringe 10ml", price: 15, container: "Box", used_unit: "Pcs", type: "Consumable" },
            { id: "EQ-005", name: "Needle No.18-24", price: 5, container: "Box", used_unit: "Pcs", type: "Consumable" },
            { id: "EQ-006", name: "IV Set (Pediatric)", price: 120, container: "Pack", used_unit: "Set", type: "Consumable" },
            { id: "EQ-007", name: "IV Set (Adult)", price: 120, container: "Pack", used_unit: "Set", type: "Consumable" },
            { id: "EQ-008", name: "Extension Tube", price: 80, container: "Pack", used_unit: "Pcs", type: "Consumable" },
            { id: "EQ-009", name: "IV Catheter (Jelco)", price: 50, container: "Box", used_unit: "Pcs", type: "Consumable" },
            { id: "EQ-010", name: "3-Way Stopcock", price: 60, container: "Box", used_unit: "Pcs", type: "Consumable" },
            
            { id: "EQ-011", name: "Gauze Pad (Sterile)", price: 15, container: "Pack", used_unit: "Pcs", type: "Consumable" },
            { id: "EQ-012", name: "Cotton Ball (Sterile)", price: 15, container: "Pack", used_unit: "Pcs", type: "Consumable" },
            { id: "EQ-013", name: "Acetate Tape 1 inch", price: 50, container: "Box", used_unit: "Roll", type: "Consumable" },
            { id: "EQ-014", name: "Coban / Elastic Bandage", price: 80, container: "Box", used_unit: "Roll", type: "Consumable" },
            { id: "EQ-015", name: "Elastic Bandage 2 inch", price: 45, container: "Box", used_unit: "Roll", type: "Consumable" },
            { id: "EQ-016", name: "Examination Gloves", price: 10, container: "Box", used_unit: "Pair", type: "Consumable" },
            { id: "EQ-017", name: "Elizabethan Collar (Size 10)", price: 150, container: "Stock", used_unit: "Pcs", type: "Consumable" },
            { id: "EQ-018", name: "Elizabethan Collar (Size 15)", price: 200, container: "Stock", used_unit: "Pcs", type: "Consumable" },
            { id: "EQ-019", name: "Diaper (S)", price: 25, container: "Pack", used_unit: "Pcs", type: "Consumable" },
            { id: "EQ-020", name: "Underpad (Blue)", price: 20, container: "Pack", used_unit: "Sheet", type: "Consumable" }
        ]
    }
};