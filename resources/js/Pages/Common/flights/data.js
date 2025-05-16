// Central data store for the flight application

// Popular destinations data
export const destinations = [
  {
    id: 1,
    name: "New Delhi",
    code: "DEL",
    region: "India",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2074&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Mumbai",
    code: "BOM",
    region: "India",
    image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=2074&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Bangalore",
    code: "BLR",
    region: "India",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=2074&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Chennai",
    code: "MAA",
    region: "India",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2074&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Hyderabad",
    code: "HYD",
    region: "India",
    image: "https://images.unsplash.com/photo-1581852057106-0c8a5db61b92?q=80&w=2074&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Kolkata",
    code: "CCU",
    region: "India",
    image: "https://images.unsplash.com/photo-1599661046646-8971033f01c6?q=80&w=2074&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "Dubai",
    code: "DXB",
    region: "UAE",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2074&auto=format&fit=crop",
  },
  {
    id: 8,
    name: "Singapore",
    code: "SIN",
    region: "Singapore",
    image: "https://images.unsplash.com/photo-1525625293386-38f0e1d2b5e5?q=80&w=2074&auto=format&fit=crop",
  }
];

// International and domestic destinations
export const allDestinations = [
  // Domestic - India
  { id: 1, name: "New Delhi", code: "DEL", country: "India", type: "domestic" },
  { id: 2, name: "Mumbai", code: "BOM", country: "India", type: "domestic" },
  { id: 3, name: "Bangalore", code: "BLR", country: "India", type: "domestic" },
  { id: 4, name: "Chennai", code: "MAA", country: "India", type: "domestic" },
  { id: 5, name: "Kolkata", code: "CCU", country: "India", type: "domestic" },
  { id: 6, name: "Hyderabad", code: "HYD", country: "India", type: "domestic" },
  { id: 7, name: "Ahmedabad", code: "AMD", country: "India", type: "domestic" },
  { id: 8, name: "Goa", code: "GOI", country: "India", type: "domestic" },
  { id: 9, name: "Jaipur", code: "JAI", country: "India", type: "domestic" },
  { id: 10, name: "Lucknow", code: "LKO", country: "India", type: "domestic" },
  { id: 11, name: "Pune", code: "PNQ", country: "India", type: "domestic" },
  { id: 12, name: "Kochi", code: "COK", country: "India", type: "domestic" },
  { id: 13, name: "Thiruvananthapuram", code: "TRV", country: "India", type: "domestic" },
  { id: 14, name: "Guwahati", code: "GAU", country: "India", type: "domestic" },
  { id: 15, name: "Varanasi", code: "VNS", country: "India", type: "domestic" },
  { id: 16, name: "Amritsar", code: "ATQ", country: "India", type: "domestic" },
  { id: 17, name: "Bhopal", code: "BHO", country: "India", type: "domestic" },
  { id: 18, name: "Indore", code: "IDR", country: "India", type: "domestic" },
  { id: 19, name: "Patna", code: "PAT", country: "India", type: "domestic" },
  { id: 20, name: "Bhubaneswar", code: "BBI", country: "India", type: "domestic" },
  { id: 21, name: "Nagpur", code: "NAG", country: "India", type: "domestic" },
  { id: 22, name: "Vadodara", code: "BDQ", country: "India", type: "domestic" },
  { id: 23, name: "Surat", code: "STV", country: "India", type: "domestic" },
  { id: 24, name: "Visakhapatnam", code: "VTZ", country: "India", type: "domestic" },
  { id: 25, name: "Coimbatore", code: "CJB", country: "India", type: "domestic" },
  { id: 26, name: "Mangalore", code: "IXE", country: "India", type: "domestic" },
  { id: 27, name: "Madurai", code: "IXM", country: "India", type: "domestic" },
  { id: 28, name: "Tiruchirappalli", code: "TRZ", country: "India", type: "domestic" },
  { id: 29, name: "Dehradun", code: "DED", country: "India", type: "domestic" },
  { id: 30, name: "Srinagar", code: "SXR", country: "India", type: "domestic" },
  { id: 31, name: "Chandigarh", code: "IXC", country: "India", type: "domestic" },
  { id: 32, name: "Aurangabad", code: "IXU", country: "India", type: "domestic" },
  { id: 33, name: "Jammu", code: "IXJ", country: "India", type: "domestic" },
  { id: 34, name: "Ranchi", code: "IXR", country: "India", type: "domestic" },
  { id: 35, name: "Bagdogra", code: "IXB", country: "India", type: "domestic" },
  { id: 36, name: "Port Blair", code: "IXZ", country: "India", type: "domestic" },
  { id: 37, name: "Agartala", code: "IXA", country: "India", type: "domestic" },
  { id: 38, name: "Allahabad", code: "IXD", country: "India", type: "domestic" },
  { id: 39, name: "Belgaum", code: "IXG", country: "India", type: "domestic" },
  { id: 40, name: "Kailashahar", code: "IXH", country: "India", type: "domestic" },
  { id: 41, name: "Lilabari", code: "IXI", country: "India", type: "domestic" },
  { id: 42, name: "Keshod", code: "IXK", country: "India", type: "domestic" },
  { id: 43, name: "Leh", code: "IXL", country: "India", type: "domestic" },
  { id: 44, name: "Khowai", code: "IXN", country: "India", type: "domestic" },
  { id: 45, name: "Pathankot", code: "IXP", country: "India", type: "domestic" },
  { id: 46, name: "Kamalpur", code: "IXQ", country: "India", type: "domestic" },
  { id: 47, name: "Silchar", code: "IXS", country: "India", type: "domestic" },
  { id: 48, name: "Pasighat", code: "IXT", country: "India", type: "domestic" },
  { id: 49, name: "Along", code: "IXV", country: "India", type: "domestic" },
  { id: 50, name: "Jamshedpur", code: "IXW", country: "India", type: "domestic" },
  { id: 51, name: "Kandla", code: "IXY", country: "India", type: "domestic" },

  // United States
  { id: 52, name: "New York", code: "JFK", country: "United States", type: "international" },
  { id: 53, name: "Los Angeles", code: "LAX", country: "United States", type: "international" },
  { id: 54, name: "Chicago", code: "ORD", country: "United States", type: "international" },
  { id: 55, name: "San Francisco", code: "SFO", country: "United States", type: "international" },
  { id: 56, name: "Miami", code: "MIA", country: "United States", type: "international" },
  { id: 57, name: "Dallas", code: "DFW", country: "United States", type: "international" },
  { id: 58, name: "Boston", code: "BOS", country: "United States", type: "international" },
  { id: 59, name: "Seattle", code: "SEA", country: "United States", type: "international" },
  { id: 60, name: "Washington DC", code: "IAD", country: "United States", type: "international" },
  { id: 61, name: "Atlanta", code: "ATL", country: "United States", type: "international" },
  { id: 62, name: "Houston", code: "IAH", country: "United States", type: "international" },
  { id: 63, name: "Las Vegas", code: "LAS", country: "United States", type: "international" },
  { id: 64, name: "Orlando", code: "MCO", country: "United States", type: "international" },
  { id: 65, name: "Denver", code: "DEN", country: "United States", type: "international" },
  { id: 66, name: "Philadelphia", code: "PHL", country: "United States", type: "international" },
  { id: 67, name: "Newark", code: "EWR", country: "United States", type: "international" },
  { id: 68, name: "Detroit", code: "DTW", country: "United States", type: "international" },
  { id: 69, name: "Minneapolis", code: "MSP", country: "United States", type: "international" },
  { id: 70, name: "Charlotte", code: "CLT", country: "United States", type: "international" },
  { id: 71, name: "Phoenix", code: "PHX", country: "United States", type: "international" },
  { id: 72, name: "Salt Lake City", code: "SLC", country: "United States", type: "international" },
  { id: 73, name: "Baltimore", code: "BWI", country: "United States", type: "international" },
  { id: 74, name: "San Diego", code: "SAN", country: "United States", type: "international" },
  { id: 75, name: "Tampa", code: "TPA", country: "United States", type: "international" },
  { id: 76, name: "Portland", code: "PDX", country: "United States", type: "international" },
  { id: 77, name: "Honolulu", code: "HNL", country: "United States", type: "international" },
  { id: 78, name: "Austin", code: "AUS", country: "United States", type: "international" },
  { id: 79, name: "Nashville", code: "BNA", country: "United States", type: "international" },
  { id: 80, name: "New Orleans", code: "MSY", country: "United States", type: "international" },
  { id: 81, name: "Pittsburgh", code: "PIT", country: "United States", type: "international" },

  // United Kingdom
  { id: 82, name: "London", code: "LHR", country: "United Kingdom", type: "international" },
  { id: 83, name: "Manchester", code: "MAN", country: "United Kingdom", type: "international" },
  { id: 84, name: "Birmingham", code: "BHX", country: "United Kingdom", type: "international" },
  { id: 85, name: "Glasgow", code: "GLA", country: "United Kingdom", type: "international" },
  { id: 86, name: "Edinburgh", code: "EDI", country: "United Kingdom", type: "international" },
  { id: 87, name: "Bristol", code: "BRS", country: "United Kingdom", type: "international" },
  { id: 88, name: "Newcastle", code: "NCL", country: "United Kingdom", type: "international" },
  { id: 89, name: "Liverpool", code: "LPL", country: "United Kingdom", type: "international" },
  { id: 90, name: "Leeds", code: "LBA", country: "United Kingdom", type: "international" },
  { id: 91, name: "Belfast", code: "BFS", country: "United Kingdom", type: "international" },
  { id: 92, name: "London Luton", code: "LTN", country: "United Kingdom", type: "international" },
  { id: 93, name: "London Stansted", code: "STN", country: "United Kingdom", type: "international" },
  { id: 94, name: "London Gatwick", code: "LGW", country: "United Kingdom", type: "international" },
  { id: 95, name: "London City", code: "LCY", country: "United Kingdom", type: "international" },
  { id: 96, name: "East Midlands", code: "EMA", country: "United Kingdom", type: "international" },
  { id: 97, name: "Southampton", code: "SOU", country: "United Kingdom", type: "international" },
  { id: 98, name: "Aberdeen", code: "ABZ", country: "United Kingdom", type: "international" },
  { id: 99, name: "Belfast City", code: "BHD", country: "United Kingdom", type: "international" },
  { id: 100, name: "Cardiff", code: "CWL", country: "United Kingdom", type: "international" },
  { id: 101, name: "Doncaster", code: "DSA", country: "United Kingdom", type: "international" },
  { id: 102, name: "Exeter", code: "EXT", country: "United Kingdom", type: "international" },
  { id: 103, name: "Humberside", code: "HUY", country: "United Kingdom", type: "international" },
  { id: 104, name: "Inverness", code: "INV", country: "United Kingdom", type: "international" },
  { id: 105, name: "Norwich", code: "NWI", country: "United Kingdom", type: "international" },
  { id: 106, name: "Durham", code: "MME", country: "United Kingdom", type: "international" },

  // Middle East
  { id: 107, name: "Dubai", code: "DXB", country: "UAE", type: "international" },
  { id: 108, name: "Abu Dhabi", code: "AUH", country: "UAE", type: "international" },
  { id: 109, name: "Doha", code: "DOH", country: "Qatar", type: "international" },
  { id: 110, name: "Riyadh", code: "RUH", country: "Saudi Arabia", type: "international" },
  { id: 111, name: "Jeddah", code: "JED", country: "Saudi Arabia", type: "international" },
  { id: 112, name: "Muscat", code: "MCT", country: "Oman", type: "international" },
  { id: 113, name: "Kuwait", code: "KWI", country: "Kuwait", type: "international" },
  { id: 114, name: "Bahrain", code: "BAH", country: "Bahrain", type: "international" },
  { id: 115, name: "Beirut", code: "BEY", country: "Lebanon", type: "international" },
  { id: 116, name: "Amman", code: "AMM", country: "Jordan", type: "international" },

  // Asia Pacific
  { id: 117, name: "Singapore", code: "SIN", country: "Singapore", type: "international" },
  { id: 118, name: "Bangkok", code: "BKK", country: "Thailand", type: "international" },
  { id: 119, name: "Hong Kong", code: "HKG", country: "Hong Kong", type: "international" },
  { id: 120, name: "Tokyo", code: "HND", country: "Japan", type: "international" },
  { id: 121, name: "Seoul", code: "ICN", country: "South Korea", type: "international" },
  { id: 122, name: "Shanghai", code: "PVG", country: "China", type: "international" },
  { id: 123, name: "Beijing", code: "PEK", country: "China", type: "international" },
  { id: 124, name: "Sydney", code: "SYD", country: "Australia", type: "international" },
  { id: 125, name: "Melbourne", code: "MEL", country: "Australia", type: "international" },
  { id: 126, name: "Auckland", code: "AKL", country: "New Zealand", type: "international" },
  { id: 127, name: "Kuala Lumpur", code: "KUL", country: "Malaysia", type: "international" },
  { id: 128, name: "Jakarta", code: "CGK", country: "Indonesia", type: "international" },
  { id: 129, name: "Manila", code: "MNL", country: "Philippines", type: "international" },
  { id: 130, name: "Ho Chi Minh City", code: "SGN", country: "Vietnam", type: "international" },
  { id: 131, name: "Hanoi", code: "HAN", country: "Vietnam", type: "international" },
  { id: 132, name: "Taipei", code: "TPE", country: "Taiwan", type: "international" },
  { id: 133, name: "Osaka", code: "KIX", country: "Japan", type: "international" },
  { id: 134, name: "Nagoya", code: "NGO", country: "Japan", type: "international" },
  { id: 135, name: "Fukuoka", code: "FUK", country: "Japan", type: "international" },
  { id: 136, name: "Sapporo", code: "CTS", country: "Japan", type: "international" },

  // Europe
  { id: 137, name: "Paris", code: "CDG", country: "France", type: "international" },
  { id: 138, name: "Frankfurt", code: "FRA", country: "Germany", type: "international" },
  { id: 139, name: "Amsterdam", code: "AMS", country: "Netherlands", type: "international" },
  { id: 140, name: "Rome", code: "FCO", country: "Italy", type: "international" },
  { id: 141, name: "Madrid", code: "MAD", country: "Spain", type: "international" },
  { id: 142, name: "Istanbul", code: "IST", country: "Turkey", type: "international" },
  { id: 143, name: "Munich", code: "MUC", country: "Germany", type: "international" },
  { id: 144, name: "Zurich", code: "ZRH", country: "Switzerland", type: "international" },
  { id: 145, name: "Vienna", code: "VIE", country: "Austria", type: "international" },
  { id: 146, name: "Brussels", code: "BRU", country: "Belgium", type: "international" },
  { id: 147, name: "Copenhagen", code: "CPH", country: "Denmark", type: "international" },
  { id: 148, name: "Stockholm", code: "ARN", country: "Sweden", type: "international" },
  { id: 149, name: "Oslo", code: "OSL", country: "Norway", type: "international" },
  { id: 150, name: "Helsinki", code: "HEL", country: "Finland", type: "international" },
  { id: 151, name: "Dublin", code: "DUB", country: "Ireland", type: "international" },
  { id: 152, name: "Lisbon", code: "LIS", country: "Portugal", type: "international" },
  { id: 153, name: "Barcelona", code: "BCN", country: "Spain", type: "international" },
  { id: 154, name: "Milan", code: "MXP", country: "Italy", type: "international" },
  { id: 155, name: "Venice", code: "VCE", country: "Italy", type: "international" },
  { id: 156, name: "Prague", code: "PRG", country: "Czech Republic", type: "international" },
  { id: 157, name: "Budapest", code: "BUD", country: "Hungary", type: "international" },
  { id: 158, name: "Warsaw", code: "WAW", country: "Poland", type: "international" },
  { id: 159, name: "Athens", code: "ATH", country: "Greece", type: "international" },
  { id: 160, name: "Geneva", code: "GVA", country: "Switzerland", type: "international" },
  { id: 161, name: "Lyon", code: "LYS", country: "France", type: "international" },
  { id: 162, name: "Nice", code: "NCE", country: "France", type: "international" },
  { id: 163, name: "Berlin", code: "BER", country: "Germany", type: "international" },
  { id: 164, name: "Hamburg", code: "HAM", country: "Germany", type: "international" },
  { id: 165, name: "Cologne", code: "CGN", country: "Germany", type: "international" },
  { id: 166, name: "Düsseldorf", code: "DUS", country: "Germany", type: "international" }
];

