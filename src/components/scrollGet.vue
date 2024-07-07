<script setup>
const props = defineProps({
  listEnd: {
    type: Boolean,
    default: false
  }
})
</script>
<template>
  <div class="w-full lg:hidden block">
    <footer class="footerc lg:hidden block" ref="footerRef1" v-if="!listEnd">
      <loader></loader>
      <span>加载更多...</span>
    </footer>
    <div class="footerc" v-else>
      <span>没有更多啦~</span>
    </div>
  </div>
  <div class="w-full hidden lg:block">
    <footer class="footerb" ref="footerRef2" v-if="!listEnd">
      <loader></loader>
      <span>加载更多...</span>
    </footer>
    <div class="footerb" v-else>
      <span>没有更多啦~</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.footerc {
  align-items: center;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  width: 100%;
}
.footerb {
  align-items: center;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  width: calc(100% - 200px);
}
</style>
