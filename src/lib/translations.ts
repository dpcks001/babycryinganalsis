export type Language = 'ko' | 'en' | 'ja' | 'zh' | 'es';

export const translations = {
  ko: {
    // Bottom Navigation
    home: '홈',
    history: '히스토리',
    settings: '설정',
    
    // Home Page
    appTitle: 'BabyCry Analyzer',
    recordButton: '녹음 시작',
    recentAnalysis: '최근 분석',
    noRecentData: '버튼을 눌러 울음소리를 들려주세요',
    
    // Processing Page
    analyzing: '분석 중...',
    processingMessage: '아기의 울음소리를 분석하고 있어요',
    cancel: '취소',
    
    // Result Page
    analysisResult: '분석 결과',
    checkSolution: '대처 방법 확인하기',
    solutionDialogTitle: '대처 방법',
    solutionDialogDescription: '에 대한 대처 방법',
    hungry: '배고파요',
    sleepy: '졸려요',
    uncomfortable: '불편해요',
    pain: '아파요',
    hungrySolution: '수유 시간을 확인하고 분유나 모유를 주세요. 충분한 양을 먹었는지 확인하세요.',
    sleepySolution: '조용하고 어두운 환경을 만들어주세요. 부드럽게 토닥이며 재워주세요.',
    uncomfortableSolution: '기저귀 상태를 확인하고 교체해주세요. 실내 온도가 적절한지 확인하세요.',
    painSolution: '아기의 몸 상태를 확인하세요. 증상이 지속되면 병원 방문을 권장합니다.',
    close: '닫기',
    isThisCorrect: '이 분석이 맞나요?',
    yes: '맞아요',
    no: '아니에요',
    selectCorrectOption: '올바른 상태를 선택해주세요',
    saved: '저장되었습니다',
    solutionMethods: '대응 방법',
    months: '개월',
    
    // Statistics Page
    cryHistory: '울음 히스토리',
    today: '오늘',
    thisWeek: '이번 주',
    thisMonth: '이번달',
    totalCries: '총 울음 횟수',
    times: '회',
    cryTypes: '울음 유형',
    recentRecords: '최근 기록',
    
    // Settings Page
    settingsTitle: '설정',
    accountManagement: '계정 관리',
    profileDialogTitle: '프로필 편집',
    profileDialogDescription: '프로필 정보를 수정하세요',
    name: '이름',
    email: '이메일',
    save: '저장',
    
    // Notifications
    notifications: '알림',
    pushNotification: '푸시 알림',
    
    // Baby Info
    babyInfo: '아기 정보',
    babyName: '아기 이름',
    enterName: '이름을 입력하세요',
    gender: '성별',
    male: '남자',
    female: '여자',
    birthDate: '생년월일',
    selectDate: '날짜를 선택하세요',
    confirm: '확인',
    
    // Data
    data: '데이터',
    cloudSync: '클라우드에 데이터 저장',
    
    // Display
    display: '화면',
    theme: '테마',
    system: '시스템',
    light: '라이트',
    dark: '다크',
    
    // App Info
    appInfo: '앱 정보',
    version: '버전',
    termsOfService: '서비스 이용약관',
    privacyPolicy: '개인정보 처리방침',
  },
  en: {
    // Bottom Navigation
    home: 'Home',
    history: 'History',
    settings: 'Settings',
    
    // Home Page
    appTitle: 'BabyCry Analyzer',
    recordButton: 'Start Recording',
    recentAnalysis: 'Recent Analysis',
    noRecentData: 'Press the button to let me hear the cry',
    
    // Processing Page
    analyzing: 'Analyzing...',
    processingMessage: 'Analyzing baby\'s cry',
    cancel: 'Cancel',
    
    // Result Page
    analysisResult: 'Analysis Result',
    checkSolution: 'Check Solution',
    solutionDialogTitle: 'Solution',
    solutionDialogDescription: 'Solution for',
    hungry: 'Hungry',
    sleepy: 'Sleepy',
    uncomfortable: 'Uncomfortable',
    pain: 'Pain',
    hungrySolution: 'Check feeding time and provide milk. Ensure sufficient amount.',
    sleepySolution: 'Create a quiet and dark environment. Gently pat to sleep.',
    uncomfortableSolution: 'Check and change diaper. Verify room temperature is appropriate.',
    painSolution: 'Check baby\'s condition. Visit doctor if symptoms persist.',
    close: 'Close',
    isThisCorrect: 'Is this analysis correct?',
    yes: 'Yes',
    no: 'No',
    selectCorrectOption: 'Please select the correct state',
    saved: 'Saved',
    solutionMethods: 'Solution Methods',
    months: 'months',
    
    // Statistics Page
    cryHistory: 'Cry History',
    today: 'Today',
    thisWeek: 'This Week',
    thisMonth: 'This Month',
    totalCries: 'Total Cries',
    times: 'times',
    cryTypes: 'Cry Types',
    recentRecords: 'Recent Records',
    
    // Settings Page
    settingsTitle: 'Settings',
    accountManagement: 'Account',
    profileDialogTitle: 'Edit Profile',
    profileDialogDescription: 'Update your profile information',
    name: 'Name',
    email: 'Email',
    save: 'Save',
    
    // Notifications
    notifications: 'Notifications',
    pushNotification: 'Push Notification',
    
    // Baby Info
    babyInfo: 'Baby Info',
    babyName: 'Baby Name',
    enterName: 'Enter name',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    birthDate: 'Birth Date',
    selectDate: 'Select date',
    confirm: 'Confirm',
    
    // Data
    data: 'Data',
    cloudSync: 'Save data to cloud',
    
    // Display
    display: 'Display',
    theme: 'Theme',
    system: 'System',
    light: 'Light',
    dark: 'Dark',
    
    // App Info
    appInfo: 'App Info',
    version: 'Version',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
  },
  ja: {
    // Bottom Navigation
    home: 'ホーム',
    history: '履歴',
    settings: '設定',
    
    // Home Page
    appTitle: 'BabyCry Analyzer',
    recordButton: '録音開始',
    recentAnalysis: '最近の分析',
    noRecentData: 'ボタンを押して泣き声を聞かせてください',
    
    // Processing Page
    analyzing: '分析中...',
    processingMessage: '赤ちゃんの泣き声を分析しています',
    cancel: 'キャンセル',
    
    // Result Page
    analysisResult: '分析結果',
    checkSolution: '対処方法を確認',
    solutionDialogTitle: '対処方法',
    solutionDialogDescription: 'の対処方法',
    hungry: 'お腹が空いた',
    sleepy: '眠い',
    uncomfortable: '不快',
    pain: '痛い',
    hungrySolution: '授乳時間を確認してミルクを与えてください。十分な量を飲んだか確認してください。',
    sleepySolution: '静かで暗い環境を作ってください。優しく背中をたたいて寝かしつけてください。',
    uncomfortableSolution: 'おむつの状態を確認して交換してください。室温が適切か確認してください。',
    painSolution: '赤ちゃんの体調を確認してください。症状が続く場合は病院を受診してください。',
    close: '閉じる',
    isThisCorrect: 'この分析は正しいですか？',
    yes: 'はい',
    no: 'いいえ',
    selectCorrectOption: '正しい状態を選択してください',
    saved: '保存されました',
    solutionMethods: '対処方法',
    months: 'ヶ月',
    
    // Statistics Page
    cryHistory: '泣き声履歴',
    today: '今日',
    thisWeek: '今週',
    thisMonth: '今月',
    totalCries: '総泣き声回数',
    times: '回',
    cryTypes: '泣き声タイプ',
    recentRecords: '最近の記録',
    
    // Settings Page
    settingsTitle: '設定',
    accountManagement: 'アカウント管理',
    profileDialogTitle: 'プロフィール編集',
    profileDialogDescription: 'プロフィール情報を編集',
    name: '名前',
    email: 'メール',
    save: '保存',
    
    // Notifications
    notifications: '通知',
    pushNotification: 'プッシュ通知',
    
    // Baby Info
    babyInfo: '赤ちゃん情報',
    babyName: '赤ちゃんの名前',
    enterName: '名前を入力',
    gender: '性別',
    male: '男',
    female: '女',
    birthDate: '生年月日',
    selectDate: '日付を選択',
    confirm: '確認',
    
    // Data
    data: 'データ',
    cloudSync: 'クラウドにデータを保存',
    
    // Display
    display: '画面',
    theme: 'テーマ',
    system: 'システム',
    light: 'ライト',
    dark: 'ダーク',
    
    // App Info
    appInfo: 'アプリ情報',
    version: 'バージョン',
    termsOfService: '利用規約',
    privacyPolicy: 'プライバシーポリシー',
  },
  zh: {
    // Bottom Navigation
    home: '首页',
    history: '历史',
    settings: '设置',
    
    // Home Page
    appTitle: 'BabyCry Analyzer',
    recordButton: '开始录音',
    recentAnalysis: '最近分析',
    noRecentData: '请按按钮让我听听哭声',
    
    // Processing Page
    analyzing: '分析中...',
    processingMessage: '正在分析宝宝的哭声',
    cancel: '取消',
    
    // Result Page
    analysisResult: '分析结果',
    checkSolution: '查看解决方法',
    solutionDialogTitle: '解决方法',
    solutionDialogDescription: '的解决方法',
    hungry: '饿了',
    sleepy: '困了',
    uncomfortable: '不舒服',
    pain: '疼痛',
    hungrySolution: '检查喂奶时间并喂奶。确保喂食量充足。',
    sleepySolution: '创造安静黑暗的环境。轻轻拍背哄睡。',
    uncomfortableSolution: '检查并更换尿布。确认室温是否合适。',
    painSolution: '检查宝宝的身体状况。如症状持续请就医。',
    close: '关闭',
    isThisCorrect: '这个分析正确吗？',
    yes: '是的',
    no: '不是',
    selectCorrectOption: '请选择正确的状态',
    saved: '已保存',
    solutionMethods: '解决方法',
    months: '个月',
    
    // Statistics Page
    cryHistory: '哭声历史',
    today: '今天',
    thisWeek: '本周',
    thisMonth: '本月',
    totalCries: '总哭声次数',
    times: '次',
    cryTypes: '哭声类型',
    recentRecords: '最近记录',
    
    // Settings Page
    settingsTitle: '设置',
    accountManagement: '账户管理',
    profileDialogTitle: '编辑资料',
    profileDialogDescription: '编辑您的资料信息',
    name: '姓名',
    email: '邮箱',
    save: '保存',
    
    // Notifications
    notifications: '通知',
    pushNotification: '推送通知',
    
    // Baby Info
    babyInfo: '宝宝信息',
    babyName: '宝宝姓名',
    enterName: '输入姓名',
    gender: '性别',
    male: '男',
    female: '女',
    birthDate: '出生日期',
    selectDate: '选择日期',
    confirm: '确认',
    
    // Data
    data: '数据',
    cloudSync: '保存数据到云端',
    
    // Display
    display: '显示',
    theme: '主题',
    system: '系统',
    light: '浅色',
    dark: '深色',
    
    // App Info
    appInfo: '应用信息',
    version: '版本',
    termsOfService: '服务条款',
    privacyPolicy: '隐私政策',
  },
  es: {
    // Bottom Navigation
    home: 'Inicio',
    history: 'Historial',
    settings: 'Ajustes',
    
    // Home Page
    appTitle: 'BabyCry Analyzer',
    recordButton: 'Iniciar grabación',
    recentAnalysis: 'Análisis reciente',
    noRecentData: 'Presiona el botón para que escuche el llanto',
    
    // Processing Page
    analyzing: 'Analizando...',
    processingMessage: 'Analizando el llanto del bebé',
    cancel: 'Cancelar',
    
    // Result Page
    analysisResult: 'Resultado del análisis',
    checkSolution: 'Ver solución',
    solutionDialogTitle: 'Solución',
    solutionDialogDescription: 'Solución para',
    hungry: 'Hambriento',
    sleepy: 'Somnoliento',
    uncomfortable: 'Incómodo',
    pain: 'Dolor',
    hungrySolution: 'Verifique el horario de alimentación y proporcione leche. Asegúrese de una cantidad suficiente.',
    sleepySolution: 'Cree un ambiente tranquilo y oscuro. Palmaditas suaves para dormir.',
    uncomfortableSolution: 'Revise y cambie el pañal. Verifique que la temperatura sea adecuada.',
    painSolution: 'Verifique la condición del bebé. Consulte al médico si los síntomas persisten.',
    close: 'Cerrar',
    isThisCorrect: '¿Es correcto este análisis?',
    yes: 'Sí',
    no: 'No',
    selectCorrectOption: 'Por favor seleccione el estado correcto',
    saved: 'Guardado',
    solutionMethods: 'Métodos de solución',
    months: 'meses',
    
    // Statistics Page
    cryHistory: 'Historial de llanto',
    today: 'Hoy',
    thisWeek: 'Esta semana',
    thisMonth: 'Este mes',
    totalCries: 'Total de llantos',
    times: 'veces',
    cryTypes: 'Tipos de llanto',
    recentRecords: 'Registros recientes',
    
    // Settings Page
    settingsTitle: 'Ajustes',
    accountManagement: 'Cuenta',
    profileDialogTitle: 'Editar perfil',
    profileDialogDescription: 'Actualice su información de perfil',
    name: 'Nombre',
    email: 'Correo',
    save: 'Guardar',
    
    // Notifications
    notifications: 'Notificaciones',
    pushNotification: 'Notificación push',
    
    // Baby Info
    babyInfo: 'Info del bebé',
    babyName: 'Nombre del bebé',
    enterName: 'Ingrese nombre',
    gender: 'Género',
    male: 'Masculino',
    female: 'Femenino',
    birthDate: 'Fecha de nacimiento',
    selectDate: 'Seleccione fecha',
    confirm: 'Confirmar',
    
    // Data
    data: 'Datos',
    cloudSync: 'Guardar datos en la nube',
    
    // Display
    display: 'Pantalla',
    theme: 'Tema',
    system: 'Sistema',
    light: 'Claro',
    dark: 'Oscuro',
    
    // App Info
    appInfo: 'Info de la app',
    version: 'Versión',
    termsOfService: 'Términos de servicio',
    privacyPolicy: 'Política de privacidad',
  },
};

export const getSystemLanguage = (): Language => {
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith('ko')) return 'ko';
  if (lang.startsWith('ja')) return 'ja';
  if (lang.startsWith('zh')) return 'zh';
  if (lang.startsWith('es')) return 'es';
  return 'en';
};

export const useTranslation = () => {
  const language = getSystemLanguage();
  return translations[language];
};
