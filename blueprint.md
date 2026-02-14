# Project Blueprint: AI Wallet Roast (지출 팩폭기)

## Overview
An interactive web application that uses AI (simulated or real) to critique user spending habits in a humorous, slightly aggressive ("Roast") manner. The goal is to provide a visceral reaction to spending through visual effects (glitch, receipt printing) and sharp copy.

## Current Plan: The "Hook & Receipt" Update

### Objective
Implement a high-engagement landing experience with a specific "Hook" and a dynamic "Receipt" generation interaction.

### Features
1.  **The Hook (Hero Section):**
    *   **Headline:** "어제 당신의 지출은 투자였나요, 아니면 쓰레기였나요?"
    *   **Sub-headline:** "Gemini AI가 당신의 카드 내역을 낱낱이 해부해 드립니다. (주의: 멘탈 약한 분 클릭 금지)"
    *   **Visual:** High-contrast, perhaps dark/terminal aesthetic to match the "hacker/analysis" vibe.

2.  **The Interaction (Input):**
    *   **Fields:**
        1.  항목 (Item)
        2.  금액 (Amount)
        3.  그때의 기분/이유 (Mood/Reason) - *New Field*
    *   **Behavior:** Simple, fast entry.

3.  **The Feedback (Receipt Output):**
    *   **Animation:** "Receipt printing" effect with a glitch/jitter visual.
    *   **Content:**
        *   Summary of input.
        *   **The AI Roast:** A sharp, witty critique of the spending.
        *   **Visuals:** Monospace font, jagged edges, "burned" look.

### Technical Stack
*   **HTML5:** Semantic structure.
*   **CSS3:** Variables, Keyframes (for glitch/print), Flexbox/Grid.
*   **Vanilla JS:** DOM manipulation, Event handling, Mock AI logic (initially).

## Steps
1.  **Update HTML:** Modify `index.html` to reflect the new copy and 3-field form.
2.  **Style Overhaul:** Update `style.css` for the "Dark/Glitch" theme and "Receipt" component.
3.  **Logic Implementation:** Update `main.js` to handle the 3 inputs and trigger the animation/roast.
