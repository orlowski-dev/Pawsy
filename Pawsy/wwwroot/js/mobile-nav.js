const openMenu = () => $(".mobile-nav").css("transform", "translateX(0)");
const closeMenu = () => $(".mobile-nav").css("transform", "translateX(100%)");

$("#open-mobile-menu-btn").click((e) => { 
    e.preventDefault();
    openMenu();
});

$("#close-mobile-menu-btn").click((e) => { 
    e.preventDefault();
    closeMenu();
});

$(window).resize(() =>{ 
    if (window.innerWidth >= 800) {
        closeMenu();
    }
;});