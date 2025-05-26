# Dot Symphony  
*A Consciousness Expression App*  
**Combines** Dot Emoji Language → Consciousness Clock → Dot Music Composer  
**Built on** Dot Theory & the Consciousness Continuum

---

## Table of Contents

1. [Overview](#overview)  
2. [Getting Started](#getting-started)  
3. [Features & Workflows](#features--workflows)  
   - [1. Dot Language Composer](#1-dot-language-composer)  
   - [2. Mind State Tracker](#2-mind-state-tracker)  
   - [3. Dot Music Composer](#3-dot-music-composer)  
4. [Shared Functionality](#shared-functionality)  
5. [Definitions & Concepts](#definitions--concepts)  
6. [Examples](#examples)  
7. [Future Extensions](#future-extensions)  
8. [Credits & License](#credits--license)

---

## Overview

Dot Symphony is a fully client-side web app that allows users to:

1. **Define** a personal dot-emoji language.  
2. **Track** their hourly emotional/cognitive state via dots or free-text journal.  
3. **Compose** a musical piece (with auto-generated lyrics) from their logged dots.  
4. **Visualize** the entire process as an animated dot symphony.

All data (emoji definitions, journal entries, dot logs, music sequences) lives in browser storage—no server required.

---

## Getting Started

1. **Clone** this repo  
   ```bash
   git clone https://github.com/you/dot-symphony.git
   cd dot-symphony
   ```
2. **Install dependencies** (if using a bundler/React)  
   ```bash
   npm install
   npm start
   ```
3. **Open** `index.html` in your browser for a vanilla-JS demo.  
4. **Explore** the three main modules in order:
   - **Dot Language Composer** → build your dictionary  
   - **Mind State Tracker** → log your day  
   - **Dot Music Composer** → generate music & lyrics  

---

## Features & Workflows

### 1. Dot Language Composer

> **Purpose**: Build and evolve your personal “dot emoji” lexicon.

**Key Steps:**

1. **Create a Dot Emoji**  
   - Click **“New Dot”**.  
   - Choose **Color**, **Size**, **Shape**, and **Animation Style**.  
   - Enter a **Name** and optional **Description** (e.g. “Focus”, “Anxious”).  
   - Click **Save**—your dot appears in the **Dot Dictionary** grid.

2. **Auto-Expand from Journal**  
   - In the Tracker module, if you enter a new keyword not in your dictionary, the app:
     1. Runs **client-side sentiment analysis** to guess emotion (joy, sadness, anger, calm).  
     2. Proposes a matching dot (color, shape).  
     3. Lets you **Edit & Confirm**, then saves to your dictionary automatically.

3. **Manage Your Dictionary**  
   - **Edit**: Change any property or rename.  
   - **Delete**: Remove obsolete entries.  
   - **Export/Import**: Download as JSON or restore from a backup.

#### Example

```json
{
  "dots": [
    {
      "id": "uid-123",
      "name": "Focus",
      "color": "#FFD700",
      "size": 16,
      "shape": "circle",
      "animation": "pulse",
      "description": "Sharp attention, deep concentration"
    },
    {
      "id": "uid-456",
      "name": "Anxious",
      "color": "#FF4500",
      "size": 20,
      "shape": "jagged",
      "animation": "shake",
      "description": "Nervousness or worry"
    }
  ]
}
```

---

### 2. Mind State Tracker

> **Purpose**: Record your hourly mind/emotion state as dots or text, then watch their transformation.

**Key Steps:**

1. **Add Entry**  
   - Click any hour on the **24-hour ring**.  
   - Choose **Dot Emoji** from your dictionary **or** type a **journal snippet**.

2. **Journal Conversion**  
   - If typing, the app:
     1. **Tokenizes** your text.  
     2. Runs **sentiment + keyword extraction**.  
     3. Maps each keyword to an existing dot—if missing, triggers **Auto-Expand**.  
     4. Presents the resulting dot sequence for confirmation.

3. **Animated Timeline**  
   - Click **“Play Timeline”** to animate dots moving around the ring.  
   - Notice **homotopic shifts**: dots smoothly morph shape/color as you transition between hours.

4. **Export Logs**  
   - **PNG**: Single-day “Conscious Mandala.”  
   - **GIF**: Animated daily timeline.  
   - **JSON**: Full log for next-phase music conversion.

#### Example JSON Entry
```json
{
  "2025-05-26T09:00": ["uid-123"],
  "2025-05-26T10:00": ["uid-456","uid-789"]
}
```

---

### 3. Dot Music Composer

> **Purpose**: Render your dot-log as a melody + lyrics, then animate it with your emoji.

**Key Steps:**

1. **Import Log**  
   - Click **“Import Log”** and select your JSON from the Tracker.

2. **Map Dots to Sound**  
   - Each dot’s **emotion** → instrument & key choice.  
   - Each dot’s **size** → volume or note length.  
   - **Connections** → harmonic intervals (e.g., minor/major third).

3. **Auto-Lyrics Generation**  
   - Takes your journal text and uses a **client-side language model** (or simple template rules) to:
     - Extract key sentiment words.  
     - Compose 4–8 lines of lyrics matching song structure.

4. **Playback & Animation**  
   - Click **Play**:  
     - Dots pulse & glow in sync with their notes.  
     - Lyrics scroll in a karaoke-style banner.

5. **Export & Share**  
   - **MIDI** file of the melody  
   - **PDF** of lyrics + “Mind Music Sheet” (dots + notation)  
   - **MP4** with animated dot visuals  
   - **Share URL** embedding all data for others to remix

#### Example Music Mapping
| Dot Name  | Emotion  | Instrument  | Pitch Range | Note Length |
|-----------|----------|-------------|-------------|-------------|
| Focus     | Neutral  | Piano       | C4–G4       | Quarter     |
| Anxious   | Negative | Synth lead  | G4–B4       | Eighth      |
| Joy       | Positive | Guitar pluck| E4–A4       | Half        |

---

## Shared Functionality

- **Offline Storage**: Uses IndexedDB for all modules—no data leaves your browser.  
- **URL Serialization**: Share any dictionary, log, or song via a single URL (Base64-encoded JSON).  
- **Settings Panel**: Themes (light/dark), data export/import, library reset.  
- **Accessibility**: Keyboard navigation, ARIA labels on all interactive elements.

---

## Definitions & Concepts

- **Dot**: A dimensionless symbol representing a unit of cognition or emotion.  
- **Cognitive Manifold**: The topological space of all your dot-states over time.  
- **Homotopy**: Smooth transformation between one dot arrangement and another.  
- **Persistent Homology**: Recurring dot patterns that form stable structures (e.g., mood anchors).  
- **DAFS** (Dynamic Adaptive Feedback Systems): Real-time feedback loops in music & mood.  
- **CSCI**: Cross-System Consciousness Index, approximated here by dot density & transitions.

---

## Examples

1. **Building a New Dot**  
   - Create a “Serenity” dot: pastel blue, circle, slow fade animation.  
2. **Logging 14:00**  
   - Journal: “Felt calm after meditation.” → auto-maps to “Serenity” dot.  
3. **Generating Music**  
   - “Serenity” dot → soft harp plucks in C major, half-note length.  
   - Lyrics:  
     ```
     In the hush of breath I find  
     A tranquil pulse within my mind  
     Softly every worry fades  
     As gentle harp in light cascades
     ```

---

## Future Extensions

- **Dream Analyzer**: Morning journal → dot + lullaby music.  
- **Multiplayer Mode**: Compare daily dot mandalas with friends.  
- **API Export**: Allow other clients to read/write your library and logs.

---

## Credits & License

- **Author**: Your Name  
- **License**: MIT  
- **Inspired by**: “Consciousness Continuum” paper by Samuel Cummings & collaborators; Dot Theory conceptual framework.  

---

*Thank you for exploring your mind’s symphony in dots, time, and sound!*
