# Simple Books Catalogue

## Task

https://drive.google.com/file/d/1RBRcuH-_oAvtjem5Xs0c4NXZ8I38aYyH/view

---

## How to run the app

1. Clone or download the repository  
2. Open the project folder  

### Run with Vite (recommended)

```bash
npm install
npm run dev

Then open the local URL shown in terminal (e.g. http://localhost:5173)

simple-books-catalogue/
│
├── index.html              # Main HTML structure
├── package.json            # Project config
├── vite.config.js          # Vite configuration
├── README.md
│
├── src/
│   ├── main.js             # Main app logic
│   ├── styles/
│   │   └── style.css       # Styles
│   └── utils/
│       ├── api.js          # API requests logic
│       └── favorites.js    # Favorites logic (localStorage)
│
├── assets/                 # Static icons (SVG)
└── dist/                   # Production build (generated)