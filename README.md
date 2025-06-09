# 🎮 Intelligent Tic-Tac-Toe AI

A strategic Tic-Tac-Toe game featuring an AI opponent that thinks before it moves. Built with vanilla JavaScript to demonstrate advanced array manipulation, pattern recognition, and game state management.

## 🌟 Features

- **Strategic AI**: Makes intelligent moves based on priority system
- **Pattern Recognition**: Detects winning combinations across rows, columns, and diagonals
- **Real-time Game State**: Tracks player and AI moves simultaneously
- **Responsive Design**: Clean, intuitive user interface
- **Edge Case Handling**: Manages draws, occupied cells, and game resets

## 🧠 AI Logic

The AI employs a sophisticated decision-making process:

1. **Win First**: Prioritizes moves that result in immediate victory
2. **Block Second**: Prevents player from winning by analyzing move sequences
3. **Optimize Positioning**: Chooses strategic positions when no immediate threats exist
4. **Pattern Analysis**: Uses combination matrix approach to evaluate all possible winning paths

## 🔧 Technical Implementation

### Core Technologies
- **JavaScript ES6+**: Advanced array methods and modern syntax
- **HTML5**: Semantic structure and accessibility
- **CSS3**: Responsive design with modern styling

### Key JavaScript Concepts Used
- Multi-dimensional array manipulation
- Array methods: `map()`, `filter()`, `some()`, `flat()`
- Conditional logic trees for decision making
- DOM manipulation and event handling
- Game state persistence and management

### Algorithm Highlights
```javascript
// Priority-based decision making
1. Check for winning moves
2. Block opponent's winning moves
3. Take center if available
4. Take corners strategically
5. Take remaining edges
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser
- Basic understanding of HTML/CSS/JavaScript (for development)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/UtonyDev/XnO.git
   ```
2. Open `index.html` in your browser or serve with a local server

### Usage
1. Click on any empty cell to make your move
2. Watch the AI analyze and make its strategic counter-move
3. Try to beat the AI (good luck! 😅)
4. Click "Reset Game" to start over

## 📁 Project Structure

```
tictactoe-ai/
├── index.html          # Main HTML file
├── styles.css          # Styling and layout
├── script.js           # Game logic and AI implementation
├── README.md           # Project documentation
└── assets/             # Images and additional resources
    └── screenshots/    # Game screenshots
```