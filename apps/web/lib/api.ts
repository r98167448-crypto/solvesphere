const CORE_API_URL = process.env.NEXT_PUBLIC_CORE_API_URL || 'http://localhost:8000';
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'http://localhost:8001';

// Seeded demo challenges for offline / GitHub Pages static demo mode
export const DEMO_CHALLENGES = [
  {
    id: "c1",
    title: "Severe Drinking Water Contamination & Broken Pipeline in Ward 12",
    description: "Water supply contaminated with sewage runoff due to underground fracture near Gandhi Nagar intersection. Over 400 households affected with acute water shortage and water-borne illness risk.",
    category: "Water & Sanitation",
    domain: "Water Infrastructure",
    sub_domain: "Distribution & Contamination Control",
    lat: 12.9716,
    lng: 77.5946,
    district: "Bengaluru Urban",
    priority: "high",
    status: "verified",
    upvote_count: 42,
    created_at: new Date().toISOString(),
    media: [
      { id: "m1", file_url: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f8?auto=format&fit=crop&w=800&q=80", media_type: "image" }
    ]
  },
  {
    id: "c2",
    title: "Overflowing Solid Waste & Plastic Dumping near Primary School",
    description: "Public bins uncollected for 2 weeks. Stray animals scattering plastic and organic waste blocking pedestrian walkway and creating health hazards for school children.",
    category: "Environment & Waste",
    domain: "Waste Management",
    sub_domain: "Solid Waste Collection",
    lat: 12.9352,
    lng: 77.6245,
    district: "Bengaluru South",
    priority: "medium",
    status: "pending",
    upvote_count: 18,
    created_at: new Date().toISOString(),
    media: []
  },
  {
    id: "c3",
    title: "Deep Dangerous Potholes on High Traffic Arterial Road",
    description: "Several 2-foot deep potholes formed after heavy monsoon rains causing multiple two-wheeler accidents and severe peak-hour bottlenecks.",
    category: "Urban Infrastructure",
    domain: "Roads & Mobility",
    sub_domain: "Pothole Repair & Surface Restoration",
    lat: 13.0033,
    lng: 77.5692,
    district: "Bengaluru North",
    priority: "high",
    status: "assigned",
    upvote_count: 65,
    created_at: new Date().toISOString(),
    media: [
      { id: "m3", file_url: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80", media_type: "image" }
    ]
  }
];

// Seeded department mock profiles for live demo
export const DEMO_USERS: Record<string, any> = {
  "citizen@gmail.com": {
    id: "u-citizen",
    name: "Vishal Citizen",
    email: "citizen@gmail.com",
    role: "citizen",
    phone: "+91 9876543212"
  },
  "admin@solvesphere.org": {
    id: "u-admin",
    name: "Municipal Admin Officer",
    email: "admin@solvesphere.org",
    role: "government",
    phone: "+91 9876543210"
  },
  "govt@city.gov.in": {
    id: "u-govt",
    name: "City Commissioner",
    email: "govt@city.gov.in",
    role: "government",
    phone: "+91 9876543211"
  },
  "univ@university.edu": {
    id: "u-univ",
    name: "Prof. Sharma (Tech Univ Lab)",
    email: "univ@university.edu",
    role: "university",
    phone: "+91 9876543213"
  },
  "csr@ecotech.com": {
    id: "u-csr",
    name: "EcoTech Industries CSR Lead",
    email: "csr@ecotech.com",
    role: "industry",
    phone: "+91 9876543214"
  },
  "ecoclub@stmarys.edu": {
    id: "u-school",
    name: "St. Mary's Eco Club",
    email: "ecoclub@stmarys.edu",
    role: "school",
    phone: "+91 9876543215"
  }
};

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('solvesphere_token');
  }
  return null;
}

export function setAuthSession(token: string, user: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('solvesphere_token', token);
    localStorage.setItem('solvesphere_user', JSON.stringify(user));
  }
}

export function getCurrentUser(): any | null {
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('solvesphere_user');
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

export function clearAuthSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('solvesphere_token');
    localStorage.removeItem('solvesphere_user');
  }
}

function getStoredChallenges(): any[] {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('solvesphere_challenges');
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {}
    }
    localStorage.setItem('solvesphere_challenges', JSON.stringify(DEMO_CHALLENGES));
  }
  return DEMO_CHALLENGES;
}

