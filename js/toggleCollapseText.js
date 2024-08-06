function toggleCollapseText(element) { 
    if (element.getAttribute("aria-expanded") === "true") {
        switch (element.textContent) {
            case "Show More":
                element.textContent = "Show Less"
                break;
            case "Show":
                element.textContent = "Hide";
                break;
        }
    } else {
        switch (element.textContent) {
            case "Show Less":
                element.textContent = "Show More"
                break;
            case "Hide":
                element.textContent = "Show";
                break;
        }
    }
}