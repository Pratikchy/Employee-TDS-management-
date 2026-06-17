# Employee TDS Management System

A web-based management system for handling Tax Deducted at Source (TDS) for employees. This application provides tools for admins and HR personnel to manage employee TDS calculations, Form 16 generation, and payroll processing.

## 🌟 Features

- **User Management**: Role-based access control (Admin, HR, Employee)
- **Employee Dashboard**: View personal TDS details and Form 16 documents
- **HR Dashboard**: Manage employee TDS records and approvals
- **Admin Dashboard**: System administration and reporting
- **TDS Calculations**: Automatic calculation based on salary and tax regime
- **Form 16 Generation**: Digital Form 16 document creation
- **Authentication**: Secure login with JWT tokens
- **Responsive Design**: Modern, dark-mode enabled UI

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens), bcryptjs
- **Frontend**: HTML5, CSS3, Tailwind CSS, JavaScript
- **Additional**: CORS, dotenv

## 📋 Prerequisites

- Node.js (v14+)
- npm (v6+)
- MongoDB Atlas account
- Modern web browser

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Pratikchy/Employee-TDS-management-.git
   cd "Employee-TDS-management-"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the `tds-backend/` directory:
   ```
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/tds?retryWrites=true&w=majority
   JWT_SECRET=your_secret_key_here
   PORT=5005
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

   Server will run at: `http://localhost:5005`

## 📂 Project Structure

```
Employee-TDS-management-/
├── tds-backend/
│   ├── models/
│   │   └── User.js                 # User schema (Admin, HR, Employee)
│   ├── public/
│   │   ├── index.html              # Landing page
│   │   ├── login.html              # Login page
│   │   ├── signup.html             # Signup page
│   │   ├── dashboard.html          # Employee dashboard
│   │   ├── admin-dashboard.html    # Admin dashboard
│   │   ├── hr-dashboard.html       # HR dashboard
│   │   ├── payroll.html            # Payroll management
│   │   ├── 404.html                # 404 error page
│   │   ├── script.js               # Client-side logic
│   │   └── style.css               # Styling
│   ├── .env                        # Environment variables (not tracked)
│   ├── server.js                   # Main server file
│   ├── seedAdmin.js                # Admin seed script
│   ├── createAdmin.js              # Admin creation utility
│   └── package.json
├── package.json                    # Root package.json
├── .gitignore                      # Git ignore rules
└── README.md                       # This file
```

## 🔐 API Endpoints

### Authentication
- `POST /api/signup` - Create new user account
- `POST /api/login` - Login with email and password
- `GET /api/verify` - Verify JWT token

### User Management
- `GET /api/user/:id` - Get user details
- `PUT /api/user/:id` - Update user profile
- `GET /api/users` - List all users (Admin only)

### TDS & Payroll
- `GET /api/tds-records` - Fetch TDS records
- `POST /api/tds-calculate` - Calculate TDS
- `GET /api/form16` - Generate Form 16

## 👥 User Roles

1. **Admin**: System administration, user management, approval authority
2. **HR**: Employee record management, TDS approval, payroll processing
3. **Employee**: View personal TDS details and Form 16

## 🔧 Available Scripts

```bash
# Start the development server
npm start

# Seed admin user
npm run seed:admin
```

## 🌐 Environment Variables

Create a `.env` file in `tds-backend/` with:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/tds` |
| `JWT_SECRET` | JWT signing secret | `your_secret_key` |
| `PORT` | Server port | `5005` |

## 🧪 Testing the Application

1. **Access the application**: Open `http://localhost:5005` in your browser
2. **Sign up**: Create a new account with email and password
3. **Login**: Use credentials to log in
4. **Navigate**: Access appropriate dashboard based on role

## 🐛 Known Issues & Troubleshooting

- **MongoDB Connection Error**: Verify `MONGO_URI` is correct and MongoDB Atlas network access is configured
- **Port Already in Use**: Change `PORT` in `.env` or kill process on port 5005
- **CORS Errors**: Ensure backend is running and accessible

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 📧 Support

For issues or questions, please open an issue on GitHub or contact the maintainers.

---

**Last Updated**: June 2026  
**Status**: Active Development
