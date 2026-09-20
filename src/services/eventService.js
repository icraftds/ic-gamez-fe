import api from './api';

export const EventService = {
  // Ambil daftar event, misal: fetchEvents('daily')
  fetchEvents(type = null) {
    const params = type ? { type } : {};
    return api.get('/events', { params });
  },

  // Ambil detail event
  getEventDetail(id) {
    return api.get(`/events/${id}`);
  },

  // Klasemen Speedrun Harian
  getDailyLeaderboard() {
    return api.get('/events/daily/leaderboard');
  },

  // Submit Tantangan Harian (SPEEDRUN ANTI-CHEAT)
  submitDaily(eventId, isSuccess, durationSec = null, codeContent = null) {
    return api.post(`/events/${eventId}/submit-speedrun`, {
      is_success: isSuccess,
      duration_sec: durationSec,
      code_content: codeContent
    });
  },

  // Submit Partisipasi Tantangan Mingguan
  submitWeekly(eventId) {
    return api.post(`/events/${eventId}/submit-weekly`);
  },

  // Submit Proyek Tahunan (File Upload menggunakan FormData)
  submitAnnual(eventId, payload) {
    const formData = new FormData();
    formData.append('repo_url', payload.repoUrl);
    
    if (payload.liveUrl) formData.append('live_url', payload.liveUrl);
    if (payload.file) formData.append('file', payload.file); // Objek File ZIP

    return api.post(`/events/${eventId}/submit-annual`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};
