const defensesSection = document.getElementById("defenses");
const offensesSection = document.getElementById("offenses");

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
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

function loadSpell(spellID) {
  offenseDivs = offensesSection.querySelectorAll(".offense");
  console.log(spellID);

  offenseDivs.forEach((offenseDiv) => {
    if (offenseDiv.getAttribute("data-title") === spellID) {
      // if (spellID === "lightning_spell") {
      //   if (offenseDiv.getAttribute("data-donated") === "true") {

      //   } else {

      //   }
      // }
      let level = offenseJSON["offense"]["spell"][spellID]["damage"].length;
      let imagePath = "/images/offense/" + spellID + ".webp";

      offenseDiv.querySelector(".overlay").classList.add("maxed");
      offenseDiv.querySelector(".level-number").innerHTML = level;
      offenseDiv.querySelector(".image").src = imagePath;
      offenseDiv.querySelector(".range").max = level;
      offenseDiv.querySelector(".range").value = level;
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
  innerDiv.setAttribute('data-title', defenseID);
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

  // Append the created elements to their respective parents
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

  borderDiv.appendChild(innerDiv);

  defenseDiv.appendChild(borderDiv);

  // Append the main container to the body or a specific element in the HTML
  defensesSection.appendChild(defenseDiv);
}