<script setup lang="ts">
import { ref } from 'vue';
import {
  QrCode,
  Loader2,
  X
} from 'lucide-vue-next';
import type { AuthStatus, AccountInfo } from './types';

const props = defineProps<{
  isExpired?: boolean;
}>();

const emit = defineEmits<{
  (e: 'auth-success', info: AccountInfo): void;
  (e: 'close'): void;
}>();

const authStatus = ref<AuthStatus>('idle');

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
        <h2>boss招聘助手授权</h2>
        <p v-if="isExpired" class="expired-hint">会话已过期，请重新授权</p>
        <p v-else class="auth-overlay-hint">请授权您的招聘账号以使用boss招聘助手工作台</p>
      </div>

      <!-- Not authenticated -->
      <div v-if="authStatus === 'idle'" class="auth-area">
        <div class="qrcode-login">
          <div class="qr-card">
            <span class="qr-badge">扫码授权</span>
            <div class="qr-placeholder">
              <QrCode :size="108" />
            </div>
          </div>
          <div class="auth-content">
            <div class="auth-text">
              <p class="auth-main">使用 Boss 直聘 App 扫码授权</p>
              <p class="auth-hint">扫码成功后，招聘账号将绑定到当前演示环境，并用于后续插件联动演示。</p>
            </div>
            <div class="auth-note-list">
              <span>仅用于前端 Demo 演示</span>
              <span>不会接入真实账号数据</span>
            </div>
            <button class="auth-btn" @click="startAuth">
              我已扫码，完成授权
            </button>
          </div>
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
  border-radius: 20px;
  padding: 40px 36px 36px;
  width: 560px;
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

.qrcode-login {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 24px;
  align-items: center;
  text-align: left;
  padding: 18px 20px;
  border-radius: 18px;
  background: linear-gradient(135deg, #f8fbff 0%, #f8fafc 100%);
  border: 1px solid #eef2ff;
}

.qr-card {
  position: relative;
}

.qr-badge {
  position: absolute;
  top: -10px;
  left: 12px;
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  background: #2563eb;
  color: white;
  font-size: 12px;
  font-weight: 600;
}

.qr-placeholder {
  width: 172px;
  height: 172px;
  border-radius: 20px;
  background: white;
  border: 1px solid #dbeafe;
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.08), inset 0 0 0 12px #fff;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
}

.auth-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.expired-hint {
  font-size: 14px;
  color: #dc2626;
  margin: 0;
  font-weight: 500;
}

.auth-main {
  margin: 0;
  font-size: 24px;
  line-height: 1.35;
  color: #0f172a;
  font-weight: 600;
}

.auth-hint {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: #64748b;
}

.auth-note-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.auth-note-list span {
  display: inline-flex;
  align-items: center;
  padding: 6px 10px;
  border-radius: 999px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 12px;
  font-weight: 500;
}

.auth-btn {
  min-width: 180px;
  padding: 12px 20px;
  border-radius: 12px;
  background: #2563eb;
  color: white;
  border: none;
  font-size: 15px;
  font-weight: 600;
}

.auth-btn:hover {
  background: #1d4ed8;
}

@media (max-width: 720px) {
  .auth-overlay-card {
    width: 92vw;
    padding: 32px 24px 24px;
  }

  .qrcode-login {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
  }

  .auth-content {
    align-items: center;
  }
}
</style>
