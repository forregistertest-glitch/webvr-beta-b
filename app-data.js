// This is app-data.js (BETA 5.6 Revised 4 - Cleaned & Full Mock Data)

// =================================================================
// 1. MASTER DATA - SERVICE CATALOG
// =================================================================

// CLINICAL LABORATORY (LIS)
const labServiceCatalog = {
    "HEM": {
        name: "Hematology (โลหิตวิทยา)", icon: "droplet",
        items: [
            { id: "CBC", name: "Complete Blood Count (CBC)", price: 350, container: "Lavender (EDTA)", type: "Panel" },
            { id: "BLP", name: "Blood Parasite Smear", price: 150, container: "Lavender (EDTA)", type: "Test" },
            { id: "COAG", name: "Coagulation (PT/APTT)", price: 850, container: "Light Blue", type: "Panel" }
        ]
    },
    "CHEM": {
        name: "Clinical Chemistry (เคมีคลินิก)", icon: "flask-conical",
        items: [
            { id: "PREOP", name: "Pre-anesthetic Panel", price: 650, container: "Red/SST", type: "Panel" },
            { id: "COMP", name: "Comprehensive Panel", price: 1400, container: "Red/SST", type: "Panel" },
            { id: "RENAL", name: "Renal Panel", price: 500, container: "Red/SST", type: "Panel" },
            { id: "LIVER", name: "Liver Panel", price: 550, container: "Red/SST", type: "Panel" },
            { id: "ELEC", name: "Electrolytes", price: 350, container: "Red/SST", type: "Panel" },
            { id: "GLU", name: "Glucose", price: 100, container: "Grey", type: "Test" }
        ]
    },
    "IMM": {
        name: "Immunology (ภูมิคุ้มกัน)", icon: "shield-check",
        items: [
            { id: "4DX", name: "4Dx Plus Test", price: 950, container: "Lavender", type: "Rapid" },
            { id: "PARVO", name: "Parvovirus Test", price: 500, container: "Feces", type: "Rapid" }
        ]
    }
};

// PATHOLOGY
const pathologyServiceCatalog = {
    "CY": {
        name: "Cytology (เซลล์วิทยา)", icon: "microscope",
        items: [
            { id: "CY01", name: "Cytology - 1 Site", price: 400, req_site: true },
            { id: "CY02", name: "Cytology - 2 Sites", price: 700, req_site: true }
        ]
    },
    "SP": {
        name: "Biopsy (ชิ้นเนื้อ)", icon: "file-text",
        items: [
            { id: "SP-S", name: "Biopsy - Small", price: 1200, req_site: true },
            { id: "SP-ORG", name: "Biopsy - Whole Organ", price: 2500, req_site: true }
        ]
    }
};

