<script setup>
import { ref, watch } from 'vue'
import { RightOutlined } from '@ant-design/icons-vue'
import { reactive } from 'vue'

// wyy
import {
  getQrCodeService as getWyyQrCodeService,
  getQrCheckService as getWyyQrCheckService,
  getUserAccountService as getWyyUserAccountService,
  logoutService as wyyLogoutService
} from '@/api/wyy/user'

// kg
import {
  getQrCodeService as getKgQrCodeService,
  getQrCheckService as getKgQrCheckService,
  getLoginStatusService as getKgLoginStatusService
} from '@/api/kg/user'
import { useWyUserStore, useSettingsStore, useKgUserStore } from '@/stores'

const settingsStore = useSettingsStore() // 设置
const wyUserStore = useWyUserStore() // 网易y
const kgUserStore = useKgUserStore() // 酷g
const props = defineProps({
  open: {
    type: Boolean,
    default: false
  }
})
watch(
  () => props.open,
  (n) => {
    login()
  }
)
// 登录
// 二维码
const qrCodeImg = ref('')
// 二维码状态
const isExpire = ref(false)
// 等待扫码
const loginQrMsg = ref('')
const tipMsg = ref('')
// 登录的弹框
const timer = ref(null)
const showLogin = ref(false)
const login = async () => {
  showLogin.value = true
  await init()
}
// 二维码检测扫码状态
// 轮询此接口可获取二维码扫码状态,800 为二维码过期,801 为等待扫码,802 为待确认,803 为授权登录成功(803 状态码下会返回 cookies),如扫码后返回502,则需加上noCookie参数,如&noCookie=true
const init = async () => {
  switch (settingsStore.settings.apiSelect) {
    // 网易y
    case 'wyy':
      tipMsg.value = '打开网易云音乐APP扫码登录'
      // 获取二维码
      await wyyCreateQr()
      // 轮询检测扫码状态
      timer.value = setInterval(wyyCheckQrApi, 3000)
      break
    // 酷g
    case 'kg':
      tipMsg.value = '打开酷狗音乐APP扫码登录'
      // 获取二维码
      await kgCreateQr()
      // 轮询检测扫码状态
      timer.value = setInterval(kgCheckQrApi, 3000)
      break
    default:
      break
  }
}

// 网易y 创建二维码
const wyyCreateQr = async () => {
  // 获取二维码
  const res = await getWyyQrCodeService()
  qrCodeImg.value = res.data.qrimg
}
// 网易y qr轮询检测
const wyyCheckQrApi = async () => {
  const res = await getWyyQrCheckService()
  console.log(res)
  switch (+res.code) {
    // 为二维码过期
    case 800:
      // 重新获取二维码
      isExpire.value = true
      clearInterval(timer.value)
      break
    // 等待扫码
    case 801:
      loginQrMsg.value = '等待扫码'
      break
    // 待确认
    case 802:
      loginQrMsg.value = '扫码成功'
      break
    // 授权登录成功
    case 803:
      await wyyloginSuccess(res.cookie)
      clearInterval(timer.value)
      isExpire.value = false
      break
    default:
      break
  }
}

// 酷g 创建二维码
const kgCreateQr = async () => {
  // 获取二维码
  const res = await getKgQrCodeService()
  qrCodeImg.value = res.data.base64
}

// 酷g qr轮询检测
const kgCheckQrApi = async () => {
  const res = await getKgQrCheckService()
  console.log(res)
  switch (+res.data.status) {
    // 0为二维码过期
    case 0:
      // 重新获取二维码
      isExpire.value = true
      clearInterval(timer.value)
      break
    // 等待扫码
    case 1:
      loginQrMsg.value = '等待扫码'
      break
    // 待确认
    case 2:
      loginQrMsg.value = '扫码成功'
      break
    // 授权登录成功
    case 4:
      await kgloginSuccess(res)
      clearInterval(timer.value)
      isExpire.value = false
      break
    default:
      break
  }
}

// 重新获取二维码
const getQrCodeAgain = async () => {
  console.log('重新获取二维码')
  isExpire.value = false
  switch (settingsStore.settings.apiSelect) {
    // 网易y
    case 'wyy':
      await wyyCreateQr()
      timer.value = setInterval(wyyCheckQrApi, 3000)
      break
    // 酷g
    case 'kg':
      await kgCreateQr()
      timer.value = setInterval(kgCheckQrApi, 3000)
      break
    default:
      break
  }
}

// 网易y 登录成功
const wyyloginSuccess = async (cookie) => {
  console.log('登录成功')
  wyUserStore.setCookie(cookie)
  // 关闭窗口
  showLogin.value = false
}

// 酷g 登录成功
const kgloginSuccess = async (res) => {
  console.log(res)
  console.log('登录成功')
  await getKgLoginStatusService(res.data.token, res.data.userid)
  kgUserStore.setCookie(res.data.token)
  kgUserStore.setUserInfo(res.data)
  // 关闭窗口
  showLogin.value = false
}

// 关闭登录弹窗时
const closeLogin = () => {
  clearInterval(timer.value)
}

// 其他登录/验证码登录
const otherPhoneCode = ref(false)
// 显示其他登录
const showOtherLogin = ref(false)
// 其他登录表单
const formRef = ref(null)
const formState = reactive({
  username: '',
  password: '',
  phone: '',
  code: '',
  remember: true
})

// 切换其他登录
const loginOther = async () => {
  // 关闭轮询计时
  clearInterval(timer.value)
  showOtherLogin.value = true
}

