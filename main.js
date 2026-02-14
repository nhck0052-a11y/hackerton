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
  // 0. 시세 데이터 (Deep Learning from Provided Legacy & Performance Data)
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

    // ☕ Food & General (Backup)
    '커피': 5000, '마라탕': 12000, '치킨': 28000, '피자': 30000, '삼겹살': 18000, '회': 50000,
    '택시': 12000, '영화': 15000, '넷플릭스': 17000, '유튜브': 14900
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