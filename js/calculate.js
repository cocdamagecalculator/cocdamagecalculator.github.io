function calculate() {    
    const equipmentDamage = getEquipmentDamage();

    defenseDivs = defensesSection.querySelectorAll(".defense");

    defenseDivs.forEach((defenseDiv) => {   
        calculateDefense(defenseDiv, equipmentDamage);
    });
}

function getEquipmentDamage() {
    let equipmentDamage = 0;

    if (spikyBallLevel !== "0") {
        equipmentDamage += getEquipment("spiky_ball")["damage"][spikyBallLevel];
    }
    if (giantArrowLevel !== "0") {
        equipmentDamage += getEquipment("giant_arrow")["damage"][giantArrowLevel];
    }
    if (fireballLevel !== "0") {
        equipmentDamage += getEquipment("fireball")["damage"][fireballLevel];
    }
    if (shieldLevel !== "0") {
        equipmentDamage += getEquipment("seeking_shield")["damage"][shieldLevel];
    }
    return equipmentDamage;
}

function calculateDefense(defenseDiv, equipmentDamage) {
    const defenseID = defenseDiv.getAttribute("data-title");
    const collapseDiv = defenseDiv.querySelector(".collapse");
    const collapse = new bootstrap.Collapse(collapseDiv, {
        toggle: false
    })
    collapse.hide();  
   
    const maxHP = defenseDiv.querySelector(".hp").textContent;
    if (maxHP > equipmentDamage) {
        const spellDiv = defenseDiv.querySelector(".spell-div");
        spellDiv.classList.remove("d-none");
        const statusDiv = defenseDiv.querySelector(".status-div");
        statusDiv.classList.add("d-none");
        const collapseBtn = defenseDiv.querySelector(".collapse-btn");
        collapseBtn.classList.remove("d-none");

        const immuneList = getDefense(defenseID)["immune"];
        const isImmune = immuneList.length > 0;       
        const eqSpellDamage = maxHP * getSpell("earthquake_spell")["damage"][earthquakeSpellLevel - 1] / 100;
        let eqBootsDamage = 0;
        if (earthquakeBootsLevel !== "0" && !immuneList.includes("earthquake_boots")) {
            eqBootsDamage = maxHP * getEquipment("earthquake_boots")["damage"][earthquakeBootsLevel] / 100;
            let hp = maxHP - eqBootsDamage;
            if (hp <= equipmentDamage) {
                setDestroyedStatus(defenseDiv);
                return;
            }
        }       
        const zapSpellDamage = getSpell("lightning_spell")["damage"][lightningSpellLevel - 1];
        const donatedZapSpellDamage = getSpell("lightning_spell")["damage"][donatedLightningSpellLevel - 1];
        let isMainDisplay = true;
        const spellMainDisplayDiv = defenseDiv.querySelector(".spell-main-display");               
        while (spellMainDisplayDiv.firstChild) {
            spellMainDisplayDiv.removeChild(spellMainDisplayDiv.firstChild);
        }
        let spellDisplayDiv;
        spellDisplayDiv = defenseDiv.querySelector(".spell-display");
        while (spellDisplayDiv.firstChild) {
            spellDisplayDiv.removeChild(spellDisplayDiv.firstChild);
        }

        let maxEQSpellCount = 1;
        while (maxEQSpellCount < maxSpellCount) {
            if (!isMainDisplay && isImmune) {
                break;
            }

            const nodeArray = [];
            const spellUsed = new Set();
            let spellCount = maxEQSpellCount;          
            let hp = maxHP - equipmentDamage;

            if (maxEQSpellCount != 0 && !immuneList.includes("earthquake_spell") && !immuneList.includes("earthquake_boots")) {
                hp = manageEQOrder(maxHP - equipmentDamage, eqSpellDamage, eqBootsDamage, maxEQSpellCount, immuneList);

                spellUsed.add("earthquake_spell");
                nodeArray.push(createSpellDiv("earthquake_spell", earthquakeSpellLevel, maxEQSpellCount, false, isSpellMaxed("earthquake_spell", earthquakeSpellLevel)));
            }
            
            let donatedZapSpellNeeded = 0;
            if (hp > 0 && donatedLightningSpellCount > 0 && !immuneList.includes("lightning_spell")) {
                donatedZapSpellNeeded = Math.ceil(hp / donatedZapSpellDamage);

                if (donatedZapSpellNeeded > donatedLightningSpellCount) {
                    donatedZapSpellNeeded = donatedLightningSpellCount;
                }
                spellCount += donatedZapSpellNeeded;
                hp -= donatedZapSpellNeeded * donatedZapSpellDamage;
                
                spellUsed.add("lightning_spell");
                nodeArray.push(createSpellDiv("lightning_spell", donatedLightningSpellLevel, donatedZapSpellNeeded, true, isSpellMaxed("lightning_spell", donatedLightningSpellLevel)));
            }

            if (hp > 0 && !immuneList.includes("lightning_spell")) {
                let zapSpellNeeded = Math.ceil(hp / zapSpellDamage);
                spellCount += zapSpellNeeded;
                hp -= zapSpellNeeded * zapSpellDamage;

                spellUsed.add("lightning_spell");
                nodeArray.push(createSpellDiv("lightning_spell", lightningSpellLevel, zapSpellNeeded, false, isSpellMaxed("lightning_spell", lightningSpellLevel)));
            }                

            if (spellCount <= maxSpellCount && hp <= 0) {
                nodeArray.reverse();
                const amountDiv = document.createElement('div');

                const normalDiv = document.createElement('div');
                normalDiv.className = "fs-5 fw-bold";
                normalDiv.textContent = "(" + spellCount + "/" + maxSpellCount + ")";
                amountDiv.appendChild(normalDiv);

                if (donatedZapSpellNeeded > 0) {
                    const donateDiv = document.createElement('div');
                    donateDiv.className = "d-flex align-items-center";      

                    const donateAmountDiv = document.createElement('span');
                    donateAmountDiv.className = "fs-5 fw-bold me-1 mb-1px";
                    donateAmountDiv.textContent = "+" + donatedZapSpellNeeded;

                    const donateIcon = document.createElement('img');
                    donateIcon.className = 'image';
                    donateIcon.setAttribute('height', '18');
                    donateIcon.setAttribute('src', "/images/other/donate.webp");

                    donateDiv.appendChild(donateAmountDiv);
                    donateDiv.appendChild(donateIcon);
                    amountDiv.appendChild(donateDiv);
                }
                nodeArray.push(amountDiv);

                if (isMainDisplay) {
                    for (let node of nodeArray) {
                        spellMainDisplayDiv.appendChild(node.cloneNode(true));
                    }
                    isMainDisplay = false;
                } else {
                    const spellsContainerDiv = document.createElement('div');
                    spellsContainerDiv.className = "d-flex justify-content-center align-items-center";

                    for (let node of nodeArray) {
                        spellsContainerDiv.appendChild(node.cloneNode(true));
                    }
                    spellDisplayDiv.appendChild(spellsContainerDiv);
                }
                if (maxEQSpellCount != 1 && spellUsed.size == 1 && spellUsed.has("earthquake_spell")) {
                    break;     
                }
            } else if (!isImmune) {
                break;
            }

            switch (maxEQSpellCount) {
                case 0:
                    maxEQSpellCount = 2;
                    break;
                case 1:
                    maxEQSpellCount = 0;
                    break;
                default:
                    maxEQSpellCount++;
            }
        } 
        if (isMainDisplay) {
            setImpossibleStatus(defenseDiv);
        } else if (spellDisplayDiv.childElementCount < 1) {
            collapseBtn.classList.add("d-none");
        }
    } else {
        setDestroyedStatus(defenseDiv);
    }
}

