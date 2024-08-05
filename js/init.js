const devMode = false;

const defensesSection = document.getElementById("defenses");
const offensesSection = document.getElementById("offenses");
const donatedLightningSpellCountDiv = document.getElementById("donateCount");
const earthquakeOrderDiv = document.getElementById("earthquakeOrder");

let maxSpellCount;
let lightningSpellLevel;
let donatedLightningSpellLevel;
let donatedLightningSpellCount = 0;
let earthquakeSpellLevel;
let earthquakeBootsLevel = "0";
let spikyBallLevel = "0";
let giantArrowLevel = "0";
let fireballLevel = "0";
let shieldLevel = "0";
let earthquakeOrder = "earthquake_spell";

let defenseJSON = null;
fetch("/json/defense.json")
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {   
    defenseJSON = data;
    if (!devMode) {
      Object.keys(defenseJSON["defense"]).forEach(loadDefense);
    }    
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
    //window.location.href = "/html/error.html";
  });

let offenseJSON = null;
fetch("/json/offense.json")
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {   
    offenseJSON = data;
    Object.keys(offenseJSON["offense"]["spell"]).forEach(loadSpell);
    Object.keys(offenseJSON["offense"]["equipment"]).forEach(loadEquipment);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
    //window.location.href = "/html/error.html";
  });

  let otherJSON = null;
  fetch("/json/other.json")
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {   
      otherJSON = data;
      maxSpellCount = otherJSON["max_spell_count"];
      init();
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      //window.location.href = "/html/error.html";
    });

function init() {
  calculate();
  setThemeMode(isDarkMode);
}

function loadSpell(spellID) {
  offenseDivs = offensesSection.querySelectorAll(".offense");

  offenseDivs.forEach((offenseDiv) => {
    if (offenseDiv.getAttribute("data-title") === spellID) {
      let level = offenseJSON["offense"]["spell"][spellID]["damage"].length;
      let imagePath = "/images/offense/" + spellID + ".webp";

      offenseDiv.querySelector(".overlay").classList.add("maxed");
      offenseDiv.querySelector(".level-number").textContent = level;
      offenseDiv.querySelector(".image").src = imagePath;
      offenseDiv.querySelector(".range").max = level;
      offenseDiv.querySelector(".range").value = level;

      switch(spellID) {
        case "lightning_spell":
          lightningSpellLevel = level;
          donatedLightningSpellLevel = level;
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
      let level = sorteddamageList.length;
      let imagePath = "/images/offense/" + equipmentID + ".webp";

      offenseDiv.querySelector(".overlay").classList.add("not-maxed");
      offenseDiv.querySelector(".level-number").textContent = sorteddamageList[0][0];
      offenseDiv.querySelector(".image").src = imagePath;
      offenseDiv.querySelector(".range").max = level;
      offenseDiv.querySelector(".range").value = 0;
      return;
    }
  });
}

function loadDefense(defenseID) {
  let name = defenseJSON["defense"][defenseID]["name"];
  let level = defenseJSON["defense"][defenseID]["hp"].length;
  let hp = defenseJSON["defense"][defenseID]["hp"][level - 1];
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

  const levelSpan = document.createElement('span');
  levelSpan.className = 'level';
  levelSpan.textContent = "(Level " + level + ")";

  const hpDiv = document.createElement('div');
  hpDiv.textContent = '❤️';

  const hpSpan = document.createElement('span');
  hpSpan.className = 'hp h5';
  hpSpan.textContent = hp;

  const rangeInput = document.createElement('input');
  rangeInput.setAttribute('type', 'range');
  rangeInput.setAttribute('min', '1');
  rangeInput.setAttribute('max', level);
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
  nameDiv.appendChild(levelSpan);

  hpDiv.appendChild(hpSpan);

  textDiv.appendChild(nameDiv);
  textDiv.appendChild(hpDiv);

  titleDiv.appendChild(imgDiv);
  titleDiv.appendChild(textDiv);

  borderDiv.appendChild(titleDiv);
  borderDiv.appendChild(rangeInput);
  borderDiv.appendChild(resultDiv);

  defenseDiv.appendChild(borderDiv);

  // Append the main container to the body or a specific element in the HTML
  defensesSection.appendChild(defenseDiv);
}