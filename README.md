# Project Hive

**Hive** is a web application designed to enhance social interaction among university students. It allows users to send and receive requests for help related to university life and other needs. The app aims to foster connections between students who can assist each other, participate in discussions, and share knowledge, promoting a collaborative and growth-focused community.

## Features

- **Buzz:** A space for students to post and interact with campus updates and announcements.
- **Live Requests:** Allows users to post and view real-time help requests.
- **Uploads & Downloads:** Share and access study materials or other resources.
- **History:** View past interactions or requests made within the app.
- **Updates:** Stay informed with recent updates and announcements from fellow users.
- **Auth System:** Secure user authentication for logging in and registering.
- **Responsive Design:** Adaptable to various screen sizes for a seamless user experience.

## Tech Stack

- **Frontend:** React.js, JSX, CSS
- **Backend:** Node.js, Express.js
- **Database:** Firebase
- **Hosting:** Render

## Project Structure

```
hive/
│
├── public/Images         # Contains images used in the app.
├── src/                  # Main source folder.
│   ├── Components/       # React components for different app features.
│   │   ├── Auth.jsx      # Handles user authentication.
│   │   ├── Buzz.jsx      # Displays campus buzz and announcements.
│   │   ├── Campusbuzz.jsx
│   │   ├── Databank.jsx  # Manages data storage and retrieval.
│   │   ├── Downloads.jsx # For downloading shared files.
│   │   ├── History.jsx   # Tracks user interaction history.
│   │   ├── Hnavbar.jsx   # Horizontal navigation bar.
│   │   ├── Home.jsx      # Landing page for the app.
│   │   ├── Liverequest.jsx
│   │   ├── Lnavbar.jsx   # Left-side navigation bar.
│   │   ├── Requestbox.jsx
│   │   ├── Updates.jsx
│   │   ├── Updatesbox.jsx
│   │   ├── Uploads.jsx   # Handles file uploads.
│   │
│   ├── Css/              # Contains CSS files for styling.
│   ├── App.css           # Main CSS file.
│   ├── App.jsx           # Main component file.
│   ├── Error.jsx         # Error handling component.
│   ├── firebase.js       # Firebase configuration.
│   ├── Forgetpassword.js # Component for password recovery.
│
├── .gitignore            # Git ignore file.
├── eslint.config.js      # ESLint configuration.
├── index.html            # Main HTML file.
├── nodemon.json          # Nodemon configuration for server.
├── package.json          # Project dependencies and scripts.
├── server.js             # Express server setup.
├── vite.config.js        # Vite configuration for development.
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/zs0c131y/hive.git
   cd hive
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up Firebase:
   - Configure `firebase.js` with your Firebase project credentials.

4. Start the development server:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

### Deployment

This project is hosted on [Render](https://render.com). For deployment:

1. Commit your changes and push them to the main branch:

   ```bash
   git add .
   git commit -m "Your message"
   git push origin main
   ```

2. Render will automatically detect changes and deploy the updated version.

### Contributing

Contributions are welcome! Please open an issue or submit a pull request.

### License

No information is available.

### Acknowledgements

- [Firebase](https://firebase.google.com/)
- [React](https://reactjs.org/)
- [Node.js](https://nodejs.org/)

## Contact

For any questions or feedback, please reach out to the project maintainers through the repository or [send an email](mailto:info.projecthive@gmail.com).