// Detailed airline information
export const airlines = [
  { id: 1, name: "IndiGo", code: "IGO", logo: "indigo.png", alliance: "None" },
  { id: 2, name: "Air India", code: "AIC", logo: "airindia.png", alliance: "Star Alliance" },
  { id: 3, name: "SpiceJet", code: "SJT", logo: "spicejet.png", alliance: "None" },
  { id: 4, name: "GoAir", code: "GAI", logo: "goair.png", alliance: "None" },
  { id: 5, name: "Vistara", code: "VTI", logo: "vistara.png", alliance: "None" },
  { id: 6, name: "AirAsia India", code: "IAD", logo: "airasia.png", alliance: "None" },
  { id: 7, name: "Emirates", code: "UAE", logo: "emirates.png", alliance: "None" },
  { id: 8, name: "Lufthansa", code: "DLH", logo: "lufthansa.png", alliance: "Star Alliance" },
  { id: 9, name: "British Airways", code: "BAW", logo: "britishairways.png", alliance: "Oneworld" },
  { id: 10, name: "Singapore Airlines", code: "SIA", logo: "singaporeairlines.png", alliance: "Star Alliance" },
  { id: 11, name: "Qatar Airways", code: "QTR", logo: "qatarairways.png", alliance: "Oneworld" },
  { id: 12, name: "Etihad Airways", code: "ETD", logo: "etihadairways.png", alliance: "None" },
];

