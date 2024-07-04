<template>
  <div class="container">
    <img class="bg" src="./404.png" />
    <div class="btn">
      <a @click="$router.push('/')" class="goindex">返回首页</a>
      <a
        href="http://wpa.qq.com/msgrd?v=3&uin=1812287263&site=qq&menu=yes"
        target="_blank"
        class="lx"
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
  width: 400px;
  margin: 0 auto;
  max-width: 100%;
  margin-top: 40px;
}
.btn a {
  float: left;
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
.btn .goindex {
  margin-right: 7%;
}
.btn .lx {
  border: 1px solid #d8d8d8;
  background: #ffffff;
  color: #8c8c8c;
}
</style>
