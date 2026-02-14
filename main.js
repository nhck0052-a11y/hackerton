document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('spending-form');
  const resultZone = document.getElementById('result-zone');
  
  // Receipt Elements
  const rItem = document.getElementById('receipt-item');
  const rPrice = document.getElementById('receipt-price');
  const rReason = document.getElementById('receipt-reason');
  const rTotal = document.getElementById('receipt-total');
  const rTimestamp = document.getElementById('timestamp');
  const rRoast = document.getElementById('ai-roast-text');
  
  // Prescription Elements
  const rxCard = document.getElementById('prescription');
  const rxGrade = document.getElementById('rx-grade');
  const rxActions = document.getElementById('rx-actions');
  
  // Effect Elements
  const body = document.body;
  const effectsLayer = document.getElementById('effects-layer');
  const receiptContainer = document.querySelector('.receipt-printer');
  const homeBtn = document.getElementById('home-btn');
  const downloadBtn = document.getElementById('download-btn');
  
  // Whitepaper Elements
  const whitepaperLink = document.getElementById('whitepaper-link');
  const whitepaperModal = document.getElementById('whitepaper-modal');
  const closeModal = document.querySelector('.close-modal');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    resetEffects();

    // 1. Get Values
    const item = document.getElementById('item').value;
    const price = parseInt(document.getElementById('price').value);
    const reason = document.getElementById('reason').value;

    if (!item || isNaN(price) || !reason) return;

    // 3. Populate Receipt
    rItem.textContent = item.length > 15 ? item.substring(0, 15) + '...' : item;
    rPrice.textContent = '₩' + price.toLocaleString();
    rReason.textContent = reason;
    rTotal.textContent = '₩' + price.toLocaleString();
    rTimestamp.textContent = new Date().toLocaleString('ko-KR');

    // 4. Generate Analysis (Simulated Gemini API)
    const result = generateAnalysis(item, price, reason);
    
    // Fill Receipt Roast
    rRoast.textContent = ""; 
    typeWriter(result.roast_message, rRoast); 
    
    // Fill Prescription
    rxGrade.textContent = result.grade;
    rxActions.innerHTML = result.action_items.map(action => `<li>${action}</li>`).join('');
    
    // 5. Trigger Visual Effects
    triggerEffects(result.type);

    // 6. Show Result
    resultZone.classList.remove('hidden');
    
    // Show Prescription after delay
    setTimeout(() => {
        rxCard.classList.add('visible');
    }, 1000);
    
    resultZone.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  homeBtn.addEventListener('click', () => {
    resultZone.classList.add('hidden');
    rxCard.classList.remove('visible');
    form.reset();
    resetEffects();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Download Functionality
  downloadBtn.addEventListener('click', () => {
    const captureArea = document.getElementById('capture-area');
    
    // Temporarily remove transform/perspective for clean capture
    resultZone.style.perspective = 'none';
    const receipt = document.getElementById('receipt');
    receipt.style.transform = 'none';
    
    html2canvas(captureArea, {
      backgroundColor: body.classList.contains('mode-good') ? '#fcf8e3' : '#0a0a0a',
      scale: 2 // High res
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'gemini-diagnosis.png';
      link.href = canvas.toDataURL();
      link.click();
      
      // Restore styles
      resultZone.style.perspective = '1000px';
      receipt.style.transform = ''; // Clear inline style to revert to CSS
    });
  });

  // Whitepaper Modal Logic
  whitepaperLink.addEventListener('click', (e) => {
    e.preventDefault();
    whitepaperModal.classList.remove('hidden');
  });

  closeModal.addEventListener('click', () => {
    whitepaperModal.classList.add('hidden');
  });
  
  window.addEventListener('click', (e) => {
    if (e.target === whitepaperModal) {
      whitepaperModal.classList.add('hidden');
    }
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
        receiptContainer.appendChild(stamp);
      }, 1500);

      const marquee = document.createElement('div');
      marquee.classList.add('bad-marquee');
      const warnText = "⚠ 경고: 통장 잔고 비상! 지갑 심폐소생술 필요 ⚠ 💸 내 돈 어디갔니? 💸 ";
      const repeatedText = warnText.repeat(10);
      marquee.innerHTML = `<div class=\"bad-marquee-track\"><span>${repeatedText}</span><span>${repeatedText}</span></div>`;
      document.body.appendChild(marquee);
      
      createFlyingEmojis('💸');

    } else if (type === 'GOOD') {
      body.classList.add('mode-good');
      setTimeout(() => {
        const stamp = document.createElement('div');
        stamp.classList.add('stamp', 'good');
        stamp.innerHTML = 'Certified:<br>Smart Spender';
        receiptContainer.appendChild(stamp);
      }, 1500);
      
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
 * Simulates Gemini AI Analysis returning structured JSON
 */
function generateAnalysis(item, price, reason) {
  const expensive = price > 50000;
  const cheap = price < 10000;
  const food = ['마라탕', '커피', '치킨', '술', '밥', '파스타', '떡볶이', '피자', '배달', '야식'].some(f => item.includes(f));
  const tech = ['컴퓨터', '맥북', '모니터', '키보드', '아이패드', '갤럭시', '아이폰', '에어팟'].some(t => item.includes(t));
  const goodItems = ['책', '강의', '기부', '저축', '운동', '헬스', '영양제', '선물', '효도'].some(g => item.includes(g));

  let type = 'BAD';
  let grade = 'F';
  let roast = "";
  let actions = [];

  if (goodItems || (cheap && !food && !tech)) {
    type = 'GOOD';
    grade = 'A+';
    roast = `오... ${item}? 이건 좀 의외네. 미래를 위한 투자라고 인정해줄게. 칭찬 스티커 하나.`;
    actions = [
      "이 흐름 유지해서 적금 통장 하나 더 만들기",
      "주변 사람들에게 '나 이렇게 산다'고 자랑하기 (동기부여)",
      "남은 돈으로 스스로에게 작은 보상 해주기"
    ];
  } else {
    type = 'BAD';
    
    if (tech) {
      grade = 'D';
      roast = `오.. 장비병 도졌어? ${item} 사면 실력이 늘 것 같지? 응 아니야. 손가락이 문제야.`;
      actions = [
        "일단 산 거 본전 뽑을 때까지 매일 2시간씩 쓰기",
        "중고나라 시세 미리 알아두기 (3개월 뒤를 위해)",
        "다음 달 카드값 나갈 때까지 라면만 먹기"
      ];
    } else if (expensive) {
      grade = 'F';
      roast = `₩${price.toLocaleString()}? 너 혹시 재벌 3세야? ${item}에 이 돈을 태워? 통장 잔고가 울고 있어.`;
      actions = [
        "가계부 어플 설치하고 오늘 지출 빨간색으로 표시하기",
        "일주일 동안 배달 앱 삭제 및 커피 금지",
        "친구들에게 '나 거지임' 선언하고 밥 얻어먹기"
      ];
    } else if (cheap) {
      grade = 'C';
      roast = `겨우 ₩${price.toLocaleString()}? 짠내 난다 짠내 나. 근데 이런 것도 모이면 태산인 거 알지?`;
      actions = [
        "티끌 모아 티끌이라지만, 일단 모아보기",
        "편의점 갈 때마다 1분씩 고민하기",
        "소확행이라는 핑계로 하루 3번 이상 결제 금지"
      ];
    } else {
      grade = 'D-';
      roast = `${item}.. 애매하다 애매해. 차라리 저축을 하지 그랬어?`;
      actions = [
        "왜 샀는지 일기장에 3줄 이상 반성문 쓰기",
        "다음엔 결제 버튼 누르기 전에 심호흡 5번 하기",
        "방 청소하면서 안 쓰는 물건 당근마켓에 올리기"
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