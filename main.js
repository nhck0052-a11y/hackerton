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

  // Contact & Share Elements
  const openContactBtn = document.getElementById('open-contact-btn');
  const contactInlineSection = document.getElementById('contact-inline-section');
  const toggleShareBtn = document.getElementById('toggle-share-btn');
  const shareContainer = document.getElementById('share-container');

  // Nav/Download
  const homeBtn = document.getElementById('home-btn');
  const downloadBtn = document.getElementById('download-btn');
  const effectsLayer = document.getElementById('effects-layer');
  const body = document.body;

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const itemInput = document.getElementById('item');
      const priceInput = document.getElementById('price');
      const reasonInput = document.getElementById('reason');
      const submitBtn = document.getElementById('submit-btn');
      const loadingContainer = document.getElementById('loading-container');
      const progressFill = document.getElementById('progress-fill');

      if (!itemInput || !priceInput || !reasonInput) return;

      const item = itemInput.value;
      const price = parseInt(priceInput.value);
      const reason = reasonInput.value;

      if (!item || isNaN(price) || !reason) {
        alert("모든 항목을 입력해주세요.");
        return;
      }

      // 1. Enter Loading State (Toss Payments UX Style)
      submitBtn.classList.add('hidden');
      loadingContainer.classList.remove('hidden');
      progressFill.style.width = '100%';

      // Reset previous results
      resetEffects();
      resultZone.classList.add('hidden');
      book.classList.remove('open');

      // 2. Simulated Delay for 'Deliberate Analysis'
      setTimeout(() => {
        // Populate Data
        if (rItem) rItem.textContent = item.length > 15 ? item.substring(0, 15) + '...' : item;
        if (rPrice) rPrice.textContent = '₩' + price.toLocaleString();
        if (rReason) rReason.textContent = reason;
        if (rTotal) rTotal.textContent = '₩' + price.toLocaleString();
        if (rTimestamp) rTimestamp.textContent = new Date().toLocaleDateString('ko-KR');

        const result = generateAnalysis(item, price, reason);
        
        if (rRoast) {
          rRoast.textContent = ""; 
          typeWriter(result.short_roast, rRoast); 
        }

        if (reportDate) reportDate.textContent = `[제${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,'0')}-${String(new Date().getDate()).padStart(2,'0')}호]`;
        if (reportAnalysis) reportAnalysis.textContent = result.analysis;
        if (reportPsychology) reportPsychology.textContent = result.psychology;
        if (reportActions) reportActions.innerHTML = result.actions.map(action => `<li>${action}</li>`).join('');
        if (reportGrade) reportGrade.textContent = result.grade;

        if (reportGrade) {
          if (result.type === 'GOOD') {
              reportGrade.style.color = '#00cc66';
              reportGrade.style.borderColor = '#00cc66';
          } else {
              reportGrade.style.color = '#ff0055';
              reportGrade.style.borderColor = '#ff0055';
          }
        }

        const gIntro = document.getElementById('guide-intro');
        const gCh1 = document.getElementById('guide-ch1');
        const gCh2 = document.getElementById('guide-ch2');
        const gCh3 = document.getElementById('guide-ch3');
        const gWarn = document.getElementById('guide-warning');

        if (gIntro) gIntro.textContent = result.guide_intro;
        if (gCh1) gCh1.innerHTML = result.guide_ch1;
        if (gCh2) gCh2.innerHTML = result.guide_ch2;
        if (gCh3) gCh3.textContent = result.guide_ch3;
        if (gWarn) gWarn.textContent = result.guide_warning;

        // 3. Reveal Results
        loadingContainer.classList.add('hidden');
        progressFill.style.width = '0%';
        submitBtn.classList.remove('hidden');
        
        if (resultZone) {
          resultZone.classList.remove('hidden');
          triggerEffects(result.type);
          resultZone.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        if (book) {
          setTimeout(() => {
            book.classList.add('open');
          }, 500);
        }
      }, 2000); // 2 second psychological wait
    });
  }

  // Dynamic User Count (Social Proof)
  const userCountEl = document.getElementById('user-count');
  if (userCountEl) {
    let count = 1248;
    setInterval(() => {
      count += Math.floor(Math.random() * 3);
      userCountEl.textContent = count.toLocaleString();
    }, 10000);
  }

  if (homeBtn) {
    homeBtn.addEventListener('click', () => {
      if (book) book.classList.remove('open');
      setTimeout(() => {
          if (resultZone) resultZone.classList.add('hidden');
          if (form) form.reset();
          resetEffects();
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default link behavior
      if (typeof html2canvas === 'undefined') {
        alert("이미지 저장 라이브러리를 로딩 중입니다. 잠시 후 다시 시도해주세요.");
        return;
      }
      if (book) {
        html2canvas(book, { backgroundColor: null, scale: 2 }).then(canvas => {
          const link = document.createElement('a');
          link.download = 'gemini_report.png';
          link.href = canvas.toDataURL();
          link.click();
        });
      }
    });
  }

  // Guide Book Interaction
  if (guideLink) {
    guideLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (guideOverlay) guideOverlay.classList.remove('hidden');
      if (guideBook) {
        setTimeout(() => {
          guideBook.classList.add('open');
        }, 100);
      }
    });
  }

  if (closeGuideBtn) {
    closeGuideBtn.addEventListener('click', () => {
      if (guideBook) guideBook.classList.remove('open');
      if (guideOverlay) {
        setTimeout(() => {
          guideOverlay.classList.add('hidden');
        }, 800);
      }
    });
  }

  // Contact Toggle
  if (openContactBtn && contactInlineSection) {
    openContactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (contactInlineSection.classList.contains('hidden')) {
        contactInlineSection.classList.remove('hidden');
        setTimeout(() => { contactInlineSection.classList.add('open'); }, 10);
        openContactBtn.textContent = "🤝 닫기";
      } else {
        contactInlineSection.classList.remove('open');
        setTimeout(() => { contactInlineSection.classList.add('hidden'); }, 500);
        openContactBtn.textContent = "🤝 비즈니스 및 제휴 문의";
      }
    });
  }

  // Share Toggle
  if (toggleShareBtn && shareContainer) {
    toggleShareBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (shareContainer.classList.contains('hidden')) {
        shareContainer.classList.remove('hidden');
        setTimeout(() => { shareContainer.classList.add('open'); }, 10);
        toggleShareBtn.textContent = "📣 공유 창 닫기";
      } else {
        shareContainer.classList.remove('open');
        setTimeout(() => { shareContainer.classList.add('hidden'); }, 400);
        toggleShareBtn.textContent = "📣 친구에게 공유하기";
      }
    });
  }

  // Finance Quotes Logic
  const quotes = [
    { text: "소비하고 남은 돈을 저축하는 것이 아니라, 저축하고 남은 돈을 소비하라.", author: "워렌 버핏" },
    { text: "가격은 당신이 지불하는 것이고, 가치는 당신이 얻는 것이다.", author: "워렌 버핏" },
    { text: "잠자는 동안에도 돈이 들어오는 방법을 찾아내지 못한다면, 당신은 죽을 때까지 일해야 할 것이다.", author: "워렌 버핏" },
    { text: "부자가 되기 위해 필요한 것은 똑똑함이 아니라, 인내심이다.", author: "찰리 멍거" },
    { text: "투자의 성공 여부는 얼마나 오랫동안 세상의 비관론을 무시할 수 있는지에 달려있다.", author: "피터 린치" },
    { text: "비관론이 극에 달했을 때가 가장 좋은 매수 기회이며, 낙관론이 극에 달했을 때가 가장 좋은 매도 기회다.", author: "존 템플턴" },
    { text: "부자들은 자산을 산다. 가난한 사람들은 오직 지출만 한다. 중산층은 부채를 자산이라고 착각하며 산다.", author: "로버트 기요사키" },
    { text: "투자가 즐겁다면, 당신은 아마도 돈을 벌지 못하고 있을 것이다. 좋은 투자는 지루한 법이다.", author: "조지 소로스" },
    { text: "투자란 철저한 분석 하에 원금의 안전과 적절한 수익을 약속하는 행위다.", author: "벤자민 그레이엄" },
    { text: "절약하고 투자하라. 그리고 기다려라. 그것이 전부다.", author: "짐 로저스" },
    { text: "사소한 비용을 조심하라. 작은 구멍이 거대한 배를 침몰시킨다.", author: "벤자민 프랭클린" },
    { text: "돈을 빌리러 가는 것은 자유를 팔러 가는 것이다.", author: "벤자민 프랭클린" },
    { text: "당신이 번 돈보다 적게 쓰는 법을 안다면, 당신은 현자의 돌을 가진 것이다.", author: "토마스 제퍼슨" },
    { text: "가난한 사람은 가진 것이 적은 사람이 아니라, 더 많은 것을 바라는 사람이다.", author: "세네카" },
    { text: "복리는 세계 8대 불가사의다. 이를 이해하는 자는 돈을 벌고, 이해하지 못하는 자는 돈을 낸다.", author: "알베르트 아인슈타인" },
    { text: "가난한 사람에게 가장 필요한 것은 돈이 아니라, 절약하는 지혜다.", author: "탈무드" },
    { text: "돈이 말을 하면, 진실은 침묵한다.", author: "속담" },
    { text: "돈이 많은 사람과 부자인 사람은 다르다.", author: "코코 샤넬" },
    { text: "젊었을 때는 돈이 인생의 전부라고 생각했다. 늙고 보니 그 생각이 맞았다.", author: "오스카 와일드" },
    { text: "돈은 최선의 하인이자, 최악의 주인이다.", author: "프랜시스 베이컨" },
    { text: "신용카드를 잘라버려라. 빚을 갚는 것이야말로 최고의 수익률을 보장하는 투자다.", author: "마크 큐반" },
    { text: "남들처럼 살지 마라. 그래야 나중에는 남들이 살 수 없는 삶을 살 수 있다.", author: "데이브 램지" },
    { text: "돈을 버는 것은 운이 아니다. 그것은 기술이다.", author: "나발 라비칸트" },
    { text: "부자가 되는 유일한 방법은 가진 돈을 쓰지 않는 것이다. 이것이 부를 축적하는 유일한 길이다.", author: "모건 하우절" },
    { text: "가난하게 태어난 것은 당신의 실수가 아니지만, 가난하게 죽는 것은 당신의 실수다.", author: "빌 게이츠" },
    { text: "돈은 단순히 노동력과 재화를 교환하는 정보 시스템일 뿐이다.", author: "일론 머스크" },
    { text: "검소함은 혁신을 낳는다. 탈출구가 없을 때 비로소 창의력이 발휘된다.", author: "제프 베조스" },
    { text: "성공의 비밀은 '복리'의 힘을 당신의 편으로 만드는 것이다.", author: "토니 로빈스" }
  ];

  let currentQuoteIndex = 0;
  const quoteContainer = document.getElementById('quote-container');
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');

  function updateQuote() {
    if (!quoteContainer || !quoteText || !quoteAuthor) return;
    
    quoteContainer.classList.add('fade');
    
    setTimeout(() => {
      currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
      quoteText.textContent = `"${quotes[currentQuoteIndex].text}"`;
      quoteAuthor.textContent = `- ${quotes[currentQuoteIndex].author} -`;
      quoteContainer.classList.remove('fade');
    }, 800); // Half of transition time
  }

  setInterval(updateQuote, 5000);

  // Algorithm Toggle Logic
  const toggleAlgoBtn = document.getElementById('toggle-algo-btn');
  const algoContent = document.getElementById('algo-content');

  if (toggleAlgoBtn && algoContent) {
    toggleAlgoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isHidden = algoContent.classList.contains('hidden');
      if (isHidden) {
        algoContent.classList.remove('hidden');
        toggleAlgoBtn.classList.add('active');
      } else {
        algoContent.classList.add('hidden');
        toggleAlgoBtn.classList.remove('active');
      }
    });
  }

  function resetEffects() {
    if (body) body.classList.remove('mode-bad', 'mode-good');
    if (effectsLayer) effectsLayer.innerHTML = '';
    const oldStamps = document.querySelectorAll('.stamp');
    oldStamps.forEach(s => s.remove());
    const oldMarquees = document.querySelectorAll('.bad-marquee');
    oldMarquees.forEach(m => m.remove());
  }

  function triggerEffects(type) {
    if (type === 'BAD') {
      if (body) body.classList.add('mode-bad');
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
      if (body) document.body.appendChild(marquee);
      
      createFlyingEmojis('💸');

    } else if (type === 'GOOD') {
      if (body) body.classList.add('mode-good');
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
    if (!effectsLayer) return;
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
    if (!effectsLayer) return;
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

  // --- GUIDE BOOK CONTENT GENERATION (Advanced AI Logic) ---
  let guide_intro = "";
  let guide_ch1 = "";
  let guide_ch2 = "";
  let guide_ch3 = "";
  let guide_warning = "";

  // 1. Introduction: Financial Vital Signs
  if (type === 'GOOD') {
    if (grade === 'S') {
      guide_intro = `[STATUS: LEGENDARY]\n귀하의 금융 생존 신호는 '초월적(Transcendent)'입니다. 단순한 소비를 넘어 시장의 비효율성을 공략하여 가치를 창출하는 '알파(Alpha) 투자자'의 자질을 보이고 있습니다.`;
    } else {
      guide_intro = `[STATUS: STABLE]\n귀하의 금융 생존 신호는 '안정적(Stable)'입니다. 자산 유동성을 해치지 않는 범위 내에서 합리적인 의사결정이 이루어졌으며, 이는 장기적인 재무 건전성에 긍정적인 신호입니다.`;
    }
  } else {
    guide_intro = `[STATUS: CRITICAL]\n경고: 귀하의 금융 생존 신호에 '적색경보'가 켜졌습니다. 입력하신 지출(${item})은 귀하의 자산 포트폴리오에 심각한 균열을 일으키는 '악성 부채'의 성격을 띠고 있습니다. 즉각적인 재무 심폐소생술이 필요합니다.`;
  }

  // 2. Chapter 1: Deep Analysis (Economics & Psychology)
  // Calculate Future Value (FV) - 10 years, 5% interest
  const futureValue = Math.floor(price * Math.pow(1.05, 10));
  const lossText = type === 'BAD' 
    ? `만약 이 돈을 연 5% 복리로 투자했다면, 10년 후 약 <span style="color:#ff0055; font-weight:bold;">${futureValue.toLocaleString()}원</span>이 되었을 것입니다. 귀하는 단순히 ${price.toLocaleString()}원을 쓴 것이 아니라, 미래의 가능성을 태워버린 것입니다.`
    : `이 소비는 단순한 지출이 아니라, 귀하의 삶의 질을 높이거나 자산을 방어하는 유효한 '투입(Input)'입니다. 기회비용 대비 효용 가치가 더 큽니다.`;

  guide_ch1 = `
    <strong>[정밀 경제 분석: 기회비용]</strong><br>
    ${lossText}<br>
    또한, 이는 최저시급 기준 약 <strong>${workHours}시간</strong>의 노동력과 맞바꾼 등가교환입니다.<br><br>
    <strong>[심층 심리 프로파일링]</strong><br>
    ${psychology} 뇌과학적으로 볼 때, 결제 순간의 도파민 분비는 3분 내로 사라집니다. 귀하에게 남는 것은 '물건'이 아니라 '통장의 공허함' 뿐임을 직시하십시오.
  `;

  // 3. Chapter 2: Action Plan (Structured)
  const actionCategory = type === 'GOOD' ? ['[강화 행동]', '[확장 전략]', '[마인드셋]'] : ['[긴급 처방]', '[환경 통제]', '[행동 교정]'];
  
  guide_ch2 = `귀하의 생존 등급 [${grade}]에 따른 단계별 솔루션입니다.<br><br>`;
  actions.forEach((act, index) => {
    // Add specific detailed quotes based on type
    const detailQuote = (type === 'GOOD') 
      ? ["작은 스노우볼이 거대한 자산이 됩니다.", "성공의 경험을 기록하여 뇌에 각인시키십시오.", "주변의 부러움이 아닌, 내일의 자유를 즐기십시오."][index % 3]
      : ["출혈을 막는 것이 자산 증식보다 우선입니다.", "소비 트리거(Trigger)를 물리적으로 차단하십시오.", "불편함만이 당신을 구원할 수 있습니다."][index % 3];

    guide_ch2 += `<strong>${actionCategory[index % 3]} ${act}</strong><br>- ${detailQuote}<br><br>`;
  });

  // 4. Chapter 3: Verdict & Projection
  if (type === 'GOOD') {
    guide_ch3 = `[3개월 후 예측] 현재의 규율을 유지한다면, 귀하의 자산은 우상향 곡선을 그릴 것입니다. '경제적 자유'라는 목적지에 한 걸음 더 다가섰습니다.`;
    guide_warning = `[조언] 방심은 금물입니다. 시스템을 믿고 계속 나아가십시오.`;
  } else {
    guide_ch3 = `[3개월 후 예측] 이 패턴이 지속될 경우, 귀하는 '만성적 현금 흐름 부족'에 시달리게 됩니다. 신용카드 리볼빙이나 대출의 유혹이 귀하를 기다리고 있습니다.`;
    guide_warning = `[경고] 지금 멈추지 않으면, 다음 번 분석 결과는 '파산'일 것입니다.`;
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