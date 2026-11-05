const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

const dramas = [
  {
    id: 1,
    title: "Cinta di Ujung Senja",
    synopsis: "Pertemuan tak sengaja di pantai mengubah hidup dua orang.",
    poster: "https://picsum.photos/seed/senja/400/600",
    category: "Romantis",
    rating: 4.8,
    year: 2024,
    views: "1.2M",
    likes: 12400,
    episodes: [
      {
        ep: 1,
        title: "Pertemuan",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        duration: 15
      },
      {
        ep: 2,
        title: "Konflik",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        duration: 15
      }
    ]
  },
  {
    id: 2,
    title: "Balas Dendam Sang Pewaris",
    synopsis: "Pria yang kehilangan segalanya kembali merebut haknya.",
    poster: "https://picsum.photos/seed/dendam/400/600",
    category: "Aksi",
    rating: 4.6,
    year: 2023,
    views: "980K",
    likes: 8900,
    episodes: [
      {
        ep: 1,
        title: "Kembali",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        duration: 15
      }
    ]
  },
  {
    id: 3,
    title: "Rahasia Masa Lalu",
    synopsis: "Wanita menemukan rahasia kelam keluarganya.",
    poster: "https://picsum.photos/seed/rahasia/400/600",
    category: "Misteri",
    rating: 4.9,
    year: 2024,
    views: "2.1M",
    likes: 15600,
    episodes: [
      {
        ep: 1,
        title: "Penemuan",
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        duration: 15
      }
    ]
  }
];

app.get("/", (req, res) => {
  res.json({ name: "Drama API", version: "1.0.0", status: "OK" });
});

app.get("/api/dramas", (req, res) => {
  const list = dramas.map(({ episodes, ...rest }) => rest);
  res.json({ success: true, total: list.length, data: list });
});

app.get("/api/trending", (req, res) => {
  const sorted = [...dramas].map(({ episodes, ...rest }) => rest).sort((a, b) => b.rating - a.rating);
  res.json({ success: true, data: sorted });
});

app.get("/api/search", (req, res) => {
  const q = (req.query.q || "").toLowerCase().trim();
  if (!q) return res.status(400).json({ success: false, message: "Parameter q wajib" });
  const hasil = dramas.filter((d) => d.title.toLowerCase().includes(q)).map(({ episodes, ...rest }) => rest);
  res.json({ success: true, total: hasil.length, data: hasil });
});

app.get("/api/categories", (req, res) => {
  const cats = [...new Set(dramas.map((d) => d.category))];
  res.json({ success: true, data: cats });
});

app.get("/api/dramas/category/:cat", (req, res) => {
  const cat = req.params.cat.toLowerCase();
  const hasil = dramas.filter((d) => d.category.toLowerCase() === cat).map(({ episodes, ...rest }) => rest);
  res.json({ success: true, total: hasil.length, data: hasil });
});

app.get("/api/dramas/:id", (req, res) => {
  const drama = dramas.find((d) => d.id === Number(req.params.id));
  if (!drama) return res.status(404).json({ success: false, message: "Drama tidak ditemukan" });
  res.json({ success: true, data: drama });
});

app.get("/api/dramas/:id/episode/:ep", (req, res) => {
  const drama = dramas.find((d) => d.id === Number(req.params.id));
  if (!drama) return res.status(404).json({ success: false, message: "Drama tidak ditemukan" });
  const episode = drama.episodes.find((e) => e.ep === Number(req.params.ep));
  if (!episode) return res.status(404).json({ success: false, message: "Episode tidak ditemukan" });
  res.json({ success: true, data: episode });
});

module.exports = app;
