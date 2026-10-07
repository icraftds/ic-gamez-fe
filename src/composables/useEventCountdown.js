import { ref, computed, onMounted, onUnmounted } from 'vue';

export function useEventCountdown(eventRef) {
  const now = ref(new Date());
  let timerInterval = null;

  const isEventUpcoming = computed(() => {
    if (!eventRef.value || !eventRef.value.start_date) return false;
    return new Date(eventRef.value.start_date) > now.value;
  });

  const countdown = computed(() => {
    if (!eventRef.value || !eventRef.value.start_date) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const diff = new Date(eventRef.value.start_date) - now.value;
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    
    return { days, hours, minutes, seconds };
  });

  onMounted(() => {
    timerInterval = setInterval(() => {
      now.value = new Date();
    }, 1000);
  });

  onUnmounted(() => {
    if (timerInterval) clearInterval(timerInterval);
  });

  return {
    isEventUpcoming,
    countdown
  };
}