// PROBLEM LIST TAGS (Expanded)
const categoryData = {
    "common": [ 
        { term: "Depressed", tags: "General" }, 
        { term: "Anorexia", tags: "GI" }, 
        { term: "Vomiting", tags: "GI" },
        { term: "Fever (Pyrexia)", tags: "General, Sign" },
        { term: "Dehydration", tags: "General, Status" },
        { term: "Weight loss", tags: "General, Chronic" },
        { term: "Obesity", tags: "General, Nutrition" },
        { term: "Lethargy", tags: "General" },
        { term: "Weakness", tags: "General, Neuro/Muscle" },
        { term: "Pale mucous membrane", tags: "General, Anemia" },
        { term: "Jaundice (Icterus)", tags: "General, Liver/Blood" },
        { term: "Lymphadenopathy", tags: "General, Lymph node" },
        { term: "Polydipsia (PD)", tags: "General, Drinking" },
        { term: "Polyuria (PU)", tags: "General, Urination" },
        { term: "Halitosis", tags: "General, Oral" },
        { term: "Hypothermia", tags: "General, Status" },
        { term: "Shock", tags: "General, Emergency" },
        { term: "Cyanosis", tags: "General, Hypoxia" },
        { term: "Petechiae", tags: "General, Bleeding" },
        { term: "Edema", tags: "General, Fluid" }
    ],
    "eye": [ 
        { term: "Corneal ulcer", tags: "Eye" }, 
        { term: "Glaucoma", tags: "Eye" }, 
        { term: "Conjunctivitis", tags: "Eye" },
        { term: "Cataract", tags: "Eye, Lens" },
        { term: "Keratoconjunctivitis sicca (KCS)", tags: "Eye, Dry eye" },
        { term: "Cherry eye", tags: "Eye, Eyelid" },
        { term: "Entropion", tags: "Eye, Eyelid" },
        { term: "Ectropion", tags: "Eye, Eyelid" },
        { term: "Uveitis", tags: "Eye, Inflammation" },
        { term: "Proptosis", tags: "Eye, Trauma" },
        { term: "Retinal detachment", tags: "Eye, Retina" },
        { term: "Nuclear sclerosis", tags: "Eye, Aging" },
        { term: "Hyphema", tags: "Eye, Bleeding" },
        { term: "Iris atrophy", tags: "Eye, Iris" },
        { term: "Lens luxation", tags: "Eye, Lens" },
        { term: "Blepharitis", tags: "Eye, Eyelid" },
        { term: "Distichiasis", tags: "Eye, Eyelid" },
        { term: "Horner's syndrome", tags: "Eye, Neuro" }
    ],
    "ear": [ 
        { term: "Otitis externa", tags: "Ear, Infection" }, 
        { term: "Ear mites", tags: "Ear, Parasite" }, 
        { term: "Aural hematoma", tags: "Ear, Trauma" },
        { term: "Otitis media", tags: "Ear, Middle ear" },
        { term: "Otitis interna", tags: "Ear, Inner ear" },
        { term: "Deafness", tags: "Ear, Hearing" },
        { term: "Ear polyp", tags: "Ear, Mass" },
        { term: "Fly bite dermatitis", tags: "Ear, Skin" },
        { term: "Vestibular disease", tags: "Ear, Neuro" },
        { term: "Foreign body in ear", tags: "Ear, Foreign body" },
        { term: "Pinnal vasculitis", tags: "Ear, Vessel" },
        { term: "Ceruminous gland adenoma", tags: "Ear, Tumor" }
    ],
    "nose": [ 
        { term: "Nasal discharge", tags: "Nose, Symptom" }, 
        { term: "Sneezing", tags: "Nose, Symptom" },
        { term: "Epistaxis", tags: "Nose, Bleeding" },
        { term: "Rhinitis", tags: "Nose, Inflammation" },
        { term: "Nasal tumor", tags: "Nose, Mass" },
        { term: "Stenotic nares", tags: "Nose, Congenital" },
        { term: "Reverse sneezing", tags: "Nose, Respiratory" },
        { term: "Sinusitis", tags: "Nose, Sinus" },
        { term: "Nasal foreign body", tags: "Nose, Foreign body" },
        { term: "Aspergillosis", tags: "Nose, Fungal" }
    ],
    "throat": [ 
        { term: "Coughing", tags: "Throat, Symptom" }, 
        { term: "Pharyngitis", tags: "Throat, Inflammation" },
        { term: "Tracheal collapse", tags: "Throat, Airway" },
        { term: "Kennel cough", tags: "Throat, Infection" },
        { term: "Laryngeal paralysis", tags: "Throat, Larynx" },
        { term: "Gagging", tags: "Throat, Symptom" },
        { term: "Tonsillitis", tags: "Throat, Tonsil" },
        { term: "Brachycephalic airway syndrome", tags: "Throat, Congenital" },
        { term: "Esophageal foreign body", tags: "Throat, GI" },
        { term: "Megaesophagus", tags: "Throat, GI" }
    ],
    "abdomen": [ 
        { term: "Abdominal pain", tags: "Abdomen, Symptom" }, 
        { term: "Diarrhea", tags: "Abdomen, GI" }, 
        { term: "Foreign body", tags: "Abdomen, GI" },
        { term: "Pancreatitis", tags: "Abdomen, Pancreas" },
        { term: "Gastritis", tags: "Abdomen, Stomach" },
        { term: "Enteritis", tags: "Abdomen, Intestine" },
        { term: "Hepatitis", tags: "Abdomen, Liver" },
        { term: "Pyometra", tags: "Abdomen, Reproductive" },
        { term: "Cystitis", tags: "Abdomen, Bladder" },
        { term: "Ascites", tags: "Abdomen, Fluid" },
        { term: "Constipation", tags: "Abdomen, GI" },
        { term: "GDV (Bloat)", tags: "Abdomen, Emergency" },
        { term: "Splenic mass", tags: "Abdomen, Spleen" },
        { term: "Prostatitis", tags: "Abdomen, Prostate" },
        { term: "Urolithiasis", tags: "Abdomen, Bladder" },
        { term: "Intussusception", tags: "Abdomen, Intestine" },
        { term: "IBD", tags: "Abdomen, Chronic" }
    ],
    "trauma": [ 
        { term: "Laceration", tags: "Trauma, Skin" }, 
        { term: "Hit by car", tags: "Trauma, HBC" },
        { term: "Bite wound", tags: "Trauma, Skin" },
        { term: "Burn", tags: "Trauma, Skin" },
        { term: "Abrasion", tags: "Trauma, Skin" },
        { term: "Contusion", tags: "Trauma, Bruise" },
        { term: "Fall from height", tags: "Trauma, High rise" },
        { term: "Gunshot wound", tags: "Trauma, Penetrating" },
        { term: "Degloving injury", tags: "Trauma, Severe" },
        { term: "Snake bite", tags: "Trauma, Toxin" },
        { term: "Insect sting", tags: "Trauma, Allergic" }
    ],
    "bone": [ 
        { term: "Fracture", tags: "Bone, Trauma" }, 
        { term: "Arthritis", tags: "Bone, Chronic" },
        { term: "Patellar luxation", tags: "Bone, Knee" },
        { term: "Hip dysplasia", tags: "Bone, Hip" },
        { term: "Osteosarcoma", tags: "Bone, Tumor" },
        { term: "Intervertebral Disc Disease (IVDD)", tags: "Bone, Spine" },
        { term: "Lameness", tags: "Bone, Symptom" },
        { term: "Cruciate ligament rupture", tags: "Bone, Knee" },
        { term: "Panosteitis", tags: "Bone, Growing pain" },
        { term: "Spondylosis", tags: "Bone, Spine" },
        { term: "Dislocation (Luxation)", tags: "Bone, Joint" }
    ],
    "behavier": [ 
        { term: "Aggression", tags: "Behavior" }, 
        { term: "Anxiety", tags: "Behavior" },
        { term: "Separation anxiety", tags: "Behavior" },
        { term: "Inappropriate elimination", tags: "Behavior" },
        { term: "Fear phobia", tags: "Behavior" },
        { term: "Compulsive disorder", tags: "Behavior" },
        { term: "Cognitive dysfunction", tags: "Behavior, Senior" },
        { term: "Barking excessive", tags: "Behavior" },
        { term: "Destructive behavior", tags: "Behavior" },
        { term: "Thunderstorm phobia", tags: "Behavior" }
    ]
};

