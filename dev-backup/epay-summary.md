# ePay App – Coding Process & Page Flow Summary

## 1. Login & Sign Up
- **Purpose:** Allow users to create an account or log in.
- **Process:**
  - User enters credentials (email, password, etc.).
  - On sign up, user data is saved (likely in `localStorage` or backend).
  - On login, credentials are checked and user data is loaded.
  - After successful login/sign up, user is redirected to the Dashboard.

## 2. Dashboard Page (`dashboard.html` + `dashboard.js`)
- **Purpose:** Main user hub showing balance, level, tasks, and quick actions.
- **Features:**
  - Loads user data from `localStorage` (with structure validation and defaults).
  - Displays balance, total earned, tasks completed, and current level.
  - Shows level cards (locked/unlocked/active) with deposit and activation options.
  - Handles deposit process via a live chat modal, supporting multiple payment methods.
  - Navigation to other pages (Tasks, Market, History, Profile).
  - Responsive UI with event listeners for all actions.

## 3. Task Page (`tasks.html` + `tasks.js`)
- **Purpose:** Where users complete daily tasks to earn rewards.
- **Features:**
  - Lists available tasks based on user’s current level.
  - Tracks tasks completed and updates user progress.
  - On task completion, updates user’s balance and task count.
  - May include logic to limit daily tasks based on level.

## 4. Market Page (`market.html` + `market.js`)
- **Purpose:** Shows market-related info, possibly for trading or viewing rates.
- **Features:**
  - Displays exchange rates or market data.
  - May allow users to interact with market features (buy/sell, view trends).
  - Integrates with user’s balance and transaction history if needed.

## 5. History Page (`history.html` + `history.js`)
- **Purpose:** Shows user’s transaction and task history.
- **Features:**
  - Lists deposits, withdrawals, and completed tasks.
  - Allows users to review past activity.
  - May include filters or search for specific transactions.

## 6. Profile Page (`profile.html` + `profile.js`)
- **Purpose:** User account management.
- **Features:**
  - Displays user info (email, level, etc.).
  - Allows editing of profile details.
  - May include security settings, password change, and logout.

## General Coding Practices
- **Data Persistence:** Uses `localStorage` for user data, with structure validation and default values.
- **UI/UX:** Modern, responsive design with clear navigation and feedback.
- **Event Handling:** All buttons and actions are wired with event listeners for smooth navigation and interactivity.
- **Modularity:** Each page has its own JS file for logic, keeping code organized.
- **Security:** Basic validation for user input (e.g., email format).

---

This flow ensures a seamless user experience from account creation to daily use, with clear separation of concerns for each page and robust handling of user data and actions.
