import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

// Load .env.local manually
function loadEnv(filePath) {
  const env = {};
  if (!fs.existsSync(filePath)) return env;
  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx);
    const val = trimmed.slice(idx + 1);
    env[key] = val;
  }
  return env;
}

const env = loadEnv(path.resolve(process.cwd(), '.env.local'));
const MONGODB_URI = env.MONGODB_URI || process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI not found in .env.local or environment');
  process.exit(1);
}

const csvData = `Department,Name,Designation,Specialization / Research Area (Related Subjects)
Director/Admin. Office,Prof. Prasad Krishna,Director,(Ex-officio Faculty Member/ME Professor)
Director/Admin. Office,Dr. P.S. Sathidevi,Deputy Director,(Ex-officio Faculty Member)
Computer Science & Engg (CSE),Abdul Nazeer K A,Professor,"Bioinformatics, Data Science, Artificial Intelligence, Health Informatics"
Computer Science & Engg (CSE),Dr. Subashini R.,Associate Professor/HoD,"Data Structures, Algorithms, Computational Geometry, Parameterized Algorithms"
Computer Science & Engg (CSE),Dr. Lijiya A.,Faculty,"Computer Vision, Multimedia Systems, AI/ML Applications"
Computer Science & Engg (CSE),Dr. S. Sheerazuddin,Assistant Professor,"Theoretical Computer Science, Formal Methods, Verification"
Computer Science & Engg (CSE),Dr. Jay Prakash,Assistant Professor,"Machine Learning/Deep Learning, Natural Language Processing (NLP), Data & Text Mining"
Computer Science & Engg (CSE),Dr. Amit Praseed,Assistant Professor,"DDoS Detection, Information Security, Machine Learning for Cyber Security"
Computer Science & Engg (CSE),Subhasree M.,Associate Professor,Computational Geometry
Computer Science & Engg (CSE),Dr. Muralikrishnan K,Faculty,Computer Science and Engineering
Electronics & Comm. Engg (ECE),Dr. Babu A. V.,Professor/Dean,"Wireless Communication, Physical Layer Security, NOMA Networks"
Electronics & Comm. Engg (ECE),Dr. Jaikumar M G,Associate Professor & Head,"Semiconductor Devices, Machine Learning, Artificial Intelligence, Embedded Systems"
Electronics & Comm. Engg (ECE),Dr. C. Periasamy,Associate Professor,Electronics & Communication Engineering (Communication/Network)
Electronics & Comm. Engg (ECE),Dr. Lintu Rajan,Assistant Professor,Electronics & Communication Engineering
Electrical Engineering (EE),Dr. Sindhu T. K.,Professor & Head,"High Voltage Engg, Power Systems"
Electrical Engineering (EE),Dr. Ashok S,Professor,"Industrial Power, Micro-Grids, Energy Auditing & Management"
Electrical Engineering (EE),Dr. Jeevamma Jacob,Professor,"Instrumentation and Control, DSP"
Electrical Engineering (EE),Dr. Rahul Radhakrishnan,Assistant Professor,"State Estimation, Process Control, ML/Deep Learning Methods"
Electrical Engineering (EE),Dr. Greeshma Mohan U.,Assistant Professor,Power Electronics and Power Systems
Electrical Engineering (EE),Dr. Sathiya S.,Assistant Professor,"Sensor System Design, IoT and AI for Measurement Systems"
Civil Engineering (CE),T. M. Madhavan Pillai,Professor (HAG),Transportation Engineering
Civil Engineering (CE),Dr. M. V. L. R. Anjaneyulu**,Professor (HAG),Structural Engineering
Civil Engineering (CE),Dr. Santosh G. Thampi**,Professor (HAG),Water Resources/Environmental Engineering
Civil Engineering (CE),Dr. K. Krishnamurthy,Professor,Transportation Engineering
Civil Engineering (CE),Dr. Harikrishna M.,Associate Professor,Civil Engineering
Civil Engineering (CE),Dr. Yogeshwar V. Navandar,Assistant Professor,Civil Engineering
Mechanical Engineering (ME),Jose Mathew,Professor (HAG),"Thermal Engineering, Fluid Mechanics"
Mechanical Engineering (ME),Dr. A. Shaija,Professor/Dean,"Manufacturing, Materials Engineering, Planning & Development"
Mechanical Engineering (ME),Dr. R. Manu,Professor,"Machine Design, Finite Element Analysis"
Mechanical Engineering (ME),Dr. Biju T. Kuzhiveli,Professor,Thermal and Fluid Engineering
Mechanical Engineering (ME),Dr. Nidhi Baranwal,Assistant Professor,Mechanical Engineering
Chemical Engineering (CHE),Dr. Shiny Joseph,Professor,Chemical Engineering
Chemical Engineering (CHE),Dr. V. Sivasubramanian,Professor,Chemical Engineering
Chemical Engineering (CHE),Dr. Swapna Reddy P.,Assistant Professor,"Process Control, Modeling (using ANN/AI), Optimization"
Chemical Engineering (CHE),Dr. Vineesh Ravi,Assistant Professor,"Chemical Engineering, Nanomaterials Synthesis"
Chemical Engineering (CHE),Dr. M. Yogesh Kumar,Faculty,"Scientific Communications, Liquid Crystals, Polymer Chemistry"
Materials Science & Engg (MSE),Dr. Sajith V.,Professor/HoD,"Nano Engineering, Heat Transfer, Carbon Nanomaterials, Energy Applications"
Materials Science & Engg (MSE),Dr. C. B. Sobhan,Professor,"Nanofluids, Phase Change Materials, Thermal Transport"
Materials Science & Engg (MSE),Dr. CN Shyam Kumar,Assistant Professor,"Applied Microscopy, Carbon Nanostructures, Solar Cells"
Materials Science & Engg (MSE),Dr. Soney Varghese,Professor,"Polymer Nanocomposites, MEMS Devices, Pyroelectric Materials"
Management Studies (DMS),Dr. Nithya M.,Head of the Department,"Operations Management, Marketing"
Management Studies (DMS),Dr. Manju Mahipalan,Assistant Professor,"Business Administration, Human Resources, Organizational Behavior"
Management Studies (DMS),Dr. Muhammad Shafi,Associate Professor,"Finance, General Management"
Bioscience & Engg (BS),Dr. A. Santhiagu,Professor,"Biotechnology, Biosciences"
Bioscience & Engg (BS),Dr. Md. Anaul Kabir,Professor,"Biotechnology, Biosciences"
Bioscience & Engg (BS),Dr. Baiju G. Nair,Associate Professor,Biosciences and Engineering
Architecture & Planning (AR),Dr. P. P. Anil Kumar,Professor & Head,"Urban Design, Transportation Planning, Building Science"
Architecture & Planning (AR),Dr. Kasthurba A. K.,Professor,"Environmental Planning, Sustainable Architecture"
Architecture & Planning (AR),Dr. Naseer M. A.,Professor,"Architectural Conservation, Urban Planning"
Mathematics (MA),Dr. M. S. Sunitha,Dean: Faculty Welfare/Professor,"Fluid Dynamics, Differential Equations"
Mathematics (MA),Dr. Satyananda Panda,Dean: Students Welfare/Professor,"Functional Analysis, Harmonic Analysis"
Mathematics (MA),Dr. Chithra A. V.,Professor,"Operations Research, Optimization Techniques"
Mathematics (MA),Dr. Ashish Awasthi,Associate Professor,"Applied Statistics, Reliability Analysis"
Physics (PH),Dr. Ravi Varma M K,Dean: IACR/Professor,"Spectroscopy, Nano-optics"
Physics (PH),Dr. Chandrasekharan K.,Professor (HAG),Nonlinear Optical Materials for Photonics
Physics (PH),Dr. Raghu Chatanathodi,Professor,Computational Modeling of Materials
Physics (PH),Dr. Aji A. Anappara,Associate Professor,"Nanotechnology, Photonics"
Chemistry (CY),Dr. Mini Mol Menamparambath,Faculty,"Physical Chemistry, Electrochemistry"
Chemistry (CY),Dr. Parameswaran Pattiyil,Head of the Department,Chemistry
"Humanities, Arts & Social Sciences (HASS)",Dr. Trixy Elizabeth John,Faculty,Education/Humanities
"Humanities, Arts & Social Sciences (HASS)",Dr. Indumathi Sathisaran,Faculty,"Humanities, Arts and Social Sciences"
Department of Education,Dr. Deepa Jose,Assistant Professor (Adhoc),Education`;

