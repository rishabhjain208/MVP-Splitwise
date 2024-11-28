# Expense Tracker API

An **Expense Tracker API** built using Node.js, Express, and MongoDB to help users track shared expenses and balances among multiple members. The API provides detailed user information along with calculated balances.

## Features

- **User Management**: Manage users with details like name and email.
- **Expense Tracking**: Create, track, and manage expenses.
- **Balance Calculation**: Calculate how much each member owes or is owed.
- **Detailed Responses**: Includes user names, emails, and IDs for better transparency.

---

## API Endpoints

### Get Balances

**URL**: `/api/balances/:userId`  
**Method**: `GET`  
**Description**: Fetches the balances for a user along with details of other members involved in the expenses.

#### Example Request

```bash
GET /api/balances/6746d945e1f87b2e2bdb6753
