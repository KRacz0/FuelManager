<script setup lang="ts"></script>

<template>
  <div
    class="fixed left-20 top-60 p-4 rounded-lg z-40 bg-white w-64 shadow-lg transform transition-all lg:transform-none"
  >
    <ul>
      <li>
        <RouterLink to="/map" href="#" class="block px-6 py-3 text-gray-700 hover:bg-gray-200"
          >Mapa stacji paliw</RouterLink
        >
      </li>
      <li>
        <RouterLink to="/list" href="#" class="block px-6 py-3 text-gray-700 hover:bg-gray-200"
          >Lista stacji paliw</RouterLink
        >
      </li>
    </ul>
  </div>
</template>
