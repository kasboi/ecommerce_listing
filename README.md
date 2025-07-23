# GidiStore - E-Commerce Product Listing Platform

A modern, responsive e-commerce product listing platform built with Next.js 15, TypeScript, and Tailwind CSS. Features complete product management, advanced filtering, reviews system, and a clean modern UI.

## 🚀 Features

### Product Management

- **Product Listing** - View all products with responsive grid layout
- **Product Details** - Individual product pages with images, descriptions, and reviews
- **Advanced Filtering** - Search by name, filter by category, price range, and sort options
- **CRUD Operations** - Add, edit, and delete products with admin interface
- **Real-time Updates** - Instant UI updates with optimistic mutations

### User Experience

- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Debounced Search** - Smooth search experience without input interruption
- **Loading States** - Proper loading indicators and error handling
- **Reviews System** - Add and view product reviews with ratings
- **SEO Optimized** - Dynamic meta tags and proper semantic HTML

### Technical Features

- **React Query** - Advanced caching, background sync, and state management
- **API Routes** - RESTful endpoints for all CRUD operations
- **TypeScript** - Full type safety throughout the application
- **localStorage** - Client-side data persistence (easily replaceable with database)
- **Modern UI** - Clean design with Tailwind CSS utilities

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** TanStack React Query (v5)
- **Data Storage:** localStorage (browser-based)
- **Icons:** Lucide React
- **Development:** ESLint, PostCSS

## 📦 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ecommerce_listing
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
├── app/
│   ├── api/                 # API routes for products and reviews
│   ├── products/           # Product listing and detail pages
│   ├── admin/              # Product management interface
│   └── layout.tsx          # Root layout with React Query provider
├── src/
│   ├── components/
│   │   ├── ui/             # Reusable UI components
│   │   ├── products/       # Product-specific components
│   │   └── layout/         # Header and navigation
│   ├── lib/
│   │   ├── storage.ts      # localStorage utilities
│   │   ├── server-storage.ts # Server-side storage service
│   │   ├── api.ts          # API client functions
│   │   └── types.ts        # TypeScript interfaces
│   └── hooks/
│       └── use-queries.ts  # React Query hooks
```

## 🎯 Key Components

- **Home Page** - Featured products and latest arrivals
- **Products Page** - Complete product catalog with filtering
- **Product Detail** - Individual product pages with reviews
- **Admin Dashboard** - Product management interface
- **Add/Edit Forms** - Product creation and editing
- **Header** - Navigation with search and admin access

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check
```

## 🎨 Design Features

- **Modern UI** - Clean, card-based design with proper spacing
- **Dark Header** - Professional dark gray navigation (#6B7280)
- **Responsive Grid** - Adaptive product layouts for all screen sizes
- **Loading States** - Smooth loading indicators and error boundaries
- **Toast Notifications** - User feedback for all actions

## 📱 Responsive Breakpoints

- **Mobile** - Single column layout
- **Tablet** - 2-column product grid
- **Desktop** - 3-4 column product grid
- **Large Screens** - Optimized spacing and layout

## 🔍 SEO Features

- Dynamic meta tags for each product page
- Semantic HTML structure
- Proper heading hierarchy
- Alt text for all images
- sitemap.xml and robots.txt

## 🚀 Deployment

The application is ready for deployment on platforms like:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Render**

Simply connect your repository and deploy with zero configuration.

## 💾 Data Storage

Currently uses localStorage for data persistence. The storage layer is abstracted and can be easily replaced with:

- PostgreSQL
- MongoDB
- Supabase
- Firebase
- Any database of choice

## 🔄 Future Enhancements

- User authentication and profiles
- Shopping cart functionality
- Payment integration
- Order management
- Inventory tracking
- Image upload functionality
- Advanced search with Elasticsearch

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
