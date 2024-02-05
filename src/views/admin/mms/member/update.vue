<template>
    <menu-detail :is-edit='true'></menu-detail>
  </template>
  <script>
   import MenuDetail from './components/MenuDetail'
  export default {
      name: 'edit',
      components: { MenuDetail }
  }
  </script>
  
  <style scoped>
  
  </style>