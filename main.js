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

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
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

    // 4. Generate AI Roast (Simulated for Prototype)
    const roast = generateRoast(item, price, reason);
    rRoast.textContent = ""; // Clear previous
    typeWriter(roast, rRoast); // Typing effect

    // 5. Show Result with Animation
    resultZone.classList.remove('hidden');
    
    // Play sound effect (Optional placeholder)
    // playPrinterSound();

    // Scroll to result
    resultZone.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/**
 * Simulates the Gemini AI response based on simple heuristics.
 * In a real app, this would be: await fetch('/api/gemini', ...)
 */
function generateRoast(item, price, reason) {
  const expensive = price > 50000;
  const cheap = price < 5000;
  const food = ['마라탕', '커피', '치킨', '술', '밥', '파스타', '떡볶이'].some(f => item.includes(f));
  
  let roasts = [];

  if (expensive) {
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

  // Randomly pick one
  return roasts[Math.floor(Math.random() * roasts.length)];
}

// Simple Typewriter Effect for the Text
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