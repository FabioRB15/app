# Mystic Host - Backend Implementation Contracts

## API Contracts

### Base URL
- Frontend: Uses `REACT_APP_BACKEND_URL/api`
- All endpoints prefixed with `/api`

### 1. Game Servers Management

#### GET /api/servers
**Purpose**: Retrieve all game servers for dashboard
**Response**:
```json
{
  "servers": [
    {
      "id": "string",
      "name": "Minecraft Java",
      "players": "2-100",
      "price": "R$ 15,90",
      "ram": "2GB",
      "storage": "10GB SSD",
      "status": "online|maintenance",
      "image": "string (URL)",
      "createdAt": "ISO date",
      "updatedAt": "ISO date"
    }
  ]
}
```

#### POST /api/servers
**Purpose**: Create new game server
**Body**:
```json
{
  "name": "string",
  "players": "string",
  "price": "string",
  "ram": "string",
  "storage": "string",
  "image": "string"
}
```

#### PUT /api/servers/:id/status
**Purpose**: Update server status
**Body**:
```json
{
  "status": "online|maintenance"
}
```

### 2. Pricing Plans Management

#### GET /api/pricing-plans
**Purpose**: Retrieve all pricing plans
**Response**:
```json
{
  "plans": [
    {
      "id": "string",
      "name": "Apprentice",
      "price": "R$ 19,90",
      "period": "/mês",
      "description": "string",
      "features": ["string"],
      "popular": boolean,
      "createdAt": "ISO date"
    }
  ]
}
```

### 3. Dashboard Statistics

#### GET /api/dashboard/stats
**Purpose**: Get real-time dashboard statistics
**Response**:
```json
{
  "stats": [
    {
      "title": "Servidores Ativos",
      "value": "147",
      "change": "+12%",
      "trend": "up|down"
    }
  ]
}
```

### 4. Support/Contact

#### POST /api/support/contact
**Purpose**: Submit support request
**Body**:
```json
{
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string",
  "priority": "low|medium|high"
}
```

#### GET /api/testimonials
**Purpose**: Get customer testimonials
**Response**:
```json
{
  "testimonials": [
    {
      "id": "string",
      "name": "Pedro Silva",
      "role": "Admin do servidor MineCraft Brasil",
      "content": "string",
      "avatar": "string (URL)",
      "rating": 5,
      "createdAt": "ISO date"
    }
  ]
}
```

## Mock Data to Replace

### From /app/frontend/src/data/mock.js:

1. **mockGameServers** → `/api/servers`
   - 4 game servers (Minecraft, CS2, Rust, ARK)
   - Replace with real MongoDB collection

2. **mockPricingPlans** → `/api/pricing-plans`
   - 3 pricing tiers (Apprentice, Sorcerer, Archmage)
   - Replace with real MongoDB collection

3. **mockDashboardStats** → `/api/dashboard/stats`
   - Real-time statistics calculation
   - Server count, player count, uptime, latency

4. **mockTestimonials** → `/api/testimonials`
   - Customer testimonials with ratings
   - Replace with real MongoDB collection

## Backend Implementation Plan

### MongoDB Models

1. **GameServer**
   - name, players, price, ram, storage, status, image
   - timestamps, metadata

2. **PricingPlan**
   - name, price, period, description, features[], popular
   - timestamps

3. **DashboardStats** (computed from other collections)
   - Real-time aggregation queries

4. **Testimonial**
   - name, role, content, avatar, rating
   - timestamps, approved status

5. **SupportRequest**
   - name, email, subject, message, priority, status
   - timestamps, assigned_to

### API Endpoints Structure
```
/api
├── /servers
│   ├── GET / (list all)
│   ├── POST / (create)
│   ├── PUT /:id/status (update status)
│   └── DELETE /:id (remove)
├── /pricing-plans
│   ├── GET / (list all)
│   └── POST / (create - admin)
├── /dashboard
│   └── GET /stats (real-time stats)
├── /testimonials
│   ├── GET / (approved only)
│   └── POST / (create new)
└── /support
    └── POST /contact (submit request)
```

## Frontend Integration Changes

### Files to Update:
1. **DashboardPreview.jsx** 
   - Replace `mockDashboardStats` with API call to `/api/dashboard/stats`
   - Replace `mockGameServers` with API call to `/api/servers`

2. **Pricing.jsx**
   - Replace `mockPricingPlans` with API call to `/api/pricing-plans`

3. **Support.jsx**
   - Replace `mockTestimonials` with API call to `/api/testimonials`
   - Add form submission to `/api/support/contact`

### New Components Needed:
1. **API service layer** (`/src/services/api.js`)
2. **Loading states** for data fetching
3. **Error handling** for failed requests
4. **Form components** for support contact

## Data Flow
1. Frontend loads → API calls to backend
2. Backend queries MongoDB → returns formatted data
3. Frontend updates state → renders real data
4. Real-time updates via periodic polling or WebSocket (future)

## Error Handling
- 404: Resource not found
- 500: Server error
- 400: Bad request data
- Frontend shows fallback UI for errors

## Performance Considerations
- Cache pricing plans (rarely change)
- Paginate servers list if many
- Optimize dashboard stats queries
- Add loading skeletons