const lightStyleSheet = "/css/light.css";
const darkStyleSheet = "/css/dark.css";

const themeStyleSheet = document.getElementById("theme");
let isDarkMode = localStorage.getItem("isDarkMode") === "true";

if (isDarkMode === null) {
  isDarkMode = false;
  localStorage.setItem("isDarkMode", isDarkMode);
}

if (isDarkMode) {
    themeStyleSheet.setAttribute('href', darkStyleSheet);
} else {
    themeStyleSheet.setAttribute('href', lightStyleSheet);
}