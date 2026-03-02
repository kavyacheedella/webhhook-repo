# GitHub Webhook Event Tracker

This project captures GitHub repository activity using **GitHub Webhooks** and displays it in a simple web interface.

The application listens for GitHub events like **Push**, **Pull Request**, and **Merge**, stores them in **MongoDB**, and displays the latest repository activity on the UI.

---

## Features

- Capture GitHub **Push events**
- Capture **Pull Request events**
- Detect **Merge events**
- Store webhook data in **MongoDB**
- Display repository activity in a clean UI
- UI automatically refreshes every **15 seconds**

---

## Technologies Used

- Python
- Flask
- MongoDB
- GitHub Webhooks
- HTML
- CSS
- JavaScript

---

## Project Structure

webhook-repo
│
├── app.py
├── requirements.txt
├── README.md
│
├── templates
│ └── index.html
│
├── static
│ ├── script.js
│ └── style.css

---

## How It Works

1. GitHub sends webhook events when actions occur in the repository.
2. Flask receives the webhook at `/webhook`.
3. Event data is stored in MongoDB.
4. The frontend polls the `/events` API every 15 seconds.
5. The UI displays repository activity.

---

## Example Output

Kavya pushed to main on Tue, 03 Mar 2026
Kavya submitted a pull request from dev to main
Kavya merged branch dev to main

---

## Repositories

- **action-repo** → used to trigger GitHub events
- **webhook-repo** → contains webhook receiver and UI
