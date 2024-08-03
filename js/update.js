function update(element) {
    var parentDiv = element.closest("div");
    if (parentDiv) {
        let defenseName = parentDiv.getAttribute("data-title");
        let imagePath = "/images/defense/" + defenseName + "/" + element.value + ".webp";

        parentDiv.querySelector(".image").src = imagePath;
        parentDiv.querySelector(".hp").innerHTML = defenseJSON["defense"][defenseName]["hp"][element.value - 1];   
    }
}