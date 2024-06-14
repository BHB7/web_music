<script setup>
import { reactive } from 'vue'
import { useAudioStore } from '@/stores'
const formState = reactive({
  apiMode: ''
})
const onFinish = (values) => {
  console.log('Success:', values)
}
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo)
}
</script>
<template>
  <div class="sel">
    <ul>
      <li class="active"><a>账号</a></li>
      <li><a>常规</a></li>
      <li><a>播放</a></li>
      <li><a>调试</a></li>
    </ul>
  </div>
  <section class="main">
    <a-form
      :labelAlign="'left'"
      hideRequiredMark
      :model="formState"
      name="basic"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-divider style="border-color: #ccc; width: 100vw" dashed />
      <a-form-item
        label="账号"
        name="username"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input v-model:value="formState.username" />
      </a-form-item>
      <a-divider style="border-color: #ccc; width: 100vw" dashed />
      <a-form-item label="常规">
        <span>api接口</span>
        <a-switch
          v-model:checked="formState.apiMode"
          checked-children="QQ"
          un-checked-children="网易"
        />
      </a-form-item>
      <a-divider style="border-color: #ccc; width: 100vw" dashed />
      <a-form-item
        label="播放"
        name="username"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input v-model:value="formState.username" />
      </a-form-item>
      <a-divider style="border-color: #ccc; width: 100vw" dashed />
      <a-form-item label="调试信息" name="username">
        <a-textarea :value="'asdasd'" />
      </a-form-item>
    </a-form>
  </section>
</template>

<style lang="scss" scoped>
.sel {
  ul {
    display: flex;
    .active {
      a {
        font-weight: 700;
        color: black;
        position: relative;
        &::before {
          bottom: -10px;
          left: 50%;
          position: absolute;
          transform: translateX(-50%);
          width: 25px;
          height: 5px;
          border-radius: 5px;
          background-color: dodgerblue;
          content: '';
        }
      }
    }
    li {
      height: 20px;
      // margin-bottom: 20px;
      line-height: 20px;
      a {
        font-weight: 600;
        font-size: 16px;
        color: #4a4c58;
        padding: 0 16px;
      }
    }
  }
}
.main {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
}
</style>
