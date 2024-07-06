<template>
  <div class="container">
    <img class="bg" src="./404.png" />
    <div class="btn flex flex-col lg:flex-row justify-between items-center">
      <a @click="$router.push('/')" class="">返回首页</a>
      <a
        href="tencent://AddContact/?fromId=50&fromSubId=1&subcmd=all&uin=1812287263"
        target="_blank"
        class="lx lg:mt-0 mt-2"
        >咨询站长</a
      >
      <div style="clear: both"></div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 90%;
  margin: 0 auto;
  padding: 80px 0px;
}
img {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.bg {
  display: block;
  max-width: 100%;
  margin: 0px auto;
  margin: 40px auto;
}
.btn {
  /* display: flex; */
  width: 400px;
  margin: 0 auto;
  max-width: 100%;
  margin-top: 40px;
}
.btn a {
  text-decoration: none;
  width: 46.5%;
  border: 1px solid #5298ff;
  background: #5298ff;
  color: #fff;
  display: block;
  height: 46px;
  line-height: 44px;
  text-align: center;
  font-size: 16px;
  border-radius: 3px;
  overflow: hidden;
}
.btn .lx {
  border: 1px solid #d8d8d8;
  background: #ffffff;
  color: #8c8c8c;
}
</style>
