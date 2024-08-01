<script setup>
import { useViewMsgStore } from '@/stores'

const viewMsgStore = useViewMsgStore()

viewMsgStore.setCNavTitle('关于')
</script>

<template>
  本项目在开发初期阶段，仅供学习交流使用，请勿用于商业用途。 如有问题，请加QQ群：<a
    href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=JnSyK9mDWR_kjSZuNSIQxsoC5-TFnytA&authKey=afFEqhHuwSRvi4mxyLNSojfqNHS1eOvwGDyVavHu9iaeBIZbAhsyC6xlUfWn7ReV&noverify=0&group_code=794173085"
  >
    794173085
  </a>
  <br />
  By: 7z
</template>
