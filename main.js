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
  const downloadLink = document.getElementById('download-link');
  const effectsLayer = document.getElementById('effects-layer');
  const body = document.body;

  // Preview Modal Elements
  const previewModal = document.getElementById('preview-modal');
  const previewImageContainer = document.getElementById('preview-image-container');
  const finalDownloadBtn = document.getElementById('final-download-btn');
  const closePreviewBtn = document.getElementById('close-preview-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const itemInput = document.getElementById('item');
      const priceInput = document.getElementById('price');
      const reasonInput = document.getElementById('reason');
      const submitBtn = document.getElementById('submit-btn');
      const loadingContainer = document.getElementById('loading-container');
      const progressFill = document.getElementById('progress-fill');
      const loadingTextEl = document.getElementById('dynamic-loading-text');

      if (!itemInput || !priceInput || !reasonInput) return;

      const item = itemInput.value;
      const price = parseInt(priceInput.value);
      const reason = reasonInput.value;

      if (!item || isNaN(price) || !reason) {
        alert("모든 항목을 입력해주세요.");
        return;
      }

      // 1. Enter Loading State
      submitBtn.classList.add('hidden');
      loadingContainer.classList.remove('hidden');
      progressFill.style.width = '100%';

      const loadingTexts = [
        "인터넷에서 실시간 시세를 검색 중...",
        "공식 사이트의 가격 데이터와 대조 중...",
        "당신의 소비 유혹 패턴을 정밀 분석 중...",
        "미래의 기대 수익 손실을 계산 중...",
        "뼈 때리는 맞춤형 행동 강령 작성 중..."
      ];
      let textIdx = 0;
      const loadingInterval = setInterval(() => {
        if (loadingTextEl) {
          loadingTextEl.textContent = loadingTexts[textIdx % loadingTexts.length];
          textIdx++;
        }
      }, 500);

      // Reset previous results
      resetEffects();
      resultZone.classList.add('hidden');
      book.classList.remove('open');

      // 2. Simulated Delay
      setTimeout(() => {
        clearInterval(loadingInterval);
        
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

        const gradeStamp = document.getElementById('report-grade');
        if (gradeStamp) {
          gradeStamp.style.color = result.type === 'GOOD' ? '#00cc66' : '#ff0055';
          gradeStamp.style.borderColor = result.type === 'GOOD' ? '#00cc66' : '#ff0055';
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

        loadingContainer.classList.add('hidden');
        progressFill.style.width = '0%';
        submitBtn.classList.remove('hidden');
        
        if (resultZone) {
          resultZone.classList.remove('hidden');
          triggerEffects(result.type);
          resultZone.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        if (book) {
          setTimeout(() => { book.classList.add('open'); }, 500);
        }
      }, 2500);
    });
  }

  // Download & Preview Logic
  if (downloadLink) {
    downloadLink.addEventListener('click', (e) => {
      e.preventDefault(); 
      if (typeof html2canvas === 'undefined') {
        alert("이미지 저장 라이브러리 로딩 중... 잠시 후 다시 시도해주세요.");
        return;
      }

      if (!book) return;

      downloadLink.textContent = "⌛ 이미지 생성 중...";
      downloadLink.style.pointerEvents = "none";

      const originalTransform = book.style.transform;
      const originalTransition = book.style.transition;
      
      // Temporarily flatten for high-quality capture
      book.style.transition = "none";
      book.style.transform = "translateX(0) rotateY(0deg)";
      
      const cover = document.querySelector('.book-cover');
      const leftPage = document.querySelector('.book-page.left');
      if(cover) cover.style.display = "none";
      if(leftPage) leftPage.style.zIndex = "10";

      setTimeout(() => {
        html2canvas(book, { 
          backgroundColor: "#ffffff", 
          scale: 3, // High Resolution
          useCORS: true,
          logging: false
        }).then(canvas => {
          // Restore
          book.style.transform = originalTransform;
          book.style.transition = originalTransition;
          if(cover) cover.style.display = "";
          if(leftPage) leftPage.style.zIndex = "";
          
          downloadLink.textContent = "💾 영수증 & 처방전 이미지로 소장하기";
          downloadLink.style.pointerEvents = "auto";

          // Show Preview
          const imgData = canvas.toDataURL("image/png");
          if (previewImageContainer) {
            previewImageContainer.innerHTML = `<img src="${imgData}" alt="Report Preview">`;
          }
          if (finalDownloadBtn) {
            finalDownloadBtn.href = imgData;
            finalDownloadBtn.download = `gemini_survival_report_${new Date().getTime()}.png`;
          }
          if (previewModal) previewModal.classList.remove('hidden');
        }).catch(err => {
          console.error("Capture Failed:", err);
          alert("이미지 생성에 실패했습니다.");
          downloadLink.textContent = "💾 영수증 & 처방전 이미지로 소장하기";
          downloadLink.style.pointerEvents = "auto";
        });
      }, 200);
    });
  }

  if (closePreviewBtn) {
    closePreviewBtn.addEventListener('click', () => {
      previewModal.classList.add('hidden');
    });
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

  // User Count
  const userCountEl = document.getElementById('user-count');
  if (userCountEl) {
    let count = 1248;
    setInterval(() => {
      count += Math.floor(Math.random() * 3);
      userCountEl.textContent = count.toLocaleString();
    }, 10000);
  }

  // Guide Book Logic
  if (guideLink) {
    guideLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (guideOverlay) guideOverlay.classList.remove('hidden');
      if (guideBook) { setTimeout(() => { guideBook.classList.add('open'); }, 100); }
    });
  }

  if (closeGuideBtn) {
    closeGuideBtn.addEventListener('click', () => {
      if (guideBook) guideBook.classList.remove('open');
      if (guideOverlay) { setTimeout(() => { guideOverlay.classList.add('hidden'); }, 800); }
    });
  }

  // Contact & Share Toggle
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

  // Algorithm & FAQ Toggle
  const toggleAlgoBtn = document.getElementById('toggle-algo-btn');
  const algoContent = document.getElementById('algo-content');
  if (toggleAlgoBtn && algoContent) {
    toggleAlgoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      algoContent.classList.toggle('hidden');
      toggleAlgoBtn.classList.toggle('active');
    });
  }

  const toggleFaqBtn = document.getElementById('toggle-faq-btn');
  const faqContent = document.getElementById('faq-content');
  if (toggleFaqBtn && faqContent) {
    toggleFaqBtn.addEventListener('click', (e) => {
      e.preventDefault();
      faqContent.classList.toggle('hidden');
      toggleFaqBtn.classList.toggle('active');
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === previewModal) previewModal.classList.add('hidden');
  });

  // Finance Quotes Logic
  const quotes = [
    { text: "소비하고 남은 돈을 저축하는 것이 아니라, 저축하고 남은 돈을 소비하라.", author: "워렌 버핏" },
    { text: "가격은 당신이 지불하는 것이고, 가치는 당신이 얻는 것이다.", author: "워렌 버핏" },
    { text: "잠자는 동안에도 돈이 들어오는 방법을 찾아내지 못한다면, 당신은 죽을 때까지 일해야 할 것이다.", author: "워렌 버핏" },
    { text: "부자가 되기 위해 필요한 것은 똑똑함이 아니라, 인내심이다.", author: "찰리 멍거" },
    { text: "투자의 성공 여부는 얼마나 오랫동안 세상의 비관론을 무시할 수 있는지에 달려있다.", author: "피터 린치" },
    { text: "부자들은 자산을 산다. 가난한 사람들은 오직 지출만 한다.", author: "로버트 기요사키" },
    { text: "복리는 세계 8대 불가사의다.", author: "알베르트 아인슈타인" },
    { text: "돈은 최선의 하인이자, 최악의 주인이다.", author: "프랜시스 베이컨" }
  ];

  let currentQuoteIndex = 0;
  const qText = document.getElementById('quote-text');
  const qAuthor = document.getElementById('quote-author');
  const qCont = document.getElementById('quote-container');

  function updateQuote() {
    if (!qCont || !qText || !qAuthor) return;
    qCont.classList.add('fade');
    setTimeout(() => {
      currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
      qText.textContent = `"${quotes[currentQuoteIndex].text}"`;
      qAuthor.textContent = `- ${quotes[currentQuoteIndex].author} -`;
      qCont.classList.remove('fade');
    }, 800);
  }
  setInterval(updateQuote, 5000);

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
      if (body) body.classList.add('mode-good');
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
    if (!effectsLayer) return;
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
  const marketPrices = {
    // 📱 Apple
    '아이폰 16 프로 맥스': 1900000, '아이폰 16 프로': 1550000, '아이폰 16': 1250000,
    '아이폰 15 프로': 1550000, '아이폰 15': 1250000,
    '아이패드 프로 M4': 1700000, '아이패드 에어': 999000,
    '맥북 프로 16': 3690000, '맥북 에어 M1': 725000,
    // 📱 Samsung
    '갤럭시 S24 울트라': 1698400, '갤럭시 S24': 1155000, 'Z 폴드 6': 2229700, 'Z 플립 6': 1485000,
    // 🪑 Furniture
    'IKEA 빌리': 99000, 'IKEA Billy': 99000, 'IKEA 칼락스': 69000, '허먼밀러 에어론': 2200000,
    // ☕ Food
    '커피': 5000, '마라탕': 12000, '치킨': 28000, '피자': 30000, '회': 50000,
    // 🏠 Misc
    '책': 18000, '영화': 15000, '닌텐도 스위치': 360000, '플스 5': 688000
  };

  const food = ['마라탕', '커피', '치킨', '술', '밥'].some(f => item.includes(f));
  const tech = ['컴퓨터', '맥북', '폰', '아이폰', '갤럭시', '에어팟', '플스', '닌텐도'].some(t => item.includes(t));
  const goodItems = ['책', '강의', '기부', '저축', '운동', '영양제'].some(g => item.includes(g));

  let marketMatch = null;
  let maxLen = 0;
  for (const key in marketPrices) {
    if (item.replace(/\s/g, '').toLowerCase().includes(key.replace(/\s/g, '').toLowerCase())) {
      if (key.length > maxLen) { marketMatch = key; maxLen = key.length; }
    }
  }

  let type = 'BAD', grade = 'F', short_roast = "";
  let analysis = "", psychology = "", actions = [];

  const gukbapCount = (price / 10000).toFixed(1);
  const workHours = (price / 10030).toFixed(1);
  const futureValue = Math.floor(price * Math.pow(1.05, 10));

  analysis = `이 돈(${price.toLocaleString()}원)이면 국밥 ${gukbapCount}그릇을 먹거나 최저시급 기준 약 ${workHours}시간을 일해야 합니다.`;

  if (reason.includes('스트레스') || reason.includes('우울')) {
    psychology = "전형적인 '감정적 회피형 소비'입니다. 결제 순간의 도파민 분비로 현실의 고통을 덮으려 하고 있습니다.";
  } else if (reason.includes('그냥') || reason.includes('예뻐서') || reason.includes('세일')) {
    psychology = "이성적 제어가 마비된 '충동형 소비'입니다. '합리화'라는 가면을 쓴 자아의 유혹에 굴복한 상태입니다.";
  } else {
    psychology = "소비의 타당성을 스스로 합리화하고 있습니다. 정말 필요해서 산 것인지 냉정하게 자문해보십시오.";
  }

  if (marketMatch && price <= marketPrices[marketMatch] * 0.7) {
    type = 'GOOD'; grade = 'S';
    short_roast = `대박! ${marketMatch} 시세 파괴 수준입니다.`;
    analysis += ` 시세(${marketPrices[marketMatch].toLocaleString()}원) 대비 압도적으로 저렴하게 구매하셨습니다.`;
    actions = ["아낀 돈 즉시 저축", "구매 팁 전수", "자만 금지"];
  } else if (marketMatch && price <= marketPrices[marketMatch] * 1.3) {
    type = 'GOOD'; grade = 'B+';
    short_roast = "적정가 구매. 손해는 안 봤음.";
    analysis += ` 공식 시세 범위 내에서 구매하셨습니다.`;
    actions = ["가계부 기록", "예산 점검", "만족도 체크"];
  } else if (marketMatch && price > marketPrices[marketMatch] * 1.3) {
    type = 'BAD'; grade = 'F';
    const mult = (price / marketPrices[marketMatch]).toFixed(1);
    short_roast = `${mult}배 비싼 '프리미엄 호구'.`;
    analysis += ` 시세(${marketPrices[marketMatch].toLocaleString()}원)보다 ${mult}배나 비쌉니다.`;
    actions = ["가격 비교 필수", "환불 고려", "반성문 쓰기"];
  } else if (goodItems || price < 5000) {
    type = 'GOOD'; grade = 'A';
    short_roast = "나를 위한 투자 혹은 무해한 소비.";
    actions = ["꾸준함 유지", "스스로 칭찬", "저축액 상향"];
  } else {
    short_roast = "애매한 지출. 차라리 저축을?";
    actions = ["장바구니 3일 숙성", "무지출 도전", "필수품 재정의"];
  }

  // Content for Guide Book (Upgraded)
  let guide_intro = (type === 'GOOD') 
    ? `[STATUS: STABLE]\n귀하의 금융 생존 신호는 긍정적입니다. 자산 유동성을 해치지 않는 범위 내에서 합리적인 의사결정이 이루어졌습니다.`
    : `[STATUS: CRITICAL]\n경고: 귀하의 금융 생존 신호에 '적색경보'가 켜졌습니다. 악성 부채 성격의 지출로 판단됩니다.`;

  let guide_ch1 = `
    <strong>[정밀 경제 분석]</strong><br>
    ${analysis}<br>
    만약 이 돈을 연 5% 복리로 투자했다면, 10년 후 약 <strong>${futureValue.toLocaleString()}원</strong>의 가치였을 것입니다.<br><br>
    <strong>[심층 심리 프로파일링]</strong><br>
    ${psychology} 도파민 분비는 일시적일 뿐이며, 남는 것은 통장의 공허함임을 직시하십시오.
  `;

  let guide_ch2 = `<strong>[행동 강령]</strong><br><br>`;
  actions.forEach((act, index) => {
    const category = ["[긴급 처방]", "[환경 통제]", "[행동 교정]"][index % 3];
    guide_ch2 += `<strong>${category} ${act}</strong><br><br>`;
  });

  let guide_ch3 = `종합 판정 결과, 귀하의 최종 생존 등급은 [ ${grade} ] 입니다. 3개월 후 이 패턴이 지속된다면 당신의 자산은 ${(type === 'GOOD' ? '우상향' : '파산선고')}를 향할 것입니다.`;
  let guide_warning = (type === 'BAD') ? `[경고] 지금 멈추지 않으면 다음은 파산입니다.` : `[조언] 합리적 흐름을 꾸준히 유지하십시오.`;

  return { type, grade, short_roast, analysis, psychology, actions, guide_intro, guide_ch1, guide_ch2, guide_ch3, guide_warning };
}

function typeWriter(text, element) {
  let i = 0; element.textContent = '';
  function type() { if (i < text.length) { element.textContent += text.charAt(i); i++; setTimeout(type, 30); } }
  type();
}