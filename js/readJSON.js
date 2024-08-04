function getDefense(defenseID) {
    return defenseJSON["defense"][defenseID];
}

function getEquipment(equipmentID) {
    return offenseJSON["offense"]["equipment"][equipmentID];
}

function getSpell(spellID) {
    return offenseJSON["offense"]["spell"][spellID];
}

function getAllDefenses() {
    return defenseJSON["defense"];
}

function getAllEquipments() {
    return offenseJSON["offense"]["equipment"];
}

function getAllSpells() {
    return offenseJSON["offense"]["spell"];
}

function getEquipmentSortedDamageArray(equipmentID) {
    const damageList = offenseJSON["offense"]["equipment"][equipmentID]["damage"];
    return Object.entries(damageList).sort(([, valueA], [, valueB]) => valueA - valueB);
}

function isSpellMaxed(spellID, level) {
    return getSpell(spellID)["damage"].length == level;
}

function isEquipmentMaxed(equipmentID, level) {
    const sortedDamageArray = getEquipmentSortedDamageArray(equipmentID);
    return sortedDamageArray[sortedDamageArray.length - 1][0] === level;
}