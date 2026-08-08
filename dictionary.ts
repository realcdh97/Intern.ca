export type Language =
  | "en"
  | "fr"
  | "zh"
  | "es"
  | "hi"
  | "pt"
  | "bn"
  | "ru"
  | "ja"
  | "pa"
  | "tr";

export const localizedLanguageNames: Record<Language, Record<Language, string>> = {
  en: {
    en: "English",
    fr: "French",
    zh: "Mandarin (Chinese)",
    es: "Spanish",
    hi: "Hindi",
    pt: "Portuguese",
    bn: "Bengali",
    ru: "Russian",
    ja: "Japanese",
    pa: "Punjabi",
    tr: "Turkish"
  },
  fr: {
    en: "Anglais",
    fr: "Français",
    zh: "Mandarin (Chinois)",
    es: "Espagnol",
    hi: "Hindi",
    pt: "Portugais",
    bn: "Bengali",
    ru: "Russe",
    ja: "Japonais",
    pa: "Pendjabi",
    tr: "Turc"
  },
  zh: {
    en: "英语 (English)",
    fr: "法语 (French)",
    zh: "中文 (Mandarin)",
    es: "西班牙语 (Spanish)",
    hi: "印地语 (Hindi)",
    pt: "葡萄牙语 (Portuguese)",
    bn: "孟加拉语 (Bengali)",
    ru: "俄语 (Russian)",
    ja: "日语 (Japanese)",
    pa: "旁遮普语 (Punjabi)",
    tr: "土耳其语 (Turkish)"
  },
  es: {
    en: "Inglés",
    fr: "Francés",
    zh: "Mandarín (Chino)",
    es: "Español",
    hi: "Hindi",
    pt: "Portugués",
    bn: "Bengalí",
    ru: "Ruso",
    ja: "Japonés",
    pa: "Punyabí",
    tr: "Turco"
  },
  hi: {
    en: "अंग्रेजी (English)",
    fr: "फ्रांसीसी (French)",
    zh: "मंदारिन (Mandarin)",
    es: "स्पैनिश (Spanish)",
    hi: "हिन्दी (Hindi)",
    pt: "पुर्तगाली (Portuguese)",
    bn: "बंगाली (Bengali)",
    ru: "रूसी (Russian)",
    ja: "जापानी (Japanese)",
    pa: "पंजाबी (Punjabi)",
    tr: "तुर्की (Turkish)"
  },
  pt: {
    en: "Inglês",
    fr: "Francês",
    zh: "Mandarim (Chinês)",
    es: "Espanhol",
    hi: "Híndi",
    pt: "Português",
    bn: "Bengali",
    ru: "Russo",
    ja: "Japonês",
    pa: "Panjabi",
    tr: "Turco"
  },
  bn: {
    en: "ইংরেজি (English)",
    fr: "ফরাসি (French)",
    zh: "ম্যান্ডারিন (Mandarin)",
    es: "স্প্যানিশ (Spanish)",
    hi: "হিন্দি (Hindi)",
    pt: "পর্তুগিজ (Portuguese)",
    bn: "বাংলা (Bengali)",
    ru: "রাশিয়ান (Russian)",
    ja: "জাপানি (Japanese)",
    pa: "পাঞ্জাবি (Punjabi)",
    tr: "তুর্কি (Turkish)"
  },
  ru: {
    en: "Английский",
    fr: "Французский",
    zh: "Китайский (Мандарин)",
    es: "Испанский",
    hi: "Хинди",
    pt: "Португальский",
    bn: "Бенгальский",
    ru: "Русский",
    ja: "Японский",
    pa: "Пенджаби",
    tr: "Турецкий"
  },
  ja: {
    en: "英語 (English)",
    fr: "フランス語 (French)",
    zh: "中国語 (Mandarin)",
    es: "スペイン語 (Spanish)",
    hi: "ヒンディー語 (Hindi)",
    pt: "ポルトガル語 (Portuguese)",
    bn: "ベンガル語 (Bengali)",
    ru: "ロシア語 (Russian)",
    ja: "日本語 (Japanese)",
    pa: "パンジャブ語 (Punjabi)",
    tr: "トルコ語 (Turkish)"
  },
  pa: {
    en: "ਅੰਗਰੇਜ਼ੀ (English)",
    fr: "ਫ੍ਰੈਂਚ (French)",
    zh: "ਮੈਂਡਰਿਨ (Mandarin)",
    es: "ਸਪੈਨਿਸ਼ (Spanish)",
    hi: "ਹਿੰਦੀ (Hindi)",
    pt: "ਪੁਰਤਗਾਲੀ (Portuguese)",
    bn: "ਬੰਗਾਲੀ (Bengali)",
    ru: "ਰੂਸੀ (Russian)",
    ja: "ਜਾਪਾਨੀ (Japanese)",
    pa: "ਪੰਜਾਬੀ (Punjabi)",
    tr: "ਤੁਰਕੀ (Turkish)"
  },
  tr: {
    en: "İngilizce",
    fr: "Fransızca",
    zh: "Çince (Mandarin)",
    es: "İspanyolca",
    hi: "Hintçe",
    pt: "Portekizce",
    bn: "Bengalce",
    ru: "Rusça",
    ja: "Japonca",
    pa: "Pencapça",
    tr: "Türkçe"
  }
};

