<script setup lang="ts">
import GroupedMaterialList from './GroupedMaterialList.vue';
import type { Material, ProfileSection } from './types';

defineProps<{
  sections: ProfileSection[];
  activeMaterialId?: string | null;
}>();

const emit = defineEmits<{
  locate: [material: Material];
  updateContent: [payload: { materialId: string; content: string }];
}>();
</script>

<template>
  <div class="profile-sections">
    <section
      v-for="section in sections"
      :key="section.key"
      class="profile-section"
    >
      <GroupedMaterialList
        variant="profile"
        :groups="section.groups"
        :active-material-id="activeMaterialId"
        @locate="emit('locate', $event)"
        @update-content="emit('updateContent', $event)"
      />
    </section>
  </div>
</template>

<style scoped>
.profile-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-section {
  margin: 0;
}
</style>
