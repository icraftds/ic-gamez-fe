import { ref, computed } from 'vue'
import { dasarPemrogramanChapters } from '../data/pathDasarPemrograman'

export function useLearningPaths() {
  const paths = ref([
    {
      id: 'dasar',
      title: 'Dasar Pemrograman',
      description: 'Pelajari konsep dasar pemrograman, variabel, tipe data, logika dasar, dan struktur data menggunakan syntax universal.',
      icon: 'fa-solid fa-code',
      isPremium: false,
      isLocked: false,
      chapters: dasarPemrogramanChapters
    },
    {
      id: 'database',
      title: 'Dunia Database (SQL)',
      description: 'Pelajari cara menyimpan, mengambil, dan mengelola data dalam database relasional menggunakan bahasa SQL.',
      icon: 'fa-solid fa-database',
      isPremium: false,
      isLocked: false,
      chapters: [
        {
          id: 'db1',
          title: 'Pengenalan Database',
          completedSubMateri: 0,
          totalSubMateri: 2,
          lessons: [
            { id: 'dbl1', title: 'Konsep RDBMS & Tabel', isCompleted: false, type: 'text', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'dbl2', title: 'Tipe Data SQL (INT, VARCHAR, DATE)', isCompleted: false, type: 'text', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' }
          ]
        },
        {
          id: 'db2',
          title: 'DDL (Data Definition Language)',
          completedSubMateri: 0,
          totalSubMateri: 2,
          lessons: [
            { id: 'dbl3', title: 'Membuat dan Menghapus Tabel (CREATE, DROP)', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'dbl4', title: 'Modifikasi Struktur Tabel (ALTER)', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' }
          ]
        },
        {
          id: 'db3',
          title: 'DML (Data Manipulation Language)',
          completedSubMateri: 0,
          totalSubMateri: 3,
          lessons: [
            { id: 'dbl5', title: 'Menambahkan Data (INSERT)', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'dbl6', title: 'Membaca Data Dasar (SELECT)', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'dbl7', title: 'Memperbarui dan Menghapus Data (UPDATE, DELETE)', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' }
          ]
        },
        {
          id: 'db4',
          title: 'Query Lanjutan & Filtering',
          completedSubMateri: 0,
          totalSubMateri: 3,
          lessons: [
            { id: 'dbl8', title: 'Kondisi Spesifik (WHERE, AND, OR)', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'dbl9', title: 'Pencarian Pola (LIKE, IN)', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'dbl10', title: 'Pengurutan & Pembatasan (ORDER BY, LIMIT)', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' }
          ]
        },
        {
          id: 'db5',
          title: 'Agregasi & Relasi',
          completedSubMateri: 0,
          totalSubMateri: 5,
          lessons: [
            { id: 'dbl11', title: 'Fungsi Agregasi (COUNT, SUM, AVG)', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'dbl12', title: 'Pengelompokan Data (GROUP BY, HAVING)', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'dbl13', title: 'Pengenalan Primary Key & Foreign Key', isCompleted: false, type: 'text', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'dbl14', title: 'Menggabungkan Tabel (INNER JOIN)', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'dbl15', title: 'Menggabungkan Tabel Lanjutan (LEFT JOIN)', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' }
          ]
        }
      ]
    },
    {
      id: 'frontend',
      title: 'Frontend Mastery',
      description: 'Kuasai keterampilan merancang antarmuka web dengan HTML, CSS, JavaScript dan arsitektur modern yang responsif.',
      icon: 'fa-brands fa-vuejs',
      isPremium: false,
      isLocked: false,
      chapters: [
        {
          id: 'fe1',
          title: 'Struktur Web Fundamental',
          completedSubMateri: 0,
          totalSubMateri: 3,
          lessons: [
            { id: 'fel1', title: 'Anatomi HTML Semantik', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'fel2', title: 'Hyperlink dan Media', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'fel3', title: 'Form, Input, dan Validasi HTML', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' }
          ]
        },
        {
          id: 'fe2',
          title: 'Styling Modern (CSS)',
          completedSubMateri: 0,
          totalSubMateri: 4,
          lessons: [
            { id: 'fel4', title: 'Box Model & CSS Selectors', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'fel5', title: 'Tipografi & Warna', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'fel6', title: 'Sistem Layout Modern: Flexbox', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'fel7', title: 'Sistem Layout Modern: CSS Grid', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' }
          ]
        },
        {
          id: 'fe3',
          title: 'Responsivitas Web',
          completedSubMateri: 0,
          totalSubMateri: 2,
          lessons: [
            { id: 'fel8', title: 'Konsep Mobile-First & Media Queries', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'fel9', title: 'Relative Units (REM, EM, VH, VW)', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' }
          ]
        },
        {
          id: 'fe4',
          title: 'DOM Manipulation (JavaScript)',
          completedSubMateri: 0,
          totalSubMateri: 3,
          lessons: [
            { id: 'fel10', title: 'Memilih Elemen (DOM Selection)', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'fel11', title: 'Event Listeners (Click, Input, Submit)', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'fel12', title: 'Memanipulasi Class & Styling secara Dinamis', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' }
          ]
        },
        {
          id: 'fe5',
          title: 'Asynchronous Frontend',
          completedSubMateri: 0,
          totalSubMateri: 3,
          lessons: [
            { id: 'fel13', title: 'Pengenalan JSON & Konsep API', isCompleted: false, type: 'text', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'fel14', title: 'Melakukan HTTP Request dengan Fetch API', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'fel15', title: 'Menampilkan Data API ke Antarmuka Web', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' }
          ]
        }
      ]
    },
    {
      id: 'backend',
      title: 'Backend Development',
      description: 'Bangun server yang kuat, buat REST API, dan integrasi dengan database relasional menggunakan ekosistem Node.js.',
      icon: 'fa-brands fa-node-js',
      isPremium: false,
      isLocked: false,
      chapters: [
        {
          id: 'be1',
          title: 'Fundamental Server & Node.js',
          completedSubMateri: 0,
          totalSubMateri: 3,
          lessons: [
            { id: 'bel1', title: 'Arsitektur Client-Server & HTTP Protocol', isCompleted: false, type: 'text', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'bel2', title: 'Menjalankan Script via Node.js', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'bel3', title: 'Membuat HTTP Server Dasar', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' }
          ]
        },
        {
          id: 'be2',
          title: 'Membangun Aplikasi dengan Express.js',
          completedSubMateri: 0,
          totalSubMateri: 2,
          lessons: [
            { id: 'bel4', title: 'Setup Express & Routing Dasar', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'bel5', title: 'Menangkap Data dari Client (Params, Query, Body)', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' }
          ]
        },
        {
          id: 'be3',
          title: 'Arsitektur REST API',
          completedSubMateri: 0,
          totalSubMateri: 3,
          lessons: [
            { id: 'bel6', title: 'Standarisasi RESTful API & Status Codes', isCompleted: false, type: 'text', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'bel7', title: 'Membangun Endpoint CRUD (GET, POST, PUT, DELETE)', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'bel8', title: 'Implementasi Middleware Dasar', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' }
          ]
        },
        {
          id: 'be4',
          title: 'Integrasi Database Relasional',
          completedSubMateri: 0,
          totalSubMateri: 3,
          lessons: [
            { id: 'bel9', title: 'Menghubungkan Node.js ke SQL Database', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'bel10', title: 'Menulis Raw Query via Backend', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'bel11', title: 'Pengenalan ORM Dasar', isCompleted: false, type: 'text', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' }
          ]
        },
        {
          id: 'be5',
          title: 'Keamanan & Autentikasi',
          completedSubMateri: 0,
          totalSubMateri: 2,
          lessons: [
            { id: 'bel12', title: 'Hashing Password dengan Bcrypt', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' },
            { id: 'bel13', title: 'Membuat dan Memvalidasi JSON Web Token (JWT)', isCompleted: false, type: 'code', isPremium: false, costCredit: 0, explanation: '<p>Materi sedang disiapkan.</p>', quiz: [], practice: '' }
          ]
        }
      ]
    }
  ])

  const getPathById = (id) => {
    return paths.value.find(p => p.id === id)
  }

  const getChapterById = (pathId, chapterId) => {
    const path = getPathById(pathId)
    if (!path) return null
    return path.chapters.find(c => c.id === chapterId)
  }

  const getLessonById = (pathId, chapterId, lessonId) => {
    const chapter = getChapterById(pathId, chapterId)
    if (!chapter) return null
    return chapter.lessons.find(l => l.id === lessonId)
  }

  const allChallenges = computed(() => {
    const challenges = []
    paths.value.forEach(path => {
      path.chapters.forEach(chapter => {
        chapter.lessons.forEach(lesson => {
          if (lesson.type === 'code') {
            challenges.push({
              ...lesson,
              pathId: path.id,
              chapterId: chapter.id,
              category: path.title,
              difficulty: lesson.isPremium ? 'Hard' : 'Medium' // Mock difficulty
            })
          }
        })
      })
    })
    return challenges
  })

  return {
    paths,
    getPathById,
    getChapterById,
    getLessonById,
    allChallenges
  }
}
