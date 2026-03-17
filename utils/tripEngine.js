// ─────────────────────────────────────────────────────────────
//  DesiVDesi Custom Trip Planner Engine  (zero external APIs)
//  Drop this file in:  server/utils/tripEngine.js
// ─────────────────────────────────────────────────────────────

// ── Destination Database ──────────────────────────────────────
const DESTINATIONS = {
    // ── GOA ──
    goa: {
        summary: "Goa blends sun-kissed beaches, Portuguese heritage, and vibrant nightlife into one unforgettable coastal escape.",
        bestTimeToVisit: "November to February",
        localTransport: "Rent a scooter (₹300–500/day) or hire taxis via GoaMiles app",
        areas: {
            north: { label: "North Goa", vibe: "lively, beach parties, markets" },
            south: { label: "South Goa", vibe: "serene, luxury, less crowded" },
            default: { label: "Goa", vibe: "beaches, heritage, food" },
        },
        activities: {
            morning: [
                { name: "Calangute Beach Morning Walk", description: "Stroll the queen of beaches as the sun rises over the Arabian Sea.", cost: "Free" },
                { name: "Basilica of Bom Jesus", description: "UNESCO heritage church housing the tomb of St. Francis Xavier.", cost: "Free" },
                { name: "Fort Aguada Sunrise", description: "17th-century Portuguese fort with panoramic sea views.", cost: "₹50" },
                { name: "Anjuna Flea Market", description: "Wednesday market with handicrafts, spices, and local goods.", cost: "Free entry" },
                { name: "Dudhsagar Waterfall Trek", description: "Majestic four-tiered waterfall at the Karnataka border.", cost: "₹400 jeep safari" },
            ],
            afternoon: [
                { name: "Spice Plantation Tour", description: "Guided tour through aromatic spice gardens with a traditional Goan lunch.", cost: "₹600–800 pp" },
                { name: "Dolphin Watching Cruise", description: "1.5-hour boat ride spotting playful dolphins in the Arabian Sea.", cost: "₹400–600 pp" },
                { name: "Colva Beach Water Sports", description: "Parasailing, jet skiing, and banana boat rides.", cost: "₹500–1500 pp" },
                { name: "Old Goa Heritage Walk", description: "Explore Se Cathedral, Church of St. Francis of Assisi, and Museum of Christian Art.", cost: "₹50–100" },
                { name: "Baga River Kayaking", description: "Peaceful kayaking through mangroves along Baga river.", cost: "₹800 pp" },
            ],
            evening: [
                { name: "Chapora Fort Sunset", description: "Famous 'Dil Chahta Hai' fort with breathtaking sunset views over Vagator.", cost: "Free" },
                { name: "Anjuna Night Market", description: "Wednesday night market with live music, food, and artisan stalls.", cost: "Free entry" },
                { name: "Casino Cruise", description: "Evening cruise on the Mandovi river with gaming and entertainment.", cost: "₹1500–3000 pp" },
                { name: "Tito's Lane Bar Hop", description: "Explore Goa's iconic nightlife strip in Baga.", cost: "₹500–1000 pp" },
                { name: "Panjim Fontainhas Walk", description: "Stroll through Goa's Latin Quarter with vibrant colonial houses lit at dusk.", cost: "Free" },
            ],
        },
        food: {
            breakfast: [
                { place: "Cafe Bhosale", description: "Famous for Goan poha, chai, and fresh coconut water.", cost: "₹100–200" },
                { place: "A Pastelaria", description: "Iconic bakery in Panjim with bebinca, croissants, and Goan sausage toast.", cost: "₹200–350" },
                { place: "Infantaria Bakery", description: "Beloved Calangute café, try their coconut pancakes and French toast.", cost: "₹250–400" },
            ],
            lunch: [
                { place: "Vinayak Family Restaurant", description: "Must-try Goan fish curry, prawn recheado, and sol kadi.", cost: "₹400–700 pp" },
                { place: "Martin's Corner", description: "Legendary Betalbatim restaurant famous for crab xec xec and prawn masala.", cost: "₹600–1000 pp" },
                { place: "Britto's Beach Shack", description: "Classic Baga beach shack with grilled seafood and cold beers.", cost: "₹500–900 pp" },
            ],
            dinner: [
                { place: "Thalassa Greek Restaurant", description: "Cliffside Greek-Goan fusion with stunning Vagator sunset views.", cost: "₹800–1400 pp" },
                { place: "Fisherman's Wharf", description: "Riverside dining with authentic Goan cuisine and live fado music.", cost: "₹700–1200 pp" },
                { place: "Gunpowder", description: "Acclaimed coastal Indian restaurant with Kerala and Goan specialties.", cost: "₹600–1000 pp" },
            ],
        },
        stays: {
            budget: [{ name: "Zostel Goa, Anjuna", type: "Hostel / Budget Stay", cost: "₹600–1200/night" }],
            standard: [{ name: "The Acacia Hotel & Spa", type: "3-Star Hotel", cost: "₹2500–4000/night" }],
            premium: [{ name: "W Goa, Vagator", type: "5-Star Resort", cost: "₹8000–15000/night" }],
            luxury: [{ name: "Taj Exotica Resort & Spa", type: "Luxury Resort", cost: "₹18000–35000/night" }],
        },
        tips: [
            "Book accommodations at least 2 months in advance for December–January peak season.",
            "Carry cash — many beach shacks and local vendors don't accept cards.",
            "Renting a scooter is the best way to explore; international licence not needed for 100cc bikes.",
            "Respect local customs — cover up when visiting churches and temples.",
            "Bargain at Anjuna Flea Market — start at 40% of the asking price.",
            "Avoid swimming during monsoon (June–September) due to strong currents.",
        ],
    },

    // ── KERALA ──
    kerala: {
        summary: "Kerala, God's Own Country, enchants with backwater cruises, misty hill stations, Ayurvedic retreats, and rich cultural traditions.",
        bestTimeToVisit: "September to March",
        localTransport: "KSRTC buses, auto-rickshaws, and houseboats for backwaters",
        activities: {
            morning: [
                { name: "Alleppey Houseboat Departure", description: "Begin a serene cruise through Kerala's iconic palm-fringed backwaters.", cost: "₹6000–15000/boat" },
                { name: "Munnar Tea Garden Walk", description: "Guided walk through rolling emerald tea estates at golden hour.", cost: "₹200–300" },
                { name: "Periyar Wildlife Sanctuary", description: "Morning boat safari spotting elephants, bison, and exotic birds.", cost: "₹600–1000 pp" },
                { name: "Fort Kochi Heritage Walk", description: "Explore Chinese fishing nets, Dutch Palace, and Jewish Synagogue.", cost: "Free–₹100" },
                { name: "Wayanad Edakkal Caves", description: "Ancient Neolithic cave with 6000-year-old rock engravings.", cost: "₹100" },
            ],
            afternoon: [
                { name: "Kathakali Performance", description: "Traditional Kerala dance drama with elaborate costumes and expressions.", cost: "₹250–500" },
                { name: "Kovalam Beach Relaxation", description: "Lie back on the crescent-shaped Lighthouse Beach with ayurvedic massage.", cost: "Free entry" },
                { name: "Spice Market Tour, Kochi", description: "Wander Mattancherry's centuries-old spice trading hub.", cost: "Free" },
                { name: "Elephant Encounter, Guruvayur", description: "Visit the famous Punnathur Kotta elephant sanctuary.", cost: "₹100–200" },
                { name: "Bamboo Rafting, Periyar", description: "Eco-tourism rafting through tiger reserve forests.", cost: "₹1500 pp" },
            ],
            evening: [
                { name: "Varkala Cliff Sunset", description: "Watch the Arabian Sea sunset from dramatic 15m red laterite cliffs.", cost: "Free" },
                { name: "Theyyam Ritual Performance", description: "Ancient ritualistic art form with fire and elaborate costumes.", cost: "Free–₹200" },
                { name: "Marine Drive Kochi Walk", description: "Promenade walk along Vembanad Lake with city lights reflecting on water.", cost: "Free" },
            ],
        },
        food: {
            breakfast: [
                { place: "Saravana Bhavan, Kochi", description: "Classic South Indian — appam with stew, idiyappam, puttu.", cost: "₹150–250" },
                { place: "Dhe Puttu", description: "Kerala's iconic puttu in 20+ varieties at this Thrissur favourite.", cost: "₹100–200" },
            ],
            lunch: [
                { place: "Paragon Restaurant, Kozhikode", description: "Legendary Malabar cuisine — Kozhikodan biryani, fish curry, pathiri.", cost: "₹300–600 pp" },
                { place: "Kayees Rahmathullah Hotel", description: "Famous for authentic Malabar mutton biryani.", cost: "₹250–400 pp" },
            ],
            dinner: [
                { place: "Fort House Restaurant, Kochi", description: "Waterfront dining with fresh Kerala seafood and coconut-based gravies.", cost: "₹600–1000 pp" },
                { place: "Malabar Junction", description: "Rooftop dining in Kochi's heritage district, superb prawn moilee.", cost: "₹700–1200 pp" },
            ],
        },
        stays: {
            budget: [{ name: "Zostel Kochi", type: "Backpacker Hostel", cost: "₹500–1000/night" }],
            standard: [{ name: "Hotel Abad Plaza, Kochi", type: "3-Star Hotel", cost: "₹2000–3500/night" }],
            premium: [{ name: "Brunton Boatyard, Kochi", type: "Heritage Hotel", cost: "₹8000–14000/night" }],
            luxury: [{ name: "Taj Malabar Resort & Spa", type: "5-Star Luxury", cost: "₹15000–28000/night" }],
        },
        tips: [
            "Book houseboats directly with operators in Alleppey to save 30–40% vs travel portals.",
            "Carry mosquito repellent for backwater cruises, especially at dusk.",
            "The best Ayurvedic treatments require 5–7 day minimum stays for full effect.",
            "Try the traditional Kerala sadya (banana leaf feast) on Onam or at any local hotel.",
            "Auto-rickshaws rarely use meters — always negotiate fare before boarding.",
        ],
    },

    // ── MANALI ──
    manali: {
        summary: "Manali is a Himalayan wonderland of snow-capped peaks, adventure sports, ancient temples, and the legendary Rohtang Pass.",
        bestTimeToVisit: "October to June (avoid July–August monsoon)",
        localTransport: "Hire a cab or take shared taxis for excursions. Local autos in town.",
        activities: {
            morning: [
                { name: "Solang Valley Snow Activities", description: "Skiing, snowboarding, and zorbing in a stunning glacial valley.", cost: "₹500–2000 pp" },
                { name: "Rohtang Pass Excursion", description: "Drive to the iconic 3978m pass with panoramic snow views (permit required).", cost: "₹550 permit + ₹1500 cab" },
                { name: "Hadimba Devi Temple", description: "15th-century wooden temple in a cedar forest, dedicated to goddess Hadimba.", cost: "Free" },
                { name: "Beas River Rafting", description: "Grade II–III white water rafting through scenic Himalayan gorges.", cost: "₹600–1200 pp" },
                { name: "Old Manali Village Walk", description: "Wander the charming lanes of Old Manali past apple orchards and cafes.", cost: "Free" },
            ],
            afternoon: [
                { name: "Kullu Paragliding", description: "Tandem paragliding over the Kullu Valley with Himalayan backdrop.", cost: "₹2500–3500 pp" },
                { name: "Naggar Castle Visit", description: "15th-century castle converted to heritage hotel with Valley views.", cost: "₹100" },
                { name: "Vashisht Hot Springs", description: "Ancient sulphur springs with natural healing properties.", cost: "Free" },
                { name: "Great Himalayan National Park", description: "UNESCO heritage trek through alpine meadows and forests.", cost: "₹200 entry" },
            ],
            evening: [
                { name: "Mall Road Sunset Stroll", description: "Shop for Kullu shawls, dried fruits, and local handicrafts.", cost: "Free" },
                { name: "Manu Temple Evening Aarti", description: "Sacred temple dedicated to sage Manu with mountain sunset backdrop.", cost: "Free" },
                { name: "Bonfire at Riverside Camp", description: "Many campsites offer evening bonfires with music and BBQ by the Beas.", cost: "₹300–500 pp" },
            ],
        },
        food: {
            breakfast: [
                { place: "Café 1947", description: "Old Manali's most famous café — banana pancakes, eggs, and apple crumble.", cost: "₹200–400" },
                { place: "Dylan's Toasted & Roasted", description: "Cozy Old Manali spot with filter coffee and apple pie.", cost: "₹150–300" },
            ],
            lunch: [
                { place: "Johnson's Café", description: "Legendary Manali institution with trout fish, pasta, and apple strudel.", cost: "₹400–800 pp" },
                { place: "Drifter's Inn", description: "Backpacker favourite with momos, thukpa, and wood-fired pizza.", cost: "₹300–600 pp" },
            ],
            dinner: [
                { place: "Chopsticks", description: "Top-rated Tibetan restaurant with authentic thukpa, gyuma, and butter tea.", cost: "₹400–700 pp" },
                { place: "Khatri Restaurant", description: "Local Himachali cuisine — siddu, madra, and trout curry.", cost: "₹350–600 pp" },
            ],
        },
        stays: {
            budget: [{ name: "The Hosteller Manali", type: "Backpacker Hostel", cost: "₹500–900/night" }],
            standard: [{ name: "Solang Valley Resort", type: "3-Star Hotel", cost: "₹2000–4000/night" }],
            premium: [{ name: "Span Resort & Spa", type: "Riverside Premium", cost: "₹7000–12000/night" }],
            luxury: [{ name: "Manuallaya Resort Spa", type: "Luxury Boutique", cost: "₹12000–22000/night" }],
        },
        tips: [
            "Rohtang Pass requires an online permit (rohtangpermits.nic.in) — book 2 days in advance.",
            "ATMs are unreliable in Manali; carry sufficient cash.",
            "Altitude sickness can affect some visitors — acclimatize for 1 day before adventure activities.",
            "Apple season (August–September) means fresh, cheap apples everywhere.",
            "Carry warm layers even in summer — temperatures drop sharply after sunset.",
        ],
    },

    // ── RAJASTHAN ──
    rajasthan: {
        summary: "Rajasthan, the Land of Kings, dazzles with majestic forts, opulent palaces, golden sand dunes, and vibrant folk culture.",
        bestTimeToVisit: "October to March",
        localTransport: "Auto-rickshaws, cycle rickshaws, and heritage horse carts (tongas)",
        activities: {
            morning: [
                { name: "Amber Fort Tour", description: "Elephant ride up to the stunning 16th-century amber fort overlooking Maota Lake.", cost: "₹200 entry + ₹900 elephant ride" },
                { name: "Mehrangarh Fort, Jodhpur", description: "India's mightiest fort towering 400ft above the Blue City.", cost: "₹600 (with audio guide)" },
                { name: "Jaisalmer Desert Safari", description: "Camel safari through Sam sand dunes at sunrise.", cost: "₹800–1500 pp" },
                { name: "City Palace, Udaipur", description: "Magnificent palace complex on the shores of Lake Pichola.", cost: "₹300" },
                { name: "Pushkar Ghats Morning Ritual", description: "Watch sacred morning puja at the holy Pushkar Lake ghats.", cost: "Free" },
            ],
            afternoon: [
                { name: "Ranthambore Tiger Safari", description: "Jeep safari in India's most famous tiger reserve.", cost: "₹1500–2500 pp" },
                { name: "Jantar Mantar, Jaipur", description: "UNESCO astronomical observatory with 19 instruments.", cost: "₹200" },
                { name: "Hawa Mahal Visit", description: "The iconic 'Palace of Winds' with 953 small windows.", cost: "₹200" },
                { name: "Blue Pottery Workshop", description: "Learn the ancient art of Jaipur's distinctive blue pottery.", cost: "₹500–1000" },
            ],
            evening: [
                { name: "Lake Pichola Sunset Boat Ride", description: "Golden hour cruise past the Lake Palace and Jag Mandir.", cost: "₹700 pp" },
                { name: "Chokhi Dhani Village Experience", description: "Authentic Rajasthani folk performances, camel rides, and thali dinner.", cost: "₹800–1200 pp" },
                { name: "Nahargarh Fort Sunset", description: "Best sunset panorama over Jaipur's Pink City.", cost: "₹200" },
            ],
        },
        food: {
            breakfast: [
                { place: "Rawat Mishthan Bhandar", description: "Legendary Jaipur joint for pyaaz kachori and mava kachori since 1963.", cost: "₹100–200" },
                { place: "Jodhpur Mishrilal Hotel", description: "Famous for the best makhania lassi in Rajasthan.", cost: "₹80–150" },
            ],
            lunch: [
                { place: "Laxmi Mishthan Bhandar (LMB)", description: "Jaipur's most celebrated vegetarian restaurant since 1954.", cost: "₹400–700 pp" },
                { place: "Indique, Jodhpur", description: "Rooftop restaurant with Mehrangarh views and authentic laal maas.", cost: "₹600–1000 pp" },
            ],
            dinner: [
                { place: "Ambrai Restaurant, Udaipur", description: "Waterfront lakeside dining with City Palace illuminated at night.", cost: "₹700–1200 pp" },
                { place: "1135 AD, Amber Fort", description: "Dine inside the fort with Mughal décor and royal Rajasthani cuisine.", cost: "₹1200–2000 pp" },
            ],
        },
        stays: {
            budget: [{ name: "Zostel Jaipur", type: "Hostel", cost: "₹600–1000/night" }],
            standard: [{ name: "Hotel Bissau Palace", type: "Heritage Hotel", cost: "₹2500–4500/night" }],
            premium: [{ name: "Samode Haveli, Jaipur", type: "Heritage Haveli", cost: "₹8000–14000/night" }],
            luxury: [{ name: "Rambagh Palace, Jaipur", type: "Palace Hotel", cost: "₹25000–60000/night" }],
        },
        tips: [
            "Composite tickets cover multiple monuments in Jaipur — great value at ₹300.",
            "Bargain hard in Johari Bazaar for gems and textiles — start at 50% of asking price.",
            "Avoid travelling during May–June — extreme heat (45°C+) makes sightseeing difficult.",
            "Book tiger safari permits online at ranthambhore.net well in advance.",
            "Carry a scarf — useful for dusty rides, temple visits, and cool evenings.",
        ],
    },

    // ── SHIMLA ──
    shimla: {
        summary: "Shimla, the Queen of Hills, charms with colonial architecture, toy train rides, apple orchards, and stunning Himalayan panoramas.",
        bestTimeToVisit: "March to June and October to December",
        localTransport: "Walk The Ridge and Mall Road. Hire taxis for excursions.",
        activities: {
            morning: [
                { name: "Jakhu Temple Trek", description: "3km trek to the 8048ft Jakhu Hill with Hanuman temple and Himalayan views.", cost: "Free" },
                { name: "Kufri Snow Activities", description: "Yak rides, skiing, and snowball fights at this popular hill resort.", cost: "₹500–1500 pp" },
                { name: "Toy Train Ride", description: "UNESCO heritage Kalka–Shimla railway through 103 tunnels.", cost: "₹50–300" },
                { name: "Christ Church Visit", description: "Second oldest church in North India with stunning neo-Gothic architecture.", cost: "Free" },
            ],
            afternoon: [
                { name: "Mall Road Shopping", description: "Browse Tibetan jewellery, wooden crafts, and Himachali caps.", cost: "Free entry" },
                { name: "Chail Palace Visit", description: "Former summer retreat of Maharaja of Patiala, now a heritage hotel.", cost: "₹100" },
                { name: "Wildflower Hall Trekking", description: "Scenic trails through cedar and rhododendron forests.", cost: "Free" },
            ],
            evening: [
                { name: "The Ridge Sunset", description: "Open space in the heart of Shimla with panoramic mountain views.", cost: "Free" },
                { name: "Gaiety Theatre Cultural Show", description: "Historic colonial theatre hosting Himachali folk performances.", cost: "₹200–500" },
            ],
        },
        food: {
            breakfast: [
                { place: "Wake & Bake Café", description: "Popular spot for eggs benedict, fresh juice, and mountain views.", cost: "₹200–350" },
                { place: "Baljees Restaurant", description: "Shimla institution since 1939 — try their cream rolls and hot chocolate.", cost: "₹150–300" },
            ],
            lunch: [
                { place: "Eighteen71 Cookhouse", description: "Multi-cuisine in a charming heritage building on the Mall.", cost: "₹400–700 pp" },
                { place: "Ashiana & Goofa", description: "Iconic HPTDC restaurant inside a cave on The Ridge.", cost: "₹350–600 pp" },
            ],
            dinner: [
                { place: "Oberoi Cecil Fine Dining", description: "Elegant colonial dining in Shimla's most storied luxury hotel.", cost: "₹1000–1800 pp" },
                { place: "Café Sol", description: "Cozy European-Himachali fusion with apple crumble and trout.", cost: "₹500–900 pp" },
            ],
        },
        stays: {
            budget: [{ name: "Snow Valley Resorts", type: "Budget Hotel", cost: "₹1200–2000/night" }],
            standard: [{ name: "Treehouse Cottage", type: "Boutique Stay", cost: "₹2500–4000/night" }],
            premium: [{ name: "Wildflower Hall, Mashobra", type: "Heritage Resort", cost: "₹10000–18000/night" }],
            luxury: [{ name: "The Oberoi Cecil", type: "5-Star Heritage", cost: "₹15000–25000/night" }],
        },
        tips: [
            "The Toy Train books up fast — reserve at least a week ahead on IRCTC.",
            "Carry woollens even in summer — evenings get cold at 2200m altitude.",
            "Visit Jakhu Temple early morning to avoid monkey crowds and heat.",
            "Apple orchards are open to visitors during harvest season (Aug–Oct) — many farms let you pick.",
        ],
    },

    // ── DELHI ──
    delhi: {
        summary: "Delhi, India's capital, is a thrilling collision of ancient empires and modern energy — from Mughal monuments to world-class food and shopping.",
        bestTimeToVisit: "October to March",
        localTransport: "Delhi Metro is the best way to travel. Ola/Uber for last-mile.",
        activities: {
            morning: [
                { name: "Qutub Minar", description: "UNESCO 73m minaret from 1193 AD surrounded by ancient ruins.", cost: "₹600 (foreigners ₹800)" },
                { name: "Red Fort", description: "Massive Mughal fort on the banks of Yamuna, symbol of India's sovereignty.", cost: "₹35" },
                { name: "Humayun's Tomb", description: "Inspiration for the Taj Mahal — stunning Mughal garden tomb.", cost: "₹600" },
                { name: "Lodi Garden Morning Walk", description: "Serene 90-acre garden with 15th-century tombs and walking paths.", cost: "Free" },
                { name: "Jama Masjid Visit", description: "India's largest mosque, built by Shah Jahan in 1656.", cost: "Free (camera ₹300)" },
            ],
            afternoon: [
                { name: "Chandni Chowk Food Tour", description: "Legendary Old Delhi lanes with parathe wali gali, jalebi, and kebabs.", cost: "₹300–600 for food" },
                { name: "National Museum", description: "India's premier museum spanning 5000 years of history and art.", cost: "₹20" },
                { name: "Lotus Temple", description: "Award-winning Bahá'í House of Worship shaped like a blooming lotus.", cost: "Free" },
                { name: "Dilli Haat Shopping", description: "Open-air crafts bazaar with artisans from all 29 Indian states.", cost: "₹30 entry" },
            ],
            evening: [
                { name: "India Gate Sunset", description: "Iconic war memorial best experienced at twilight when it's illuminated.", cost: "Free" },
                { name: "Hauz Khas Village", description: "Trendy enclave with ruins, rooftop bars, boutiques, and galleries.", cost: "Free entry" },
                { name: "Akshardham Evening Aarti", description: "Spectacular temple complex with boat ride and musical fountain show.", cost: "Free (show ₹200)" },
            ],
        },
        food: {
            breakfast: [
                { place: "Paranthe Wali Gali, Chandni Chowk", description: "Legendary Old Delhi lane serving 20+ stuffed parathas since 1875.", cost: "₹100–200" },
                { place: "Khan Chacha", description: "Delhi's most famous kebab roll — butter chicken roll and seekh paratha.", cost: "₹200–400" },
            ],
            lunch: [
                { place: "Karim's, Jama Masjid", description: "Legendary Mughal restaurant since 1913 — mutton burra and nihari.", cost: "₹400–700 pp" },
                { place: "Saravana Bhavan, Connaught Place", description: "Best South Indian thali and filter coffee in North India.", cost: "₹250–450 pp" },
            ],
            dinner: [
                { place: "Indian Accent", description: "Asia's Best Restaurant — modern Indian cuisine, reservation essential.", cost: "₹3000–5000 pp" },
                { place: "Bukhara, ITC Maurya", description: "Legendary dal bukhara and tandoori dishes loved by world leaders.", cost: "₹2500–4000 pp" },
            ],
        },
        stays: {
            budget: [{ name: "Zostel Delhi", type: "Backpacker Hostel", cost: "₹600–1000/night" }],
            standard: [{ name: "Bloom Hotel, Vasant Vihar", type: "Boutique Hotel", cost: "₹3000–5000/night" }],
            premium: [{ name: "The Lodhi, New Delhi", type: "5-Star Hotel", cost: "₹12000–20000/night" }],
            luxury: [{ name: "The Imperial New Delhi", type: "Heritage Luxury", cost: "₹18000–35000/night" }],
        },
        tips: [
            "Get a Metro Tourist Card for ₹100 deposit + unlimited 1-day (₹150) or 3-day (₹350) travel.",
            "Old Delhi is best explored on foot or by cycle rickshaw — cars get stuck in narrow lanes.",
            "Book Indian Accent and Bukhara weeks in advance — they fill up fast.",
            "Avoid Chandni Chowk on Mondays — most shops are closed.",
            "Use Uber/Ola instead of street autos to avoid overcharging as a tourist.",
        ],
    },

    // ── MUMBAI ──
    mumbai: {
        summary: "Mumbai, the City of Dreams, pulses with Bollywood glamour, colonial grandeur, street food wonders, and an infectious never-sleep energy.",
        bestTimeToVisit: "November to February",
        localTransport: "Local trains for long distances, autos for short hops. Uber/Ola available.",
        activities: {
            morning: [
                { name: "Gateway of India", description: "Iconic 1924 archway on the waterfront — best at sunrise before crowds.", cost: "Free" },
                { name: "Elephanta Caves", description: "UNESCO rock-cut Shiva temples on an island, 1-hour ferry from Gateway.", cost: "₹40 ferry + ₹600 caves" },
                { name: "Dharavi Slum Walk", description: "Eye-opening guided tour of Asia's largest slum and informal economy.", cost: "₹700–1200 pp" },
                { name: "Bandra Bandstand Morning Walk", description: "Scenic promenade with Bandra-Worli Sea Link views and Shah Rukh Khan's house.", cost: "Free" },
            ],
            afternoon: [
                { name: "Chhatrapati Shivaji Museum", description: "Mumbai's finest museum in a stunning Indo-Saracenic building.", cost: "₹650" },
                { name: "Bollywood Studio Tour", description: "Visit Film City or a production studio to see sets and the film process.", cost: "₹1000–2000 pp" },
                { name: "Juhu Beach", description: "Mumbai's favourite beach — great for bhelpuri, pav bhaji, and people watching.", cost: "Free" },
                { name: "Crawford Market Exploration", description: "British-era market designed by Lockwood Kipling with spices and local goods.", cost: "Free" },
            ],
            evening: [
                { name: "Marine Drive Sunset", description: "The Queen's Necklace at dusk — Mumbai's most romantic promenade.", cost: "Free" },
                { name: "Colaba Causeway Shopping", description: "Browse antiques, jewellery, and street fashion in Mumbai's hippest lane.", cost: "Free" },
                { name: "Worli Sea Face Night Walk", description: "Walk along the sea wall with the glittering sea link as backdrop.", cost: "Free" },
            ],
        },
        food: {
            breakfast: [
                { place: "Kyani & Co., Dhobi Talao", description: "Iconic Irani café since 1904 — bun maska, kheema, and cutting chai.", cost: "₹100–200" },
                { place: "Café Madras, Matunga", description: "Best South Indian breakfast in Mumbai — idli, medu vada, filter coffee.", cost: "₹150–300" },
            ],
            lunch: [
                { place: "Trishna, Fort", description: "Mumbai's most famous seafood — butter garlic crab and koliwada prawns.", cost: "₹800–1500 pp" },
                { place: "Britannia & Co., Ballard Estate", description: "Legendary Irani restaurant with berry pulao and caramel custard.", cost: "₹400–700 pp" },
            ],
            dinner: [
                { place: "Wasabi by Morimoto, Taj Mahal Palace", description: "World-class Japanese in Mumbai's most iconic hotel.", cost: "₹3000–5000 pp" },
                { place: "Peshwa, Prabhadevi", description: "Authentic Maharashtrian thali with sukka mutton and sol kadi.", cost: "₹500–900 pp" },
            ],
        },
        stays: {
            budget: [{ name: "The Backpacker Co.", type: "Hostel", cost: "₹700–1200/night" }],
            standard: [{ name: "Hotel Residency, Fort", type: "3-Star Hotel", cost: "₹2500–4500/night" }],
            premium: [{ name: "The Leela Mumbai", type: "5-Star Hotel", cost: "₹10000–18000/night" }],
            luxury: [{ name: "Taj Mahal Palace Hotel", type: "Iconic Luxury", cost: "₹20000–45000/night" }],
        },
        tips: [
            "Mumbai local trains are the lifeline — buy a day pass for ₹75 for unlimited travel.",
            "Street food is safe at popular spots — Juhu Beach bhelpuri and Bandra pav bhaji are must-tries.",
            "Auto-rickshaws only operate in the suburbs; yellow-black taxis ply South Mumbai.",
            "Monsoon (June–September) brings flooding — carry an umbrella and avoid low-lying areas.",
            "Book Elephanta Caves in the morning; last ferry back is at 5:30 PM.",
        ],
    },

    // ── DEFAULT fallback ──
    default: {
        summary: "An incredible destination awaiting your discovery — rich in culture, history, and natural beauty.",
        bestTimeToVisit: "October to March (pleasant weather across most of India)",
        localTransport: "Hire local taxis or use Ola/Uber for city travel",
        activities: {
            morning: [
                { name: "Local Heritage Site Visit", description: "Explore the region's most iconic historical monument at golden hour.", cost: "₹100–300" },
                { name: "Morning Nature Walk", description: "Guided walk through scenic local landscapes with a naturalist.", cost: "₹200–400" },
                { name: "Local Market Visit", description: "Explore the bustling morning market for fresh produce and local crafts.", cost: "Free" },
            ],
            afternoon: [
                { name: "Cultural Museum Tour", description: "Deep dive into the region's art, history, and traditions.", cost: "₹100–200" },
                { name: "Local Cooking Class", description: "Learn to cook 3 authentic regional dishes with a local chef.", cost: "₹800–1200 pp" },
                { name: "Adventure Activity", description: "Best adventure sport of the region — rafting, trekking, or paragliding.", cost: "₹800–2000 pp" },
            ],
            evening: [
                { name: "Sunset at Local Viewpoint", description: "Watch the sunset from the most celebrated viewpoint in the area.", cost: "Free–₹100" },
                { name: "Cultural Performance", description: "Attend a local folk dance or music performance.", cost: "₹200–500" },
                { name: "Heritage Walk", description: "Guided evening walk through the old town's lanes and architecture.", cost: "₹300–500" },
            ],
        },
        food: {
            breakfast: [
                { place: "Local Dhaba", description: "Start your day with authentic regional breakfast and masala chai.", cost: "₹100–200" },
            ],
            lunch: [
                { place: "Regional Thali Restaurant", description: "Full traditional thali with 10+ items showcasing local cuisine.", cost: "₹300–600 pp" },
            ],
            dinner: [
                { place: "Rooftop Restaurant", description: "Dinner with panoramic views and live regional folk music.", cost: "₹600–1200 pp" },
            ],
        },
        stays: {
            budget: [{ name: "Local Guesthouse / Hostel", type: "Budget Stay", cost: "₹600–1200/night" }],
            standard: [{ name: "3-Star Business Hotel", type: "Standard Hotel", cost: "₹2000–4000/night" }],
            premium: [{ name: "Heritage Boutique Resort", type: "Premium Stay", cost: "₹6000–12000/night" }],
            luxury: [{ name: "5-Star Luxury Resort", type: "Luxury Stay", cost: "₹15000–30000/night" }],
        },
        tips: [
            "Research local customs and dress codes before visiting religious sites.",
            "Carry cash — smaller towns have limited ATM availability.",
            "Book accommodations in advance during peak holiday seasons.",
            "Try at least one cooking class — it's the best way to understand local culture.",
            "Use Google Maps offline by downloading the region — saves data and works without signal.",
        ],
    },
};

