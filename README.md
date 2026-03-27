<p align="center">
  <img src="assets/logo.svg" width="170">
</p>

<h1 align="center">MyOwnSpace</h1>

<p align="center">
Open-source self-hosted cloud storage platform with multi-client synchronization.
</p>

<p align="center">
<img src="https://img.shields.io/badge/platform-Windows%20%7C%20Linux%20%7C%20Android%20%7C%20Web-blue">
<img src="https://img.shields.io/badge/server-NodeJS-green">
<img src="https://img.shields.io/badge/database-SQLite-orange">
<img src="https://img.shields.io/badge/license-MIT-brightgreen">
</p>

---

## 📌 Overview

**MyOwnSpace** is an open-source platform that allows users to host their own private cloud storage server and synchronize files across desktop, mobile and web clients.

The platform is designed to be easy to deploy on Windows using a dedicated graphical server application, while also allowing manual deployment on Linux environments.

---

## ✨ Features

* Self-hosted cloud storage platform
* Dedicated **Windows server GUI application** built with WPF / .NET
* Cross-platform clients built using Flutter & Dart
* Windows / Linux / Android / Web apps
* HTTPS only communication (certificate required)
* Unlimited user accounts
* Shared storage model (all users access the same storage folder)
* Supports all file types *(except folders)*
* Material Design based UI (Material 2 / Material 3)
* Email verification on first login (desktop/mobile/linux)
* Permanent verification flow on Web
* Brute-force protection system with automatic server shutdown
* Admin email alerts when server shuts down
* Admin panel for:

  * user management
  * server configuration
  * IP attack threshold configuration

---

## 🧱 Architecture

```
Clients (Flutter)
   │
HTTPS
   │
Node.js Server
   │
SQLite Database
   │
Shared Storage Folder
```

---

## 📷 Screenshots

### Windows Server Application
### 🖥️ Windows Server Application

<details>
<summary>📷 Win-Server Screenshots </summary>

<br>

<p align="center">
  <a href="assets/p1.png">
    <img src="assets/p1.png" width="600"><br>
    <sub><b>Step 1: Initial Setup Page</b></sub>
  </a>
</p>

<p align="center">
  <a href="assets/p2.png">
    <img src="assets/p2.png" width="600"><br>
    <sub><b>Step 2: Admin Configuration</b></sub>
  </a>
</p>

<p align="center">
  <a href="assets/p3.png">
    <img src="assets/p3.png" width="600"><br>
    <sub><b>Step 3: Add User Page</b></sub>
  </a>
</p>

<p align="center">
  <a href="assets/p4.png">
    <img src="assets/p4.png" width="600"><br>
    <sub><b>Step 4: Final</b></sub>
  </a>
</p>

</details>

### 🪟🐧📱🌐Client Applications

<details>
<summary>📷 Windows/Linux/Android/Web Screenshots </summary>

<br>

<p align="center">
  <a href="assets/p1.png">
    <img src="assets/d1.png" width="600"><br>
    <sub><b>Step 1: Initial Setup Page</b></sub>
  </a>
</p>

<p align="center">
  <a href="assets/p2.png">
    <img src="assets/d2.png" width="600"><br>
    <sub><b>Step 2: Admin Configuration</b></sub>
  </a>
</p>

<p align="center">
  <a href="assets/p3.png">
    <img src="assets/d3.png" width="600"><br>
    <sub><b>Step 3: Add User Page</b></sub>
  </a>
</p>

<p align="center">
  <a href="assets/p4.png">
    <img src="assets/d4.png" width="600"><br>
    <sub><b>Step 4: Final</b></sub>
  </a>
</p>

</details>

---

## ⬇️ Installation

### 🪟 Windows Server (Recommended)

1. Download `my_own_space_win_server_installer.exe`
2. Run the installer and complete setup
3. Launch the server application **as Administrator**
4. Configure:

   * HTTPS certificate
   * server port
   * admin email
   * IP brute-force threshold(SAC)
5. Start the server

---

### 🐧 Linux Server (Manual Setup)

> Minimal manual setup required.

Requirements:

* Node.js
* SQLite

Steps:

```bash
cd my_own_space_server_code
node setup_database.js
node start_server.js
```

Manual database configuration instructions will be added later.

---

## 🌐 Port Forwarding & HTTPS

To allow external access:

* Forward the configured server port in your router
* Install a valid HTTPS certificate
* Ensure firewall allows incoming connections

---

## 💻 Client Applications

Clients are available for:

* Windows
* Linux
* Android
* Web

All clients connect using:

```
Server IP / Domain
Port
User Email
Verification Code
```

---

## 📁 Repository Structure

```
/my_own_space_desktop
/my_own_space_mobile
/my_own_space_server_app
/my_own_space_server_code
/my_own_space_web
LICENSE
README.md
```

---

## 🔐 Security

* HTTPS enforced communication
* Email verification login flow
* Automatic shutdown on brute-force attack detection
* Admin alert email system

---
