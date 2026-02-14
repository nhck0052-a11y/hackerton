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
  const expensive = price > 50000;
  const cheap = price < 10000;
  const veryCheap = price < 5000; // 관대한 기준
  
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

  // 1. GOOD 판단 로직
  // 필수/유익 소비이거나, 매우 저렴한 소비(구독 제외)는 GOOD으로 인정
  if (goodItems || (veryCheap && !subscription)) {
    type = 'GOOD';
    
    if (veryCheap) {
      grade = 'A-';
      roast = `오... ${price.toLocaleString()}원이면 ${item}? 이건 거의 공짜 수준이네. 귀여운 소비 인정!`;
      actions = [
        "남은 돈으로 저금통 채우기",
        "소소한 행복 즐기기",
        "다음에도 가성비 챙기기"
      ];
    } else {
      grade = 'A+';
      roast = `오... ${item}? 이건 좀 의외네. 미래를 위한 투자라고 인정해줄게. 칭찬 스티커 하나.`;
      actions = [
        "이 흐름 유지해서 적금 통장 하나 더 만들기",
        "주변 사람들에게 '나 이렇게 산다'고 자랑하기",
        "남은 돈으로 스스로에게 작은 보상 해주기"
      ];
    }
  } else if (cheap && !food && !tech && !impulse && !subscription) {
    // 적당히 저렴하고 문제 없는 소비
    type = 'GOOD';
    grade = 'B';
    roast = `나쁘지 않아. ${item} 정도면 합리적인 소비지. 근데 딱히 칭찬할 것도 없음.`;
    actions = [
      "다음 달 예산 미리 계획하기",
      "영수증 모아서 가계부 쓰기",
      "불필요한 지출인지 한 번 더 생각하기"
    ];
  } else {
    // 2. BAD 판단 로직
    type = 'BAD'; 
    
    if (subscription) {
       grade = 'C-';
       roast = `숨만 쉬어도 나가는 돈이 너무 많아. ${item}, 진짜 다 보고 있는 거 맞아?`;
       actions = [
         "고정 지출 다이어트 시작하기",
         "디지털 미니멀리즘 실천 (폰 끄고 산책)",
         "안 보는 구독 서비스 당장 해지하기"
       ];
    } else if (food) {
       grade = 'F';
       roast = `${item} 먹고 살찌고, 돈 쓰고 스트레스 받고... 이 무한 굴레, 언제 끊을래?`;
       actions = [
         "식단 공유 커뮤니티 가입하기",
         "일주일간 도시락 생활화 도전",
         "배달 앱 삭제하고 직접 요리하기"
       ];
    } else if (tech && price > 30000) { // Tech는 3만원 이상일 때만 장비병 취급
      grade = 'D';
      roast = `장비병 도졌어? ${item} 사면 실력이 늘 것 같지? 응 아니야. 손가락이 문제야.`;
      actions = [
        "일단 산 거 본전 뽑을 때까지 매일 2시간씩 쓰기",
        "중고나라 시세 미리 알아두기 (3개월 뒤를 위해)",
        "다음 달 카드값 나갈 때까지 라면만 먹기"
      ];
    } else if (expensive) {
      grade = 'F';
      roast = `₩${price.toLocaleString()}? 너 혹시 재벌 3세야? ${item}에 이 돈을 태워?`;
      actions = [
        "가계부 어플 설치하고 오늘 지출 빨간색으로 표시하기",
        "일주일 동안 무지출 챌린지 도전",
        "친구들에게 '나 거지임' 선언하고 밥 얻어먹기"
      ];
    } else if (impulse) {
      grade = 'D-';
      roast = `"${reason}"? 핑계는 청산유수네. 그냥 사고 싶었다고 솔직히 말해.`;
      actions = [
        "장바구니에 넣고 3일 뒤에 결제하기",
        "충동구매 방지용 '생각 의자' 앉기",
        "방 청소하면서 안 쓰는 물건 당근마켓에 올리기"
      ];
    } else {
      grade = 'C';
      roast = `${item}.. 애매하다 애매해. 차라리 저축을 하지 그랬어?`;
      actions = [
        "왜 샀는지 일기장에 3줄 이상 반성문 쓰기",
        "다음엔 결제 버튼 누르기 전에 심호흡 5번 하기",
        "지출 내역 다시 보며 반성하기"
      ];
    }
  }

  return { 
    type: type,
    grade: grade,
    roast_message: roast,
    action_items: actions
  };
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
