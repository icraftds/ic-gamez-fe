import { ref, computed } from 'vue'

export function useLearningPaths() {
  const paths = ref([
    {
      id: 'dasar',
      title: 'Dasar Pemrograman',
      description: 'Pelajari konsep dasar pemrograman, variabel, tipe data, dan logika dasar.',
      icon: 'fa-solid fa-code',
      isPremium: false, // Seluruh path bisa diakses secara dasar
      chapters: [
        {
          id: 'c1',
          title: 'Pengenalan Logika',
          completedSubMateri: 2,
          totalSubMateri: 2,
          lessons: [
            {
              id: 'l1',
              title: 'Apa itu Pemrograman?',
              isCompleted: true,
              type: 'text',
              isPremium: false,
              costCredit: 1,
              explanation: `
                <h3>Pemrograman adalah...</h3>
                <p>Proses menulis instruksi yang bisa dipahami oleh komputer untuk melakukan tugas tertentu. Instruksi ini ditulis dalam bahasa pemrograman.</p>
              `,
              quiz: [
                {
                  question: 'Tujuan utama dari pemrograman adalah?',
                  options: ['Menulis cerita', 'Memberikan instruksi ke komputer', 'Membuat desain grafis', 'Menghitung manual'],
                  answerIndex: 1
                }
              ],
              practice: 'Coba tuliskan kode "Hello World" di area teks di bawah ini.'
            },
            {
              id: 'l2',
              title: 'Algoritma Sederhana',
              isCompleted: true,
              type: 'code',
              isPremium: true,
              costCredit: 1,
              explanation: `
                <h3>Algoritma Sederhana</h3>
                <p>Algoritma adalah urutan langkah logis untuk menyelesaikan masalah.</p>
              `,
              quiz: [
                {
                  question: 'Apa itu algoritma?',
                  options: ['Bahasa pemrograman', 'Sistem operasi', 'Urutan langkah logis', 'Perangkat keras'],
                  answerIndex: 2
                }
              ],
              practice: 'Tuliskan langkah-langkah membuat kopi.'
            }
          ]
        }
      ]
    },
    {
      id: 'database',
      title: 'Dunia Database (SQL)',
      description: 'Pelajari cara menyimpan, mengambil, dan mengelola data dalam database relasional.',
      icon: 'fa-solid fa-database',
      isPremium: false,
      chapters: [
        {
          id: 'db1',
          title: 'Query Pertamamu — SELECT',
          completedSubMateri: 1,
          totalSubMateri: 2,
          lessons: [
            {
              id: 'dbl1',
              title: 'Pengenalan SELECT',
              isCompleted: true,
              type: 'text',
              isPremium: false,
              costCredit: 1,
              explanation: '<h3>SELECT</h3><p>Perintah SELECT digunakan untuk mengambil data dari database.</p>',
              quiz: [
                { question: 'Apa fungsi perintah SELECT?', options: ['Menghapus data', 'Mengambil data', 'Menambah data', 'Mengubah struktur'], answerIndex: 1 }
              ],
              practice: 'Tuliskan query SELECT * FROM users;'
            },
            {
              id: 'dbl2',
              title: 'Memilih Kolom Tertentu',
              isCompleted: false,
              type: 'sql',
              isPremium: true,
              costCredit: 1,
              explanation: '<h3>Kolom Tertentu</h3><p>Anda bisa memilih kolom tertentu dengan menyebutkan namanya, contoh: SELECT nama, email FROM users;</p>',
              quiz: [
                { question: 'Bagaimana cara mengambil kolom "nama"?', options: ['SELECT * FROM nama', 'SELECT nama FROM table', 'GET nama', 'PULL nama'], answerIndex: 1 }
              ],
              practice: 'Tuliskan query untuk mengambil kolom "email" dari tabel "customers".'
            }
          ]
        },
        {
          id: 'db2',
          title: 'Memfilter Data — WHERE',
          completedSubMateri: 0,
          totalSubMateri: 1,
          lessons: [
            {
              id: 'dbl3',
              title: 'Pengenalan WHERE',
              isCompleted: false,
              type: 'text',
              isPremium: false,
              costCredit: 1,
              explanation: '<h3>WHERE</h3><p>Digunakan untuk memfilter baris yang memenuhi kondisi tertentu.</p>',
              quiz: [
                { question: 'Klausa apa yang digunakan untuk memfilter data?', options: ['ORDER BY', 'FILTER', 'WHERE', 'LIMIT'], answerIndex: 2 }
              ],
              practice: 'Ambil semua data dari users WHERE id = 1;'
            }
          ]
        }
      ]
    },
    {
      id: 'frontend',
      title: 'Frontend Mastery',
      description: 'Kuasai HTML, CSS, JavaScript dan framework modern seperti Vue/React.',
      icon: 'fa-brands fa-vuejs',
      isPremium: false,
      chapters: [
        {
          id: 'fe1',
          title: 'Dasar HTML',
          completedSubMateri: 0,
          totalSubMateri: 1,
          lessons: [
            {
              id: 'fel1',
              title: 'Struktur HTML5',
              isCompleted: false,
              type: 'code',
              isPremium: false,
              costCredit: 1,
              explanation: '<h3>HTML5</h3><p>HTML5 adalah standar terbaru dari bahasa markah HTML.</p>',
              quiz: [
                { question: 'Tag pembuka utama di HTML5?', options: ['<html>', '<!DOCTYPE html>', '<head>', '<body>'], answerIndex: 1 }
              ],
              practice: 'Buatlah kerangka dasar HTML5.'
            }
          ]
        }
      ]
    }
  ])

  // Extract all challenges for the new Challenges View
  const allChallenges = computed(() => {
    let list = []
    paths.value.forEach(path => {
      path.chapters.forEach(chapter => {
        chapter.lessons.forEach(lesson => {
          list.push({
            id: lesson.id,
            pathId: path.id,
            chapterId: chapter.id,
            title: lesson.title,
            category: path.title,
            difficulty: lesson.isPremium ? 'Sulit' : (lesson.id === 'l1' ? 'Mudah' : 'Sedang'),
            isPremium: lesson.isPremium,
            isCompleted: lesson.isCompleted,
            costCredit: lesson.costCredit,
            tags: [path.id, lesson.type]
          })
        })
      })
    })
    return list
  })

  const getPathById = (id) => {
    return paths.value.find(p => p.id === id)
  }

  const getLessonByIds = (pathId, chapterId, lessonId) => {
    const path = getPathById(pathId)
    if (!path) return null
    const chapter = path.chapters.find(c => c.id === chapterId)
    if (!chapter) return null
    return chapter.lessons.find(l => l.id === lessonId)
  }

  return {
    paths,
    allChallenges,
    getPathById,
    getLessonByIds
  }
}
