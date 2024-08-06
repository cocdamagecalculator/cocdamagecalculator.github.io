const scrollUpBtn = document.getElementById("scrollUpBtn");

const minScroll = 1000;

window.addEventListener('scroll', () => {
    if (document.documentElement.scrollTop > minScroll) {
        scrollUpBtn.classList.remove("d-none");
    } else {
        scrollUpBtn.classList.add("d-none");
    }
});

function scrollUp() {
    document.documentElement.scrollTop = 0;
}