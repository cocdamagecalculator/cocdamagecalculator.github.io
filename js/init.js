const devMode = false;
const simpleCalculatorKey = "simple_";
const donatedZapSpellCountKey = "simple_lightningSpellCount_donated";
const useDonatedZapSpellKey = "simple_useDonatedLightningSpell";
const earthquakeOrderKey = "simple_earthquakeOrder";

const defensesSection = document.getElementById("defenses");
const offensesSection = document.getElementById("offenses");
const donatedLightningSpellCountDiv = document.getElementById("donateCount");
const earthquakeOrderDiv = document.getElementById("earthquakeOrder");

let maxSpellCount;
let lightningSpellLevel;
let donatedLightningSpellLevel;
let donatedLightningSpellCount = Number.parseInt(localStorage.getItem(donatedZapSpellCountKey)); 
if (Number.isNaN(donatedLightningSpellCount)) {
  donatedLightningSpellCount = 0;
  localStorage.setItem(donatedZapSpellCountKey, donatedLightningSpellCount);
}
let earthquakeSpellLevel;
let earthquakeBootsLevel = "0";
let spikyBallLevel = "0";
let giantArrowLevel = "0";
let fireballLevel = "0";
let shieldLevel = "0";
let earthquakeOrder = localStorage.getItem(earthquakeOrderKey); 
if (earthquakeOrder !== "earthquake_spell" && earthquakeOrder !== "earthquake_boots") {
  earthquakeOrder = "earthquake_spell";
  localStorage.setItem(earthquakeOrderKey, earthquakeOrder);
}
let useDonatedLightning = localStorage.getItem(useDonatedZapSpellKey) === "true";
localStorage.setItem(useDonatedZapSpellKey, useDonatedLightning);

document.addEventListener('init', () => {
  if (!devMode) {
    Object.keys(getAllDefenses()).forEach(loadDefense);
  }
  
  Object.keys(getAllSpells()).forEach(loadSpell);
  Object.keys(getAllEquipments()).forEach(loadEquipment);
  updateEquipmentUsed();

  maxSpellCount = otherJSON["max_spell_count"];

  const earthquakeOrderSelect = document.getElementById("earthquakeOrder");
  for (let option of earthquakeOrderSelect.options) {
    if (option.value === earthquakeOrder) {
       option.selected = true;
       break;
    } 
  }

  const donateCount = document.getElementById("donateCount");
  donateCount.value = donatedLightningSpellCount;

  const checkbox = document.getElementById("useDonatedLightning");
  checkbox.checked = useDonatedLightning;
  toggleUseDonatedLightningSpell();
  calculate();

  setThemeMode(isDarkMode);
});

function loadSpell(spellID) {
  offenseDivs = offensesSection.querySelectorAll(".offense");

  offenseDivs.forEach((offenseDiv) => {
    if (offenseDiv.getAttribute("data-title") === spellID) {
      let imagePath = "/images/offense/" + spellID + ".webp";
      const maxLevel = getSpell(spellID)["damage"].length;

      let key;
      if (offenseDiv.getAttribute("data-donated") === "true") {
        key = simpleCalculatorKey + spellID + "_donated";
      } else {
        key = simpleCalculatorKey + spellID;        
      }
      let level = Number.parseInt(localStorage.getItem(key));
      if (Number.isNaN(level)) {
        level = maxLevel;
        localStorage.setItem(key, level);
      }

      offenseDiv.querySelector(".overlay").classList.add("maxed");
      offenseDiv.querySelector(".level-number").textContent = level;
      offenseDiv.querySelector(".image").src = imagePath;
      offenseDiv.querySelector(".range").max = maxLevel;
      offenseDiv.querySelector(".range").value = level;
      const overlayDiv = offenseDiv.querySelector(".overlay");
      if (level == maxLevel) {            
        overlayDiv.classList.remove("not-maxed");
        overlayDiv.classList.add("maxed");
      } else {
        overlayDiv.classList.remove("maxed");
        overlayDiv.classList.add("not-maxed");
      }

      switch(spellID) {
        case "lightning_spell":
          if (offenseDiv.getAttribute("data-donated") === "true") {
            donatedLightningSpellLevel = level;
          } else {
            lightningSpellLevel = level;    
          }
          break;
        case "earthquake_spell":
          earthquakeSpellLevel = level;
          break;
      }
      return;
    }
  });
}

