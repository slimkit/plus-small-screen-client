<template>
    <find-content></find-content>
</template>

<script>
import findContent from "./findContent";
export default {
  name: "findRec",
  components: {
    findContent
  },
  mounted() {
    this.$children[0].getUsers();
  }
};
</script>