// 切换扫码登录
const otherCode = () => {
  // 开启轮询
  timer.value = setInterval(checkQrCode, 3000)
  showOtherLogin.value = false
}
const rules = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
    // 自定义校验 当otherPhoneCode为false时，才校验
    (variable) => {
      if (!otherPhoneCode.value) {
        return true
      } else {
        return variable
      }
    }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { min: 11, max: 11, message: '长度为 11 个字符', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }
    }
  ],
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
}
const onFinish = (values) => {
  console.log('Success:', values)
}
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo)
}
</script>
<template>
  <!-- 登录弹窗 -->
  <a-modal :width="400" v-model:open="showLogin" centered footer @cancel="closeLogin">
    <div class="login-modal" v-if="!showOtherLogin">
      <div class="title">扫码登录</div>
      <!-- 二维码 -->
      <div class="code">
        <img :src="qrCodeImg" alt="" />
        <!-- 失效 -->
        <div class="expire" v-if="isExpire">
          <div class="cont">
            <p class="msg">二维码已失效</p>
            <button class="btn" @click="getQrCodeAgain">重新获取</button>
          </div>
        </div>
      </div>
      <p>{{ loginQrMsg }}</p>
      <div class="tip">{{ tipMsg }}</div>
      <!-- 选择其他登录 -->
      <div class="other">
        <a type="link" @click="loginOther" style="color: #999">其他登录方式</a>
        <RightOutlined />
      </div>
    </div>

    <!-- 其他登录窗口 -->
    <div class="other-login" v-if="showOtherLogin">
      <!-- 二维码 -->
      <div class="code" @click="otherCode"></div>
      <div class="cont">
        <div class="title">手机号登录</div>
        <!-- 表单 -->
        <a-form
          ref="formRef"
          :model="formState"
          name="basic"
          autocomplete="off"
          @finish="onFinish"
          @finishFailed="onFinishFailed"
        >
          <!-- 用户名 -->
          <a-form-item name="username" :rules="rules.username">
            <a-input
              v-model:value="formState.username"
              placeholder="用户名"
              v-if="!otherPhoneCode"
            />
          </a-form-item>
          <!-- 密码 -->
          <a-form-item name="password" :rules="rules.password" v-if="!otherPhoneCode">
            <a-input-password v-model:value="formState.password" placeholder="密码" />
          </a-form-item>
          <!-- 手机号 -->
          <a-form-item name="phone" :rules="rules.phone" v-if="otherPhoneCode">
            <div class="phone">
              <a-input v-model:value="formState.phone" placeholder="手机号" />
              <a-button type="link" style="float: right">获取验证码</a-button>
            </div>
          </a-form-item>
          <!-- 验证码 -->
          <a-form-item name="code" :rules="rules.code" v-if="otherPhoneCode">
            <div class="codeN">
              <a-input v-model:value="formState.code" placeholder="验证码" />
            </div>
          </a-form-item>
          <a-form-item name="remember">
            <div class="checkbox">
              <div class="l">
                <a-checkbox name="type" v-model:value="formState.remember">记住密码</a-checkbox>
              </div>
              <div class="r">
                <a-button type="link" style="float: right">忘记密码</a-button>
                <a-button
                  type="link"
                  style="float: right"
                  @click="otherPhoneCode = true"
                  v-if="!otherPhoneCode"
                  >验证码登录</a-button
                >
                <a-button
                  type="link"
                  style="float: right"
                  @click="otherPhoneCode = false"
                  v-if="otherPhoneCode"
                  >密码登录</a-button
                >
              </div>
            </div>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" style="width: 100%">登录</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </a-modal>
</template>

<style lang="scss" scoped>
.login-modal {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #ffffff;
  .title {
    font-size: 20px;
    margin-bottom: 20px;
    color: #000;
    text-align: center;
    font-weight: 600;
  }
  .code {
    width: 200px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    border: 1px solid #ccc;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background-color: #ccc;
    }
    // 失效
    .expire {
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 0;
      left: 0;
      .cont {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .msg {
          color: #fff;
        }
        .btn {
          margin: 10px 0;
          color: #fff;
          background-color: dodgerblue;
          border: none;
          padding: 8px 30px;
          border-radius: 15px;
          cursor: pointer;
        }
      }
    }
  }
  .tip {
    color: #999;
    margin: 20px 0;
  }
  .other {
    cursor: pointer;
    display: flex;
    align-items: center;
    color: #999;
    font-size: 15px;
    a {
      margin: 0 5px;
      padding: 0;
    }
  }
}
.other-login {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  .code {
    cursor: pointer;
    width: 50px;
    height: 50px;
    top: -18px;
    left: -18px;
    position: absolute;
    background-image: url('@/assets/QRCode.png');
    background-position: center;
    background-size: cover;

    &:before {
      // 三角形
      content: '';
      position: absolute;
      width: 0;
      height: 0;
      border-style: solid;
      border-width: 45px 0 45px 45px;
      transform: rotate(45deg);
      border-color: transparent transparent transparent #fff;
      bottom: -39px;
      right: -13px;
      z-index: 1;
    }
    // 遮罩
    &:after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.3);
      top: 0px;
      left: -2.8px;
      border-radius: 5px;
      transform: scale(1.1);
    }
  }
  .cont {
    .title {
      font-size: 20px;
      margin-bottom: 20px;
      color: #000;
      text-align: center;
      font-weight: 600;
    }
    .checkbox {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .phone {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
</style>