// Aircraft types
export const aircraftTypes = [
  { model: "Boeing 737-800", capacity: 189, range: 5765 },
  { model: "Airbus A320", capacity: 180, range: 6100 },
  { model: "Boeing 777-300ER", capacity: 396, range: 13650 },
  { model: "Airbus A380", capacity: 525, range: 15000 },
  { model: "Boeing 787-9 Dreamliner", capacity: 296, range: 14140 },
  { model: "Airbus A350-900", capacity: 325, range: 15000 },
];

// Cabin classes
export const cabinClasses = [
  { name: "Economy", code: "Y", features: ["Standard seat", "Complimentary meal", "In-flight entertainment"] },
  { name: "Premium Economy", code: "W", features: ["Extra legroom", "Premium meal", "Priority boarding", "Enhanced entertainment"] },
  { name: "Business", code: "C", features: ["Lie-flat seats", "Gourmet dining", "Lounge access", "Priority check-in", "Premium amenity kit"] },
  { name: "First", code: "F", features: ["Private suite", "Exclusive lounge", "Personalized service", "Fine dining", "Luxury amenities"] },
];

export const cheapFlightsBySource = {
  "New Delhi": [
    {
      id: 1,
      destination: "Bathinda",
      region: "Punjab",
      price: "₹1,260",
      date: "Wed, 05 Feb",
      image: "https://images.unsplash.com/photo-1606210122158-eeb10e0823bf?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 2,
      destination: "Jaipur",
      region: "Rajasthan",
      price: "₹2,367",
      date: "Sat, 28 Dec",
      image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 3,
      destination: "Leh",
      region: "Ladakh",
      price: "₹2,748",
      date: "Thu, 02 Jan",
      image: "https://images.unsplash.com/photo-1589793907316-f94025b46888?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 4,
      destination: "Chandigarh",
      region: "Chandigarh",
      price: "₹2,899",
      date: "Wed, 01 Jan",
      image: "https://images.unsplash.com/photo-1598194809745-f5c29365bda8?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 5,
      destination: "Srinagar",
      region: "Jammu & Kashmir",
      price: "₹3,349",
      date: "Fri, 08 Dec",
      image: "https://images.unsplash.com/photo-1599661046646-8971033f01c6?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 6,
      destination: "Goa",
      region: "Goa",
      price: "₹4,229",
      date: "Sat, 15 Mar",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 7,
      destination: "Mumbai",
      region: "Maharashtra",
      price: "₹4,369",
      date: "Mon, 12 Feb",
      image: "https://images.unsplash.com/photo-1529253355930-ddbe423a2ac7?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 8,
      destination: "Bangalore",
      region: "Karnataka",
      price: "₹4,700",
      date: "Thu, 04 Apr",
      image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1200&auto=format&fit=crop",
    },
  ],
  "Mumbai": [
    {
      id: 9,
      destination: "Goa",
      region: "Goa",
      price: "₹1,499",
      date: "Mon, 15 Jan",
      image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 10,
      destination: "Ahmedabad",
      region: "Gujarat",
      price: "₹1,869",
      date: "Tue, 09 Feb",
      image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 11,
      destination: "Udaipur",
      region: "Rajasthan",
      price: "₹2,200",
      date: "Wed, 22 Mar",
      image: "https://images.unsplash.com/photo-1612810806563-4cb8c8a0da2f?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: 12,
      destination: "New Delhi",
      region: "Delhi",
      price: "₹2,599",
      date: "Fri, 19 Feb",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1200&auto=format&fit=crop",
    },
  ],
  "Kolkata": [
    {
      id: 17,
      destination: "Guwahati",
      region: "Assam",
      price: "₹1,799",
      date: "Thu, 28 Jan",
      image: "https://images.unsplash.com/photo-1627894483216-2138af692e32?q=80&w=1200&auto=format&fit=crop",
    }
  ]
};

