const schools = {
  yunlin: [
    { name: "財團法人義峰高中", county: "雲林縣", teacher: 74, student: 543, graduates: 216, pos: { top: "30%", left: "75%" }, type: "rural" },
    { name: "國立虎尾農工", county: "雲林縣", teacher: 149, student: 1139, graduates: 317, pos: { top: "40%", left: "50%" }, type: "rural" }
  ],
  taipei: [
    { name: "市立建國中學", county: "台北市", teacher: 260, student: 2821, graduates: 892, pos: { top: "65%", left: "35%" }, type: "city" },
    { name: "市立南港高中", county: "台北市", teacher: 188, student: 1015, graduates: 315, pos: { top: "65%", left: "70%" }, type: "city" }
  ]
};

let compareMode = false;
let selectedRural = null;
let selectedCity = null;

const mapContainer = document.getElementById("mapContainer");
const dataPanel = document.getElementById("dataPanel");
const compareBtn = document.getElementById("compareBtn");
const modeText = document.getElementById("modeText");
const countySelect = document.getElementById("countySelect");

function renderMap(county) {
  mapContainer.innerHTML = `<img src="${county}-map.jpg" alt="${county} 地圖">`;

  schools[county].forEach(school => {
    const btn = document.createElement("button");
    btn.classList.add("area-btn", school.type);
    btn.style.top = school.pos.top;
    btn.style.left = school.pos.left;
    btn.title = school.name;

    btn.addEventListener("click", () => {
      btn.classList.add("active-click");
      setTimeout(() => btn.classList.remove("active-click"), 300);

      if (!compareMode) {
        selectedRural = school.type === "rural" ? school : null;
        selectedCity = school.type === "city" ? school : null;
        modeText.textContent = `當前選擇：${school.name}`;
        displaySchoolData(county);
      } else {
        if (school.type === "rural") {
          selectedRural = school;
          modeText.textContent = "請選擇都市學校進行比對";
        }
        if (school.type === "city") {
          selectedCity = school;
          modeText.textContent = "比對完成";
        }
        displaySchoolData(county);
      }
    });

    mapContainer.appendChild(btn);
  });
}

function displaySchoolData(county) {
  dataPanel.innerHTML = ""; // 清空

  if (!selectedRural && !selectedCity) {
    dataPanel.innerHTML = "<h3>請選擇學校</h3>";
    return;
  }

  function createInfoCard(school, labelClass = "") {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <h2>${school.name}</h2>
      <p>${school.county}</p>

      <label>教師數量：
        <input type="number" min="1" value="${school.teacher}" class="teacher-input">
      </label>

      <label>學生數量：${school.student}</label>
      <div class="progress-bar">
        <div class="progress-fill student" style="width:${(school.student / getMax(county, "student") * 100).toFixed(1)}%;">
          ${school.student}
        </div>
      </div>

      <label>畢業生數量：${school.graduates}</label>
      <div class="progress-bar">
        <div class="progress-fill graduate" style="width:${(school.graduates / getMax(county, "graduates") * 100).toFixed(1)}%;">
          ${school.graduates}
        </div>
      </div>

      <label>師生比：</label>
      <div class="progress-bar">
        <div class="progress-fill ${labelClass}" id="ratioBar" style="width:${Math.min((school.student / school.teacher) * 10, 100)}%;">
          ${(school.student / school.teacher).toFixed(2)}
        </div>
      </div>

      <p class="rate-text">🎓 畢業率：${((school.graduates / school.student) * 100).toFixed(1)}%</p>
    `;

    // 教師數變動即時更新
    const teacherInput = div.querySelector(".teacher-input");
    teacherInput.addEventListener("input", () => {
      const newTeacher = parseInt(teacherInput.value) || school.teacher;
      const newRatio = school.student / newTeacher;
      const newRate = Math.min(1, (school.graduates / school.student) * (newTeacher / school.teacher));
      div.querySelector("#ratioBar").style.width = `${Math.min(newRatio * 10, 100)}%`;
      div.querySelector("#ratioBar").textContent = newRatio.toFixed(2);
      div.querySelector(".rate-text").textContent = `🎓 畢業率：${(newRate * 100).toFixed(1)}%`;
    });

    return div;
  }

  function getMax(county, key) {
    return Math.max(...schools[county].map(s => s[key]));
  }

  if (selectedRural) dataPanel.appendChild(createInfoCard(selectedRural));
  if (selectedCity) dataPanel.appendChild(createInfoCard(selectedCity, "city"));
}

compareBtn.addEventListener("click", () => {
  compareMode = !compareMode;
  compareBtn.textContent = compareMode ? "結束比對模式" : "開始比對模式";
  selectedRural = null;
  selectedCity = null;
  dataPanel.innerHTML = "";
  modeText.textContent = compareMode ? "比對模式啟動：請先選擇偏鄉學校" : "點擊地圖上的學校查看資料";
});

countySelect.addEventListener("change", e => {
  const county = e.target.value;
  dataPanel.innerHTML = "";
  renderMap(county);

  if (compareMode) {
    if (!selectedRural && county === "yunlin") {
      modeText.textContent = "比對模式啟動中：請選擇偏鄉學校";
    } else if (!selectedCity && county === "taipei") {
      modeText.textContent = "比對模式啟動中：請選擇都市學校";
    } else {
      modeText.textContent = "比對模式：可繼續選擇另一縣市學校";
    }
    displaySchoolData(county);
  } else {
    selectedRural = null;
    selectedCity = null;
    modeText.textContent = "點擊地圖上的學校查看資料";
  }
});

// 預設載入
renderMap(countySelect.value);
