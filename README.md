# HydraSpark 🔥💧

Welcome to HydraSpark, the only app that understands you're a complex human with needs ranging from "soulmate" to "someone to argue about pineapple on pizza with." We're here to help you ignite connections, whether it's a romantic flame or your new bestie.

## So, How Does This Thing Work? (User Guide)

Glad you asked! HydraSpark is split into a few key areas to help you find exactly what you're looking for.

### 🔥 Dating Mode: Find Your Flame

This is where the magic happens. We'll show you profiles of people who might just be your type.

*   **Swipe Right (`<Heart/>`)**: You're into them! If they swipe right on you too, it's a match!
*   **Swipe Left (`<X/>`)**: Not your cup of tea. No worries, plenty more fish in the sea.
*   **Super Like (`<Star/>`)**: WOAH. You're *really* into them. This lets them know you're not just swiping right on everyone. Use these wisely!

### 💧 Friend Mode: Find Your Squad

Not looking for love? We get it. Friend Mode is your platonic paradise.

*   **Find People**: Browse profiles of other folks just looking for friends. See their interests and send a friend request!
*   **Events**: Find local meetups, from book clubs to coffee runs.
*   **Groups**: Join or create community groups based on your hobbies. Finally, a place to find fellow D&D nerds or hiking enthusiasts.

### 📅 Event Management

Create and manage your own events! Whether it's a huge party or a small get-together, you can post it here and find people to join in.

---

## Wanna Get This Bad Boy Online? (Deployment Guide)

Alright, time to get your hands dirty. Here’s how you can deploy your own version of HydraSpark.

### Prerequisites

1.  **Install the Encore CLI**: This runs the backend and local dev magic.
    *   **macOS:** `brew install encoredev/tap/encore`
    *   **Linux:** `curl -L https://encore.dev/install.sh | bash`
    *   **Windows:** `iwr https://encore.dev/install.ps1 | iex`
2.  **Install Bun**: We use Bun for frontend package management.
    *   `npm install -g bun`

### Method 1: The "I Just Want It Live" Firebase Deploy

This is how we just deployed the app. It's fast, it's easy, and it gets the job done.

1.  **Install Frontend Dependencies**:
    ```bash
    cd frontend
    bun install
    ```
2.  **Build the App for Production**: This is the crucial step! It bundles everything up into a neat little `dist` folder.
    ```bash
    bunx vite build
    ```
3.  **Deploy!**: Point your Firebase Hosting (or any other static site host) to the `frontend/dist` directory. That's it! You're live.

### Method 2: The "I'm a Pro" GitHub & Encore Deploy

For a more robust, CI/CD-powered setup, you'll want to use Encore's GitHub integration.

1.  **Configure Secrets**: Make sure you've set up your secrets as described in `SECRETS.md`. You'll definitely need that `JWTSecret`.

2.  **Connect to GitHub**:
    *   Open your app in the Encore Cloud dashboard.
    *   Go to your GitHub Integration settings.
    *   Connect your account and grant access to your repository.

3.  **Deploy with a Push**: Once connected, every time you push to your `main` branch, a new deployment will be automatically triggered.
    ```bash
    git add -A .
    git commit -m "My awesome new feature"
    git push origin main
    ```

And there you have it! You're all set to run and deploy the next big thing in social apps. Happy coding!