// Maintain backward compatibility with cheapFlights
export const cheapFlights = cheapFlightsBySource["New Delhi"];

// Source cities for the flight search
export const sourceCities = [
  "New Delhi",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Hyderabad",
  "Ahmedabad",
  "Goa",
  "Jaipur",
  "Lucknow",
];

// Special fares categories
export const specialFares = [
  { id: 1, label: "Student", discount: "10%" },
  { id: 2, label: "Senior Citizen", discount: "12%" },
  { id: 3, label: "Armed Forces", discount: "15%" },
  { id: 4, label: "Healthcare Worker", discount: "8%" },
  { id: 5, label: "Family", discount: "5%" },
];

// Default search data for flights
export const defaultSearchData = {
  from: "",
  to: "",
  departDate: "",
  returnDate: "",
  tripType: "oneWay",
  travelers: "1",
  class: "Economy"
};

// Flight amenities
export const flightAmenities = {
  entertainment: ["Movies", "TV Shows", "Music", "Games"],
  food: ["Vegetarian", "Non-Vegetarian", "Vegan", "Kosher", "Halal"],
  connectivity: ["Wi-Fi", "USB Port", "Power Outlet"],
  comfort: ["Extra Legroom", "Reclining Seats", "Neck Pillow", "Blanket"]
};

