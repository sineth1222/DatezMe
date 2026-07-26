export interface DateSpot {
  id: string;
  name: string;
  emoji: string;
  blurb: string;
  activities: string[];
}

export interface District {
  id: string;
  name: string;
  province: string;
  emoji: string;
  spots: DateSpot[];
}

// Researched, real spots per district — couples pick a district, then
// choose which specific spots (and activities) to offer their partner.
// Structure is easy to extend: add more districts/spots the same shape.
export const DISTRICTS: District[] = [
  {
    id: "colombo",
    name: "Colombo",
    province: "Western",
    emoji: "🌆",
    spots: [
      {
        id: "galle-face-green",
        name: "Galle Face Green",
        emoji: "🌅",
        blurb:
          "The city's iconic oceanfront promenade — kites, isso wade, and sunset over the Indian Ocean.",
        activities: [
          "Evening sunset walk",
          "Share isso wade & kottu from the carts",
          "Fly a kite together",
        ],
      },
      {
        id: "mount-lavinia-beach",
        name: "Mount Lavinia Beach",
        emoji: "🏖️",
        blurb:
          "A relaxed 2km stretch of beach south of the city, best visited Nov–Apr with cafes nearby.",
        activities: [
          "Barefoot beach walk",
          "Sunset dinner at a beachfront cafe",
          "Watch the fishing boats come in",
        ],
      },
      {
        id: "viharamahadevi-park",
        name: "Viharamahadevi Park",
        emoji: "🌳",
        blurb:
          "Colombo's biggest green space — shaded paths, a fountain, and quiet benches in the middle of the city.",
        activities: [
          "Slow stroll under the old trees",
          "Picnic on the lawn",
          "People-watch by the fountain",
        ],
      },
      {
        id: "colombo-lighthouse",
        name: "Colombo Lighthouse & Fort",
        emoji: "🗼",
        blurb:
          "Colonial-era streets and the old lighthouse by the coast, with ocean views.",
        activities: [
          "Evening photo walk through Fort",
          "Coastal view from the lighthouse",
          "Explore the old Dutch-era buildings",
        ],
      },
    ],
  },
  {
    id: "gampaha",
    name: "Gampaha",
    province: "Western",
    emoji: "🌴",
    spots: [
      {
        id: "negombo-beach",
        name: "Negombo Beach Strip",
        emoji: "🏝️",
        blurb:
          "A laid-back beach town with a long stretch of sand, seaside bars, and a lively fishing harbour.",
        activities: [
          "Sunset walk on the beach",
          "Fresh seafood dinner by the shore",
          "Boat ride on the Dutch Canal",
        ],
      },
      {
        id: "muthurajawela-marsh",
        name: "Muthurajawela Wetland",
        emoji: "🚣",
        blurb:
          "A quiet boat safari through mangroves and marshland just outside Negombo.",
        activities: [
          "Boat safari through the marsh",
          "Birdwatching together",
          "Golden-hour photos on the water",
        ],
      },
    ],
  },
  {
    id: "kalutara",
    name: "Kalutara",
    province: "Western",
    emoji: "🌊",
    spots: [
      {
        id: "bentota-beach",
        name: "Bentota Beach & Lagoon",
        emoji: "🛶",
        blurb:
          "Calm lagoon waters meeting the sea — a classic honeymoon-style getaway spot.",
        activities: [
          "Lagoon boat ride",
          "Beachfront candlelight dinner",
          "Water sports for the adventurous",
        ],
      },
      {
        id: "kalutara-bodhiya",
        name: "Kalutara Bodhiya",
        emoji: "🪷",
        blurb:
          "A striking hollow stupa on the riverbank — peaceful and reflective.",
        activities: ["Quiet evening visit", "Riverside walk nearby"],
      },
    ],
  },
  {
    id: "kandy",
    name: "Kandy",
    province: "Central",
    emoji: "🏞️",
    spots: [
      {
        id: "kandy-lake",
        name: "Kandy Lake Walk",
        emoji: "🌇",
        blurb:
          "A peaceful lakeside walk in the evening as the light turns gold over the water.",
        activities: [
          "Sunset lap around the lake",
          "Sit on a bench and talk",
          "Evening visit to the Temple of the Tooth nearby",
        ],
      },
      {
        id: "peradeniya-gardens",
        name: "Royal Botanical Gardens, Peradeniya",
        emoji: "🌿",
        blurb:
          "Giant bamboo, orchids, and a suspension bridge over the Mahaweli River — a favourite for couples.",
        activities: [
          "Picnic under the giant trees",
          "Walk to the suspension bridge",
          "Orchid house visit",
        ],
      },
      {
        id: "kandy-hills-viewpoint",
        name: "Kandy Viewpoint",
        emoji: "📸",
        blurb:
          "A hilltop lookout over the whole city — a good photo point and quiet spot to sit.",
        activities: ["Golden-hour photos", "Quiet conversation with a view"],
      },
    ],
  },
  {
    id: "nuwara-eliya",
    name: "Nuwara Eliya",
    province: "Central",
    emoji: "🍃",
    spots: [
      {
        id: "gregory-lake",
        name: "Gregory Lake",
        emoji: "🚤",
        blurb:
          '"Little England\'s" signature lake — rent a paddle boat and glide across the cool water.',
        activities: [
          "Paddle boat ride",
          "Lakeside walk with a warm drink",
          "Sunset photos by the water",
        ],
      },
      {
        id: "hakgala-gardens",
        name: "Hakgala Botanical Garden",
        emoji: "🌺",
        blurb:
          "Rose gardens and flower beds against a misty hillside backdrop.",
        activities: ["Wander the flower beds", "Quiet garden picnic"],
      },
      {
        id: "tea-factory-nuwara-eliya",
        name: "Tea Factory & Tasting",
        emoji: "☕",
        blurb:
          "Walk through the tea estates, then warm up with a fresh cup at the factory.",
        activities: [
          "Tea estate walk",
          "Tea tasting for two",
          "Learn how Ceylon tea is made",
        ],
      },
    ],
  },
  {
    id: "matale",
    name: "Matale",
    province: "Central",
    emoji: "🗿",
    spots: [
      {
        id: "sigiriya-rock",
        name: "Sigiriya Rock Fortress",
        emoji: "🏔️",
        blurb:
          "The ancient Lion Rock — a shared climb rewarded with a panoramic view at the top.",
        activities: [
          "Climb to the summit together",
          "Explore the water gardens below",
          "Sunrise or sunset photos from the top",
        ],
      },
      {
        id: "matale-spice-garden",
        name: "Matale Spice Garden",
        emoji: "🌶️",
        blurb:
          "A fragrant walk through a working spice garden, with a guide explaining each plant.",
        activities: ["Guided spice garden walk", "Try a fresh herbal tea"],
      },
    ],
  },
  {
    id: "galle",
    name: "Galle",
    province: "Southern",
    emoji: "🏰",
    spots: [
      {
        id: "galle-fort",
        name: "Galle Fort",
        emoji: "🕰️",
        blurb:
          "A UNESCO World Heritage Dutch fort — cobbled lanes, boutique cafes, and ocean-view ramparts.",
        activities: [
          "Sunset walk on the ramparts",
          "Explore boutique cafes hand in hand",
          "Photos by the lighthouse",
        ],
      },
      {
        id: "unawatuna-beach",
        name: "Unawatuna Beach",
        emoji: "🏖️",
        blurb:
          "A calm, palm-fringed bay just outside Galle, easy to swim in and relax by.",
        activities: [
          "Swim together",
          "Beachfront lunch",
          "Sunset drinks by the sand",
        ],
      },
    ],
  },
  {
    id: "matara",
    name: "Matara",
    province: "Southern",
    emoji: "🐋",
    spots: [
      {
        id: "mirissa-beach",
        name: "Mirissa Beach",
        emoji: "🌴",
        blurb:
          "A crescent bay lined with coconut palms — magical at sunset, famous for whale watching.",
        activities: [
          "Sunset on the beach with a coconut",
          "Whale & dolphin watching tour (Dec–Apr)",
          "Beachfront candlelight dinner",
        ],
      },
      {
        id: "weligama-bay",
        name: "Weligama Bay",
        emoji: "🏄",
        blurb:
          "A relaxed surf town next to Mirissa — good for a slower, stylish beach day.",
        activities: [
          "Beginner surf lesson together",
          "Cafe-hopping by the bay",
        ],
      },
    ],
  },
  {
    id: "hambantota",
    name: "Hambantota",
    province: "Southern",
    emoji: "🦩",
    spots: [
      {
        id: "tangalle-beach",
        name: "Tangalle Beach",
        emoji: "🌾",
        blurb:
          "Quiet, wide, and far less crowded than the southern hotspots — good for privacy.",
        activities: [
          "Long quiet beach walk",
          "In-villa or beachfront private dinner",
        ],
      },
      {
        id: "bundala-safari",
        name: "Bundala National Park",
        emoji: "🦚",
        blurb:
          "A wetland safari park with flamingos, elephants, and birdlife — a shared adventure.",
        activities: ["Morning safari jeep ride", "Birdwatching together"],
      },
    ],
  },
  {
    id: "badulla",
    name: "Badulla",
    province: "Uva",
    emoji: "⛰️",
    spots: [
      {
        id: "ella-rock",
        name: "Ella Rock & Little Adam's Peak",
        emoji: "🥾",
        blurb:
          "Misty mountain town famous for its hike-in views over tea country.",
        activities: [
          "Sunrise hike up Little Adam's Peak",
          "Photos at the Nine Arch Bridge",
          "Cozy cafe lunch in Ella town",
        ],
      },
      {
        id: "ravana-falls",
        name: "Ravana Falls",
        emoji: "💦",
        blurb:
          "A roadside waterfall near Ella, easy to reach for a quick romantic stop.",
        activities: ["Waterfall photo stop", "Short walk to the viewing point"],
      },
      {
        id: "kandy-ella-train",
        name: "Scenic Train to/from Ella",
        emoji: "🚂",
        blurb:
          "One of the world's most scenic train rides — tea fields and mountains rolling past the window.",
        activities: [
          "Ride together and watch the hills pass",
          "Grab tea from a vendor at a stop",
        ],
      },
    ],
  },
  {
    id: "trincomalee",
    name: "Trincomalee",
    province: "Eastern",
    emoji: "🐬",
    spots: [
      {
        id: "nilaveli-beach",
        name: "Nilaveli Beach",
        emoji: "🌅",
        blurb:
          "Wide, bright, and quieter than the southern beaches — best May to September.",
        activities: [
          "Sunrise walk on the beach",
          "Snorkel together",
          "Boat trip to Pigeon Island",
        ],
      },
      {
        id: "marble-beach",
        name: "Marble Beach",
        emoji: "🤿",
        blurb:
          "Calm, clear water that makes the whole setting feel more intimate.",
        activities: ["Swim in calm clear water", "Quiet no-plans beach day"],
      },
    ],
  },
  {
    id: "jaffna",
    name: "Jaffna",
    province: "Northern",
    emoji: "🛕",
    spots: [
      {
        id: "nallur-kovil",
        name: "Nallur Kandaswamy Kovil",
        emoji: "🕌",
        blurb: "A vibrant, historic Hindu temple at the heart of Jaffna town.",
        activities: [
          "Evening temple visit",
          "Explore the surrounding old town streets",
        ],
      },
      {
        id: "casuarina-beach",
        name: "Casuarina Beach",
        emoji: "🏖️",
        blurb:
          "A calm, shallow lagoon-like beach on Karainagar island, popular for a quiet swim.",
        activities: ["Shallow-water swim together", "Sunset on the sand"],
      },
    ],
  },
  {
    id: "anuradhapura",
    name: "Anuradhapura",
    province: "North Central",
    emoji: "🏛️",
    spots: [
      {
        id: "anuradhapura-ruins",
        name: "Sacred City Ruins",
        emoji: "🕍",
        blurb:
          "Ancient stupas and shrines set among quiet, tree-lined grounds — good for a slow cultural day.",
        activities: [
          "Cycle tour through the ancient city",
          "Sunset by an old stupa",
          "Quiet walk through the ruins",
        ],
      },
    ],
  },
  {
    id: "ampara",
    name: "Ampara",
    province: "Eastern",
    emoji: "🏄‍♂️",
    spots: [
      {
        id: "arugam-bay",
        name: "Arugam Bay",
        emoji: "🌊",
        blurb:
          "A famous surf town on the east coast, with a relaxed, bohemian beach vibe.",
        activities: [
          "Surf lesson together",
          "Beachside dinner at a laid-back cafe",
          "Sunset at the point break",
        ],
      },
    ],
  },
  {
    id: "ratnapura",
    name: "Ratnapura",
    province: "Sabaragamuwa",
    emoji: "💎",
    spots: [
      {
        id: "kitulgala",
        name: "Kitulgala River",
        emoji: "🛶",
        blurb:
          "The whitewater rafting hub near Ratnapura, set in thick rainforest along the Kelani River.",
        activities: [
          "Whitewater rafting together",
          "Riverside picnic",
          "Short rainforest nature walk",
        ],
      },
    ],
  },
];

// Flat vibe options offered during customization (unrelated to district).
export const VIBE_OPTIONS = [
  { id: "sunset-beach", label: "Sunset & Beach Walk", emoji: "🌇" },
  { id: "cozy-cafe", label: "Cozy Cafe", emoji: "☕" },
  { id: "fine-dining", label: "Fine Dining", emoji: "🍷" },
  { id: "street-food-movie", label: "Street Food & Movie Night", emoji: "🍿" },
  { id: "nature-hike", label: "Nature & Hiking", emoji: "🥾" },
  { id: "culture-history", label: "Culture & History", emoji: "🛕" },
];

// Flattened lookup used by the invite page/dashboard to resolve a stored
// spot name back to its full details (district, emoji, blurb, activities).
export function findSpotByName(name: string) {
  for (const d of DISTRICTS) {
    const spot = d.spots.find((s) => s.name === name);
    if (spot) return { ...spot, district: d.name };
  }
  return null;
}
