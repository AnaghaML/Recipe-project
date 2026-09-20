const seedTrips = [
  {
    _id: "660000000000000000000001",
    title: "Tokyo & Kyoto Cherry Blossom Explorer",
    destination: "Tokyo, Japan",
    startDate: "2026-10-15T00:00:00.000Z",
    endDate: "2026-10-25T00:00:00.000Z",
    coverImage: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-09-01T10:00:00.000Z",
    updatedAt: "2026-09-01T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000002",
    title: "Amalfi Coast & Mediterranean Escape",
    destination: "Amalfi, Italy",
    startDate: "2026-11-02T00:00:00.000Z",
    endDate: "2026-11-10T00:00:00.000Z",
    coverImage: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-09-05T10:00:00.000Z",
    updatedAt: "2026-09-05T10:00:00.000Z"
  },
  {
    _id: "660000000000000000000003",
    title: "Swiss Alps Autumn Hiking Retreat",
    destination: "Zermatt, Switzerland",
    startDate: "2026-12-05T00:00:00.000Z",
    endDate: "2026-12-14T00:00:00.000Z",
    coverImage: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1200&q=80",
    createdAt: "2026-09-10T10:00:00.000Z",
    updatedAt: "2026-09-10T10:00:00.000Z"
  }
];

const seedPlaces = [
  // Tokyo Trip Places
  {
    _id: "661000000000000000000001",
    tripId: "660000000000000000000001",
    name: "Senso-ji Temple in Asakusa",
    category: "Sightseeing",
    notes: "Visit early morning to beat the crowds. Don't miss Nakamise-dori shopping street.",
    isCompleted: true,
    createdAt: "2026-09-01T11:00:00.000Z",
    updatedAt: "2026-09-01T11:00:00.000Z"
  },
  {
    _id: "661000000000000000000002",
    tripId: "660000000000000000000001",
    name: "Shibuya Crossing & Hachiko Statue",
    category: "Sightseeing",
    notes: "Iconic pedestrian scramble. Get a rooftop view from Shibuya Sky observatory.",
    isCompleted: true,
    createdAt: "2026-09-01T11:15:00.000Z",
    updatedAt: "2026-09-01T11:15:00.000Z"
  },
  {
    _id: "661000000000000000000003",
    tripId: "660000000000000000000001",
    name: "Ichiran Ramen Shibuya",
    category: "Food",
    notes: "Signature tonkotsu ramen with solo dining flavor concentration booths.",
    isCompleted: true,
    createdAt: "2026-09-01T11:30:00.000Z",
    updatedAt: "2026-09-01T11:30:00.000Z"
  },
  {
    _id: "661000000000000000000004",
    tripId: "660000000000000000000001",
    name: "Shinjuku Gyoen National Garden",
    category: "Activity",
    notes: "Tranquil stroll through Japanese traditional and French formal gardens.",
    isCompleted: false,
    createdAt: "2026-09-01T11:45:00.000Z",
    updatedAt: "2026-09-01T11:45:00.000Z"
  },
  {
    _id: "661000000000000000000005",
    tripId: "660000000000000000000001",
    name: "Park Hyatt Tokyo",
    category: "Hotel",
    notes: "Check-in at 3 PM. Enjoy jazz cocktails at the 52nd-floor New York Bar.",
    isCompleted: false,
    createdAt: "2026-09-01T12:00:00.000Z",
    updatedAt: "2026-09-01T12:00:00.000Z"
  },
  {
    _id: "661000000000000000000006",
    tripId: "660000000000000000000001",
    name: "Shinkansen Bullet Train (Tokyo to Kyoto)",
    category: "Transport",
    notes: "Nozomi express train. Mt. Fuji visible on the right side window seats.",
    isCompleted: false,
    createdAt: "2026-09-01T12:15:00.000Z",
    updatedAt: "2026-09-01T12:15:00.000Z"
  },

  // Amalfi Coast Trip Places
  {
    _id: "661000000000000000000007",
    tripId: "660000000000000000000002",
    name: "Positano Spiaggia Grande Beach",
    category: "Sightseeing",
    notes: "Stroll down the vibrant pastel-hued village alleys down to the pebble beach.",
    isCompleted: true,
    createdAt: "2026-09-05T11:00:00.000Z",
    updatedAt: "2026-09-05T11:00:00.000Z"
  },
  {
    _id: "661000000000000000000008",
    tripId: "660000000000000000000002",
    name: "Trattoria da Vincenzo",
    category: "Food",
    notes: "Traditional seafood pasta, grilled catch of the day, and cold limoncello.",
    isCompleted: false,
    createdAt: "2026-09-05T11:15:00.000Z",
    updatedAt: "2026-09-05T11:15:00.000Z"
  },
  {
    _id: "661000000000000000000009",
    tripId: "660000000000000000000002",
    name: "Path of the Gods (Sentiero degli Dei)",
    category: "Activity",
    notes: "Panoramic clifftop hiking trail connecting Bomerano to Nocelle. Bring hiking shoes.",
    isCompleted: false,
    createdAt: "2026-09-05T11:30:00.000Z",
    updatedAt: "2026-09-05T11:30:00.000Z"
  },
  {
    _id: "661000000000000000000010",
    tripId: "660000000000000000000002",
    name: "Capri Island Day Cruise & Blue Grotto",
    category: "Activity",
    notes: "Full-day boat charter around Capri with swimming stops at the Faraglioni.",
    isCompleted: false,
    createdAt: "2026-09-05T11:45:00.000Z",
    updatedAt: "2026-09-05T11:45:00.000Z"
  },

  // Swiss Alps Trip Places
  {
    _id: "661000000000000000000011",
    tripId: "660000000000000000000003",
    name: "Gornergrat Bahn Cogwheel Railway",
    category: "Transport",
    notes: "Europe's highest open-air cogwheel railway up to 3,089 meters altitude.",
    isCompleted: false,
    createdAt: "2026-09-10T11:00:00.000Z",
    updatedAt: "2026-09-10T11:00:00.000Z"
  },
  {
    _id: "661000000000000000000012",
    tripId: "660000000000000000000003",
    name: "Chez Vrony Alpine Dining",
    category: "Food",
    notes: "Michelin-recommended alpine rustic restaurant with panoramic Matterhorn terrace.",
    isCompleted: false,
    createdAt: "2026-09-10T11:15:00.000Z",
    updatedAt: "2026-09-10T11:15:00.000Z"
  },
  {
    _id: "661000000000000000000013",
    tripId: "660000000000000000000003",
    name: "5-Seenweg (Five Lakes Walk)",
    category: "Activity",
    notes: "Reflections of the Matterhorn in Stellisee, Grindjisee, and Grunsee.",
    isCompleted: false,
    createdAt: "2026-09-10T11:30:00.000Z",
    updatedAt: "2026-09-10T11:30:00.000Z"
  }
];

module.exports = { seedTrips, seedPlaces };
