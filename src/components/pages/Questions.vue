<template>
  <div class="page-question">
    <!-- App Bar. -->
    <module-question-app-bar />

    <!-- Module content. -->
    <router-view />

    <!-- Nativa Bar. -->
    <foot-guide />
  </div>
</template>

<script>
import { AppBar } from "../modules/question";

/**
 * Question default export.
 */
export default {
  /**
   * Questin page name.
   *
   * @type {string}
   */
  name: "page-questions",

  /**
   * The Page components.
   *
   * @type {Object}
   */
  components: {
    [AppBar.name]: AppBar // module-question-app-bar
  }
};
</script>

<style>
.page-question {
  padding-bottom: 0 !important;
}
</style>
