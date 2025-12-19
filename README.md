# Photo Studio Billing System API

A clean, scalable REST API for managing photo studio billing, operator accounts, and studio-wise records.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB

## Features

- ✅ Operator management (photographers/staff)
- ✅ Studio location management
- ✅ Billing/Event tracking with references
- ✅ Full CRUD operations for all entities
- ✅ Automatic timestamp tracking
- ✅ Reference population for detailed queries

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd svision
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure MongoDB**
   
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/photo-studio
   PORT=3000
   ```
   
   Or use MongoDB Atlas:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/photo-studio
   PORT=3000
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

   The server will start at `http://localhost:3000`

## API Endpoints

### Root
- `GET /` - API documentation

### Operators
- `POST /api/operators` - Create operator
- `GET /api/operators` - Get all operators
- `GET /api/operators/:id` - Get operator by ID
- `PUT /api/operators/:id` - Update operator
- `DELETE /api/operators/:id` - Delete operator

### Studios
- `POST /api/studios` - Create studio
- `GET /api/studios` - Get all studios
- `GET /api/studios/:id` - Get studio by ID
- `PUT /api/studios/:id` - Update studio
- `DELETE /api/studios/:id` - Delete studio

### Billings
- `POST /api/billings` - Create billing entry
- `GET /api/billings` - Get all billing entries (with populated references)
- `GET /api/billings/:id` - Get billing by ID (with populated references)
- `PUT /api/billings/:id` - Update billing entry
- `DELETE /api/billings/:id` - Delete billing entry

## Usage Examples

### Create an Operator

```bash
POST http://localhost:3000/api/operators
Content-Type: application/json

{
  "name": "John Doe",
  "phoneNumber": "9876543210",
  "expertise": "Wedding Photography"
}
```

### Create a Studio

```bash
POST http://localhost:3000/api/studios
Content-Type: application/json

{
  "studioName": "Sunshine Studios",
  "studioLocation": "Mumbai, Maharashtra"
}
```

### Create a Billing Entry

```bash
POST http://localhost:3000/api/billings
Content-Type: application/json

{
  "date": "2025-12-18",
  "type": "Wedding",
  "studio": "STUDIO_ID_HERE",
  "amount": 50000,
  "operator": "OPERATOR_ID_HERE",
  "place": "Grand Hotel",
  "event": "Sharma Wedding",
  "paymentStatus": false
}
```

### Get All Billings

```bash
GET http://localhost:3000/api/billings
```

This will return billing entries with populated operator and studio details.

## Data Models

### Operator
```javascript
{
  name: String (required),
  phoneNumber: String (required),
  expertise: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Studio
```javascript
{
  studioName: String (required),
  studioLocation: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Billing
```javascript
{
  date: Date,
  type: String,
  studio: ObjectId (ref: Studio),
  amount: Number (required),
  operator: ObjectId (ref: Operator, required),
  place: String,
  event: String,
  paymentStatus: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

## Project Structure

```
svision/
├── config/
│   └── database.js          # MongoDB connection
├── models/
│   ├── Operator.js          # Operator model
│   ├── Studio.js            # Studio model
│   └── Billing.js           # Billing model
├── routes/
│   ├── operators.js         # Operator CRUD routes
│   ├── studios.js           # Studio CRUD routes
│   └── billings.js          # Billing CRUD routes
├── .env                     # Environment variables
├── .gitignore
├── server.js                # Main server file
├── package.json
└── README.md
```

## Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Testing

Use tools like:
- **Postman** - GUI-based API testing
- **Thunder Client** - VS Code extension
- **curl** - Command-line testing
- **Insomnia** - API testing tool

## License

ISC
