<template>
  <footer class="bg-gray-800 text-white py-12 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Company Info -->
        <div class="animate__animated animate__fadeInUp">
          <h3 class="text-xl font-bold mb-4">
            <i class="pi pi-shopping-bag mr-2"></i>
            E-Shop
          </h3>
          <p class="text-gray-400 mb-4">
            Your trusted online shopping destination for quality products at great prices.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <i class="pi pi-facebook text-xl"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <i class="pi pi-twitter text-xl"></i>
            </a>
            <a href="#" class="text-gray-400 hover:text-white transition-colors">
              <i class="pi pi-instagram text-xl"></i>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="animate__animated animate__fadeInUp animate__delay-1s">
          <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
          <ul class="space-y-2">
            <li><router-link to="/" class="footer-link">Home</router-link></li>
            <li><router-link to="/products" class="footer-link">Products</router-link></li>
            <li><router-link to="/cart" class="footer-link">Cart</router-link></li>
            <li><a href="#" class="footer-link">About Us</a></li>
          </ul>
        </div>

        <!-- Customer Service -->
        <div class="animate__animated animate__fadeInUp animate__delay-2s">
          <h4 class="text-lg font-semibold mb-4">Customer Service</h4>
          <ul class="space-y-2">
            <li><a href="#" class="footer-link">Contact Us</a></li>
            <li><a href="#" class="footer-link">FAQ</a></li>
            <li><a href="#" class="footer-link">Shipping Info</a></li>
            <li><a href="#" class="footer-link">Returns</a></li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div class="animate__animated animate__fadeInUp animate__delay-3s">
          <h4 class="text-lg font-semibold mb-4">Contact Info</h4>
          <div class="space-y-2 text-gray-400">
            <p><i class="pi pi-envelope mr-2"></i> info@eshop.com</p>
            <p><i class="pi pi-phone mr-2"></i> +1 (555) 123-4567</p>
            <p><i class="pi pi-map-marker mr-2"></i> 123 Commerce St, City, State 12345</p>
          </div>
        </div>
      </div>

      <Divider class="my-8" />

      <div class="text-center text-gray-400">
        <p>&copy; 2024 E-Shop. All rights reserved. Built with Vue.js & Django.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-link {
  @apply text-gray-400 hover:text-white transition-colors duration-200;
}
</style>
