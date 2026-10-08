// ── Freed Website Interactive Scripts ──────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initCalculator();
  initFAQ();
});

// Interactive Savings & Health Calculator
function initCalculator() {
  const puffsSlider = document.getElementById('puffsSlider');
  const costSlider = document.getElementById('costSlider');
  const vapesSlider = document.getElementById('vapesSlider');

  const puffsVal = document.getElementById('puffsVal');
  const costVal = document.getElementById('costVal');
  const vapesVal = document.getElementById('vapesVal');

  const yearlySaved = document.getElementById('yearlySaved');
  const puffsAvoided = document.getElementById('puffsAvoided');
  const daysGained = document.getElementById('daysGained');

  if (!puffsSlider || !costSlider || !vapesSlider) return;

  function update() {
    const puffs = parseInt(puffsSlider.value, 10);
    const cost = parseFloat(costSlider.value);
    const vapesPerWeek = parseFloat(vapesSlider.value);

    // Update slider label badges
    puffsVal.textContent = puffs.toLocaleString();
    costVal.textContent = `$${cost.toFixed(0)}`;
    vapesVal.textContent = vapesPerWeek;

    // Calculate
    const annualMoney = Math.round(vapesPerWeek * cost * 52);
    const annualPuffsAvoided = Math.round(puffs * 365);
    const lifeDaysGained = Math.round((annualPuffsAvoided * 2) / 60 / 24); // approx hours converted to days

    yearlySaved.textContent = `$${annualMoney.toLocaleString()}`;
    puffsAvoided.textContent = annualPuffsAvoided.toLocaleString();
    daysGained.textContent = `+${Math.max(12, lifeDaysGained)} days`;
  }

  puffsSlider.addEventListener('input', update);
  costSlider.addEventListener('input', update);
  vapesSlider.addEventListener('input', update);

  update();
}

// FAQ Accordion
function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  items.forEach((item) => {
    const question = item.querySelector('.faq-question');
    if (!question) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach((other) => other.classList.remove('open'));
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
}