function saveStoredChallenges(items: any[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('solvesphere_challenges', JSON.stringify(items));
  }
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Attempt live backend fetch with a short 2.5s timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`${CORE_API_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      return await response.json();
    }
  } catch (netErr) {
    // Backend unreachable (e.g. static GitHub Pages demo mode)
    // Seamlessly handle locally with realistic demo state
  }

  // --- Client-Side Demo Mock Handler for Static Hosting ---
  const method = options.method?.toUpperCase() || 'GET';
  let bodyData: any = {};
  if (options.body && typeof options.body === 'string') {
    try {
      bodyData = JSON.parse(options.body);
    } catch (e) {}
  }

  // 1. Auth Login Mock
  if (endpoint === '/auth/login' && method === 'POST') {
    const user = DEMO_USERS[bodyData.email] || {
      id: 'demo-user',
      name: bodyData.email.split('@')[0],
      email: bodyData.email,
      role: 'citizen'
    };
    return {
      access_token: 'demo-jwt-token-solvesphere',
      token_type: 'bearer',
      user
    };
  }

  // 2. Auth Register Mock
  if (endpoint === '/auth/register' && method === 'POST') {
    const user = {
      id: `u-${Date.now()}`,
      name: bodyData.name || 'Demo User',
      email: bodyData.email,
      role: bodyData.role || 'citizen',
      phone: bodyData.phone
    };
    return {
      access_token: 'demo-jwt-token-solvesphere',
      token_type: 'bearer',
      user
    };
  }

  // 3. Analytics Dashboard
  if (endpoint.startsWith('/analytics/dashboard')) {
    const challenges = getStoredChallenges();
    return {
      total: challenges.length,
      verified: challenges.filter(c => c.status === 'verified').length,
      in_progress: challenges.filter(c => ['assigned', 'in_progress'].includes(c.status)).length,
      completed: challenges.filter(c => c.status === 'completed').length,
      by_category: {
        "Water & Sanitation": 1,
        "Environment & Waste": 1,
        "Urban Infrastructure": 1
      },
      by_district: {
        "Bengaluru Urban": 1,
        "Bengaluru South": 1,
        "Bengaluru North": 1
      },
      resolution_rate: 33.3
    };
  }

  // 4. Challenges List & Filters
  if (endpoint.startsWith('/challenges') && method === 'GET') {
    const challenges = getStoredChallenges();
    const url = new URL(`http://dummy.com${endpoint}`);
    const statusParam = url.searchParams.get('status');
    const categoryParam = url.searchParams.get('category');
    const priorityParam = url.searchParams.get('priority');

    let filtered = [...challenges];
    if (statusParam) filtered = filtered.filter(c => c.status === statusParam);
    if (categoryParam) filtered = filtered.filter(c => c.category?.toLowerCase().includes(categoryParam.toLowerCase()));
    if (priorityParam) filtered = filtered.filter(c => c.priority === priorityParam);

    // If fetching single challenge: /challenges/:id
    const idMatch = endpoint.match(/^\/challenges\/([^\/\?]+)/);
    if (idMatch && !['verify', 'upvote', 'duplicates', 'matches'].includes(idMatch[1])) {
      const found = challenges.find(c => c.id === idMatch[1]) || challenges[0];
      return found;
    }

    return filtered;
  }

  // 5. Create Challenge
  if (endpoint === '/challenges' && method === 'POST') {
    const challenges = getStoredChallenges();
    const newChallenge = {
      id: `c-${Date.now()}`,
      title: bodyData.title,
      description: bodyData.description,
      category: bodyData.category || 'Urban Infrastructure',
      domain: 'Civic Infrastructure',
      sub_domain: 'Community Resolution',
      lat: bodyData.lat || 12.9716,
      lng: bodyData.lng || 77.5946,
      district: bodyData.district || 'Bengaluru Central',
      priority: 'high',
      status: 'pending',
      upvote_count: 1,
      created_at: new Date().toISOString(),
      media: bodyData.media?.map((url: string, i: number) => ({ id: `m-${i}`, file_url: url })) || []
    };
    challenges.unshift(newChallenge);
    saveStoredChallenges(challenges);
    return newChallenge;
  }

  // 6. Upvote Challenge
  if (endpoint.includes('/upvote') && method === 'POST') {
    const id = endpoint.split('/')[2];
    const challenges = getStoredChallenges();
    let count = 1;
    const updated = challenges.map(c => {
      if (c.id === id) {
        c.upvote_count = (c.upvote_count || 0) + 1;
        count = c.upvote_count;
      }
      return c;
    });
    saveStoredChallenges(updated);
    return { upvote_count: count };
  }

  // 7. Verify Challenge
  if (endpoint.includes('/verify') && method === 'PATCH') {
    const id = endpoint.split('/')[2];
    const challenges = getStoredChallenges();
    let updatedItem: any = null;
    const updated = challenges.map(c => {
      if (c.id === id) {
        c.status = bodyData.approve ? 'verified' : 'rejected';
        if (bodyData.priority_override) c.priority = bodyData.priority_override;
        updatedItem = c;
      }
      return c;
    });
    saveStoredChallenges(updated);
    return updatedItem || challenges[0];
  }

  // 8. Profiles (Universities & Industry)
  if (endpoint.includes('/universities/expertise') || endpoint.includes('/industry/profile')) {
    return { status: 'success', message: 'Profile updated successfully' };
  }

  // 9. Notifications
  if (endpoint.startsWith('/notifications')) {
    return [
      {
        id: "notif-1",
        user_id: "u-citizen",
        type: "verification",
        message: "Your challenge 'Severe Drinking Water Contamination' was verified by the municipal commissioner.",
        read_status: false,
        created_at: new Date().toISOString()
      },
      {
        id: "notif-2",
        user_id: "u-citizen",
        type: "project",
        message: "A university engineering lab has submitted an IoT prototype proposal for Ward 12.",
        read_status: true,
        created_at: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  }

  return { status: "success" };
}
