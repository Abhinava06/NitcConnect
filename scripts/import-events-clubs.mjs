import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

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
  console.error('MONGODB_URI not found');
  process.exit(1);
}

const eventData = [
  {
    title: 'Ragam',
    category: 'cultural',
    description: 'One of the largest cultural fests in India. Includes music concerts (Pro-Shows), dance competitions, film contests, drama, fine arts, and literary events.',
    timeframe: 'March/April',
  },
  {
    title: 'Tathva',
    category: 'technical',
    description: 'Focuses on innovation, technology, and management. Features robotics competitions, coding events, exhibitions, workshops (AI, EV, Data Security), and lectures by eminent speakers.',
    timeframe: 'September/October',
  },
  {
    title: 'Adizya',
    category: 'cultural',
    description: 'Organised by the Department of Architecture and Planning. Focuses on architectural design, fine arts, and creatively inclined events.',
    timeframe: 'Concurrent with Tathva',
  },
  {
    title: 'Tarang',
    category: 'other',
    description: 'Organised by the School of Management Studies (SOMS). Features business games, case studies, quizzes, and management skill competitions.',
    timeframe: 'Typically Late Year',
  },
  {
    title: 'Convocation',
    category: 'other',
    description: 'The formal ceremony for the awarding of degrees to graduating students (UG, PG, Ph.D.).',
    timeframe: 'August/September',
  },
  {
    title: 'Foundation Day',
    category: 'other',
    description: 'Celebration of the founding of the institution (formerly CREC).',
    timeframe: 'September 1st',
  },
  {
    title: 'Orientation Programme',
    category: 'other',
    description: 'Separate programmes for new UG, PG, and Ph.D. students to introduce them to the campus, rules, and academic environment.',
    timeframe: 'August',
  },
  {
    title: 'IEEE YESS',
    category: 'technical',
    description: "A techno-managerial summit organized by the IEEE NITC Student Branch, featuring eminent speakers, workshops, and leadership sessions.",
    timeframe: 'September/October',
  },
  {
    title: 'VIRASAT',
    category: 'cultural',
    description: 'Collaborative initiative with SPIC MACAY to promote Indian classical music, art, culture, and traditional performances.',
    timeframe: 'March',
  },
  {
    title: 'End Semester Exams',
    category: 'academic',
    description: 'Key dates for major semester examinations as per the Academic Calendar.',
    timeframe: 'Oct/Nov, Mar/Apr',
  },
  {
    title: 'Onam Celebration',
    category: 'cultural',
    description: 'A major campus celebration reflecting the culture of Kerala, often featuring Sadhyas (feasts) and traditional Pookalam.',
    timeframe: 'August/September',
  },
];

