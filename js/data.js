async function loadCSV() {
  const res = await fetch("csv/data.csv");
  const text = await res.text();

  const rows = text.trim().split("\n").map(r => r.split(","));

  const headers = rows[0];
  const labels = rows.slice(1).map(r => r[0]); // X軸 → 指標名稱

  const datasets = headers.slice(1).map((area, idx) => ({
    label: area,
    data: rows.slice(1).map(r => parseFloat(r[idx + 1]) || 0),
    borderColor: ["#FF5733", "#1E90FF", "#33FF57", "#FFD700", "#A833FF"][idx % 5],
    backgroundColor: "transparent",
    tension: 0.3,
    pointRadius: 5
  }));

  new Chart(document.getElementById("highSchoolChart"), {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      plugins: {
        legend: { labels: { color: '#FFD700' } },
        tooltip: { titleColor: '#FFD700', bodyColor: '#FFD700' }
      },
      scales: {
        y: { beginAtZero: true, ticks: { color: '#FFD700' } },
        x: { ticks: { color: '#FFD700' } }
      }
    }
  });
}

loadCSV();