// ── Budget cost multipliers ───────────────────────────────────
const BUDGET_CONFIG = {
    budget: { multiplier: 1, dailyCost: "₹2,000–3,500", totalLabel: "budget-friendly" },
    standard: { multiplier: 2.2, dailyCost: "₹3,500–7,000", totalLabel: "comfortable" },
    premium: { multiplier: 4.5, dailyCost: "₹7,000–15,000", totalLabel: "premium" },
    luxury: { multiplier: 9, dailyCost: "₹15,000–35,000", totalLabel: "luxury" },
};

// ── Trip type activity preferences ───────────────────────────
const TRIP_TYPE_WEIGHTS = {
    Adventure: { preferMorning: true, preferEvening: false, extraTip: "Check weather forecasts daily for outdoor activities." },
    Relaxation: { preferMorning: false, preferEvening: true, extraTip: "Don't over-schedule — leave room for spontaneous discoveries." },
    Cultural: { preferMorning: true, preferEvening: true, extraTip: "Hiring a local guide unlocks stories no guidebook captures." },
    Family: { preferMorning: true, preferEvening: false, extraTip: "Plan for extra breaks and keep afternoons lighter for kids." },
    Honeymoon: { preferMorning: false, preferEvening: true, extraTip: "Request couple decorations at your hotel in advance." },
    Solo: { preferMorning: true, preferEvening: true, extraTip: "Join hostel group tours — great way to meet fellow travellers." },
};

