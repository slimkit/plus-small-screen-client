<template>
  <div>
    <slot :src="src">{{ null }}</slot>
  </div>
</template>

<script>
export default {
  name: "async-file",
  props: {
    file: { required: true, type: Number },
    w: { type: Number, default: 0 },
    h: { type: Number, default: 0 },
    q: { type: Number, default: 0 }
  },
  data: () => ({
    src: null
  }),
  methods: {
    async fetch() {
      let params = {
        json: true
      };

      if (this.w) {
        params.w = this.w;
      }

      if (this.h) {
        params.h = this.h;
      }

      if (this.q) {
        params.q = this.q;
      }

      const { data: { url } } = await this.$http.get(`/files/${this.file}`, {
        params
      });

      this.src = url;
    }
  },
  created() {
    this.fetch();
  }
};
</script>
