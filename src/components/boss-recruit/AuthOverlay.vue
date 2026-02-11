<script setup lang="ts">
import { ref } from 'vue';
import {
  Smartphone,
  QrCode,
  Loader2,
  X
} from 'lucide-vue-next';
import type { AuthStatus, AuthMethod, AccountInfo } from './types';

const props = defineProps<{
  isExpired?: boolean;
}>();

const emit = defineEmits<{
  (e: 'auth-success', info: AccountInfo): void;
  (e: 'close'): void;
}>();

const authStatus = ref<AuthStatus>('idle');
const authMethod = ref<AuthMethod>('phone');

// Phone auth state
const phoneNumber = ref('');
const verifyCode = ref('');
const codeSent = ref(false);
const countdown = ref(0);
let countdownTimer: ReturnType<typeof setInterval> | null = null;

// Send verification code
const sendCode = () => {
  if (!phoneNumber.value || phoneNumber.value.length !== 11) return;
  codeSent.value = true;
  countdown.value = 60;
  countdownTimer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      if (countdownTimer) clearInterval(countdownTimer);
      codeSent.value = false;
    }
  }, 1000);
};

// Phone login
const phoneLogin = () => {
  if (!phoneNumber.value || !verifyCode.value) return;
  authStatus.value = 'scanning';
  setTimeout(() => {
    authStatus.value = 'success';
    const info: AccountInfo = {
      name: '张招聘',
      company: 'XX科技有限公司',
      avatar: '',
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };
    localStorage.setItem('boss-recruit-auth', JSON.stringify(info));
    emit('auth-success', info);
  }, 1000);
};

// QR code login
const startAuth = () => {
  authStatus.value = 'scanning';
  setTimeout(() => {
    authStatus.value = 'success';
    const info: AccountInfo = {
      name: '张招聘',
      company: 'XX科技有限公司',
      avatar: '',
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    };
    localStorage.setItem('boss-recruit-auth', JSON.stringify(info));
    emit('auth-success', info);
  }, 2000);
};
</script>

<template>
  <div class="auth-overlay">
    <div class="auth-overlay-card">
      <button class="auth-close-btn" @click="emit('close')">
        <X :size="20" />
      </button>
      <div class="auth-overlay-header">
        <h2>Boss直聘账号授权</h2>
        <p v-if="isExpired" class="expired-hint">会话已过期，请重新授权</p>
        <p v-else class="auth-overlay-hint">请授权您的Boss直聘账号以使用招聘工作台</p>
      </div>

      <!-- Not authenticated -->
      <div v-if="authStatus === 'idle'" class="auth-area">
        <!-- Auth method tabs -->
        <div class="auth-method-tabs">
          <button
            class="auth-tab"
            :class="{ active: authMethod === 'phone' }"
            @click="authMethod = 'phone'"
          >
            <Smartphone :size="16" />
            手机验证码登录
          </button>
          <button
            class="auth-tab"
            :class="{ active: authMethod === 'qrcode' }"
            @click="authMethod = 'qrcode'"
          >
            <QrCode :size="16" />
            扫码登录
          </button>
        </div>

        <!-- Phone login form -->
        <div v-if="authMethod === 'phone'" class="phone-login-form">
          <div class="phone-input-group">
            <input
              v-model="phoneNumber"
              type="tel"
              placeholder="请输入手机号"
              maxlength="11"
              class="phone-input"
            />
          </div>
          <div class="code-input-group">
            <input
              v-model="verifyCode"
              type="text"
              placeholder="请输入验证码"
              maxlength="6"
              class="code-input"
            />
            <button
              class="send-code-btn"
              :disabled="!phoneNumber || phoneNumber.length !== 11 || codeSent"
              @click="sendCode"
            >
              {{ codeSent ? `${countdown}s后重发` : '获取验证码' }}
            </button>
          </div>
          <button
            class="phone-login-btn"
            :disabled="!phoneNumber || !verifyCode"
            @click="phoneLogin"
          >
            登录授权
          </button>
        </div>

        <!-- QR code login -->
        <div v-else class="qrcode-login">
          <div class="qr-placeholder">
            <QrCode :size="48" />
          </div>
          <div class="auth-text">
            <p class="auth-main">使用Boss直聘APP扫码授权</p>
            <p class="auth-hint">授权后将自动获取您发布的岗位信息</p>
          </div>
          <button class="auth-btn" @click="startAuth">
            开始授权
          </button>
        </div>
      </div>

      <!-- Scanning / Loading -->
      <div v-else-if="authStatus === 'scanning'" class="auth-area loading">
        <div class="loading-box">
          <Loader2 :size="40" class="spin loading-icon" />
          <p class="loading-text">正在授权中...</p>
          <p class="loading-hint">请稍候，正在获取账号信息</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import './styles.css';

.auth-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  backdrop-filter: blur(4px);
}

.auth-overlay-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  width: 480px;
  max-width: 90vw;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  position: relative;
}

.auth-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 8px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s;
}

.auth-close-btn:hover {
  background: #f1f5f9;
  color: #475569;
}

.auth-overlay-header {
  margin-bottom: 24px;
}

.auth-overlay-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.auth-overlay-hint {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.expired-hint {
  font-size: 14px;
  color: #dc2626;
  margin: 0;
  font-weight: 500;
}
</style>
