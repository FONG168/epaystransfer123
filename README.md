# ePay - Transfer Money Globally

A modern, responsive web application for global money transfers with multi-level user accounts and task-based earning system.

## Features

- **User Authentication**: Secure login and registration system
- **Dashboard**: Comprehensive user dashboard with balance tracking
- **Multi-Level System**: Progressive account levels with increasing benefits
- **Task Management**: Daily tasks for earning rewards
- **Market Data**: Real-time exchange rates and market information
- **Transaction History**: Complete transaction and activity tracking
- **Profile Management**: User profile and account settings
- **Business Accounts**: Dedicated business account features
- **Global Transfers**: International money transfer capabilities

## Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS, Custom CSS
- **Icons**: Font Awesome
- **Storage**: LocalStorage for client-side data persistence
- **Deployment**: Vercel (Static Site)

## Project Structure

```
├── index.html              # Landing page
├── dashboard.html          # Main user dashboard
├── tasks.html             # Task management page
├── market.html            # Market data and exchange rates
├── history.html           # Transaction history
├── profile.html           # User profile management
├── business-account.html  # Business account features
├── send-money.html        # Money transfer interface
├── exchange-rates.html    # Exchange rate information
├── about.html             # About page
├── styles.css             # Main stylesheet
├── dashboard.js           # Dashboard functionality
├── tasks.js               # Task management logic
├── market.js              # Market data handling
├── history.js             # Transaction history logic
├── profile.js             # Profile management
├── script.js              # General utilities and shared functions
├── modal-handlers.js      # Modal functionality
├── epay-storage.js        # Data storage utilities
├── epay-data-sync.js      # Data synchronization
└── package.json           # Project configuration
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd epay
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Deployment

The application is configured for deployment on Vercel:

1. Connect your repository to Vercel
2. Deploy with automatic builds
3. Configure custom domain (optional)

## Configuration

### Environment Setup
- No environment variables required for basic functionality
- All configuration is handled through the `vercel.json` file

### Custom Domains
Update the `vercel.json` file to configure custom domains and routing rules.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@epay.com or create an issue in the repository.

---

**ePay Team** - Building the future of global money transfers
