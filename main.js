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
  
  // Prescription Elements
  const rxGrade = document.getElementById('rx-grade');
  const rxActions = document.getElementById('rx-actions');
  
  // Guide Book Elements
  const guideLink = document.getElementById('guide-link');
  const guideOverlay = document.getElementById('guide-overlay');
  const guideBook = document.getElementById('guide-book');
  const closeGuideBtn = document.getElementById('close-guide-btn');

  // Nav/Download
  const homeBtn = document.getElementById('home-btn');
  const downloadBtn = document.getElementById('download-btn');
  const effectsLayer = document.getElementById('effects-layer');
  const body = document.body;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    resetEffects();

    const item = document.getElementById('item').value;
    const price = parseInt(document.getElementById('price').value);
    const reason = document.getElementById('reason').value;

    if (!item || isNaN(price) || !reason) return;

    rItem.textContent = item.length > 15 ? item.substring(0, 15) + '...' : item;
    rPrice.textContent = '₩' + price.toLocaleString();
    rReason.textContent = reason;
    rTotal.textContent = '₩' + price.toLocaleString();
    rTimestamp.textContent = new Date().toLocaleDateString('ko-KR');

    const result = generateAnalysis(item, price, reason);
    rRoast.textContent = ""; 
    typeWriter(result.roast_message, rRoast); 
    rxGrade.textContent = result.grade;
    rxActions.innerHTML = result.action_items.map(action => `<li>${action}</li>`).join('');
    
    resultZone.classList.remove('hidden');
    triggerEffects(result.type);
    resultZone.scrollIntoView({ behavior: 'smooth', block: 'start' });

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
    }, 500);
  });

  downloadBtn.addEventListener('click', () => {
    html2canvas(book, { backgroundColor: null, scale: 2 }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'gemini_report.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  });

  // Guide Book Logic
  guideLink.addEventListener('click', (e) => {
    e.preventDefault();
    guideOverlay.classList.remove('hidden');
    setTimeout(() => {
      guideBook.classList.add('open');
    }, 100);
  });

  closeGuideBtn.addEventListener('click', () => {
    guideBook.classList.remove('open');
    setTimeout(() => {
      guideOverlay.classList.add('hidden');
    }, 800);
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
        document.querySelector('.book-page.left .page-content').appendChild(stamp);
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
  const marketPrices = {
    '아이폰 16 프로 맥스': 1900000, '아이폰 16 프로': 1550000, '아이폰 16': 1250000,
    '갤럭시 S24 울트라': 1698400, '갤럭시 S24': 1155000, 'Z 폴드 6': 2229700, 'Z 플립 6': 1485000,
    '맥북 프로 16': 3690000, '맥북 에어 13': 1590000, 'LG 그램': 1800000,
    '커피': 5000, '마라탕': 12000, '치킨': 28000, '피자': 30000, '회': 50000,
    '소주': 5000, '맥주': 6000, '영화': 15000, '넷플릭스': 17000
  };

  const food = ['마라탕', '커피', '치킨', '술', '밥', '떡볶이', '피자', '배달'].some(f => item.includes(f));
  const tech = ['컴퓨터', '맥북', '폰', '아이폰', '갤럭시', '에어팟', '플스', '닌텐도'].some(t => item.includes(t));
  const goodItems = ['책', '강의', '기부', '저축', '운동', '영양제'].some(g => item.includes(g));

  let marketMatch = null;
  let maxLen = 0;
  for (const key in marketPrices) {
    if (item.replace(/\s/g, '').includes(key.replace(/\s/g, ''))) {
      if (key.length > maxLen) { marketMatch = key; maxLen = key.length; }
    }
  }

  let type = 'BAD', grade = 'F', roast = "", actions = [];

  if (marketMatch && price <= marketPrices[marketMatch] * 0.7) {
    type = 'GOOD'; grade = 'S';
    roast = `대박! ${marketMatch}를 ${price.toLocaleString()}원에? 정가 ${(marketPrices[marketMatch]).toLocaleString()}원인데... 득템 인정!`;
    actions = ["남은 돈 저축하기", "꿀팁 공유하기", "스스로 칭찬하기"];
  } else if (marketMatch && price > marketPrices[marketMatch] * 1.2) {
    const multiple = Math.floor(price / marketPrices[marketMatch]);
    if (multiple >= 3) {
      grade = 'F-'; roast = `${marketMatch} 정가 ${marketPrices[marketMatch].toLocaleString()}원인데 ${price.toLocaleString()}원? ${multiple}대는 샀겠다. 사기 아님?`;
      actions = ["환불 요청", "소비자 고발", "멘탈 케어"];
    } else {
      grade = 'F'; roast = `${marketMatch}를 ${price.toLocaleString()}원에? 호구 잡혔네.`;
      actions = ["최저가 검색 습관화", "영수증 파기"];
    }
  } else if (goodItems || (price < 5000)) {
    type = 'GOOD'; grade = 'A'; roast = `오... ${item}? 합리적인 소비네. 칭찬해.`;
    actions = ["이 흐름 유지하기", "저축하기"];
  } else {
    roast = `${item}.. 굳이? 차라리 저축을 하지 그랬어?`;
    actions = ["결제 전 심호흡", "일기 쓰기"];
  }

  return { type, grade, roast_message: roast, action_items: actions };
}

function typeWriter(text, element) {
  let i = 0; element.textContent = '';
  const speed = 30;
  function type() {
    if (i < text.length) { element.textContent += text.charAt(i); i++; setTimeout(type, speed); }
  }
  type();
}