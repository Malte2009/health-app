# Health App

The Health App is a Vue 3-based application designed to help users track their fitness activities, training logs, and body metrics. It provides features for managing training sessions, exercises, and sets, as well as user authentication and registration.

## Features

- **User Authentication**: Secure login and registration system.
- **Training Management**: Create, edit, and delete training logs.
- **Exercise Tracking**: Add and manage exercises within training sessions.
- **Set Management**: Add, edit, and delete sets for exercises.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Project Structure

The project is organized as follows:

- **`src/views`**: Contains Vue components for pages like Login, Sign Up, Trainings, and Training Details.
- **`src/components`**: Reusable components for exercises, sets, and general UI elements like the navigation bar.
- **`src/services`**: API service modules for interacting with the backend.
- **`src/stores`**: Pinia stores for managing application state.
- **`src/types`**: TypeScript definitions for data models like training, exercise, and set.
- **`src/assets`**: Static assets like CSS and fonts.

## Technologies Used

- **Vue 3**: Frontend framework.
- **Pinia**: State management.
- **Vue Router**: Routing system.
- **Axios**: HTTP client for API requests.
- **TypeScript**: Strongly typed programming language.
- **Vite**: Build tool for fast development.

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/health-app.git
   cd health-app
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

### Development

Start the development server:
```sh
npm run dev
```

### Build for Production

Run the following command to build the project:
```sh
npm run build
```

### Linting and Formatting

Lint the code using ESLint:
```sh
npm run lint
```

Format the code using Prettier:
```sh
npm run format
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory to configure environment variables. Example:
```
VITE_API_URL=localhost
```

### TypeScript Configuration

The project uses multiple `tsconfig.json` files for different purposes:
- **`tsconfig.app.json`**: For the application code.
- **`tsconfig.node.json`**: For Node.js-related configurations.

## Recommended IDE Setup

- [Visual Studio Code](https://code.visualstudio.com/)
- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur)


## License

This project is licensed under the MIT License. See the LICENSE file for details.
