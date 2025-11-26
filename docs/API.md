# Fashion Shop API Documentation

## Base URL
- Production: `https://mzakriev.ru`
- Development: `http://localhost:3001`

## Authentication

All authenticated endpoints require a valid JWT token in cookies (`auth-token`).

### Admin Endpoints
Admin endpoints require the user to have `role: "ADMIN"`. Returns:
- `401` if not authenticated
- `403` if authenticated but not an admin

---

## Endpoints

### Health Check

#### `GET /api/health`
Check service health and database connectivity.

**Response** (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2025-11-26T12:00:00.000Z",
  "services": {
    "database": {
      "status": "operational",
      "responseTime": "15ms"
    },
    "app": {
      "status": "operational",
      "version": "1.0.0",
      "nodeVersion": "v18.17.0"
    }
  },
  "uptime": 86400
}
```

**Error Response** (503 Service Unavailable):
```json
{
  "status": "unhealthy",
  "timestamp": "2025-11-26T12:00:00.000Z",
  "error": "Database connection failed",
  "services": {
    "database": { "status": "down" },
    "app": { "status": "degraded" }
  }
}
```

---

## Authentication Endpoints

### Login

#### `POST /api/auth/login`
Authenticate user and receive JWT token.

**Rate Limit**: 5 requests per 15 minutes per IP

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

**Error Responses**:
- `400` - Invalid credentials
- `429` - Rate limit exceeded (too many login attempts)

**Headers**:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Timestamp when limit resets

---

### Register

#### `POST /api/auth/register`
Create new user account.

**Rate Limit**: 3 requests per hour per IP

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "name": "John Doe",
  "phone": "+79001234567",
  "referralCode": "ABC123" // optional
}
```

**Validation Rules**:
- Email: Valid format, no disposable domains
- Password: Min 8 characters, uppercase, lowercase, number
- Phone: Optional, Russian format
- Referral code: Optional, must exist

**Response** (201 Created):
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER"
  }
}
```

**Error Responses**:
- `400` - Validation error or disposable email
- `409` - Email already registered
- `429` - Rate limit exceeded

---

### Seller Registration

#### `POST /api/seller/register`
Register as a seller/business partner.

**Rate Limit**: 2 requests per day per IP

**Request Body**:
```json
{
  "email": "seller@company.com",
  "password": "SecurePassword123",
  "companyName": "ООО Компания",
  "inn": "1234567890",
  "ogrn": "1234567890123",
  "phone": "+79001234567",
  "contactPerson": "Ivan Ivanov"
}
```

**Validation Rules**:
- INN: 10 digits (ЮЛ) or 12 digits (ИП) with valid checksum
- OGRN: 13 digits (ЮЛ) or 15 digits (ИП) with valid checksum
- Email: Valid format, no disposable domains
- Password: Min 8 characters, uppercase, lowercase, number

**Response** (201 Created):
```json
{
  "user": {
    "id": 2,
    "email": "seller@company.com",
    "name": "Ivan Ivanov",
    "role": "SELLER"
  }
}
```

**Error Responses**:
- `400` - Invalid INN/OGRN checksum or validation error
- `409` - Email already registered
- `429` - Rate limit exceeded

---

### Logout

#### `POST /api/auth/logout`
Clear authentication token.

**Response** (200 OK):
```json
{
  "success": true
}
```

---

## Shopping Endpoints

### Checkout

#### `POST /api/checkout`
Create new order and initiate payment.

**Authentication**: Optional (guest checkout allowed)

**Request Body**:
```json
{
  "items": [
    { "productId": 1, "quantity": 2 },
    { "productId": 2, "quantity": 1 }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "+79001234567",
    "address": "ул. Ленина, д. 1, кв. 1",
    "city": "Москва",
    "postalCode": "101000"
  },
  "email": "user@example.com" // required for guest checkout
}
```

**Validation Rules**:
- Email: No disposable domains
- Items: Must be in stock
- Total: Minimum order amount 500 RUB

**Response** (200 OK):
```json
{
  "order": {
    "id": 123,
    "orderNumber": "ORD-2025-001",
    "total": 5990,
    "status": "PENDING"
  },
  "payment": {
    "id": "pay_abc123",
    "url": "https://payment.example.com/checkout/abc123",
    "amount": 5990
  }
}
```

**Error Responses**:
- `400` - Validation error, disposable email, or out of stock
- `500` - Payment creation failed

---

### Cart

#### `GET /api/cart`
Get current user's cart (authenticated) or session cart (guest).

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "Брелок iPhone",
        "price": 2990,
        "image": "/products/keychain.jpg"
      },
      "quantity": 2
    }
  ],
  "total": 5980
}
```

#### `POST /api/cart`
Add item to cart.

**Request Body**:
```json
{
  "productId": 1,
  "quantity": 2
}
```

#### `PUT /api/cart`
Update cart item quantity.

**Request Body**:
```json
{
  "productId": 1,
  "quantity": 3
}
```

#### `DELETE /api/cart`
Remove item from cart.

