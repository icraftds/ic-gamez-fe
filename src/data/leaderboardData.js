const makeUser = (name, xp, level, seed) => ({
  name,
  xp,
  level,
  avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`
})

export const topUsers = [
  makeUser('Anonim', 3875, 39, 'topuser1'),
  makeUser('Muhammad Daffa U.', 3567, 119, 'topuser2'),
  makeUser('Irfan Yasin', 2328, 24, 'topuser3')
]

export const monthlyRanking = [
  makeUser('Anonymous', 3875, 39, 'mu1'),
  makeUser('Muhammad Daffa U.', 3567, 119, 'mu2'),
  makeUser('Irfan Yasin', 2328, 24, 'mu3'),
  makeUser('Raasyid Abdul Ra\'uf', 2085, 28, 'mu4'),
  makeUser('Riki Winardi Gama', 2009, 23, 'mu5'),
  makeUser('Arlinda Swandaru', 1865, 19, 'mu6'),
  makeUser('Ilham', 1855, 55, 'mu7'),
  makeUser('Athaya Rayassa Insyi...', 1855, 19, 'mu8'),
]

export const allTimeRanking = [
  makeUser('Anonymous', 12523, 124, 'au1'),
  makeUser('Alfa', 12182, 122, 'au2'),
  makeUser('Muhammad Daffa U.', 11884, 119, 'au3'),
  makeUser('Dara Mahardika', 11601, 118, 'au4'),
  makeUser('Ahmad Paqih', 11601, 107, 'au5'),
  makeUser('Erza', 11438, 115, 'au6'),
  makeUser('Fuad Hidayat Ardian...', 11224, 113, 'au7'),
  makeUser('Khairul Rohman', 11000, 111, 'au8'),
]
