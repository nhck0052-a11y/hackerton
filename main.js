document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('spending-form');
  const resultZone = document.getElementById('result-zone');
  const book = document.getElementById('result-book');
  
  // Receipt Elements
  const rItem = document.getElementById('receipt-item');
  const rPrice = document.getElementById('receipt-price');
  const rReason = document.getElementById('receipt-reason');
  const rTotal = document.getElementById('receipt-total');
  const rTimestamp = document.getElementById('timestamp');
  const rRoast = document.getElementById('ai-roast-text');
  
  // Financial Report Elements
  const reportDate = document.getElementById('report-date');
  const reportAnalysis = document.getElementById('report-analysis');
  const reportPsychology = document.getElementById('report-psychology');
  const reportActions = document.getElementById('report-actions');
  const reportGrade = document.getElementById('report-grade');
  
  // Guide Book Elements
  const guideLink = document.getElementById('guide-link');
  const guideOverlay = document.getElementById('guide-overlay');
  const guideBook = document.getElementById('guide-book');
  const closeGuideBtn = document.getElementById('close-guide-btn');

  // Contact Inline Logic
  const openContactBtn = document.getElementById('open-contact-btn');
  const contactInlineSection = document.getElementById('contact-inline-section');

  if (openContactBtn) {
    openContactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // Toggle visibility
      if (contactInlineSection.classList.contains('hidden')) {
        contactInlineSection.classList.remove('hidden');
        // Slight delay to allow display:block to apply before opacity transition
        setTimeout(() => {
          contactInlineSection.classList.add('open');
        }, 10);
        openContactBtn.textContent = "🤝 닫기";
      } else {
        contactInlineSection.classList.remove('open');
        setTimeout(() => {
          contactInlineSection.classList.add('hidden');
        }, 500); // Wait for transition
        openContactBtn.textContent = "🤝 비즈니스 및 제휴 문의";
      }
    });
  }

  function resetEffects() {
    body.classList.remove('mode-bad', 'mode-good');
    effectsLayer.innerHTML = '';
    const oldStamps = document.querySelectorAll('.stamp');
    oldStamps.forEach(s => s.remove());
    const oldMarquees = document.querySelectorAll('.bad-marquee');
    oldMarquees.forEach(m => m.remove());
  }

  function triggerEffects(type) {
    if (type === 'BAD') {
      body.classList.add('mode-bad');
      setTimeout(() => {
        const stamp = document.createElement('div');
        stamp.classList.add('stamp', 'bad');
        stamp.innerText = '탕진\nWARNING';
        const leftPage = document.querySelector('.book-page.left .page-content');
        if(leftPage) leftPage.appendChild(stamp);
      }, 1000);

      const marquee = document.createElement('div');
      marquee.classList.add('bad-marquee');
      const warnText = "⚠ 경고: 통장 잔고 비상! 지갑 심폐소생술 필요 ⚠ 💸 내 돈 어디갔니? 💸 ";
      marquee.innerHTML = `<div class="bad-marquee-track"><span>${warnText.repeat(10)}</span><span>${warnText.repeat(10)}</span></div>`;
      document.body.appendChild(marquee);
      createFlyingEmojis('💸');
    } else if (type === 'GOOD') {
      body.classList.add('mode-good');
      setTimeout(() => {
        const stamp = document.createElement('div');
        stamp.classList.add('stamp', 'good');
        stamp.innerText = 'Certified:\nSmart Spender';
        const leftPage = document.querySelector('.book-page.left .page-content');
        if(leftPage) leftPage.appendChild(stamp);
      }, 1000);
      createCoinRain();
    }
  }

  function createCoinRain() {
    for (let i = 0; i < 80; i++) {
      const coin = document.createElement('div');
      coin.classList.add('coin');
      coin.style.left = Math.random() * 100 + 'vw';
      const duration = Math.random() * 3 + 2; 
      const delay = Math.random() * 2;       
      const scale = Math.random() * 0.5 + 0.6;
      coin.style.setProperty('--fall-duration', duration + 's');
      coin.style.setProperty('--fall-delay', delay + 's');
      coin.style.setProperty('--coin-scale', scale);
      coin.style.setProperty('--sway-dir', Math.random() > 0.5 ? 1 : -1);
      coin.addEventListener('animationend', () => { coin.remove(); });
      effectsLayer.appendChild(coin);
    }
  }

  function createFlyingEmojis(emoji) {
    for (let i = 0; i < 20; i++) {
      const el = document.createElement('div');
      el.classList.add('flying-emoji');
      el.innerText = emoji;
      el.style.left = Math.random() * 100 + 'vw';
      el.style.top = (Math.random() * 50 + 50) + 'vh';
      el.style.animationDuration = (Math.random() * 2 + 2) + 's';
      effectsLayer.appendChild(el);
    }
  }
});

