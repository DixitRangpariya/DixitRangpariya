# API Documentation

Base URL: `http://localhost:5000` (Adjust port as necessary)

## Studios

### Create Studio
**Endpoint:** `POST /api/studios`
**Payload:**
```json
{
  "studioName": "Vision Studio",
  "studioLocation": "Mumbai"
}
```
**cURL:**
```bash
curl -X POST http://localhost:5000/api/studios \
  -H "Content-Type: application/json" \
  -d '{"studioName": "Vision Studio", "studioLocation": "Mumbai"}'
```

### Get All Studios
**Endpoint:** `GET /api/studios`
**cURL:**
```bash
curl -X GET http://localhost:5000/api/studios
```

### Search Studios
**Endpoint:** `GET /api/studios/search`
**Query Params:** `name`
**cURL:**
```bash
curl -X GET "http://localhost:5000/api/studios/search?name=Vision"
```

### Get Studio by ID
**Endpoint:** `GET /api/studios/:id`
**cURL:**
```bash
curl -X GET http://localhost:5000/api/studios/65dbf2a1b9f1c8a1b9f1c8a1
```

### Update Studio
**Endpoint:** `POST /api/studios/update/:id`
**Payload:**
```json
{
  "studioName": "New Vision Studio",
  "studioLocation": "Delhi"
}
```
**cURL:**
```bash
curl -X POST http://localhost:5000/api/studios/update/65dbf2a1b9f1c8a1b9f1c8a1 \
  -H "Content-Type: application/json" \
  -d '{"studioName": "New Vision Studio", "studioLocation": "Delhi"}'
```

### Delete Studio
**Endpoint:** `DELETE /api/studios/:id`
**cURL:**
```bash
curl -X DELETE http://localhost:5000/api/studios/65dbf2a1b9f1c8a1b9f1c8a1
```

---

## Operators

### Create Operator
**Endpoint:** `POST /api/operators`
**Payload:**
```json
{
  "name": "Rahul Kumar",
  "phoneNumber": "9876543210",
  "expertise": "Candid Photography"
}
```
**cURL:**
```bash
curl -X POST http://localhost:5000/api/operators \
  -H "Content-Type: application/json" \
  -d '{"name": "Rahul Kumar", "phoneNumber": "9876543210", "expertise": "Candid Photography"}'
```

### Get All Operators
**Endpoint:** `GET /api/operators`
**cURL:**
```bash
curl -X GET http://localhost:5000/api/operators
```

### Search Operators
**Endpoint:** `GET /api/operators/search`
**Query Params:** `name`
**cURL:**
```bash
curl -X GET "http://localhost:5000/api/operators/search?name=Rahul"
```

### Get Operator by ID
**Endpoint:** `GET /api/operators/:id`
**cURL:**
```bash
curl -X GET http://localhost:5000/api/operators/65dbf2a1b9f1c8a1b9f1c8a1
```

### Update Operator
**Endpoint:** `POST /api/operators/update/:id`
**Payload:**
```json
{
  "name": "Rahul K.",
  "phoneNumber": "9876543210",
  "expertise": "Videography"
}
```
**cURL:**
```bash
curl -X POST http://localhost:5000/api/operators/update/65dbf2a1b9f1c8a1b9f1c8a1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Rahul K.", "phoneNumber": "9876543210", "expertise": "Videography"}'
```

### Delete Operator
**Endpoint:** `DELETE /api/operators/:id`
**cURL:**
```bash
curl -X DELETE http://localhost:5000/api/operators/65dbf2a1b9f1c8a1b9f1c8a1
```

---

## Billings

