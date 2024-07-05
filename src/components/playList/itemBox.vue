<template>
  <div class="item-box">
    <div class="cover-box lg:w-60 lg:h-60">
      <img src="@/assets/test.png" alt="" />
    </div>
    <div class="desc lg:w-48">
      <p class="title">标题</p>
      <p class="auth">作者</p>
      <div class="plays">200</div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.item-box {
  cursor: pointer;

  display: flex;
  position: relative;
  justify-content: space-between;
  &:hover {
    &::after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      animation: op 0.5s;
      background-color: rgba(255, 255, 255, 0.2);
    }
    @keyframes op {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
  }
  .cover-box {
    // width: 150px;
    // height: 150px;
    border-radius: 10px;
    overflow: hidden;
    margin-right: 10px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .desc {
    border: 1px solid #000;
    min-width: 180px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    padding: 20px 0;
  }
}
</style>