// ASSESSMENT HISTORY (Mock - Expanded to 20 items)
let assessmentHistoryData = [
    { datetime: '2025-12-31 09:00', datetimeStr: '31 Dec 2025 09:00', dvm: 'Dr. AAA', department: '101' },
    { datetime: '2025-12-30 14:00', datetimeStr: '30 Dec 2025 14:00', dvm: 'Dr. BBB', department: '201' },
    { datetime: '2025-12-28 10:30', datetimeStr: '28 Dec 2025 10:30', dvm: 'Dr. CCC', department: '301' },
    { datetime: '2025-12-25 11:15', datetimeStr: '25 Dec 2025 11:15', dvm: 'Dr. AAA', department: '101' },
    { datetime: '2025-12-20 16:45', datetimeStr: '20 Dec 2025 16:45', dvm: 'Dr. Surg', department: '102' },
    { datetime: '2025-12-15 09:00', datetimeStr: '15 Dec 2025 09:00', dvm: 'Dr. BBB', department: '101' },
    { datetime: '2025-12-10 13:20', datetimeStr: '10 Dec 2025 13:20', dvm: 'Dr. Eye', department: '301' },
    { datetime: '2025-12-05 08:45', datetimeStr: '05 Dec 2025 08:45', dvm: 'Dr. AAA', department: '101' },
    { datetime: '2025-11-30 15:00', datetimeStr: '30 Nov 2025 15:00', dvm: 'Dr. CCC', department: '201' },
    { datetime: '2025-11-20 10:00', datetimeStr: '20 Nov 2025 10:00', dvm: 'Dr. Surg', department: '102' },
    { datetime: '2025-11-15 11:30', datetimeStr: '15 Nov 2025 11:30', dvm: 'Dr. AAA', department: '101' },
    { datetime: '2025-10-30 14:15', datetimeStr: '30 Oct 2025 14:15', dvm: 'Dr. BBB', department: '101' },
    { datetime: '2025-10-15 09:45', datetimeStr: '15 Oct 2025 09:45', dvm: 'Dr. Eye', department: '301' },
    { datetime: '2025-09-20 13:00', datetimeStr: '20 Sep 2025 13:00', dvm: 'Dr. CCC', department: '201' },
    { datetime: '2025-08-10 10:30', datetimeStr: '10 Aug 2025 10:30', dvm: 'Dr. AAA', department: '101' },
    { datetime: '2025-07-05 16:00', datetimeStr: '05 Jul 2025 16:00', dvm: 'Dr. Surg', department: '102' },
    { datetime: '2025-06-15 11:00', datetimeStr: '15 Jun 2025 11:00', dvm: 'Dr. BBB', department: '101' },
    { datetime: '2025-05-20 09:15', datetimeStr: '20 May 2025 09:15', dvm: 'Dr. Eye', department: '301' },
    { datetime: '2025-04-10 14:45', datetimeStr: '10 Apr 2025 14:45', dvm: 'Dr. CCC', department: '201' },
    { datetime: '2025-01-05 10:00', datetimeStr: '05 Jan 2025 10:00', dvm: 'Dr. AAA', department: '101' }
];