function loadEquipment(equipmentID) {
  offenseDivs = offensesSection.querySelectorAll(".offense");

  offenseDivs.forEach((offenseDiv) => {
    if (offenseDiv.getAttribute("data-title") === equipmentID) {    
      const damageList = offenseJSON["offense"]["equipment"][equipmentID]["damage"];
      const sorteddamageList = Object.entries(damageList).sort(([, valueA], [, valueB]) => valueA - valueB);
      let imagePath = "/images/offense/" + equipmentID + ".webp";
      const maxLevel = sorteddamageList.length - 1;

      const key = simpleCalculatorKey + equipmentID;
      let level = Number.parseInt(localStorage.getItem(key));     
      if (Number.isNaN(level)) {
        level = 0;
        localStorage.setItem(key, level);
      }

      offenseDiv.querySelector(".overlay").classList.add("not-maxed");
      offenseDiv.querySelector(".level-number").textContent = sorteddamageList[level][0];
      offenseDiv.querySelector(".image").src = imagePath;
      offenseDiv.querySelector(".range").max = maxLevel;
      offenseDiv.querySelector(".range").value = level ;
      const overlayDiv = offenseDiv.querySelector(".overlay");
      if (level == maxLevel) {            
        overlayDiv.classList.remove("not-maxed");
        overlayDiv.classList.add("maxed");
      } else {
        overlayDiv.classList.remove("maxed");
        overlayDiv.classList.add("not-maxed");
      }

      updateEquipment(equipmentID, level);
      return;
    }
  });
}

