# My Travel

وكالة سفر متكاملة تقدم خدمات حجز الرحلات، معلومات التأشيرة، ودعم ذكاء اصطناعي عبر Gemini.

## Features | الميزات
- ✈️ **Flight Booking Search**: Real-time mock flight search integrated with Gemini AI for intelligent suggestions.
- 🏨 **Hotel Search**: Discover accommodations with advanced filtering.
- 🛂 **Visa Information**: Multi-language support (EN, FR, AR) for visa requirements.
- 🤖 **AI Support**: Integrated Gemini model for travel assistance.
- 🎨 **Premium UI**: Dark mode, glassmorphism design, and smooth animations using Tailwind CSS and Framer Motion.
- 📱 **PWA Support**: Installable on mobile and desktop.

## Getting Started | البدء

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd my-travel-dz
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration
Create a `.env` file in the root directory based on `.env.example`:
```env
GEMINI_API_KEY=your_gemini_api_key
```

### Development
Run the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### Build
To build for production:
```bash
npm run build
```
The optimized output will be in the `dist/` folder.

## Technologies Used | التقنيات المستخدمة
- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **AI**: Google Gemini Pro (@google/genai)
- **Icons**: Lucide React

---
Developed with ❤️ by My Travel DZ
