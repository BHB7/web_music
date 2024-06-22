<script setup>
import { ref } from 'vue'
import { useSettingsStore, useWyUserStore } from '@/stores'
import { computed } from '@vue/reactivity'
import { message } from 'ant-design-vue'
const settingsStore = useSettingsStore()
const activeKey = ref('1')
const value1 = ref('wyy')

const getApiSelect = computed(() => {
  return settingsStore.settings.apiSelect
})

const focus = () => {
  console.log('focus')
}

const handleChange = (value) => {
  console.log(`selected ${value}`)
  // 修改apiSelect选项
  settingsStore.setApiSelect(value)
  message.success('修改成功, 您将重新登录')
  useWyUserStore().logout()
}
</script>

<template>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="1" tab="api接口">
      <a-select
        ref="select"
        :value="getApiSelect"
        style="width: 120px"
        @focus="focus"
        @change="handleChange"
      >
        <a-select-option value="wyy">网易云</a-select-option>
        <a-select-option value="qq" disabled>QQ音乐</a-select-option>
        <a-select-option value="kg">酷狗音乐</a-select-option>
      </a-select>
    </a-tab-pane>
    <a-tab-pane key="2" tab="Tab 2" force-render> Content of Tab Pane 2 </a-tab-pane>
    <a-tab-pane key="3" tab="Tab 3"> Content of Tab Pane 3 </a-tab-pane>
  </a-tabs>
</template>
