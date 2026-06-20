export const MOCK_ROUTES = [
  {
    id: 1,
    name: 'Delhi to Kashmir',
    source: 'Delhi',
    destination: 'Kashmir',
    transport_type: 'Road',
    duration_min: 6,
    duration_max: 8,
    distance_km: 830,
    tags: ['Nature', 'Photography', 'Adventure', 'Family'],
    description:
      'Journey through the heart of India to the paradise on earth. Traverse Chandigarh, Jammu, Patnitop and arrive at the breathtaking Kashmir Valley.',
    cover_image:
      'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800',
    budget_min: 12000,
    budget_max: 25000,
    dont_miss: [
      'Sunset at Dal Lake',
      'Shikara ride at dawn',
      'Vaishno Devi trek',
      'Patnitop snow in winter',
      'Gulmarg gondola ride',
    ],
    highlights: {
      best_food: "Jammu's Rajma Chawal at Kesar Da Dhaba",
      best_photo: 'Patnitop Valley Viewpoint at sunrise',
      best_gem: 'Surinsar Lake near Jammu',
      best_family: 'Vaishno Devi Shrine',
      most_underrated: 'Banihal Pass tunnel town',
    },
    status: 'published',
    stop_count: 9,
  },
  {
    id: 2,
    name: 'Delhi to Manali',
    source: 'Delhi',
    destination: 'Manali',
    transport_type: 'Road',
    duration_min: 4,
    duration_max: 6,
    distance_km: 540,
    tags: ['Adventure', 'Nature', 'Photography', 'Budget'],
    description:
      'The classic Himalayan road trip. Pass through Chandigarh, Bilaspur, Mandi and Kullu before reaching the adventure capital of India.',
    cover_image:
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=800',
    budget_min: 8000,
    budget_max: 18000,
    dont_miss: [
      'Rohtang Pass (seasonal)',
      'Solang Valley snow activities',
      'Old Manali cafe culture',
      'Hadimba Temple forest walk',
      'Beas River rafting',
    ],
    highlights: {
      best_food: 'Siddu bread with ghee in Mandi',
      best_photo: 'Rohtang Pass panoramic view',
      best_gem: 'Naggar Castle viewpoint',
      best_family: 'Solang Valley',
      most_underrated: 'Prashar Lake trek from Mandi',
    },
    status: 'published',
    stop_count: 7,
  },
  {
    id: 3,
    name: 'Delhi to Jaipur',
    source: 'Delhi',
    destination: 'Jaipur',
    transport_type: 'Road',
    duration_min: 2,
    duration_max: 3,
    distance_km: 270,
    tags: ['Family', 'Photography', 'Food', 'Budget'],
    description:
      'The Golden Triangle classic. Explore ancient step wells, Mughal architecture and arrive at the Pink City of India.',
    cover_image:
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800',
    budget_min: 5000,
    budget_max: 15000,
    dont_miss: [
      'Chand Baori step well at Abhaneri',
      'Amber Fort elephant ride',
      'Hawa Mahal at golden hour',
      'Bapu Bazaar for local shopping',
      'Rooftop dining in old city',
    ],
    highlights: {
      best_food: 'Dal Baati Churma at Laxmi Misthan Bhandar',
      best_photo: 'Hawa Mahal at sunrise',
      best_gem: 'Abhaneri Step Well',
      best_family: 'Amber Fort',
      most_underrated: 'Galta Ji Monkey Temple',
    },
    status: 'published',
    stop_count: 5,
  },
  {
    id: 4,
    name: 'Delhi to Rishikesh',
    source: 'Delhi',
    destination: 'Rishikesh',
    transport_type: 'Road',
    duration_min: 2,
    duration_max: 3,
    distance_km: 240,
    tags: ['Adventure', 'Nature', 'Family', 'Budget'],
    description:
      'The yoga and adventure capital beckons. Drive through Haridwar and arrive at the adventure hub of India.',
    cover_image:
      'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=800',
    budget_min: 4000,
    budget_max: 12000,
    dont_miss: [
      'Ganga Aarti at Haridwar',
      'Bungee jumping at Mohan Chatti',
      'White water rafting',
      'Laxman Jhula at sunset',
      'Beatles Ashram exploration',
    ],
    highlights: {
      best_food: 'Chole Bhature at Haridwar Har Ki Pauri',
      best_photo: 'Laxman Jhula at dusk',
      best_gem: 'Neergarh Waterfall trek',
      best_family: 'Haridwar Ganga Aarti',
      most_underrated: 'Beatles Ashram graffiti walls',
    },
    status: 'published',
    stop_count: 6,
  },
];

