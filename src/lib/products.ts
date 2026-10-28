// Single source of truth for the five Divaca products.

export type Detail = {
  problem: { title: string; text: string };
  features: { title: string; text: string; icon?: string }[];
  featuresTitle?: [string, string];
  stepsTitle?: string;
  steps?: { title: string; text: string }[];
  faqs?: { q: string; a: string }[];
  facts: { label: string; value: string }[];
};

export type Product = {
  slug: string;
  number: string;
  name: string;
  tagline: string;
  category: string;
  url?: string;
  audience: string;
  status?: string;
  detail?: Detail;
};

export const products: Product[] = [
  {
    slug: 'campus-update', number: '01', name: 'Campus Update', category: 'School', status: 'Piloting',
    url: 'https://campusupdate.vercel.app/',
    tagline: 'Everything important on campus. Verified.',
    audience: 'Students, staff and school admins',
    detail: {
      problem: {
        title: 'Campus news should not travel by forwarded screenshot.',
        text: 'Notices arrive late. Registration and exam dates get buried under hundreds of unread messages. And a forwarded screenshot has no source, so nobody can tell what is real. Campus Update is the one place where authorised school admins publish, and every item shows who published it.',
      },
      features: [
        { icon: 'SealCheck', title: 'Know it is official', text: 'Only authorised school admins can publish, and every article carries an Official label.' },
        { icon: 'Newspaper', title: 'News and announcements', text: 'Browse, search and read school news without digging through group chats.' },
        { icon: 'BellRinging', title: 'Urgent alerts', text: 'Push alerts arrive the moment your school sends one, and only when the school chooses.' },
        { icon: 'CalendarBlank', title: 'Events and calendar', text: 'Registration, exam and resumption dates live in one academic calendar.' },
      ],
      steps: [
        { title: 'School publishes', text: 'An authorised admin posts the notice.' },
        { title: 'Right people', text: 'It goes to the faculty, department or level it is meant for.' },
        { title: 'Phone alerts', text: 'Push alerts, when the school chooses to send one.' },
        { title: 'Clear label', text: 'You see exactly who said it.' },
      ],
      faqs: [
        { q: 'Who can post official news?', a: 'Only authorised school admins can publish, so everything in the app comes from your school.' },
        { q: 'Is it free?', a: 'Schools publish for free, and the content is always clearly labelled.' },
        { q: 'Does it work at my school?', a: 'It is piloting with the Computer Science department at FOCIT today. To bring it to your school, use the form on this page and choose "School admin".' },
        { q: 'How do schools join?', a: 'Use the form on this page and choose "School admin". The first pilot is with the Computer Science department at FOCIT.' },
      ],
      facts: [
        { label: 'Who it is for', value: 'Students, staff and school admins' },
        { label: 'Where it is', value: 'Piloting with the Computer Science department at FOCIT.' },
        { label: 'Mobile apps', value: 'App Store and Google Play: coming soon.' },
      ],
    },
  },
  { slug: 'divaca-tech', number: '02', name: 'Divaca Tech', category: 'Technology',
    tagline: 'Software built properly for institutions that need it to work.',
    audience: 'Businesses and institutions',
    detail: {
      problem: { title: 'The technology company behind Divaca.', text: 'Divaca Tech is committed to transforming technology across Africa and beyond. It is the founding partner of Divaca Health, providing the innovation, infrastructure and vision behind what that product builds.' },
      features: [
        { icon: 'Handshake', title: 'Founding partner', text: 'Divaca Tech backs Divaca Health and provides the infrastructure behind it.' },
        { icon: 'GlobeHemisphereWest', title: 'Built for Africa first', text: 'Products are designed around the realities of African institutions, then built to work anywhere.' },
      ],
      featuresTitle: ['What it does.', 'More details soon.'],
      facts: [
        { label: 'Who it is for', value: 'Businesses and institutions' },
        { label: 'Industry', value: 'Technology' },
        { label: 'Backs', value: 'Divaca Health' },
      ],
    },
  },
  { slug: 'divaca-health', number: '03', name: 'Divaca Health', category: 'Health', status: 'Early access',
    url: 'https://www.divacahealth.com/',
    tagline: 'Health records that keep working when the power or internet does not.',
    audience: 'Schools, institutions, clinics and hospitals',
    detail: {
      problem: { title: 'Healthcare should not stop where the power or the internet does.', text: 'Divaca Health gives schools, institutions and hospitals digital records and reliable infrastructure, built for African health systems. It works offline, runs on solar power, and keeps the queue moving. It is not only for the sick: tracking and rewards encourage people to stay healthy.' },
      features: [
        { icon: 'IdentificationCard', title: 'Student digital health cards', text: 'Every student gets a digital card that opens their record at any partner clinic.' },
        { icon: 'Stethoscope', title: 'Nurse and doctor dashboards', text: 'Prescriptions, medical history and a smart queue system on a tablet-friendly record.' },
        { icon: 'SolarPanel', title: 'Keeps working through outages', text: 'Records save on the device and sync when the connection returns. Solar power is optional.' },
        { icon: 'Heartbeat', title: 'Health tracker and rewards', text: 'Patients earn points for healthy actions, so care starts before the clinic visit.' },
      ],
      featuresTitle: ['Built for the clinic.', 'Useful before you get there.'],
      stepsTitle: 'For students',
      steps: [
        { title: 'Register', text: 'The student signs up and gets a digital health card.' },
        { title: 'Show the card', text: 'They present it at a partner clinic.' },
        { title: 'Check in', text: 'A health attendant scans it to confirm the visit.' },
        { title: 'Treated and recorded', text: 'The nurse or doctor treats them and updates the record, which syncs securely.' },
      ],
      faqs: [
        { q: 'Who is it for?', a: 'Schools, institutions and hospitals. The first plan is for clinics and institutional health providers; plans for general hospitals, specialty clinics and developers are coming soon.' },
        { q: 'Does it need internet or power all the time?', a: 'No. It syncs offline, and it can run on optional solar power.' },
        { q: 'Who is behind it?', a: 'Divaca Health is powered by Divaca Tech, its founding partner.' },
      ],
      facts: [
        { label: 'Who it is for', value: 'Schools, institutions, clinics and hospitals' },
        { label: 'Where it is', value: 'Early access requests are open at divacahealth.com.' },
        { label: 'Coming next', value: 'Hospital integrations, analytics, multilingual access and an API.' },
      ],
    },
  },
  { slug: 'playsphere', number: '04', name: 'PlaySphere', category: 'Gaming', status: 'Preview',
    url: 'https://playsphere.vercel.app/',
    tagline: 'Find a tournament. Build a team. Track your climb.',
    audience: 'Gamers, teams and tournament organizers',
    detail: {
      problem: { title: 'Esports needs one place to find, run and follow tournaments.', text: 'PlaySphere brings gamers, teams and tournament organizers together: find tournaments, manage a team, track your stats and build a community around the games you play.' },
      features: [
        { icon: 'Trophy', title: 'Tournament discovery', text: 'Find and join tournaments, from registration to running your own community.' },
        { icon: 'UsersThree', title: 'Team management', text: 'Create a team, invite players and enter tournaments together.' },
        { icon: 'ChartLineUp', title: 'Performance tracker', text: 'Detailed stats to follow your progress and climb the ranks.' },
        { icon: 'Broadcast', title: 'Live streaming', text: 'Stream matches from inside the platform.' },
        { icon: 'ChatsCircle', title: 'Community', text: 'Follow players and teams, post highlights and talk in chats and forums.' },
        { icon: 'ClipboardText', title: 'Tools for organizers', text: 'Manage tournaments, track results and keep participants engaged, with single or double elimination, round-robin and swiss formats.' },
      ],
      featuresTitle: ['Built for players.', 'Built for organizers.'],
      facts: [
        { label: 'Who it is for', value: 'Gamers, teams and tournament organizers' },
        { label: 'Where it is', value: 'Preview site at playsphere.vercel.app.' },
        { label: 'Mobile apps', value: 'Coming soon.' },
      ],
    },
  },
  { slug: 'divaca-innovative-hub', number: '05', name: 'Divaca Innovative Hub', category: 'Learning',
    tagline: 'Learn tech by building real projects, beside the people you will work with.',
    audience: 'Early-career people in product, design, development and data',
    detail: {
      problem: { title: 'Hands-on experience is hard to find early in a tech career.', text: 'Divaca Innovative Hub is a collaborative platform for creativity, innovation and hands-on experience in technology, esports and project development. It brings together people with one to four years of experience in roles such as product management, UI/UX design, development and data analysis. It is built on Christian principles and a commitment to excellence.' },
      features: [
        { icon: 'Code', title: 'Technology', text: 'Work on real projects with people in neighbouring roles.' },
        { icon: 'GameController', title: 'Esports', text: 'A space that treats gaming and competitive play as part of tech.' },
        { icon: 'Rocket', title: 'Project development', text: 'Hands-on experience taking an idea from concept to something shipped.' },
        { icon: 'UsersFour', title: 'Roles that fit together', text: 'Product management, UI/UX design, development and data analysis, working side by side.' },
      ],
      featuresTitle: ['Learn by building.', 'With people who build.'],
      facts: [
        { label: 'Who it is for', value: 'People with 1 to 4 years of experience in tech roles' },
        { label: 'Industry', value: 'Technology, information and internet' },
        { label: 'Founded on', value: 'Christian principles and a commitment to excellence' },
      ],
    },
  },
];

export const nav = [
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