// ── Utility helpers ───────────────────────────────────────────
function pickRandom(arr, n = 1, seed = 0) {
    const shuffled = [...arr].sort((a, b) => {
        const h = (str) => str.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, seed);
        return h(JSON.stringify(a)) - h(JSON.stringify(b));
    });
    return n === 1 ? shuffled[0] : shuffled.slice(0, n);
}

function nightsCount(checkin, checkout) {
    const d = Math.round((new Date(checkout) - new Date(checkin)) / 86_400_000);
    return Math.max(d, 1);
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
}

function estimateTotalCost(nights, travelers, budget) {
    const cfg = BUDGET_CONFIG[budget] || BUDGET_CONFIG.standard;
    const [lo, hi] = cfg.dailyCost.replace(/₹|,/g, '').split('–').map(Number);
    const totalLo = (lo * nights * travelers).toLocaleString('en-IN');
    const totalHi = (hi * nights * travelers).toLocaleString('en-IN');
    return `₹${totalLo} – ₹${totalHi} (${cfg.totalLabel})`;
}

function getDayTitle(dayNum, nights, tripType) {
    if (dayNum === 1) return 'Arrival & First Impressions';
    if (dayNum === nights) return 'Final Day & Departure';
    const midTitles = {
        Adventure: ['Into the Wild', 'Peak Experiences', 'Thrills & Spills', 'Explore & Conquer'],
        Relaxation: ['Slow Morning, Gentle Day', 'Rest & Recharge', 'Unwind & Discover'],
        Cultural: ['Deep Dive into Heritage', 'Art & Traditions', 'Local Life & Stories'],
        Family: ['Fun for Everyone', 'Family Adventures', 'Create Memories'],
        Honeymoon: ['Romance & Discovery', 'Just the Two of You', 'Golden Moments'],
        Solo: ['Your Pace, Your Way', 'Off the Beaten Path', 'New Faces, New Places'],
    };
    const titles = midTitles[tripType] || midTitles.Cultural;
    return titles[(dayNum - 2) % titles.length];
}

