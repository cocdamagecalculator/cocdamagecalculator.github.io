function searchDefenses(element) {
    let searchString = element.value.trim().toLowerCase();
    let defensesDiv = defensesSection.querySelectorAll('.defense');

    defensesDiv.forEach((defenseDiv) => {
        let defenseID = defenseDiv.getAttribute("data-title");

        if (defenseJSON["defense"][defenseID]["name"].toLowerCase().includes(searchString)) {
            if (defenseDiv.classList.contains("d-none")) {
                defenseDiv.classList.remove("d-none");
            }
        } else {
            if (!defenseDiv.classList.contains("d-none")) {
                defenseDiv.classList.add("d-none");
            }
        }
    });  
}