function loadDefense(defenseID) {
  const name = getDefense(defenseID)["name"];
  const maxLevel = getDefense(defenseID)["hp"].length;

  const key = simpleCalculatorKey + defenseID;
  let level = Number.parseInt(localStorage.getItem(key));
  if (Number.isNaN(level)) {
    level = maxLevel;
    localStorage.setItem(key, level);
  }

  const hp = defenseJSON["defense"][defenseID]["hp"][level - 1];
  let imagePath;
  switch (defenseID) {
    case "grand_warden_altar":
      imagePath = "/images/defense/" + defenseID + "/" + defenseID + ".webp";
      break;
    case "archer_queen":
      imagePath = "/images/defense/" + defenseID + "/" + defenseID + ".webp";
      break;
    case "royal_champion":
      imagePath = "/images/defense/" + defenseID + "/" + defenseID + ".webp";
      break;
    default:
      imagePath = "/images/defense/" + defenseID + "/" + level + ".webp";
  }
        
  const defenseDiv = document.createElement('div');
  defenseDiv.setAttribute('data-title', defenseID);
  defenseDiv.className = 'defense col-xxl-3 col-lg-4 col-md-6';

  // Create the nested structure inside the main container
  const borderDiv = document.createElement('div');
  borderDiv.className = 'p-3 col-12 h-100 rounded-border shadow card-background';

  const titleDiv = document.createElement('div');
  titleDiv.className = 'd-flex';

  const imgDiv = document.createElement('div');

  const img = document.createElement('img');
  img.className = 'image';
  img.setAttribute('src', imagePath);
  img.setAttribute('height', '60');

  const textDiv = document.createElement('div');
  textDiv.className = 'ms-3';

  const nameDiv = document.createElement('div');
  nameDiv.className = 'h5';

  const nameSpan = document.createElement('span');
  nameSpan.className = 'name';
  nameSpan.textContent = name + " ";

  const statDiv = document.createElement('div');
  statDiv.className = "d-flex";

  const hpDiv = document.createElement('div');
  hpDiv.className = 'h5 me-4';

  const hpIcon = document.createElement('span');
  hpIcon.className = 'me-2';
  hpIcon.textContent = "❤️";
  hpDiv.appendChild(hpIcon);

  const hpNumber = document.createElement('span');
  hpNumber.className = 'hp';
  hpNumber.textContent = hp;
  hpDiv.appendChild(hpNumber);
  
  const levelDiv = document.createElement('div');
  levelDiv.className = 'h5';

  const i = document.createElement('i');
  i.className = 'fa-solid fa-chart-simple me-2';
  levelDiv.appendChild(i);
  
  const levelNumberSpan = document.createElement('span');
  levelNumberSpan.textContent = level;
  if (level == maxLevel) {
    levelNumberSpan.className = 'level maxed-text';
  } else {
    levelNumberSpan.className = 'level';
  }
  levelDiv.appendChild(levelNumberSpan);

  const rangeInput = document.createElement('input');
  rangeInput.setAttribute('type', 'range');
  rangeInput.setAttribute('min', '1');
  rangeInput.setAttribute('max', maxLevel);
  rangeInput.setAttribute('value', level);
  rangeInput.className = 'range w-100';
  rangeInput.setAttribute('oninput', 'updateDefense(this)');

  const resultDiv = document.createElement('div');
  resultDiv.className = 'my-3';

  const equipmentDiv = document.createElement('div');
  equipmentDiv.className = 'equipment-div my-3 d-none';

  const equipmentTitle = document.createElement('h5');
  equipmentTitle.textContent = "Heroes Equipment used:";

  const equipmentList = document.createElement('div');
  equipmentList.className = 'equipment-list d-flex justify-content-center align-items-center flex-wrap';

  const statusDiv = document.createElement('div');
  statusDiv.className = 'status-div d-flex align-items-center my-3 d-none';

  const statusImg = document.createElement('img');
  statusImg.className = 'status-img me-4';
  statusImg.setAttribute('width', '80');

  const statusText = document.createElement('div');
  statusText.className = 'status-text fw-bold';
  
  const spellDiv = document.createElement('div');
  spellDiv.className = 'spell-div my-3';

  const spellTitle = document.createElement('h5');
  spellTitle.textContent = "Spell needed:";

  const spellList = document.createElement('div');
  spellList.className = 'spell-main-display d-flex justify-content-center align-items-center';

  const buttonDiv = document.createElement('div');
  buttonDiv.className = 'collapse-btn text-center my-3';

  const button = document.createElement('button');
  button.className = 'btn show-more-button';
  button.setAttribute('type', 'button');
  button.setAttribute('data-bs-toggle', 'collapse');
  button.setAttribute('data-bs-target', '#showMore-' + defenseID);
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', 'showMore-' + defenseID);
  button.textContent = 'Show More';

  const showMoreDiv = document.createElement('div');
  showMoreDiv.className = 'spell-display collapse';
  showMoreDiv.id = "showMore-" + defenseID;

  // Append the created elements to their respective parents
  buttonDiv.appendChild(button);

  equipmentDiv.appendChild(equipmentTitle);
  equipmentDiv.appendChild(equipmentList);

  statusDiv.appendChild(statusImg);
  statusDiv.appendChild(statusText);

  spellDiv.appendChild(spellTitle);
  spellDiv.appendChild(spellList);
  spellDiv.appendChild(buttonDiv);
  spellDiv.appendChild(showMoreDiv);

  resultDiv.appendChild(equipmentDiv);
  resultDiv.appendChild(statusDiv);
  resultDiv.appendChild(spellDiv);

  imgDiv.appendChild(img);

  nameDiv.appendChild(nameSpan);

  statDiv.appendChild(hpDiv);
  statDiv.appendChild(levelDiv);

  textDiv.appendChild(nameDiv);
  textDiv.appendChild(statDiv);

  titleDiv.appendChild(imgDiv);
  titleDiv.appendChild(textDiv);

  borderDiv.appendChild(titleDiv);
  borderDiv.appendChild(rangeInput);
  borderDiv.appendChild(resultDiv);

  defenseDiv.appendChild(borderDiv);

  // Append the main container to the body or a specific element in the HTML
  defensesSection.appendChild(defenseDiv);
}