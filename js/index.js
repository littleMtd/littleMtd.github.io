// 標題浮現動畫
  window.addEventListener('DOMContentLoaded', () => {
    const card = document.getElementById('titleCard');
    setTimeout(() => {
      card.classList.add('show');
    }, 200); 
  });