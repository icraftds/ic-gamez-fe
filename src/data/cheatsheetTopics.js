/**
 * Cheatsheet Topics & Formulas Search Index
 * Detailed topics, formulas, syntax, and descriptions for all 24 Game-Z Cheatsheet modules.
 * Powers deep keyword search (e.g. "Count", "Vlookup", "Chmod", "JWT", etc.) with live preview snippets.
 */

export const cheatsheetTopics = {
  // 1. Data & Bisnis
  excel: [
    {
      name: 'COUNT',
      category: 'Basic',
      syntax: '=COUNT(value1, [value2], ...)',
      desc: 'Menghitung jumlah sel dalam rentang yang hanya berisi data angka (numerik).',
      sectionId: 'section-basic',
      keywords: ['count', 'hitung angka', 'jumlah sel', 'numerik']
    },
    {
      name: 'COUNTA',
      category: 'Basic',
      syntax: '=COUNTA(value1, [value2], ...)',
      desc: 'Menghitung jumlah sel yang tidak kosong (berisi teks, angka, simbol, maupun formula).',
      sectionId: 'section-basic',
      keywords: ['counta', 'hitung sel isi', 'non empty', 'tidak kosong']
    },
    {
      name: 'COUNTBLANK',
      category: 'Basic',
      syntax: '=COUNTBLANK(range)',
      desc: 'Menghitung banyaknya sel kosong dalam suatu rentang data tertentu.',
      sectionId: 'section-basic',
      keywords: ['countblank', 'sel kosong', 'empty cells']
    },
    {
      name: 'COUNTIF',
      category: 'Conditional',
      syntax: '=COUNTIF(range, criteria)',
      desc: 'Menghitung banyaknya sel yang memenuhi satu kriteria logika tertentu (misal: "Finance" atau ">500").',
      sectionId: 'section-conditional',
      keywords: ['countif', 'hitung kriteria', 'conditional count', 'filter hitung']
    },
    {
      name: 'COUNTIFS',
      category: 'Conditional',
      syntax: '=COUNTIFS(criteria_range1, criteria1, criteria_range2, criteria2, ...)',
      desc: 'Menghitung jumlah sel yang memenuhi beberapa kriteria sekaligus secara bersamaan (Multi-kriteria).',
      sectionId: 'section-conditional',
      keywords: ['countifs', 'multi kriteria', 'banyak syarat', 'count multiple']
    },
    {
      name: 'SUM',
      category: 'Basic',
      syntax: '=SUM(number1, [number2], ...)',
      desc: 'Menjumlahkan seluruh angka atau nilai pada rentang sel yang dipilih.',
      sectionId: 'section-basic',
      keywords: ['sum', 'total', 'penjumlahan', 'tambah']
    },
    {
      name: 'SUMIF',
      category: 'Conditional',
      syntax: '=SUMIF(range, criteria, [sum_range])',
      desc: 'Menjumlahkan nilai sel yang memenuhi satu kriteria kondisi tertentu.',
      sectionId: 'section-conditional',
      keywords: ['sumif', 'jumlah kriteria', 'total syarat']
    },
    {
      name: 'SUMIFS',
      category: 'Conditional',
      syntax: '=SUMIFS(sum_range, criteria_range1, criteria1, ...)',
      desc: 'Menjumlahkan nilai sel dengan beberapa kondisi kriteria (sum_range ditaruh paling awal!).',
      sectionId: 'section-conditional',
      keywords: ['sumifs', 'multi syarat', 'total banyak kriteria']
    },
    {
      name: 'AVERAGE',
      category: 'Basic',
      syntax: '=AVERAGE(number1, [number2], ...)',
      desc: 'Menghitung nilai rata-rata aritmatika dari sekelompok angka pada rentang sel.',
      sectionId: 'section-basic',
      keywords: ['average', 'rata-rata', 'mean']
    },
    {
      name: 'AVERAGEIF / AVERAGEIFS',
      category: 'Conditional',
      syntax: '=AVERAGEIF(range, criteria, [avg_range])',
      desc: 'Menghitung rata-rata nilai sel yang memenuhi satu atau banyak syarat kriteria.',
      sectionId: 'section-conditional',
      keywords: ['averageif', 'averageifs', 'rata-rata kriteria']
    },
    {
      name: 'VLOOKUP',
      category: 'Lookup',
      syntax: '=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
      desc: 'Mencari nilai di kolom paling kiri tabel dan mengambil data pada kolom ke-n secara vertikal.',
      sectionId: 'section-lookup',
      keywords: ['vlookup', 'pencarian vertikal', 'lookup table', 'cari data']
    },
    {
      name: 'XLOOKUP',
      category: 'Lookup',
      syntax: '=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], ...)',
      desc: 'Fungsi pencarian modern serbaguna pengganti VLOOKUP/HLOOKUP. Mendukung lookup ke arah kiri!',
      sectionId: 'section-lookup',
      keywords: ['xlookup', 'modern lookup', 'cari kiri', 'lookup fleksibel']
    },
    {
      name: 'INDEX + MATCH',
      category: 'Lookup',
      syntax: '=INDEX(return_range, MATCH(lookup_val, lookup_range, 0))',
      desc: 'Kombinasi formula lookup dua arah paling fleksibel, tahan terhadap penambahan atau hapus kolom.',
      sectionId: 'section-lookup',
      keywords: ['index match', 'lookup dinamis', 'dua arah', 'tahan insert']
    },
    {
      name: 'IF',
      category: 'Logical',
      syntax: '=IF(logical_test, value_if_true, [value_if_false])',
      desc: 'Menguji kondisi logika dan mengembalikan nilai tertentu jika kondisi TRUE atau FALSE.',
      sectionId: 'section-logical',
      keywords: ['if', 'logika', 'kondisi', 'percabangan']
    },
    {
      name: 'IFERROR',
      category: 'Logical',
      syntax: '=IFERROR(value, value_if_error)',
      desc: 'Menangkap nilai error (#N/A, #VALUE!, #DIV/0!) dan menggantinya dengan nilai bersih kustom.',
      sectionId: 'section-logical',
      keywords: ['iferror', 'tangani error', 'clean error', 'na']
    },
    {
      name: 'Nested IF',
      category: 'Logical',
      syntax: '=IF(kondisi1, hasil1, IF(kondisi2, hasil2, hasil_lain))',
      desc: 'Penggunaan fungsi IF bersarang bertingkat untuk menguji lebih dari dua tingkatan kriteria evaluasi.',
      sectionId: 'section-logical',
      keywords: ['nested if', 'if bersarang', 'if bertingkat']
    },
    {
      name: 'TEXTJOIN & CONCAT',
      category: 'Text',
      syntax: '=TEXTJOIN(delimiter, ignore_empty, text1, ...)',
      desc: 'Menggabungkan teks dari berbagai sel dengan pemisah khusus serta opsi mengabaikan sel kosong.',
      sectionId: 'section-text',
      keywords: ['textjoin', 'concat', 'concatenate', 'gabung teks', 'string']
    },
    {
      name: 'TRIM & CLEAN',
      category: 'Text',
      syntax: '=TRIM(text)',
      desc: 'Menghapus spasi ganda dan spasi berlebih di awal maupun di akhir string teks.',
      sectionId: 'section-text',
      keywords: ['trim', 'hapus spasi', 'clean text', 'spasi ganda']
    },
    {
      name: 'DATEDIF',
      category: 'Date & Time',
      syntax: '=DATEDIF(start_date, end_date, unit)',
      desc: 'Menghitung selisih antara dua tanggal dalam satuan tahun ("Y"), bulan ("M"), atau hari ("D").',
      sectionId: 'section-datetime',
      keywords: ['datedif', 'selisih tanggal', 'umur', 'durasi hari']
    },
    {
      name: 'Pivot Table',
      category: 'Data Tools',
      syntax: 'Insert > Pivot Table',
      desc: 'Alat visual analisis interaktif untuk meringkas, memfilter, dan mengelompokkan ribuan baris data instan.',
      sectionId: 'section-pivottable',
      keywords: ['pivot table', 'rekap data', 'cross tab', 'agregasi']
    }
  ],

  googlesheets: [
    {
      name: 'QUERY',
      category: 'Query',
      syntax: '=QUERY(data, "query_string", [headers])',
      desc: 'Menjalankan sintaks query mirip SQL lengkap untuk memilih kolom, filter WHERE, GROUP BY, dan agregasi.',
      sectionId: 'section-query',
      keywords: ['query', 'sql sheets', 'select', 'where', 'group by']
    },
    {
      name: 'COUNTUNIQUE',
      category: 'Filter',
      syntax: '=COUNTUNIQUE(range)',
      desc: 'Menghitung banyaknya nilai atau entri unik dalam satu rentang data tanpa menghitung duplikat.',
      sectionId: 'section-filter-unique',
      keywords: ['countunique', 'count unik', 'unique count', 'hitung nilai beda']
    },
    {
      name: 'COUNT & COUNTIF',
      category: 'Basic',
      syntax: '=COUNT(value1, ...) | =COUNTIF(range, criterion)',
      desc: 'Menghitung sel berisi angka atau sel yang memenuhi kriteria tertentu pada spreadsheet cloud.',
      sectionId: 'section-filter-unique',
      keywords: ['count', 'countif', 'countifs', 'hitung kriteria sheets']
    },
    {
      name: 'IMPORTRANGE',
      category: 'Array',
      syntax: '=IMPORTRANGE("spreadsheet_url", "range")',
      desc: 'Menarik rentang data secara real-time dan live dari file Google Sheet eksternal lain di cloud.',
      sectionId: 'section-import',
      keywords: ['importrange', 'tarik sheet lain', 'cross spreadsheet', 'link data']
    },
    {
      name: 'ARRAYFORMULA',
      category: 'Array',
      syntax: '=ARRAYFORMULA(formula)',
      desc: 'Menjalankan kalkulasi formula secara otomatis ke seluruh baris kolom tanpa perlu drag rumus ke bawah.',
      sectionId: 'section-array',
      keywords: ['arrayformula', 'otomatis kolom', 'spill formula', 'tanpa drag']
    },
    {
      name: 'FILTER & UNIQUE',
      category: 'Filter',
      syntax: '=FILTER(range, condition1, ...) | =UNIQUE(range)',
      desc: 'Menumpahkan baris data yang memenuhi syarat tertentu dan mengekstrak daftar data tanpa duplikasi.',
      sectionId: 'section-filter-unique',
      keywords: ['filter', 'unique', 'sort', 'saring data', 'hapus duplikat']
    },
    {
      name: 'SPARKLINE',
      category: 'Visualization',
      syntax: '=SPARKLINE(data, [options])',
      desc: 'Menggambar grafik tren mini (line chart, bar chart, column) langsung di dalam batas satu sel.',
      sectionId: 'section-sparkline',
      keywords: ['sparkline', 'grafik sel', 'mini chart', 'tren']
    },
    {
      name: 'Google Apps Script',
      category: 'Automation',
      syntax: 'SpreadsheetApp.getActiveSpreadsheet().getActiveSheet()',
      desc: 'Fondasi otomasi berbasis JavaScript untuk memanipulasi Google Sheet dan membuat fungsi kustom (UDF).',
      sectionId: 'section-script',
      keywords: ['apps script', 'gas', 'javascript sheets', 'otomasi', 'macro']
    }
  ],

  sql: [
    {
      name: 'COUNT / SUM / AVG',
      category: 'Aggregasi',
      syntax: 'COUNT(*), COUNT(kolom), COUNT(DISTINCT kolom)',
      desc: 'Fungsi agregasi statistik untuk menghitung total baris, jumlah baris non-null, atau jumlah nilai unik.',
      sectionId: 'section-aggregations',
      keywords: ['count', 'count(*)', 'count(distinct)', 'sum', 'avg', 'hitung baris']
    },
    {
      name: 'SELECT & WHERE',
      category: 'Basic',
      syntax: 'SELECT col1, col2 FROM tabel WHERE syarat;',
      desc: 'Mengambil kolom data dari tabel database dan memfilter baris yang memenuhi kondisi spesifik.',
      sectionId: 'section-basic',
      keywords: ['select', 'where', 'ambil data', 'filter baris']
    },
    {
      name: 'GROUP BY & HAVING',
      category: 'Aggregasi',
      syntax: 'SELECT dept, COUNT(*) FROM emp GROUP BY dept HAVING COUNT(*) > 5;',
      desc: 'Mengelompokkan baris berdasarkan nilai kolom dan memfilter hasil agregasi setelah pengelompokan.',
      sectionId: 'section-aggregations',
      keywords: ['group by', 'having', 'kelompokkan', 'filter agregat']
    },
    {
      name: 'INNER JOIN & LEFT JOIN',
      category: 'Joins',
      syntax: 'FROM t1 INNER JOIN t2 ON t1.id = t2.t1_id',
      desc: 'Menggabungkan baris dari dua tabel berbeda berdasarkan relasi kunci asing (foreign key).',
      sectionId: 'section-joins',
      keywords: ['join', 'inner join', 'left join', 'relasi tabel', 'foreign key']
    },
    {
      name: 'CTE (Common Table Expressions)',
      category: 'Subqueries',
      syntax: 'WITH cte AS (SELECT ...) SELECT * FROM cte;',
      desc: 'Mendefinisikan tabel virtual sementara (WITH clause) untuk merapikan subquery yang bersarang.',
      sectionId: 'section-subqueries',
      keywords: ['cte', 'with clause', 'subquery', 'tabel virtual']
    },
    {
      name: 'ROW_NUMBER() & RANK()',
      category: 'Window Functions',
      syntax: 'ROW_NUMBER() OVER (PARTITION BY dept ORDER BY gaji DESC)',
      desc: 'Window function untuk memberi nomor urut baris atau ranking di dalam partisi data tanpa grup fisik.',
      sectionId: 'section-window',
      keywords: ['row_number', 'rank', 'dense_rank', 'over', 'partition by', 'window function']
    },
    {
      name: 'ORDER BY & LIMIT',
      category: 'Basic',
      syntax: 'ORDER BY col ASC|DESC LIMIT 10 OFFSET 20;',
      desc: 'Mengurutkan hasil query dan membatasi jumlah baris output untuk pagination efisien.',
      sectionId: 'section-basic',
      keywords: ['order by', 'limit', 'offset', 'sorting', 'urutan']
    }
  ],

  powerbi: [
    {
      name: 'COUNTROWS & DISTINCTCOUNT',
      category: 'Aggregasi',
      syntax: 'COUNTROWS(Table) | DISTINCTCOUNT(Column)',
      desc: 'Fungsi DAX untuk menghitung jumlah total baris pada tabel context atau total nilai unik dalam kolom.',
      sectionId: 'section-calculate',
      keywords: ['countrows', 'distinctcount', 'count dax', 'hitung baris dax']
    },
    {
      name: 'CALCULATE',
      category: 'Filter Context',
      syntax: 'CALCULATE(Expression, [Filter1], [Filter2], ...)',
      desc: 'Fungsi terpenting di DAX untuk mengevaluasi ekspresi matematika di dalam filter context baru yang dimodifikasi.',
      sectionId: 'section-calculate',
      keywords: ['calculate', 'filter context', 'evaluasi dax', 'modifikasi filter']
    },
    {
      name: 'DIVIDE',
      category: 'Math',
      syntax: 'DIVIDE(Numerator, Denominator, [AlternateResult])',
      desc: 'Pembagian aman yang secara otomatis mencegah error division by zero (#DIV/0!).',
      sectionId: 'section-calculate',
      keywords: ['divide', 'pembagian aman', 'division by zero']
    },
    {
      name: 'ALL & ALLEXCEPT',
      category: 'Filter',
      syntax: 'ALL(Table | Column) | ALLEXCEPT(Table, Column1, ...)',
      desc: 'Menghapus filter aktif untuk menghitung Grand Total atau persentase kontribusi rasio terhadap total.',
      sectionId: 'section-calculate',
      keywords: ['all', 'allexcept', 'grand total', 'hapus filter']
    },
    {
      name: 'RELATED & RELATEDTABLE',
      category: 'Relationship',
      syntax: 'RELATED(ColumnName) | RELATEDTABLE(TableName)',
      desc: 'Menarik nilai kolom dari tabel dimensi lain yang berelasi dalam skema bintang (Star Schema).',
      sectionId: 'section-related',
      keywords: ['related', 'relatedtable', 'relasi tabel', 'star schema']
    },
    {
      name: 'TOTALYTD & SAMEPERIODLASTYEAR',
      category: 'Time Intelligence',
      syntax: 'TOTALYTD(Expression, DateColumn) | SAMEPERIODLASTYEAR(DateColumn)',
      desc: 'Kalkulasi metrik akumulasi Year-to-Date dan perbandingan pertumbuhan YoY dengan tahun sebelumnya.',
      sectionId: 'section-time-intelligence',
      keywords: ['totalytd', 'sameperiodlastyear', 'yoy', 'time intelligence']
    }
  ],

  accounting: [
    {
      name: 'Persamaan Dasar Akuntansi',
      category: 'Fondasi',
      syntax: 'ASET = KEWAJIBAN (LIABILITAS) + EKUITAS (MODAL)',
      desc: 'Prinsip keseimbangan double-entry bookkeeping di mana total debit harus selalu sama dengan kredit.',
      sectionId: 'section-rules',
      keywords: ['persamaan akuntansi', 'aset', 'liabilitas', 'ekuitas', 'modal', 'utang']
    },
    {
      name: 'Aturan Saldo Normal Debit / Kredit',
      category: 'Prinsip',
      syntax: 'Debit (+): Aset, Beban | Kredit (+): Liabilitas, Ekuitas, Pendapatan',
      desc: 'Aturan penambahan dan pengurangan saldo akun keuangan dalam transaksi jurnal harian.',
      sectionId: 'section-rules',
      keywords: ['debit kredit', 'saldo normal', 'aturan jurnal']
    },
    {
      name: 'Siklus Akuntansi & Jurnal Penyesuaian',
      category: 'Siklus',
      syntax: 'Transaksi -> Jurnal Umum -> Buku Besar -> Neraca Saldo -> Penyesuaian -> Lapkeu',
      desc: '7 tahapan sistematis pencatatan keuangan dan penyesuaian pos akrual/deferral di akhir periode.',
      sectionId: 'section-cycle',
      keywords: ['siklus akuntansi', 'jurnal umum', 'buku besar', 'jurnal penyesuaian']
    },
    {
      name: 'Laba Rugi, Neraca & Arus Kas',
      category: 'Laporan',
      syntax: 'Pendapatan - Beban = Laba Bersih | Aset = Liabilitas + Ekuitas',
      desc: 'Tiga laporan keuangan utama untuk mengukur profitabilitas, solvabilitas, dan likuiditas kas perusahaan.',
      sectionId: 'section-reports',
      keywords: ['laba rugi', 'neraca', 'arus kas', 'cash flow', 'balance sheet']
    },
    {
      name: 'Rasio Likuiditas & Solvabilitas (CR & DER)',
      category: 'Rasio Finansial',
      syntax: 'Current Ratio = Aset Lancar / Utang Lancar | DER = Total Utang / Total Ekuitas',
      desc: 'Formula rasio keuangan wajib tes rekrutmen analis finansial dan akuntan.',
      sectionId: 'section-ratios',
      keywords: ['current ratio', 'quick ratio', 'der', 'rasio keuangan', 'likuiditas']
    }
  ],

  'hr-payroll': [
    {
      name: 'PPh 21 Tarif Efektif Rata-rata (TER)',
      category: 'Pajak',
      syntax: 'PPh 21 Bulanan = Penghasilan Bruto × Tarif TER (%)',
      desc: 'Regulasi pemotongan PPh 21 bulanan (Januari - November) menggunakan tabel Kategori A, B, dan C.',
      sectionId: 'pph21-ter',
      keywords: ['pph 21', 'ter', 'tarif efektif', 'pajak penghasilan', 'ptkp']
    },
    {
      name: 'PPh 21 Masa Pajak Terakhir (Desember)',
      category: 'Pajak',
      syntax: '(Penghasilan Bruto Setahun - Biaya Jabatan - PTKP) × Tarif Ps 17',
      desc: 'Perhitungan SPT tahunan karyawan dengan tarif progresif Pasal 17 UU HPP.',
      sectionId: 'pph21-ter',
      keywords: ['pph 21 desember', 'biaya jabatan', 'tarif progresif', 'spt']
    },
    {
      name: 'Iuran BPJS Ketenagakerjaan & Kesehatan',
      category: 'BPJS',
      syntax: 'JKK (0.24%-1.74%), JKM (0.3%), JHT (5.7%), JP (3%), Kes (5%)',
      desc: 'Pembagian porsi persentase potongan iuran BPJS antara perusahaan pemberi kerja dan karyawan.',
      sectionId: 'bpjs-tk-kes',
      keywords: ['bpjs', 'jht', 'jp', 'jkk', 'jkm', 'bpjs kesehatan']
    },
    {
      name: 'Perhitungan Upah Lembur (Overtime)',
      category: 'Kompensasi',
      syntax: 'Upah Sejam Lembur = (1 / 173) × Upah Sebulan',
      desc: 'Formula resmi PP No. 35 Tahun 2021 untuk menghitung nilai kompensasi lembur hari kerja dan libur.',
      sectionId: 'lembur-pp35',
      keywords: ['lembur', 'upah lembur', '1/173', 'pp 35', 'overtime']
    },
    {
      name: 'Pesangon PHK (UU Cipta Kerja)',
      category: 'Regulasi',
      syntax: 'Uang Pesangon + UPMK (Masa Kerja) + UPH (Penggantian Hak)',
      desc: 'Matriks tabel kompensasi pengakhiran hubungan kerja berdasarkan masa pengabdian kerja.',
      sectionId: 'pesangon-ciptaker',
      keywords: ['pesangon', 'upmk', 'uph', 'phk', 'uu ciptaker']
    }
  ],

  'supply-chain': [
    {
      name: 'Rumus Wilson EOQ',
      category: 'Inventory',
      syntax: 'EOQ = √[(2 × D × S) / H]',
      desc: 'Menghitung ukuran pemesanan paling optimal untuk menyeimbangkan biaya pemesanan dan penyimpanan stok.',
      sectionId: 'eoq-formula',
      keywords: ['eoq', 'economic order quantity', 'rumus wilson', 'pengadaan stok']
    },
    {
      name: 'Reorder Point (ROP) & Safety Stock',
      category: 'Inventory',
      syntax: 'ROP = (Lead Time Demand) + Safety Stock',
      desc: 'Menentukan ambang batas jumlah kuantitas stok kapan barang harus segera dipesan ulang ke supplier.',
      sectionId: 'rop-safetystock',
      keywords: ['rop', 'reorder point', 'safety stock', 'lead time', 'stok pengaman']
    },
    {
      name: 'Inventory Turnover Ratio (ITR) & DSI',
      category: 'Efisiensi',
      syntax: 'ITR = COGS / Rata-rata Persediaan | DSI = (Persediaan / COGS) × 365',
      desc: 'Metrik kecepatan perputaran persediaan barang dan jumlah rata-rata hari stok tersimpan di gudang.',
      sectionId: 'inventory-metrics',
      keywords: ['itr', 'dsi', 'inventory turnover', 'perputaran persediaan']
    },
    {
      name: 'Klasifikasi ABC (Prinsip Pareto)',
      category: 'Gudang',
      syntax: 'Kelas A (80% nilai omzet), Kelas B (15%), Kelas C (5% nilai)',
      desc: 'Pengelompokan barang inventaris berdasarkan tingkat signifikansi nilai moneter dan prioritas pengawasan.',
      sectionId: 'abc-analysis',
      keywords: ['analisis abc', 'pareto', 'klasifikasi stok', 'gudang']
    },
    {
      name: 'Incoterms 2020 (FOB, CIF, EXW, DDP)',
      category: 'Logistik',
      syntax: 'EXW (Pabrik Penjual), FOB (Kapal), CIF (Asuransi + Tambang), DDP (Sampai Tujuan)',
      desc: 'Standardisasi internasional pembagian titik risiko, ongkos angkut, dan asuransi ekspor-impor.',
      sectionId: 'incoterms-2020',
      keywords: ['incoterms', 'fob', 'cif', 'exw', 'ddp', 'logistik pengiriman']
    }
  ],

  regex: [
    {
      name: 'Karakter & Meta Karakter (\\d, \\w, \\s)',
      category: 'Karakter',
      syntax: '\\d (angka 0-9), \\w (huruf/angka/underscore), \\s (spasi), . (karakter apa pun)',
      desc: 'Simbol dasar untuk mencocokkan tipe kelas karakter teks dalam ekspresi regular.',
      sectionId: 'section-meta',
      keywords: ['meta karakter', 'regex d', 'regex w', 'regex s', 'digit', 'word']
    },
    {
      name: 'Quantifiers (*, +, ?, {n,m})',
      category: 'Pengulangan',
      syntax: '* (0 atau lebih), + (1 atau lebih), ? (opsional), {3,5} (antara 3 sampai 5 kali)',
      desc: 'Menentukan berapa kali suatu karakter atau kelompok pola boleh muncul berurutan.',
      sectionId: 'section-quantifiers',
      keywords: ['quantifiers', 'pengulangan regex', 'bintang', 'plus', 'tanda tanya']
    },
    {
      name: 'Anchors & Word Boundaries (^, $, \\b)',
      category: 'Posisi',
      syntax: '^ (awal baris), $ (akhir baris), \\b (batas kata utuh)',
      desc: 'Mengunci posisi pencarian pola regex agar tidak mencocokkan bagian tengah kata.',
      sectionId: 'section-anchors',
      keywords: ['anchors', 'word boundary', 'awal baris', 'akhir baris']
    },
    {
      name: 'Lookahead & Lookbehind Assertions',
      category: 'Lookaround',
      syntax: '(?=...) positif lookahead | (?!...) negatif lookahead | (?<=...) lookbehind',
      desc: 'Mencocokkan string teks hanya jika diikuti atau didahului oleh pola tertentu tanpa ikut mengambil teksnya.',
      sectionId: 'section-lookaround',
      keywords: ['lookahead', 'lookbehind', 'assertions', 'zero-width']
    },
    {
      name: 'Resep Regex: Email & Nomor HP Indonesia',
      category: 'Resep Pola',
      syntax: 'Email: ^[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}$ | HP: ^(\\+62|62|0)8[1-9][0-9]{7,10}$',
      desc: 'Kumpulan pola regex siap pakai yang paling sering digunakan dalam validasi form input web.',
      sectionId: 'section-recipes',
      keywords: ['resep regex', 'validasi email', 'validasi no hp', 'pola regex']
    }
  ],

  // 2. Developer & DevOps
  typescript: [
    {
      name: 'Generics & Type Constraints',
      category: 'Generics',
      syntax: 'function identity<T>(arg: T): T | interface ApiResponse<T> { data: T }',
      desc: 'Membuat fungsi dan interface yang fleksibel dapat menerima berbagai tipe data dengan type safety mutlak.',
      sectionId: 'generics',
      keywords: ['generics', '<t>', 'type constraints', 'generic function']
    },
    {
      name: 'Utility Types (Partial, Pick, Omit, Record)',
      category: 'Utility Types',
      syntax: 'Partial<T>, Required<T>, Pick<T, K>, Omit<T, K>, Record<K, T>',
      desc: 'Tipe bawaan TypeScript untuk mentransformasikan atau mengambil sebagian properti interface yang sudah ada.',
      sectionId: 'utility-types',
      keywords: ['utility types', 'partial', 'pick', 'omit', 'record', 'readonly']
    },
    {
      name: 'Interface vs Type Alias',
      category: 'Fondasi',
      syntax: 'interface User { id: number } vs type Status = "active" | "inactive"',
      desc: 'Panduan kapan menggunakan interface (OOP, declaration merging) vs type alias (union, primitives, tuple).',
      sectionId: 'interface-vs-type',
      keywords: ['interface', 'type alias', 'declaration merging', 'union type']
    },
    {
      name: 'Type Narrowing & Custom Type Guards',
      category: 'Safety',
      syntax: 'if (typeof x === "string") | function isUser(obj: any): obj is User',
      desc: 'Mempersempit tipe variabel dari union menjadi tipe yang pasti saat kode berjalan di runtime.',
      sectionId: 'type-narrowing',
      keywords: ['type narrowing', 'type guard', 'obj is', 'discriminated union']
    },
    {
      name: 'keyof, typeof & as const',
      category: 'Operators',
      syntax: 'type Keys = keyof User | type Config = typeof defaultConfig | as const',
      desc: 'Operator sakti untuk mengekstrak kunci objek atau mengunci nilai array/objek menjadi readonly literal types.',
      sectionId: 'advanced-operators',
      keywords: ['keyof', 'typeof', 'as const', 'const assertions']
    },
    {
      name: 'tsconfig.json Best Practices',
      category: 'Compiler',
      syntax: '"strict": true, "noImplicitAny": true, "strictNullChecks": true',
      desc: 'Konfigurasi compiler standar industri untuk mencegah kebocoran runtime error di aplikasi skala besar.',
      sectionId: 'tsconfig',
      keywords: ['tsconfig', 'strict true', 'noimplicitany', 'compiler options']
    }
  ],

  javascript: [
    {
      name: 'Array Methods (map, filter, reduce)',
      category: 'Methods',
      syntax: 'arr.map(fn) | arr.filter(fn) | arr.reduce((acc, cur) => acc + cur, 0)',
      desc: 'Metode manipulasi data array fungsional tanpa memutasi (immutable) sumber data aslinya.',
      sectionId: 'section-methods',
      keywords: ['map', 'filter', 'reduce', 'array methods', 'transformasi array']
    },
    {
      name: 'Array Count & Search',
      category: 'Methods',
      syntax: 'arr.filter(x => x === val).length | arr.includes(val) | arr.find(fn)',
      desc: 'Teknik menghitung (count) kemunculan elemen atau mencari posisi data dalam array JavaScript.',
      sectionId: 'section-methods',
      keywords: ['count javascript', 'hitung array', 'find', 'includes', 'indexof']
    },
    {
      name: 'Destructuring & Spread / Rest (...)',
      category: 'ES6',
      syntax: 'const { name, ...rest } = user; const combined = [...arr1, ...arr2];',
      desc: 'Sintaks ekspresi modern mengekstrak properti objek atau menduplikasi dan menggabungkan array.',
      sectionId: 'section-es6',
      keywords: ['destructuring', 'spread operator', 'rest parameter', 'es6']
    },
    {
      name: 'Promise & Async / Await',
      category: 'Async',
      syntax: 'async function fetchUser() { const res = await fetch(url); return res.json(); }',
      desc: 'Pola asinkron modern untuk menangani request API jaringan dengan penanganan try/catch yang rapi.',
      sectionId: 'section-async',
      keywords: ['promise', 'async await', 'asinkron', 'fetch api', 'try catch']
    },
    {
      name: 'Promise.all vs Promise.allSettled',
      category: 'Async',
      syntax: 'Promise.all([p1, p2]) | Promise.allSettled([p1, p2])',
      desc: 'Menjalankan banyak promise paralel sekaligus dengan opsi fail-fast vs menunggu seluruh status selesai.',
      sectionId: 'section-async',
      keywords: ['promise.all', 'promise.allsettled', 'paralel request']
    },
    {
      name: 'Closures & Scope Chain',
      category: 'Concepts',
      syntax: 'function makeCounter() { let count = 0; return () => ++count; }',
      desc: 'Kemampuan fungsi JavaScript untuk mengingat variabel di lingkungan leksikal tempat fungsi tersebut dibuat.',
      sectionId: 'section-concepts',
      keywords: ['closure', 'lexical scope', 'counter closure', 'private variable']
    },
    {
      name: 'Event Loop & Task Queue',
      category: 'Architecture',
      syntax: 'Call Stack -> Microtasks (Promise) -> Macrotasks (setTimeout / setInterval)',
      desc: 'Arsitektur runtime JavaScript yang mengatur prioritas eksekusi kode sinkron dan asinkron non-blocking.',
      sectionId: 'section-concepts',
      keywords: ['event loop', 'call stack', 'microtask', 'macrotask', 'settimeout']
    }
  ],

  git: [
    {
      name: 'git add & git commit',
      category: 'Workflow',
      syntax: 'git add . | git commit -m "feat: user authentication system"',
      desc: 'Mempersiapkan perubahan berkas di staging area dan merekam snapshot permanen beserta deskripsi pesan.',
      sectionId: 'section-daily',
      keywords: ['git add', 'git commit', 'staging', 'commit message']
    },
    {
      name: 'git status & git log',
      category: 'Workflow',
      syntax: 'git status | git log --oneline --graph --all',
      desc: 'Memeriksa status berkas lokal (untracked, modified) dan melihat riwayat pohon commit repositori.',
      sectionId: 'section-daily',
      keywords: ['git status', 'git log', 'riwayat commit', 'cek branch']
    },
    {
      name: 'git switch & git branch',
      category: 'Branch',
      syntax: 'git switch -c feature/checkout | git branch -d feature/old',
      desc: 'Membuat dan berpindah ke cabang kerja fitur baru tanpa mengganggu kode di cabang utama (main).',
      sectionId: 'section-branch',
      keywords: ['git branch', 'git switch', 'git checkout', 'cabang git']
    },
    {
      name: 'git merge vs git rebase',
      category: 'Branch',
      syntax: 'git merge feature-branch vs git rebase main',
      desc: 'Dua strategi integrasi cabang: mempertahankan riwayat riil vs memindahkan basis commit agar linear rapi.',
      sectionId: 'section-merge-rebase',
      keywords: ['git merge', 'git rebase', 'rebase linear', 'konflik merge']
    },
    {
      name: 'git stash',
      category: 'Stash',
      syntax: 'git stash save "wip feature" | git stash pop | git stash list',
      desc: 'Menyimpan sementara berkas modifikasi yang belum siap di-commit saat harus beralih ke branch lain.',
      sectionId: 'section-stash',
      keywords: ['git stash', 'simpan sementara', 'stash pop']
    },
    {
      name: 'git cherry-pick',
      category: 'Advanced',
      syntax: 'git cherry-pick <commit_hash>',
      desc: 'Mengambil commit spesifik dari branch lain dan menerapkannya ke branch yang sedang aktif saat ini.',
      sectionId: 'section-advanced',
      keywords: ['git cherry-pick', 'petik commit', 'salin commit']
    },
    {
      name: 'git reset vs git revert',
      category: 'Undo',
      syntax: 'git reset --soft HEAD~1 | git revert <commit_hash>',
      desc: 'Membatalkan perubahan lokal tanpa jejak (reset) vs membuat commit kebalikan yang aman untuk repositori tim.',
      sectionId: 'section-advanced',
      keywords: ['git reset', 'git revert', 'undo commit', 'batal perubahan']
    }
  ],

  docker: [
    {
      name: 'docker run',
      category: 'CLI',
      syntax: 'docker run -d -p 8080:80 --name my-web nginx:alpine',
      desc: 'Membuat dan menjalankan container baru dari image di latar belakang (detached) dengan port forwarding.',
      sectionId: 'section-cli',
      keywords: ['docker run', 'jalankan container', 'port forwarding']
    },
    {
      name: 'docker ps',
      category: 'CLI',
      syntax: 'docker ps [-a]',
      desc: 'Menampilkan daftar seluruh container yang sedang aktif berjalan maupun yang telah berhenti.',
      sectionId: 'section-cli',
      keywords: ['docker ps', 'daftar container', 'status container']
    },
    {
      name: 'docker exec',
      category: 'CLI',
      syntax: 'docker exec -it <container_id> /bin/sh',
      desc: 'Membuka sesi terminal shell interaktif di dalam container aktif untuk inspeksi berkas dan debugging.',
      sectionId: 'section-cli',
      keywords: ['docker exec', 'masuk container', 'bash container']
    },
    {
      name: 'docker logs',
      category: 'CLI',
      syntax: 'docker logs -f --tail 100 <container_id>',
      desc: 'Melihat log keluaran standar (stdout dan stderr) dari aplikasi yang sedang berjalan di dalam container.',
      sectionId: 'section-cli',
      keywords: ['docker logs', 'cek log container', 'streaming log']
    },
    {
      name: 'Dockerfile Multi-Stage',
      category: 'Image',
      syntax: 'FROM node:18-alpine AS builder ... FROM nginx:alpine',
      desc: 'Teknik merakit Docker image berukuran super ringkas dan aman dengan memisahkan tahap build dan runtime.',
      sectionId: 'section-dockerfile',
      keywords: ['dockerfile', 'multi stage', 'build image', 'optimasi image']
    },
    {
      name: 'docker compose up',
      category: 'Compose',
      syntax: 'docker compose up -d --build | docker compose down',
      desc: 'Menjalankan seluruh arsitektur multi-container (database, backend, frontend) dari satu berkas YAML.',
      sectionId: 'section-compose',
      keywords: ['docker compose', 'docker-compose.yml', 'multi container']
    },
    {
      name: 'Docker Volumes & Prune',
      category: 'Storage',
      syntax: 'docker volume create data_db | docker system prune -a',
      desc: 'Penyimpanan data persisten yang tahan restart container dan perintah pembersihan harddisk tak terpakai.',
      sectionId: 'section-volumes',
      keywords: ['docker volume', 'persisten data', 'docker prune', 'bersih harddisk']
    }
  ],

  kubernetes: [
    {
      name: 'kubectl get, describe & logs',
      category: 'CLI',
      syntax: 'kubectl get pods,svc,deploy -A | kubectl logs -f <pod> | kubectl describe pod <pod>',
      desc: 'Perintah esensial CLI untuk memantau status, membaca riwayat event kegagalan, dan cek log pod cluster.',
      sectionId: 'kubectl-cli',
      keywords: ['kubectl', 'kubectl get', 'kubectl describe', 'kubectl logs']
    },
    {
      name: 'Pod & Deployment',
      category: 'Workloads',
      syntax: 'kind: Deployment | replicas: 3 | strategy: RollingUpdate',
      desc: 'Objek pengelola replikasi pod otomatis, self-healing saat container crash, dan rolling update zero downtime.',
      sectionId: 'pods-deployments',
      keywords: ['pod', 'deployment', 'replicaset', 'rolling update']
    },
    {
      name: 'Service (ClusterIP, NodePort, LoadBalancer)',
      category: 'Networking',
      syntax: 'kind: Service | type: ClusterIP / NodePort / LoadBalancer',
      desc: 'Menyediakan alamat IP dan DNS internal yang stabil untuk mendistribusikan traffic beban ke kumpulan Pod.',
      sectionId: 'services-networking',
      keywords: ['service k8s', 'clusterip', 'nodeport', 'loadbalancer']
    },
    {
      name: 'Ingress Controller',
      category: 'Networking',
      syntax: 'kind: Ingress | spec: rules: host: api.domain.com',
      desc: 'Reverse proxy HTTP/HTTPS layer 7 yang mengarahkan traffic domain internet publik ke Service yang sesuai.',
      sectionId: 'services-networking',
      keywords: ['ingress', 'routing domain', 'ssl k8s', 'reverse proxy']
    },
    {
      name: 'ConfigMap & Secret',
      category: 'Config',
      syntax: 'kind: ConfigMap | kind: Secret (data base64)',
      desc: 'Pemisahan konfigurasi environment dan informasi kredensial sensitif dari Docker image container.',
      sectionId: 'config-storage',
      keywords: ['configmap', 'secret k8s', 'env kubernetes']
    },
    {
      name: 'Liveness & Readiness Probes',
      category: 'Health',
      syntax: 'livenessProbe: httpGet: /healthz | readinessProbe: httpGet: /ready',
      desc: 'Pemeriksaan kesehatan otomatis: me-restart pod jika hang atau menahan traffic sebelum aplikasi siap.',
      sectionId: 'pods-deployments',
      keywords: ['liveness probe', 'readiness probe', 'healthcheck k8s']
    }
  ],

  'http-api': [
    {
      name: 'Status Code: 200, 201, 204 (Success)',
      category: 'Status Codes',
      syntax: '200 OK | 201 Created | 204 No Content',
      desc: 'Standar kode status keberhasilan: 200 untuk data umum, 201 untuk data baru, 204 untuk aksi tanpa balasan.',
      sectionId: 'status-codes',
      keywords: ['200 ok', '201 created', '204 no content', 'status code 200']
    },
    {
      name: 'Status Code: 400, 401, 403, 404, 429 (Client Error)',
      category: 'Status Codes',
      syntax: '400 Bad Request | 401 Unauthorized | 403 Forbidden | 404 Not Found | 429 Rate Limit',
      desc: 'Perbedaan 401 (belum login/tidak ada token) vs 403 (sudah login tapi tidak punya hak akses) & 429 limit.',
      sectionId: 'status-codes',
      keywords: ['401 unauthorized', '403 forbidden', '404 not found', '429 rate limit', 'client error']
    },
    {
      name: 'Status Code: 500, 502, 503 (Server Error)',
      category: 'Status Codes',
      syntax: '500 Internal Error | 502 Bad Gateway | 503 Service Unavailable',
      desc: 'Kode kegagalan server: 500 crash kode backend, 502 upstream mati, 503 overload/maintenance.',
      sectionId: 'status-codes',
      keywords: ['500 internal server', '502 bad gateway', '503 service unavailable']
    },
    {
      name: 'HTTP Methods: GET, POST, PUT vs PATCH, DELETE',
      category: 'Methods',
      syntax: 'PUT (Mengganti seluruh resource) vs PATCH (Update parsial beberapa kolom)',
      desc: 'Semantik method RESTful API dan aturan sifat idempotensi pada setiap operasi HTTP.',
      sectionId: 'methods-rest',
      keywords: ['put vs patch', 'http methods', 'get post delete', 'idempotent']
    },
    {
      name: 'CORS & Preflight OPTIONS',
      category: 'Security',
      syntax: 'Access-Control-Allow-Origin: * | Access-Control-Allow-Methods: GET, POST, OPTIONS',
      desc: 'Mekanisme keamanan browser membatasi pertukaran resource antar origin domain yang berbeda.',
      sectionId: 'headers-cors',
      keywords: ['cors', 'cross origin', 'preflight', 'options', 'access-control-allow-origin']
    }
  ],

  postman: [
    {
      name: 'pm.test & Status Assertions',
      category: 'Testing',
      syntax: 'pm.test("Status code is 200", () => { pm.response.to.have.status(200); });',
      desc: 'Menulis pengujian otomatis untuk memvalidasi status kode dan durasi respons pada tab Tests Postman.',
      sectionId: 'pm-test-basics',
      keywords: ['pm.test', 'status assertion', 'test script', 'postman test']
    },
    {
      name: 'pm.expect Payload Verification',
      category: 'Testing',
      syntax: 'const json = pm.response.json(); pm.expect(json.data.user.id).to.be.a("number");',
      desc: 'Memvalidasi tipe data field, keberadaan atribut JSON, dan kesesuaian nilai payload respons API.',
      sectionId: 'pm-test-basics',
      keywords: ['pm.expect', 'json schema', 'validasi payload']
    },
    {
      name: 'Token Chaining & Environment Variables',
      category: 'Variables',
      syntax: 'pm.environment.set("token", pm.response.json().token);',
      desc: 'Menyimpan token JWT dari respons login otomatis ke environment variable untuk digunakan di request lain.',
      sectionId: 'variables-chaining',
      keywords: ['token chaining', 'environment variables', 'jwt postman', 'otomatis token']
    },
    {
      name: 'Pre-request Script & Timestamps',
      category: 'Scripts',
      syntax: 'pm.request.headers.add({ key: "X-Request-Time", value: Date.now() });',
      desc: 'Mengeksekusi kode JavaScript sebelum request dikirim untuk generate hash HMAC, timestamp, atau UUID.',
      sectionId: 'prerequest-scripts',
      keywords: ['pre-request script', 'signature hmac', 'timestamp request']
    },
    {
      name: 'Collection Runner & Newman CLI',
      category: 'Runner',
      syntax: 'newman run collection.json -e environment.json',
      desc: 'Menjalankan seluruh rangkaian tes endpoint API secara berurutan dan terintegrasi di pipeline CI/CD.',
      sectionId: 'runner-mock',
      keywords: ['collection runner', 'newman', 'ci/cd postman', 'regression test']
    }
  ],

  'html-css': [
    {
      name: 'Box-Sizing: border-box',
      category: 'Box Model',
      syntax: '*, *::before, *::after { box-sizing: border-box; }',
      desc: 'Reset CSS wajib agar padding dan border tidak menambah ukuran lebar elemen sehingga layout tidak rusak.',
      sectionId: 'section-boxmodel',
      keywords: ['box-sizing', 'border-box', 'box model', 'margin padding']
    },
    {
      name: 'Flexbox Layout & Centering',
      category: 'Flexbox',
      syntax: 'display: flex; justify-content: center; align-items: center; gap: 16px;',
      desc: 'Teknik paling andal untuk menyusun elemen secara horizontal/vertikal dan centering elemen di tengah.',
      sectionId: 'section-flexbox',
      keywords: ['flexbox', 'justify-content', 'align-items', 'centering flex', 'gap']
    },
    {
      name: 'CSS Grid Auto-Fit Responsive',
      category: 'Grid',
      syntax: 'grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;',
      desc: 'Membuat tata letak kartu grid otomatis responsif menyesuaikan lebar layar tanpa perlu media queries.',
      sectionId: 'section-grid',
      keywords: ['css grid', 'auto-fit', 'minmax', 'responsive grid', 'layout kartu']
    },
    {
      name: 'clamp() Fluid Typography',
      category: 'Modern CSS',
      syntax: 'font-size: clamp(1rem, 2.5vw, 2.5rem); padding: clamp(12px, 3vw, 32px);',
      desc: 'Ukuran font dan jarak yang membesar/mengecil mulus antara batas minimum dan maksimum.',
      sectionId: 'section-modern',
      keywords: ['clamp', 'fluid typography', 'responsive font']
    },
    {
      name: 'Semantic HTML5 Elements',
      category: 'HTML5',
      syntax: '<header>, <nav>, <main>, <article>, <section>, <footer>',
      desc: 'Struktur tag semantik untuk meningkatkan aksesibilitas pembaca layar (screen reader) dan SEO Google.',
      sectionId: 'section-semantic',
      keywords: ['semantic html', 'tag semantik', 'accessibility', 'a11y', 'seo html']
    }
  ],

  // 3. Sistem & Keamanan
  linux: [
    {
      name: 'wc -l (Count Lines)',
      category: 'Text',
      syntax: 'wc -l <file> | cat access.log | wc -l',
      desc: 'Menghitung (count) jumlah total baris dalam berkas atau menghitung jumlah baris data dari output stream.',
      sectionId: 'section-text',
      keywords: ['wc -l', 'count baris', 'hitung baris linux', 'wc count', 'word count']
    },
    {
      name: 'grep -c (Count Matches)',
      category: 'Text',
      syntax: 'grep -c "ERROR" /var/log/nginx/error.log',
      desc: 'Menghitung banyaknya baris yang cocok dengan pola kata kunci atau regex tertentu secara instan.',
      sectionId: 'section-text',
      keywords: ['grep -c', 'count matches', 'hitung kemunculan', 'grep count']
    },
    {
      name: 'ls -lah & pwd',
      category: 'Files',
      syntax: 'ls -lah /var/log | pwd',
      desc: 'Melihat seluruh berkas termasuk file tersembunyi dengan ukuran file manusiawi (human-readable).',
      sectionId: 'section-files',
      keywords: ['ls -la', 'pwd', 'navigasi berkas', 'list files']
    },
    {
      name: 'chmod & chown',
      category: 'Permissions',
      syntax: 'chmod 755 script.sh | chown -R www-data:www-data /var/www',
      desc: 'Mengatur hak izin baca, tulis, eksekusi (rwx) dan mengubah pemilik (owner) serta grup berkas.',
      sectionId: 'section-permissions',
      keywords: ['chmod', 'chown', 'hak akses', 'permission linux', 'chmod 755']
    },
    {
      name: 'grep, awk & sed',
      category: 'Text',
      syntax: 'cat access.log | grep "500" | awk \'{print $1}\' | sort | uniq -c',
      desc: 'Pipeline manipulasi teks tingkat lanjut untuk filter log, ekstraksi kolom, dan replace pola massal.',
      sectionId: 'section-text',
      keywords: ['grep', 'awk', 'sed', 'pipeline linux', 'olah teks log']
    },
    {
      name: 'systemctl & ps aux',
      category: 'System',
      syntax: 'systemctl restart nginx | systemctl status docker | ps aux | grep node',
      desc: 'Mengelola daemon service sistem operasi Linux (start, stop, enable) dan memantau proses aktif.',
      sectionId: 'section-system',
      keywords: ['systemctl', 'systemd', 'ps aux', 'kill process', 'service linux']
    },
    {
      name: 'df -h & free -m',
      category: 'Monitoring',
      syntax: 'df -h | free -m | top | htop',
      desc: 'Memantau sisa kapasitas harddisk, penggunaan swap, dan konsumsi memori RAM server.',
      sectionId: 'section-system',
      keywords: ['df -h', 'free -m', 'htop', 'cek ram', 'cek disk']
    },
    {
      name: 'crontab -e',
      category: 'Cron',
      syntax: 'crontab -e | 0 2 * * * /backup/db.sh',
      desc: 'Menjadwalkan eksekusi script atau perintah otomatis berkala setiap menit, jam, hari, atau bulan.',
      sectionId: 'section-cron',
      keywords: ['crontab', 'cron job', 'otomasi jadwal linux']
    }
  ],

  networking: [
    {
      name: 'Model 7 Lapis OSI',
      category: 'Fondasi',
      syntax: 'Physical (1) -> Data Link (2) -> Network (3) -> Transport (4) -> Session (5) -> Presentation (6) -> Application (7)',
      desc: 'Kerangka konseptual standardisasi komunikasi data jaringan komputer dari kabel fisik hingga aplikasi web.',
      sectionId: 'osi-model',
      keywords: ['osi model', '7 layer osi', 'transport layer', 'network layer']
    },
    {
      name: 'TCP 3-Way Handshake',
      category: 'Transport',
      syntax: 'SYN (Client) -> SYN-ACK (Server) -> ACK (Client)',
      desc: 'Protokol pembentukan koneksi terpercaya (reliable) pada TCP sebelum transfer data dimulai.',
      sectionId: 'tcp-handshake',
      keywords: ['tcp', 'handshake', 'syn ack', 'tcp 3 way']
    },
    {
      name: 'TCP vs UDP',
      category: 'Transport',
      syntax: 'TCP: Reliable, Flow Control, Slow vs UDP: Fast, Stateless, Video Streaming, Gaming',
      desc: 'Perbandingan protokol layer transport: keandalan data tanpa paket hilang vs kecepatan latensi rendah.',
      sectionId: 'tcp-handshake',
      keywords: ['tcp vs udp', 'udp streaming', 'perbandingan protokol']
    },
    {
      name: 'Subnetting IPv4 & CIDR Notation',
      category: 'IP Addressing',
      syntax: '/24 (255.255.255.0 = 254 Host) | /16 (65.534 Host) | Private IP: 10.x, 192.168.x',
      desc: 'Perhitungan rentang alamat IP, subnet mask, usable host, dan network ID dalam arsitektur LAN.',
      sectionId: 'subnetting-cidr',
      keywords: ['subnetting', 'cidr', 'ipv4', 'subnet mask', '/24']
    },
    {
      name: 'DNS Resolution Flow',
      category: 'DNS',
      syntax: 'Browser -> OS Cache -> Resolver (8.8.8.8) -> Root (.) -> TLD (.com) -> Authoritative Nameserver',
      desc: 'Alur tahapan penerjemahan nama domain website manusiawi menjadi alamat IP mesin komputer.',
      sectionId: 'dns-resolution',
      keywords: ['dns', 'dns resolution', 'a record', 'cname', 'nameserver']
    },
    {
      name: 'TLS 1.3 Handshake (HTTPS)',
      category: 'Security',
      syntax: 'Client Hello + Key Share -> Server Hello + Certificate + Finished (1-RTT)',
      desc: 'Proses enkripsi koneksi web aman port 443 dengan pertukaran sertifikat SSL/TLS modern.',
      sectionId: 'tls-handshake',
      keywords: ['tls', 'ssl', 'https port 443', 'tls 1.3 handshake', 'sertifikat']
    }
  ],

  security: [
    {
      name: 'SQL Injection (SQLi) & Parameterized Queries',
      category: 'Vulnerability',
      syntax: 'const q = "SELECT * FROM users WHERE email = $1"; await db.query(q, [email]);',
      desc: 'Celah penyisipan perintah SQL jahat pada form input dan pencegahan menggunakan prepared statements.',
      sectionId: 'web-attacks',
      keywords: ['sql injection', 'sqli', 'prepared statements', 'parameterized queries']
    },
    {
      name: 'Cross-Site Scripting (XSS)',
      category: 'Vulnerability',
      syntax: 'Stored XSS vs Reflected XSS | Mitigasi: HTML Entity Encoding & CSP Header',
      desc: 'Serangan injeksi skrip JavaScript jahat ke browser korban untuk mencuri cookie sesi atau bajak akun.',
      sectionId: 'web-attacks',
      keywords: ['xss', 'stored xss', 'reflected xss', 'cross site scripting']
    },
    {
      name: 'CSRF & SameSite Cookies',
      category: 'Vulnerability',
      syntax: 'Set-Cookie: session=xyz; SameSite=Lax; Secure | CSRF Token di form POST',
      desc: 'Pencegahan eksploitasi di mana website pihak ketiga memalsukan permintaan aksi atas nama user yang sedang login.',
      sectionId: 'web-attacks',
      keywords: ['csrf', 'csrf token', 'samesite', 'pemalsuan request']
    },
    {
      name: 'JWT Security & HttpOnly Cookies',
      category: 'Auth',
      syntax: 'Set-Cookie: token=xyz; HttpOnly; Secure; SameSite=Strict; Path=/',
      desc: 'Mengapa dilarang menyimpan token di localStorage dan praktik terbaik menyimpan JWT di HttpOnly cookie.',
      sectionId: 'jwt-auth',
      keywords: ['jwt', 'httponly cookie', 'token security', 'localstorage bahaya']
    },
    {
      name: 'HTTP Security Headers (CSP, HSTS)',
      category: 'Hardening',
      syntax: 'Content-Security-Policy (CSP) | Strict-Transport-Security (HSTS) | X-Frame-Options: DENY',
      desc: 'Header wajib respons web untuk menginstruksikan browser mengaktifkan proteksi anti-XSS dan clickjacking.',
      sectionId: 'security-headers',
      keywords: ['csp', 'hsts', 'x-frame-options', 'security headers', 'content-security-policy']
    },
    {
      name: 'Kriptografi: Hashing (Bcrypt) vs Enkripsi (AES)',
      category: 'Crypto',
      syntax: 'Hashing: Bcrypt / Argon2 (One-Way) vs Enkripsi: AES-256-GCM (Two-Way Reversible)',
      desc: 'Perbedaan fundamental fungsi hash searah untuk penyimpanan password vs algoritma enkripsi data bolak-balik.',
      sectionId: 'crypto-hashing',
      keywords: ['bcrypt', 'argon2', 'hashing vs enkripsi', 'aes-256', 'kriptografi password']
    }
  ],

  python: [
    {
      name: 'list.count() & str.count()',
      category: 'Builtin',
      syntax: 'my_list.count(x) | text.count("sub")',
      desc: 'Menghitung berapa kali nilai tertentu muncul di dalam list, tuple, atau substring teks Python.',
      sectionId: 'section-concepts',
      keywords: ['count python', 'list count', 'str count', 'hitung kemunculan']
    },
    {
      name: 'collections.Counter',
      category: 'Stdlib',
      syntax: 'from collections import Counter; frekuensi = Counter(["apel", "apel", "jeruk"])',
      desc: 'Struktur data bawaan Python untuk menghitung frekuensi seluruh elemen objek secara otomatis.',
      sectionId: 'section-concepts',
      keywords: ['counter', 'collections.counter', 'frekuensi kemunculan', 'hitung otomatis']
    },
    {
      name: 'List Comprehensions',
      category: 'Concepts',
      syntax: '[x**2 for x in numbers if x % 2 == 0]',
      desc: 'Sintaks ringkas dan berkinerja tinggi untuk membuat list baru melalui iterasi dan filter kondisi.',
      sectionId: 'section-concepts',
      keywords: ['list comprehension', 'comprehensions', 'filter list']
    },
    {
      name: 'Generators & yield',
      category: 'Concepts',
      syntax: 'def data_stream(): for item in big_dataset: yield process(item)',
      desc: 'Fungsi generator hemat memori yang memproduksi data satu per satu tanpa menampung seluruh data di RAM.',
      sectionId: 'section-concepts',
      keywords: ['generator', 'yield', 'lazy evaluation', 'hemat ram']
    },
    {
      name: 'Decorators (@)',
      category: 'Concepts',
      syntax: '@functools.wraps(fn) def my_decorator(func): def wrapper(*args, **kwargs): ...',
      desc: 'Pola membungkus fungsi untuk menyisipkan logging, otorisasi, atau timing tanpa mengubah kode aslinya.',
      sectionId: 'section-concepts',
      keywords: ['decorator', '@', 'wrapper function']
    },
    {
      name: 'Context Manager (with statement)',
      category: 'Concepts',
      syntax: 'with open("data.txt", "r") as f: content = f.read()',
      desc: 'Manajemen sumber daya otomatis menutup koneksi atau berkas secara aman meskipun terjadi exception.',
      sectionId: 'section-concepts',
      keywords: ['context manager', 'with open', '__enter__', '__exit__']
    },
    {
      name: 'Pandas (read_csv, loc, iloc, groupby)',
      category: 'Data Science',
      syntax: 'df = pd.read_csv("file.csv") | df.loc[df["age"] > 25] | df.groupby("cat")["val"].mean()',
      desc: 'Manipulasi data tabel, filter baris/kolom, penanganan nilai kosong, dan agregasi data tabular.',
      sectionId: 'section-io',
      keywords: ['pandas', 'dataframe', 'read_csv', 'loc iloc', 'groupby']
    }
  ],

  // 4. Desain & AI
  figma: [
    {
      name: 'Auto Layout: Fixed, Hug & Fill',
      category: 'Layout',
      syntax: 'Hug Contents (Bungkus konten) | Fill Container (Penuhi induk) | Fixed Width/Height',
      desc: 'Tiga mode dimensi ukuran elemen di dalam frame Auto Layout untuk menciptakan antarmuka yang responsif.',
      sectionId: 'auto-layout',
      keywords: ['auto layout', 'hug', 'fill container', 'fixed', 'figma layout']
    },
    {
      name: 'Component Sets & Variants',
      category: 'Components',
      syntax: 'Primary Component (Master) -> Variants (State: Default, Hover, Active, Disabled)',
      desc: 'Mengelompokkan variasi status tombol atau komponen UI ke dalam satu kesatuan teratur rapi.',
      sectionId: 'components-variants',
      keywords: ['component variants', 'component set', 'master component', 'varian figma']
    },
    {
      name: 'Component Properties (Boolean, Text, Instance)',
      category: 'Architecture',
      syntax: 'Boolean Property (Show/Hide Icon) | Text Property | Instance Swap',
      desc: 'Fitur modern untuk menyederhanakan varian komponen tanpa menciptakan ledakan jumlah varian (variant explosion).',
      sectionId: 'components-variants',
      keywords: ['component properties', 'boolean property', 'instance swap']
    },
    {
      name: '8-Point Grid System & Spacing Tokens',
      category: 'Design System',
      syntax: 'Spacing standard: 4px, 8px, 16px, 24px, 32px, 48px, 64px',
      desc: 'Aturan kelipatan 8px untuk seluruh padding, margin, dan jarak antar elemen demi konsistensi visual.',
      sectionId: 'design-tokens',
      keywords: ['8pt grid', 'spacing tokens', 'grid system', 'padding konsisten']
    },
    {
      name: '10 Prinsip Heuristik UX Jakob Nielsen',
      category: 'UX Research',
      syntax: 'Visibility of Status, Match Real World, User Control & Freedom, Consistency, Error Prevention, ...',
      desc: 'Panduan standar internasional untuk mengaudit dan mengevaluasi kenyamanan pengalaman pengguna aplikasi.',
      sectionId: 'ux-heuristics',
      keywords: ['heuristik ux', 'jakob nielsen', 'audit ux', 'usability']
    }
  ],

  prompting: [
    {
      name: 'Framework RTCE (Role, Task, Context, Example)',
      category: 'Framework',
      syntax: 'ROLE: Senior Engineer | TASK: Buat query SQL | CONTEXT: Database PostgreSQL | EXAMPLE: Format JSON',
      desc: 'Rumus standar menyusun instruksi prompt terstruktur agar menghasilkan jawaban AI yang presisi tinggi.',
      sectionId: 'rtce-framework',
      keywords: ['rtce', 'role task context example', 'prompt framework', 'struktur prompt']
    },
    {
      name: 'Few-Shot Prompting Technique',
      category: 'Teknik',
      syntax: 'Input 1 -> Output 1 | Input 2 -> Output 2 | Sekarang proses: Input Baru -> Output?',
      desc: 'Memberikan 2-3 contoh konkret sebelum meminta model menyelesaikan tugas utama untuk mengunci format keluaran.',
      sectionId: 'fewshot-technique',
      keywords: ['few shot', 'contoh prompt', 'in-context learning']
    },
    {
      name: 'Chain-of-Thought (CoT) Reasoning',
      category: 'Teknik',
      syntax: '"Mari kita selesaikan langkah demi langkah (Step-by-step reasoning)"',
      desc: 'Memandu model berpikir secara sekuensial sebelum menarik kesimpulan untuk tugas logika atau matematika rumit.',
      sectionId: 'cot-reasoning',
      keywords: ['chain of thought', 'cot', 'step by step', 'penalaran bertahap']
    },
    {
      name: 'Structured JSON Output Enforcement',
      category: 'Output',
      syntax: '"Kembalikan HANYA format JSON valid tanpa kata pengantar atau markdown pembuka"',
      desc: 'Memaksa LLM menghasilkan keluaran terstruktur yang dapat langsung di-parse oleh aplikasi backend sistem.',
      sectionId: 'json-output',
      keywords: ['json output', 'output terstruktur', 'json schema llm']
    },
    {
      name: 'Strategi Anti-Halusinasi & Grounding',
      category: 'Safety',
      syntax: '"Jawab HANYA berdasarkan konteks dokumen di atas. Jika tidak ditemukan, katakan tidak tahu."',
      desc: 'Membatasi ruang lingkup pengetahuan model AI agar tidak mengarang fakta palsu di luar data yang diberikan.',
      sectionId: 'anti-hallucination',
      keywords: ['anti halusinasi', 'grounding', 'rag prompt', 'cegah karangan']
    }
  ],

  'digital-marketing': [
    {
      name: 'Return on Ad Spend (ROAS)',
      category: 'Ads Metrics',
      syntax: 'ROAS = Pendapatan dari Iklan / Biaya Iklan (Spend)',
      desc: 'Metrik mengukur efektivitas kampanye berbayar: misal spend Rp 10jt menghasilkan Rp 40jt = ROAS 4x.',
      sectionId: 'section-ads',
      keywords: ['roas', 'return on ad spend', 'metrik iklan', 'efektivitas iklan']
    },
    {
      name: 'Customer Acquisition Cost (CAC)',
      category: 'Unit Economics',
      syntax: 'CAC = Total Biaya Marketing & Sales / Total Pelanggan Baru yang Didapat',
      desc: 'Menghitung biaya riil yang dikeluarkan perusahaan untuk mengonversi satu pengguna baru.',
      sectionId: 'section-unit-economics',
      keywords: ['cac', 'customer acquisition cost', 'biaya akuisisi']
    },
    {
      name: 'LTV to CAC Ratio (Rasio 3:1)',
      category: 'Unit Economics',
      syntax: 'Rasio Sehat = LTV : CAC ≥ 3 : 1',
      desc: 'Tolok ukur utama keberlanjutan bisnis startup: nilai masa hidup pelanggan harus minimal 3x lipat biaya akuisisi.',
      sectionId: 'section-unit-economics',
      keywords: ['ltv', 'lifetime value', 'ltv cac ratio', 'unit economics']
    },
    {
      name: 'CTR, CPM & CPC',
      category: 'Ads Metrics',
      syntax: 'CTR = (Clicks / Impressions) × 100% | CPC = Spend / Clicks',
      desc: 'Indikator daya tarik materi visual/copywriting iklan di platform Google Ads, Meta Ads, dan TikTok Ads.',
      sectionId: 'section-ads',
      keywords: ['ctr', 'cpm', 'cpc', 'click through rate', 'biaya per klik']
    },
    {
      name: 'On-Page SEO Checklist & Canonical Tags',
      category: 'SEO',
      syntax: '<title> (<60 char), <meta description>, H1-H3, <link rel="canonical" href="...">',
      desc: 'Optimasi elemen HTML halaman untuk mencegah duplikasi konten dan menaikkan ranking di Google search.',
      sectionId: 'section-seo',
      keywords: ['seo', 'canonical tag', 'title tag', 'meta description', 'on page seo']
    },
    {
      name: 'Core Web Vitals (LCP, INP, CLS)',
      category: 'SEO Teknis',
      syntax: 'LCP (<2.5 detik), INP (<200 ms), CLS (<0.1 visual shift)',
      desc: 'Tiga metrik resmi performa kecepatan memuat halaman dan stabilitas visual penentu algoritma ranking Google.',
      sectionId: 'section-cwv',
      keywords: ['core web vitals', 'lcp', 'inp', 'cls', 'performa website']
    }
  ],

  markdown: [
    {
      name: 'Heading & Text Formatting',
      category: 'Basics',
      syntax: '# H1, ## H2, **Tebal**, *Miring*, ~~Coret~~, `inline code`',
      desc: 'Format tipografi hirarki judul dan penekanan teks dokumen markdown standar.',
      sectionId: 'section-basics',
      keywords: ['heading', 'bold', 'italic', 'format teks markdown']
    },
    {
      name: 'Tabel & Text Alignment',
      category: 'Tables',
      syntax: '| Kolom 1 | Kolom 2 |\n| :--- | :---: |\n| Kiri | Tengah |',
      desc: 'Membuat tabel rapi beserta kontrol perataan kolom ke sisi kiri (:---), tengah (:---:), atau kanan (---:).',
      sectionId: 'section-tables',
      keywords: ['tabel markdown', 'alignment tabel', 'rata kiri tengah kanan']
    },
    {
      name: 'Task Lists (Checkbox)',
      category: 'Tasks',
      syntax: '- [x] Tugas selesai\n- [ ] Tugas yang belum selesai',
      desc: 'Daftar checklist interaktif yang didukung secara resmi di GitHub issues, pull requests, dan Notion.',
      sectionId: 'section-tasks',
      keywords: ['task list', 'checkbox markdown', 'to do list']
    },
    {
      name: 'GitHub Alerts (> [!NOTE], [!WARNING])',
      category: 'Alerts',
      syntax: '> [!NOTE]\n> [!TIP]\n> [!IMPORTANT]\n> [!WARNING]\n> [!CAUTION]',
      desc: 'Kotak pemberitahuan visual resmi GitHub Flavored Markdown dengan icon warna-warni yang elegan.',
      sectionId: 'section-alerts',
      keywords: ['github alerts', 'note', 'tip', 'warning', 'caution', 'blockquote']
    },
    {
      name: 'Mermaid Diagrams (Flowchart & Sequence)',
      category: 'Diagrams',
      syntax: '```mermaid\nflowchart LR\nA[Mulai] --> B[Selesai]\n```',
      desc: 'Merender diagram alur proses, arsitektur, dan sequence diagram langsung dari baris kode markdown.',
      sectionId: 'section-mermaid',
      keywords: ['mermaid', 'diagram alur', 'flowchart', 'sequence diagram']
    },
    {
      name: 'KaTeX Math Formulas',
      category: 'Math',
      syntax: '$$ E = mc^2 $$ | \\( \\sum_{i=1}^n x_i \\)',
      desc: 'Penulisan simbol matematika ilmiah, matriks, pecahan, dan persamaan kalkulus menggunakan sintaks LaTeX.',
      sectionId: 'section-math',
      keywords: ['katex', 'rumus matematika', 'latex math', 'persamaan']
    }
  ]
}

/**
 * Helper to get all topics for a given cheatsheet slug
 */
export const getCheatsheetTopics = (slug) => {
  return cheatsheetTopics[slug] || []
}