// =================================================================
// 2. DATA GENERATOR ENGINE (MAIN APP)
// =================================================================

const MOCK_CONFIG = {
    dates: ["2025-12-30", "2025-12-25", "2025-12-20", "2025-12-10", "2025-12-01"],
    dvms: ['Dr. AAA', 'Dr. BBB', 'Dr. CCC', 'Dr. Eye', 'Dr. Surg'],
    depts: ['101 อายุรกรรม', '201 ฉุกเฉิน', '301 คลินิกพิเศษ', '102 ศัลยกรรม'],
    users: ['User Tech', 'User Nurse', 'User Admin', 'Dr. AAA'],
    lab_statuses: ['Waiting', 'Accepted', 'Approved', 'Completed', 'Reported', 'Cancel']
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

function generateActivityLog() {
    let data = [];
    const modules = ['Vital Signs', 'Eye Exam', 'LIS', 'Pathology'];
    
    modules.forEach(mod => {
        for (let i = 0; i < 30; i++) {
            let dateBase;
            if (i < 10) dateBase = MOCK_CONFIG.dates[0]; 
            else dateBase = MOCK_CONFIG.dates[(i % 4) + 1]; 

            const createTime = getRandomTime();
            const createDateTime = formatDateStr(dateBase, createTime);
            
            const rand = Math.random();
            let orderStatus = 'Done';
            if (rand > 0.7 && rand <= 0.9) orderStatus = 'Pending';
            if (rand > 0.9) orderStatus = 'Disable';

            const ts = Date.now() - (i * 100000) - (Math.random()*10000);
            const entryId = `E-${mod.substr(0,2).toUpperCase()}-${ts.toFixed(0)}`;
            const orderNo = `ORD-${mod.substr(0,2).toUpperCase()}-${ts.toFixed(0).substr(-6)}`;
            const accNo = (orderStatus === 'Done') ? `${mod.substr(0,2).toUpperCase()}-${ts.toFixed(0).substr(-6)}` : null;

            let targetTime = null;
            let effectiveTime = null;
            let updateTime = createDateTime;

            if (orderStatus === 'Pending') {
                targetTime = createDateTime; 
            }
            if (orderStatus === 'Done') {
                effectiveTime = createDateTime; 
                updateTime = createDateTime; 
            }

            let lisStatus = null;
            if (mod === 'LIS' || mod === 'Pathology') {
                if (orderStatus === 'Done') {
                    lisStatus = getRandom(MOCK_CONFIG.lab_statuses);
                } else if (orderStatus === 'Disable') {
                    lisStatus = 'Cancel';
                }
            }

            let params = {};
            let orderNote = (Math.random() < 0.2) ? "" : "Routine Check";
            
            if (mod === 'Vital Signs') {
                params = {
                    Temp: (99 + Math.random() * 4).toFixed(1),
                    HR: Math.floor(80 + Math.random() * 60),
                    RR: Math.floor(20 + Math.random() * 20),
                    BP: `${Math.floor(110 + Math.random() * 40)}/${Math.floor(60 + Math.random() * 30)}`,
                    Pulse: Math.floor(80 + Math.random() * 60),
                    Note: orderNote
                };
            } else if (mod === 'Eye Exam') {
                params = {
                    plr_od: getRandom(['+', '-', 'Sluggish']),
                    plr_os: getRandom(['+', '-', 'Sluggish']),
                    iop_od: Math.floor(10 + Math.random() * 15),
                    iop_os: Math.floor(10 + Math.random() * 15),
                    Note: orderNote
                };
            } else if (mod === 'LIS') {
                const testPool = ["CBC", "CHEM", "LYTES", "UA", "T4"];
                const tests = [getRandom(testPool)];
                if (Math.random() > 0.5) tests.push(getRandom(testPool));
                params = { tests: tests, note: orderNote };
            } else if (mod === 'Pathology') {
                const item = getRandom(pathologyServiceCatalog.SP.items);
                params = {
                    items: [{ name: item.name, site: "Skin Mass", history: "Chronic" }],
                    history_main: "Mass at leg",
                    items_count: 1
                };
            }

            const userRec = getRandom(MOCK_CONFIG.users);
            const userUpd = (Math.random() > 0.5) ? userRec : getRandom(MOCK_CONFIG.users);
            const dvm = getRandom(MOCK_CONFIG.dvms);
            const dept = getRandom(MOCK_CONFIG.depts);

            data.push({
                entry_id: entryId,
                order_no: orderNo,
                acc_no: accNo,
                activity_type: mod,
                order_status: orderStatus,
                lis_process_status: lisStatus,
                hn: "52039575", pet_name: "คุณส้มจี๊ด(จี๊ดจ๊าด)", owner_name: "คุณพ่อส้มจี๊ด",
                order_create_date: createDateTime,
                target_time: targetTime,
                effective_time: effectiveTime,
                order_update_date: updateTime,
                order_note: orderNote,
                parameters: params,
                recorded_by: userRec,
                dvm: dvm,
                department: dept,
                last_updated_by: userUpd,
                last_updated_on: updateTime,
                disable_remark: (orderStatus === 'Disable') ? "User Cancelled" : ""
            });
        }
    });

    return data.sort((a, b) => new Date(b.order_create_date) - new Date(a.order_create_date));
}

// 3. EXPORT DATA
let activityLogData = generateActivityLog();
console.log("Mock Data Generated: ", activityLogData.length, " items");