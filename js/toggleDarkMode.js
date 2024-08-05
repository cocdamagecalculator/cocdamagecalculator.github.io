const lightModeIcon = document.getElementById("lightModeIcon");
const darkModeIcon = document.getElementById("darkModeIcon");

const navbar = document.getElementById("navbar");

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    localStorage.setItem("isDarkMode", isDarkMode);
    console.log(localStorage.getItem("isDarkMode"));
    setThemeMode(isDarkMode);
}

function setThemeMode(isDarkMode) {
    console.log(typeof isDarkMode);
    if (isDarkMode) {
        darkMode();
    } else {
        lightMode();
    }
}

function lightMode() {
    console.log("Light Mode");
    lightModeIcon.classList.remove("d-none");
    darkModeIcon.classList.add("d-none");

    themeStyleSheet.setAttribute('href', lightStyleSheet);
    navbar.setAttribute("data-bs-theme", "light");
}

function darkMode() {
    console.log("Dark Mode");
    lightModeIcon.classList.add("d-none");
    darkModeIcon.classList.remove("d-none");

    themeStyleSheet.setAttribute('href', darkStyleSheet);
    navbar.setAttribute("data-bs-theme", "dark");
}