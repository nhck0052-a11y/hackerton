document.addEventListener('DOMContentLoaded', () => {
  const itemInput = document.getElementById('item-input');
  const amountInput = document.getElementById('amount-input');
  const roastButton = document.getElementById('roast-button');
  const roastOutput = document.getElementById('roast-output');
  const shareButton = document.getElementById('share-button');

  const roasts = {
    coffee: [
      "또 커피? 네 혈관엔 피 대신 카페인이 흐르겠다.",
      "그 돈으로 원두를 샀으면 지금쯤 바리스타가 됐겠네.",
      "오늘도 카페인 수혈로 하루를 버티는구나. 힘내라..."
    ],
    delivery: [
      "배달음식에 쓰는 돈, 네 건강과 맞바꾸는 중인 거 알지?",
      "요리하는 법을 배우는 게 네 지갑과 건강에 더 이로울걸?",
      "'오늘 뭐 먹지?' 고민 시간 > 실제 먹는 시간. 인정?"
    ],
    shopping: [
      "그거 진짜 필요해서 산 거 맞아? 그냥 스트레스 풀려고 산 거 아니고?",
      "네 옷장은 이미 충분히 화려해. 이제 그만.",
      "텅장(텅 빈 통장)의 주범. 바로 너!"
    ],
    alcohol: [
      "간에 대한 예의가 아니지. 어?",
      "필름 끊긴 건 기억 못 해도, 카드값은 기억해야지.",
      "술값 아껴서 적금 부었으면, 지금쯤 건물주."
    ],
    general: [
      "이 돈이면 국밥이 몇 그릇인데...",
      "너 월급 통장을 스쳐 지나가는 바람 같은 존재지?",
      "네 지갑은 '밑 빠진 독'이라는 단어를 몸소 증명하고 있구나.",
      "티끌 모아 티끌. 수고했다.",
      "이 작은 돈으로도 사치를 부리는 너, 꽤 대단한데?",
      "소비 요정? 아니, 그냥 호구."
    ]
  };

  const getRoast = (item, amount) => {
    let roastCategory = 'general';
    if (item.includes('커피') || item.includes('카페')) {
      roastCategory = 'coffee';
    } else if (item.includes('배달') || item.includes('음식')) {
      roastCategory = 'delivery';
    } else if (item.includes('쇼핑') || item.includes('옷') || item.includes('신발')) {
      roastCategory = 'shopping';
    } else if (item.includes('술') || item.includes('맥주') || item.includes('소주')) {
      roastCategory = 'alcohol';
    }

    const availableRoasts = roasts[roastCategory];
    const randomIndex = Math.floor(Math.random() * availableRoasts.length);
    return availableRoasts[randomIndex];
  };

  roastButton.addEventListener('click', () => {
    const item = itemInput.value.trim();
    const amount = amountInput.value;

    if (!item || !amount) {
      roastOutput.innerHTML = '<p style="color: red;">항목과 금액을 모두 입력해줘!</p>';
      return;
    }

    const roastMessage = getRoast(item, amount);
    roastOutput.innerHTML = `<p>${roastMessage}</p>`;
    itemInput.value = '';
    amountInput.value = '';
  });

  shareButton.addEventListener('click', async () => {
    const roastText = roastOutput.textContent;
    if (roastText && roastText !== "아직 한마디도 안 했어. 빨리 입력해봐!") {
      try {
        await navigator.clipboard.writeText(`[AI 지갑 로스트] ${roastText}`);
        alert('결과가 클립보드에 복사되었습니다!');
      } catch (err) {
        console.error('클립보드 복사 실패: ', err);
        alert('결과 복사에 실패했습니다.');
      }
    }
  });
});
