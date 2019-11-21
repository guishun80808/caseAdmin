<template>
  <div id="hello">
    <div class="bg-main"></div>
  </div>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  computed: {},
  created() {},
  mounted() {},
  watch: {},
  methods: {},
  components: {}
};
</script>

<style scoped>
#hello {
  height: 820px;
  overflow: hidden;
}
.bg-main {
  width: 100%;
  height: 880px;
  background: url("../assets/wel.jpg");
  background-size: cover;
   background-position: center 0;
}

.text {
  font-size: 20px;
  color: #7fbee9;
}
</style>