function parseCSV(csv) {
  const lines = csv.split(/\r?\n/).filter(Boolean);
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    const values = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') inQuotes = !inQuotes;
      else if (char === ',' && !inQuotes) {
        values.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current);
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = (values[i] || '').trim());
    return obj;
  });
}

const facultyList = parseCSV(csvData);

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String },
  office: { type: String },
  designation: { type: String },
  specialization: { type: String },
  availableSlots: { type: Number, default: 10 },
}, { timestamps: true });

const Faculty = mongoose.models.Faculty || mongoose.model('Faculty', facultySchema);

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, { /* useNewUrlParser: true, useUnifiedTopology: true */ });
    console.log('Connected');

    console.log(`Parsed ${facultyList.length} entries`);

    const del = await Faculty.deleteMany({});
    console.log(`Deleted ${del.deletedCount} existing documents`);

    const docs = facultyList.map(f => ({
      name: f['Name'],
      department: f['Department'],
      designation: f['Designation'],
      specialization: f['Specialization / Research Area (Related Subjects)'] || '',
      email: '',
      office: '',
      availableSlots: 10,
    }));

    const res = await Faculty.insertMany(docs);
    console.log(`Inserted ${res.length} faculty documents`);
    await mongoose.disconnect();
    console.log('Done');
    process.exit(0);
  } catch (err) {
    console.error('Import failed:', err);
    process.exit(1);
  }
}

run();