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
    Object.keys(defenseJSON["defense"]).forEach(loadDefense);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
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
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });

function loadSpell(spellID) {
  offenseDivs = offensesSection.querySelectorAll(".offense");

  offenseDivs.forEach((offenseDiv) => {
    if (offenseDiv.getAttribute("data-title") === spellID) {
      let level = offenseJSON["offense"]["spell"][spellID]["damage"].length;
      let imagePath = "/images/offense/" + spellID + ".webp";

      offenseDiv.querySelector(".overlay").classList.add("maxed");
      offenseDiv.querySelector(".level-number").innerHTML = level;
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
      offenseDiv.querySelector(".level-number").innerHTML = sorteddamageList[0][0];
      offenseDiv.querySelector(".image").src = imagePath;
      offenseDiv.querySelector(".range").max = level;
      offenseDiv.querySelector(".range").value = 0;
      return;
    }
  });
}

function loadDefense(defenseID) {
  // Template:
  // <div data-title="mortar" class="defense col-xxl-3 col-lg-4 col-md-6">
  //   <div class="col-12 border">
  //       <div class="m-3">
  //           <div class="d-flex">
  //               <div>
  //                   <img class="image" src="" height="60">
  //               </div>
  //               <div class="ms-3">
  //                   <div class="h5">
  //                       <span class="name"></span>
  //                       <span class="level"></span>
  //                   </div>                                
  //                   <div>
  //                       ❤️<span class="hp h5"></span>
  //                   </div>
  //               </div>
  //           </div>
  //           <input type="range" min="1" class="range w-100" onchange="update(this)">   
  //       </div>  
  //   </div>                
  // </div>

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
  borderDiv.className = 'col-12 border';

  const innerDiv = document.createElement('div');
  innerDiv.className = 'm-3';

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
  nameSpan.innerHTML = name + " ";

  const levelSpan = document.createElement('span');
  levelSpan.className = 'level';
  levelSpan.innerHTML = "(Level " + level + ")";

  const hpDiv = document.createElement('div');
  hpDiv.innerHTML = '❤️';

  const hpSpan = document.createElement('span');
  hpSpan.className = 'hp h5';
  hpSpan.innerHTML = hp;

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
  equipmentTitle.innerHTML = "Heroes Equipment used:";

  const equipmentList = document.createElement('div');
  equipmentList.className = 'equipment-list d-flex justify-content-center align-items-center flex-wrap';

  const spellDiv = document.createElement('div');
  spellDiv.className = 'my-3';

  const spellTitle = document.createElement('h5');
  spellTitle.innerHTML = "Spell needed:";

  const spellList = document.createElement('div');
  spellList.className = 'd-flex justify-content-center align-items-center';

  const buttonDiv = document.createElement('div');
  buttonDiv.className = 'text-center my-3';

  const button = document.createElement('button');
  button.className = 'btn btn-primary';
  button.setAttribute('type', 'button');
  button.setAttribute('data-bs-toggle', 'collapse');
  button.setAttribute('data-bs-target', '#showMore-' + defenseID);
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', 'showMore-' + defenseID);
  button.textContent = 'Show More';

  const showMoreDiv = document.createElement('div');
  showMoreDiv.className = 'collapse';
  showMoreDiv.id = "showMore" + defenseID;

  // Append the created elements to their respective parents
  buttonDiv.appendChild(button);

  spellDiv.appendChild(spellTitle);
  spellDiv.appendChild(spellList);
  spellDiv.appendChild(buttonDiv);
  spellDiv.appendChild(showMoreDiv);

  equipmentDiv.appendChild(equipmentTitle);
  equipmentDiv.appendChild(equipmentList);

  resultDiv.appendChild(equipmentDiv);
  resultDiv.appendChild(spellDiv);

  imgDiv.appendChild(img);

  nameDiv.appendChild(nameSpan);
  nameDiv.appendChild(levelSpan);

  hpDiv.appendChild(hpSpan);

  textDiv.appendChild(nameDiv);
  textDiv.appendChild(hpDiv);

  titleDiv.appendChild(imgDiv);
  titleDiv.appendChild(textDiv);

  innerDiv.appendChild(titleDiv);
  innerDiv.appendChild(rangeInput);
  innerDiv.appendChild(resultDiv);

  borderDiv.appendChild(innerDiv);

  defenseDiv.appendChild(borderDiv);

  // Append the main container to the body or a specific element in the HTML
  defensesSection.appendChild(defenseDiv);
}

