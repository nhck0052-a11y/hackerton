document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('spending-form');
  const resultZone = document.getElementById('result-zone');
  const book = document.getElementById('result-book');
  
  const rItem = document.getElementById('receipt-item');
  const rPrice = document.getElementById('receipt-price');
  const rReason = document.getElementById('receipt-reason');
  const rTotal = document.getElementById('receipt-total');
  const rTimestamp = document.getElementById('timestamp');
  const rRoast = document.getElementById('ai-roast-text');
  
  const guideLink = document.getElementById('guide-link');
  const guideOverlay = document.getElementById('guide-overlay');
  const guideBook = document.getElementById('guide-book');
  const closeGuideBtn = document.getElementById('close-guide-btn');

  const homeBtn = document.getElementById('home-btn');
  const downloadBtn = document.getElementById('download-btn');
  const effectsLayer = document.getElementById('effects-layer');
  const body = document.body;

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      resetEffects();

      const itemInput = document.getElementById('item');
      const priceInput = document.getElementById('price');
      const reasonInput = document.getElementById('reason');

      const item = itemInput.value;
      const price = parseInt(priceInput.value);
      const reason = reasonInput.value;

      if (!item || isNaN(price) || !reason) return;

      rItem.textContent = item.length > 15 ? item.substring(0, 15) + '...' : item;
      rPrice.textContent = '₩' + price.toLocaleString();
      rReason.textContent = reason;
      rTotal.textContent = '₩' + price.toLocaleString();
      rTimestamp.textContent = new Date().toLocaleDateString('ko-KR');

      const result = generateAnalysis(item, price, reason);
      
      rRoast.textContent = ""; 
      typeWriter(result.short_roast, rRoast); 

      document.getElementById('report-date').textContent = `[제${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,'0')}-${String(new Date().getDate()).padStart(2,'0')}호]`;
      document.getElementById('report-analysis').textContent = result.analysis;
      document.getElementById('report-psychology').textContent = result.psychology;
      document.getElementById('report-actions').innerHTML = result.actions.map(action => `<li>${action}</li>`).join('');
      document.getElementById('report-grade').textContent = result.grade;

      document.getElementById('guide-intro').textContent = result.guide_intro;
      document.getElementById('guide-ch1').innerHTML = result.guide_ch1;
      document.getElementById('guide-ch2').innerHTML = result.guide_ch2;
      document.getElementById('guide-ch3').textContent = result.guide_ch3;
      document.getElementById('guide-warning').textContent = result.guide_warning;

      const gradeStamp = document.getElementById('report-grade');
      if (result.type === 'GOOD') {
          gradeStamp.style.color = '#00cc66';
          gradeStamp.style.borderColor = '#00cc66';
      } else {
          gradeStamp.style.color = '#ff0055';
          gradeStamp.style.borderColor = '#ff0055';
      }
      
      resultZone.classList.remove('hidden');
      triggerEffects(result.type);
      resultZone.scrollIntoView({ behavior: 'smooth', block: 'start' });

      setTimeout(() => {
        book.classList.add('open');
      }, 500);
    });
  }

  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      book.classList.remove('open');
      setTimeout(() => {
          resultZone.classList.add('hidden');
          form.reset();
          resetEffects();
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      html2canvas(book, { backgroundColor: null, scale: 2 }).then(canvas => {
        const link = document.createElement('a');
        link.download = 'gemini_report.png';
        link.href = canvas.toDataURL();
        link.click();
      });
    });
  }

  if (guideLink) {
    guideLink.addEventListener('click', (e) => {
      e.preventDefault();
      guideOverlay.classList.remove('hidden');
      setTimeout(() => { guideBook.classList.add('open'); }, 100);
    });
  }

  if (closeGuideBtn) {
    closeGuideBtn.addEventListener('click', () => {
      guideBook.classList.remove('open');
      setTimeout(() => { guideOverlay.classList.add('hidden'); }, 800);
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
        const lp = document.querySelector('.book-page.left .page-content');
        if(lp) lp.appendChild(stamp);
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
        const lp = document.querySelector('.book-page.left .page-content');
        if(lp) lp.appendChild(stamp);
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
      coin.style.setProperty('--fall-duration', duration + 's');
      coin.style.setProperty('--fall-delay', Math.random() * 2 + 's');
      coin.style.setProperty('--coin-scale', Math.random() * 0.5 + 0.6);
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
    '아이폰 6': 27500, 'iPhone 6': 27500, '아이폰 11': 240000, '아이폰 12': 285000,
    '아이폰 13': 430000, '아이폰 14 프로': 725000, '아이폰 15 프로': 950000,
    '아이폰 16 프로': 1350000, '아이폰 17 프로': 2075000,
    '갤럭시 S24 울트라': 975000, 'Z 폴드 6': 2229700,
    '컴퓨터': 1000000, '노트북': 1200000, '맥북 에어 M1': 725000,
    '커피': 5000, '마라탕': 12000, '치킨': 28000, '피자': 30000,
    '책': 18000, '영화': 15000
  };

  const food = ['마라탕', '커피', '치킨', '술', '밥'].some(f => item.includes(f));
  const tech = ['컴퓨터', '맥북', '폰', '아이폰', '갤럭시'].some(t => item.includes(t));
  const goodItems = ['책', '강의', '기부', '저축', '운동'].some(g => item.includes(g));

  let marketMatch = null;
  let maxLen = 0;
  for (const key in marketPrices) {
    if (item.replace(/\s/g, '').includes(key.replace(/\s/g, ''))) {
      if (key.length > maxLen) { marketMatch = key; maxLen = key.length; }
    }
  }

  let type = 'BAD', grade = 'F', short_roast = "";
  let analysis = "", psychology = "", actions = [];

  const gukbapCount = (price / 10000).toFixed(1);
  const workHours = (price / 10030).toFixed(1);
  analysis = `이 돈이면 국밥 ${gukbapCount}그릇을 먹거나 최저시급 ${workHours}시간을 일해야 합니다.`;

  // --- 핵심: 시세 눈치 로직 ---
  // 1. 시세보다 훨씬 쌈 (득템)
  if (marketMatch && price <= marketPrices[marketMatch] * 0.7) {
    type = 'GOOD'; grade = 'S';
    short_roast = "초특급 득템! 이런 게 바로 투자지.";
    analysis += ` 시세(${marketPrices[marketMatch].toLocaleString()}원)보다 30% 이상 저렴하게 구매하셨네요.`;
    psychology = "빈틈없는 시장 조사와 가성비를 쫓는 '사냥꾼'의 심리입니다.";
    actions = ["아낀 돈으로 저축하기", "주변에 자랑하기", "다음에도 이 운 유지하기"];
  } 
  // 2. 시세와 비슷함 (합리적)
  else if (marketMatch && price <= marketPrices[marketMatch] * 1.3) {
    type = 'GOOD'; grade = 'B+';
    short_roast = "합리적인 적정가 구매. 훌륭해.";
    analysis += ` 정가 범위 내에서 필요한 것을 잘 구매하셨습니다.`;
    psychology = "필요와 욕구 사이에서 중심을 잘 잡는 '현상 유지형' 심리입니다.";
    actions = ["계획된 소비 습관 유지", "가계부 기록", "불필요한 지출 방어"];
  }
  // 3. 시세보다 훨씬 비쌈 (호구)
  else if (marketMatch && price > marketPrices[marketMatch] * 1.3) {
    type = 'BAD'; grade = 'F';
    const mult = (price / marketPrices[marketMatch]).toFixed(1);
    short_roast = `시세의 ${mult}배? 이건 좀 심했다.`;
    analysis += ` 시세 대비 ${mult}배나 비싼 비용을 지불하셨습니다. '호구 비용'이 상당합니다.`;
    psychology = "정보 부족 혹은 급박한 결제로 인한 '감정적 과지불' 상태입니다.";
    actions = ["가격 비교 사이트 즐겨찾기", "즉시 환불 고려", "깊은 반성"];
  }
  // 4. 기타 로직 (기존 유지)
  else if (goodItems || price < 5000) {
    type = 'GOOD'; grade = 'A';
    short_roast = "무해하고 유익한 소비입니다.";
    psychology = "자아 성장을 중시하는 안정적인 심리 상태입니다.";
    actions = ["꾸준함 유지", "스스로에게 칭찬", "성장 기록"];
  } else {
    type = 'BAD'; grade = 'D';
    short_roast = "애매한 지출. 차라리 저축을 하지?";
    psychology = "목적 없는 지출로 인한 일시적인 공허함 충족 시도입니다.";
    actions = ["결제 전 10분 고민", "당근마켓 활용", "무지출 챌린지"];
  }

  // Guide Book Content
  let guide_intro = (type === 'GOOD') ? `현재 귀하의 금융 생존 확률은 '매우 높음' 단계입니다.` : `경고: 귀하의 금융 생존 확률은 '위험' 수준입니다.`;
  let guide_ch1 = `<strong>[분석]</strong><br>${analysis}<br><strong>[심리]</strong><br>${psychology}`;
  let guide_ch2 = `귀하를 위한 3계명:<br>` + actions.map((a,i)=>`<strong>${i+1}. ${a}</strong>`).join('<br>');
  let guide_ch3 = `최종 등급: ${grade}. 미래를 위해 오늘을 관리하십시오.`;
  let guide_warning = (type === 'BAD') ? `[경고] 잔고가 0원에 수렴할 수 있습니다.` : `[조언] 합리적 흐름을 유지하십시오.`;

  return { type, grade, short_roast, analysis, psychology, actions, guide_intro, guide_ch1, guide_ch2, guide_ch3, guide_warning };
}

function typeWriter(text, element) {
  let i = 0; element.textContent = '';
  function type() { if (i < text.length) { element.textContent += text.charAt(i); i++; setTimeout(type, 30); } }
  type();
}
