# egecam.dev

![Ege Çam's Personal Website](public/og-image.jpg)

A modern, minimalist personal website and blog built with Next.js, showcasing my work as a software engineer and creative technologist.

## 🚀 Features

- **Responsive Design** - Optimized for all device sizes
- **Dark Mode Support** - Automatic theme switching based on system preferences
- **Project Showcase** - Highlighting my iOS and web development projects
- **Writing Section** - Blog with tag filtering and infinite scroll
- **Contact Form** - Easy way to get in touch
- **SEO Optimized** - Meta tags and Open Graph images for better sharing
- **Performance Focused** - Fast loading times and optimized assets

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Content Management**: [Contentful](https://www.contentful.com/)
- **Deployment**: [Vercel](https://vercel.com/)
- **Form Handling**: [Gmail API](https://developers.google.com/gmail/api) for contact form submissions

## 🔧 Development

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/egecam/egecam.dev.git
   cd egecam.dev
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:

   ```
   # Contentful Configuration
   NEXT_PUBLIC_CONTENTFUL_SPACE_ID=your_contentful_space_id
   NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=your_contentful_access_token

   # Email Configuration
   GMAIL_APP_PASSWORD=your_gmail_app_password

   # Feature Flags
   NEXT_PUBLIC_SHOW_CREATIVE_GARDEN=false
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📝 Project Structure

- `src/app/*` - Next.js app router pages and layouts
- `src/components/*` - Reusable UI components
- `src/lib/*` - Utility functions and API clients
- `public/*` - Static assets like images and fonts

## 📱 Features

### Home Page

The landing page showcases my profile, featured projects, experience, and latest writing.

### Projects

A curated collection of my work, including iOS apps and web development projects.

### Writing

A blog section with articles on technology, arts, and culture. Features include:

- Tag-based filtering
- Infinite scroll for pagination
- Audio versions of some articles
- Rich media embeds

### Contact

A simple form to get in touch, with email notifications.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) for the incredible framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Framer Motion](https://www.framer.com/motion/) for the smooth animations
- [Contentful](https://www.contentful.com/) for the headless CMS
- [Vercel](https://vercel.com/) for the seamless deployment
