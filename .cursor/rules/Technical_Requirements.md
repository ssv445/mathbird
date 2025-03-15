## Technical Requirements

### Technology Stack
- **Framework:** Next.js 15, with App Router
- **Styling:** Tailwind CSS for all UI elements
- **Routing:** Next.js pages (`/`, `/game`, `/level-up`, `/progress`, `/settings`)
- **State Management:** Use React state and LocalStorage/IndexedDB for storing progress
- **Performance:**
  - Optimize for fast loading and minimal re-renders
  - Use static export (`next export`) for full offline support
- **Accessibility:** Ensure readable text, large tappable buttons, and good color contrast
- **Mobile-First Approach:**
  - Design primarily for touchscreens
  - Avoid elements that require precise cursor control
- **icons** Use react-icons library
- Keep the app, well structured and modular to reuse components