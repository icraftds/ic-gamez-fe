<template>
  <tr
    @click="$emit('click', challenge)"
    :class="{ 'is-premium-row': challenge.isPremium && !isPremiumUser }"
  >
    <td>
      {{ challenge.title }}
      <span v-if="challenge.isPremium" class="badge badge-premium">
        <i class="fa-solid fa-lock" v-if="!isPremiumUser"></i> Premium
      </span>
    </td>
    <td>{{ challenge.category }}</td>
    <td>
      <span class="badge badge-diff" :class="challenge.difficulty.toLowerCase()">
        {{ challenge.difficulty }}
      </span>
    </td>
    <td class="status-cell">
      <i v-if="challenge.isCompleted" class="fa-solid fa-circle-check completed"></i>
      <i v-else class="fa-regular fa-circle pending"></i>
    </td>
  </tr>
</template>

<script setup>
defineProps({
  challenge: { type: Object, required: true },
  isPremiumUser: { type: Boolean, required: true },
})
defineEmits(['click'])
</script>

<style scoped src="../../assets/css/components/challenges/ChallengeTableRow.css"></style>
