const lightStyleSheet = "/css/light.css";
const darkStyleSheet = "/css/dark.css";

const lightModeIcon = document.getElementById("lightModeIcon");
const darkModeIcon = document.getElementById("darkModeIcon");

const themeStyleSheet = document.getElementById("theme");
const navbar = document.getElementById("navbar");

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        darkMode();
    } else {
        lightMode();
    }
}

function lightMode() {
    lightModeIcon.classList.remove("d-none");
    darkModeIcon.classList.add("d-none");

    themeStyleSheet.setAttribute('href', lightStyleSheet);
    navbar.setAttribute("data-bs-theme", "light");
}

function darkMode() {
    lightModeIcon.classList.add("d-none");
    darkModeIcon.classList.remove("d-none");

    themeStyleSheet.setAttribute('href', darkStyleSheet);
    navbar.setAttribute("data-bs-theme", "dark");
}