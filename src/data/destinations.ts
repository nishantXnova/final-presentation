import kathmanduImage from "@/assets/kathmandu-temple.jpg";
import pokharaImage from "@/assets/pokhara-lake.jpg";
import chitwanImage from "@/assets/chitwan-wildlife.jpg";
import annapurnaImage from "@/assets/annapurna-trek.jpg";
import lumbiniImage from "@/assets/lumbini-temple.jpg";
import heroImage from "@/assets/hero-everest.jpg";

export interface Destination {
  id: string;
  name: string;
  tagline: string;
  image: string;
  duration: string;
  rating: number;
  highlights: string[];
  category: string;
  bestTime: string;
  difficulty: string;
  altitude: string;
  description: string;
  fullDescription: string;
  attractions: {
    name: string;
    description: string;
  }[];
  itinerary: {
    day: string;
    title: string;
    description: string;
  }[];
  tips: string[];
  permits: string[];
}

export const destinations: Destination[] = [
  {
    id: "kathmandu-valley",
    name: "Kathmandu Valley",
    tagline: "City of Temples",
    image: kathmanduImage,
    duration: "2-4 days",
    rating: 4.8,
    highlights: ["Durbar Square", "Swayambhunath", "Boudhanath"],
    category: "Culture",
    bestTime: "October - May",
    difficulty: "Easy",
    altitude: "1,400m",
    description: "The cultural heart of Nepal with ancient temples, palaces, and living heritage.",
    fullDescription: "Kathmandu Valley is a UNESCO World Heritage Site that encompasses three ancient royal cities: Kathmandu, Patan, and Bhaktapur. This remarkable valley has been the cultural and political heart of Nepal for centuries. Every corner whispers stories of royalty and culture, with intricate palaces, timeless temples, and exquisite wood carvings that showcase the incredible craftsmanship of Newari artisans. The valley is home to seven UNESCO monument zones, including three Durbar Squares, two Buddhist stupas, and two Hindu temples.",
    attractions: [
      {
        name: "Kathmandu Durbar Square",
        description: "A complex of palaces, courtyards, and temples that were built between the 12th and 18th centuries. The square was the royal palace of the Malla kings and later the Shah dynasty."
      },
      {
        name: "Swayambhunath (Monkey Temple)",
        description: "An ancient religious architecture atop a hill in the Kathmandu Valley. The main stupa is surrounded by shrines and temples, with the famous all-seeing Buddha eyes painted on all four sides."
      },
      {
        name: "Boudhanath Stupa",
        description: "One of the largest spherical stupas in Nepal and the holiest Tibetan Buddhist temple outside Tibet. The stupa is surrounded by over 50 Tibetan monasteries."
      },
      {
        name: "Pashupatinath Temple",
        description: "The most sacred Hindu temple in Nepal, dedicated to Lord Shiva. Located on the banks of the Bagmati River, it's a UNESCO World Heritage Site and important cremation ground."
      },
      {
        name: "Patan Durbar Square",
        description: "Known for its rich cultural heritage, particularly its tradition of arts and crafts. The square features stunning Newari architecture and the ancient royal palace."
      }
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Kathmandu Durbar Square & Thamel",
        description: "Explore the historic Durbar Square, visit Kumari Ghar (Living Goddess temple), and wander through the vibrant streets of Thamel."
      },
      {
        day: "Day 2",
        title: "Swayambhunath & Patan",
        description: "Morning visit to Swayambhunath for sunrise views, then explore Patan Durbar Square and the Patan Museum."
      },
      {
        day: "Day 3",
        title: "Boudhanath & Pashupatinath",
        description: "Visit the sacred Pashupatinath Temple in the morning, then spend the afternoon at Boudhanath Stupa, exploring Tibetan monasteries."
      },
      {
        day: "Day 4",
        title: "Bhaktapur Day Trip",
        description: "Full day excursion to the medieval city of Bhaktapur, known for its preserved architecture, pottery squares, and famous Nyatapola Temple."
      }
    ],
    tips: [
      "Dress modestly when visiting temples - cover shoulders and knees",
      "Remove shoes before entering temple premises",
      "Early morning is the best time to visit Durbar Squares to avoid crowds",
      "Hire a licensed guide for deeper cultural insights",
      "Try local Newari cuisine like momos, choyla, and bara"
    ],
    permits: [
      "No special permits required for Kathmandu Valley",
      "Entry fees apply at Durbar Squares and major temples",
      "Bhaktapur has a separate entry fee (valid for multiple days)"
    ]
  },
  {
    id: "pokhara",
    name: "Pokhara",
    tagline: "Gateway to Annapurna",
    image: pokharaImage,
    duration: "3-5 days",
    rating: 4.9,
    highlights: ["Phewa Lake", "Sarangkot", "Peace Pagoda"],
    category: "Nature",
    bestTime: "September - November, March - May",
    difficulty: "Easy to Moderate",
    altitude: "822m",
    description: "A serene lakeside city with stunning mountain views and adventure activities.",
    fullDescription: "Pokhara is Nepal's adventure capital and the gateway to the Annapurna region. This cozy city nestled beneath the dramatic Annapurna and Machapuchare (Fishtail) peaks offers the perfect blend of natural beauty and modern amenities. Phewa Lake, the second-largest lake in Nepal, reflects the snow-capped Himalayas on clear mornings, creating one of the most photographed scenes in the country. Beyond its natural beauty, Pokhara serves as the base for numerous treks including the famous Annapurna Circuit and Poon Hill trek.",
    attractions: [
      {
        name: "Phewa Lake",
        description: "A freshwater lake offering boating, kayaking, and stunning reflections of the Annapurna range. The Tal Barahi Temple sits on an island in the middle of the lake."
      },
      {
        name: "Sarangkot",
        description: "The most famous viewpoint in Pokhara, offering panoramic sunrise views over the Annapurna and Dhaulagiri ranges. Also popular for paragliding."
      },
      {
        name: "World Peace Pagoda",
        description: "A Buddhist stupa on a hill south of Phewa Lake, offering spectacular views of the Himalayas and the city below. Built by Japanese Buddhist monks."
      },
      {
        name: "Davis Falls",
        description: "A waterfall where the Pardi Khola stream disappears underground into a narrow canal. Adjacent is the mysterious Gupteshwor Mahadev Cave."
      },
      {
        name: "Begnas and Rupa Lakes",
        description: "Quieter alternatives to Phewa Lake, offering peaceful boating and fishing experiences in a more natural setting."
      }
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Lakeside & Phewa Lake",
        description: "Settle into Lakeside, rent a boat on Phewa Lake, visit Tal Barahi Temple, and enjoy sunset from the lakeside cafes."
      },
      {
        day: "Day 2",
        title: "Sarangkot Sunrise & Paragliding",
        description: "Early morning drive to Sarangkot for sunrise, optional paragliding back to Lakeside, afternoon at leisure."
      },
      {
        day: "Day 3",
        title: "Peace Pagoda & Caves",
        description: "Hike to World Peace Pagoda for morning views, visit Davis Falls and Gupteshwor Cave, explore Tibetan settlements."
      },
      {
        day: "Day 4",
        title: "Day Trek to Australian Camp",
        description: "Full day trek to Australian Camp for closer mountain views, passing through beautiful villages and forests."
      },
      {
        day: "Day 5",
        title: "Begnas Lake & Departure",
        description: "Morning trip to peaceful Begnas Lake, final shopping in Lakeside, departure."
      }
    ],
    tips: [
      "Book paragliding in advance during peak season (October-November)",
      "Sunrise at Sarangkot requires leaving by 5 AM - worth the early wake-up",
      "Lakeside has many quality restaurants serving international cuisine",
      "Rent a bicycle to explore the area at your own pace",
      "Weather can change quickly - always carry a light rain jacket"
    ],
    permits: [
      "No permits needed for Pokhara city activities",
      "ACAP permit required for treks into Annapurna region",
      "TIMS card needed for multi-day treks"
    ]
  },
  {
    id: "everest-region",
    name: "Everest Region",
    tagline: "Top of the World",
    image: heroImage,
    duration: "12-16 days",
    rating: 5.0,
    highlights: ["Base Camp Trek", "Namche Bazaar", "Tengboche"],
    category: "Adventure",
    bestTime: "March - May, September - November",
    difficulty: "Challenging",
    altitude: "5,364m (Base Camp)",
    description: "The ultimate trekking destination to the foot of the world's highest peak.",
    fullDescription: "The Everest Base Camp Trek is a once-in-a-lifetime adventure that takes you to the foot of the world's highest mountain at 5,364m. This iconic journey follows the footsteps of legendary mountaineers Edmund Hillary and Tenzing Norgay through the homeland of the Sherpa people. The trek offers not just stunning mountain views but also a deep cultural immersion into Buddhist traditions, with ancient monasteries, prayer flags fluttering in the wind, and the legendary Sherpa hospitality. The trail passes through Sagarmatha National Park, a UNESCO World Heritage Site.",
    attractions: [
      {
        name: "Everest Base Camp",
        description: "The ultimate goal at 5,364m, the base camp sits at the foot of the Khumbu Icefall. Standing here among expedition tents with Everest towering above is an unforgettable experience."
      },
      {
        name: "Kala Patthar",
        description: "At 5,545m, this viewpoint offers the best views of Mount Everest. The pre-dawn climb rewards trekkers with spectacular sunrise over the world's highest peak."
      },
      {
        name: "Namche Bazaar",
        description: "The gateway to the Everest region and the Sherpa capital. This bustling market town offers cafes, bakeries, and equipment shops, plus an important acclimatization stop."
      },
      {
        name: "Tengboche Monastery",
        description: "The largest monastery in the Khumbu region, set against the backdrop of Ama Dablam. The annual Mani Rimdu festival is held here in November."
      },
      {
        name: "Sagarmatha National Park",
        description: "A UNESCO World Heritage Site protecting the unique high-altitude ecosystem, home to rare wildlife including the elusive snow leopard and Himalayan tahr."
      }
    ],
    itinerary: [
      {
        day: "Days 1-2",
        title: "Kathmandu to Lukla to Phakding",
        description: "Scenic flight to Lukla (2,840m), one of the world's most thrilling airports. Trek to Phakding through beautiful forests."
      },
      {
        day: "Days 3-4",
        title: "Phakding to Namche Bazaar",
        description: "Cross suspension bridges over the Dudh Kosi River, enter Sagarmatha National Park, and ascend to Namche Bazaar (3,440m). Rest day for acclimatization."
      },
      {
        day: "Days 5-6",
        title: "Namche to Tengboche to Dingboche",
        description: "Trek past Tengboche Monastery with stunning Ama Dablam views, continue to Dingboche (4,410m) for acclimatization."
      },
      {
        day: "Days 7-9",
        title: "Dingboche to Lobuche to Gorak Shep",
        description: "Pass memorials to fallen climbers, reach Gorak Shep (5,164m), and trek to Everest Base Camp for sunset."
      },
      {
        day: "Days 10-12",
        title: "Kala Patthar & Return",
        description: "Pre-dawn climb to Kala Patthar for sunrise over Everest, then begin the descent back to Lukla."
      }
    ],
    tips: [
      "Physical preparation should begin 3-6 months before the trek",
      "Acclimatize properly - never ascend more than 500m per day above 3,000m",
      "Carry Diamox for altitude sickness prevention (consult your doctor)",
      "Bring enough cash - ATMs are only available in Namche Bazaar",
      "Pack layers - temperatures range from 20°C in the day to -20°C at night"
    ],
    permits: [
      "Sagarmatha National Park Entry Permit",
      "Khumbu Rural Municipality Entry Permit",
      "TIMS Card (Trekkers' Information Management System)"
    ]
  },
  {
    id: "chitwan",
    name: "Chitwan National Park",
    tagline: "Jungle Safari",
    image: chitwanImage,
    duration: "2-3 days",
    rating: 4.7,
    highlights: ["Rhino Safari", "Elephant Encounters", "Bird Watching"],
    category: "Nature",
    bestTime: "October - March",
    difficulty: "Easy",
    altitude: "100-750m",
    description: "Nepal's premier wildlife destination, home to rhinos, tigers, and diverse ecosystems.",
    fullDescription: "Chitwan National Park, established in 1973, is Nepal's first national park and a UNESCO World Heritage Site. Covering over 950 square kilometers in the subtropical lowlands of the Terai, it's one of the best places in Asia to spot the endangered one-horned rhinoceros and Bengal tiger. The park's diverse ecosystems include dense sal forests, grasslands, and wetlands that support an incredible variety of wildlife including over 700 species of birds. Beyond wildlife, visitors can experience authentic Tharu culture in nearby villages.",
    attractions: [
      {
        name: "One-Horned Rhinoceros",
        description: "Chitwan is home to over 600 greater one-horned rhinos, making sightings almost guaranteed during jeep or canoe safaris."
      },
      {
        name: "Bengal Tiger Tracking",
        description: "The park has one of the highest densities of tigers in the world. While sightings are rare, tracking their pugmarks is thrilling."
      },
      {
        name: "Elephant Breeding Center",
        description: "Visit the government elephant breeding center to see baby elephants and learn about conservation efforts."
      },
      {
        name: "Rapti River Canoe Safari",
        description: "Glide along the river in a traditional dugout canoe, spotting gharial and mugger crocodiles, water birds, and riverside wildlife."
      },
      {
        name: "Tharu Cultural Village",
        description: "Experience the unique culture of the Tharu people, indigenous to the Terai, including their traditional dance performances and cuisine."
      }
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Arrival & Tharu Village",
        description: "Arrive in Sauraha, settle into your lodge, afternoon nature walk, evening Tharu cultural dance performance."
      },
      {
        day: "Day 2",
        title: "Full Day Safari",
        description: "Early morning jeep safari deep into the park, canoe ride on the Rapti River, visit elephant breeding center, jungle walk."
      },
      {
        day: "Day 3",
        title: "Bird Watching & Departure",
        description: "Early morning bird watching (over 700 species recorded), breakfast, departure or extension activities."
      }
    ],
    tips: [
      "October to March is the best time - grass is short and wildlife is easier to spot",
      "Wear neutral colors on safari - avoid bright colors that may disturb wildlife",
      "Bring good binoculars and a telephoto lens for photography",
      "Start safaris at dawn or dusk when animals are most active",
      "Stay at community-run lodges to support local conservation"
    ],
    permits: [
      "Chitwan National Park Entry Permit (purchased at park office)",
      "Guide mandatory for all activities inside the park",
      "Separate fees for jeep safari, elephant activities, and canoe rides"
    ]
  },
  {
    id: "annapurna-circuit",
    name: "Annapurna Circuit",
    tagline: "Epic Mountain Trek",
    image: annapurnaImage,
    duration: "10-21 days",
    rating: 4.9,
    highlights: ["Thorong La Pass", "Muktinath", "Mountain Views"],
    category: "Adventure",
    bestTime: "March - May, September - November",
    difficulty: "Challenging",
    altitude: "5,416m (Thorong La)",
    description: "One of the world's greatest treks, circling the entire Annapurna massif.",
    fullDescription: "The Annapurna Circuit is often called the world's best long-distance trek, offering an incredible diversity of landscapes, cultures, and experiences. The trail circles the entire Annapurna massif, crossing the challenging Thorong La Pass at 5,416m - one of the highest trekking passes in the world. From the subtropical lowlands to high alpine deserts, trekkers pass through Hindu villages, Buddhist communities, and the unique Tibetan-influenced culture of the Manang and Mustang regions. The trail offers close-up views of 8,000m peaks including Annapurna I, Dhaulagiri, and Manaslu.",
    attractions: [
      {
        name: "Thorong La Pass",
        description: "At 5,416m, this is the highest point of the trek and one of the world's highest trekking passes. The pre-dawn crossing is challenging but incredibly rewarding."
      },
      {
        name: "Muktinath Temple",
        description: "A sacred pilgrimage site for both Hindus and Buddhists, featuring 108 water spouts and an eternal natural gas flame burning within a water spring."
      },
      {
        name: "Manang Valley",
        description: "A stunning high-altitude valley with Tibetan culture, ancient monasteries, and dramatic mountain scenery. An important acclimatization stop."
      },
      {
        name: "Pisang Peak & Ice Lake",
        description: "Side trips from the main circuit offering glacier views, high-altitude lakes, and optional peak climbing experiences."
      },
      {
        name: "Marpha Village",
        description: "Known as the apple capital of Nepal, this charming village produces famous apple brandy and cider. The whitewashed buildings are beautiful."
      }
    ],
    itinerary: [
      {
        day: "Days 1-3",
        title: "Besisahar to Chame",
        description: "Drive or trek from Besisahar through rice paddies and subtropical forests, passing waterfalls and suspension bridges to Chame (2,710m)."
      },
      {
        day: "Days 4-6",
        title: "Chame to Manang",
        description: "Enter the rain shadow zone with dramatic landscape changes, stunning views of Annapurna II and III, reach Manang (3,540m) for acclimatization."
      },
      {
        day: "Days 7-9",
        title: "Manang to Thorong Phedi",
        description: "Gradual ascent through high alpine terrain, optional side trips to Ice Lake and Tilicho Lake, reach Thorong Phedi (4,525m)."
      },
      {
        day: "Days 10-11",
        title: "Thorong La to Muktinath",
        description: "Pre-dawn start to cross Thorong La Pass (5,416m), descend to Muktinath (3,800m), visit the sacred temple complex."
      },
      {
        day: "Days 12-14",
        title: "Muktinath to Jomsom to Pokhara",
        description: "Trek through apple orchards of Marpha, reach Jomsom, fly or drive back to Pokhara."
      }
    ],
    tips: [
      "Start the trek from Besisahar to acclimatize gradually",
      "Carry cash - ATMs are not available beyond Chame",
      "The pass is usually crossed before noon when winds pick up",
      "Consider going counter-clockwise (east to west) for better acclimatization",
      "Tea houses are available throughout - no camping necessary"
    ],
    permits: [
      "ACAP (Annapurna Conservation Area Permit)",
      "TIMS Card (Trekkers' Information Management System)",
      "Local municipality permits at various checkpoints"
    ]
  },
  {
    id: "lumbini",
    name: "Lumbini",
    tagline: "Birthplace of Buddha",
    image: lumbiniImage,
    duration: "1-2 days",
    rating: 4.6,
    highlights: ["Maya Devi Temple", "Peace Flame", "Monasteries"],
    category: "Spirituality",
    bestTime: "October - March",
    difficulty: "Easy",
    altitude: "150m",
    description: "A UNESCO World Heritage Site and the most sacred Buddhist pilgrimage destination.",
    fullDescription: "Lumbini, located in the Rupandehi District of Nepal near the Indian border, is one of the most sacred sites in the world. It is here that Queen Maya Devi gave birth to Prince Siddhartha Gautama in 623 BC, who would later become the Buddha - the Enlightened One. For over 2,600 years, Lumbini has drawn pilgrims and seekers of peace from around the world. The site is a UNESCO World Heritage Site featuring the Maya Devi Temple, the sacred Bodhi tree, the Ashoka Pillar erected by Emperor Ashoka in 249 BC, and monasteries donated by Buddhist nations from around the world.",
    attractions: [
      {
        name: "Maya Devi Temple",
        description: "The exact birthplace of Buddha, the temple houses an ancient marker stone and the sacred bathing pool where Maya Devi bathed before giving birth."
      },
      {
        name: "Ashoka Pillar",
        description: "Erected by Emperor Ashoka in 249 BC, this pillar marks the exact spot of Buddha's birth and is one of the oldest inscribed pillars in the world."
      },
      {
        name: "Sacred Bodhi Tree & Pond",
        description: "The ancient Bodhi tree and Puskarini pond where Maya Devi is said to have bathed before giving birth to Siddhartha."
      },
      {
        name: "International Monasteries",
        description: "Over 25 monasteries built by different Buddhist countries including Thailand, Myanmar, China, Japan, France, and Germany, each in their unique architectural style."
      },
      {
        name: "World Peace Flame",
        description: "An eternal flame lit in 1986, symbolizing world peace. The flame was brought from the eternal peace flame in the United States."
      }
    ],
    itinerary: [
      {
        day: "Day 1",
        title: "Sacred Garden & Maya Devi Temple",
        description: "Explore the Sacred Garden, visit Maya Devi Temple, see the Ashoka Pillar, walk around the sacred pond and Bodhi tree. Evening meditation."
      },
      {
        day: "Day 2",
        title: "Monasteries & Peace Flame",
        description: "Cycle or rickshaw through the monastic zones, visiting monasteries from different countries. Visit the World Peace Flame and museum."
      }
    ],
    tips: [
      "Visit early morning or late afternoon to avoid the heat",
      "Rent a bicycle - the site is spread over 8 square kilometers",
      "Dress modestly and maintain silence in sacred areas",
      "Full moon days (Purnima) are especially auspicious for visits",
      "The annual Buddha Jayanti festival in May is spectacular"
    ],
    permits: [
      "No special permits required",
      "Entry fees apply at Maya Devi Temple and some monasteries",
      "Photography restrictions inside some temple areas"
    ]
  }
];

export const getDestinationById = (id: string): Destination | undefined => {
  return destinations.find(dest => dest.id === id);
};
