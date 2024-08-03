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
        if (offenseDiv.classList.contains("spell")) {
            maxLevel = offenseJSON["offense"]["spell"][offenseID]["damage"].length;
            
        } else if (offenseDiv.classList.contains("equipment")) {
            maxLevel = offenseJSON["offense"]["equipment"][offenseID]["damage"].length;
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
        offenseDiv.querySelector(".level-number").innerHTML = level;
    }
}