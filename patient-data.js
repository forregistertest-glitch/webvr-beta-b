// Filename: patient-data.js
// Description: ข้อมูลผู้ป่วย (Queue), OPD Tags (Category), และประวัติการรับบริการ (History)
// Context: New File (Create this file in your project folder)

(function() {
    // =================================================================
    // 1. MASTER DATA - OPD CATEGORY TAGS (Problem List - FULL SET)
    // =================================================================
    window.categoryData = {
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
        ],
        "skin": [
            { term: "Alopecia", tags: "Skin" },
            { term: "Pruritus", tags: "Skin" },
            { term: "Dermatitis", tags: "Skin, Inflammation" },
            { term: "Pyoderma", tags: "Skin, Infection" },
            { term: "Abscess", tags: "Skin, Infection" }
        ],
        "gi": [
            { term: "Diarrhea", tags: "GI" },
            { term: "Constipation", tags: "GI" },
            { term: "Melena", tags: "GI, Bleeding" },
            { term: "Hematochezia", tags: "GI, Bleeding" }
        ]
    };

    // =================================================================
    // 2. MOCK DATA - ASSESSMENT HISTORY (OPD History - 20 Items)
    // =================================================================
    window.assessmentHistoryData = [
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
    // 3. MOCK DATA - PATIENT QUEUE (For Main Dashboard)
    // (Source: Simplified Logic to provide a Queue List)
    // =================================================================
    const mockPets = [
        { hn: "52039575", name: "คุณส้มจี๊ด(จี๊ดจ๊าด)", owner: "คุณพ่อส้มจี๊ด" },
        { hn: "52039888", name: "น้องมอมแมม", owner: "คุณสมชาย" },
        { hn: "52040123", name: "พี่ทองแดง", owner: "คุณวิชัย" },
        { hn: "52041555", name: "Lucky", owner: "Mrs. Smith" },
        { hn: "52042999", name: "ถุงเงิน", owner: "คุณยายศรี" }
    ];

    function generateQueue() {
        // Creates a simple list of patients currently in the hospital
        return mockPets.map((pet, index) => ({
            hn: pet.hn,
            pet_name: pet.name,
            owner_name: pet.owner,
            status: index === 0 ? 'In Progress' : 'Waiting',
            queue_no: index + 1,
            checkin_time: "09:00"
        }));
    }

    window.patientQueueData = generateQueue();
    console.log("Patient Queue Data Generated:", window.patientQueueData.length);

})();