function manageEQOrder(hp, eqSpellDamage, eqBootsDamage, maxEQSpellCount, immuneList) {
    let eqCount = 0;

    if (earthquakeOrder === "earthquake_boots") {
        hp = calculateEQDamage(hp, eqBootsDamage, eqCount)
        eqCount++;

        for (let eqSpellCount = 1; eqSpellCount <= maxEQSpellCount; eqSpellCount++) {
            hp = calculateEQDamage(hp, eqSpellDamage, eqCount)
            eqCount++;
            console.log(eqCount);
        }
    } else {
        for (let eqSpellCount = 1; eqSpellCount <= maxEQSpellCount; eqSpellCount++) {
            hp = calculateEQDamage(hp, eqSpellDamage, eqCount)
            eqCount++;
        }

        hp = calculateEQDamage(hp, eqBootsDamage, eqCount)
        eqCount++;
    }
    return hp;
}

function calculateEQDamage(hp, eqDamage, eqCount) {
    return hp - eqDamage * (1 / (2 * eqCount + 1));
}

function setDestroyedStatus(defenseDiv) {
    let spellDiv = defenseDiv.querySelector(".spell-div");
    spellDiv.classList.add("d-none");

    let statusDiv = defenseDiv.querySelector(".status-div");
    statusDiv.classList.remove("d-none");
    let statusImg = defenseDiv.querySelector(".status-img");
    statusImg.setAttribute('src', "/images/other/champion_king.webp");
    let statusText = defenseDiv.querySelector(".status-text");
    statusText.textContent = "That heroes equipment setup is enough to destroy this defense without any spells needed. Huzzah! 🎉";
}

function setImpossibleStatus(defenseDiv) {
    let spellDiv = defenseDiv.querySelector(".spell-div");
    spellDiv.classList.add("d-none");

    let statusDiv = defenseDiv.querySelector(".status-div");
    statusDiv.classList.remove("d-none");
    let statusImg = defenseDiv.querySelector(".status-img");
    statusImg.setAttribute('src', "/images/other/raged-barbarian.png");
    let statusText = defenseDiv.querySelector(".status-text");
    statusText.textContent = "It's impossible to destroy this defense with setup. Womp womp! 😔";
}

function debug() {
    console.log(maxSpellCount);
    console.log(lightningSpellLevel);
    console.log(donatedLightningSpellLevel);
    console.log(donatedLightningSpellCount);
    console.log(earthquakeSpellLevel);
    console.log(earthquakeBootsLevel);
    console.log(spikyBallLevel);
    console.log(giantArrowLevel);
    console.log(fireballLevel);
    console.log(shieldLevel);
    console.log(earthquakeOrder);
}