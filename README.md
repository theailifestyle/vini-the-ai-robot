
# Vini - The AI Robot

**Vini** is a real-time, multimodal AI companion powered by **Google's Gemini Multimodal Live API**. It listens, speaks, sees, and interacts with you in real-time with ultra-low latency.

## Features

*   **Real-time Interaction**: seamless voice-to-voice communication with low latency.
*   **Visual Intelligence**: "Look" capability allows Vini to see and analyze your surroundings using the camera.
*   **Interactive Personas**: Choose from different personalities like **Vini** (Helpful), **WALL-E** (Curious), **EVE** (Sleek), **KITT** (Sassy), or **HAL** (Ominous).
*   **Interactive Expressions**: Animated facial expressions that react to Vini's state (Listening, Thinking, Speaking, Eating, etc.).
*   **Simulated Actions**: Vini can "eat" and "drink" virtual items, showcasing the tool-use capabilities of the Gemini API.
*   **Customizable**: Adjust "Silliness" and "Speed" levels to tweak Vini's energy and behavior.

## Tech Stack

*   **Frontend Reference**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **AI Model**: [Google Gemini Multimodal Live API](https://ai.google.dev/) (via `@google/genai`)
*   **State Management**: React Hooks & Context

## Getting Started

### Prerequisites

*   **Node.js** (v18 or higher recommended)
*   **Google Gemini API Key**: Get one from [Google AI Studio](https://aistudio.google.com/).

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd vini-the-ai-robot
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure environment variables:
    Create a `.env.local` file in the root directory and add your API Key:

    ```env
    GEMINI_API_KEY=your_api_key_here
    ```

    > **Note**: The application is configured to read `GEMINI_API_KEY` and expose it to the client via `vite.config.ts`. Ensure you do not commit your `.env.local` file.

### Running the App

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` (or the URL shown in the terminal).

## Usage Guide

1.  **Tap to Wake**: Tap the screen 3 times to wake Vini up.
2.  **Talk**: improved voice activity detection will automatically listen when you speak.
3.  **Visuals**: Ask Vini to "look at this" or "see what I'm holding," and he will use the camera to analyze the scene.
4.  **Settings**: Click the gear icon to:
    *   Change the **Persona** (e.g., switch to KITT for a more robotic feel).
    *   Adjust **Silliness** and **Speed**.
    *   Change the **Voice**.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
