document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('spending-form');
  const resultZone = document.getElementById('result-zone');
  
  // Book Elements
  const book = document.getElementById('result-book');
  
  // Receipt Elements
  const rItem = document.getElementById('receipt-item');
  const rPrice = document.getElementById('receipt-price');
  const rReason = document.getElementById('receipt-reason');
  const rTotal = document.getElementById('receipt-total');
  const rTimestamp = document.getElementById('timestamp');
  const rRoast = document.getElementById('ai-roast-text');
  
  // Prescription Elements
  const rxGrade = document.getElementById('rx-grade');
  const rxActions = document.getElementById('rx-actions');
  
  // Effect Elements
  const body = document.body;
  const effectsLayer = document.getElementById('effects-layer');
  const receiptContainer = document.querySelector('.receipt-printer');
  const homeBtn = document.getElementById('home-btn');
  const downloadBtn = document.getElementById('download-btn');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    resetEffects();

    // 1. Get Values
    const item = document.getElementById('item').value;
    const price = parseInt(document.getElementById('price').value);
    const reason = document.getElementById('reason').value;

    if (!item || isNaN(price) || !reason) return;

    // 2. Populate Receipt (Left Page)
    rItem.textContent = item.length > 15 ? item.substring(0, 15) + '...' : item;
    rPrice.textContent = '₩' + price.toLocaleString();
    rReason.textContent = reason;
    rTotal.textContent = '₩' + price.toLocaleString();
    rTimestamp.textContent = new Date().toLocaleDateString('ko-KR');

    // 3. Generate Analysis (Simulated Logic based on Whitepaper)
    const result = generateAnalysis(item, price, reason);
    
    // Fill Receipt Roast
    rRoast.textContent = ""; 
    typeWriter(result.roast_message, rRoast); 
    
    // Fill Prescription (Right Page)
    rxGrade.textContent = result.grade;
    rxActions.innerHTML = result.action_items.map(action => `<li>${action}</li>`).join('');
    
    // 4. Show Result & Trigger Book Animation
    resultZone.classList.remove('hidden');
    
    // Trigger Effects (Visual)
    triggerEffects(result.type);

    // Scroll to book
    resultZone.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Open the book after a slight delay
    setTimeout(() => {
      book.classList.add('open');
    }, 500);
  });

  homeBtn.addEventListener('click', () => {
    book.classList.remove('open');
    setTimeout(() => {
        resultZone.classList.add('hidden');
        form.reset();
        resetEffects();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 500); // Wait for close animation
  });

  // Download Functionality (Captures the whole book wrapper)
  downloadBtn.addEventListener('click', () => {
    // We capture the '.book' element
    // To capture "open" state properly in 2D, we might need to temporarily flatten it or capture pages side-by-side
    // For simplicity, we capture the currently visible book area.
    
    // Clone the book to a hidden container to flatten it for capture
    const captureTarget = book;
    
    html2canvas(captureTarget, {
      backgroundColor: null, // Transparent background
      scale: 2
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'gemini_report.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  });

  // Download Functionality
  downloadBtn.addEventListener('click', () => {
    const captureTarget = book;
    html2canvas(captureTarget, {
      backgroundColor: null, 
      scale: 2
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'gemini_report.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  });

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
        // Append stamp to the Receipt Page inside the book
        document.querySelector('.book-page.left .page-content').appendChild(stamp);
      }, 1000);

      const marquee = document.createElement('div');
      marquee.classList.add('bad-marquee');
      const warnText = "⚠ 경고: 통장 잔고 비상! 지갑 심폐소생술 필요 ⚠ 💸 내 돈 어디갔니? 💸 ";
      const repeatedText = warnText.repeat(10);
      marquee.innerHTML = `<div class="bad-marquee-track"><span>${repeatedText}</span><span>${repeatedText}</span></div>`;
      document.body.appendChild(marquee);
      
      createFlyingEmojis('💸');

    } else if (type === 'GOOD') {
      body.classList.add('mode-good');
      setTimeout(() => {
        const stamp = document.createElement('div');
        stamp.classList.add('stamp', 'good');
        stamp.innerHTML = 'Certified:<br>Smart Spender';
        document.querySelector('.book-page.left .page-content').appendChild(stamp);
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
      const swayDir = Math.random() > 0.5 ? 1 : -1;

      coin.style.setProperty('--fall-duration', duration + 's');
      coin.style.setProperty('--fall-delay', delay + 's');
      coin.style.setProperty('--coin-scale', scale);
      coin.style.setProperty('--sway-dir', swayDir);
      
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

/**
 * Logic based on "Tech Whitepaper"
 * 제1장: 지능형 진단 로직 (Simulated)
 */
function generateAnalysis(item, price, reason) {
  // 0. 시세 데이터 (Expanded Benchmark Prices - 2025 KRW Estimate)
  const marketPrices = {
    // ☕ 식음료 (Food & Drink)
    '커피': 5000, '아메리카노': 4500, '라떼': 5500, '스무디': 6500, '버블티': 6000,
    '마라탕': 12000, '떡볶이': 15000, '치킨': 28000, '피자': 30000, '햄버거': 10000,
    '국밥': 10000, '김치찌개': 9000, '된장찌개': 9000, '짜장면': 8000, '짬뽕': 9000, '탕수육': 20000,
    '삼겹살': 18000, '갈비': 18000, '소고기': 40000, '한우': 50000, '스테이크': 50000,
    '파스타': 18000, '리조또': 18000, '초밥': 25000, '회': 50000, '족발': 35000, '보쌈': 35000,
    '소주': 5000, '맥주': 6000, '와인': 30000, '위스키': 50000, '칵테일': 15000,
    '빵': 3000, '케이크': 35000, '디저트': 8000, '빙수': 12000, '아이스크림': 4000,

    // 💻 전자기기 (Tech)
    '컴퓨터': 1000000, '본체': 1000000, '데스크탑': 1000000,
    '노트북': 1200000, '그램': 1500000, '맥북': 1900000, '맥북에어': 1500000, '맥북프로': 2500000,
    '아이패드': 800000, '갤럭시탭': 700000, '태블릿': 500000,
    '폰': 1000000, '핸드폰': 1000000, '스마트폰': 1000000, '아이폰': 1300000, '갤럭시': 1100000,
    '워치': 400000, '애플워치': 500000, '갤럭시워치': 300000,
    '이어폰': 150000, '에어팟': 250000, '버즈': 150000, '헤드셋': 300000,
    '키보드': 150000, '마우스': 60000, '모니터': 300000,
    '게임기': 400000, '닌텐도': 400000, '플스': 650000, '스위치': 400000, '엑스박스': 650000,
    '카메라': 1500000, '스피커': 200000,

    // 👗 패션/뷰티 (Fashion & Beauty)
    '옷': 50000, '티셔츠': 35000, '맨투맨': 50000, '후드': 60000, '셔츠': 50000,
    '바지': 60000, '청바지': 70000, '슬랙스': 50000, '치마': 40000,
    '자켓': 150000, '코트': 200000, '패딩': 250000, '가디건': 80000,
    '신발': 100000, '운동화': 120000, '구두': 150000, '부츠': 150000, '슬리퍼': 30000,
    '가방': 200000, '백팩': 100000, '에코백': 30000, '지갑': 150000,
    '화장품': 30000, '립스틱': 35000, '파운데이션': 50000, '향수': 150000, '스킨': 30000, '로션': 30000,
    '미용실': 30000, '커트': 25000, '파마': 100000, '염색': 80000, '네일': 60000,

    // 🏠 생활/취미 (Living & Hobby)
    '택시': 12000, '버스': 1500, '지하철': 1500, '기름': 50000, '주유': 50000,
    '영화': 15000, '티켓': 15000, '전시회': 20000, '뮤지컬': 120000, '콘서트': 130000,
    '책': 18000, '도서': 18000, '만화책': 7000, '문제집': 20000,
    '헬스': 50000, '필라테스': 150000, '요가': 150000, '운동': 50000,
    '넷플릭스': 17000, '유튜브': 14900, '구독': 10000, '멜론': 10000,
    '생필품': 30000, '휴지': 15000, '샴푸': 15000, '치약': 10000,
    '장난감': 30000, '레고': 80000, '피규어': 50000, '굿즈': 20000
  };

  // 1. 기본 분류 키워드
  const expensive = price > 50000;
  const cheap = price < 10000;
  const veryCheap = price < 5000; 
  
  const food = ['마라탕', '커피', '치킨', '술', '밥', '파스타', '떡볶이', '피자', '배달', '야식'].some(f => item.includes(f));
  const tech = ['컴퓨터', '맥북', '모니터', '키보드', '아이패드', '갤럭시', '아이폰', '에어팟'].some(t => item.includes(t));
  const subscription = ['구독', '넷플릭스', '유튜브', '멤버십', '요금제'].some(s => item.includes(s));
  const goodItems = ['책', '강의', '기부', '저축', '운동', '헬스', '영양제', '선물', '효도'].some(g => item.includes(g));

  const emotional = reason.includes('스트레스') || reason.includes('우울') || reason.includes('기분');
  const impulse = reason.includes('그냥') || reason.includes('세일') || reason.includes('예뻐서');

  let type = 'BAD';
  let grade = 'F';
  let roast = "";
  let actions = [];

  // 2. 시세 비교 로직 (Smart Analysis)
  let marketMatch = null;
  for (const key in marketPrices) {
    if (item.includes(key)) {
      marketMatch = key;
      break;
    }
  }

  // 3. 우선 순위 로직 적용
  
  // Case A: 시세보다 훨씬 싸게 산 경우 (득템)
  if (marketMatch && price <= marketPrices[marketMatch] * 0.7) {
    type = 'GOOD';
    grade = 'S';
    roast = `대박! ${marketMatch}를 ${price.toLocaleString()}원에? 너 혹시 당근마켓 고인물이야? 완전 득템 인정!`;
    actions = [
      "남은 돈으로 저축해서 복리 효과 누리기",
      "주변에 저렴하게 사는 꿀팁 공유하기",
      "오늘만큼은 스스로를 칭찬해주기"
    ];
  }
  // Case B: 시세보다 너무 비싸게 산 경우 (호구)
  else if (marketMatch && price >= marketPrices[marketMatch] * 2) {
    type = 'BAD';
    grade = 'F';
    roast = `${marketMatch} 하나에 ${price.toLocaleString()}원? 이 가격이면 2개는 샀겠다. 호구 잡힌 거 아니야?`;
    actions = [
      "다음부터는 가격 비교 사이트 필수 검색",
      "영수증 찢어버리고 잊어버리기 (정신건강 보호)",
      "친구한테 이 가격에 샀다고 말하지 말기"
    ];
  }
  // Case C: 아주 저렴하거나 필수/유익 소비
  else if (goodItems || (veryCheap && !subscription)) {
    type = 'GOOD';
    if (veryCheap) {
      grade = 'A-';
      roast = `오... ${price.toLocaleString()}원이면 ${item}? 귀여운 소비네. 이 정도는 눈감아 줄게.`;
      actions = ["남은 돈으로 저금통 채우기", "소소한 행복 즐기기", "다음에도 가성비 챙기기"];
    } else {
      grade = 'A+';
      roast = `오... ${item}? 이건 좀 의외네. 미래를 위한 투자라고 인정해줄게. 칭찬 스티커 하나.`;
      actions = ["적금 통장 하나 더 만들기", "주변에 자랑하기", "스스로에게 보상 해주기"];
    }
  }
  // Case D: 적당한 가격 (시세 범위 내)
  else if (marketMatch && price <= marketPrices[marketMatch] * 1.3) {
    type = 'GOOD';
    grade = 'B+';
    roast = `${item}, ${price.toLocaleString()}원. 딱 적정가에 잘 샀네. 호갱 탈출 축하해.`;
    actions = ["가계부 기록하기", "합리적 소비 습관 유지", "다음 달 예산 점검"];
  }
  // Case E: 일반적인 BAD 패턴들
  else {
    type = 'BAD'; 
    if (subscription) {
       grade = 'C-';
       roast = `숨만 쉬어도 나가는 돈.. ${item}, 진짜 다 보고 있는 거 맞아?`;
       actions = ["고정 지출 다이어트", "디지털 미니멀리즘", "안 보는 구독 해지"];
    } else if (food) {
       grade = 'F';
       roast = `${item} 먹고 살찌고, 돈 쓰고.. 이 무한 굴레, 언제 끊을래?`;
       actions = ["식단 공유 커뮤니티 가입", "도시락 생활화", "배달 앱 삭제"];
    } else if (tech && price > 50000) { 
      grade = 'D';
      roast = `장비병 도졌어? ${item} 사면 실력 늘 것 같지? 응 아니야. 손가락이 문제야.`;
      actions = ["일단 산 거 매일 쓰기", "중고나라 시세 알아두기", "카드값 나갈 때까지 라면 먹기"];
    } else if (expensive) {
      grade = 'F';
      roast = `₩${price.toLocaleString()}? 너 혹시 재벌 3세야? 통장 잔고 생각 안 해?`;
      actions = ["가계부 어플 설치", "무지출 챌린지", "친구들에게 '나 거지' 선언"];
    } else {
      grade = 'C';
      roast = `${item}.. 애매하다 애매해. 차라리 저축을 하지 그랬어?`;
      actions = ["일기장에 반성문 쓰기", "결제 전 심호흡 5번", "당근마켓에 올리기"];
    }
  }

  return { type, grade, roast_message: roast, action_items: actions };
}

function typeWriter(text, element) {
  let i = 0;
  element.textContent = '';
  const speed = 30;
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}
