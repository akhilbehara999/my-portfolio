# RPG-Themed Portfolio Website

This is a personal portfolio website for Pondara Akhil Behara styled like an RPG character profile card with pixel-art UI, stone frame borders, and retro RPG fonts.

## Features

- Pixel-art RPG character avatar with idle animations (blink + head bob)
- HP/MP bars with smooth filling animations
- Weapon mastery with XP-style progress bars and pixel sparkles
- Skill mastery grid layout with staggered entrance animations
- Training log timeline with slide-in effects and completion stamps
- Quest log with active quest glow and completed quest scroll effects
- Player interests with spin and power-up animations
- Achievement trophies with shimmer and bounce effects
- Interactive treasure chest with coin spill animation
- NPC contact form with typing text effect
- RPG-styled footer with social media links
- Responsive design for all device sizes

## Animations

### Hero Section (Avatar + Bio)
- Avatar has idle animation (blink + slight head bob)
- On hover → avatar waves and glows
- HP/MP bars fill smoothly from 0 → current value on load

### Weapon Mastery (Programming Tools & Engines)
- Progress bars animate like XP bars filling with pixel "sparkles"
- Tool icons bounce slightly on hover
- Tooltip slides in with a retro "typewriter" effect when hovered

### Skill Mastery (Grid of Skills)
- Each skill card fades in sequentially (staggered animation)
- Progress meters fill left to right with visual effects
- Hover = glowing outline + "+XP!" popup effect

### Training Log (Education Timeline)
- Cards slide in from left/right as you scroll
- Completed milestones stamp with a pixel "✓" animation
- Ongoing milestone pulses slowly (active quest effect)

### Quest Log (Projects)
- Active quest card glows faintly with pulsing border
- Completed quests fade in like old scrolls unrolling
- Hover = parchment shake + quest details popup

### Player Interests (Bonus Stats)
- Each interest icon spins slightly on hover
- Bars animate like power-ups filling on load
- Add "+stat" text pop when hovered (e.g., +10 Strategy)

### Achievement Trophies
- Locked trophies grayscale; shimmer briefly when hovered
- Unlocked trophies sparkle or bounce on load
- Future unlocks shake slightly to tease interaction

### Download CV (Treasure Chest)
- Chest opens with pixel gold coins spilling animation on hover
- On click → open PDF

### Contact Form (NPC Dialogue Box)
- Dialogue box fades in with typing text effect
- NPC avatar blinks or nods while form is active
- Submit button animates like "End Dialogue" glowing choice

### RPG Footer
- Pixel-art styled menu bar with stone/wood theme
- Social media links with emoji icons (GitHub, LinkedIn, Twitter, Instagram, YouTube)
- Icons have glow and bounce effects on hover
- Tooltips display with RPG-themed messages ("Visit my Guild Hall", "Join my Party", etc.)
- Fixed at bottom on desktop, collapsible on mobile

### Background & Page Transitions
- Subtle pixel cloud drift and torch flicker effects
- Section transitions = screen "wipe" like retro RPG scene change
- Particle effects in the background

## How to Run

### Method 1: Using Python (Recommended)

1. Make sure you have Python installed on your system
2. Navigate to the project directory
3. Run the server script:
   ```
   python server.py
   ```
4. Open your browser and go to `http://localhost:8000`

### Method 2: Using Node.js

1. Install `serve` globally:
   ```
   npm install -g serve
   ```
2. Navigate to the project directory
3. Run:
   ```
   serve -p 8000
   ```
4. Open your browser and go to `http://localhost:8000`

### Method 3: Direct File Opening

1. Open `index.html` directly in your browser
2. All features should work properly when opened in a browser

## Customization

- **Avatar**: The avatar is created with SVG and can be customized by editing the SVG code in `index.html`
- **Colors**: Color scheme can be modified in `style.css` under the `:root` selector
- **Content**: All text content can be edited directly in `index.html`
- **Social Media Links**: Update the href attributes in the footer to point to your actual profiles

## Technologies Used

- HTML5
- CSS3 (with animations and custom properties)
- JavaScript
- Google Fonts (Press Start 2P, Roboto Mono, Pixelify Sans)

## Browser Support

This website works best in modern browsers that support:
- CSS Custom Properties
- CSS Grid
- CSS Animations
- SVG

## Author

Pondara Akhil Behara

## License

This project is open source and available under the MIT License.