export const languageFlags: Record<Language, string> = {
  en: "/flags/gb.svg",
  fr: "/flags/fr.svg",
  zh: "/flags/cn.svg",
  es: "/flags/es.svg",
  hi: "/flags/in.svg",
  pt: "/flags/pt.svg",
  bn: "/flags/bd.svg",
  ru: "/flags/ru.svg",
  ja: "/flags/jp.svg",
  pa: "/flags/in.svg",
  tr: "/flags/tr.svg"
};

export const translations = {
  en: {
    // Navbar
    navJobs: "Jobs",
    navCompanies: "Companies",
    navEvents: "Events",
    navMessages: "Messages",
    navDashboard: "Dashboard",
    navSignOut: "Sign Out",
    navLogIn: "Log In",
    navSignUpFree: "Sign Up Free",

    // Select Role
    roleTitle: "Choose your role",
    roleSubtitle: "Tell us how you'll use Intern.ca",
    roleStudent: "Student",
    roleStudentDesc: "Browse and apply for internships worldwide",
    roleCompany: "Company / Employer",
    roleCompanyDesc: "Post jobs and find international talent",
    roleSchool: "Partner School",
    roleSchoolDesc: "Connect your students with opportunities",
    roleContinue: "Continue",
    roleSettingUp: "Setting up...",

    // Hero Section
    heroBuiltFor: "Built for the global student",
    heroTitleStart: "Your career starts",
    heroTitleEnd: "beyond borders",
    heroDescription: "Intern.ca connects students and recent graduates outside the US with internships and entry-level roles at top companies across Europe, Asia, Africa, and Latin America.",
    heroSearchPlaceholder: "Search jobs, companies, or locations...",
    heroSearchBtn: "Search",
    heroStatsJobs: "jobs posted",
    heroStatsCompanies: "companies",
    heroStatsCountries: "countries",

    // Auth & Messages
    authWelcome: "Welcome back",
    authEnterEmail: "Enter your email to sign in to your account",
    authEmail: "Email Address",
    authPassword: "Password",
    authNoAccount: "Don't have an account?",
    authHaveAccount: "Already have an account?",
    authCreateAccount: "Create an account",
    authSignUpTitle: "Get started with Intern.ca",
    authFullName: "Full Name",
    authSelectRoleFirst: "Please select a role first",
  },
  fr: {
    // Navbar
    navJobs: "Emplois",
    navCompanies: "Entreprises",
    navEvents: "Événements",
    navMessages: "Messages",
    navDashboard: "Tableau de bord",
    navSignOut: "Déconnexion",
    navLogIn: "Connexion",
    navSignUpFree: "S'inscrire gratuitement",

    // Select Role
    roleTitle: "Choisissez votre rôle",
    roleSubtitle: "Dites-nous comment vous utiliserez Intern.ca",
    roleStudent: "Étudiant",
    roleStudentDesc: "Parcourir et postuler à des stages dans le monde entier",
    roleCompany: "Entreprise / Employeur",
    roleCompanyDesc: "Publier des offres et trouver des talents internationaux",
    roleSchool: "École partenaire",
    roleSchoolDesc: "Connecter vos étudiants avec des opportunités",
    roleContinue: "Continuer",
    roleSettingUp: "Configuration...",

    // Hero Section
    heroBuiltFor: "Conçu pour l'étudiant du monde",
    heroTitleStart: "Votre carrière commence",
    heroTitleEnd: "au-delà des frontières",
    heroDescription: "Intern.ca met en relation les étudiants et diplômés récents en dehors des États-Unis avec des stages et des postes de premier échelon dans de grandes entreprises en Europe, Asie, Afrique et Amérique latine.",
    heroSearchPlaceholder: "Rechercher des emplois, des entreprises ou des lieux...",
    heroSearchBtn: "Rechercher",
    heroStatsJobs: "emplois publiés",
    heroStatsCompanies: "entreprises",
    heroStatsCountries: "pays",

    // Auth & Messages
    authWelcome: "Bon retour",
    authEnterEmail: "Entrez votre email pour vous connecter à votre compte",
    authEmail: "Adresse e-mail",
    authPassword: "Mot de passe",
    authNoAccount: "Vous n'avez pas de compte ?",
    authHaveAccount: "Vous avez déjà un compte ?",
    authCreateAccount: "Créer un compte",
    authSignUpTitle: "Commencer avec Intern.ca",
    authFullName: "Nom complet",
    authSelectRoleFirst: "Veuillez d'abord sélectionner un rôle",
  },
  zh: {
    // Navbar
    navJobs: "工作",
    navCompanies: "公司",
    navEvents: "活动",
    navMessages: "消息",
    navDashboard: "仪表板",
    navSignOut: "登出",
    navLogIn: "登录",
    navSignUpFree: "免费注册",

    // Select Role
    roleTitle: "选择您的角色",
    roleSubtitle: "告诉我们您将如何使用 Intern.ca",
    roleStudent: "学生",
    roleStudentDesc: "浏览并申请全球实习机会",
    roleCompany: "公司/雇主",
    roleCompanyDesc: "发布职位并寻找国际人才",
    roleSchool: "合作学校",
    roleSchoolDesc: "为您的学生对接机会",
    roleContinue: "继续",
    roleSettingUp: "设置中...",

    // Hero Section
    heroBuiltFor: "专为全球学生打造",
    heroTitleStart: "您的职业生涯",
    heroTitleEnd: "从跨越国界开始",
    heroDescription: "Intern.ca 为美国境外的学生和应届毕业生提供与欧洲、亚洲、非洲和拉丁美洲顶尖公司的实习和初级职位的对接渠道。",
    heroSearchPlaceholder: "搜索职位、公司或地点...",
    heroSearchBtn: "搜索",
    heroStatsJobs: "已发布职位",
    heroStatsCompanies: "家公司",
    heroStatsCountries: "个国家",

    // Auth & Messages
    authWelcome: "欢迎回来",
    authEnterEmail: "输入您的邮箱以登录您的帐户",
    authEmail: "电子邮箱",
    authPassword: "密码",
    authNoAccount: "没有帐户？",
    authHaveAccount: "已有帐户？",
    authCreateAccount: "创建帐户",
    authSignUpTitle: "开始使用 Intern.ca",
    authFullName: "全名",
    authSelectRoleFirst: "请先选择一个角色",
  },
  es: {
    // Navbar
    navJobs: "Empleos",
    navCompanies: "Empresas",
    navEvents: "Eventos",
    navMessages: "Mensajes",
    navDashboard: "Panel",
    navSignOut: "Cerrar sesión",
    navLogIn: "Iniciar sesión",
    navSignUpFree: "Regístrate gratis",

    // Select Role
    roleTitle: "Elige tu rol",
    roleSubtitle: "Cuéntanos cómo usarás Intern.ca",
    roleStudent: "Estudiante",
    roleStudentDesc: "Explora y postula a pasantías en todo el mundo",
    roleCompany: "Empresa / Empleador",
    roleCompanyDesc: "Publica empleos y encuentra talento internacional",
    roleSchool: "Universidad aliada",
    roleSchoolDesc: "Conecta a tus estudiantes con oportunidades",
    roleContinue: "Continuar",
    roleSettingUp: "Configurando...",

    // Hero Section
    heroBuiltFor: "Creado para el estudiante global",
    heroTitleStart: "Tu carrera comienza",
    heroTitleEnd: "más allá de las fronteras",
    heroDescription: "Intern.ca conecta a estudiantes y recién graduados fuera de EE. UU. con pasantías y puestos iniciales en empresas líderes en Europa, Asia, África y América Latina.",
    heroSearchPlaceholder: "Buscar empleos, empresas o ubicaciones...",
    heroSearchBtn: "Buscar",
    heroStatsJobs: "empleos publicados",
    heroStatsCompanies: "empresas",
    heroStatsCountries: "países",

    // Auth & Messages
    authWelcome: "Bienvenido de nuevo",
    authEnterEmail: "Ingresa tu correo para acceder a tu cuenta",
    authEmail: "Correo electrónico",
    authPassword: "Contraseña",
    authNoAccount: "¿No tienes una cuenta?",
    authHaveAccount: "¿Ya tienes una cuenta?",
    authCreateAccount: "Crear una cuenta",
    authSignUpTitle: "Comienza con Intern.ca",
    authFullName: "Nombre completo",
    authSelectRoleFirst: "Por favor, selecciona un rol primero",
  },
  hi: {
    // Navbar
    navJobs: "नौकरियां",
    navCompanies: "कंपनियां",
    navEvents: "इवेंट्स",
    navMessages: "संदेश",
    navDashboard: "डैशबोर्ड",
    navSignOut: "लॉग आउट",
    navLogIn: "लॉग इन",
    navSignUpFree: "मुफ़्त साइन अप करें",

    // Select Role
    roleTitle: "अपनी भूमिका चुनें",
    roleSubtitle: "हमें बताएं कि आप Intern.ca का उपयोग कैसे करेंगे",
    roleStudent: "छात्र",
    roleStudentDesc: "दुनिया भर में इंटर्नशिप खोजें और आवेदन करें",
    roleCompany: "कंपनी / नियोक्ता",
    roleCompanyDesc: "नौकरियां पोस्ट करें और अंतर्राष्ट्रीय प्रतिभाएं खोजें",
    roleSchool: "साझेदार स्कूल",
    roleSchoolDesc: "अपने छात्रों को अवसरों से जोड़ें",
    roleContinue: "जारी रखें",
    roleSettingUp: "सेटअप हो रहा है...",

    // Hero Section
    heroBuiltFor: "वैश्विक छात्रों के लिए निर्मित",
    heroTitleStart: "आपका करियर",
    heroTitleEnd: "सीमाओं के पार शुरू होता है",
    heroDescription: "Intern.ca अमेरिका से बाहर के छात्रों और हाल के स्नातकों को यूरोप, एशिया, अफ्रीका और लाटिन अमेरिका की शीर्ष कंपनियों में इंटर्नशिप और शुरुआती स्तर की भूमिकाओं से जोड़ता है।",
    heroSearchPlaceholder: "नौकरियां, कंपनियां या स्थान खोजें...",
    heroSearchBtn: "खोजें",
    heroStatsJobs: "पोस्ट की गई नौकरियां",
    heroStatsCompanies: "कंपनियां",
    heroStatsCountries: "देश",

    // Auth & Messages
    authWelcome: "वापसी पर स्वागत है",
    authEnterEmail: "अपने खाते में साइन इन करने के लिए अपना ईमेल दर्ज करें",
    authEmail: "ईमेल पता",
    authPassword: "पासवर्ड",
    authNoAccount: "खाता नहीं है?",
    authHaveAccount: "पहले से ही एक खाता है?",
    authCreateAccount: "खाता बनाएं",
    authSignUpTitle: "Intern.ca के साथ शुरुआत करें",
    authFullName: "पूरा नाम",
    authSelectRoleFirst: "कृपया पहले एक भूमिका चुनें",
  },
  pt: {
    // Navbar
    navJobs: "Vagas",
    navCompanies: "Empresas",
    navEvents: "Eventos",
    navMessages: "Mensagens",
    navDashboard: "Painel",
    navSignOut: "Sair",
    navLogIn: "Entrar",
    navSignUpFree: "Cadastre-se grátis",

    // Select Role
    roleTitle: "Escolha o seu papel",
    roleSubtitle: "Diga-nos como você usará o Intern.ca",
    roleStudent: "Estudante",
    roleStudentDesc: "Navegue e candidate-se a estágios em todo o mundo",
    roleCompany: "Empresa / Empregador",
    roleCompanyDesc: "Publique vagas e encontre talentos internacionais",
    roleSchool: "Escola parceira",
    roleSchoolDesc: "Conecte seus alunos com oportunidades",
    roleContinue: "Continuar",
    roleSettingUp: "Configurando...",

    // Hero Section
    heroBuiltFor: "Feito para o estudante global",
    heroTitleStart: "Sua carreira começa",
    heroTitleEnd: "além das fronteiras",
    heroDescription: "O Intern.ca conecta estudantes e recém-formados fora dos EUA com estágios e cargos de nível inicial em grandes empresas na Europa, Ásia, África e América Latina.",
    heroSearchPlaceholder: "Buscar vagas, empresas ou locais...",
    heroSearchBtn: "Buscar",
    heroStatsJobs: "vagas publicadas",
    heroStatsCompanies: "empresas",
    heroStatsCountries: "países",

    // Auth & Messages
    authWelcome: "Bem-vindo de volta",
    authEnterEmail: "Insira seu e-mail para entrar na sua conta",
    authEmail: "Endereço de e-mail",
    authPassword: "Senha",
    authNoAccount: "Não tem uma conta?",
    authHaveAccount: "Já tem uma conta?",
    authCreateAccount: "Criar uma conta",
    authSignUpTitle: "Comece a usar o Intern.ca",
    authFullName: "Nome completo",
    authSelectRoleFirst: "Por favor, selecione uma função primeiro",
  },
  bn: {
    // Navbar
    navJobs: "চাকরি",
    navCompanies: "প্রতিষ্ঠান",
    navEvents: "ইভেন্ট",
    navMessages: "বার্তা",
    navDashboard: "ড্যাশবোর্ড",
    navSignOut: "সাইন আউট",
    navLogIn: "লগ ইন",
    navSignUpFree: "ফ্রি সাইন আপ",

    // Select Role
    roleTitle: "আপনার ভূমিকা নির্বাচন করুন",
    roleSubtitle: "আপনি কীভাবে Intern.ca ব্যবহার করবেন তা আমাদের জানান",
    roleStudent: "শিক্ষার্থী",
    roleStudentDesc: "বিশ্বজুড়ে ইন্টার্নশিপ খুঁজুন এবং আবেদন করুন",
    roleCompany: "কোম্পানি / নিয়োগকর্তা",
    roleCompanyDesc: "চাকরি পোস্ট করুন এবং আন্তর্জাতিক প্রতিভা খুঁজুন",
    roleSchool: "অংশীদার স্কুল",
    roleSchoolDesc: "আপনার শিক্ষার্থীদের সুযোগের সাথে সংযুক্ত করুন",
    roleContinue: "চলুন",
    roleSettingUp: "সেটআপ হচ্ছে...",

    // Hero Section
    heroBuiltFor: "বিশ্বব্যাপী শিক্ষার্থীদের জন্য তৈরি",
    heroTitleStart: "আপনার ক্যারিয়ার শুরু হয়",
    heroTitleEnd: "সীমানা ছাড়িয়ে",
    heroDescription: "Intern.ca মার্কিন যুক্তরাষ্ট্রের বাইরের শিক্ষার্থীদের এবং নতুন স্নাতকদের ইউরোপ, এশিয়া, আফ্রিকা এবং ল্যাটিন আমেরিকার শীর্ষস্থানীয় কোম্পানিগুলিতে ইন্টার্নশিপ এবং প্রবেশ-স্তরের ভূমিকাগুলির সাথে সংযুক্ত করে।",
    heroSearchPlaceholder: "চাকরি, কোম্পানি বা অবস্থান অনুসন্ধান করুন...",
    heroSearchBtn: "খুজুন",
    heroStatsJobs: "পোস্ট করা চাকরি",
    heroStatsCompanies: "প্রতিষ্ঠান",
    heroStatsCountries: "দেশ",

    // Auth & Messages
    authWelcome: "আবার স্বাগতম",
    authEnterEmail: "আপনার অ্যাকাউন্টে সাইন ইন করতে আপনার ইমেল লিখুন",
    authEmail: "ইমেল ঠিকানা",
    authPassword: "পাসওয়ার্ড",
    authNoAccount: "অ্যাকাউন্ট নেই?",
    authHaveAccount: "ইতিমধ্যে একটি অ্যাকাউন্ট আছে?",
    authCreateAccount: "অ্যাকাউন্ট তৈরি করুন",
    authSignUpTitle: "Intern.ca দিয়ে শুরু করুন",
    authFullName: "পূর্ণ নাম",
    authSelectRoleFirst: "অনুগ্রহ করে প্রথমে একটি ভূমিকা নির্বাচন করুন",
  },
  ru: {
    // Navbar
    navJobs: "Вакансии",
    navCompanies: "Компании",
    navEvents: "События",
    navMessages: "Сообщения",
    navDashboard: "Панель",
    navSignOut: "Выйти",
    navLogIn: "Войти",
    navSignUpFree: "Регистрация",

    // Select Role
    roleTitle: "Выберите вашу роль",
    roleSubtitle: "Расскажите, как вы будете использовать Intern.ca",
    roleStudent: "Студент",
    roleStudentDesc: "Ищите стажировки и подавайте заявки по всему миру",
    roleCompany: "Компания / Работодатель",
    roleCompanyDesc: "Размещайте вакансии и находите международные таланты",
    roleSchool: "ВУЗ-партнер",
    roleSchoolDesc: "Связывайте ваших студентов с возможностями",
    roleContinue: "Продолжить",
    roleSettingUp: "Настройка...",

    // Hero Section
    heroBuiltFor: "Создано для студентов со всего мира",
    heroTitleStart: "Ваша карьера начинается",
    heroTitleEnd: "вне границ",
    heroDescription: "Intern.ca связывает студентов и выпускников за пределами США со стажировками и вакансиями начального уровня в ведущих компаниях Европы, Азии, Африки и Латинской Америки.",
    heroSearchPlaceholder: "Поиск вакансий, компаний или городов...",
    heroSearchBtn: "Найти",
    heroStatsJobs: "размещенных вакансий",
    heroStatsCompanies: "компаний",
    heroStatsCountries: "стран",

    // Auth & Messages
    authWelcome: "С возвращением",
    authEnterEmail: "Введите ваш email для входа",
    authEmail: "Электронная почта",
    authPassword: "Пароль",
    authNoAccount: "Нет аккаунта?",
    authHaveAccount: "Уже есть аккаунт?",
    authCreateAccount: "Создать аккаунт",
    authSignUpTitle: "Начните работу с Intern.ca",
    authFullName: "Полное имя",
    authSelectRoleFirst: "Пожалуйста, сначала выберите роль",
  },
  ja: {
    // Navbar
    navJobs: "求人",
    navCompanies: "企業",
    navEvents: "イベント",
    navMessages: "メッセージ",
    navDashboard: "ダッシュボード",
    navSignOut: "ログアウト",
    navLogIn: "ログイン",
    navSignUpFree: "無料会員登録",

    // Select Role
    roleTitle: "役割を選択してください",
    roleSubtitle: "Intern.caの利用目的を教えてください",
    roleStudent: "学生",
    roleStudentDesc: "世界中のインターンシップを検索・応募",
    roleCompany: "企業・採用担当者",
    roleCompanyDesc: "求人掲載とグローバル人材の獲得",
    roleSchool: "提携校",
    roleSchoolDesc: "学生とキャリア機会をマッチング",
    roleContinue: "次へ",
    roleSettingUp: "設定中...",

    // Hero Section
    heroBuiltFor: "グローバル学生向け",
    heroTitleStart: "国境を越えて",
    heroTitleEnd: "キャリアをスタート",
    heroDescription: "Intern.caは、米国外の学生や新卒者と、ヨーロッパ、アジア、アフリカ、ラテンアメリカなどのトップ企業のインターンやエントリーレベルの求人を結びつけます。",
    heroSearchPlaceholder: "求人、企業、勤務地を検索...",
    heroSearchBtn: "検索",
    heroStatsJobs: "件の求人掲載",
    heroStatsCompanies: "社以上の企業",
    heroStatsCountries: "カ国以上",

    // Auth & Messages
    authWelcome: "おかえりなさい",
    authEnterEmail: "メールアドレスを入力してログインしてください",
    authEmail: "メールアドレス",
    authPassword: "パスワード",
    authNoAccount: "アカウントをお持ちでない方",
    authHaveAccount: "既にアカウントをお持ちの方",
    authCreateAccount: "アカウント作成",
    authSignUpTitle: "Intern.ca を始める",
    authFullName: "氏名",
    authSelectRoleFirst: "最初に役割を選択してください",
  },
  pa: {
    // Navbar
    navJobs: "ਨੌਕਰੀਆਂ",
    navCompanies: "ਕੰਪਨੀਆਂ",
    navEvents: "ਈਵੈਂਟਸ",
    navMessages: "ਸੁਨੇਹੇ",
    navDashboard: "ਡੈਸ਼ਬੋਰਡ",
    navSignOut: "ਲੌਗ ਆਉਟ",
    navLogIn: "ਲੌਗ ਇਨ",
    navSignUpFree: "ਮੁਫਤ ਸਾਈਨ ਅਪ ਕਰੋ",

    // Select Role
    roleTitle: "ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ",
    roleSubtitle: "ਸਾਨੂੰ ਦੱਸੋ ਕਿ ਤੁਸੀਂ Intern.ca ਦੀ ਵਰਤੋਂ ਕਿਵੇਂ ਕਰੋਗੇ",
    roleStudent: "ਵਿਦਿਆਰਥੀ",
    roleStudentDesc: "ਦੁਨੀਆ ਭਰ ਵਿੱਚ ਇੰਟਰਨਸ਼ਿਪਸ ਖੋਜੋ ਅਤੇ ਅਪਲਾਈ ਕਰੋ",
    roleCompany: "ਕੰਪਨੀ / ਨਿਯੋਕਤਾ",
    roleCompanyDesc: "ਨੌਕਰੀਆਂ ਪੋਸਟ ਕਰੋ ਅਤੇ ਅੰਤਰਰਾਸ਼ਟਰੀ ਪ੍ਰਤਿਭਾਵਾਂ ਲੱਭੋ",
    roleSchool: "ਸਾਂਝੇਦਾਰ ਸਕੂਲ",
    roleSchoolDesc: "ਆਪਣੇ ਵਿਦਿਆਰਥੀਆਂ ਨੂੰ ਮੌਕਿਆਂ ਨਾਲ ਜੋੜੋ",
    roleContinue: "ਜਾਰী ਰੱਖੋ",
    roleSettingUp: "ਸੈੱਟਅੱਪ ਹੋ ਰਿਹਾ ਹੈ...",

    // Hero Section
    heroBuiltFor: "ਗਲੋਬਲ ਵਿਦਿਆਰਥੀਆਂ ਲਈ ਬਣਾਇਆ ਗਿਆ",
    heroTitleStart: "ਤੁਹਾਡਾ ਕਰੀਅਰ",
    heroTitleEnd: "ਸਰਹੱਦਾਂ ਤੋਂ ਪਾਰ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ",
    heroDescription: "Intern.ca ਅਮਰੀਕਾ ਤੋਂ ਬਾਹਰ ਦੇ ਵਿਦਿਆਰਥੀਆਂ ਅਤੇ ਹਾਲ ਹੀ ਦੇ ਗ੍ਰੈਜੂਏਟਾਂ ਨੂੰ ਯੂਰਪ, ਏਸ਼ੀਆ, ਅਫਰੀਕਾ ਅਤੇ ਲਾਤੀਨੀ ਅਮਰੀਕਾ ਦੀਆਂ ਪ੍ਰਮੁੱਖ ਕੰਪਨੀਆਂ ਵਿੱਚ ਇੰਟਰਨਸ਼ਿпਾਂ ਅਤੇ ਸ਼ੁਰੂਆਤੀ ਪੱਧਰ ਦੀਆਂ ਭੂਮਿਕਾਵਾਂ ਨਾਲ ਜੋੜਦਾ ਹੈ।",
    heroSearchPlaceholder: "ਨੌਕਰੀਆਂ, ਕੰਪਨੀਆਂ ਜਾਂ ਸਥਾਨ ਖੋਜੋ...",
    heroSearchBtn: "ਖੋਜੋ",
    heroStatsJobs: "ਪੋਸਟ ਕੀਤੀਆਂ ਨੌਕਰੀਆਂ",
    heroStatsCompanies: "ਕੰਪਨੀਆਂ",
    heroStatsCountries: "ਦੇਸ਼",

    // Auth & Messages
    authWelcome: "ਜੀ ਆਇਆਂ ਨੂੰ",
    authEnterEmail: "ਆਪਣੇ ਖਾਤੇ ਵਿੱਚ ਸਾਈਨ ਇਨ ਕਰਨ ਲਈ ਆਪਣੀ ਈਮੇਲ ਦਰਜ ਕਰੋ",
    authEmail: "ਈਮੇਲ ਪਤਾ",
    authPassword: "ਪਾਸਵਰਡ",
    authNoAccount: "ਖਾਤਾ ਨਹੀਂ ਹੈ?",
    authHaveAccount: "ਪਹਿਲਾਂ ਹੀ ਖਾਤਾ ਹੈ?",
    authCreateAccount: "ਖਾਤਾ ਬਣਾਓ",
    authSignUpTitle: "Intern.ca ਨਾਲ ਸ਼ੁਰੂਆਤ ਕਰੋ",
    authFullName: "ਪੂਰਾ ਨਾਮ",
    authSelectRoleFirst: "ਕਿਰਪਾ ਕਰਕੇ ਪਹਿਲਾਂ ਇੱਕ ਭੂਮਿਕਾ ਚੁਣੋ",
  },
  tr: {
    // Navbar
    navJobs: "İş İlanları",
    navCompanies: "Şirketler",
    navEvents: "Etkinlikler",
    navMessages: "Mesajlar",
    navDashboard: "Panel",
    navSignOut: "Çıkış Yap",
    navLogIn: "Giriş Yap",
    navSignUpFree: "Ücretsiz Kaydol",

    // Select Role
    roleTitle: "Rolünüzü seçin",
    roleSubtitle: "Intern.ca'yı nasıl kullanacağınızı bize bildirin",
    roleStudent: "Öğrenci",
    roleStudentDesc: "Dünya çapındaki stajları inceleyin ve başvurun",
    roleCompany: "Şirket / İşveren",
    roleCompanyDesc: "İş ilanları yayınlayın ve uluslararası yetenekleri bulun",
    roleSchool: "Partner Okul",
    roleSchoolDesc: "Öğrencilerinizi fırsatlarla buluşturun",
    roleContinue: "Devam Et",
    roleSettingUp: "Ayarlanıyor...",

    // Hero Section
    heroBuiltFor: "Küresel öğrenciler için tasarlandı",
    heroTitleStart: "Kariyeriniz",
    heroTitleEnd: "sınırların ötesinde başlar",
    heroDescription: "Intern.ca, ABD dışındaki öğrencileri ve yeni mezunları Avrupa, Asya, Afrika ve Latin Amerika'daki lider şirketlerdeki staj ve giriş seviyesi rollerle buluşturur.",
    heroSearchPlaceholder: "İş, şirket veya konum arayın...",
    heroSearchBtn: "Ara",
    heroStatsJobs: "yayınlanan ilan",
    heroStatsCompanies: "şirket",
    heroStatsCountries: "ülke",

    // Auth & Messages
    authWelcome: "Tekrar hoş geldiniz",
    authEnterEmail: "Hesabınıza giriş yapmak için e-postanızı girin",
    authEmail: "E-posta Adresi",
    authPassword: "Şifre",
    authNoAccount: "Hesabınız yok mu?",
    authHaveAccount: "Zaten bir hesabınız var mı?",
    authCreateAccount: "Hesap oluştur",
    authSignUpTitle: "Intern.ca ile başlayın",
    authFullName: "Ad Soyad",
    authSelectRoleFirst: "Lütfen önce bir rol seçin",
  }
};

export type TranslationKey = keyof typeof translations.en;
