# Mira Network - AirdropToken Mining Automation

This Node.js script automates logging into multiple AirdropToken accounts, starts mining, disables ads, and continuously monitors user and mining status in real-time with scheduled daily execution.

## Features

- Bulk login to multiple accounts from `accounts.txt`
- Automatically starts mining and disables ads for each account
- Real-time monitoring of mining stats and user info every 5 seconds
- Graceful shutdown on Ctrl+C
- Scheduled to rerun every 24 hours to maintain mining activity

## Installation

1. Clone the repository:

```bash
git clone https://github.com/zcsaqueeb/Mira-Network-.git
cd Mira-Network-
```

2. Install dependencies:

```bash
npm install axios
```

## Usage

1. Prepare an `accounts.txt` file with one JSON account per line, for example:

```json
{"email":"user@example.com","password":"password123"}
```

2. Run the script:

```bash
node slow_mining.js // for only one ya 5 accounts

node fast_mining.js  // for multiple mining accounts
```

3. The script will:

- Load accounts from `accounts.txt`
- Login and start mining for each account
- Display live mining info for each account
- Repeat the process every 24 hours automatically

Press `Ctrl+C` to stop monitoring.

## Notes

- Ensure your `accounts.txt` is properly formatted.
- The script uses embedded Firebase API keys.
- Use responsibly and comply with AirdropToken's terms of service.

## License

Repository: [https://github.com/zcsaqueeb/Mira-Network-.git](https://github.com/zcsaqueeb/Mira-Network-.git)
```
If you want, I can help you generate a `requirements.txt` or further improve the UI output!
