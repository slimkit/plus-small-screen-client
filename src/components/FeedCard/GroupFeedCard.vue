<script>
import FeedCard from "./FeedCard.vue";
export default {
  name: "group-feed-card",
  extends: FeedCard,
  computed: {
    liked() {
      return true;
    }
  },
  methods: {}
};
</script>
