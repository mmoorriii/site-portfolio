"use strict"

/* Проверка поддержки webp, добавление класса webp или no-webp для HTML */
function isWebp() {
   // Проверка поддержки webp
   function testWebP(callback) {
      let webP = new Image();
      webP.onload = webP.onerror = function () {
         callback(webP.height == 2);
      };
      webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
   }
   // Добавление класса _webp или _no-webp для HTML
   testWebP(function (support) {
      let className = support === true ? 'webp' : 'no-webp';
      document.documentElement.classList.add(className);
   });
}

isWebp();
//------------------------------------------------------------------------------------------

window.addEventListener('scroll', function () {
   if (window.pageYOffset > document.querySelector('.page__preview').offsetHeight / 5) {
      document.querySelector('.header').classList.add('fixed');
   } else {
      document.querySelector('.header').classList.remove('fixed');
   }
});

//-----CHANGE DEFAULT SCROLL ANCHOR LINKS------------------------------------------------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
   anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const block = document.querySelector(this.getAttribute('href'));
      const blockPosition = block.offsetTop - 50;

      window.scrollTo({
         top: blockPosition,
         behavior: 'smooth'
      });
   });
});

//----------------------------------------------------------------------------------------------------------------
const sections = document.querySelectorAll("#header, #about-me, #skills, #projects, #contacts");
const navLinks = document.querySelectorAll(".header__item");

window.addEventListener("scroll", () => {
   const currentScroll = window.pageYOffset;

   sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (currentScroll >= sectionTop - sectionHeight * 0.5 && currentScroll < sectionTop + sectionHeight * 0.5) {
         section.classList.add("active");
         const index = Array.from(sections).indexOf(section);
         navLinks[index].classList.add("active");
      } else {
         section.classList.remove("active");
         const index = Array.from(sections).indexOf(section);
         navLinks[index].classList.remove("active");
      }
   });
});

//---------------------------------------------------------------------------------------------------------
let mailLink = document.querySelector('.mail');
let linkText = document.querySelector('.link-text')

mailLink.addEventListener('click', function (event) {
   event.preventDefault();
   linkText.classList.add('show');
});


mailLink.addEventListener('dblclick', function (event) {
   event.preventDefault();
   linkText.classList.remove('show');
});