function updateDefense(element) {
    let defenseDiv = element;
    do {
        if(defenseDiv.classList.contains("defense")){
            break;
        } else {
            defenseDiv = defenseDiv.parentNode;
        }
    } while (defenseDiv != null);

    if (defenseDiv) {
        let level = element.value;
        let defenseID = defenseDiv.getAttribute("data-title");
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

        defenseDiv.querySelector(".level").innerHTML = "(Level " + level + ")";
        defenseDiv.querySelector(".image").src = imagePath;
        defenseDiv.querySelector(".hp").innerHTML = defenseJSON["defense"][defenseID]["hp"][level - 1];   
    }
}

function updateOffense(element) {
    let offenseDiv = element;
    do {
        if(offenseDiv.classList.contains("offense")){
            break;
        } else {
            offenseDiv = offenseDiv.parentNode;
        }
    } while (offenseDiv != null);

    if (offenseDiv) {
        let level = element.value;
        let offenseID = offenseDiv.getAttribute("data-title");
        let maxLevel;
        let levelNumber;
        if (offenseDiv.classList.contains("spell")) {
            maxLevel = offenseJSON["offense"]["spell"][offenseID]["damage"].length;
            levelNumber = level;

            switch(offenseID) {
            case "lightning_spell":
                if (offenseDiv.getAttribute("data-donated") === "true") {
                    donatedLightningSpellLevel = levelNumber;                    
                } else {
                    lightningSpellLevel = levelNumber;
                }         
                break;
            case "earthquake_spell":
                earthquakeSpellLevel = levelNumber;
                break;
            }
        } else if (offenseDiv.classList.contains("equipment")) {
            const damageList = offenseJSON["offense"]["equipment"][offenseID]["damage"];
            const sorteddamageList = Object.entries(damageList).sort(([, valueA], [, valueB]) => valueA - valueB);
            maxLevel = sorteddamageList.length;
            levelNumber = sorteddamageList[level - 1][0];

            switch(offenseID) {
                case "earthquake_boots":
                    earthquakeBootsLevel = levelNumber;
                    break;
                case "spiky_ball":
                    spikyBallLevel = levelNumber;
                    break;
                case "giant_arrow":
                    giantArrowLevel = levelNumber;
                    break;
                case "fireball":
                    fireballLevel = levelNumber;
                    break;
                case "seeking_shield":
                    shieldLevel = levelNumber;
                    break;
            }
        } else {
            // Raise error
        }

        let overlayDiv = offenseDiv.querySelector(".overlay");
        if (level == maxLevel) {            
            if (overlayDiv.classList.contains("not-maxed")) {
                overlayDiv.classList.remove("not-maxed");
            }
            overlayDiv.classList.add("maxed");
        } else {
            if (overlayDiv.classList.contains("maxed")) {
                overlayDiv.classList.remove("maxed");
            }
            overlayDiv.classList.add("not-maxed");
        }
        offenseDiv.querySelector(".level-number").innerHTML = levelNumber;
    }
    calculate();
}

function useDonatedLightningSpell(element) {
    offenseDivs = offensesSection.querySelectorAll(".offense");

    offenseDivs.forEach((offenseDiv) => {
        let spellID = offenseDiv.getAttribute("data-title");
        if (spellID === "lightning_spell") {
          if (offenseDiv.getAttribute("data-donated") === "true") {
            if (element.checked) {
                if (offenseDiv.classList.contains("d-none")) {
                    offenseDiv.classList.remove("d-none");
                }
            } else {
                if (!offenseDiv.classList.contains("d-none")) {
                    offenseDiv.classList.add("d-none");
                }
            }
            return;
          }
        }
    });
}

function updateDonatedCount(element) {
    if (element.value.length == 0) {
        donatedLightningSpellCount = 0;
    } else {
        donatedLightningSpellCount = element.value;
    }
    calculate();
}

function updateEarthquakeOrder(element) {
    earthquakeOrder = element.value;
    calculate();
}

function updateEquipmentUsed() {
    const equipmentList = [];

    if (earthquakeBootsLevel !== "0") {
        equipmentList.push(createEquipmentDiv("earthquake_boots", earthquakeBootsLevel));
    }
    if (spikyBallLevel !== "0") {
        equipmentList.push(createEquipmentDiv("spiky_ball", spikyBallLevel));
    }
    if (giantArrowLevel !== "0") {
        equipmentList.push(createEquipmentDiv("giant_arrow", giantArrowLevel));
    }
    if (fireballLevel !== "0") {
        equipmentList.push(createEquipmentDiv("fireball", fireballLevel));
    }
    if (shieldLevel !== "0") {
        equipmentList.push(createEquipmentDiv("seeking_shield", shieldLevel));
    }

    if (equipmentList.length > 0) {
        defenseDivs = defensesSection.querySelectorAll(".defense");

        defenseDivs.forEach((defenseDiv) => {        
            let equipmentListDiv = defenseDiv.querySelector(".equipment-list");
            let equipmentDiv = defenseDiv.querySelector(".equipment-div");

            while (equipmentListDiv.firstChild) {
                equipmentListDiv.removeChild(equipmentListDiv.firstChild);
            }
            for (let equipment of equipmentList) {          
                equipmentListDiv.appendChild(equipment.cloneNode(true));
            }

            if (equipmentDiv.classList.contains("d-none")) {
                equipmentDiv.classList.remove("d-none")
            }
        });
    } else {
        defenseDivs = defensesSection.querySelectorAll(".defense");

        defenseDivs.forEach((defenseDiv) => {   
            let equipmentDiv = defenseDiv.querySelector(".equipment-div");

            if (!equipmentDiv.classList.contains("d-none")) {
                equipmentDiv.classList.add("d-none")
            }
        });
    }
}

function createEquipmentDiv(equipmentID, level) {
    let imagePath = "/images/offense/" + equipmentID + ".webp";

    // Create div
    const imageContainerDiv = document.createElement('div');
    let classString = 'image-container card-container text-center m-1';
    if (equipmentID === "spiky_ball" || equipmentID === "fireball") {
        classString += " epic-rarity";
    }
    imageContainerDiv.className = classString;

    const levelNumberDiv = document.createElement('div');
    levelNumberDiv.className = 'my-1';

    const levelNumberSpan = document.createElement('span');
    let numberSpanClass = 'equipment-card level-number';
    const damageList = offenseJSON["offense"]["equipment"][equipmentID]["damage"];
    const sorteddamageList = Object.entries(damageList).sort(([, valueA], [, valueB]) => valueA - valueB);
    maxLevel = sorteddamageList[sorteddamageList.length - 1][0];
    if (level === maxLevel) {            
        numberSpanClass += " maxed";
    } else {
        numberSpanClass += " not-maxed";
    }
    levelNumberSpan.className = numberSpanClass;
    levelNumberSpan.textContent = level;

    const image = document.createElement('img');
    image.className = 'image';
    image.setAttribute('height', '50');
    image.setAttribute('src', imagePath);

    // Append the level number span to the overlay div
    levelNumberDiv.appendChild(levelNumberSpan);

    imageContainerDiv.appendChild(levelNumberDiv);
    imageContainerDiv.appendChild(image);

    return imageContainerDiv;
}