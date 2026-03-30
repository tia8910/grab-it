import { Course, Category, Level, Provider } from "./types";
import { classifyBucket } from "./classify";

function make(data: Omit<Course, "bucket" | "valueScore"> & Partial<Pick<Course, "bucket" | "valueScore">>): Course {
  const bucket = classifyBucket(data);
  let score = 0;
  score += (data.rating ?? 0) * 18;
  if (data.isFree) score += 30;
  if (data.hasCertificate) score += 25;
  if (data.isAuditAvailable) score += 15;
  if (data.hasFinancialAid) score += 10;
  if (data.price && data.price < 20) score += 15;
  if (data.isOffer) score += 20;
  return { ...data, bucket, valueScore: Math.round(score) };
}

// Thumbnail generator using UI Avatars as placeholder
function thumb(text: string, bg: string): string {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(text)}&background=${bg}&color=fff&size=400&font-size=0.25&bold=true`;
}

const PROVIDER_COLORS: Record<Provider, string> = {
  nvidia: "76b900", google: "4285f4", ibm: "0f62fe", meta: "0668e1",
  coursera: "0056d2", udemy: "a435f0", hubspot: "ff7a59", aws: "ff9900",
};

export const ALL_COURSES: Course[] = [
  // ===== AI & MACHINE LEARNING =====
  make({
    id: "nvidia-deep-learning", title: "Fundamentals of Deep Learning", titleAr: "أساسيات التعلم العميق",
    provider: "nvidia", url: "https://learn.nvidia.com/courses/fundamentals-of-deep-learning",
    price: 0, isFree: true, hasCertificate: true, isAuditAvailable: false, hasFinancialAid: false,
    rating: 4.9, students: "120K+", duration: "8 hours", category: "ai-ml", level: "beginner",
    imageUrl: thumb("NVIDIA+DL", PROVIDER_COLORS.nvidia),
    aiDescription: "Master the fundamentals of deep learning with hands-on exercises using NVIDIA's GPU-accelerated tools. Build and train neural networks for image classification and NLP tasks.",
    aiDescriptionAr: "أتقن أساسيات التعلم العميق مع تمارين عملية باستخدام أدوات NVIDIA المسرّعة. ابنِ ودرّب شبكات عصبية لتصنيف الصور ومعالجة اللغة.",
    aiBenefits: ["Hands-on GPU labs", "Industry certificate", "No prerequisites", "Self-paced"],
    aiTags: ["Best for Beginners", "High Income Skill", "Free Certificate"],
    isOffer: true, offerLabel: "FREE CERT",
    tags: { price: "FREE", credential: "CERTIFIED", financial: "NONE", time: "SHORT_FORM" },
  }),
  make({
    id: "stanford-ml", title: "Machine Learning Specialization", titleAr: "تخصص تعلم الآلة من ستانفورد",
    provider: "coursera", url: "https://www.coursera.org/specializations/machine-learning-introduction",
    price: 0, isFree: true, hasCertificate: true, isAuditAvailable: true, hasFinancialAid: true,
    rating: 4.9, students: "5M+", duration: "3 months", category: "ai-ml", level: "beginner",
    imageUrl: thumb("Stanford+ML", PROVIDER_COLORS.coursera),
    aiDescription: "Andrew Ng's legendary ML course, updated for 2025. Learn supervised learning, neural networks, and practical ML skills used by top companies worldwide.",
    aiDescriptionAr: "دورة أندرو نغ الأسطورية في تعلم الآلة، محدّثة لعام 2025. تعلّم التعلم الموجّه والشبكات العصبية والمهارات العملية.",
    aiBenefits: ["By Andrew Ng", "Audit free", "Financial aid available", "World-renowned"],
    aiTags: ["Most Popular", "Top Rated", "High Income Skill"],
    tags: { price: "FREE", credential: "CERTIFIED", financial: "AUDIT_AVAILABLE", time: "FULL_SPECIALIZATION" },
  }),
  make({
    id: "nvidia-llm", title: "Building RAG Agents with LLMs", titleAr: "بناء وكلاء RAG مع النماذج اللغوية",
    provider: "nvidia", url: "https://learn.nvidia.com/courses/building-rag-agents-with-llms",
    price: 0, isFree: true, hasCertificate: true, isAuditAvailable: false, hasFinancialAid: false,
    rating: 4.8, students: "45K+", duration: "8 hours", category: "ai-ml", level: "intermediate",
    imageUrl: thumb("NVIDIA+RAG", PROVIDER_COLORS.nvidia),
    aiDescription: "Build production-ready RAG agents using LangChain and NVIDIA NIM. Learn retrieval-augmented generation, vector databases, and enterprise AI deployment.",
    aiDescriptionAr: "ابنِ وكلاء RAG جاهزة للإنتاج باستخدام LangChain و NVIDIA NIM.",
    aiBenefits: ["Cutting-edge AI", "Hands-on labs", "Enterprise skills", "Free certificate"],
    aiTags: ["Trending", "High Income Skill", "Free Certificate"],
    isOffer: true, offerLabel: "FREE CERT",
    tags: { price: "FREE", credential: "CERTIFIED", financial: "NONE", time: "SHORT_FORM" },
  }),
  make({
    id: "udemy-chatgpt", title: "ChatGPT & AI Mastery: Complete Guide 2025", titleAr: "احتراف ChatGPT والذكاء الاصطناعي 2025",
    provider: "udemy", url: "https://www.udemy.com/course/chatgpt-complete-guide/",
    price: 9.99, originalPrice: 89.99, isFree: false, hasCertificate: true, isAuditAvailable: false, hasFinancialAid: false,
    rating: 4.7, students: "320K+", duration: "28 hours", category: "ai-ml", level: "beginner",
    imageUrl: thumb("ChatGPT+AI", PROVIDER_COLORS.udemy),
    aiDescription: "Master ChatGPT, Midjourney, and 20+ AI tools for business and career. Learn prompt engineering, AI automation, and practical use cases.",
    aiDescriptionAr: "أتقن ChatGPT وأكثر من 20 أداة ذكاء اصطناعي للأعمال والمهنة.",
    aiBenefits: ["Practical AI skills", "20+ tools covered", "Certificate included", "Lifetime access"],
    aiTags: ["Trending", "Best Seller"],
    isOffer: true, offerLabel: "89% OFF",
    tags: { price: "PAID", credential: "CERTIFIED", financial: "NONE", time: "FULL_SPECIALIZATION" },
  }),

  // ===== PROGRAMMING =====
  make({
    id: "python-everybody", title: "Python for Everybody Specialization", titleAr: "بايثون للجميع",
    provider: "coursera", url: "https://www.coursera.org/specializations/python",
    price: 0, isFree: true, hasCertificate: true, isAuditAvailable: true, hasFinancialAid: true,
    rating: 4.8, students: "3.2M+", duration: "8 months", category: "programming", level: "beginner",
    imageUrl: thumb("Python", PROVIDER_COLORS.coursera),
    aiDescription: "The world's most popular Python course by University of Michigan. Learn programming from zero — data structures, web scraping, databases, and more.",
    aiDescriptionAr: "أشهر دورة بايثون في العالم من جامعة ميشيغان. تعلّم البرمجة من الصفر.",
    aiBenefits: ["No prerequisites", "University-backed", "Hands-on projects", "Free to audit"],
    aiTags: ["Most Popular", "Best for Beginners"],
    tags: { price: "FREE", credential: "CERTIFIED", financial: "AUDIT_AVAILABLE", time: "FULL_SPECIALIZATION" },
  }),
  make({
    id: "udemy-web-dev", title: "The Complete Web Development Bootcamp", titleAr: "معسكر تطوير الويب الشامل",
    provider: "udemy", url: "https://www.udemy.com/course/the-complete-web-development-bootcamp/",
    price: 12.99, originalPrice: 99.99, isFree: false, hasCertificate: true, isAuditAvailable: false, hasFinancialAid: false,
    rating: 4.7, students: "1.2M+", duration: "62 hours", category: "programming", level: "beginner",
    imageUrl: thumb("Web+Dev", PROVIDER_COLORS.udemy),
    aiDescription: "Learn HTML, CSS, JavaScript, React, Node.js, and more. The only course you need to become a full-stack web developer in 2025.",
    aiDescriptionAr: "تعلّم HTML, CSS, JavaScript, React, Node.js والمزيد. الدورة الوحيدة لتصبح مطور ويب.",
    aiBenefits: ["Full-stack coverage", "62 hours of content", "Real projects", "Lifetime access"],
    aiTags: ["Best Seller", "Top Rated"],
    isOffer: true, offerLabel: "87% OFF",
    tags: { price: "PAID", credential: "CERTIFIED", financial: "NONE", time: "FULL_SPECIALIZATION" },
  }),
  make({
    id: "meta-frontend", title: "Meta Front-End Developer Certificate", titleAr: "شهادة مطور واجهات أمامية من Meta",
    provider: "meta", url: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    price: 39, isFree: false, hasCertificate: true, isAuditAvailable: true, hasFinancialAid: true,
    rating: 4.7, students: "400K+", duration: "7 months", category: "programming", level: "beginner",
    imageUrl: thumb("Meta+FE", PROVIDER_COLORS.meta),
    aiDescription: "Build job-ready skills for front-end development. Learn React, HTML, CSS, JavaScript, and UX/UI design directly from Meta engineers.",
    aiDescriptionAr: "اكتسب مهارات جاهزة للعمل في تطوير الواجهات الأمامية من مهندسي Meta.",
    aiBenefits: ["By Meta engineers", "Job-ready skills", "Portfolio projects", "Career support"],
    aiTags: ["Career Certificate", "High Income Skill"],
    tags: { price: "SUBSCRIPTION", credential: "CERTIFIED", financial: "AUDIT_AVAILABLE", time: "FULL_SPECIALIZATION" },
  }),
  make({
    id: "meta-backend", title: "Meta Back-End Developer Certificate", titleAr: "شهادة مطور خلفيات من Meta",
    provider: "meta", url: "https://www.coursera.org/professional-certificates/meta-back-end-developer",
    price: 39, isFree: false, hasCertificate: true, isAuditAvailable: true, hasFinancialAid: true,
    rating: 4.7, students: "200K+", duration: "8 months", category: "programming", level: "beginner",
    imageUrl: thumb("Meta+BE", PROVIDER_COLORS.meta),
    aiDescription: "Master Python, Django, REST APIs, and databases. Prepare for a career in back-end development with Meta's professional certificate.",
    aiDescriptionAr: "أتقن Python و Django و REST APIs وقواعد البيانات مع شهادة Meta المهنية.",
    aiBenefits: ["Python & Django", "API development", "Database design", "Career certificate"],
    aiTags: ["Career Certificate", "High Income Skill"],
    tags: { price: "SUBSCRIPTION", credential: "CERTIFIED", financial: "AUDIT_AVAILABLE", time: "FULL_SPECIALIZATION" },
  }),

  // ===== DATA SCIENCE =====
  make({
    id: "google-data-analytics", title: "Google Data Analytics Certificate", titleAr: "شهادة تحليل البيانات من Google",
    provider: "google", url: "https://grow.google/certificates/data-analytics/",
    price: 0, isFree: true, hasCertificate: true, isAuditAvailable: false, hasFinancialAid: false,
    rating: 4.8, students: "2.1M+", duration: "6 months", category: "data-science", level: "beginner",
    imageUrl: thumb("Google+DA", PROVIDER_COLORS.google),
    aiDescription: "Prepare for a career in data analytics. Learn SQL, R, Tableau, and spreadsheets. No experience needed — designed by Google for entry-level roles.",
    aiDescriptionAr: "استعد لمهنة في تحليل البيانات. تعلّم SQL و R و Tableau. مصمم من Google للمبتدئين.",
    aiBenefits: ["No experience needed", "By Google", "Job-ready in 6 months", "Free certificate"],
    aiTags: ["Most Popular", "Free Certificate", "Career Certificate"],
    isOffer: true, offerLabel: "FREE",
    tags: { price: "FREE", credential: "CERTIFIED", financial: "NONE", time: "FULL_SPECIALIZATION" },
  }),
  make({
    id: "ibm-data-science", title: "IBM Data Science Professional Certificate", titleAr: "شهادة IBM المهنية في علم البيانات",
    provider: "ibm", url: "https://www.coursera.org/professional-certificates/ibm-data-science",
    price: 49, isFree: false, hasCertificate: true, isAuditAvailable: true, hasFinancialAid: true,
    rating: 4.6, students: "700K+", duration: "5 months", category: "data-science", level: "beginner",
    imageUrl: thumb("IBM+DS", PROVIDER_COLORS.ibm),
    aiDescription: "Master data science, Python, SQL, machine learning, and data visualization with IBM. Build a portfolio of real-world projects.",
    aiDescriptionAr: "أتقن علم البيانات و Python و SQL وتعلم الآلة مع IBM. ابنِ محفظة مشاريع حقيقية.",
    aiBenefits: ["IBM credential", "Hands-on projects", "Python & SQL", "Free to audit"],
    aiTags: ["Career Certificate", "High Income Skill"],
    tags: { price: "SUBSCRIPTION", credential: "CERTIFIED", financial: "AUDIT_AVAILABLE", time: "FULL_SPECIALIZATION" },
  }),
  make({
    id: "udemy-sql", title: "The Complete SQL Bootcamp: Zero to Hero", titleAr: "معسكر SQL الشامل: من الصفر للاحتراف",
    provider: "udemy", url: "https://www.udemy.com/course/the-complete-sql-bootcamp/",
    price: 14.99, originalPrice: 94.99, isFree: false, hasCertificate: true, isAuditAvailable: false, hasFinancialAid: false,
    rating: 4.7, students: "850K+", duration: "9 hours", category: "data-science", level: "beginner",
    imageUrl: thumb("SQL", PROVIDER_COLORS.udemy),
    aiDescription: "Learn SQL using PostgreSQL. Master queries, joins, aggregations, subqueries, and database management from scratch.",
    aiDescriptionAr: "تعلّم SQL باستخدام PostgreSQL. أتقن الاستعلامات والربط والتجميع وإدارة قواعد البيانات.",
    aiBenefits: ["Quick to complete", "Practical exercises", "Industry standard SQL", "Certificate"],
    aiTags: ["Best Seller", "Quick Win"],
    isOffer: true, offerLabel: "84% OFF",
    tags: { price: "PAID", credential: "CERTIFIED", financial: "NONE", time: "SHORT_FORM" },
  }),

  // ===== CLOUD & DEVOPS =====
  make({
    id: "aws-cloud-practitioner", title: "AWS Cloud Practitioner Essentials", titleAr: "أساسيات AWS السحابية",
    provider: "aws", url: "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/",
    price: 0, isFree: true, hasCertificate: true, isAuditAvailable: false, hasFinancialAid: false,
    rating: 4.7, students: "500K+", duration: "6 hours", category: "cloud", level: "beginner",
    imageUrl: thumb("AWS+CP", PROVIDER_COLORS.aws),
    aiDescription: "Official AWS training for the Cloud Practitioner certification. Understand cloud concepts, AWS services, security, and pricing.",
    aiDescriptionAr: "تدريب AWS الرسمي لشهادة Cloud Practitioner. افهم مفاهيم السحابة وخدمات AWS.",
    aiBenefits: ["Official AWS content", "Free certificate", "6 hours only", "Career boost"],
    aiTags: ["Free Certificate", "Quick Win", "High Income Skill"],
    isOffer: true, offerLabel: "FREE CERT",
    tags: { price: "FREE", credential: "CERTIFIED", financial: "NONE", time: "SHORT_FORM" },
  }),
  make({
    id: "google-cloud-eng", title: "Google Cloud Professional Certificate", titleAr: "شهادة Google Cloud المهنية",
    provider: "google", url: "https://www.coursera.org/professional-certificates/cloud-engineering-gcp",
    price: 39, isFree: false, hasCertificate: true, isAuditAvailable: true, hasFinancialAid: true,
    rating: 4.6, students: "180K+", duration: "4 months", category: "cloud", level: "intermediate",
    imageUrl: thumb("GCP", PROVIDER_COLORS.google),
    aiDescription: "Prepare for the Google Cloud Associate Cloud Engineer certification. Learn cloud infrastructure, networking, and deployment.",
    aiDescriptionAr: "استعد لشهادة Google Cloud Associate. تعلّم البنية التحتية السحابية والشبكات.",
    aiBenefits: ["Google credential", "Hands-on labs", "Audit free", "Career support"],
    aiTags: ["Career Certificate", "High Income Skill"],
    tags: { price: "SUBSCRIPTION", credential: "CERTIFIED", financial: "AUDIT_AVAILABLE", time: "FULL_SPECIALIZATION" },
  }),

  // ===== BUSINESS =====
  make({
    id: "google-pm", title: "Google Project Management Certificate", titleAr: "شهادة إدارة المشاريع من Google",
    provider: "google", url: "https://grow.google/certificates/project-management/",
    price: 0, isFree: true, hasCertificate: true, isAuditAvailable: false, hasFinancialAid: false,
    rating: 4.8, students: "1.2M+", duration: "6 months", category: "business", level: "beginner",
    imageUrl: thumb("Google+PM", PROVIDER_COLORS.google),
    aiDescription: "Learn project management from Google. Master Agile, Scrum, and traditional methodologies. Prepare for PMI certifications.",
    aiDescriptionAr: "تعلّم إدارة المشاريع من Google. أتقن Agile و Scrum. استعد لشهادات PMI.",
    aiBenefits: ["By Google", "Free certificate", "Agile & Scrum", "No experience needed"],
    aiTags: ["Most Popular", "Free Certificate", "Career Certificate"],
    isOffer: true, offerLabel: "FREE",
    tags: { price: "FREE", credential: "CERTIFIED", financial: "NONE", time: "FULL_SPECIALIZATION" },
  }),
  make({
    id: "udemy-pmp", title: "PMP Certification Exam Prep", titleAr: "التحضير لامتحان PMP",
    provider: "udemy", url: "https://www.udemy.com/course/pmp-certification-exam-prep/",
    price: 13.99, originalPrice: 84.99, isFree: false, hasCertificate: true, isAuditAvailable: false, hasFinancialAid: false,
    rating: 4.6, students: "350K+", duration: "35 hours", category: "business", level: "intermediate",
    imageUrl: thumb("PMP", PROVIDER_COLORS.udemy),
    aiDescription: "Complete PMP exam preparation with 35 hours of content covering all PMBOK domains. Includes practice exams and study guides.",
    aiDescriptionAr: "تحضير شامل لامتحان PMP مع 35 ساعة من المحتوى. يشمل اختبارات تجريبية.",
    aiBenefits: ["35 contact hours", "Practice exams", "PMBOK aligned", "Certificate"],
    aiTags: ["Exam Prep", "Career Boost"],
    isOffer: true, offerLabel: "84% OFF",
    tags: { price: "PAID", credential: "CERTIFIED", financial: "NONE", time: "FULL_SPECIALIZATION" },
  }),

  // ===== MARKETING =====
  make({
    id: "google-digital-marketing", title: "Google Digital Marketing Certificate", titleAr: "شهادة التسويق الرقمي من Google",
    provider: "google", url: "https://grow.google/certificates/digital-marketing-ecommerce/",
    price: 0, isFree: true, hasCertificate: true, isAuditAvailable: false, hasFinancialAid: false,
    rating: 4.8, students: "900K+", duration: "6 months", category: "marketing", level: "beginner",
    imageUrl: thumb("Google+DM", PROVIDER_COLORS.google),
    aiDescription: "Master digital marketing and e-commerce fundamentals. Learn SEO, SEM, email marketing, analytics, and social media marketing from Google.",
    aiDescriptionAr: "أتقن أساسيات التسويق الرقمي والتجارة الإلكترونية. تعلّم SEO والتحليلات ووسائل التواصل.",
    aiBenefits: ["By Google", "Free certificate", "Job-ready skills", "E-commerce included"],
    aiTags: ["Free Certificate", "Career Certificate", "Most Popular"],
    isOffer: true, offerLabel: "FREE",
    tags: { price: "FREE", credential: "CERTIFIED", financial: "NONE", time: "FULL_SPECIALIZATION" },
  }),
  make({
    id: "hubspot-marketing", title: "HubSpot Inbound Marketing Certification", titleAr: "شهادة التسويق الداخلي من HubSpot",
    provider: "hubspot", url: "https://academy.hubspot.com/courses/inbound-marketing",
    price: 0, isFree: true, hasCertificate: true, isAuditAvailable: false, hasFinancialAid: false,
    rating: 4.5, students: "300K+", duration: "5 hours", category: "marketing", level: "beginner",
    imageUrl: thumb("HubSpot", PROVIDER_COLORS.hubspot),
    aiDescription: "Learn inbound marketing from HubSpot, the industry leader. Master content strategy, social media, conversion optimization, and lead nurturing.",
    aiDescriptionAr: "تعلّم التسويق الداخلي من HubSpot. أتقن استراتيجية المحتوى ووسائل التواصل.",
    aiBenefits: ["Industry recognized", "Free forever", "5 hours only", "Practical skills"],
    aiTags: ["Free Certificate", "Quick Win"],
    tags: { price: "FREE", credential: "CERTIFIED", financial: "NONE", time: "SHORT_FORM" },
  }),
  make({
    id: "meta-marketing", title: "Meta Marketing Analytics Certificate", titleAr: "شهادة تحليلات التسويق من Meta",
    provider: "meta", url: "https://www.coursera.org/professional-certificates/facebook-marketing-analytics",
    price: 39, isFree: false, hasCertificate: true, isAuditAvailable: true, hasFinancialAid: true,
    rating: 4.6, students: "150K+", duration: "6 months", category: "marketing", level: "intermediate",
    imageUrl: thumb("Meta+MA", PROVIDER_COLORS.meta),
    aiDescription: "Learn marketing analytics from Meta. Master data-driven marketing, A/B testing, attribution modeling, and campaign optimization.",
    aiDescriptionAr: "تعلّم تحليلات التسويق من Meta. أتقن التسويق المبني على البيانات.",
    aiBenefits: ["By Meta", "Data-driven skills", "Real campaigns", "Audit free"],
    aiTags: ["Career Certificate"],
    tags: { price: "SUBSCRIPTION", credential: "CERTIFIED", financial: "AUDIT_AVAILABLE", time: "FULL_SPECIALIZATION" },
  }),

  // ===== DESIGN =====
  make({
    id: "google-ux", title: "Google UX Design Certificate", titleAr: "شهادة تصميم UX من Google",
    provider: "google", url: "https://grow.google/certificates/ux-design/",
    price: 0, isFree: true, hasCertificate: true, isAuditAvailable: false, hasFinancialAid: false,
    rating: 4.8, students: "800K+", duration: "6 months", category: "design", level: "beginner",
    imageUrl: thumb("Google+UX", PROVIDER_COLORS.google),
    aiDescription: "Design user experiences from scratch. Learn UX research, wireframing, prototyping with Figma, and usability testing from Google.",
    aiDescriptionAr: "صمم تجارب المستخدم من الصفر. تعلّم بحث UX والنمذجة مع Figma من Google.",
    aiBenefits: ["By Google", "Figma skills", "Portfolio projects", "Free certificate"],
    aiTags: ["Most Popular", "Free Certificate", "Career Certificate"],
    isOffer: true, offerLabel: "FREE",
    tags: { price: "FREE", credential: "CERTIFIED", financial: "NONE", time: "FULL_SPECIALIZATION" },
  }),
  make({
    id: "udemy-figma", title: "Figma UI/UX Design Essential Training", titleAr: "تدريب أساسيات تصميم Figma",
    provider: "udemy", url: "https://www.udemy.com/course/figma-ux-ui-design-user-experience-tutorial-course/",
    price: 11.99, originalPrice: 79.99, isFree: false, hasCertificate: true, isAuditAvailable: false, hasFinancialAid: false,
    rating: 4.6, students: "200K+", duration: "14 hours", category: "design", level: "beginner",
    imageUrl: thumb("Figma", PROVIDER_COLORS.udemy),
    aiDescription: "Master Figma from zero. Learn UI design, prototyping, auto layout, components, and design systems used by professional designers.",
    aiDescriptionAr: "أتقن Figma من الصفر. تعلّم تصميم واجهات المستخدم والنمذجة والتخطيط التلقائي.",
    aiBenefits: ["Hands-on projects", "Modern tool", "Industry standard", "Quick to learn"],
    aiTags: ["Best Seller"],
    isOffer: true, offerLabel: "85% OFF",
    tags: { price: "PAID", credential: "CERTIFIED", financial: "NONE", time: "SHORT_FORM" },
  }),

  // ===== CYBERSECURITY =====
  make({
    id: "google-cybersecurity", title: "Google Cybersecurity Certificate", titleAr: "شهادة الأمن السيبراني من Google",
    provider: "google", url: "https://grow.google/certificates/cybersecurity/",
    price: 0, isFree: true, hasCertificate: true, isAuditAvailable: false, hasFinancialAid: false,
    rating: 4.8, students: "600K+", duration: "6 months", category: "cybersecurity", level: "beginner",
    imageUrl: thumb("Google+CS", PROVIDER_COLORS.google),
    aiDescription: "Start a career in cybersecurity with Google. Learn threat detection, incident response, Python for security, and SIEM tools.",
    aiDescriptionAr: "ابدأ مهنة في الأمن السيبراني مع Google. تعلّم كشف التهديدات والاستجابة للحوادث.",
    aiBenefits: ["By Google", "High demand skill", "Free certificate", "No prerequisites"],
    aiTags: ["Free Certificate", "High Income Skill", "Career Certificate"],
    isOffer: true, offerLabel: "FREE",
    tags: { price: "FREE", credential: "CERTIFIED", financial: "NONE", time: "FULL_SPECIALIZATION" },
  }),
  make({
    id: "ibm-cybersecurity", title: "IBM Cybersecurity Analyst Certificate", titleAr: "شهادة محلل أمن سيبراني من IBM",
    provider: "ibm", url: "https://www.coursera.org/professional-certificates/ibm-cybersecurity-analyst",
    price: 49, isFree: false, hasCertificate: true, isAuditAvailable: true, hasFinancialAid: true,
    rating: 4.6, students: "250K+", duration: "4 months", category: "cybersecurity", level: "beginner",
    imageUrl: thumb("IBM+Sec", PROVIDER_COLORS.ibm),
    aiDescription: "Become a cybersecurity analyst with IBM. Learn network security, vulnerability assessment, digital forensics, and compliance.",
    aiDescriptionAr: "كن محلل أمن سيبراني مع IBM. تعلّم أمن الشبكات وتقييم الثغرات.",
    aiBenefits: ["IBM credential", "Hands-on labs", "Free to audit", "Career ready"],
    aiTags: ["Career Certificate"],
    tags: { price: "SUBSCRIPTION", credential: "CERTIFIED", financial: "AUDIT_AVAILABLE", time: "FULL_SPECIALIZATION" },
  }),

  // ===== More courses for search variety =====
  make({
    id: "udemy-react", title: "React — The Complete Guide 2025", titleAr: "React — الدليل الشامل 2025",
    provider: "udemy", url: "https://www.udemy.com/course/react-the-complete-guide-incl-redux/",
    price: 12.99, originalPrice: 94.99, isFree: false, hasCertificate: true, isAuditAvailable: false, hasFinancialAid: false,
    rating: 4.7, students: "900K+", duration: "68 hours", category: "programming", level: "beginner",
    imageUrl: thumb("React", PROVIDER_COLORS.udemy),
    aiDescription: "Master React 19, Next.js, Redux, and React Router. Build modern web apps with the most in-demand JavaScript framework.",
    aiDescriptionAr: "أتقن React 19 و Next.js و Redux. ابنِ تطبيقات ويب حديثة مع أشهر إطار JavaScript.",
    aiBenefits: ["68 hours of content", "React 19", "Real projects", "Lifetime access"],
    aiTags: ["Best Seller", "Top Rated"],
    isOffer: true, offerLabel: "86% OFF",
    tags: { price: "PAID", credential: "CERTIFIED", financial: "NONE", time: "FULL_SPECIALIZATION" },
  }),
  make({
    id: "coursera-excel", title: "Excel Skills for Business Specialization", titleAr: "مهارات Excel للأعمال",
    provider: "coursera", url: "https://www.coursera.org/specializations/excel",
    price: 0, isFree: true, hasCertificate: true, isAuditAvailable: true, hasFinancialAid: true,
    rating: 4.8, students: "1.5M+", duration: "6 months", category: "business", level: "beginner",
    imageUrl: thumb("Excel", PROVIDER_COLORS.coursera),
    aiDescription: "From beginner to advanced Excel. Learn formulas, pivot tables, VBA macros, and data analysis for business decision making.",
    aiDescriptionAr: "من المبتدئ إلى المتقدم في Excel. تعلّم الصيغ والجداول المحورية وتحليل البيانات.",
    aiBenefits: ["Essential skill", "Free to audit", "University course", "Practical focus"],
    aiTags: ["Most Popular", "Best for Beginners"],
    tags: { price: "FREE", credential: "CERTIFIED", financial: "AUDIT_AVAILABLE", time: "FULL_SPECIALIZATION" },
  }),
  make({
    id: "hubspot-content", title: "HubSpot Content Marketing Certification", titleAr: "شهادة تسويق المحتوى من HubSpot",
    provider: "hubspot", url: "https://academy.hubspot.com/courses/content-marketing",
    price: 0, isFree: true, hasCertificate: true, isAuditAvailable: false, hasFinancialAid: false,
    rating: 4.5, students: "180K+", duration: "6 hours", category: "marketing", level: "beginner",
    imageUrl: thumb("Content", PROVIDER_COLORS.hubspot),
    aiDescription: "Master content marketing strategy, creation, promotion, and analytics. Learn to create content that drives traffic and conversions.",
    aiDescriptionAr: "أتقن استراتيجية تسويق المحتوى والإنشاء والترويج والتحليلات.",
    aiBenefits: ["Free forever", "Practical skills", "Quick certification", "Industry recognized"],
    aiTags: ["Free Certificate", "Quick Win"],
    tags: { price: "FREE", credential: "CERTIFIED", financial: "NONE", time: "SHORT_FORM" },
  }),
  make({
    id: "nvidia-genai", title: "Generative AI Explained", titleAr: "شرح الذكاء الاصطناعي التوليدي",
    provider: "nvidia", url: "https://learn.nvidia.com/courses/generative-ai-explained",
    price: 0, isFree: true, hasCertificate: true, isAuditAvailable: false, hasFinancialAid: false,
    rating: 4.7, students: "60K+", duration: "2 hours", category: "ai-ml", level: "beginner",
    imageUrl: thumb("GenAI", PROVIDER_COLORS.nvidia),
    aiDescription: "Understand generative AI, LLMs, transformers, and diffusion models. A quick intro to the technology reshaping every industry.",
    aiDescriptionAr: "افهم الذكاء الاصطناعي التوليدي والنماذج اللغوية الكبيرة والمحولات.",
    aiBenefits: ["2 hours only", "Free certificate", "Cutting-edge topic", "No prerequisites"],
    aiTags: ["Quick Win", "Trending", "Free Certificate"],
    isOffer: true, offerLabel: "FREE CERT",
    tags: { price: "FREE", credential: "CERTIFIED", financial: "NONE", time: "SHORT_FORM" },
  }),
];

export function getCourseById(id: string): Course | undefined {
  return ALL_COURSES.find((c) => c.id === id);
}

export function getOfferCourses(): Course[] {
  return ALL_COURSES.filter((c) => c.isOffer).sort((a, b) => b.valueScore - a.valueScore).slice(0, 4);
}

export function getTrendingCourses(): Course[] {
  const studentCount = (s?: string) => {
    if (!s) return 0;
    const num = parseFloat(s.replace(/[^0-9.]/g, ""));
    if (s.includes("M")) return num * 1000000;
    if (s.includes("K")) return num * 1000;
    return num;
  };
  return [...ALL_COURSES].sort((a, b) => studentCount(b.students) - studentCount(a.students)).slice(0, 4);
}