/* <div class="mt-3">
  <div>
      <h5>Heroes Equipment used:</h5>
      <div class="d-flex justify-content-center align-items-center flex-wrap">
          <div class="image-container card-container text-center m-1">
              <span class="level-number text-light">x2</span>
              <img class="image" height="50" src="/images/offense/earthquake_boots.webp">
              <div class="overlay overlay-card maxed">
                  <span class="level-number">11</span>
              </div>                                                              
          </div>
          <div class="image-container card-container text-center m-1 epic-rarity">
              <span class="level-number text-light">x2</span>
              <img class="image" height="50" src="/images/offense/spiky_ball.webp">
              <div class="overlay overlay-card maxed">
                  <span class="level-number">11-13</span>
              </div>                                                              
          </div>
          <div class="image-container card-container text-center m-1">
              <span class="level-number text-light">x2</span>
              <img class="image" height="50" src="/images/offense/giant_arrow.webp">
              <div class="overlay overlay-card maxed">
                  <span class="level-number">11-13</span>
              </div>                                                              
          </div>
          <div class="image-container card-container text-center m-1 epic-rarity">
              <span class="level-number text-light">x2</span>
              <img class="image" height="50" src="/images/offense/fireball.webp">
              <div class="overlay overlay-card maxed">
                  <span class="level-number">11-13</span>
              </div>                                                              
          </div>
          <div class="image-container card-container text-center m-1">
              <span class="level-number text-light">x2</span>
              <img class="image" height="50" src="/images/offense/seeking_shield.webp">
              <div class="overlay overlay-card maxed">
                  <span class="level-number">11-13</span>
              </div>                                                              
          </div>
      </div>
  </div>
  <div class="my-3">
      <h5>Spell needed:</h5>
      <div class="d-flex justify-content-center align-items-center">
          <div class="image-container card-container text-center mx-1">
              <span class="level-number text-light">x2</span>
              <img class="image" height="50" src="/images/offense/lightning_spell.webp">
              <div class="overlay overlay-card maxed">
                  <span class="level-number">11</span>
              </div>                                                              
          </div>
          <div class="image-container card-container text-center mx-1">
              <span class="level-number text-light">x2</span>
              <div class="donate-card-img">
                  <img class="image" src="/images/other/donate.webp" width="18">
              </div>
              <img class="image" height="50" src="/images/offense/lightning_spell.webp">
              <div class="overlay overlay-card maxed">
                  <span class="level-number">11</span>
              </div>                                                              
          </div>
          <div class="image-container card-container text-center mx-1">
              <span class="level-number text-light">x2</span>
              <img class="image earthquake-spell-bg" height="50" src="/images/offense/earthquake_spell.webp">
              <div class="overlay overlay-card maxed">
                  <span class="level-number">11-13</span>
              </div>                                                              
          </div>
          <div class="h5">(3/14)</div>
      </div>
      <div class="text-center my-3">
          <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#showMore-cannon" aria-expanded="false" aria-controls="showMore-cannon">Show More</button>
      </div>                            
      <div class="collapse" id="showMore-cannon">
          <div class="d-flex justify-content-center align-items-center">
              <div class="image-container card-container text-center mx-1">
                  <span class="level-number text-light">x2</span>
                  <img class="image" height="50" src="/images/offense/lightning_spell.webp">
                  <div class="overlay overlay-card maxed">
                      <span class="level-number">11</span>
                  </div>                                                              
              </div>
              <div class="image-container card-container text-center mx-1">
                  <span class="level-number text-light">x2</span>
                  <img class="image earthquake-spell-bg" height="50" src="/images/offense/earthquake_spell.webp">
                  <div class="overlay overlay-card maxed">
                      <span class="level-number">11-13</span>
                  </div>                                                              
              </div>
              <div class="h5">(3/14)</div>
          </div>
          <div class="d-flex justify-content-center align-items-center my-3">
              <div class="image-container card-container text-center mx-1">
                  <span class="level-number text-light">x2</span>
                  <img class="image" height="50" src="/images/offense/lightning_spell.webp">
                  <div class="overlay overlay-card maxed">
                      <span class="level-number">11</span>
                  </div>                                                              
              </div>
              <div class="image-container card-container text-center mx-1">
                  <span class="level-number text-light">x2</span>
                  <img class="image earthquake-spell-bg" height="50" src="/images/offense/earthquake_spell.webp">
                  <div class="overlay overlay-card maxed">
                      <span class="level-number">11-13</span>
                  </div>                                                              
              </div>
              <div class="h5">(3/14)</div>
          </div>
          <div class="d-flex justify-content-center align-items-center my-3">
              <div class="image-container card-container text-center mx-1">
                  <span class="level-number text-light">x2</span>
                  <img class="image" height="50" src="/images/offense/lightning_spell.webp">
                  <div class="overlay overlay-card maxed">
                      <span class="level-number">11</span>
                  </div>                                                              
              </div>
              <div class="image-container card-container text-center mx-1">
                  <span class="level-number text-light">x2</span>
                  <img class="image earthquake-spell-bg" height="50" src="/images/offense/earthquake_spell.webp">
                  <div class="overlay overlay-card maxed">
                      <span class="level-number">11-13</span>
                  </div>                                                              
              </div>
              <div class="h5">(3/14)</div>
          </div>
      </div>  
  </div>                     
</div> */