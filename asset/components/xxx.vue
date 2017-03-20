<template>
  <div>
    <test1 :test="test" />
    <test2 :onChange="onChange" />
    <svg viewBox="0 0 24 24">
      
    </svg>
  </div>>
</template>

<script>
const TestComponent = {
  data: () => ({
    test: 1
  }),
  methods: {
    onChange () {
      console.log('lsdklfjsl');
      this.test = 2;
    }
  },
  components: {
    'test1': {
      props: [
        'test'
      ],
      template: '<div>{{test}}</div>',
    },
    'test2': {
      props: [
        'onChange'
      ],
      template: '<i-button @click.native="onChange">onChange</i-button>'
    }
  }
};

export default TestComponent;
</script>