export const MOCK_STOPS = {
  1: [
    {
      id: 1,
      route_id: 1,
      order: 1,
      destination: { id: 1, name: 'Delhi', region: 'Delhi' },
      day_recommendation: 'Day 1',
      distance_from_prev: 0,
      attractions: [
        {
          id: 1,
          name: 'India Gate',
          type: 'attraction',
          description: 'Iconic war memorial and perfect evening walk spot',
          tags: ['landmark', 'evening'],
        },
        {
          id: 2,
          name: 'Qutub Minar',
          type: 'attraction',
          description: 'UNESCO World Heritage minaret from 12th century',
          tags: ['heritage', 'photography'],
        },
      ],
      hidden_gems: [
        {
          id: 1,
          name: 'Agrasen ki Baoli',
          description: 'Ancient step well hidden in Connaught Place',
          why_special:
            'A 60-step ancient well in the middle of modern Delhi — most tourists walk right past it',
          tags: ['hidden', 'photography'],
        },
      ],
      food: [
        {
          id: 1,
          name: 'Paranthe Wali Gali',
          dish: 'Stuffed Paranthas',
          where: 'Chandni Chowk',
          price_range: 'Budget',
          description:
            'Try over 20 varieties of stuffed paranthas at this 100-year-old lane',
        },
      ],
      tips: [
        {
          id: 1,
          text: 'Start early from Delhi — avoid morning traffic by leaving before 7 AM',
          category: 'transport',
        },
      ],
    },
    {
      id: 2,
      route_id: 1,
      order: 2,
      destination: { id: 2, name: 'Chandigarh', region: 'Punjab' },
      day_recommendation: 'Day 1',
      distance_from_prev: 250,
      attractions: [
        {
          id: 3,
          name: 'Rock Garden',
          type: 'attraction',
          description: 'Stunning sculpture garden made from industrial waste',
          tags: ['art', 'unique'],
        },
        {
          id: 4,
          name: 'Sukhna Lake',
          type: 'attraction',
          description: 'Man-made lake perfect for evening walks',
          tags: ['nature', 'evening'],
        },
      ],
      hidden_gems: [
        {
          id: 2,
          name: 'Zakir Hussain Rose Garden',
          description: "Asia's largest rose garden with 1600+ varieties",
          why_special: 'Almost no tourists — best kept secret of Chandigarh',
          tags: ['nature', 'photography'],
        },
      ],
      food: [
        {
          id: 2,
          name: 'Sector 17 Dhaba Row',
          dish: 'Butter Chicken',
          where: 'Sector 17 market',
          price_range: 'Mid-range',
          description: 'Original Punjabi butter chicken in the city that invented it',
        },
      ],
      tips: [
        {
          id: 2,
          text: 'Chandigarh is very well planned — sector numbers help navigation',
          category: 'general',
        },
      ],
    },
    {
      id: 3,
      route_id: 1,
      order: 3,
      destination: { id: 3, name: 'Jammu', region: 'Jammu & Kashmir' },
      day_recommendation: 'Day 2',
      distance_from_prev: 310,
      attractions: [
        {
          id: 5,
          name: 'Vaishno Devi Shrine',
          type: 'attraction',
          description: 'One of the most sacred Hindu shrines, 14km trek from Katra',
          tags: ['spiritual', 'trekking'],
        },
      ],
      hidden_gems: [
        {
          id: 3,
          name: 'Surinsar Lake',
          description: 'Twin lakes 42km from Jammu surrounded by dense forest',
          why_special: 'Pristine lake with zero crowds most tourists skip',
          tags: ['nature', 'hidden'],
        },
      ],
      food: [
        {
          id: 3,
          name: 'Kesar Da Dhaba',
          dish: 'Rajma Chawal',
          where: 'Jammu city',
          price_range: 'Budget',
          description: 'Famous for Jammu-style red kidney bean curry',
        },
      ],
      tips: [
        {
          id: 3,
          text: 'For Vaishno Devi, register at Katra RFID counter before trek',
          category: 'safety',
        },
      ],
    },
  ],
};

export const MOCK_ITINERARY = {
  1: {
    id: 1,
    route_id: 1,
    name: 'Classic Delhi to Kashmir Itinerary',
    total_days: 7,
    days: [
      {
        id: 1,
        day_number: 1,
        title: 'Delhi Departure',
        destination_name: 'Delhi → Chandigarh',
        activities: [
          { id: 1, name: 'Early morning departure from Delhi', time_slot: 'Morning', type: 'transport' },
          { id: 2, name: 'Visit Rock Garden in Chandigarh', time_slot: 'Afternoon', type: 'attraction' },
          { id: 3, name: 'Sukhna Lake evening walk', time_slot: 'Evening', type: 'attraction' },
          { id: 4, name: 'Dinner at Sector 17 dhaba row', time_slot: 'Evening', type: 'food' },
        ],
      },
      {
        id: 2,
        day_number: 2,
        title: 'Into Jammu',
        destination_name: 'Chandigarh → Jammu',
        activities: [
          { id: 5, name: 'Early breakfast and checkout', time_slot: 'Morning', type: 'general' },
          { id: 6, name: 'Drive to Jammu via NH44', time_slot: 'Morning', type: 'transport' },
          { id: 7, name: 'Raghunath Temple visit', time_slot: 'Afternoon', type: 'attraction' },
          { id: 8, name: 'Rajma Chawal at Kesar Da Dhaba', time_slot: 'Afternoon', type: 'food' },
        ],
      },
      {
        id: 3,
        day_number: 3,
        title: 'Vaishno Devi Trek',
        destination_name: 'Katra → Vaishno Devi',
        activities: [
          { id: 9, name: 'Drive to Katra base camp', time_slot: 'Morning', type: 'transport' },
          { id: 10, name: 'Register RFID at Katra', time_slot: 'Morning', type: 'general' },
          { id: 11, name: 'Begin Vaishno Devi trek (14km)', time_slot: 'Morning', type: 'attraction' },
          { id: 12, name: 'Darshan at the shrine', time_slot: 'Afternoon', type: 'spiritual' },
        ],
      },
    ],
  },
};

export const MOCK_DESTINATIONS = [
  {
    id: 1,
    name: 'Delhi',
    region: 'Delhi, India',
    description:
      "India's capital city — a blend of ancient monuments and modern chaos. Home to UNESCO World Heritage Sites and the gateway to North India.",
    best_season: 'October to March',
    tags: ['Heritage', 'Food', 'Photography'],
    cover_image:
      'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800',
  },
  {
    id: 2,
    name: 'Kashmir',
    region: 'Jammu & Kashmir, India',
    description:
      'Paradise on Earth. Snow-capped mountains, shikara rides on Dal Lake, saffron fields and the warmth of Kashmiri culture.',
    best_season: 'April to October',
    tags: ['Nature', 'Photography', 'Adventure'],
    cover_image:
      'https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800',
  },
];