// ── Core generator ────────────────────────────────────────────
export function generateItinerary({ destination, area, checkin, checkout, travelers, tripType, budget }) {
    // Normalise destination key
    const key = destination.toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^a-z]/g, '');

    // Find matching destination data
    const destKey = Object.keys(DESTINATIONS).find(k => key.includes(k) || k.includes(key)) || 'default';
    const dest = DESTINATIONS[destKey];
    const nights = nightsCount(checkin, checkout);
    const cfg = BUDGET_CONFIG[budget] || BUDGET_CONFIG.standard;
    const ttw = TRIP_TYPE_WEIGHTS[tripType] || TRIP_TYPE_WEIGHTS.Cultural;

    // Determine area label
    const areaLabel = area
        ? area
        : (dest.areas?.[key.includes('north') ? 'north' : key.includes('south') ? 'south' : 'default']?.label || destination);

    // Build days
    const days = [];
    const seed = destination.length + travelers + nights;

    for (let d = 1; d <= nights; d++) {
        const daySeed = seed + d * 7;
        const morning = pickRandom(dest.activities.morning, 1, daySeed);
        const afternoon = pickRandom(dest.activities.afternoon, 1, daySeed + 3);
        const evening = pickRandom(dest.activities.evening, 1, daySeed + 6);
        const brekkie = pickRandom(dest.food.breakfast, 1, daySeed + 1);
        const lunch = pickRandom(dest.food.lunch, 1, daySeed + 2);
        const dinner = pickRandom(dest.food.dinner, 1, daySeed + 5);
        const stay = dest.stays[budget]?.[0] || dest.stays.standard[0];

        days.push({
            day: d,
            title: getDayTitle(d, nights, tripType),
            activities: [
                { time: '8:00 AM', ...morning },
                { time: '1:00 PM', ...afternoon },
                { time: '6:00 PM', ...evening },
            ],
            food: [
                { meal: 'Breakfast', place: brekkie.place, description: brekkie.description, cost: brekkie.cost },
                { meal: 'Lunch', place: lunch.place, description: lunch.description, cost: lunch.cost },
                { meal: 'Dinner', place: dinner.place, description: dinner.description, cost: dinner.cost },
            ],
            stay: d < nights ? { name: stay.name, type: stay.type, cost: stay.cost } : null,
            dayCostEstimate: `${cfg.dailyCost}/person`,
        });
    }

    // Build tips
    const tips = [
        ...dest.tips.slice(0, 4),
        ttw.extraTip,
        `Best for ${tripType.toLowerCase()} trips: ${dest.bestTimeToVisit}.`,
    ];

    return {
        destination,
        area: areaLabel,
        checkin: formatDate(checkin),
        checkout: formatDate(checkout),
        nights,
        travelers,
        tripType,
        budget,
        summary: dest.summary,
        totalCostEstimate: estimateTotalCost(nights, travelers, budget),
        bestTimeToVisit: dest.bestTimeToVisit,
        localTransport: dest.localTransport,
        days,
        tips,
    };
}