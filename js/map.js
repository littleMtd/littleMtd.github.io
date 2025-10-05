const schools = {
    yunlin: [
      { name: "財團法人義峰高中", county: "雲林縣", teacher: 74, student: 543, graduates: 216, pos: { top: "30%", left: "75%" }, type: "rural" },
      { name: "國立虎尾農工", county: "雲林縣", teacher: 149, student: 1139, graduates: 317, pos: { top: "40%", left: "50%" }, type: "rural" }
    ],
    taipei: [
      { name: "市立建國中學", county: "台北市", teacher: 260, student: 2821, graduates: 892, pos: { top: "65%", left: "35%" }, type: "city" },
      { name: "市立南港高中", county: "台北市", teacher: 188, student: 1015, graduates: 315, pos: { top: "65%", left: "65%" }, type: "city" }
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
    dataPanel.innerHTML = "";
  
    function createInfoCard(school, labelClass = "") {
      const div = document.createElement("div");
      div.innerHTML = `<h3>${school.name}</h3>`;
  
      // 老師數量輸入欄
      div.innerHTML += `
        <label>老師數量：
          <input type="number" min="1" value="${school.teacher}" id="teacherInput" style="width: 60px; margin-left: 10px;">
        </label>
      `;
  
      const dataKeys = { student: "學生數量", graduates: "畢業生數量" };
  
      for (const key in dataKeys) {
        const val = school[key];
        // 計算各欄位最大值，用於進度條比例
        const maxVal = Math.max(...schools[county].map(s => s[key]));
        div.innerHTML += `
          <label>${dataKeys[key]}：${val}</label>
          <div class="bar"><span class="${labelClass}" style="width:${(val / maxVal * 100).toFixed(1)}%"></span></div>
        `;
      }
  
      // 師生比
      const ratio = school.student / school.teacher;
      div.innerHTML += `
        <label>師生比：${ratio.toFixed(2)}</label>
        <div class="bar"><span class="${labelClass}" style="width:${Math.min(ratio*10,100)}%"></span></div>
      `;
  
      // 畢業率
      function updateGraduationRate() {
        const teacherInput = div.querySelector("#teacherInput");
        let teacherNum = parseInt(teacherInput.value) || school.teacher;
        let baseRate = school.graduates / school.student;
        let newRate = Math.min(1, baseRate * (teacherNum / school.teacher));
        div.querySelector(".rate-text").textContent = `🎓 畢業率：${(newRate*100).toFixed(1)}%`;
  
        // 更新師生比
        const ratioSpan = div.querySelector(".bar span:last-child");
        let newRatio = school.student / teacherNum;
        ratioSpan.style.width = `${Math.min(newRatio*10,100)}%`;
      }
  
      const rate = (school.graduates / school.student) * 100;
      div.innerHTML += `<p class="rate-text">🎓 畢業率：${rate.toFixed(1)}%</p>`;
  
      // 監聽老師數量變化
      div.querySelector("#teacherInput").addEventListener("input", updateGraduationRate);
  
      return div;
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
  
  countySelect.addEventListener("change", (e) => {
    const county = e.target.value;
    dataPanel.innerHTML = "";
    if (compareMode) {
      renderMap(county);
      if (!selectedRural && county === "yunlin") {
        modeText.textContent = "比對模式啟動中：請選擇偏鄉學校";
      } else if (!selectedCity && county === "taipei") {
        modeText.textContent = "比對模式啟動中：請選擇都市學校";
      } else {
        modeText.textContent = "比對模式：可繼續選擇另一縣市學校";
      }
    } else {
      selectedRural = null;
      selectedCity = null;
      modeText.textContent = "點擊地圖上的學校查看資料";
      renderMap(county);
    }
  });
  
  // 預設載入
  renderMap(countySelect.value);