### Create Billing Entry
**Endpoint:** `POST /api/billings`
**Payload:**
```json
{
  "date": "2024-01-15T00:00:00.000Z",
  "type": "Wedding",
  "studio": "65dbf2a1b9f1c8a1b9f1c8a1",
  "amount": 5000,
  "operator": "65dbf2a1b9f1c8a1b9f1c8a2",
  "otherOperator": "Amit",
  "operatorAmount": 2000,
  "place": "Hotel Grand",
  "event": "Reception",
  "paymentStatus": false
}
```
**cURL:**
```bash
curl -X POST http://localhost:5000/api/billings \
  -H "Content-Type: application/json" \
  -d '{"date": "2024-01-15", "type": "Wedding", "studio": "STUDIO_ID", "amount": 5000, "operator": "OPERATOR_ID", "otherOperator": "Amit", "operatorAmount": 2000, "place": "Hotel Grand", "event": "Reception"}'
```

### Get All Billings
**Endpoint:** `GET /api/billings`
**cURL:**
```bash
curl -X GET http://localhost:5000/api/billings
```

### Get Billings by Studio
**Endpoint:** `GET /api/billings/studio/:studioId`
**cURL:**
```bash
curl -X GET http://localhost:5000/api/billings/studio/65dbf2a1b9f1c8a1b9f1c8a1
```

### Get Billings by Studio with Date Range
**Endpoint:** `GET /api/billings/studio/:studioId/date`
**Query Params:** `startDate`, `endDate`
**cURL:**
```bash
curl -X GET "http://localhost:5000/api/billings/studio/65dbf2a1b9f1c8a1b9f1c8a1/date?startDate=2024-01-01&endDate=2024-01-31"
```

### Get Billings by Operator
**Endpoint:** `GET /api/billings/operator/:operatorId`
**cURL:**
```bash
curl -X GET http://localhost:5000/api/billings/operator/65dbf2a1b9f1c8a1b9f1c8a2
```

### Get Billings by Operator with Date Range
**Endpoint:** `GET /api/billings/operator/:operatorId/date`
**Query Params:** `startDate`, `endDate`
**cURL:**
```bash
curl -X GET "http://localhost:5000/api/billings/operator/65dbf2a1b9f1c8a1b9f1c8a2/date?startDate=2024-01-01&endDate=2024-01-31"
```

### Get Billing by ID
**Endpoint:** `GET /api/billings/:id`
**cURL:**
```bash
curl -X GET http://localhost:5000/api/billings/65dbf2a1b9f1c8a1b9f1c8a3
```

### Update Billing
**Endpoint:** `POST /api/billings/update/:id`
**Payload:**
```json
{
  "amount": 5500,
  "paymentStatus": true
}
```
**cURL:**
```bash
curl -X POST http://localhost:5000/api/billings/update/65dbf2a1b9f1c8a1b9f1c8a3 \
  -H "Content-Type: application/json" \
  -d '{"amount": 5500, "paymentStatus": true}'
```

### Delete Billing
**Endpoint:** `DELETE /api/billings/:id`
**cURL:**
```bash
curl -X DELETE http://localhost:5000/api/billings/65dbf2a1b9f1c8a1b9f1c8a3
```

### Export Studio Billings
**Endpoint:** `POST /api/billings/export/studio`
**Payload:**
```json
{
  "studioId": "65dbf2a1b9f1c8a1b9f1c8a1",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "paymentStatus": false,
}
```
**cURL:**
```bash
curl -X POST http://localhost:5000/api/billings/export/studio \
  -H "Content-Type: application/json" \
  -d '{"studioId": "65dbf2a1b9f1c8a1b9f1c8a1", "startDate": "2024-01-01", "endDate": "2024-01-31"}'
```

### Export Operator Billings
**Endpoint:** `POST /api/billings/export/operator`
**Payload:**
```json
{
  "operatorId": "65dbf2a1b9f1c8a1b9f1c8a2",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31"
}
```
**cURL:**
```bash
curl -X POST http://localhost:5000/api/billings/export/operator \
  -H "Content-Type: application/json" \
  -d '{"operatorId": "65dbf2a1b9f1c8a1b9f1c8a2", "startDate": "2024-01-01", "endDate": "2024-01-31"}'
```

---

## Operator Payments

