# e-commerce

# E-Commerce Platform

A modern, full-stack e-commerce platform built with Vue.js 3 and Django REST Framework.

## Features

### Frontend (Vue.js 3)

- 🎨 Modern UI with PrimeVue components
- 📱 Responsive design with Tailwind CSS
- ✨ Smooth animations with animate.css
- 🛒 Shopping cart functionality
- 🔐 JWT authentication
- 👤 User dashboard and profile management
- 🔍 Product search and filtering
- 💳 Checkout process
- 🌙 Dark mode support
- 📊 Admin dashboard for product management

### Backend (Django REST Framework)

- 🚀 RESTful API with Django REST Framework
- 🔒 JWT authentication with refresh tokens
- 📦 Product and category management
- 🛒 Shopping cart system
- 📋 Order management
- 👥 User management
- 🖼️ Image upload and processing
- 🔍 Advanced filtering and search
- 📊 Admin interface

## Tech Stack

### Frontend

- Vue.js 3 (Composition API)
- PrimeVue (UI Components)
- Tailwind CSS (Styling)
- Sass (Advanced styling)
- Axios (HTTP client)
- Pinia (State management)
- Vue Router (Routing)
- animate.css (Animations)

### Backend

- Django 5+
- Django REST Framework
- djangorestframework-simplejwt
- django-cors-headers
- Pillow (Image processing)
- SQLite (Database)

## Installation & Setup

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- Git

### Backend Setup

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd ecommerce-platform
   \`\`\`

2. **Set up Python virtual environment**
   \`\`\`bash
   cd backend
   python -m venv venv

# On Windows

venv\Scripts\activate

# On macOS/Linux

source venv/bin/activate
\`\`\`

3. **Install Python dependencies**
   \`\`\`bash
   pip install -r requirements.txt
   \`\`\`

4. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env

# Edit .env file with your settings

\`\`\`

5. **Run database migrations**
   \`\`\`bash
   python manage.py makemigrations
   python manage.py migrate
   \`\`\`

6. **Create superuser**
   \`\`\`bash
   python manage.py createsuperuser
   \`\`\`

7. **Load sample data (optional)**
   \`\`\`bash
   python manage.py loaddata fixtures/sample_data.json
   \`\`\`

8. **Start the Django development server**
   \`\`\`bash
   python manage.py runserver
   \`\`\`

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   \`\`\`bash
   cd frontend
   \`\`\`

2. **Install Node.js dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env

# Edit .env file if needed

\`\`\`

4. **Start the Vue development server**
   \`\`\`bash
   npm run dev
   \`\`\`

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET /api/auth/profile/` - Get user profile
- `PUT /api/auth/profile/` - Update user profile
- `POST /api/auth/token/refresh/` - Refresh JWT token

### Products

- `GET /api/products/` - List products (with filtering)
- `POST /api/products/` - Create product (admin only)
- `GET /api/products/{id}/` - Get product details
- `PUT /api/products/{id}/` - Update product (admin only)
- `DELETE /api/products/{id}/` - Delete product (admin only)
- `GET /api/products/featured/` - Get featured products
- `GET /api/products/search/` - Advanced product search

### Categories

- `GET /api/categories/` - List categories
- `POST /api/categories/` - Create category (admin only)
- `GET /api/categories/{id}/` - Get category details
- `PUT /api/categories/{id}/` - Update category (admin only)
- `DELETE /api/categories/{id}/` - Delete category (admin only)

### Cart

- `GET /api/cart/` - Get user's cart
- `POST /api/cart/add/` - Add item to cart
- `PUT /api/cart/items/{id}/` - Update cart item quantity
- `DELETE /api/cart/items/{id}/remove/` - Remove item from cart
- `DELETE /api/cart/clear/` - Clear cart

### Orders

- `GET /api/orders/` - List user's orders
- `POST /api/orders/create/` - Create new order
- `GET /api/orders/{id}/` - Get order details
- `PATCH /api/orders/{id}/status/` - Update order status (admin only)
- `GET /api/admin/orders/` - List all orders (admin only)

## Project Structure

```
ecommerce-platform/
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── layout/
│ │ │ └── ProductCard.vue
│ │ ├── views/
│ │ │ ├── auth/
│ │ │ ├── admin/
│ │ │ └── ...
│ │ ├── stores/
│ │ ├── services/
│ │ ├── router/
│ │ └── assets/
│ ├── package.json
│ └── vite.config.js
├── backend/
│ ├── ecommerce/
│ │ ├── settings.py
│ │ ├── urls.py
│ │ └── wsgi.py
│ ├── accounts/
│ ├── products/
│ ├── cart/
│ ├── orders/
│ ├── requirements.txt
│ └── manage.py
└── README.md
```

## Features in Detail

### User Features

- Browse products with search and filtering
- View detailed product information
- Add products to cart
- Manage cart items (update quantity, remove items)
- Secure checkout process
- User registration and authentication
- View order history
- Update profile information

### Admin Features

- Product management (CRUD operations)
- Category management
- Order management and status updates
- User management
- Inventory tracking
- Sales analytics

### Technical Features

- Responsive design for all devices
- JWT-based authentication with refresh tokens
- Image upload and optimization
- Advanced search and filtering
- Real-time cart updates
- Form validation
- Error handling
- Loading states
- Dark mode support
- Smooth animations and transitions

## Development

### Adding New Features

1. **Backend**: Create new Django apps or extend existing ones
2. **Frontend**: Add new Vue components and views
3. **API**: Define new endpoints in Django REST Framework
4. **State Management**: Use Pinia stores for complex state

### Testing

\`\`\`bash

# Backend tests

cd backend
python manage.py test

# Frontend tests (if configured)

cd frontend
npm run test
\`\`\`

### Building for Production

\`\`\`bash

# Frontend build

cd frontend
npm run build

# Backend deployment

cd backend
python manage.py collectstatic
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.
\`\`\`

This complete e-commerce platform provides:

1. \*\*Professional Vue.js 3 Fronten
