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
  
  // Effect Elements
  const body = document.body;
  const effectsLayer = document.getElementById('effects-layer');
  const receiptContainer = document.querySelector('.receipt-printer'); // For stamp positioning
  const homeBtn = document.getElementById('home-btn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Reset effects first
    resetEffects();

    // 1. Get Values
    const item = document.getElementById('item').value;
    const price = parseInt(document.getElementById('price').value);
    const reason = document.getElementById('reason').value;

    // 2. Validate (Basic)
    if (!item || isNaN(price) || !reason) return;

    // 3. Populate Receipt
    rItem.textContent = item.length > 15 ? item.substring(0, 15) + '...' : item;
    rPrice.textContent = '₩' + price.toLocaleString();
    rReason.textContent = reason;
    rTotal.textContent = '₩' + price.toLocaleString();
    rTimestamp.textContent = new Date().toLocaleString('ko-KR');

    // 4. Generate AI Roast (Simulated)
    const result = generateRoast(item, price, reason);
    rRoast.textContent = ""; 
    typeWriter(result.text, rRoast); 

    // 5. Trigger Visual Effects
    triggerEffects(result.type);

    // 6. Show Result
    resultZone.classList.remove('hidden');
    
    // Scroll to result
    resultZone.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  homeBtn.addEventListener('click', () => {
    // 1. Hide Result
    resultZone.classList.add('hidden');
    
    // 2. Reset Form
    form.reset();
    
    // 3. Reset Visuals
    resetEffects();
    
    // 4. Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      // 1. SIREN MODE & GLITCH
      body.classList.add('mode-bad');
      
      // 2. RED STAMP (Tangjin/Pasan)
      setTimeout(() => {
        const stamp = document.createElement('div');
        stamp.classList.add('stamp', 'bad');
        stamp.innerText = '탕진\nWARNING';
        receiptContainer.appendChild(stamp);
      }, 1500);

      // 3. EMERGENCY MARQUEE
      const marquee = document.createElement('div');
      marquee.classList.add('bad-marquee');
      
      const warnText = "⚠ 경고: 통장 잔고 비상! 지갑 심폐소생술 필요 ⚠ 💸 내 돈 어디갔니? 💸 ";
      const repeatedText = warnText.repeat(10); // Ensure it's long enough
      
      marquee.innerHTML = `
        <div class="bad-marquee-track">
          <span>${repeatedText}</span>
          <span>${repeatedText}</span>
        </div>
      `;
      document.body.appendChild(marquee);

      // 4. FLYING MONEY/DUST
      createFlyingEmojis('💸');

    } else if (type === 'GOOD') {
      // 1. GOLD MODE
      body.classList.add('mode-good');
      
      // 2. GREEN STAMP (Smart Spender)
      setTimeout(() => {
        const stamp = document.createElement('div');
        stamp.classList.add('stamp', 'good');
        stamp.innerHTML = 'Certified:<br>Smart Spender';
        receiptContainer.appendChild(stamp);
      }, 1500);
      
      // 3. COIN RAIN
      createCoinRain();
    }
  }

  function createCoinRain() {
    for (let i = 0; i < 25; i++) { // Less count, more impact
      const coin = document.createElement('div');
      coin.classList.add('coin');
      
      // Randomize horizontal start
      coin.style.left = (Math.random() * 90 + 5) + 'vw';
      
      // Use the new bounce animation
      // Faster: 1.5s to 2.5s duration
      const duration = Math.random() * 1 + 1.5; 
      coin.style.animation = `coin-bounce ${duration}s linear forwards`;
      
      // Minimal delay so they burst out together but slightly scattered
      coin.style.animationDelay = Math.random() * 0.5 + 's';
      
      effectsLayer.appendChild(coin);
    }
  }

  function createFlyingEmojis(emoji) {
    for (let i = 0; i < 20; i++) {
      const el = document.createElement('div');
      el.classList.add('flying-emoji');
      el.innerText = emoji;
      el.style.left = Math.random() * 100 + 'vw';
      el.style.top = (Math.random() * 50 + 50) + 'vh'; // Start from bottom half
      el.style.animationDuration = (Math.random() * 2 + 2) + 's';
      effectsLayer.appendChild(el);
    }
  }
});