**Request Body**:
```json
{
  "productId": 1
}
```

---

## Admin Endpoints

All admin endpoints require authentication with `role: "ADMIN"`.

### Settings Management

#### `GET /api/admin/settings`
Get site settings.

**Authentication**: Admin required

**Response** (200 OK):
```json
{
  "drawDate": "2025-12-31T23:59:59.000Z",
  "maintenanceMode": false,
  "minOrderAmount": 500
}
```

#### `POST /api/admin/settings`
Update site settings.

**Authentication**: Admin required

**Request Body**:
```json
{
  "drawDate": "2025-12-31T23:59:59.000Z",
  "maintenanceMode": false,
  "minOrderAmount": 500
}
```

---

### Content Management

#### `GET /api/admin/content`
Get editable content blocks.

**Authentication**: Admin required

**Response** (200 OK):
```json
{
  "hero": {
    "title": "Покупай iPhone - Получай брелок!",
    "subtitle": "5 счастливчиков выиграют iPhone 16 Pro"
  },
  "howItWorks": { ... }
}
```

#### `POST /api/admin/content`
Update content blocks.

**Authentication**: Admin required

---

### Product Management

#### `GET /api/admin/products`
List all products.

**Authentication**: Admin required

**Response** (200 OK):
```json
{
  "products": [
    {
      "id": 1,
      "name": "Брелок iPhone",
      "price": 2990,
      "stock": 100,
      "active": true
    }
  ]
}
```

#### `POST /api/admin/products`
Create new product.

**Authentication**: Admin required

#### `GET /api/admin/products/[id]`
Get single product details.

**Authentication**: Admin required

#### `PUT /api/admin/products/[id]`
Update product.

**Authentication**: Admin required

#### `DELETE /api/admin/products/[id]`
Delete product.

**Authentication**: Admin required

---

### Order Management

#### `GET /api/admin/orders/refund`
List orders eligible for refund.

**Authentication**: Admin required

**Response** (200 OK):
```json
{
  "orders": [
    {
      "id": 123,
      "orderNumber": "ORD-2025-001",
      "status": "PAID",
      "total": 5990,
      "user": { "email": "user@example.com" }
    }
  ]
}
```

#### `POST /api/admin/orders/refund`
Process refund for an order.

**Authentication**: Admin required

**Request Body**:
```json
{
  "orderId": 123,
  "reason": "Customer request"
}
```

---

### Draw Management

#### `POST /api/admin/draw/conduct`
Conduct the draw and select winners.

**Authentication**: Admin required

**Request Body**:
```json
{
  "numberOfWinners": 5
}
```

**Response** (200 OK):
```json
{
  "winners": [
    {
      "userId": 1,
      "email": "winner1@example.com",
      "entryCode": "ABC123"
    }
  ]
}
```

---

## Payment Webhooks

### Mock Payment Callback

#### `POST /api/payment/callback/mock`
Webhook endpoint for mock payment provider.

**Idempotency**: Duplicate callbacks are safely ignored via dual-layer checks:
1. Payment status check
2. Order status check

**Request Body**:
```json
{
  "paymentId": "pay_abc123",
  "status": "succeeded",
  "amount": 5990
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Payment processed successfully"
}
```

---

## Rate Limiting

Rate limits are enforced per IP address:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/auth/login` | 5 requests | 15 minutes |
| `/api/auth/register` | 3 requests | 1 hour |
| `/api/seller/register` | 2 requests | 1 day |

**Rate Limit Headers**:
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 4
X-RateLimit-Reset: 1732626000000
```

**Error Response** (429 Too Many Requests):
```json
{
  "error": "Слишком много попыток входа. Попробуйте позже."
}
```

---

## Security Features

### Authentication
- JWT tokens in HTTP-only cookies
- Bcrypt password hashing
- Admin role-based access control

### Input Validation
- INN/OGRN checksum validation
- Disposable email domain blocking (50+ domains)
- Password strength requirements
- Phone number format validation

### Security Headers
- Content Security Policy (CSP)
- Strict Transport Security (HSTS)
- X-Frame-Options: SAMEORIGIN
- X-Content-Type-Options: nosniff
- X-XSS-Protection

### Payment Security
- Webhook idempotency checks
- Payment status validation
- Order status validation

---

## Error Responses

Standard error response format:

```json
{
  "error": "Human-readable error message"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Bad Request (validation error) |
| `401` | Unauthorized (not authenticated) |
| `403` | Forbidden (insufficient permissions) |
| `404` | Not Found |
| `409` | Conflict (e.g., email already exists) |
| `429` | Too Many Requests (rate limit) |
| `500` | Internal Server Error |
| `503` | Service Unavailable |

---

## Development Notes

### Rate Limiting
Current implementation uses in-memory storage. For production with multiple servers, consider:
- Redis for distributed rate limiting
- Database-backed tracking

### Testing
Use `/api/health` endpoint for monitoring and health checks.

### Payment Integration
Current implementation uses mock payment provider. Replace with real payment gateway (YooKassa, CloudPayments, etc.) before production.
