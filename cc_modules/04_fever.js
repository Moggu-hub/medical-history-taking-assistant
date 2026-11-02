// =========================================================================
// MODULAR CHIEF COMPLAINT MODULE: 04_fever.js
// อาการนำ: ไข้ / หนาวสั่น (Fever / Chills)
// ไฟล์นี้แยกอิสระสำหรับอาการนำ fever เพื่อให้ทีมแพทย์และ IT โรงพยาบาลนำไปพัฒนาต่อได้โดยไม่กระทบระบบหลัก
// =========================================================================

    function updateFeverOutputs(patient) {
      const unitMap = { minutes: 'นาที', hours: 'ชั่วโมง', days: 'วัน', weeks: 'สัปดาห์', months: 'เดือน', years: 'ปี' };
      const patternMap = {
        chills_and_rigor: 'ไข้สูง หนาวสั่นสะท้าน (Chills & rigor)',
        continuous_high: 'ไข้สูงลอยตลอดเวลา (Continuous high grade)',
        intermittent: 'ไข้เป็นๆ หายๆ (Intermittent fever)',
        low_grade: 'ไข้ต่ำๆ ตัวรุมๆ (Low grade fever)',
        unspecified: 'ไม่ได้ระบุลักษณะไข้'
      };
      const responseMap = {
        temporary_relief: 'ทานยาลดไข้แล้วไข้ลดลงชั่วคราว',
        refractory: 'ทานยาลดไข้แล้วไข้ไม่ลด',
        not_taken: 'ยังไม่ได้ทานยาลดไข้',
        unspecified: 'ไม่ได้ระบุผลหลังทานยา'
      };

      const durationText = patient.durationVal ? `${patient.durationVal} ${unitMap[patient.durationUnit] || 'วัน'}` : 'ไม่ระบุ';

      // Positives / Negatives
      const positives = [];
      const negatives = [];

      // Respiratory
      if (patient.cough) {
        const labels = { dry: 'ไอแห้ง', throat_phlegm: 'เสมหะในคอ', clear: 'เสมหะขาวใส', purulent: 'เสมหะเขียวเหลือง', blood: 'เสมหะปนเลือด' };
        positives.push(`มีอาการไอ (${patient.coughDetails?.map(d => labels[d] || d).join(', ') || 'ไม่ระบุลักษณะ'})`);
      } else negatives.push('ปฏิเสธอาการไอ');

      if (patient.soreThroat) {
        const labels = { left: 'ข้างซ้าย', right: 'ข้างขวา', diffuse: 'ทั่วๆ ลำคอ' };
        positives.push(`เจ็บคอ (${patient.soreThroatLocs?.map(l => labels[l] || l).join(', ') || 'ไม่ระบุตำแหน่ง'})`);
      } else negatives.push('ไม่เจ็บคอ');

      if (patient.rhinorrhea) positives.push('มีน้ำมูก/คัดจมูก');
      else negatives.push('ไม่มีน้ำมูก');

      if (patient.dyspnea) {
        const labels = { continuous: 'เหนื่อยตลอดเวลา', on_exertion: 'เหนื่อยเมื่อออกแรง', orthopnea: 'เหนื่อยมากขึ้นเมื่อนอนราบ', with_cough: 'เหนื่อยเวลาไอ' };
        positives.push(`หายใจเหนื่อยหอบ (${patient.dyspneaPatterns?.map(p => labels[p] || p).join(', ') || 'ไม่ระบุลักษณะ'})`);
      } else negatives.push('ปฏิเสธประวัติหอบเหนื่อย');

      // GI
      if (patient.abdpain) {
        const locMap = { diffuse: 'ทั่วท้อง', epigastrium: 'ใต้ลิ้นปี่', ruq: 'ขวาบน', luq: 'ซ้ายบน', periumbilical: 'รอบสะดือ', rlq: 'ขวาล่าง', llq: 'ซ้ายล่าง', suprapubic: 'ท้องน้อย' };
        const charMap = { burning: 'แสบร้อน', sharp_tearing: 'เสียบแทง/ฉีกขาด', crampy: 'บิดเกร็ง', dull: 'ตื้อ' };
        const radMap = { back_left: 'ร้าวหลังซ้าย', back_right: 'ร้าวหลังขวา', back_mid: 'ร้าวทะลุหลังกลาง', chest: 'ร้าวขึ้นอก', groin_thigh_genitalia: 'ร้าวลงขาหนีบ/อวัยวะเพศ' };
        
        const lStr = patient.abdpainLocs?.map(l => locMap[l] || l).join(', ') || 'ไม่ระบุ';
        const cStr = patient.abdpainChars?.map(c => charMap[c] || c).join(', ') || 'ไม่ระบุ';
        const rStr = patient.abdpainRads?.length > 0 ? `, ร้าวไป: ${patient.abdpainRads.map(r => radMap[r] || r).join(', ')}` : '';
        positives.push(`มีอาการปวดท้องร่วมด้วย: บริเวณ ${lStr} (${cStr}${rStr})`);
      } else negatives.push('ปฏิเสธอาการปวดท้อง');

      if (patient.diarrhea) {
        const stoolMap = { watery: 'เหลวเป็นน้ำ', loose_mushy: 'เละๆ', melena_tarry: 'ดำหนืดเหมือนยางมะตอย (Melena)', bloody_mucus: 'มีมูกเลือดปน' };
        positives.push(`ถ่ายเหลว ${patient.diarrheaFreq || 1} ครั้ง/วัน (${patient.diarrheaStools?.map(s => stoolMap[s] || s).join(', ') || 'ไม่ระบุ'})`);
      } else negatives.push('ปฏิเสธอาการถ่ายเหลว');

      if (patient.vomit) {
        if (patient.isNauseaOnly) positives.push('คลื่นไส้ ยังไม่อาเจียน');
        else {
          const vMap = { food_gastric: 'เศษอาหาร/น้ำย่อยเหลือง', bilious_green: 'สีเขียวน้ำดี', coffee_ground: 'ดำสีโค้ก (Coffee-ground)', bloody: 'เป็นเลือด/ปนเลือด' };
          positives.push(`อาเจียน ${patient.vomitFreq || 1} ครั้ง/วัน (${patient.vomitContents?.map(c => vMap[c] || c).join(', ') || 'ไม่ระบุ'})`);
        }
      } else negatives.push('ไม่มีคลื่นไส้อาเจียน');

      // GU
      if (patient.dysuria) positives.push('ปัสสาวะแสบขัด');
      else negatives.push('ปัสสาวะไม่แสบขัด');
      if (patient.turbidUrine) positives.push('ปัสสาวะขุ่น');
      if (patient.flankPain) positives.push('ปวดบั้นเอว/หลัง');
      else negatives.push('ไม่ปวดบั้นเอว');

      // Neuro
      if (patient.headache) positives.push('ปวดศีรษะรุนแรง');
      if (patient.stiffNeck) positives.push('คอแข็งเกร็ง');
      else negatives.push('ไม่มีคอแข็ง');
      if (patient.alteredMental) positives.push('ซึมลง/สับสน');
      else negatives.push('รู้สึกตัวดี ถามตอบรู้เรื่อง');

      // Skin & Joint
      if (patient.rash) positives.push(`มีผื่นผิวหนัง${patient.rashLoc ? ` (${patient.rashLoc})` : ''}`);
      if (patient.wound) positives.push(`มีแผล${patient.woundLoc ? ` (${patient.woundLoc})` : ''}`);
      if (patient.abscess) positives.push(`มีฝี/หนอง${patient.abscessLoc ? ` (${patient.abscessLoc})` : ''}`);
      if (patient.arthralgia) positives.push(`ปวดตามข้อ${patient.arthralgiaLoc ? ` (${patient.arthralgiaLoc})` : ''}`);
      else negatives.push('ไม่มีอาการปวดตามข้อ');

      // Tropical
      if (patient.myalgia) positives.push('ปวดเมื่อยตัว/เบ้าตา');
      if (patient.petechiae) positives.push('มีจุดจ้ำเลือดตามตัว');
      else negatives.push('ไม่มีจุดจ้ำเลือด');

      if (patient.otherSymptomsFree) {
        positives.push(`อาการเพิ่มเติมที่ผู้ป่วยระบุ: "${patient.otherSymptomsFree}"`);
      }

      patient.pertinentPositives = positives.length > 0 ? positives : ['ไม่มีอาการร่วมผิดปกติ'];
      patient.pertinentNegatives = negatives;

      const hospLabel = {
        complete: 'มีประวัติกับ รพ.ราชบุรี ครบถ้วน (ดึงข้อมูลเดิมจากระบบ)',
        additional: 'มีประวัติกับ รพ.ราชบุรี และขอให้ข้อมูลเพิ่มเติม',
        self: 'ขอให้ข้อมูลด้วยตนเองทั้งหมด',
        unspecified: 'ไม่ได้ระบุ'
      }[patient.hospRecordStatus] || 'ไม่ได้ระบุ';

      const docNotes = patient.doctor_notes || {};

      // A) Rapid Bullet Format
      const defaultRapid = 
`[Chief Complaint (CC)]
มีไข้ / หนาวสั่นมา ${durationText}

[History of Present Illness (HPI)]
• ลักษณะไข้: ${patternMap[patient.feverPattern] || 'ไม่ได้ระบุ'}
• การตอบสนองต่อยาลดไข้: ${responseMap[patient.antipyreticResponse] || 'ไม่ได้ระบุ'}

• Pertinent Positives:
${positives.length > 0 ? positives.map(p => `  - ${p}`).join('\n') : '  - ไม่มีอาการร่วมที่เด่นชัด'}

• Pertinent Negatives:
${negatives.map(n => `  - ${n}`).join('\n')}

[Past Medical History & Medications]
• สถานะประวัติ รพ.ราชบุรี: ${hospLabel}
• โรคประจำตัว (U/D): ${patient.underlying?.length > 0 ? patient.underlying.join(', ') : 'ปฏิเสธ'}
• ยาประจำตัว (Current Meds): ${patient.currentMeds || 'ไม่มี'}
• ประวัติแพ้ยา/แพ้อาหาร (Allergies): ${patient.drugAllergy || 'ปฏิเสธ'}

[Emergency Risk Assessment (Red Flags)]
${patient.redFlags?.length > 0
  ? `🚩 RED FLAGS DETECTED:\n${patient.redFlags.map(rf => `  * ${rf.textTh}`).join('\n')}`
  : '✓ ไม่พบสัญญาณวิกฤต (No Immediate Red Flag)'}

[Doctor's Clinical Addendum & Exam]
• ประวัติเพิ่มเติม/แก้ไขโดยแพทย์: ${docNotes.additional_hpi || '-'}
• สัญญาณชีพและการตรวจร่างกาย: ${docNotes.physical_exam || '-'}
• การวินิจฉัยเบื้องต้น (Impression): ${docNotes.preliminary_dx || '-'}
• แผนการรักษา (Plan/Orders): ${docNotes.plan || '-'}`;

      // B) Narrative Paragraph Format
      const defaultNarrative = 
`ผู้ป่วย [${patient.name}] อายุ ${patient.age || '-'} ปี มารับการตรวจที่ห้องฉุกเฉิน รพ.ราชบุรี ด้วยอาการไข้/หนาวสั่น ${durationText} ลักษณะ${patternMap[patient.feverPattern] || 'ไม่ได้ระบุ'} ${responseMap[patient.antipyreticResponse] || ''}

อาการร่วมที่พบ: ผู้ป่วยให้ประวัติ ${positives.join(', ') || 'ไม่มีอาการร่วมอื่น'}
อาการปฏิเสธสำคัญ (Pertinent negatives): ${negatives.join(', ')}

ประวัติการรักษาเดิม: [${hospLabel}]
โรคประจำตัว: ${patient.underlying?.length > 0 ? patient.underlying.join(', ') : 'ปฏิเสธโรคประจำตัว'}, ยาประจำตัว: ${patient.currentMeds || 'ไม่มี'}, ประวัติแพ้ยา/แพ้อาหาร: ${patient.drugAllergy || 'ปฏิเสธประวัติแพ้ยา/แพ้อาหาร'}
${patient.redFlags?.length > 0 ? `\n[🚩 แจ้งเตือนสัญญาณวิกฤต]: ตรวจพบอาการ ${patient.redFlags.map(rf => rf.textTh).join(', ')}` : ''}

[บันทึกการตรวจและการประเมินโดยแพทย์]:
${docNotes.additional_hpi ? `• ประวัติเพิ่มเติม: ${docNotes.additional_hpi}\n` : ''}${docNotes.physical_exam ? `• การตรวจร่างกาย: ${docNotes.physical_exam}\n` : ''}${docNotes.preliminary_dx ? `• การวินิจฉัย: ${docNotes.preliminary_dx}\n` : ''}${docNotes.plan ? `• แผนการรักษา: ${docNotes.plan}` : ''}`;

      document.getElementById('rapidTextView').value = patient.custom_rapid_note || defaultRapid;
      document.getElementById('narrativeTextView').value = patient.custom_narrative_note || defaultNarrative;

      // JSON Payload
      const jsonPayload = {
        "$schema": "https://json-schema.org/draft/2020-12/schema",
        "encounter": {
          "hospital_site": "Ratchaburi Hospital",
          "queue_id": patient.queue_number,
          "hn": patient.hn,
          "patient_name": patient.name,
          "age": patient.age,
          "gender": patient.gender,
          "timestamp": patient.timestamp,
          "status": patient.status,
          "triage_urgency_flag": patient.redFlags?.length > 0,
          "red_flags_count": patient.redFlags?.length || 0,
          "hospital_record_status": patient.hospRecordStatus
        },
        "chief_complaint": "fever_and_chills",
        "fever_history": {
          "duration_value": patient.durationVal || null,
          "duration_unit": patient.durationUnit || null,
          "pattern": patient.feverPattern,
          "antipyretic_response": patient.antipyreticResponse
        },
        "organ_systems_review": {
          "respiratory": {
            "cough": patient.cough,
            "cough_details": patient.coughDetails,
            "sore_throat": patient.soreThroat,
            "sore_throat_locations": patient.soreThroatLocs,
            "rhinorrhea": patient.rhinorrhea,
            "dyspnea": patient.dyspnea,
            "dyspnea_patterns": patient.dyspneaPatterns
          },
          "gastrointestinal": {
            "abdominal_pain": patient.abdpain,
            "pain_locations": patient.abdpainLocs,
            "pain_characteristics": patient.abdpainChars,
            "pain_radiation": patient.abdpainRads,
            "diarrhea": patient.diarrhea,
            "diarrhea_frequency_per_day": patient.diarrheaFreq,
            "stool_characteristics": patient.diarrheaStools,
            "nausea_vomiting": patient.vomit,
            "is_nausea_only": patient.isNauseaOnly,
            "vomit_frequency_per_day": patient.vomitFreq,
            "vomit_contents": patient.vomitContents
          },
          "genitourinary": {
            "dysuria": patient.dysuria,
            "turbid_urine": patient.turbidUrine,
            "flank_pain": patient.flankPain
          },
          "neurology": {
            "severe_headache": patient.headache,
            "stiff_neck": patient.stiffNeck,
            "altered_mental_status": patient.alteredMental,
            "seizure": patient.seizure
          },
          "skin_and_musculoskeletal": {
            "rash": { "present": patient.rash, "location": patient.rashLoc },
            "wound": { "present": patient.wound, "location": patient.woundLoc },
            "abscess": { "present": patient.abscess, "location": patient.abscessLoc },
            "arthralgia": { "present": patient.arthralgia, "location": patient.arthralgiaLoc }
          },
          "tropical_infections": {
            "severe_myalgia": patient.myalgia,
            "petechiae_purpura": patient.petechiae,
            "flood_water_exposure": patient.floodWater,
            "forest_travel": patient.forestTravel
          },
          "other_symptoms_free_text": patient.otherSymptomsFree
        },
        "red_flags_detected": patient.redFlags?.map(rf => ({ code: rf.key, label: rf.textTh, clinical_risk: rf.risk })) || [],
        "pertinent_positives": positives,
        "pertinent_negatives": negatives,
        "patient_background": {
          "hospital_record_status": patient.hospRecordStatus,
          "underlying_diseases": patient.underlying,
          "drug_and_food_allergies": patient.drugAllergy,
          "current_medications": patient.currentMeds
        },
        "doctor_clinical_addendum": {
          "additional_or_corrected_history": docNotes.additional_hpi || "",
          "vitals_and_physical_exam": docNotes.physical_exam || "",
          "provisional_diagnosis": docNotes.preliminary_dx || "",
          "treatment_plan": docNotes.plan || ""
        }
      };

      document.getElementById('jsonViewer').textContent = JSON.stringify(jsonPayload, null, 2);
    }

