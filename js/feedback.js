const form = document.getElementById("feedbackForm");
const result = document.getElementById("feedbackResult");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  result.textContent = "感謝您的回饋，我們已收到！";
  form.reset();
});