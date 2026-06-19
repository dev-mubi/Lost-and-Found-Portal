# Found it

A campus-based lost and found management system that helps students report lost and found items, browse available listings, upload item images, manage their profiles, and submit feedback through a centralized web platform.

## Overview

Found it is a React-based web application designed for university communities. Instead of relying on scattered WhatsApp messages, group posts, or manual coordination, the app provides one place where students can report lost items, share found items, and view relevant item details.

The application supports authentication, lost/found item reporting, image uploads, searchable listings, profile management, and feedback submission.

## Features

* User registration and login
* University email-based signup validation
* Dashboard for quick access to major actions
* Report lost items
* Report found items
* Upload item images
* Browse lost item listings
* Browse found item listings
* Search items by name or location
* View item details such as name, location, date, description, and contact information
* Manage user profile information
* Submit feedback or bug reports
* Access About, Terms, and Contact pages

## Tech Stack

* React
* Vite
* Supabase
* React Router
* Lucide React
* ESLint

## Project Structure

```txt
Lost-and-Found-Portal/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Feedback.jsx
│   │   ├── FoundItems.jsx
│   │   ├── Login.jsx
│   │   ├── LostItems.jsx
│   │   ├── Profile.jsx
│   │   ├── Report.jsx
│   │   ├── Signup.jsx
│   │   └── Terms.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── supabase.js
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm

### Installation

Clone the repository:

```bash
git clone https://github.com/your-username/Lost-and-Found-Portal.git
cd Lost-and-Found-Portal
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The application uses these values to connect with Supabase for authentication, database operations, and storage.

## Running the Project

Start the development server:

```bash
npm run dev
```

Build the project for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

## Main Routes

| Route        | Purpose                            |
| ------------ | ---------------------------------- |
| `/login`     | User login                         |
| `/signup`    | User registration                  |
| `/dashboard` | Main user dashboard                |
| `/profile`   | User profile management            |
| `/lost`      | Lost item listings                 |
| `/found`     | Found item listings                |
| `/report`    | Submit a lost or found item report |
| `/feedback`  | Submit feedback or bug reports     |
| `/about`     | Project information                |
| `/terms`     | Terms and usage guidelines         |
| `/contact`   | Contact page                       |

## Supabase Usage

The project uses Supabase for:

* User authentication
* User profile data
* Lost and found item records
* Feedback submissions
* Item image storage

Expected Supabase resources may include:

* `profiles` table
* `items` table
* `feedback` table
* `item-images` storage bucket

## Contributing

Contributions are welcome.

To contribute:

1. Fork the repository.
2. Create a new branch:

```bash
git checkout -b feature-or-fix-name
```

3. Make your changes.
4. Test the project locally.
5. Run linting and build checks:

```bash
npm run lint
npm run build
```

6. Commit your changes:

```bash
git commit -m "Describe your change"
```

7. Push your branch:

```bash
git push origin feature-or-fix-name
```

8. Open a pull request.

## Suggested Contribution Areas

* Improve responsive design
* Add loading and empty states
* Improve form validation
* Add better error handling
* Improve accessibility
* Refactor repeated UI patterns into reusable components
* Add screenshots to the README
* Add Supabase setup notes for tables, storage buckets, and policies

## License

No license has been specified yet. Please contact the repository owner before using or redistributing this project.