/**
 * Simulates Gemini AI Analysis
 */
function generateRoast(item, price, reason) {
  const expensive = price > 50000;
  const cheap = price < 10000;
  const food = ['마라탕', '커피', '치킨', '술', '밥', '파스타', '떡볶이', '피자', '배달', '야식'].some(f => item.includes(f));
  const tech = ['컴퓨터', '맥북', '모니터', '키보드', '아이패드', '갤럭시', '아이폰', '에어팟'].some(t => item.includes(t));
  const goodItems = ['책', '강의', '기부', '저축', '운동', '헬스', '영양제', '선물', '효도'].some(g => item.includes(g));

  let roasts = [];
  let type = 'BAD'; 

  // 1. GOOD SPENDING LOGIC
  if (goodItems || (cheap && !food && !tech)) {
    type = 'GOOD';
    roasts.push(
      `오... ${item}? 이건 좀 의외네. 미래를 위한 투자라고 인정해줄게. 칭찬 스티커 하나.`, 
      `이런 건 돈 써도 돼. ${item} 덕분에 네가 1%라도 성장한다면야. 굿 잡!`, 
      `가성비 훌륭하고, 의미도 있고. 오늘은 팩폭 쉴게. 잘했어.`
    );
  } 
  
  // 2. BAD SPENDING LOGIC
  else {
    type = 'BAD';
    
    if (tech) {
      roasts.push(
        `오.. 장비병 도졌어? ${item} 사면 실력이 늘 것 같지? 응 아니야. 손가락이 문제야.`, 
        `컴퓨터 살 돈으로 코딩 공부나 더 해. ${item}은 장식용이지?`, 
        `전문가인 척 ${item}에 투자했다고 자위하지 마. 그냥 비싼 장난감 산 거잖아.`
      );
    } else if (expensive) {
      roasts.push(
        `₩${price.toLocaleString()}? 너 혹시 재벌 3세야? ${item}에 이 돈을 태워? 통장 잔고가 울고 있어.`, 
        `와... ${item} 하나에 이 가격? 내일부턴 숨만 쉬고 살아야겠네. "투자"라고 우기지 마.`, 
        `진지하게 묻는데, 이거 사면 네 인생이 달라져? 아니지? 그냥 돈 버린 거야.`
      );
    } else if (cheap) {
      roasts.push(
        `겨우 ₩${price.toLocaleString()}? 짠내 난다 짠내 나. 근데 이런 것도 모이면 태산인 거 알지?`, 
        `소박하네. 근데 ${item} 먹고 기분이 나아졌어? 그게 문제야. 푼돈으로 행복을 사려는 습관.`, 
        `가성비 따지면서 ${item} 산 거야? 그래, 잘했다. 통장은 지켰지만 자존심은?`
      );
    } else {
      roasts.push(
        `${item}.. 애매하다 애매해. 차라리 저축을 하지 그랬어?`, 
        `"${reason}"? 핑계는 청산유수네. 그냥 사고 싶었다고 솔직히 말해.`, 
        `남들은 주식으로 돈 불릴 때 넌 ${item}으로 지방만 불리는구나.`
      );
    }

    if (food && reason.includes("스트레스")) {
      roasts.push(
        `스트레스 받는다고 먹고, 살쪄서 스트레스 받고, 또 먹고... 무한 굴레의 시작.`, 
        `먹는 걸로 푸는 건 하수야. 통장 잔고 보면 스트레스 더 받을걸?`
      );
    }
  }

  // Fallback
  const selectedRoast = roasts[Math.floor(Math.random() * roasts.length)];
  
  return { text: selectedRoast, type: type };
}

// Simple Typewriter Effect
function typeWriter(text, element) {
  let i = 0;
  element.textContent = '';
  const speed = 30; // ms

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}
