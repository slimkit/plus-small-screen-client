export default (Vue) => {

    var bus = new Vue();

    Object.defineProperties(bus, {
        on: {
            get: function() {
                return this.$on;
            }
        },
        once: {
            get: function() {
                return this.$once;
            }
        },
        off: {
            get: function() {
                return this.$off;
            }
        },
        emit: {
            get: function() {
                return this.$emit;
            }
        }
    });

    Vue.bus = bus;

    Object.defineProperty(Vue.prototype, '$bus', {
        get: function() {
            return bus;
        }
    });
};
