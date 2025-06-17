// import { defineStore } from "pinia"
// import { ref } from "vue"

// export const useThemeStore = defineStore("theme", () => {
//   const isDarkMode = ref(localStorage.getItem("darkMode") === "true")

//   const toggleDarkMode = () => {
//     isDarkMode.value = !isDarkMode.value
//     localStorage.setItem("darkMode", isDarkMode.value.toString())

//     if (isDarkMode.value) {
//       document.documentElement.classList.add("dark")
//     } else {
//       document.documentElement.classList.remove("dark")
//     }
//   }

//   // Initialize theme on store creation
//   if (isDarkMode.value) {
//     document.documentElement.classList.add("dark")
//   }

//   return {
//     isDarkMode,
//     toggleDarkMode,
//   }
// })
