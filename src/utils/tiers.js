export const TIERS = [
      {
        id: 'D_FREE', name: 'Default: Free', tag: 'DEFAULT', theme: 'Basic Slate',
        accent: '#94A3B8', badgeClass: 'bg-slate-800 text-slate-400',
        desc: 'Border bawaan untuk akun gratis.',
        color1: '#475569', color2: '#1E293B', glow: 'transparent',
      },
      {
        id: 'D_PRO', name: 'Default: Pro', tag: 'DEFAULT', theme: 'Pro Gold',
        accent: '#FFB800', badgeClass: 'bg-amber-900 text-amber-400',
        desc: 'Border eksklusif bawaan akun PRO.',
        color1: '#FFB800', color2: '#B7791F', glow: '#FFB800',
      },
      {
        id: 'D_EXPERT', name: 'Default: Expert', tag: 'DEFAULT', theme: 'Expert Gradient',
        accent: '#FF3887', badgeClass: 'bg-fuchsia-900 text-fuchsia-400',
        desc: 'Border spesial bawaan akun EXPERT dengan efek kilap statis.',
        color1: '#A225F8', color2: '#FF3887', glow: '#FF3887',
      },
      {
        id: 1, name: "Level 1: Copper Node", tag: "TIER 01 • INITIATE", theme: "Copper & Neon Amber",
        accent: "#FF8C00", badgeClass: "bg-amber-950/60 text-amber-400 border-amber-500/30",
        desc: "Bentuk dasar sirkuit tembaga. Medali bulat polos / Border persegi profil minimalis dengan frame ganda.",
        color1: "#FF9933", color2: "#6B3500", glow: "#FF7700",
        polyPoints: "90,45 110,45 140,75 140,115 110,145 90,145 60,115 60,75",
        ribbonFill: "#421800", ribbonBorder: "#FF7700", wings: ""
      },
      {
        id: 2, name: "Level 10: Neon Carbon", tag: "TIER 02 • OPERATOR", theme: "Carbon Slate & Acid Lime",
        accent: "#00FF66", badgeClass: "bg-emerald-950/60 text-emerald-400 border-emerald-500/30",
        desc: "Pelat serat karbon dengan aksen hijau reaktif. Border memiliki ring dash luar kecepatan tinggi.",
        color1: "#00FF66", color2: "#0A3317", glow: "#00FF66",
        polyPoints: "100,40 145,66 145,124 100,150 55,124 55,66",
        ribbonFill: "#062410", ribbonBorder: "#00FF66", 
        wings: `<polygon points="45,95 28,95 38,115 50,110" fill="#00FF66" opacity="0.6"/><polygon points="155,95 172,95 162,115 150,110" fill="#00FF66" opacity="0.6"/>`
      },
      {
        id: 3, name: "Level 25: Cobalt Aegis", tag: "TIER 03 • SPECIALIST", theme: "Chrome & Electric Cyan",
        accent: "#00F0FF", badgeClass: "bg-cyan-950/60 text-cyan-400 border-cyan-500/30",
        desc: "Baja perak dengan harness pendingin cyan. Border profil dilengkapi bracket logam tebal di atas & bawah.",
        color1: "#00F0FF", color2: "#0B273D", glow: "#00F0FF",
        polyPoints: "80,42 120,42 150,72 150,118 120,148 80,148 50,118 50,72",
        ribbonFill: "#061A28", ribbonBorder: "#00F0FF", 
        wings: `<polygon points="42,75 22,65 32,105 48,95" fill="#00F0FF" opacity="0.7"/><polygon points="158,75 178,65 168,105 152,95" fill="#00F0FF" opacity="0.7"/>`
      },
      {
        id: 4, name: "Level 40: Violet Glitch", tag: "TIER 04 • OVERRIDE", theme: "Obsidian & Purple",
        accent: "#B026FF", badgeClass: "bg-purple-950/60 text-purple-400 border-purple-500/30",
        desc: "Sistem override dengan warna synthwave. Border profil ganda asimetris ala efek glitch netrunner.",
        color1: "#D946EF", color2: "#2A0845", glow: "#B026FF",
        polyPoints: "100,32 125,70 160,95 125,120 100,158 75,120 40,95 75,70",
        ribbonFill: "#1F0833", ribbonBorder: "#C026D3", 
        wings: `<path d="M35,95 L15,80 L25,120 Z" fill="#D946EF" opacity="0.8"/><path d="M165,95 L185,80 L175,120 Z" fill="#D946EF" opacity="0.8"/>`
      },
      {
        id: 5, name: "Level 60: Apex Gold Core", tag: "TIER 05 • ELITE", theme: "Hyper Gold",
        accent: "#FFB800", badgeClass: "bg-yellow-950/60 text-yellow-400 border-yellow-500/30",
        desc: "Lapis emas solid. Border profil dilengkapi dengan pelat kunci (corner wedges) di ke-4 sudutnya.",
        color1: "#FFDF00", color2: "#543300", glow: "#FFB800",
        polyPoints: "75,40 125,40 155,70 155,120 125,150 75,150 45,120 45,70",
        ribbonFill: "#2E1B00", ribbonBorder: "#FFB800", 
        wings: `<polygon points="40,65 15,50 25,95 42,90" fill="#FFB800" opacity="0.8"/><polygon points="160,65 185,50 175,95 158,90" fill="#FFB800" opacity="0.8"/><circle cx="100" cy="95" r="58" fill="none" stroke="#FFDF00" stroke-width="1.5" stroke-dasharray="8 4"/>`
      },
      {
        id: 6, name: "Level 80: Crimson Overlord", tag: "TIER 06 • SYNDICATE (ANIMATED)", theme: "Blood Metal",
        accent: "#FF003C", badgeClass: "bg-rose-950/60 text-rose-400 border-rose-500/30",
        desc: "ANIMATED ⚡ Sasis mecha memancarkan kilat merah berdenyut, border paku berotasi mulus memantau ancaman.",
        color1: "#FF0055", color2: "#3D000E", glow: "#FF003C",
        polyPoints: "100,30 145,55 165,95 145,135 100,160 55,135 35,95 55,55",
        ribbonFill: "#260009", ribbonBorder: "#FF003C", 
        wings: `<g class="t6-glow">
                  <animate attributeName="opacity" values="0.7; 1; 0.7" dur="1.2s" repeatCount="indefinite"/>
                  <polygon points="32,70 10,45 16,105 35,90" fill="#FF003C"/>
                  <polygon points="168,70 190,45 184,105 165,90" fill="#FF003C"/>
                  <polygon points="36,110 12,130 30,135" fill="#800018"/>
                  <polygon points="164,110 188,130 170,135" fill="#800018"/>
                </g>`
      },
      {
        id: 7, name: "Level 100: Singularity God", tag: "TIER 07 • QUANTUM (ANIMATED)", theme: "Prismatic God-Tier",
        accent: "#00F0FF", badgeClass: "bg-gradient-to-r from-cyan-950 via-purple-950 to-pink-950 text-white border-pink-500/40",
        desc: "ANIMATED 🌌 Tingkatan tertinggi! Dilengkapi dual-ring orbital berotasi sempurna, orb sudut melayang, dan gradasi prisma holo dinamis.",
        color1: "#00FFFF", color2: "#FF007F", glow: "#9D00FF",
        polyPoints: "100,28 140,50 162,95 140,140 100,162 60,140 38,95 60,50",
        ribbonFill: "#150A2A", ribbonBorder: "#00F0FF", 
        wings: `<g class="t7-hue">
                  <polygon points="35,60 8,35 18,95 38,85" fill="#00FFFF" opacity="0.9"/>
                  <polygon points="165,60 192,35 182,95 162,85" fill="#FF007F" opacity="0.9"/>
                  <polygon points="30,105 5,130 28,130" fill="#8000FF"/>
                  <polygon points="170,105 195,130 172,130" fill="#8000FF"/>
                </g>
                <circle cx="100" cy="95" r="62" fill="none" stroke="#FF00AA" stroke-width="1.5" stroke-dasharray="14 6">
                  <animateTransform attributeName="transform" type="rotate" from="0 100 95" to="360 100 95" dur="12s" repeatCount="indefinite"/>
                </circle>
                <circle cx="100" cy="95" r="68" fill="none" stroke="#00FFFF" stroke-width="1" stroke-dasharray="4 8">
                  <animateTransform attributeName="transform" type="rotate" from="360 100 95" to="0 100 95" dur="18s" repeatCount="indefinite"/>
                </circle>`
      },
      {
        id: "BB1", name: "iCoinz: Obsidian Elite", tag: "PREMIUM • BB1", theme: "Obsidian & Gold",
        accent: "#FFD700", badgeClass: "bg-yellow-950/80 text-yellow-400 border-yellow-500/50",
        desc: "Statis 💎 Premium Obsidian Gold. Eksklusif iCoinz, desain elegan obsidian dengan aksen emas premium.",
        color1: "#FFD700", color2: "#0A0A0A", glow: "#FFB800",
        polyPoints: "100,28 140,50 162,95 140,140 100,162 60,140 38,95 60,50", ribbonFill: "#0A0A0A", ribbonBorder: "#FFD700", wings: ""
      },
      {
        id: "BB2", name: "iCoinz: Crystal Frost", tag: "PREMIUM • BB2", theme: "Ice Blue & Silver",
        accent: "#00E5FF", badgeClass: "bg-cyan-950/80 text-cyan-200 border-cyan-400/50",
        desc: "Statis 💎 Premium Crystal Frost. Eksklusif iCoinz, desain kaca membeku dengan sudut tajam silver.",
        color1: "#E0FFFF", color2: "#001A33", glow: "#00E5FF",
        polyPoints: "100,28 140,50 162,95 140,140 100,162 60,140 38,95 60,50", ribbonFill: "#001A33", ribbonBorder: "#00E5FF", wings: ""
      },
      {
        id: "BB3", name: "iCoinz: Plasma Reactor", tag: "PREMIUM ANIMATED • BB3", theme: "Neon Green & Pink",
        accent: "#39FF14", badgeClass: "bg-green-950/80 text-green-400 border-green-500/50",
        desc: "ANIMATED 💎 Premium Plasma Reactor. Eksklusif iCoinz, reaktor plasma berdenyut dengan energi neon.",
        color1: "#FF00FF", color2: "#051A05", glow: "#39FF14",
        polyPoints: "100,28 140,50 162,95 140,140 100,162 60,140 38,95 60,50", ribbonFill: "#051A05", ribbonBorder: "#39FF14", wings: ""
      },
      {
        id: "BB4", name: "iCoinz: Void Singularity", tag: "PREMIUM ANIMATED • BB4", theme: "Dark Matter Purple",
        accent: "#9D00FF", badgeClass: "bg-purple-950/80 text-purple-400 border-purple-500/50",
        desc: "ANIMATED 💎 Premium Void Singularity. Eksklusif iCoinz, medan gravitasi dark matter berotasi tiada akhir.",
        color1: "#4B0082", color2: "#030005", glow: "#9D00FF",
        polyPoints: "100,28 140,50 162,95 140,140 100,162 60,140 38,95 60,50", ribbonFill: "#030005", ribbonBorder: "#9D00FF", wings: ""
      },
      {
        id: "BB5", name: "iCoinz: JS V8 Engine", tag: "PREMIUM ANIMATED • BB5", theme: "Yellow & Black",
        accent: "#F7DF1E", badgeClass: "bg-yellow-950/80 text-yellow-400 border-yellow-500/50",
        desc: "ANIMATED 💎 Tema JavaScript V8. Kode dinamis dan kurung kurawal yang selalu berdetak.",
        color1: "#F7DF1E", color2: "#1A1A1A", glow: "#F7DF1E",
        polyPoints: "100,28 140,50 162,95 140,140 100,162 60,140 38,95 60,50", ribbonFill: "#1A1A1A", ribbonBorder: "#F7DF1E", wings: ""
      },
      {
        id: "BB6", name: "iCoinz: TypeScript", tag: "PREMIUM ANIMATED • BB6", theme: "TS Blue",
        accent: "#3178C6", badgeClass: "bg-blue-950/80 text-blue-400 border-blue-500/50",
        desc: "ANIMATED 💎 Tema TypeScript. Typing effect dan frame biru khas TS.",
        color1: "#3178C6", color2: "#0A192F", glow: "#3178C6",
        polyPoints: "100,28 140,50 162,95 140,140 100,162 60,140 38,95 60,50", ribbonFill: "#0A192F", ribbonBorder: "#3178C6", wings: ""
      },
      {
        id: "BB7", name: "iCoinz: PHP Elephant", tag: "PREMIUM ANIMATED • BB7", theme: "PHP Purple",
        accent: "#777BB4", badgeClass: "bg-indigo-950/80 text-indigo-400 border-indigo-500/50",
        desc: "ANIMATED 💎 Tema PHP. Animasi gelombang dengan oval elegan.",
        color1: "#777BB4", color2: "#1A1829", glow: "#777BB4",
        polyPoints: "100,28 140,50 162,95 140,140 100,162 60,140 38,95 60,50", ribbonFill: "#1A1829", ribbonBorder: "#777BB4", wings: ""
      },
      {
        id: "BB8", name: "iCoinz: Python Serpent", tag: "PREMIUM ANIMATED • BB8", theme: "Blue & Yellow",
        accent: "#3776AB", badgeClass: "bg-blue-950/80 text-blue-400 border-blue-500/50",
        desc: "ANIMATED 💎 Tema Python. Ular biru dan kuning yang mengitari border tanpa henti.",
        color1: "#3776AB", color2: "#FFD43B", glow: "#3776AB",
        polyPoints: "100,28 140,50 162,95 140,140 100,162 60,140 38,95 60,50", ribbonFill: "#1A2530", ribbonBorder: "#3776AB", wings: ""
      },
      {
        id: "BB9", name: "iCoinz: Go Goroutine", tag: "PREMIUM ANIMATED • BB9", theme: "Cyan Matrix",
        accent: "#00ADD8", badgeClass: "bg-cyan-950/80 text-cyan-400 border-cyan-500/50",
        desc: "ANIMATED 💎 Tema Golang. Titik-titik matrix Goroutine yang berjalan secara asinkron.",
        color1: "#00ADD8", color2: "#0A1C24", glow: "#00ADD8",
        polyPoints: "100,28 140,50 162,95 140,140 100,162 60,140 38,95 60,50", ribbonFill: "#0A1C24", ribbonBorder: "#00ADD8", wings: ""
      },
      {
        id: "BB10", name: "iCoinz: Rust Oxidation", tag: "PREMIUM • BB10", theme: "Rust Red & Iron",
        accent: "#CE412B", badgeClass: "bg-red-950/80 text-red-400 border-red-500/50",
        desc: "Statis 💎 Tema Rust. Baja kuat anti memory-leak dengan warna karat yang khas.",
        color1: "#CE412B", color2: "#2C2C2C", glow: "#CE412B",
        polyPoints: "100,28 140,50 162,95 140,140 100,162 60,140 38,95 60,50", ribbonFill: "#2C2C2C", ribbonBorder: "#CE412B", wings: ""
      },
      {
        id: "BB11", name: "iCoinz: Hacker Terminal", tag: "PREMIUM ANIMATED • BB11", theme: "Terminal Green",
        accent: "#00FF00", badgeClass: "bg-green-950/80 text-green-400 border-green-500/50",
        desc: "ANIMATED 💎 Tema CLI Hacker. Kursor berkedip dan glitch layar hijau khas terminal linux.",
        color1: "#00FF00", color2: "#051A05", glow: "#00FF00",
        polyPoints: "100,28 140,50 162,95 140,140 100,162 60,140 38,95 60,50", ribbonFill: "#051A05", ribbonBorder: "#00FF00", wings: ""
      },
      {
        id: "BB12", name: "iCoinz: Cyber Samurai", tag: "PREMIUM • BB12", theme: "Crimson & Gold",
        accent: "#DC143C", badgeClass: "bg-rose-950/80 text-rose-400 border-rose-500/50",
        desc: "Statis 💎 Cyberpunk Samurai. Armor emas dan irisan katana crimson pada border.",
        color1: "#DC143C", color2: "#FFD700", glow: "#DC143C",
        polyPoints: "100,28 140,50 162,95 140,140 100,162 60,140 38,95 60,50", ribbonFill: "#1A050A", ribbonBorder: "#DC143C", wings: ""
      },
      {
        id: "BB13", name: "iCoinz: Quantum Core", tag: "PREMIUM ANIMATED • BB13", theme: "Aqua & Purple",
        accent: "#00FFFF", badgeClass: "bg-fuchsia-950/80 text-fuchsia-400 border-fuchsia-500/50",
        desc: "ANIMATED 💎 Quantum Computer Core. Lintasan partikel yang melengkung indah dan menyala.",
        color1: "#00FFFF", color2: "#8A2BE2", glow: "#00FFFF",
        polyPoints: "100,28 140,50 162,95 140,140 100,162 60,140 38,95 60,50", ribbonFill: "#1A0524", ribbonBorder: "#00FFFF", wings: ""
      }
    ];