### Create Payment
**Endpoint:** `POST /api/operator-payments`
**Payload:**
```json
{
  "operator": "65dbf2a1b9f1c8a1b9f1c8a2",
  "amount": 1000,
  "date": "2024-01-20",
  "paymentMode": "GPay",
  "note": "Advance payment"
}
```
**cURL:**
```bash
curl -X POST http://localhost:5000/api/operator-payments \
  -H "Content-Type: application/json" \
  -d '{"operator": "65dbf2a1b9f1c8a1b9f1c8a2", "amount": 1000, "paymentMode": "GPay", "note": "Advance payment"}'
```

### Delete Operator Payment
**Endpoint:** `DELETE /api/operator-payments/:id`
**cURL:**
```bash
curl -X DELETE http://localhost:5000/api/operator-payments/65dbf2a1b9f1c8a1b9f1c8a2
```

### Get Payments by Operator
**Endpoint:** `GET /api/operator-payments/operator/:operatorId`
**cURL:**
```bash
curl -X GET http://localhost:5000/api/operator-payments/operator/65dbf2a1b9f1c8a1b9f1c8a2
```

### Get Ledger by Operator
**Endpoint:** `GET /api/operator-payments/ledger/:operatorId`
**cURL:**
```bash
curl -X GET http://localhost:5000/api/operator-payments/ledger/65dbf2a1b9f1c8a1b9f1c8a2
```

### Export Operator Ledger
**Endpoint:** `POST /api/operator-payments/export`
**Payload:**
```json
{
  "operatorId": "65dbf2a1b9f1c8a1b9f1c8a2",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31"
}
```
**cURL:**
```bash
curl -X POST http://localhost:5000/api/operator-payments/export \
  -H "Content-Type: application/json" \
  -d '{"operatorId": "65dbf2a1b9f1c8a1b9f1c8a2", "startDate": "2024-01-01", "endDate": "2024-01-31"}'
```

---

## Studio Payments

### Create Payment (Received/Paid)
**Endpoint:** `POST /api/studio-payments`
**Payload:**
```json
{
  "studio": "65dbf2a1b9f1c8a1b9f1c8a1",
  "amount": 2000,
  "type": 0,
  "date": "2024-02-01",
  "paymentMode": "Online",
  "note": "Advance payment"
}
```
*Note: `type`: 0 for Received from Studio, 1 for Paid to Studio*

**cURL:**
```bash
curl -X POST http://localhost:5000/api/studio-payments \
  -H "Content-Type: application/json" \
  -d '{"studio": "65dbf2a1b9f1c8a1b9f1c8a1", "amount": 2000, "type": 0, "paymentMode": "Online", "note": "Advance payment"}'
```

### Delete Studio Payment
**Endpoint:** `DELETE /api/studio-payments/:id`
**cURL:**
```bash
curl -X DELETE http://localhost:5000/api/studio-payments/65dbf2a1b9f1c8a1b9f1c8a1
```

### Get Payments by Studio
**Endpoint:** `GET /api/studio-payments/studio/:studioId`
**cURL:**
```bash
curl -X GET http://localhost:5000/api/studio-payments/studio/65dbf2a1b9f1c8a1b9f1c8a1
```

### Get Studio Ledger
**Endpoint:** `GET /api/studio-payments/ledger/:studioId`
**cURL:**
```bash
curl -X GET http://localhost:5000/api/studio-payments/ledger/65dbf2a1b9f1c8a1b9f1c8a1
```

### Export Studio Ledger
**Endpoint:** `POST /api/studio-payments/export`
**Payload:**
```json
{
  "studioId": "65dbf2a1b9f1c8a1b9f1c8a1",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31"
}
```
**cURL:**
```bash
curl -X POST http://localhost:5000/api/studio-payments/export \
  -H "Content-Type: application/json" \
  -d '{"studioId": "65dbf2a1b9f1c8a1b9f1c8a1", "startDate": "2024-01-01", "endDate": "2024-01-31"}'
```
