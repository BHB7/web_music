<script setup>
import { useViewMsgStore } from '@/stores'

const viewMsgStore = useViewMsgStore()

viewMsgStore.setCNavTitle('关于')
</script>

<template>
  <div class="about-page">
    <h1>关于本项目</h1>
    <p>
      本项目目前处于开发初期阶段，仅供学习交流使用，请勿用于商业用途。
      后续我们会在有时间的情况下推出安卓端版本。
    </p>
    <p>
      如果您有任何问题或建议，欢迎加入我们的QQ群：
      <a
        href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=JnSyK9mDWR_kjSZuNSIQxsoC5-TFnytA&authKey=afFEqhHuwSRvi4mxyLNSojfqNHS1eOvwGDyVavHu9iaeBIZbAhsyC6xlUfWn7ReV&noverify=0&group_code=794173085"
        target="_blank"
      >
        794173085
      </a>
    </p>
    <p>
      或者，您可以通过以下方式反馈您的意见和建议：
      <a
        href="https://support.qq.com/embed/phone/666627/"
        target="_blank"
      >
        反馈建议
      </a>
    </p>
    <p class="signature">By: 7z</p>
  </div>
</template>

<style scoped>
.about-page {
  padding: 20px;
  font-family: 'Arial', sans-serif;
  color: #333;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #2c3e50;
}

p {
  line-height: 1.6;
  margin-bottom: 10px;
}

a {
  color: #3498db;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.signature {
  margin-top: 30px;
  font-style: italic;
  color: #95a5a6;
}
</style>