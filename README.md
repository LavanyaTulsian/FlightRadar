# ✈️ FlightRadar — Live Air Traffic Radar

A real-time global air traffic visualization application powered by OpenSky Network ADS-B data. FlightRadar provides an interactive interface to explore, monitor, and analyze aircraft positions, flight details, and aviation statistics worldwide.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Pages & Features](#pages--features)
- [Usage](#usage)
- [Build & Deployment](#build--deployment)
- [Technology Details](#technology-details)
- [Data Attribution](#data-attribution)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

- **🗺️ Live Radar Map** — Interactive map displaying real-time aircraft positions using Leaflet
- **✈️ Flights Table** — Sortable and filterable table with detailed flight information
- **📊 Statistics Dashboard** — Data visualizations and analytics powered by Recharts
- **ℹ️ About Section** — Information about the application and API attribution
- **🔄 Real-time Updates** — Live flight data from OpenSky Network
- **📱 Responsive Design** — Optimized for desktop and mobile viewing
- **⚡ Fast Development** — Built with Vite for instant HMR and optimized builds

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| **Frontend Framework** | React 19.2 |
| **Routing** | React Router DOM 6.24 |
| **Mapping** | Leaflet 1.9 + React-Leaflet 4.2 |
| **Data Visualization** | Recharts 2.15 |
| **Build Tool** | Vite 8.0 |
| **Styling** | CSS (38.8%) |
| **Code Quality** | ESLint 9.39 |
| **Package Manager** | npm |

**Language Composition:**
- JavaScript: 60.7%
- CSS: 38.8%
- HTML: 0.5%

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 16.0 or higher
- **npm** 7.0 or higher
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/LavanyaTulsian/FlightRadar.git
   cd FlightRadar
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

   If you encounter peer dependency warnings during install, run:
   ```bash
   npm install --legacy-peer-deps
   ```

### Running the Application

#### Development Mode
Start the development server with hot module replacement (HMR):
```bash
npm run dev
```
The application will typically be available at `http://localhost:5173`

#### Build for Production
Create an optimized production build:
```bash
npm run build
```
The build output will be in the `dist/` directory.

#### Preview Production Build
Preview the production build locally:
```bash
npm run preview
```

#### Linting
Check code quality with ESLint:
```bash
npm run lint
```

---

## 📂 Project Structure

```
FlightRadar/
├── src/
│   ├── components/
│   │   ├── Navbar/           # Top navigation bar component
│   │   └── ...
│   ├── pages/
│   │   ├── MapPage/          # Interactive map radar view
│   │   ├── FlightsPage/      # Sortable flights table
│   │   ├── StatisticsPage/   # Data visualizations
│   │   └── AboutPage/        # App info & attribution
│   ├── App.jsx               # Root router component
│   ├── main.jsx              # Application entry point
│   └── index.css             # Global styles
├── public/                   # Static assets
├── index.html                # HTML entry point
├── package.json              # Project dependencies
├── vite.config.js            # Vite configuration
├── eslint.config.js          # ESLint rules
├── .gitignore                # Git ignore rules
└── README.md                 # This file
```

---

## 🎯 Pages & Features

### 1. **Map Page** (`/`)
- Interactive Leaflet map showing real-time aircraft positions
- Live radar view of global air traffic
- Zoom, pan, and explore flight paths

### 2. **Flights Table** (`/flights`)
- Comprehensive table listing all tracked flights
- **Sortable columns** — Click headers to sort by airline, aircraft type, altitude, speed, etc.
- **Filterable data** — Search and filter by flight properties
- Real-time data updates

### 3. **Statistics Page** (`/statistics`)
- Visual analytics using Recharts
- Data insights and trends
- Charts and graphs for flight statistics

### 4. **About Page** (`/about`)
- Application information
- OpenSky Network attribution
- API usage details and credits

---

## 💡 Usage

1. **Navigate the Map**
   - Click on the "Map" link in the navbar to view live aircraft positions
   - Use your mouse to zoom and pan across the globe
   - Hover over aircraft markers for quick information

2. **Explore Flights**
   - Visit the "Flights" page to see a detailed table of all tracked aircraft
   - Sort by columns (altitude, speed, airline, etc.) by clicking column headers
   - Use filters to find specific flights

3. **View Statistics**
   - Check the "Statistics" page for visual data analytics
   - Understand aviation trends and patterns

4. **Learn More**
   - Visit the "About" page for information about data sources and API attribution

---

## 🔨 Build & Deployment

### Building for Production
```bash
npm run build
```

This command:
- Minifies and bundles all JavaScript
- Optimizes CSS
- Creates a production-ready `dist/` folder

### Deploying

The `dist/` folder can be deployed to any static hosting service:
- **GitHub Pages**
- **Netlify**
- **Vercel**
- **AWS S3**
- **Any web server** supporting static files

Example for GitHub Pages:
```bash
npm run build
# Deploy dist/ folder to gh-pages branch
```

---

## 🔧 Technology Details

### React & Vite
- **React 19** provides modern component-based UI development
- **Vite** enables fast development with instant HMR and optimized production builds

### Leaflet & React-Leaflet
- **Leaflet** is a lightweight, powerful open-source mapping library
- **React-Leaflet** provides React bindings for seamless Leaflet integration
- Perfect for displaying real-time map data

### Recharts
- Declarative charting library built with React components
- Easily create responsive, interactive data visualizations

### ESLint
- Ensures code quality and consistency
- Configured with React hooks and React refresh rules

---

## 📡 Data Attribution

This application uses real-time air traffic data from the **[OpenSky Network](https://opensky-network.org/)**, which collects ADS-B (Automatic Dependent Surveillance-Broadcast) signals.

**OpenSky Network Terms:**
- Data is provided under the terms of use specified by OpenSky Network
- See [OpenSky Network Legal Notice](https://opensky-network.org/about/terms-of-use) for details

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please ensure your code:
- Follows the existing code style (run `npm run lint` to check)
- Includes meaningful commit messages
- Is well-documented

---

## 📝 License

This project is open source. Please review the LICENSE file (if present) for usage terms, or see the repository for license information.

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Leaflet Documentation](https://leafletjs.com)
- [React-Leaflet Documentation](https://react-leaflet.js.org)
- [Recharts Documentation](https://recharts.org)
- [OpenSky Network API](https://opensky-network.org/api)

---

## 📞 Support

For questions, issues, or suggestions:
- Open an issue on [GitHub Issues](https://github.com/LavanyaTulsian/FlightRadar/issues)
- Check existing issues to see if your question has been answered

---

**Happy tracking! ✈️**
