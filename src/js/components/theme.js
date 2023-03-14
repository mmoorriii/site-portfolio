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