function generateAnalysis(item, price, reason) {
  // 0. 시세 데이터 (Full Database)
  const marketPrices = {
    // 📱 Apple iPhone Series
    '아이폰 6': 27500, 'iPhone 6': 27500, '아이폰 6 플러스': 30000, 'iPhone 6 Plus': 30000,
    '아이폰 6s': 50000, 'iPhone 6s': 50000, '아이폰 6s 플러스': 55000, 'iPhone 6s Plus': 55000,
    '아이폰 7': 65000, 'iPhone 7': 65000, '아이폰 7 플러스': 70000, 'iPhone 7 Plus': 70000,
    '아이폰 8': 90000, 'iPhone 8': 90000, '아이폰 8 플러스': 100000, 'iPhone 8 Plus': 100000,
    '아이폰 X': 135000, 'iPhone X': 135000, '아이폰 텐': 135000,
    '아이폰 XS': 190000, 'iPhone XS': 190000, '아이폰 XS 맥스': 210000, 'iPhone XS Max': 210000,
    '아이폰 11': 240000, 'iPhone 11': 240000, '아이폰 11 프로': 260000, 'iPhone 11 Pro': 260000,
    '아이폰 12': 285000, 'iPhone 12': 285000, '아이폰 12 미니': 270000, 'iPhone 12 mini': 270000,
    '아이폰 13': 430000, 'iPhone 13': 430000, '아이폰 13 미니': 400000, 'iPhone 13 mini': 400000,
    '아이폰 14 프로': 725000, 'iPhone 14 Pro': 725000, '아이폰 14 프로 맥스': 780000, 'iPhone 14 Pro Max': 780000,
    '아이폰 15 프로': 950000, 'iPhone 15 Pro': 950000, '아이폰 15 프로 맥스': 1000000, 'iPhone 15 Pro Max': 1000000,
    '아이폰 16 프로': 1350000, 'iPhone 16 Pro': 1350000, '아이폰 16 프로 맥스': 1400000, 'iPhone 16 Pro Max': 1400000,
    '아이폰 17 프로': 2075000, 'iPhone 17 Pro': 2075000, '아이폰 17 프로 맥스': 2200000, 'iPhone 17 Pro Max': 2200000,

    // 📱 Samsung Galaxy S Series
    '갤럭시 S6': 22500, 'Galaxy S6': 22500, '갤럭시 S7': 25000, 'Galaxy S7 Edge': 25000,
    '갤럭시 S8': 50000, 'Galaxy S8': 50000, '갤럭시 S9': 55000, 'Galaxy S9': 55000,
    '갤럭시 S10': 95000, 'Galaxy S10': 95000, '갤럭시 S10+': 100000, 'Galaxy S10+': 100000,
    '갤럭시 노트 10': 140000, 'Galaxy Note 10': 140000, '갤럭시 노트 10+': 150000, 'Galaxy Note 10+': 150000,
    '갤럭시 노트 20 울트라': 275000, 'Galaxy Note 20 Ultra': 275000,
    '갤럭시 S21 울트라': 340000, 'Galaxy S21 Ultra': 340000,
    '갤럭시 S22 울트라': 500000, 'Galaxy S22 Ultra': 500000,
    '갤럭시 S23 울트라': 700000, 'Galaxy S23 Ultra': 700000,
    '갤럭시 S24 울트라': 975000, 'Galaxy S24 Ultra': 975000,
    '갤럭시 S26 울트라': 1790000, 'Galaxy S26 Ultra': 1790000,

    // 📸 Camera (Sony, Canon, Fuji)
    '소니 a5000': 175000, 'Sony a5000': 175000, '소니 a5100': 185000, 'Sony a5100': 185000,
    '소니 a6000': 275000, 'Sony a6000': 275000, '소니 a6400': 700000, 'Sony a6400': 700000,
    '소니 ZV-E10': 600000, 'Sony ZV-E10': 600000,
    '소니 A7 Mark II': 500000, 'Sony A7 II': 500000, '소니 A7 Mark III': 1200000, 'Sony A7 III': 1200000,
    '소니 A7 Mark IV': 2300000, 'Sony A7 IV': 2300000, '소니 A7 Mark V': 3790000, 'Sony A7 V': 3790000,
    '캐논 EOS 5D Mark III': 525000, '오막삼': 525000, '5D Mark III': 525000,
    '캐논 EOS R': 1000000, 'Canon EOS R': 1000000, '캐논 EOS R6': 1900000, 'Canon EOS R6': 1900000,
    '후지필름 X100V': 1800000, 'Fujifilm X100V': 1800000, '후지 X100VI': 2590000, 'Fujifilm X100VI': 2590000,

    // 🚁 Drones (DJI)
    'DJI 팬텀 3': 175000, 'Phantom 3': 175000, 'DJI 팬텀 4': 225000, 'Phantom 4': 225000,
    'DJI 매빅 프로': 250000, 'Mavic Pro': 250000, 'DJI 매빅 2 프로': 625000, 'Mavic 2 Pro': 625000,
    'DJI 매빅 3 클래식': 1500000, 'Mavic 3 Classic': 1500000,
    'DJI 미니 1': 180000, 'Mini 1': 180000, 'DJI 미니 2': 220000, 'Mini 2': 220000,
    'DJI 미니 3 프로': 675000, 'Mini 3 Pro': 675000, 'DJI 에어 2S': 575000, 'Air 2S': 575000,
    'DJI 매빅 4': 3200000, 'DJI 에어 4': 2500000,

    // 💻 Tablet & Notebook
    '아이패드 에어 2': 65000, 'iPad Air 2': 65000, '아이패드 6세대': 120000, '아이패드 7세대': 140000,
    '아이패드 미니 5': 275000, 'iPad mini 5': 275000,
    '아이패드 프로 11': 525000, 'iPad Pro 11': 525000, '아이패드 프로 M4': 1700000, 'iPad Pro M4': 1700000,
    '맥북 에어 2015': 180000, '맥북 에어 2017': 220000,
    '맥북 에어 M1': 725000, 'MacBook Air M1': 725000,
    '맥북 프로 16 인텔': 800000, 'MacBook Pro 16 Intel': 800000,
    '맥북 프로 16': 3690000, '맥북프로 16': 3690000,
    '맥북 프로 14': 2390000, '맥북프로 14': 2390000,
    '맥북 에어 15': 1890000, '맥북에어 15': 1890000,
    '맥북 에어 13': 1590000, '맥북에어 13': 1590000, '맥북에어': 1390000,
    'LG 그램 프로': 2500000, '그램 프로': 2500000,
    'LG 그램': 1800000, '그램': 1500000,
    '갤럭시북 4 프로': 2100000, '갤북4': 1800000, '갤럭시북': 1500000,

    // ☕ Food & General (Expanded)
    '커피': 5000, '아메리카노': 4500, '라떼': 5500, '스무디': 6500, '버블티': 6000,
    '마라탕': 12000, '떡볶이': 15000, '치킨': 28000, '피자': 30000, '햄버거': 10000,
    '국밥': 10000, '김치찌개': 9000, '된장찌개': 9000, '짜장면': 8000, '짬뽕': 9000, '탕수육': 20000,
    '삼겹살': 18000, '갈비': 18000, '소고기': 40000, '한우': 50000, '스테이크': 50000,
    '파스타': 18000, '리조또': 18000, '초밥': 25000, '회': 50000, '족발': 35000, '보쌈': 35000,
    '소주': 5000, '맥주': 6000, '와인': 30000, '위스키': 50000, '칵테일': 15000,
    '빵': 3000, '케이크': 35000, '디저트': 8000, '빙수': 12000, '아이스크림': 4000,
    
    // 🏠 Living & Fashion
    '택시': 12000, '버스': 1500, '지하철': 1500, '기름': 50000, '주유': 50000,
    '영화': 15000, '티켓': 15000, '전시회': 20000, '뮤지컬': 120000, '콘서트': 130000,
    '책': 18000, '도서': 18000, '만화책': 7000, '문제집': 20000,
    '헬스': 50000, '필라테스': 150000, '요가': 150000, '운동': 50000,
    '넷플릭스': 17000, '유튜브': 14900, '구독': 10000, '멜론': 10000,
    '생필품': 30000, '휴지': 15000, '샴푸': 15000, '치약': 10000,
    '옷': 50000, '티셔츠': 35000, '맨투맨': 50000, '후드': 60000, '셔츠': 50000,
    '바지': 60000, '청바지': 70000, '슬랙스': 50000, '치마': 40000,
    '자켓': 150000, '코트': 200000, '패딩': 250000, '가디건': 80000,
    '신발': 100000, '운동화': 120000, '구두': 150000, '부츠': 150000, '슬리퍼': 30000,
    '가방': 200000, '백팩': 100000, '에코백': 30000, '지갑': 150000,
    '화장품': 30000, '립스틱': 35000, '파운데이션': 50000, '향수': 150000
  };

  const food = ['마라탕', '커피', '치킨', '술', '밥', '떡볶이', '피자', '배달'].some(f => item.includes(f));
  const tech = ['컴퓨터', '맥북', '폰', '아이폰', '갤럭시', '에어팟', '플스', '닌텐도', '카메라', '드론'].some(t => item.includes(t));
  const goodItems = ['책', '강의', '기부', '저축', '운동', '영양제'].some(g => item.includes(g));

  let marketMatch = null;
  let maxLen = 0;
  for (const key in marketPrices) {
    if (item.replace(/\s/g, '').includes(key.replace(/\s/g, ''))) {
      if (key.length > maxLen) { marketMatch = key; maxLen = key.length; }
    }
  }

  // --- ANALYSIS LOGIC ---
  let type = 'BAD';
  let grade = 'F';
  let short_roast = "";
  let analysis = ""; 
  let psychology = ""; 
  let actions = []; 

  // 1. 기회비용 계산
  const gukbapPrice = 10000;
  const gukbapCount = (price / gukbapPrice).toFixed(1);
  const hourlyWage = 10030; // 2025 Minimum Wage
  const workHours = (price / hourlyWage).toFixed(1);

  analysis = `이 돈(${price.toLocaleString()}원)이면 국밥 ${gukbapCount}그릇을 먹을 수 있으며, 최저시급 기준 약 ${workHours}시간을 숨만 쉬고 일해야 벌 수 있는 금액입니다.`;

  // 2. 심리 진단
  if (reason.includes('스트레스') || reason.includes('우울')) {
    psychology = "전형적인 '감정적 회피형 소비'입니다. 현실의 압박을 결제 버튼으로 해소하려는 보상 심리가 작동했습니다.";
  } else if (reason.includes('그냥') || reason.includes('예뻐서') || reason.includes('세일')) {
    psychology = "뇌의 이성적 필터가 마비된 '도파민 중독형 소비'입니다. '세일'이라는 단어에 낚여 필요 없는 물건을 쟁여두는 것입니다.";
  } else {
    psychology = "소비의 타당성을 스스로 합리화하고 있습니다. 정말 필요해서 산 것인지, 사고 싶어서 이유를 만든 것인지 냉정하게 자문해보십시오.";
  }

  // 3. 판정 로직 (Priority: Market Price > Good Items > Price Threshold) 
  
  // Case A: 득템 (시세보다 30% 이상 저렴)
  if (marketMatch && price <= marketPrices[marketMatch] * 0.7) {
    type = 'GOOD'; grade = 'S';
    short_roast = "대박 득템! 지능형 소비자 인정.";
    analysis += ` 하지만 정가 ${marketPrices[marketMatch].toLocaleString()}원 대비 30% 이상 저렴하게 구매하여, 시장 가격 왜곡을 간파한 훌륭한 '가치 투자'를 해냈습니다.`;
    psychology = "철저한 시장 조사와 인내심이 결합된 '전략가형' 마인드입니다.";
    actions = ["아낀 차액 즉시 저축하기", "주변에 구매 팁 전수하기", "자만하지 말고 다음 소비도 신중하게"];
  }
  // Case B: 호구 (시세보다 20% 이상 비쌈)
  else if (marketMatch && price > marketPrices[marketMatch] * 1.2) {
    type = 'BAD';
    const multiple = Math.floor(price / marketPrices[marketMatch]);
    if (multiple >= 3) {
      grade = 'F-'; short_roast = `정가의 ${multiple}배? 사기 당한 거 아님?`;
      analysis += ` 특히 시세보다 ${multiple}배 이상 비싼 '호구 비용'이 포함되어 있습니다. 이건 범죄 수준입니다.`;
      actions = ["소비자 보호원 피해 구제 신청", "당장 환불 요청", "멘탈 케어 받기"];
    } else {
      grade = 'F'; short_roast = "호구 잡혔네. 2개 살 돈으로 1개 샀어.";
      analysis += ` 남들보다 비싸게 주고 산 '정보 비대칭 비용'을 치르고 있습니다.`;
      actions = ["가격 비교 사이트 즐겨찾기", "3일간 무지출 수행", "영수증 파쇄"];
    }
  }
  // Case C: 저렴한 물건 (5000원 미만) - 관대함 적용
  else if (price < 5000) {
    type = 'GOOD'; grade = 'A-';
    short_roast = "귀여운 소비네. 이 정도는 봐줌.";
    analysis += ` 하지만 금액이 소소하여 자산에 큰 타격은 없습니다. '소확행'으로 인정합니다.`;
    psychology = "작은 돈으로 기분을 전환하려는 소박한 시도입니다.";
    actions = ["남은 돈 저금통에 넣기", "기분 좋게 하루 시작하기", "티끌 모아 태산 명심하기"];
  }
  // Case D: 유익한 소비
  else if (goodItems) {
    type = 'GOOD'; grade = 'A';
    short_roast = "합리적인 소비. 칭찬해.";
    analysis += ` 미래를 위한 투자이거나 가치 있는 곳에 사용된 '무해한 소비'입니다.`;
    psychology = "자존감이 높고 자기 통제가 가능한 '안정형' 상태입니다.";
    actions = ["꾸준한 자기계발 지속", "작은 성공 경험 기록하기", "주변에 긍정적 영향력 전파"];
  }
  // Case E: 일반적인 BAD 패턴
  else {
    if (tech) {
      grade = 'D'; short_roast = "장비병 초기 증상. 실력은 장비탓이 아님.";
      actions = ["산 물건 본전 뽑을 때까지 쓰기", "중고 감가상각 공부하기", "다음 달 할부금 걱정하기"];
    } else if (food) {
      grade = 'D-'; short_roast = "먹는 게 남는 거? 아니, 지방만 남음.";
      actions = ["배달 앱 삭제", "직접 요리해서 식비 방어", "엥겔 지수 확인하기"];
    } else {
      grade = 'C'; short_roast = "애매한 소비. 있으면 좋지만 없어도 됨.";
      actions = ["사용 빈도 체크하기", "불필요하면 당근마켓행", "가계부 기록 습관화"];
    }
  }

  // --- GUIDE BOOK CONTENT GENERATION ---
  let guide_intro = "";
  let guide_ch1 = "";
  let guide_ch2 = "";
  let guide_ch3 = "";
  let guide_warning = "";

  // Introduction Logic
  if (type === 'GOOD') {
    guide_intro = `현재 귀하의 금융 생존 확률은 '매우 높음(High Survival)' 단계입니다. 입력하신 소비 데이터(${item})는 자산 침식이 아닌 '자산 방어' 또는 '가치 투자'로 판명되었습니다. 귀하는 통제된 환경 속에서 합리적인 판단을 내리고 있습니다.`;
  } else {
    guide_intro = `경고: 현재 귀하의 금융 생존 확률은 '위험(Critical)' 수준으로 급락했습니다. 입력하신 지출(${item})은 귀하의 자산 방어벽을 무너뜨리는 '트로이의 목마'와 같습니다. 지금 즉시 지혈하지 않으면, 파산은 시간문제입니다.`;
  }

  // Chapter 1: Deep Analysis
  guide_ch1 = `<strong>[기회비용의 실체]</strong><br>귀하가 지불한 ${price.toLocaleString()}원은 단순한 화폐가 아닙니다. 이는 약 ${workHours}시간의 노동을 통해 얻은 '생명력'이며, 국밥 ${gukbapCount}그릇에 해당하는 '생존 에너지'입니다.<br><br><strong>[심층 심리 부검]</strong><br>${psychology} 귀하의 무의식은 현재 '결핍'을 느끼고 있으며, 이를 물질로 채우려 하고 있습니다. 그러나 이는 '밑 빠진 독에 물 붓기'일 뿐입니다.`;

  // Chapter 2: Action Plan (Dynamic Quotes)
  const strictQuotes = [
    "변명은 통장을 채워주지 않습니다. 지금 움직이십시오.",
    "행동 없는 반성은 망상에 불과합니다.",
    "내일의 나에게 빚지지 마십시오.",
    "이 작은 실천이 당신의 경제적 자유를 만듭니다.",
    "지금 하지 않으면, 다음 달에도 똑같은 후회를 할 것입니다.",
    "불편함을 감수하는 것이 절약의 시작입니다.",
    "단호한 결단만이 악순환을 끊을 수 있습니다."
  ];
  
  const encouragingQuotes = [
    "작은 성공이 모여 큰 부를 이룹니다.",
    "이 흐름을 유지하는 것이 가장 중요합니다.",
    "당신의 현명한 선택이 미래를 바꿉니다.",
    "자만하지 말고 꾸준히 정진하십시오.",
    "오늘의 절약은 내일의 자유입니다.",
    "긍정적인 습관이 자산이 됩니다."
  ];

  guide_ch2 = (type === 'GOOD') 
    ? `귀하에게 필요한 것은 '꾸준함'과 '유지'입니다. 현재의 좋은 흐름을 이어가기 위한 지침입니다.<br><br>`
    : `귀하에게 필요한 것은 '위로'가 아니라 '규율'입니다. 당장 실행해야 할 생존 수칙입니다.<br><br>`;

  actions.forEach((act, index) => {
    const quotes = (type === 'GOOD') ? encouragingQuotes : strictQuotes;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    guide_ch2 += `<strong>${index + 1}. ${act}</strong><br>- ${randomQuote}<br><br>`;
  });

  // Chapter 3: Verdict
  guide_ch3 = `종합 판정 결과, 귀하의 이번 소비 등급은 [ ${grade} ] 입니다. 이는 단순한 점수가 아니라, 귀하의 경제적 자립 가능성을 나타내는 지표입니다.`;

  // Warning
  if (type === 'BAD') {
    guide_warning = `[경고] 이 지침을 무시할 경우, 3개월 내에 카드 리볼빙의 늪에 빠질 확률이 98% 이상입니다.`;
  } else {
    guide_warning = `[조언] 자만은 금물입니다. 이 흐름을 잃지 말고 꾸준히 정진하십시오.`;
  }

  return { type, grade, short_roast, analysis, psychology, actions, guide_intro, guide_ch1, guide_ch2, guide_ch3, guide_warning };
}

function typeWriter(text, element) {
  let i = 0; element.textContent = '';
  const speed = 30;
  function type() {
    if (i < text.length) { element.textContent += text.charAt(i); i++; setTimeout(type, speed); }
  }
  type();
}