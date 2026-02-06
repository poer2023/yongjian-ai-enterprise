<script setup lang="ts">
import { ref } from 'vue';
import { X, ImagePlus, Type, Plus } from 'lucide-vue-next';

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  close: [];
  add: [data: { type: 'image' | 'text'; title: string; content: string }];
}>();

const materialType = ref<'image' | 'text'>('text');
const materialTitle = ref('');
const materialContent = ref('');

const handleClose = () => {
  materialType.value = 'text';
  materialTitle.value = '';
  materialContent.value = '';
  emit('close');
};

const handleAdd = () => {
  if (!materialTitle.value.trim()) return;
  emit('add', {
    type: materialType.value,
    title: materialTitle.value.trim(),
    content: materialContent.value.trim()
  });
  handleClose();
};
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click="handleClose">
    <div class="add-material-modal" @click.stop>
      <div class="modal-header">
        <h3>手动添加素材</h3>
        <button class="modal-close-btn" @click="handleClose">
          <X :size="20" />
        </button>
      </div>

      <div class="modal-body">
        <!-- Type selector -->
        <div class="form-group">
          <label class="form-label">素材类型</label>
          <div class="type-selector">
            <button
              class="type-option"
              :class="{ active: materialType === 'image' }"
              @click="materialType = 'image'"
            >
              <ImagePlus :size="20" />
              <span>图片素材</span>
            </button>
            <button
              class="type-option"
              :class="{ active: materialType === 'text' }"
              @click="materialType = 'text'"
            >
              <Type :size="20" />
              <span>文字素材</span>
            </button>
          </div>
        </div>

        <!-- Title input -->
        <div class="form-group">
          <label class="form-label">素材标题 <span class="required">*</span></label>
          <input
            type="text"
            class="form-input"
            v-model="materialTitle"
            placeholder="请输入素材标题，如：营业执照扫描件"
          />
        </div>

        <!-- Content area -->
        <div class="form-group">
          <label class="form-label">{{ materialType === 'image' ? '上传图片' : '素材内容' }}</label>

          <!-- Image upload -->
          <div v-if="materialType === 'image'" class="image-upload-area">
            <div class="upload-placeholder">
              <ImagePlus :size="32" />
              <p>点击或拖拽图片到此处上传</p>
              <span>支持 JPG、PNG、PDF 格式，单个文件不超过 10MB</span>
            </div>
          </div>

          <!-- Text input -->
          <textarea
            v-else
            class="form-textarea"
            v-model="materialContent"
            placeholder="请输入素材内容，如企业简介、资质说明等..."
            rows="6"
          ></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-cancel" @click="handleClose">取消</button>
        <button class="btn-confirm" @click="handleAdd" :disabled="!materialTitle.trim()">
          <Plus :size="16" />
          添加素材
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.add-material-modal {
  width: 100%;
  max-width: 520px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.modal-close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.15s;
}

.modal-close-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-label .required {
  color: #dc2626;
}

.type-selector {
  display: flex;
  gap: 12px;
}

.type-option {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: #f9fafb;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  color: #6b7280;
}

.type-option:hover {
  border-color: #bfdbfe;
  background: #eff6ff;
}

.type-option.active {
  border-color: #3b82f6;
  background: #eff6ff;
  color: #1d4ed8;
}

.type-option span {
  font-size: 14px;
  font-weight: 500;
}

.form-input {
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  outline: none;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  color: #1f2937;
  outline: none;
  resize: vertical;
  min-height: 120px;
  line-height: 1.6;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.form-textarea:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.image-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  padding: 32px;
  text-align: center;
  cursor: pointer;
  transition: all 0.15s;
}

.image-upload-area:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #9ca3af;
}

.upload-placeholder p {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.upload-placeholder span {
  font-size: 12px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.btn-cancel {
  height: 40px;
  padding: 0 20px;
  background: white;
  color: #374151;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-cancel:hover {
  background: #f3f4f6;
}

.btn-confirm {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 20px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-confirm:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
