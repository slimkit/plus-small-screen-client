<template id="alert-template">
    <div :class="alertClasses" v-show="show">
        <slot>
            <strong>Default!</strong> Hello World~
        </slot>
        <span class="Alert__close" @click="show = false">x</span>
    </div>
</template>
<script>
export default {
  name: "message",
  props: ["type"],
  computed: {
    alertClasses() {
      return {
        "Alert--Success": this.type === "success",
        "Alert--Warning": this.type === "warning",
        "Alert--Error": this.type === "error"
      };
    }
  },
  data() {
    return {
      show: true
    };
  }
};
</script>
<style>
.Alert__close {
  font-weight: bold;
  cursor: pointer;
}

.Alert--Success {
  color: green;
}

.Alert--Warning {
  color: #aa0;
}

.Alert--Error {
  color: red;
}
</style>
