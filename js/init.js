const defensesSection = document.getElementById("defenses");
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

function loadDefense(defenseName) {
    let defensesDiv = defensesSection.querySelectorAll('div');

    defensesDiv.forEach((defenseDiv) => {
        if (defenseDiv.getAttribute("data-title") === defenseName) {
            let level = defenseJSON["defense"][defenseName]["hp"].length;
            let imagePath = "/images/defense/" + defenseName + "/" + level + ".webp";

            defenseDiv.querySelector(".image").src = imagePath;
            defenseDiv.querySelector(".hp").innerHTML = defenseJSON["defense"][defenseName]["hp"][level - 1];
            defenseDiv.querySelector(".range").max = level;
            defenseDiv.querySelector(".range").value = level;
            return;
        }
    });  
}