registerCcModule({
  id: 'fever',
  recordCc: 'fever_and_chills',
  titleTh: 'ไข้ / หนาวสั่น',
  titleEn: 'Fever / Chills',
  sectionDomId: 'feverQuestionnaireSection',
  doctorCcBadgeHtml: "<i data-lucide=\"flame\" class=\"w-3 h-3 mr-1\"></i> CC: ไข้ / หนาวสั่น",
  formHtml: "        <div id=\"feverQuestionnaireSection\" class=\"space-y-6\">\n\n        <!-- CARD 1: OPQRST of Fever (ระยะเวลาและลักษณะของไข้) -->\n        <!-- ข้อ 1: ลบ default ล่วงหน้าทั้งหมด ให้มี placeholder ตัวซีดแทน -->\n        <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n          <div class=\"flex items-center space-x-3 mb-4 pb-3 border-b border-slate-100\">\n            <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n              <i data-lucide=\"clock\" class=\"w-5 h-5\"></i>\n            </div>\n            <div>\n              <h2 class=\"text-base font-bold text-slate-900\">1. ระยะเวลาและลักษณะของไข้ (Fever Profile)</h2>\n              <p class=\"text-xs text-slate-500\">ข้อมูลเริ่มต้นเกี่ยวกับอาการไข้ของท่าน</p>\n            </div>\n          </div>\n\n          <div class=\"space-y-5\">\n            <!-- ระยะเวลาที่เป็น: ไม่ใส่ค่า default 3 ให้เป็นช่องว่าง placeholder แทน -->\n            <div>\n              <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                มีไข้มานานเท่าไรแล้ว? <span class=\"text-rose-500\">*</span>\n              </label>\n              <div class=\"grid grid-cols-2 sm:grid-cols-3 gap-3\">\n                <div class=\"col-span-1 sm:col-span-2\">\n                  <input type=\"number\" id=\"feverDurationVal\" min=\"1\" max=\"1000\"\n                    class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm placeholder:text-slate-400 placeholder:font-normal\"\n                    placeholder=\"เช่น 3\">\n                </div>\n                <div class=\"col-span-1\">\n                  <select id=\"feverDurationUnit\"\n                    class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white text-sm\">\n                    <option value=\"minutes\">นาที</option>\n                    <option value=\"hours\">ชั่วโมง</option>\n                    <option value=\"days\" selected>วัน</option>\n                    <option value=\"weeks\">สัปดาห์</option>\n                    <option value=\"months\">เดือน</option>\n                    <option value=\"years\">ปี</option>\n                  </select>\n                </div>\n              </div>\n            </div>\n\n            <!-- ลักษณะของไข้: ไม่ถูกเลือกไว้ก่อนล่วงหน้า -->\n            <div>\n              <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                ลักษณะอาการไข้ที่เป็นส่วนใหญ่\n              </label>\n              <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2.5\">\n                <label class=\"selectable-card relative flex items-center p-3 rounded-xl cursor-pointer\">\n                  <input type=\"radio\" name=\"feverPattern\" value=\"chills_and_rigor\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                  <span class=\"ml-3 text-xs sm:text-sm font-semibold\">ไข้สูง หนาวสั่นสะท้าน</span>\n                </label>\n                <label class=\"selectable-card relative flex items-center p-3 rounded-xl cursor-pointer\">\n                  <input type=\"radio\" name=\"feverPattern\" value=\"continuous_high\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                  <span class=\"ml-3 text-xs sm:text-sm font-semibold\">ไข้สูงลอยตลอดเวลา</span>\n                </label>\n                <label class=\"selectable-card relative flex items-center p-3 rounded-xl cursor-pointer\">\n                  <input type=\"radio\" name=\"feverPattern\" value=\"intermittent\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                  <span class=\"ml-3 text-xs sm:text-sm font-semibold\">ไข้เป็นๆ หายๆ</span>\n                </label>\n                <label class=\"selectable-card relative flex items-center p-3 rounded-xl cursor-pointer\">\n                  <input type=\"radio\" name=\"feverPattern\" value=\"low_grade\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                  <span class=\"ml-3 text-xs sm:text-sm font-semibold\">ไข้ต่ำๆ ตัวรุมๆ</span>\n                </label>\n              </div>\n            </div>\n\n            <!-- การทานยาลดไข้: ไม่ถูกเลือกไว้ก่อนล่วงหน้า -->\n            <div>\n              <label class=\"block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2\">\n                หลังรับประทานยาลดไข้ (เช่น พาราเซตามอล) แล้วมีอาการอย่างไร?\n              </label>\n              <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2.5\">\n                <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                  <input type=\"radio\" name=\"antipyreticResponse\" value=\"temporary_relief\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                  <span class=\"ml-2.5 text-xs font-semibold\">ไข้ลดลงชั่วคราว</span>\n                </label>\n                <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                  <input type=\"radio\" name=\"antipyreticResponse\" value=\"refractory\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                  <span class=\"ml-2.5 text-xs font-semibold\">ไข้ไม่ลดลงเลย</span>\n                </label>\n                <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                  <input type=\"radio\" name=\"antipyreticResponse\" value=\"not_taken\" class=\"text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                  <span class=\"ml-2.5 text-xs font-semibold\">ยังไม่ได้ทานยา</span>\n                </label>\n              </div>\n            </div>\n          </div>\n        </div>\n\n        <!-- CARD 2: Foci of Infection & Dynamic Branching (คัดกรองอาการร่วมตามระบบ) -->\n        <div class=\"bg-white rounded-2xl p-6 shadow-sm border border-slate-200\">\n          <div class=\"flex items-center space-x-3 mb-2 pb-3 border-b border-slate-100\">\n            <div class=\"bg-medical-100 text-medical-700 p-2 rounded-xl\">\n              <i data-lucide=\"check-square\" class=\"w-5 h-5\"></i>\n            </div>\n            <div>\n              <h2 class=\"text-base font-bold text-slate-900\">2. อาการร่วมที่ท่านมี (เลือกอาการที่ตรงกับท่าน)</h2>\n              <p class=\"text-xs text-slate-500\">ระบบจะช่วยค้นหาตำแหน่งที่มีการติดเชื้อเพื่อความแม่นยำในการรักษา</p>\n            </div>\n          </div>\n\n          <!-- SYSTEM 1: ระบบทางเดินหายใจ & ลำคอ -->\n          <div class=\"py-4 border-b border-slate-100\">\n            <div class=\"flex items-center justify-between mb-2\">\n              <span class=\"text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center\">\n                <i data-lucide=\"wind\" class=\"w-4 h-4 mr-1.5 text-sky-500\"></i> ระบบทางเดินหายใจ & ลำคอ\n              </span>\n            </div>\n\n            <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3\">\n              <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                <input type=\"checkbox\" id=\"sx_cough\" onchange=\"toggleBranch('coughBranch', this.checked)\" class=\"rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <span class=\"ml-2 text-xs sm:text-sm font-semibold\">มีอาการไอ</span>\n              </label>\n              <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                <input type=\"checkbox\" id=\"sx_sorethroat\" onchange=\"toggleBranch('sorethroatBranch', this.checked)\" class=\"rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <span class=\"ml-2 text-xs sm:text-sm font-semibold\">เจ็บคอ</span>\n              </label>\n              <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                <input type=\"checkbox\" id=\"sx_rhinorrhea\" class=\"rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <span class=\"ml-2 text-xs sm:text-sm font-semibold\">มีน้ำมูก / คัดจมูก</span>\n              </label>\n              <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                <input type=\"checkbox\" id=\"sx_dyspnea\" onchange=\"toggleBranch('dyspneaBranch', this.checked)\" class=\"rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <span class=\"ml-2 text-xs sm:text-sm font-semibold\">หายใจเหนื่อยหอบ</span>\n              </label>\n            </div>\n\n            <!-- Dynamic Branch: อาการไอ -->\n            <div id=\"coughBranch\" class=\"hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2 branch-card\">\n              <span class=\"text-xs font-bold text-slate-800 block mb-2 flex items-center\">\n                <i data-lucide=\"corner-down-right\" class=\"w-3.5 h-3.5 mr-1 text-medical-600\"></i> เจาะลึกอาการไอ (เลือกได้หลายข้อ)\n              </span>\n              <div class=\"grid grid-cols-2 sm:grid-cols-3 gap-2\">\n                <label class=\"selectable-card p-2.5 rounded-lg flex items-center text-xs cursor-pointer\">\n                  <input type=\"checkbox\" name=\"coughDetail\" value=\"dry\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                  <span class=\"ml-2\">ไอแห้งๆ ไม่มีเสมหะ</span>\n                </label>\n                <label class=\"selectable-card p-2.5 rounded-lg flex items-center text-xs cursor-pointer\">\n                  <input type=\"checkbox\" name=\"coughDetail\" value=\"throat_phlegm\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                  <span class=\"ml-2 font-semibold\">เสมหะในคอ</span>\n                </label>\n                <label class=\"selectable-card p-2.5 rounded-lg flex items-center text-xs cursor-pointer\">\n                  <input type=\"checkbox\" name=\"coughDetail\" value=\"clear\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                  <span class=\"ml-2\">เสมหะสีขาวใส</span>\n                </label>\n                <label class=\"selectable-card p-2.5 rounded-lg flex items-center text-xs cursor-pointer\">\n                  <input type=\"checkbox\" name=\"coughDetail\" value=\"purulent\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                  <span class=\"ml-2 font-semibold\">เสมหะสีเขียวหรือเหลือง</span>\n                </label>\n                <label class=\"selectable-card p-2.5 rounded-lg flex items-center text-xs cursor-pointer\">\n                  <input type=\"checkbox\" name=\"coughDetail\" value=\"blood\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                  <span class=\"ml-2 font-semibold\">เสมหะปนเลือด</span>\n                </label>\n                <label class=\"selectable-card p-2.5 rounded-lg flex items-center text-xs cursor-pointer\">\n                  <input type=\"checkbox\" id=\"cough_other_chk\" onchange=\"toggleOtherInput('cough_other_wrap', this.checked)\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                  <span class=\"ml-2\">อื่นๆ (ระบุ)</span>\n                </label>\n              </div>\n              <div id=\"cough_other_wrap\" class=\"hidden mt-2\">\n                <input type=\"text\" id=\"cough_other_text\" placeholder=\"ระบุรายละเอียดอาการไอเพิ่มเติม...\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400\">\n              </div>\n            </div>\n\n            <!-- Dynamic Branch: เจ็บคอ -->\n            <div id=\"sorethroatBranch\" class=\"hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2 branch-card\">\n              <span class=\"text-xs font-bold text-slate-800 block mb-2 flex items-center\">\n                <i data-lucide=\"corner-down-right\" class=\"w-3.5 h-3.5 mr-1 text-medical-600\"></i> เจาะลึกตำแหน่งเจ็บคอ (เลือกได้หลายข้อ)\n              </span>\n              <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-2\">\n                <label class=\"selectable-card p-2.5 rounded-lg flex items-center text-xs cursor-pointer\">\n                  <input type=\"checkbox\" name=\"sorethroatLoc\" value=\"left\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                  <span class=\"ml-2\">ด้านซ้าย</span>\n                </label>\n                <label class=\"selectable-card p-2.5 rounded-lg flex items-center text-xs cursor-pointer\">\n                  <input type=\"checkbox\" name=\"sorethroatLoc\" value=\"right\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                  <span class=\"ml-2\">ด้านขวา</span>\n                </label>\n                <label class=\"selectable-card p-2.5 rounded-lg flex items-center text-xs cursor-pointer\">\n                  <input type=\"checkbox\" name=\"sorethroatLoc\" value=\"diffuse\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                  <span class=\"ml-2\">ทั่วๆ ลำคอ</span>\n                </label>\n                <label class=\"selectable-card p-2.5 rounded-lg flex items-center text-xs cursor-pointer\">\n                  <input type=\"checkbox\" id=\"st_other_chk\" onchange=\"toggleOtherInput('st_other_wrap', this.checked)\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                  <span class=\"ml-2\">อื่นๆ (ระบุ)</span>\n                </label>\n              </div>\n              <div id=\"st_other_wrap\" class=\"hidden mt-2\">\n                <input type=\"text\" id=\"st_other_text\" placeholder=\"ระบุตำแหน่งหรือลักษณะเจ็บคอเพิ่มเติม...\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400\">\n              </div>\n            </div>\n\n            <!-- Dynamic Branch: หายใจเหนื่อย -->\n            <div id=\"dyspneaBranch\" class=\"hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2 branch-card\">\n              <span class=\"text-xs font-bold text-slate-800 block mb-2 flex items-center\">\n                <i data-lucide=\"corner-down-right\" class=\"w-3.5 h-3.5 mr-1 text-medical-600\"></i> เจาะลึกลักษณะอาการหายใจเหนื่อย (เลือกได้หลายข้อ)\n              </span>\n              <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2\">\n                <label class=\"selectable-card p-2.5 rounded-lg flex items-center text-xs cursor-pointer\">\n                  <input type=\"checkbox\" name=\"dyspneaPattern\" value=\"continuous\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                  <span class=\"ml-2 font-semibold\">เหนื่อยตลอดเวลา แม้อยู่เฉยๆ</span>\n                </label>\n                <label class=\"selectable-card p-2.5 rounded-lg flex items-center text-xs cursor-pointer\">\n                  <input type=\"checkbox\" name=\"dyspneaPattern\" value=\"on_exertion\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                  <span class=\"ml-2\">เหนื่อยเมื่อออกแรง หรือเดิน</span>\n                </label>\n                <label class=\"selectable-card p-2.5 rounded-lg flex items-center text-xs cursor-pointer\">\n                  <input type=\"checkbox\" name=\"dyspneaPattern\" value=\"orthopnea\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                  <span class=\"ml-2 font-semibold\">เหนื่อยมากขึ้นเมื่อนอนราบ (ต้องหนุนหมอนสูง)</span>\n                </label>\n                <label class=\"selectable-card p-2.5 rounded-lg flex items-center text-xs cursor-pointer\">\n                  <input type=\"checkbox\" name=\"dyspneaPattern\" value=\"with_cough\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                  <span class=\"ml-2\">เหนื่อยเวลาไอ หรือพูดต่อเนื่อง</span>\n                </label>\n                <label class=\"selectable-card p-2.5 rounded-lg flex items-center text-xs cursor-pointer sm:col-span-2\">\n                  <input type=\"checkbox\" id=\"dyspnea_other_chk\" onchange=\"toggleOtherInput('dyspnea_other_wrap', this.checked)\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                  <span class=\"ml-2\">อื่นๆ (ระบุ)</span>\n                </label>\n              </div>\n              <div id=\"dyspnea_other_wrap\" class=\"hidden mt-2\">\n                <input type=\"text\" id=\"dyspnea_other_text\" placeholder=\"ระบุลักษณะอาการเหนื่อยเพิ่มเติม...\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400\">\n              </div>\n            </div>\n\n          </div>\n\n          <!-- SYSTEM 2: ระบบทางเดินอาหาร & ช่องท้อง -->\n          <div class=\"py-4 border-b border-slate-100\">\n            <div class=\"flex items-center justify-between mb-2\">\n              <span class=\"text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center\">\n                <i data-lucide=\"utensils\" class=\"w-4 h-4 mr-1.5 text-amber-500\"></i> ระบบทางเดินอาหาร & ช่องท้อง\n              </span>\n            </div>\n\n            <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3\">\n              <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                <input type=\"checkbox\" id=\"sx_abdpain\" onchange=\"toggleBranch('abdpainBranch', this.checked)\" class=\"rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <span class=\"ml-2 text-xs sm:text-sm font-semibold\">ปวดท้อง</span>\n              </label>\n              <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                <input type=\"checkbox\" id=\"sx_diarrhea\" onchange=\"toggleBranch('diarrheaBranch', this.checked)\" class=\"rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <span class=\"ml-2 text-xs sm:text-sm font-semibold\">ถ่ายเหลว / ท้องเสีย</span>\n              </label>\n              <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                <input type=\"checkbox\" id=\"sx_vomit\" onchange=\"toggleBranch('vomitBranch', this.checked)\" class=\"rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <span class=\"ml-2 text-xs sm:text-sm font-semibold\">คลื่นไส้ / อาเจียน</span>\n              </label>\n            </div>\n\n            <!-- Dynamic Branch: ปวดท้อง -->\n            <div id=\"abdpainBranch\" class=\"hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2 space-y-4 branch-card\">\n              \n              <!-- ตำแหน่งที่ปวดท้อง -->\n              <div>\n                <span class=\"text-xs font-bold text-slate-800 block mb-1.5 flex items-center\">\n                  <i data-lucide=\"corner-down-right\" class=\"w-3.5 h-3.5 mr-1 text-medical-600\"></i> ตำแหน่งที่ปวดท้อง (เลือกได้หลายจุด)\n                </span>\n                <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs\">\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpainLoc\" value=\"diffuse\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">ทั่วทั้งท้อง</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpainLoc\" value=\"epigastrium\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">ใต้ลิ้นปี่</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpainLoc\" value=\"ruq\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">ชายโครงขวา (RUQ)</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpainLoc\" value=\"luq\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">ชายโครงซ้าย (LUQ)</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpainLoc\" value=\"periumbilical\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">รอบสะดือ</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpainLoc\" value=\"rlq\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">ท้องน้อยขวา (RLQ)</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpainLoc\" value=\"llq\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">ท้องน้อยซ้าย (LLQ)</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpainLoc\" value=\"suprapubic\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">ท้องน้อยตรงกลาง/หัวหน่าว</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer col-span-2 sm:col-span-4\">\n                    <input type=\"checkbox\" id=\"fever_abdpain_loc_other_chk\" onchange=\"toggleOtherInput('fever_abdpain_loc_other_wrap', this.checked)\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">ตำแหน่งอื่นๆ (ระบุ)</span>\n                  </label>\n                </div>\n                <div id=\"fever_abdpain_loc_other_wrap\" class=\"hidden mt-2\">\n                  <input type=\"text\" id=\"fever_abdpain_loc_other_text\" placeholder=\"ระบุตำแหน่งปวดท้องเพิ่มเติม...\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400\">\n                </div>\n              </div>\n\n              <!-- ลักษณะการปวดท้อง -->\n              <div>\n                <span class=\"text-xs font-bold text-slate-800 block mb-1.5\">\n                  ลักษณะการปวดท้อง (เลือกได้หลายข้อ)\n                </span>\n                <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs\">\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpainChar\" value=\"burning\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">แสบร้อน</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpainChar\" value=\"sharp_tearing\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">เสียบแทง หรือ ฉีกขาด</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpainChar\" value=\"crampy\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">บิดเกร็ง</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpainChar\" value=\"dull\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">ตื้อ</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer col-span-2 sm:col-span-4\">\n                    <input type=\"checkbox\" id=\"fever_abdpain_char_other_chk\" onchange=\"toggleOtherInput('fever_abdpain_char_other_wrap', this.checked)\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">ลักษณะอื่นๆ (ระบุ)</span>\n                  </label>\n                </div>\n                <div id=\"fever_abdpain_char_other_wrap\" class=\"hidden mt-2\">\n                  <input type=\"text\" id=\"fever_abdpain_char_other_text\" placeholder=\"ระบุลักษณะการปวดเพิ่มเติม...\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400\">\n                </div>\n              </div>\n\n              <!-- ร้าวหลัง แยกเป็น ร้าวหลังซ้าย / ร้าวหลังขวา / ร้าวทะลุหลังกลาง และ ร้าวลงต้นขา/ขาหนีบ/อวัยวะเพศ -->\n              <div>\n                <span class=\"text-xs font-bold text-slate-800 block mb-1.5\">\n                  มีอาการปวดร้าวไปตำแหน่งอื่นหรือไม่? (เลือกได้หลายข้อ)\n                </span>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpainRad\" value=\"back_left\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">ร้าวหลังซ้าย</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpainRad\" value=\"back_right\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">ร้าวหลังขวา</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpainRad\" value=\"back_mid\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">ร้าวทะลุหลัง (ตรงกลาง)</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"abdpainRad\" value=\"chest\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">ร้าวขึ้นหน้าอก</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer sm:col-span-2\">\n                    <input type=\"checkbox\" name=\"abdpainRad\" value=\"groin_thigh_genitalia\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">ร้าวลงต้นขา / ขาหนีบ / อวัยวะเพศ</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer sm:col-span-2\">\n                    <input type=\"checkbox\" id=\"fever_abdpain_rad_other_chk\" onchange=\"toggleOtherInput('fever_abdpain_rad_other_wrap', this.checked)\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">ร้าวไปตำแหน่งอื่น (ระบุ)</span>\n                  </label>\n                </div>\n                <div id=\"fever_abdpain_rad_other_wrap\" class=\"hidden mt-2\">\n                  <input type=\"text\" id=\"fever_abdpain_rad_other_text\" placeholder=\"ระบุตำแหน่งที่ร้าวไปเพิ่มเติม...\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400\">\n                </div>\n              </div>\n\n            </div>\n\n            <!-- Dynamic Branch: ท้องเสีย -->\n            <div id=\"diarrheaBranch\" class=\"hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2 space-y-3 branch-card\">\n              <span class=\"text-xs font-bold text-slate-800 block mb-1 flex items-center\">\n                <i data-lucide=\"corner-down-right\" class=\"w-3.5 h-3.5 mr-1 text-medical-600\"></i> เจาะลึกอาการถ่ายเหลว\n              </span>\n              <div>\n                <label class=\"text-[11px] font-semibold text-slate-700 block mb-1\">ถ่ายเหลวประมาณกี่ครั้งต่อวัน?</label>\n                <div class=\"flex items-center space-x-2\">\n                  <input type=\"number\" id=\"diarrheaFreq\" min=\"1\" max=\"50\" placeholder=\"เช่น 3\" class=\"w-24 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-semibold placeholder:text-slate-400 placeholder:font-normal\">\n                  <span class=\"text-xs text-slate-500\">ครั้ง/วัน</span>\n                </div>\n              </div>\n              <div>\n                <label class=\"text-[11px] font-semibold text-slate-700 block mb-1.5\">ลักษณะอุจจาระ (เลือกได้หลายข้อ)</label>\n                <div class=\"grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs\">\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"diarrheaStool\" value=\"watery\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">เหลวเป็นน้ำ</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"diarrheaStool\" value=\"loose_mushy\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">เละๆ</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"diarrheaStool\" value=\"melena_tarry\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-semibold\">ดำหนืดเหมือนยางมะตอย</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"diarrheaStool\" value=\"bloody_mucus\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-semibold\">มีมูกเลือดปน</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer sm:col-span-2\">\n                    <input type=\"checkbox\" id=\"diarrhea_other_chk\" onchange=\"toggleOtherInput('diarrhea_other_wrap', this.checked)\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">อื่นๆ (ระบุ)</span>\n                  </label>\n                </div>\n                <div id=\"diarrhea_other_wrap\" class=\"hidden mt-2\">\n                  <input type=\"text\" id=\"diarrhea_other_text\" placeholder=\"ระบุลักษณะอุจจาระเพิ่มเติม...\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400\">\n                </div>\n              </div>\n            </div>\n\n            <!-- Dynamic Branch: คลื่นไส้ / อาเจียน -->\n            <div id=\"vomitBranch\" class=\"hidden bg-slate-50 border border-slate-200 rounded-xl p-4 mt-2 space-y-3 branch-card\">\n              <span class=\"text-xs font-bold text-slate-800 block mb-1 flex items-center\">\n                <i data-lucide=\"corner-down-right\" class=\"w-3.5 h-3.5 mr-1 text-medical-600\"></i> เจาะลึกอาการคลื่นไส้ / อาเจียน\n              </span>\n              <div>\n                <label class=\"text-[11px] font-semibold text-slate-700 block mb-1\">ความถี่ของอาการอาเจียน</label>\n                <div class=\"flex flex-wrap items-center gap-3\">\n                  <div class=\"flex items-center space-x-2\">\n                    <input type=\"number\" id=\"vomitFreq\" min=\"1\" max=\"50\" placeholder=\"เช่น 2\" class=\"w-24 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-semibold placeholder:text-slate-400 placeholder:font-normal\">\n                    <span class=\"text-xs text-slate-500\">ครั้ง/วัน</span>\n                  </div>\n                  <label class=\"selectable-card px-3 py-1.5 rounded-lg flex items-center text-xs cursor-pointer\">\n                    <input type=\"checkbox\" id=\"vomit_nausea_only\" onchange=\"handleNauseaOnlyToggle(this.checked)\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-semibold\">คลื่นไส้ ยังไม่อาเจียน</span>\n                  </label>\n                </div>\n              </div>\n\n              <div id=\"vomitCharSection\">\n                <label class=\"text-[11px] font-semibold text-slate-700 block mb-1.5\">ลักษณะสิ่งที่อาเจียนออกมา (เลือกได้หลายข้อ)</label>\n                <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs\">\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitContent\" value=\"food_gastric\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">เป็นอาหาร หรือ น้ำย่อยเหลือง</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitContent\" value=\"bilious_green\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">เป็นสีเขียว น้ำดี</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitContent\" value=\"coffee_ground\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-semibold\">ดำสีโค้ก (Coffee-ground)</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer\">\n                    <input type=\"checkbox\" name=\"vomitContent\" value=\"bloody\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-semibold\">เป็นเลือด หรือ ปนเลือด</span>\n                  </label>\n                  <label class=\"selectable-card p-2 rounded-lg flex items-center cursor-pointer sm:col-span-2\">\n                    <input type=\"checkbox\" id=\"vomit_other_chk\" onchange=\"toggleOtherInput('vomit_other_wrap', this.checked)\" class=\"rounded text-medical-600 h-3.5 w-3.5\">\n                    <span class=\"ml-1.5 font-medium\">อื่นๆ (ระบุ)</span>\n                  </label>\n                </div>\n                <div id=\"vomit_other_wrap\" class=\"hidden mt-2\">\n                  <input type=\"text\" id=\"vomit_other_text\" placeholder=\"ระบุลักษณะการอาเจียนเพิ่มเติม...\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400\">\n                </div>\n              </div>\n            </div>\n\n          </div>\n\n          <!-- SYSTEM 3: ระบบทางเดินปัสสาวะ -->\n          <div class=\"py-4 border-b border-slate-100\">\n            <div class=\"flex items-center justify-between mb-2\">\n              <span class=\"text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center\">\n                <i data-lucide=\"droplet\" class=\"w-4 h-4 mr-1.5 text-indigo-500\"></i> ระบบทางเดินปัสสาวะ\n              </span>\n            </div>\n            <div class=\"grid grid-cols-1 sm:grid-cols-3 gap-2\">\n              <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                <input type=\"checkbox\" id=\"sx_dysuria\" class=\"rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <span class=\"ml-2 text-xs sm:text-sm font-semibold\">ปัสสาวะแสบขัด</span>\n              </label>\n              <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                <input type=\"checkbox\" id=\"sx_turbidurine\" class=\"rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <span class=\"ml-2 text-xs sm:text-sm font-semibold\">ปัสสาวะขุ่น</span>\n              </label>\n              <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                <input type=\"checkbox\" id=\"sx_flankpain\" class=\"rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <span class=\"ml-2 text-xs sm:text-sm font-semibold\">ปวดบั้นเอว / หลัง</span>\n              </label>\n            </div>\n          </div>\n\n          <!-- SYSTEM 4: ระบบประสาท -->\n          <div class=\"py-4 border-b border-slate-100\">\n            <div class=\"flex items-center justify-between mb-2\">\n              <span class=\"text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center\">\n                <i data-lucide=\"brain\" class=\"w-4 h-4 mr-1.5 text-rose-500\"></i> ระบบประสาท\n              </span>\n            </div>\n            <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-2\">\n              <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                <input type=\"checkbox\" id=\"sx_headache\" class=\"rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <span class=\"ml-2 text-xs sm:text-sm font-semibold\">ปวดศีรษะรุนแรง</span>\n              </label>\n              <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                <input type=\"checkbox\" id=\"sx_stiffneck\" class=\"rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <span class=\"ml-2 text-xs sm:text-sm font-semibold\">คอแข็งก้มคอไม่ลง</span>\n              </label>\n              <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                <input type=\"checkbox\" id=\"sx_alteredmental\" class=\"rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <span class=\"ml-2 text-xs sm:text-sm font-semibold\">ซึมลง / สับสน</span>\n              </label>\n              <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                <input type=\"checkbox\" id=\"sx_seizure\" class=\"rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <span class=\"ml-2 text-xs sm:text-sm font-semibold\">มีอาการชักเกร็ง</span>\n              </label>\n            </div>\n          </div>\n\n          <!-- SYSTEM 5: ระบบผิวหนัง & กระดูกและกล้ามเนื้อ -->\n          <div class=\"py-4 border-b border-slate-100\">\n            <div class=\"flex items-center justify-between mb-2\">\n              <span class=\"text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center\">\n                <i data-lucide=\"bone\" class=\"w-4 h-4 mr-1.5 text-orange-500\"></i> ระบบผิวหนัง & กระดูกและกล้ามเนื้อ\n              </span>\n            </div>\n            <div class=\"grid grid-cols-1 sm:grid-cols-2 gap-3\">\n              <!-- ผื่น -->\n              <div class=\"selectable-card p-3 rounded-xl\">\n                <label class=\"flex items-center cursor-pointer\">\n                  <input type=\"checkbox\" id=\"sx_rash\" onchange=\"toggleBranch('rash_loc_wrap', this.checked)\" class=\"rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                  <span class=\"ml-2 text-xs sm:text-sm font-semibold\">มีผื่นตามผิวหนัง</span>\n                </label>\n                <div id=\"rash_loc_wrap\" class=\"hidden mt-2 pt-2 border-t border-slate-100\">\n                  <input type=\"text\" id=\"rash_loc_text\" placeholder=\"ระบุตำแหน่งของผื่น เช่น แขน, ขา, ลำตัว...\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400\">\n                </div>\n              </div>\n\n              <!-- แผล -->\n              <div class=\"selectable-card p-3 rounded-xl\">\n                <label class=\"flex items-center cursor-pointer\">\n                  <input type=\"checkbox\" id=\"sx_wound\" onchange=\"toggleBranch('wound_loc_wrap', this.checked)\" class=\"rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                  <span class=\"ml-2 text-xs sm:text-sm font-semibold\">มีแผล</span>\n                </label>\n                <div id=\"wound_loc_wrap\" class=\"hidden mt-2 pt-2 border-t border-slate-100\">\n                  <input type=\"text\" id=\"wound_loc_text\" placeholder=\"ระบุตำแหน่งของแผล เช่น เท้าซ้าย, แผ่นหลัง...\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400\">\n                </div>\n              </div>\n\n              <!-- ฝี / หนอง -->\n              <div class=\"selectable-card p-3 rounded-xl\">\n                <label class=\"flex items-center cursor-pointer\">\n                  <input type=\"checkbox\" id=\"sx_abscess\" onchange=\"toggleBranch('abscess_loc_wrap', this.checked)\" class=\"rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                  <span class=\"ml-2 text-xs sm:text-sm font-semibold\">มีตุ่มฝี / แผลมีหนอง</span>\n                </label>\n                <div id=\"abscess_loc_wrap\" class=\"hidden mt-2 pt-2 border-t border-slate-100\">\n                  <input type=\"text\" id=\"abscess_loc_text\" placeholder=\"ระบุตำแหน่งฝี/หนอง เช่น ก้น, รักแร้, ขาหนีบ...\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400\">\n                </div>\n              </div>\n\n              <!-- ปวดตามข้อ -->\n              <div class=\"selectable-card p-3 rounded-xl\">\n                <label class=\"flex items-center cursor-pointer\">\n                  <input type=\"checkbox\" id=\"sx_arthralgia\" onchange=\"toggleBranch('arthralgia_loc_wrap', this.checked)\" class=\"rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                  <span class=\"ml-2 text-xs sm:text-sm font-semibold\">ปวดตามข้อ</span>\n                </label>\n                <div id=\"arthralgia_loc_wrap\" class=\"hidden mt-2 pt-2 border-t border-slate-100\">\n                  <input type=\"text\" id=\"arthralgia_loc_text\" placeholder=\"ระบุข้อที่ปวด เช่น ข้อเข่า 2 ข้าง, ข้อมือ, ข้อนิ้วมือ...\" class=\"w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder:text-slate-400\">\n                </div>\n              </div>\n            </div>\n          </div>\n\n          <!-- SYSTEM 6: โรคติดเชื้อเขตร้อน -->\n          <div class=\"py-4 border-b border-slate-100\">\n            <div class=\"flex items-center justify-between mb-2\">\n              <span class=\"text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center\">\n                <i data-lucide=\"bug\" class=\"w-4 h-4 mr-1.5 text-emerald-600\"></i> โรคติดเชื้อเขตร้อน\n              </span>\n            </div>\n            <div class=\"grid grid-cols-2 sm:grid-cols-4 gap-2\">\n              <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                <input type=\"checkbox\" id=\"sx_myalgia\" class=\"rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <span class=\"ml-2 text-xs sm:text-sm font-semibold\">ปวดเมื่อยตัว/เบ้าตา</span>\n              </label>\n              <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                <input type=\"checkbox\" id=\"sx_petechiae\" class=\"rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <span class=\"ml-2 text-xs sm:text-sm font-semibold\">จุดจ้ำเลือด/ผื่นเลือดออก</span>\n              </label>\n              <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                <input type=\"checkbox\" id=\"sx_floodwater\" class=\"rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <span class=\"ml-2 text-xs sm:text-sm font-semibold\">ประวัติลุยน้ำท่วม/ขัง</span>\n              </label>\n              <label class=\"selectable-card flex items-center p-3 rounded-xl cursor-pointer\">\n                <input type=\"checkbox\" id=\"sx_forestravel\" class=\"rounded text-medical-600 focus:ring-medical-500 h-4 w-4\">\n                <span class=\"ml-2 text-xs sm:text-sm font-semibold\">ประวัติเข้าป่า/ยุงกัดชุกชุม</span>\n              </label>\n            </div>\n          </div>\n\n          <!-- SYSTEM 7: อาการอื่นๆ เป็นช่องกรอกอิสระ -->\n          <div class=\"pt-4\">\n            <div class=\"flex items-center justify-between mb-2\">\n              <span class=\"text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center\">\n                <i data-lucide=\"message-square-plus\" class=\"w-4 h-4 mr-1.5 text-slate-500\"></i> อาการอื่นๆ ที่ต้องการแจ้งเพิ่มเติม\n              </span>\n            </div>\n            <textarea id=\"sx_other_free\" rows=\"2\" placeholder=\"พิมพ์ระบุอาการอื่นๆ ที่ท่านมีหรือต้องการบอกแพทย์เพิ่มเติม (ถ้ามี เช่น อ่อนเพลียมาก, แน่นหน้าอก, วิงเวียนศีรษะ)...\" \n              class=\"w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:bg-white\"></textarea>\n          </div>\n\n        </div>\n        </div> <!-- END FEVER QUESTIONNAIRE SECTION -->",
  algorithm: {
  "id": "fever",
  "schemaCode": "fever_and_chills",
  "titleTh": "ไข้ / หนาวสั่น",
  "titleEn": "Fever / Chills",
  "sections": [
    {
      "sectionNo": 1,
      "titleTh": "ระยะเวลาและลักษณะของไข้ (Fever Profile)",
      "questions": [
        {
          "key": "duration",
          "labelTh": "มีไข้มานานเท่าไรแล้ว?",
          "type": "duration_with_unit",
          "units": "UNIVERSAL_DURATION_UNITS"
        },
        {
          "key": "feverPattern",
          "labelTh": "ลักษณะอาการไข้ที่เป็นส่วนใหญ่",
          "type": "single_choice",
          "options": [
            {
              "value": "chills_and_rigor",
              "patientTh": "ไข้สูง หนาวสั่นสะท้าน",
              "doctorTh": "ไข้สูงหนาวสั่นสะท้าน (Chills and rigor)"
            },
            {
              "value": "continuous_high",
              "patientTh": "ไข้สูงลอยตลอดเวลา",
              "doctorTh": "ไข้สูงลอยตลอดทั้งวัน (Continuous high fever)"
            },
            {
              "value": "intermittent",
              "patientTh": "ไข้ต่ำๆ เป็นๆ หายๆ",
              "doctorTh": "ไข้ต่ำๆ สลับหยุด (Intermittent/Low-grade fever)"
            },
            {
              "value": "night_sweats",
              "patientTh": "ตัวรุมๆ เฉพาะช่วงบ่าย-กลางคืน",
              "doctorTh": "ไข้ช่วงบ่าย/กลางคืนร่วมกับเหงื่อออก (Evening rise / Night sweats)"
            }
          ]
        },
        {
          "key": "antipyreticResponse",
          "labelTh": "การทานยาลดไข้และผลลัพธ์",
          "type": "single_choice",
          "options": [
            {
              "value": "subsides_temporarily",
              "patientTh": "ทานยาแล้วไข้ลดลงชั่วคราว แต่กลับมาขึ้นใหม่",
              "doctorTh": "ทานยาลดไข้แล้วไข้ลดลงชั่วคราว (Subsides temporarily)"
            },
            {
              "value": "no_relief",
              "patientTh": "ทานยาลดไข้แล้ว แต่ไข้ไม่ลดลงเลย",
              "doctorTh": "ทานยาลดไข้แล้วไม่ทุเลา (Unresponsive to antipyretics)"
            },
            {
              "value": "not_taken",
              "patientTh": "ยังไม่ได้ทานยาลดไข้",
              "doctorTh": "ยังไม่ได้ทานยาลดไข้ก่อนมา รพ."
            }
          ]
        }
      ]
    },
    {
      "sectionNo": 2,
      "titleTh": "อาการร่วมตามระบบร่างกาย (Systemic Review & Embedded Red Flags)",
      "systems": [
        {
          "system": "respiratory",
          "titleTh": "ระบบทางเดินหายใจ",
          "items": [
            {
              "key": "cough",
              "patientTh": "ไอ (Cough)",
              "branches": [
                "dry_cough",
                "clear_white_sputum",
                "yellow_green_sputum",
                "blood_streaked_sputum"
              ]
            },
            {
              "key": "soreThroat",
              "patientTh": "เจ็บคอ (Sore throat)",
              "branches": [
                "general_throat",
                "left_tonsil",
                "right_tonsil",
                "odinophagia"
              ]
            },
            {
              "key": "rhinorrhea",
              "patientTh": "มีน้ำมูก / คัดจมูก (Rhinorrhea)"
            },
            {
              "key": "dyspnea",
              "patientTh": "หายใจเหนื่อยหอบ / หายใจไม่อิ่ม",
              "isRedFlag": true,
              "branches": [
                "sudden_onset",
                "exertional",
                "continuous",
                "orthopnea"
              ]
            }
          ]
        },
        {
          "system": "gastrointestinal",
          "titleTh": "ระบบทางเดินอาหาร",
          "items": [
            {
              "key": "abdpain",
              "patientTh": "ปวดท้อง (Abdominal pain)",
              "branches": [
                "abdpainLocs",
                "abdpainChars",
                "abdpainRads"
              ]
            },
            {
              "key": "diarrhea",
              "patientTh": "ถ่ายเหลว / ท้องเสีย (Diarrhea)",
              "branches": [
                "diarrheaFreq",
                "watery",
                "mucous_bloody",
                "melena_tarry"
              ]
            },
            {
              "key": "vomit",
              "patientTh": "คลื่นไส้ / อาเจียน (Nausea / Vomiting)",
              "branches": [
                "isNauseaOnly",
                "vomitFreq",
                "food",
                "bile_bitter",
                "coffee_ground",
                "bloody"
              ]
            }
          ]
        },
        {
          "system": "genitourinary",
          "titleTh": "ระบบทางเดินปัสสาวะ",
          "items": [
            {
              "key": "dysuria",
              "patientTh": "ปัสสาวะแสบขัด / ปัสสาวะบ่อยกะปริบกะปรอย"
            },
            {
              "key": "turbidUrine",
              "patientTh": "ปัสสาวะขุ่น / มีกลิ่นเหม็นผิดปกติ / มีเลือดปน"
            },
            {
              "key": "flankPain",
              "patientTh": "ปวดบั้นเอว / ปวดสีข้างด้านหลัง"
            }
          ]
        },
        {
          "system": "neurology",
          "titleTh": "ระบบประสาทและสมอง",
          "items": [
            {
              "key": "headache",
              "patientTh": "ปวดศีรษะรุนแรง"
            },
            {
              "key": "stiffNeck",
              "patientTh": "คอแข็ง ก้มคอไม่ลง ปวดตึงต้นคอมาก",
              "isRedFlag": true
            },
            {
              "key": "alteredMental",
              "patientTh": "ซึมลง สับสน พูดจาไม่รู้เรื่อง หรือปลุกตื่นยาก",
              "isRedFlag": true
            },
            {
              "key": "seizure",
              "patientTh": "มีอาการชักเกร็ง กระตุก หรือหมดสติ",
              "isRedFlag": true
            }
          ]
        },
        {
          "system": "skin_musculoskeletal_tropical",
          "titleTh": "ผิวหนัง ข้อ กล้ามเนื้อ และความเสี่ยงโรคเขตร้อน",
          "items": [
            {
              "key": "rash",
              "patientTh": "มีผื่นขึ้นตามตัว (ระบุตำแหน่ง)"
            },
            {
              "key": "wound",
              "patientTh": "มีบาดแผลอักเสบ บวม แดง ร้อน (ระบุตำแหน่ง)"
            },
            {
              "key": "abscess",
              "patientTh": "มีฝี หนอง หรือก้อนบวมอักเสบ (ระบุตำแหน่ง)"
            },
            {
              "key": "arthralgia",
              "patientTh": "ปวดข้อ หรือข้อบวม (ระบุข้อ)"
            },
            {
              "key": "myalgia",
              "patientTh": "ปวดเมื่อยกล้ามเนื้อรุนแรงทั่วตัว โดยเฉพาะน่อง/หลัง"
            },
            {
              "key": "petechiae",
              "patientTh": "มีจุดเลือดออกสีแดงเล็กๆ ตามผิวหนัง หรือเลือดออกตามไรฟัน",
              "isRedFlag": true
            },
            {
              "key": "floodWater",
              "patientTh": "มีประวัติลุยน้ำขัง ย่ำโคลน หรือแช่น้ำท่วมขัง ในช่วง 2-3 สัปดาห์ก่อน"
            },
            {
              "key": "forestTravel",
              "patientTh": "มีประวัติเข้าป่า ทำสวน ขึ้นเขา หรือพักค้างแรมในป่า"
            }
          ]
        }
      ]
    }
  ]
},
  seedPatients: [
  {
    "id": "case-040",
    "queue_number": "A-040",
    "hn": "6701124",
    "name": "นางสมพร ศรีสุข",
    "age": 58,
    "gender": "หญิง",
    "chief_complaint": "fever_and_chills",
    "chief_complaint_title": "ไข้ / หนาวสั่น",
    "status": "waiting",
    "timestamp": "2026-10-26T02:01:26.411Z",
    "durationVal": 4,
    "durationUnit": "days",
    "feverPattern": "chills_and_rigor",
    "antipyreticResponse": "refractory",
    "cough": true,
    "coughDetails": [
      "purulent",
      "throat_phlegm"
    ],
    "soreThroat": true,
    "soreThroatLocs": [
      "diffuse"
    ],
    "rhinorrhea": false,
    "dyspnea": true,
    "dyspneaPatterns": [
      "continuous",
      "orthopnea"
    ],
    "abdpain": false,
    "abdpainLocs": [],
    "abdpainChars": [],
    "abdpainRads": [],
    "diarrhea": false,
    "diarrheaFreq": 0,
    "diarrheaStools": [],
    "vomit": false,
    "isNauseaOnly": false,
    "vomitFreq": 0,
    "vomitContents": [],
    "dysuria": false,
    "turbidUrine": false,
    "flankPain": false,
    "headache": false,
    "stiffNeck": false,
    "alteredMental": false,
    "seizure": false,
    "rash": false,
    "rashLoc": "",
    "wound": false,
    "woundLoc": "",
    "abscess": false,
    "abscessLoc": "",
    "arthralgia": false,
    "arthralgiaLoc": "",
    "myalgia": false,
    "petechiae": false,
    "floodWater": false,
    "forestTravel": false,
    "otherSymptomsFree": "",
    "hospRecordStatus": "additional",
    "underlying": [
      "เบาหวาน (DM)",
      "ความดันสูง (HT)",
      "ไขมันในเลือดสูง (Dyslipidemia)"
    ],
    "drugAllergy": "ปฏิเสธ",
    "currentMeds": "Metformin 500mg, Amlodipine 5mg, Atorvastatin 20mg",
    "doctor_notes": {
      "additional_hpi": "ผู้ป่วยมีไข้สูงหนาวสั่น 4 วัน ร่วมกับหอบเหนื่อยนอนราบไม่ได้ 1 วันก่อนมา",
      "physical_exam": "BT 39.2 C, PR 112/min, RR 26/min, BP 124/76 mmHg, SpO2 93% RA. Chest: Crepitation RLL",
      "preliminary_dx": "Severe Community-Acquired Pneumonia (CAP) with Acute Respiratory Failure",
      "plan": "O2 cannula 3 LPM, IV Ceftriaxone 2g, IV Azithromycin 500mg, CXR portable, CBC, Hemoculture x 2"
    }
  },
  {
    "id": "case-041",
    "queue_number": "A-041",
    "hn": "6703489",
    "name": "นายกิตติศักดิ์ เจริญพร",
    "age": 24,
    "gender": "ชาย",
    "chief_complaint": "fever_and_chills",
    "chief_complaint_title": "ไข้ / หนาวสั่น",
    "status": "waiting",
    "timestamp": "2026-10-26T02:21:26.423Z",
    "durationVal": 2,
    "durationUnit": "days",
    "feverPattern": "low_grade",
    "antipyreticResponse": "temporary_relief",
    "cough": false,
    "coughDetails": [],
    "soreThroat": false,
    "soreThroatLocs": [],
    "rhinorrhea": false,
    "dyspnea": false,
    "dyspneaPatterns": [],
    "abdpain": true,
    "abdpainLocs": [
      "periumbilical",
      "epigastrium"
    ],
    "abdpainChars": [
      "crampy"
    ],
    "abdpainRads": [
      "back_left"
    ],
    "diarrhea": true,
    "diarrheaFreq": 5,
    "diarrheaStools": [
      "watery"
    ],
    "vomit": true,
    "isNauseaOnly": true,
    "vomitFreq": 0,
    "vomitContents": [],
    "dysuria": false,
    "turbidUrine": false,
    "flankPain": false,
    "headache": false,
    "stiffNeck": false,
    "alteredMental": false,
    "seizure": false,
    "rash": false,
    "rashLoc": "",
    "wound": false,
    "woundLoc": "",
    "abscess": false,
    "abscessLoc": "",
    "arthralgia": false,
    "arthralgiaLoc": "",
    "myalgia": false,
    "petechiae": false,
    "floodWater": false,
    "forestTravel": false,
    "otherSymptomsFree": "ทานส้มตำปูปลาร้าเมื่อวานตอนเย็น",
    "hospRecordStatus": "complete",
    "underlying": [
      "มีประวัติเดิมครบถ้วนในฐานข้อมูล รพ.ราชบุรี (ดึงข้อมูลอัตโนมัติ)"
    ],
    "drugAllergy": "ตามฐานข้อมูล รพ.ราชบุรี (ไม่มีประวัติแพ้ยา/แพ้อาหาร)",
    "currentMeds": "ตามฐานข้อมูล รพ.ราชบุรี",
    "doctor_notes": {
      "additional_hpi": "มีประวัติรับประทานอาหารไม่สุก 1 วันก่อนเริ่มมีอาการถ่ายเหลว",
      "physical_exam": "BT 37.8 C, PR 88/min, RR 18/min, BP 118/72 mmHg. Abdomen: Soft, mild tenderness periumbilical, active bowel sounds",
      "preliminary_dx": "Acute Infectious Gastroenteritis with Mild Dehydration",
      "plan": "NSS 1000 ml IV drip in 4 hr, Buscopan 1 amp IV, ORS, Stool exam"
    }
  },
  {
    "id": "case-042",
    "queue_number": "A-042",
    "hn": "6709842",
    "name": "นายสมคิด สุขเกษม",
    "age": 45,
    "gender": "ชาย",
    "chief_complaint": "fever_and_chills",
    "chief_complaint_title": "ไข้ / หนาวสั่น",
    "status": "waiting",
    "timestamp": "2026-10-26T02:36:26.423Z",
    "durationVal": 3,
    "durationUnit": "days",
    "feverPattern": "continuous_high",
    "antipyreticResponse": "temporary_relief",
    "cough": false,
    "coughDetails": [],
    "soreThroat": false,
    "soreThroatLocs": [],
    "rhinorrhea": false,
    "dyspnea": false,
    "dyspneaPatterns": [],
    "abdpain": false,
    "abdpainLocs": [],
    "abdpainChars": [],
    "abdpainRads": [],
    "diarrhea": false,
    "diarrheaFreq": 0,
    "diarrheaStools": [],
    "vomit": false,
    "isNauseaOnly": false,
    "vomitFreq": 0,
    "vomitContents": [],
    "dysuria": false,
    "turbidUrine": false,
    "flankPain": false,
    "headache": true,
    "stiffNeck": false,
    "alteredMental": false,
    "seizure": false,
    "rash": true,
    "rashLoc": "ลำตัวและแขน 2 ข้าง",
    "wound": false,
    "woundLoc": "",
    "abscess": false,
    "abscessLoc": "",
    "arthralgia": true,
    "arthralgiaLoc": "ข้อมือ และ ข้อเท้า 2 ข้าง",
    "myalgia": true,
    "petechiae": true,
    "floodWater": false,
    "forestTravel": false,
    "otherSymptomsFree": "",
    "hospRecordStatus": "self",
    "underlying": ["ปฏิเสธ"],
    "drugAllergy": "มีประวัติแพ้ยา: Amoxicillin (ผื่นคันลมพิษ)",
    "currentMeds": "ไม่มี",
    "doctor_notes": {
      "additional_hpi": "",
      "physical_exam": "BT 39.4 C, PR 106/min, BP 115/75 mmHg. Tourniquet test positive (> 20 petechiae/sq.inch)",
      "preliminary_dx": "Suspected Dengue Hemorrhagic Fever (DHF)",
      "plan": "CBC, Dengue NS1 Ag / IgM / IgG, NSS IV maintenance"
    }
  }
],

  hydrateForm(patient) {
    const setVal = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.value = val !== undefined && val !== null ? val : '';
    };
    let setChk = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.checked = Boolean(val);
    };
    const durVal = document.getElementById('feverDurationVal');
    const durUnit = document.getElementById('feverDurationUnit');
    if (durVal) durVal.value = patient.durationVal || '';
    if (durUnit && patient.durationUnit) durUnit.value = patient.durationUnit;

    setRadioValue('feverPattern', patient.feverPattern);
    setRadioValue('antipyreticResponse', patient.antipyreticResponse);

    setChk = (id, val, branchId) => {
      const el = document.getElementById(id);
      if (el) el.checked = Boolean(val);
      if (branchId) toggleBranch(branchId, Boolean(val));
    };

    setChk('sx_cough', patient.cough, 'coughBranch');
    if (patient.cough) setMultiCheckboxes('coughDetail', patient.coughDetails, 'cough_other_chk', 'cough_other_wrap', 'cough_other_text');

    setChk('sx_sorethroat', patient.soreThroat, 'sorethroatBranch');
    if (patient.soreThroat) setMultiCheckboxes('sorethroatLoc', patient.soreThroatLocs, 'st_other_chk', 'st_other_wrap', 'st_other_text');

    setChk('sx_rhinorrhea', patient.rhinorrhea);

    setChk('sx_dyspnea', patient.dyspnea, 'dyspneaBranch');
    if (patient.dyspnea) setMultiCheckboxes('dyspneaPattern', patient.dyspneaPatterns, 'dyspnea_other_chk', 'dyspnea_other_wrap', 'dyspnea_other_text');

    setChk('sx_abdpain', patient.abdpain, 'abdpainBranch');
    if (patient.abdpain) {
      setMultiCheckboxes('abdpainLoc', patient.abdpainLocs, 'fever_abdpain_loc_other_chk', 'fever_abdpain_loc_other_wrap', 'fever_abdpain_loc_other_text');
      setMultiCheckboxes('abdpainChar', patient.abdpainChars, 'fever_abdpain_char_other_chk', 'fever_abdpain_char_other_wrap', 'fever_abdpain_char_other_text');
      setMultiCheckboxes('abdpainRad', patient.abdpainRads, 'fever_abdpain_rad_other_chk', 'fever_abdpain_rad_other_wrap', 'fever_abdpain_rad_other_text');
    }

    setChk('sx_diarrhea', patient.diarrhea, 'diarrheaBranch');
    if (patient.diarrhea) {
      const df = document.getElementById('diarrheaFreq');
      if (df) df.value = patient.diarrheaFreq || 1;
      setMultiCheckboxes('diarrheaStool', patient.diarrheaStools, 'diarrhea_other_chk', 'diarrhea_other_wrap', 'diarrhea_other_text');
    }

    setChk('sx_vomit', patient.vomit, 'vomitBranch');
    if (patient.vomit) {
      const noChk = document.getElementById('vomit_nausea_only');
      if (noChk) noChk.checked = Boolean(patient.isNauseaOnly);
      handleNauseaOnlyToggle(Boolean(patient.isNauseaOnly));
      if (!patient.isNauseaOnly) {
        const vf = document.getElementById('vomitFreq');
        if (vf) vf.value = patient.vomitFreq || 1;
        setMultiCheckboxes('vomitContent', patient.vomitContents, 'vomit_other_chk', 'vomit_other_wrap', 'vomit_other_text');
      }
    }

    setChk('sx_dysuria', patient.dysuria);
    setChk('sx_turbidurine', patient.turbidUrine);
    setChk('sx_flankpain', patient.flankPain);
    setChk('sx_headache', patient.headache);
    setChk('sx_stiffneck', patient.stiffNeck);
    setChk('sx_alteredmental', patient.alteredMental);
    setChk('sx_seizure', patient.seizure);

    setChk('sx_rash', patient.rash, 'rash_loc_wrap');
    if (patient.rash && document.getElementById('rash_loc_text')) document.getElementById('rash_loc_text').value = patient.rashLoc || '';

    setChk('sx_wound', patient.wound, 'wound_loc_wrap');
    if (patient.wound && document.getElementById('wound_loc_text')) document.getElementById('wound_loc_text').value = patient.woundLoc || '';

    setChk('sx_abscess', patient.abscess, 'abscess_loc_wrap');
    if (patient.abscess && document.getElementById('abscess_loc_text')) document.getElementById('abscess_loc_text').value = patient.abscessLoc || '';

    setChk('sx_arthralgia', patient.arthralgia, 'arthralgia_loc_wrap');
    if (patient.arthralgia && document.getElementById('arthralgia_loc_text')) document.getElementById('arthralgia_loc_text').value = patient.arthralgiaLoc || '';

    setChk('sx_myalgia', patient.myalgia);
    setChk('sx_petechiae', patient.petechiae);
    setChk('sx_floodwater', patient.floodWater);
    setChk('sx_forestravel', patient.forestTravel);

    if (document.getElementById('sx_other_free')) {
      document.getElementById('sx_other_free').value = patient.otherSymptomsFree || '';
    }
  },

  collectIntake(ctx) {
    const {
      recordId,
      queueNumber,
      randomHn,
      patientName,
      patientAge,
      gender,
      recordStatus,
      hospRecordStatus,
      underlying,
      drugAllergy,
      currentMeds,
      preservedDoctorNotes
    } = ctx;
    let { otherSymptomsFree } = ctx;
    let newPatient;
      // ------------------ FEVER INTAKE ------------------
      const _rawDur = parseFloat(document.getElementById('feverDurationVal')?.value); const durationVal = (!isNaN(_rawDur) && _rawDur > 0) ? _rawDur : null;
      const durationUnit = document.getElementById('feverDurationUnit')?.value || 'days';
      const feverPattern = document.querySelector('input[name="feverPattern"]:checked')?.value || 'unspecified';
      const antipyreticResponse = document.querySelector('input[name="antipyreticResponse"]:checked')?.value || 'unspecified';

      const cough = document.getElementById('sx_cough')?.checked || false;
      const coughDetails = [];
      if (cough) {
        document.querySelectorAll('input[name="coughDetail"]:checked').forEach(cb => coughDetails.push(cb.value));
        if (document.getElementById('cough_other_chk')?.checked) {
          const txt = document.getElementById('cough_other_text')?.value.trim();
          if (txt) coughDetails.push(`อื่นๆ: ${txt}`);
        }
      }

      const soreThroat = document.getElementById('sx_sorethroat')?.checked || false;
      const soreThroatLocs = [];
      if (soreThroat) {
        document.querySelectorAll('input[name="sorethroatLoc"]:checked').forEach(cb => soreThroatLocs.push(cb.value));
        if (document.getElementById('st_other_chk')?.checked) {
          const txt = document.getElementById('st_other_text')?.value.trim();
          if (txt) soreThroatLocs.push(`อื่นๆ: ${txt}`);
        }
      }

      const rhinorrhea = document.getElementById('sx_rhinorrhea')?.checked || false;

      const dyspnea = document.getElementById('sx_dyspnea')?.checked || false;
      const dyspneaPatterns = [];
      if (dyspnea) {
        document.querySelectorAll('input[name="dyspneaPattern"]:checked').forEach(cb => dyspneaPatterns.push(cb.value));
        if (document.getElementById('dyspnea_other_chk')?.checked) {
          const txt = document.getElementById('dyspnea_other_text')?.value.trim();
          if (txt) dyspneaPatterns.push(`อื่นๆ: ${txt}`);
        }
      }

      const abdpain = document.getElementById('sx_abdpain')?.checked || false;
      const abdpainLocs = [];
      const abdpainChars = [];
      const abdpainRads = [];
      if (abdpain) {
        document.querySelectorAll('input[name="abdpainLoc"]:checked').forEach(cb => abdpainLocs.push(cb.value));
        if (document.getElementById('fever_abdpain_loc_other_chk')?.checked) {
          const txt = document.getElementById('fever_abdpain_loc_other_text')?.value.trim();
          if (txt) abdpainLocs.push(`อื่นๆ: ${txt}`);
        }
        document.querySelectorAll('input[name="abdpainChar"]:checked').forEach(cb => abdpainChars.push(cb.value));
        if (document.getElementById('fever_abdpain_char_other_chk')?.checked) {
          const txt = document.getElementById('fever_abdpain_char_other_text')?.value.trim();
          if (txt) abdpainChars.push(`อื่นๆ: ${txt}`);
        }
        document.querySelectorAll('input[name="abdpainRad"]:checked').forEach(cb => abdpainRads.push(cb.value));
        if (document.getElementById('fever_abdpain_rad_other_chk')?.checked) {
          const txt = document.getElementById('fever_abdpain_rad_other_text')?.value.trim();
          if (txt) abdpainRads.push(`อื่นๆ: ${txt}`);
        }
      }

      const diarrhea = document.getElementById('sx_diarrhea')?.checked || false;
      const diarrheaFreq = diarrhea ? (parseInt(document.getElementById('diarrheaFreq')?.value) || 1) : 0;
      const diarrheaStools = [];
      if (diarrhea) {
        document.querySelectorAll('input[name="diarrheaStool"]:checked').forEach(cb => diarrheaStools.push(cb.value));
        if (document.getElementById('diarrhea_other_chk')?.checked) {
          const txt = document.getElementById('diarrhea_other_text')?.value.trim();
          if (txt) diarrheaStools.push(`อื่นๆ: ${txt}`);
        }
      }

      const vomit = document.getElementById('sx_vomit')?.checked || false;
      const isNauseaOnly = vomit && document.getElementById('vomit_nausea_only')?.checked;
      const vomitFreq = (vomit && !isNauseaOnly) ? (parseInt(document.getElementById('vomitFreq')?.value) || 1) : 0;
      const vomitContents = [];
      if (vomit && !isNauseaOnly) {
        document.querySelectorAll('input[name="vomitContent"]:checked').forEach(cb => vomitContents.push(cb.value));
        if (document.getElementById('vomit_other_chk')?.checked) {
          const txt = document.getElementById('vomit_other_text')?.value.trim();
          if (txt) vomitContents.push(`อื่นๆ: ${txt}`);
        }
      }

      const dysuria = document.getElementById('sx_dysuria')?.checked || false;
      const turbidUrine = document.getElementById('sx_turbidurine')?.checked || false;
      const flankPain = document.getElementById('sx_flankpain')?.checked || false;

      const headache = document.getElementById('sx_headache')?.checked || false;
      const stiffNeck = document.getElementById('sx_stiffneck')?.checked || false;
      const alteredMental = document.getElementById('sx_alteredmental')?.checked || false;
      const seizure = document.getElementById('sx_seizure')?.checked || false;

      const rash = document.getElementById('sx_rash')?.checked || false;
      const rashLoc = rash ? document.getElementById('rash_loc_text')?.value.trim() : '';

      const wound = document.getElementById('sx_wound')?.checked || false;
      const woundLoc = wound ? document.getElementById('wound_loc_text')?.value.trim() : '';

      const abscess = document.getElementById('sx_abscess')?.checked || false;
      const abscessLoc = abscess ? document.getElementById('abscess_loc_text')?.value.trim() : '';

      const arthralgia = document.getElementById('sx_arthralgia')?.checked || false;
      const arthralgiaLoc = arthralgia ? document.getElementById('arthralgia_loc_text')?.value.trim() : '';

      const myalgia = document.getElementById('sx_myalgia')?.checked || false;
      const petechiae = document.getElementById('sx_petechiae')?.checked || false;
      const floodWater = document.getElementById('sx_floodwater')?.checked || false;
      const forestTravel = document.getElementById('sx_forestravel')?.checked || false;

      const feverOtherSymptomsFree = document.getElementById('sx_other_free')?.value.trim() || otherSymptomsFree || '';

      newPatient = {
        id: recordId,
        queue_number: queueNumber,
        hn: randomHn,
        name: patientName,
        age: patientAge,
        gender: gender,
        chief_complaint: 'fever_and_chills',
        chief_complaint_title: 'ไข้ / หนาวสั่น',
        status: recordStatus,
        timestamp: new Date().toISOString(),
        durationVal,
        durationUnit,
        feverPattern,
        antipyreticResponse,
        cough,
        coughDetails,
        soreThroat,
        soreThroatLocs,
        rhinorrhea,
        dyspnea,
        dyspneaPatterns,
        abdpain,
        abdpainLocs,
        abdpainChars,
        abdpainRads,
        diarrhea,
        diarrheaFreq,
        diarrheaStools,
        vomit,
        isNauseaOnly,
        vomitFreq,
        vomitContents,
        dysuria,
        turbidUrine,
        flankPain,
        headache,
        stiffNeck,
        alteredMental,
        seizure,
        rash,
        rashLoc,
        wound,
        woundLoc,
        abscess,
        abscessLoc,
        arthralgia,
        arthralgiaLoc,
        myalgia,
        petechiae,
        floodWater,
        forestTravel,
        otherSymptomsFree: feverOtherSymptomsFree,
        hospRecordStatus,
        underlying: underlying.length > 0 ? underlying: ['ปฏิเสธ'],
        drugAllergy,
        currentMeds,
        doctor_notes: preservedDoctorNotes
      };
    return newPatient;
  },

  isRedFlag(p) {
    return Boolean(
      p.dyspnea || (p.diarrhea && p.diarrheaStools?.includes('melena_tarry')) || 
      (p.vomit && (p.vomitContents?.includes('bloody') || p.vomitContents?.includes('coffee_ground'))) ||
      p.stiffNeck || p.alteredMental || p.seizure || p.petechiae
    );
  },

  evaluateRedFlags(patient) {
    const redFlags = [];
    // Fever Red Flags
    if (patient.dyspnea) {
      let riskDesc = 'เสี่ยง Severe Pneumonia / Sepsis / Acute Respiratory Failure';
      if (patient.dyspneaPatterns?.includes('orthopnea')) {
        riskDesc += ' (มี Orthopnea: เสี่ยง Congestive Heart Failure / Acute Pulmonary Edema)';
      }
      redFlags.push({ key: 'dyspnea', textTh: 'หายใจเหนื่อยหอบ (Dyspnea)', risk: riskDesc });
    }
    if (patient.diarrhea && patient.diarrheaStools?.includes('melena_tarry')) {
      redFlags.push({ key: 'melena', textTh: 'ถ่ายดำเหนียวเหมือนยางมะตอย (Melena)', risk: 'เสี่ยงภาวะเลือดออกในทางเดินอาหารส่วนต้นรุนแรง (Upper GI Bleed)' });
    }
    if (patient.vomit && !patient.isNauseaOnly && (patient.vomitContents?.includes('bloody') || patient.vomitContents?.includes('coffee_ground'))) {
      redFlags.push({ key: 'hematemesis', textTh: 'อาเจียนเป็นเลือดหรือสีกาแฟ (Hematemesis / Coffee-ground)', risk: 'เสี่ยงภาวะเลือดออกในทางเดินอาหารเฉียบพลัน (Acute Upper GI Bleeding)' });
    }
    if (patient.abdpain && patient.abdpainChars?.includes('sharp_tearing') && 
       (patient.abdpainRads?.includes('back_mid') || patient.abdpainRads?.includes('chest') || patient.abdpainRads?.includes('back_left') || patient.abdpainRads?.includes('back_right'))) {
      redFlags.push({ key: 'tearing_abd_pain', textTh: 'ปวดท้องเสียบแทงร้าวทะลุหลัง/หน้าอก', risk: 'เสี่ยงภาวะฉุกเฉินหลอดเลือดแดงใหญ่ หรือ อวัยวะภายในทะลุ (Ruptured Aorta / Hollow Viscus Perforation)' });
    }
    if (patient.stiffNeck) redFlags.push({ key: 'stiff_neck', textTh: 'คอแข็งเกร็ง ก้มคอไม่ได้ (Nuchal rigidity)', risk: 'เสี่ยง Acute Meningitis / Encephalitis' });
    if (patient.alteredMental) redFlags.push({ key: 'altered_mental_status', textTh: 'ซึมลง สับสน ไม่รู้ตัว (Altered mental status)', risk: 'เสี่ยง Septic Encephalopathy / CNS Infection' });
    if (patient.seizure) redFlags.push({ key: 'seizure', textTh: 'มีอาการชักเกร็ง (Convulsion / Seizure)', risk: 'เสี่ยง Febrile Convulsion / Intracranial Infection' });
    if (patient.petechiae) redFlags.push({ key: 'petechiae_purpura', textTh: 'จุดจ้ำเลือดตามผิวหนัง (Petechiae / Bleeding tendency)', risk: 'เสี่ยง Dengue Hemorrhagic Fever / Meningococcemia / Sepsis with DIC' });
    return redFlags;
  },

  updateOutputs(patient) {
    updateFeverOutputs(patient);
  },

  generateCds(patient, ctx) {
    const { rfs, ddxList, workupList, managementList } = ctx;
    // Fever
    if (rfs.some(r => r.key === 'stiff_neck' || r.key === 'altered_mental_status')) {
      ddxList.push('1. Acute Bacterial Meningitis / Viral Meningoencephalitis');
      ddxList.push('2. Sepsis / Septic Shock with Septic Encephalopathy');
      ddxList.push('3. Severe Tropical Infection (Cerebral Malaria / Severe Leptospirosis / Scrub Typhus)');
      workupList.push('• Hemoculture x 2, CBC, BUN/Cr, Electrolytes, Lactate, Dextrostix (DTX)');
      workupList.push('• CT Brain ก่อนทำ Lumbar Puncture (LP) และให้ Empirical IV Antibiotics + Dexamethasone โดยไม่รอผล LP หากต้องทำ CT');
      managementList.push('• เริ่ม Sepsis 1-Hour Bundle ทันที: IV Fluid Resuscitation 30 mL/kg (หากมี Hypotension/Lactate ≥ 4) และให้ IV Ceftriaxone 2g');
    } else {
      ddxList.push('1. Acute Systemic Viral Infection / Dengue Fever / Influenza');
      ddxList.push('2. Tropical Spirochetal/Rickettsial Infection (Leptospirosis / Scrub Typhus - หากมีประวัติลุยน้ำ/เข้าป่า)');
      ddxList.push('3. Localized Bacterial Infection (Acute Pyelonephritis / Pneumonia / Acute Gastroenteritis)');
      workupList.push('• CBC with Platelet count, Tourniquet test, Dengue NS1 Ag / IgM, UA, CXR (หากมีอาการทางเดินหายใจ)');
      managementList.push('• ให้ยาลดไข้ Paracetamol (หลีกเลี่ยง NSAIDs/Aspirin เด็ดขาดหากยังตัดโรคไข้เลือดออก Dengue ไม่ได้)');
      managementList.push('• แนะนำการดื่มเกลือแร่ ORS และเน้นย้ำสัญญาณเตือนที่ต้องรีบกลับมา รพ. ทันที');
    }
  }
});
