# Secondhand Marketplace Backend

A comprehensive Node.js/Express backend API for a secondhand marketplace application with support for electronics, precious metals, and collectibles trading.

## Features

- **User Authentication & Management**
  - JWT-based authentication
  - User registration and login
  - Profile management
  - Document verification system
  - User ratings and reviews

- **Product Management**
  - CRUD operations for products
  - Category-specific fields (electronics, precious metals, collectibles)
  - Image and video upload support
  - Search and filtering capabilities
  - Location-based filtering

- **Bidding System**
  - Real-time bidding for collectibles
  - Auction management
  - Bid history and tracking
  - WebSocket support for live updates

- **Chat & Messaging**
  - Real-time chat between buyers and sellers
  - Message history
  - Offer system within chats
  - Read receipts

- **File Upload**
  - Cloudinary integration for image/video storage
  - Multiple file upload support
  - Image optimization and transformation

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **Real-time**: Socket.IO
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting

## Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/secondhand-marketplace
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   PORT=5000
   NODE_ENV=development
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/verify` - Submit verification documents

### Users
- `GET /api/users/:id` - Get user profile
- `POST /api/users/favorites/:productId` - Add/remove favorite
- `GET /api/users/favorites` - Get user favorites

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/seller/:sellerId` - Get products by seller
- `GET /api/products/category/:category` - Get products by category

### Bidding
- `POST /api/bids` - Place a bid
- `GET /api/bids/product/:productId` - Get bids for product
- `GET /api/bids/user/my-bids` - Get user's bids
- `GET /api/bids/user/winning` - Get user's winning bids
- `DELETE /api/bids/:bidId` - Cancel bid

### Chat
- `POST /api/chat` - Create or get chat
- `POST /api/chat/:chatId/messages` - Send message
- `GET /api/chat/user` - Get user's chats
- `GET /api/chat/:chatId` - Get chat messages
- `PUT /api/chat/:chatId/read` - Mark messages as read

### File Upload
- `POST /api/upload/image` - Upload single image
- `POST /api/upload/images` - Upload multiple images
- `POST /api/upload/video` - Upload video
- `POST /api/upload/avatar` - Upload user avatar
- `POST /api/upload/document` - Upload verification document
- `DELETE /api/upload/:publicId` - Delete uploaded file

## Database Schema

### User Model
- Authentication fields (username, email, password)
- Profile information (name, phone, location, avatar)
- Verification documents
- Rating system
- Favorites list

### Product Model
- Basic product information
- Category-specific fields
- Location and specifications
- Auction fields for collectibles
- View and favorite counts

### Bid Model
- Product and bidder references
- Bid amount and timing
- Winning status

### Chat Model
- Buyer, seller, and product references
- Message array with sender, content, and metadata
- Last message tracking

## Real-time Features

The application uses Socket.IO for real-time functionality:

- **Bidding Updates**: Live bid updates for auction items
- **Chat Messages**: Instant message delivery
- **Notifications**: Real-time notifications for important events

## Security Features

- **Authentication**: JWT-based secure authentication
- **Rate Limiting**: API rate limiting to prevent abuse
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers
- **Input Validation**: Joi schema validation
- **Password Hashing**: bcrypt for secure password storage

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests

### Project Structure

```
src/
├── models/          # Database models
├── routes/          # API route handlers
├── middleware/      # Custom middleware
├── scripts/         # Utility scripts
└── server.ts        # Main server file
```

## Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Set production environment variables**

3. **Start the production server**
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
