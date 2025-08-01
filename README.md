# Adopt a Pixel 🎨

A fun interactive pixel adoption game where users can claim pixels on a grid, personalize them with colors and names, and watch the collaborative art come to life in real-time!

## Features ✨

- **Interactive Pixel Grid**: 20x20 grid of adoptable pixels (400 total)
- **Real-time Updates**: See other users' adoptions instantly
- **Personalization**: Choose from 12 beautiful colors and get a random emoji
- **Adoption Modal**: Sweet "Will you adopt me?" popup for each pixel
- **Auto-reset**: Grid resets when all pixels are adopted
- **Responsive Design**: Works great on desktop and mobile
- **Persistent Storage**: Uses Supabase for real-time persistence

## Tech Stack 🛠️

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Real-time subscriptions)
- **Runtime**: Bun

## Getting Started 🚀

### Prerequisites

1. [Bun](https://bun.sh) installed
2. [Supabase](https://supabase.com) account

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd adopt-a-pixel
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API
   - Copy your Project URL and anon public key

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

5. **Set up the database**
   - In your Supabase dashboard, go to SQL Editor
   - Copy and paste the contents of `database-schema.sql`
   - Run the query to create tables and initial data

6. **Start the development server**
   ```bash
   bun run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## How to Play 🎮

1. **Find a grey pixel** - These are orphaned pixels waiting for adoption
2. **Click on it** - A sweet popup will ask "Will you adopt me?"
3. **Enter your name** - Let the pixel know who their new parent is
4. **Choose a color** - Pick from 12 beautiful colors
5. **Click "Yes, adopt!"** - Watch your pixel light up with joy
6. **See the magic** - Your pixel gets a random emoji and your chosen color
7. **Watch others** - See other adoptions happen in real-time
8. **Complete the grid** - When all 400 pixels are adopted, the grid resets!

## Database Schema 📊

The `pixels` table stores:
- `id`: Pixel position (0-399)
- `adopted`: Boolean adoption status
- `color`: Hex color code
- `adopter`: Name of the person who adopted it
- `emoji`: Random emoji assigned on adoption
- `adopted_at`: Timestamp of adoption
- Auto-updating timestamps

## Real-time Features ⚡

- **Live Updates**: See adoptions from other users instantly
- **Auto-refresh**: Grid reloads every 10 seconds to ensure sync
- **Collaborative**: Multiple people can adopt pixels simultaneously
- **Synchronized**: Everyone sees the same grid state
- **Auto-reset**: Coordinated reset when grid is complete

## Deployment 🌐

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

Works on any platform that supports Next.js:
- Netlify
- Railway
- Heroku
- Self-hosted

## Contributing 🤝

Feel free to submit issues and enhancement requests!

## License 📝

MIT License - feel free to use this for your own projects!

---

Made with 💖 for the Useless Ideas Hackathon
