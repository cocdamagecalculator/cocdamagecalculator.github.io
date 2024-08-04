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

        defenseDiv.querySelector(".level").textContent = "(Level " + level + ")";
        defenseDiv.querySelector(".image").src = imagePath;
        defenseDiv.querySelector(".hp").textContent = getDefense(defenseID)["hp"][level - 1];   
    }
    calculateDefense(defenseDiv, getEquipmentDamage());
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
            maxLevel = getSpell(offenseID)["damage"].length;
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
            const sorteddamageList = getEquipmentSortedDamageArray(offenseID);
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
            updateEquipmentUsed();
        } else {
            console.log("ERROR: Div did not contain appropriate type!");
            //window.location.href = "/html/error.html";
        }

        let overlayDiv = offenseDiv.querySelector(".overlay");
        if (level == maxLevel) {            
            overlayDiv.classList.remove("not-maxed");
            overlayDiv.classList.add("maxed");
        } else {
            overlayDiv.classList.remove("maxed");
            overlayDiv.classList.add("not-maxed");
        }
        offenseDiv.querySelector(".level-number").textContent = levelNumber;
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
                offenseDiv.classList.remove("d-none");
            } else {
                offenseDiv.classList.add("d-none");

                donatedLightningSpellCount = 0;
                calculate();
            }
            return;
          }
        }
    });
}

function updateDonatedCount(element) {
    const warningDiv = document.getElementById("input-warning");
    const inputNumber = Number.parseInt(element.value);
    console.log(inputNumber);
    if (Number.isNaN(inputNumber)) {
        warningDiv.classList.remove("d-none");
    } else {
        if (inputNumber < 0 || inputNumber > 3) {
            warningDiv.classList.remove("d-none");
        } else {
            donatedLightningSpellCount = inputNumber;

            warningDiv.classList.add("d-none");
            calculate();
        }       
    }
}

function updateEarthquakeOrder(element) {
    earthquakeOrder = element.value;
    calculate();
}

function updateEquipmentUsed() {
    const equipmentList = [];

    if (earthquakeBootsLevel !== "0") {
        equipmentList.push(createEquipmentDiv("earthquake_boots", earthquakeBootsLevel, isEquipmentMaxed("earthquake_boots", earthquakeBootsLevel)));
    }
    if (spikyBallLevel !== "0") {
        equipmentList.push(createEquipmentDiv("spiky_ball", spikyBallLevel, isEquipmentMaxed("spiky_ball", spikyBallLevel)));
    }
    if (giantArrowLevel !== "0") {
        equipmentList.push(createEquipmentDiv("giant_arrow", giantArrowLevel, isEquipmentMaxed("giant_arrow", giantArrowLevel)));
    }
    if (fireballLevel !== "0") {
        equipmentList.push(createEquipmentDiv("fireball", fireballLevel, isEquipmentMaxed("fireball", fireballLevel)));
    }
    if (shieldLevel !== "0") {
        equipmentList.push(createEquipmentDiv("seeking_shield", shieldLevel, isEquipmentMaxed("seeking_shield", shieldLevel)));
    }

    if (equipmentList.length > 0) {
        defenseDivs = defensesSection.querySelectorAll(".defense");

        defenseDivs.forEach((defenseDiv) => {        
            const equipmentListDiv = defenseDiv.querySelector(".equipment-list");
            const equipmentDiv = defenseDiv.querySelector(".equipment-div");
            const defenseID = defenseDiv.getAttribute("data-title");

            while (equipmentListDiv.firstChild) {
                equipmentListDiv.removeChild(equipmentListDiv.firstChild);
            }
            for (let equipment of equipmentList) {
                const equipmentNode = equipment.cloneNode(true);
                const immuneList = getDefense(defenseID)["immune"];
                const equipmentID = equipmentNode.getAttribute('data-title');
                if (immuneList.includes(equipmentID)) {
                    equipmentNode.classList.add("immune");
                }

                equipmentListDiv.appendChild(equipmentNode);
            }
            equipmentDiv.classList.remove("d-none");
        });
    } else {
        defenseDivs = defensesSection.querySelectorAll(".defense");

        defenseDivs.forEach((defenseDiv) => {   
            let equipmentDiv = defenseDiv.querySelector(".equipment-div");

            equipmentDiv.classList.add("d-none");
        });
    }
}

function createEquipmentDiv(equipmentID, level, isMaxed) {
    let imagePath = "/images/offense/" + equipmentID + ".webp";

    // Create div
    const imageContainerDiv = document.createElement('div');
    let classString = 'image-container card-container text-center m-1';
    if (equipmentID === "spiky_ball" || equipmentID === "fireball") {
        classString += " epic-rarity";
    }
    imageContainerDiv.className = classString;
    imageContainerDiv.setAttribute('data-title', equipmentID);

    const levelNumberDiv = document.createElement('div');
    levelNumberDiv.className = 'my-1';

    const levelNumberSpan = document.createElement('span');
    let numberSpanClass = 'equipment-card level-number';
    if (isMaxed) {            
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

function createSpellDiv(spellID, level, amount, isDonated, isMaxed) {
    let imagePath = "/images/offense/" + spellID + ".webp";

    // Create div
    const imageContainerDiv = document.createElement('div');
    imageContainerDiv.className = 'image-container card-container text-center m-1';
    imageContainerDiv.setAttribute('data-title', spellID);

    const amountDiv = document.createElement('span');
    amountDiv.className = 'level-number text-light';
    amountDiv.textContent = "x" + amount;

    let donatedIconDiv;
    if (isDonated) {
        donatedIconDiv = document.createElement('div');
        donatedIconDiv.className = 'donate-card-img';

        const donateIcon = document.createElement('img');
        donateIcon.className = 'image';
        donateIcon.setAttribute('height', '18');
        donateIcon.setAttribute('src', "/images/other/donate.webp");

        donatedIconDiv.appendChild(donateIcon);
    }

    const image = document.createElement('img');
    let classString = 'image';
    if (spellID === "earthquake_spell") {
        classString += " earthquake-spell-bg";
    }
    image.className = classString;
    image.setAttribute('height', '50');
    image.setAttribute('src', imagePath);

    const levelNumberDiv = document.createElement('div');
    let numberDivClass = 'overlay overlay-card';
    if (isMaxed) {            
        numberDivClass += " maxed";
    } else {
        numberDivClass += " not-maxed";
    }
    levelNumberDiv.className = numberDivClass;

    const levelNumberSpan = document.createElement('span');
    levelNumberSpan.className = "level-number";
    levelNumberSpan.textContent = level;    

    // Append the level number span to the overlay div
    levelNumberDiv.appendChild(levelNumberSpan);

    imageContainerDiv.appendChild(amountDiv);
    if (isDonated) {
        imageContainerDiv.appendChild(donatedIconDiv);
    }
    imageContainerDiv.appendChild(image);
    imageContainerDiv.appendChild(levelNumberDiv);

    return imageContainerDiv;
}