const clubData = [
  { name: 'Literary & Debating Club (LnD)', category: 'cultural', email: 'literary@nitc.ac.in', description: 'Fosters debating, writing, and public speaking skills. Produces campus content (Crowtalks, Humans of NITC). Annual event: Debutante. Focuses on oration and intellect.' },
  { name: 'Forum for Dance & Dramatics (DnD)', category: 'cultural', email: 'dnd@nitc.ac.in', description: 'Cultivates talent in dance, acting, and drama. Organizes major stage productions and fashion shows. Annual event: DnD Week (includes Couture Boulevard for Fashion Show and Choreo-Nite).' },
  { name: 'Indian Cultural Association (ICA)', category: 'cultural', email: 'ica@nitc.ac.in', description: 'Focuses on various socio-cultural events and personality contests on campus. Annual event: Sangam (includes Mr. and Ms. Personality contests).' },
  { name: 'Music Club', category: 'cultural', email: 'music@nitc.ac.in', description: 'Nurtures vocal and instrumental talent. Provides performance opportunities during fests and throughout the year. Performs at Pro-Shows during Tathva and Ragam.' },
  { name: 'Enquire Quiz Club', category: 'technical', email: 'enquire@nitc.ac.in', description: "NITC's official quiz club. Highly active in the Kerala quizzing circuit. Responsible for all major campus quizzes. Conducts Samasya (inter-school quiz) during Tathva and quizzes during Ragam." },
  { name: 'CP Hub (Competitive Programming)', category: 'technical', email: 'cphub@nitc.ac.in', description: 'Dedicated to fostering competitive programming and problem-solving skills among students. Organizes regular coding competitions and workshops.' },
  { name: 'Artificial Intelligence Club', category: 'technical', email: 'ai@nitc.ac.in', description: 'Platform for students to collaborate on AI-based technologies, Deep Learning, and challenging research projects. Conducts workshops on latest AI topics.' },
  { name: 'Robotics Interest Group (RIG)', category: 'technical', email: 'rig@nitc.ac.in', description: 'Focuses on research, development, and innovation in the fields of robotics and automation. Participates in national/international robotics competitions.' },
  { name: 'Club Unwired (CUW)', category: 'technical', email: 'unwired@nitc.ac.in', description: 'Primarily focused on radio-controlled (R/C) modeling, aeronautics, and automotive design.' },
  { name: 'Indian Society for Technical Education (ISTE)', category: 'technical', email: 'iste@nitc.ac.in', description: 'National professional body dedicated to career development of teachers and personality development of students. Annual event: Spectrum.' },
  { name: 'FOSSCell', category: 'technical', email: 'foss@nitc.ac.in', description: 'The Free and Open Source Software (FOSS) community. Promotes open-source development and collaboration. Organizes hackathons and open-source events.' },
  { name: 'Club Mathematica', category: 'technical', email: 'mathematica@nitc.ac.in', description: 'Helps students improve logical reasoning, critical thinking, and mathematical exploration beyond academics. Annual event: Infinitum.' },
  { name: 'Club Innovation (SEF)', category: 'technical', email: 'sef@nitc.ac.in', description: 'Promotes innovative and entrepreneurship-driven ideas (formerly Social Engineering Forum - SEF). Organizes competitions and technical projects.' },
  { name: 'Adventure Club (TAC)', category: 'other', email: 'adventure@nitc.ac.in', description: 'Focuses on student entertainment, recreation, and outdoor activities like trekking and camping. Organizes trips and outdoor events.' },
  { name: 'National Service Scheme (NSS)', category: 'social', email: 'nss@nitc.ac.in', description: 'Promotes social welfare and community service among students. Organizes blood donation camps, cleaning drives, and social awareness campaigns.' },
  { name: 'National Cadet Corps (NCC)', category: 'social', email: 'ncc@nitc.ac.in', description: 'Aims at developing character, discipline, comradeship, and the spirit of selfless service. Regular training, camps, and ceremonial activities.' },
  { name: 'Research Forum', category: 'academic', email: 'research@nitc.ac.in', description: 'A platform for students (UG/PG/PhD) to discuss, present, and collaborate on research work. Organizes paper presentations and research talks.' },
];

const facultySchema = new mongoose.Schema({ name: String }, { timestamps: true });
const userSchema = new mongoose.Schema({ email: { type: String, required: true }, name: String }, { timestamps: true });
const EventSchema = new mongoose.Schema({ title: String, description: String, startDate: Date, endDate: Date, location: String, organizer: mongoose.Schema.Types.ObjectId, category: String }, { timestamps: true });
const ClubSchema = new mongoose.Schema({ name: String, description: String, category: String, email: String, image: String, president: mongoose.Schema.Types.ObjectId, members: Number }, { timestamps: true });

const Faculty = mongoose.models.Faculty || mongoose.model('Faculty', new mongoose.Schema({ name: String }));
const User = mongoose.models.User || mongoose.model('User', userSchema);
const Event = mongoose.models.Event || mongoose.model('Event', EventSchema);
const Club = mongoose.models.Club || mongoose.model('Club', ClubSchema);

async function run() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected');

    // Create or find admin user
    let admin = await User.findOne({ email: 'admin@nitc.local' });
    if (!admin) {
      admin = await User.create({ email: 'admin@nitc.local', name: 'Import Admin' });
      console.log('Created admin user');
    }

    // Insert events
    const eventDocs = eventData.map(e => ({
      title: e.title,
      description: e.description,
      startDate: new Date(),
      endDate: new Date(),
      location: 'Campus',
      organizer: admin._id,
      category: e.category,
    }));

    const evDel = await Event.deleteMany({ title: { $in: eventData.map(e => e.title) } });
    console.log('Deleted', evDel.deletedCount, 'existing events');
    const evRes = await Event.insertMany(eventDocs);
    console.log('Inserted events:', evRes.length);

    // Insert clubs
    const clubDocs = clubData.map(c => ({
      name: c.name,
      description: c.description,
      category: (c.category === 'cultural' ? 'cultural' : (c.category === 'technical' ? 'technical' : 'other')),
      email: c.email,
      image: '',
      president: admin._id,
      members: 10,
    }));

    const clDel = await Club.deleteMany({ name: { $in: clubData.map(c => c.name) } });
    console.log('Deleted', clDel.deletedCount, 'existing clubs');
    const clRes = await Club.insertMany(clubDocs);
    console.log('Inserted clubs:', clRes.length);

    await mongoose.disconnect();
    console.log('Done');
  } catch (err) {
    console.error('Import failed:', err);
  }
}

run();