// Popular flight routes with their average prices
export const popularRoutes = [
  { from: "New Delhi", to: "Mumbai", avgPrice: "₹4,369" },
  { from: "Mumbai", to: "Bangalore", avgPrice: "₹3,200" },
  { from: "New Delhi", to: "Bangalore", avgPrice: "₹4,700" },
  { from: "New Delhi", to: "Goa", avgPrice: "₹4,229" },
  { from: "Mumbai", to: "Goa", avgPrice: "₹1,499" },
  { from: "New Delhi", to: "Dubai", avgPrice: "₹12,500" },
  { from: "Mumbai", to: "London", avgPrice: "₹45,750" },
  { from: "New Delhi", to: "Singapore", avgPrice: "₹19,200" },
  { from: "Mumbai", to: "New York", avgPrice: "₹75,800" },
];

// Payment methods accepted
export const paymentMethods = [
  { name: "Credit Card", fee: "0%" },
  { name: "Debit Card", fee: "0%" },
  { name: "NetBanking", fee: "0%" },
  { name: "UPI", fee: "0%" },
  { name: "EMI", fee: "Standard bank charges apply" },
  { name: "Wallet", fee: "0%" },
];

export const flightBookingData = {
  bookings: [
    {
      bookingId: "BK789012",
      bookingDate: "2024-07-15T12:00:00Z",
      status: "Confirmed",
      passengers: [
        {
          id: 1,
          name: "John Smith",
          age: 35,
          gender: "Male",
          seatNumber: "12A"
        },
        {
          id: 2,
          name: "Emma Smith",
          age: 30,
          gender: "Female",
          seatNumber: "12B"
        }
      ],
      flight: {
        flightNumber: "AI101",
        airline: "Air India",
        departureCity: "Mumbai",
        arrivalCity: "Delhi",
        departureTime: "2024-08-10T10:00:00Z",
        arrivalTime: "2024-08-10T12:30:00Z",
        duration: "2h 30m",
        aircraft: "Boeing 787",
        terminal: "T2",
        gate: "G12"
      },
      payment: {
        amount: 12500,
        currency: "INR",
        method: "Credit Card",
        status: "Paid"
      }
    },
    {
      bookingId: "BK123456",
      bookingDate: "2024-06-20T09:30:00Z",
      status: "Confirmed",
      passengers: [
        {
          id: 1,
          name: "Raj Sharma",
          age: 28,
          gender: "Male",
          seatNumber: "18F"
        }
      ],
      flight: {
        flightNumber: "IGO244",
        airline: "IndiGo",
        departureCity: "Bangalore",
        arrivalCity: "Kolkata",
        departureTime: "2024-07-25T16:15:00Z",
        arrivalTime: "2024-07-25T18:45:00Z",
        duration: "2h 30m",
        aircraft: "Airbus A320",
        terminal: "T1",
        gate: "G07"
      },
      payment: {
        amount: 5800,
        currency: "INR",
        method: "UPI",
        status: "Paid"
      }
    }
  ],
  internationalBookings: [
    {
      bookingId: "BK567890",
      bookingDate: "2024-08-10T14:30:00Z",
      status: "Confirmed",
      passengers: [
        {
          id: 1,
          name: "Priya Patel",
          age: 32,
          gender: "Female",
          seatNumber: "23K",
          passport: "J8745692",
          visaDetails: {
            country: "United States",
            type: "B2",
            expiryDate: "2026-05-15"
          }
        },
        {
          id: 2,
          name: "Vikram Patel",
          age: 35,
          gender: "Male",
          seatNumber: "23J",
          passport: "M1234587",
          visaDetails: {
            country: "United States",
            type: "B2",
            expiryDate: "2026-05-15"
          }
        }
      ],
      flight: {
        flightNumber: "AI101",
        airline: "Air India",
        departureCity: "New Delhi",
        arrivalCity: "New York",
        departureTime: "2024-09-15T01:30:00Z",
        arrivalTime: "2024-09-15T18:45:00Z",
        duration: "16h 15m",
        aircraft: "Boeing 777-300ER",
        terminal: "T3",
        gate: "G15",
        class: "Business",
        layovers: [
          {
            airport: "London Heathrow",
            duration: "2h 30m"
          }
        ]
      },
      payment: {
        amount: 185000,
        currency: "INR",
        method: "Credit Card",
        status: "Paid"
      },
      additionalServices: {
        meal: "Asian Vegetarian",
        extraBaggage: "1 piece (23kg)",
        insurance: true,
        airportPickup: false
      }
    }
  ]
};

