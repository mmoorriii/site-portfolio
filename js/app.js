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
// получаем ссылки-якори
const links = document.querySelectorAll('.header__item');

// получаем блоки
const aboutMe = document.getElementById('about-me');
const skills = document.getElementById('skills');
const projects = document.getElementById('projects');
const contacts = document.getElementById('contacts');

// функция для проверки позиции блоков и добавления класса active
function checkPosition() {
   const currentPosition = window.pageYOffset + 100;

   if (currentPosition >= aboutMe.offsetTop && currentPosition < skills.offsetTop) {
      addActiveClass(links[1]);
   } else if (currentPosition >= skills.offsetTop && currentPosition < projects.offsetTop) {
      addActiveClass(links[2]);
   } else if (currentPosition >= projects.offsetTop && currentPosition < contacts.offsetTop) {
      addActiveClass(links[3]);
   } else if (currentPosition >= contacts.offsetTop) {
      addActiveClass(links[4]);
   } else {
      addActiveClass(links[0]);
   }
}

// функция для добавления класса active
function addActiveClass(link) {
   links.forEach((item) => {
      item.classList.remove('active');
   });
   link.classList.add('active');
}

// привязываем функцию к событию прокрутки страницы
window.addEventListener('scroll', checkPosition);

// вызываем функцию при загрузке страницы для установки активного класса
checkPosition();

//---------------------------------------------------------------------------------------------------------
let mailLink = document.querySelector('.mail');
let linkText = document.querySelector('.link-text')

mailLink.addEventListener('click', function (event) {
   event.preventDefault();
   linkText.classList.toggle('show');
});
//-----SHOW MENU------------------------------------------------------------------------------------------------------------------------------------
let menuBtn = document.querySelector('.menu');

menuBtn.addEventListener('click', () => {
   document.querySelector('.header').classList.toggle('show');
   document.querySelector('.header__list').classList.toggle('show');
})
let btnChangeTheme = document.querySelector('.theme');
let wrapper = document.querySelector('.wrapper');
var savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
   wrapper.classList.add("light");
}

btnChangeTheme.addEventListener('click', () => {
   wrapper.classList.toggle('light');

   // сохраняем выбранную тему в локальном хранилище
   if (wrapper.classList.contains("light")) {
      localStorage.setItem("theme", "light");
   } else {
      localStorage.setItem("theme", "dark");
   }
})