// const addInput = () => $('<label for="site-search">Search the site:</label>
// <input type="search" id="site-search" name="q" />"
const openMenu = () => $(".nav-header").css("transform", "translateX(0)");
const closeMenu = () => $(".nav-header").css("transform", "translateX(100%)");

$("#open-mobile-menu-btn").click((e) => {
  e.preventDefault();
  openMenu();
});

$("#close-mobile-menu-btn").click((e) => {
  e.preventDefault();
  closeMenu();
});

$(window).resize(() => {
  if (window.innerWidth >= 800) {
    closeMenu();
    addInput();
  }
});

// $(document).ready(function(){
//   $("#btn1").click(function(){
//     $("p").append(" <b>Appended text</b>.");
//   });

//   $("#btn2").click(function(){
//     $("ol").append("<li>Appended item</li>");
//   });
// });
// <label for="site-search">Search the site:</label>
// <input type="search" id="site-search" name="q" />

// <button>Search</button>
