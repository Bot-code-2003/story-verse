# OneSitRead - Short Fiction Platform

**OneSitRead** is a modern web platform for discovering, reading, and sharing short fiction stories that you can finish in one sitting.

## 🎯 What is OneSitRead?

OneSitRead is designed for readers who love complete, satisfying stories but don't always have hours to commit. Every story on the platform is crafted to be finished in a single reading session - perfect for your lunch break, commute, or evening wind-down.

## ✨ Features

- **Quick Reads**: All stories are designed to be finished in one sitting
- **Multiple Genres**: Fantasy, Sci-Fi, Romance, Horror, Thriller, Slice of Life, Drama, Adventure, and more
- **Smart Recommendations**: AI-powered recommendations based on your reading preferences
- **Author Tools**: Easy-to-use story editor with rich text formatting
- **Community Features**: Like, save, comment, and share your favorite stories
- **Pulse Check**: Rate stories on emotional dimensions (soft, intense, heavy, warm, dark)
- **Reading Progress**: Track your reading progress with a visual indicator
- **Dark Mode**: Easy on the eyes with automatic theme switching

## 🚀 Tech Stack

- **Framework**: Next.js 16 (React 19)
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd onesitread
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
MONGODB_DEV_URI=your_mongodb_connection_string
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📊 Database Management

The platform includes helpful database scripts:

```bash
# Create database indexes
npm run db:indexes:create

# Verify indexes
npm run db:indexes:verify

# Drop all indexes
npm run db:indexes:drop

# Analyze query performance
npm run db:analyze
```

## 🎨 Key Features

### For Readers
- Browse stories by genre, trending, latest, or quick reads
- Save stories to your library
- Like and comment on stories
- Share stories on social media
- Personalized recommendations
- Reading progress tracking

### For Writers
- Rich text editor with formatting options
- Cover image upload with compression
- Genre tagging
- Draft and publish workflow
- Author profile customization
- Story analytics (views, likes, comments)

## 📱 Responsive Design

OneSitRead is fully responsive and works beautifully on:
- Desktop computers
- Tablets
- Mobile phones

## 🔒 Content Policy

OneSitRead supports responsible AI-assisted writing while maintaining quality standards. See our [Terms and Privacy](/tandp) page for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 🌟 Tagline

**"Stories worth sitting for"** - One sitting. One story. Infinite worlds.

---

Built with ❤️ for story lovers everywhere