// Hero image for the flight landing page
export const heroImage = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop";

// Airplane SVG path for subscription section
export const subscriptionAirplane = "M15.5 4.5a2 2 0 0 1 2 2v10.2a.5.5 0 0 1-.39.5h-.01a.5.5 0 0 1-.5-.45L16 13.4V7a1 1 0 0 0-1-1h-3.8a.5.5 0 0 1-.36-.85l1.48-1.48a2 2 0 0 1 1.41-.59h1.77Zm-4.78.5-.94.93a.5.5 0 0 1-.54.13.5.5 0 0 1-.32-.46v-.6h-3a1 1 0 0 0-1 1v1.5a.5.5 0 0 1-.5.5h-.5a.5.5 0 0 1-.5-.5V6a2 2 0 0 1 2-2h3v-.5a.5.5 0 0 1 .84-.36l.92.92a.5.5 0 0 1 0 .71.5.5 0 0 1-.36.14.44.44 0 0 1-.1 0Zm-3.22 4 .4.0v-1h-.4c-.46 0-.74.54-.47.9l.47.1Zm9 1a2 2 0 0 1 2 2v3.8a.5.5 0 0 1-.85.36l-1.48-1.48a.5.5 0 0 1-.15-.35H13.4V13a1 1 0 0 0-1-1h-2v-1a2 2 0 0 1 2-2h3.5Z";

export default flightBookingData;