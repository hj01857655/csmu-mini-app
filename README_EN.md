# CSMU Educational Administration System Mini-App

<div align="center">
  <img src="static/logo.png" alt="CSMU Logo" width="120" height="120">
  
  <h3>🎓 Modern University Educational Administration Management System</h3>
  
  [![GitHub stars](https://img.shields.io/github/stars/hj01857655/csmu-mini-app?style=flat-square)](https://github.com/hj01857655/csmu-mini-app/stargazers)
  [![GitHub forks](https://img.shields.io/github/forks/hj01857655/csmu-mini-app?style=flat-square)](https://github.com/hj01857655/csmu-mini-app/network)
  [![GitHub issues](https://img.shields.io/github/issues/hj01857655/csmu-mini-app?style=flat-square)](https://github.com/hj01857655/csmu-mini-app/issues)
  [![License](https://img.shields.io/github/license/hj01857655/csmu-mini-app?style=flat-square)](LICENSE)
</div>

## 📖 Project Overview

The CSMU Educational Administration System Mini-App is a modern university educational management system built with uni-app framework, providing convenient educational services for students and teachers. The system features responsive design, multi-platform deployment support, comprehensive functional modules, and excellent user experience.

## ✨ Key Features

### 🔐 User Authentication System
- **Dual-Mode Login**: Support for both student and teacher login modes
- **Secure Authentication**: Encrypted password storage with remember password functionality
- **Login History**: Smart login history saving for quick account switching
- **Auto Login**: Secure automatic login mechanism

### 📅 Course Management
- **Schedule Viewing**: Clear weekly course schedule with week switching support
- **Time Standardization**: Unified 50-minute class period system
- **Real-time Updates**: Smart week calculation with automatic current week recognition
- **Course Details**: Detailed course information display

### 📊 Grade Inquiry
- **Multi-Semester Query**: Support for viewing grades from different semesters
- **Grade Statistics**: GPA calculation and grade analysis
- **Grade Export**: Support for grade data export functionality

### 👤 Personal Center
- **Information Management**: Personal profile viewing and editing
- **Password Change**: Secure password modification functionality
- **System Settings**: Personalized setting options

### 🎯 Teaching Evaluation
- **Course Evaluation**: Complete course evaluation system
- **Evaluation Management**: Evaluation history viewing and management
- **Anonymous Evaluation**: Privacy-protected evaluation mechanism

### 📢 Campus Services
- **Notifications**: Timely campus notification push
- **Exam Schedule**: Exam time and location inquiry
- **Course Selection**: Online course selection functionality
- **Semester Information**: Semester arrangements and important milestones

## 🛠️ Technology Stack

### Frontend Framework
- **uni-app**: Cross-platform application development framework
- **Vue.js**: Progressive JavaScript framework
- **CSS3**: Modern styling design

### Development Tools
- **HBuilderX**: Officially recommended development tool
- **Git**: Version control system
- **ESLint**: Code quality checking

### Core Features
- **Responsive Design**: Adapts to different screen sizes
- **Modular Architecture**: Clear code organization structure
- **Security Mechanisms**: Data encryption and secure storage
- **Performance Optimization**: Caching mechanisms and lazy loading

## 📱 Page Structure

```
pages/
├── login/                 # Login page
├── home/                  # Home page
├── schedule/              # Course schedule
├── grades/                # Grade inquiry
├── profile/               # Personal center
├── exam/                  # Exam schedule
├── course-selection/      # Course selection system
├── notices/               # Campus notifications
├── semester-info/         # Semester information
├── evaluation/            # Teaching evaluation
├── evaluation-form/       # Evaluation form
├── evaluation-detail/     # Evaluation details
├── profile-detail/        # Personal profile
├── change-password/       # Change password
├── edit-profile/          # Edit information
└── test-week/            # Week testing (development tool)
```

## 🚀 Quick Start

### Requirements
- Node.js >= 14.0.0
- HBuilderX >= 3.0.0
- WeChat Developer Tools (optional)

### Installation Steps

1. **Clone the Project**
```bash
git clone https://github.com/hj01857655/csmu-mini-app.git
cd csmu-mini-app
```

2. **Install Dependencies**
```bash
npm install
```

3. **Development Run**
```bash
# Open project in HBuilderX
# Select run to browser or mini-program platform
```

4. **Build for Production**
```bash
# Select publish in HBuilderX
# Choose target platform for building
```

## 📋 Usage Instructions

### Student Users
1. Select "Student Login" mode
2. Enter student ID and password
3. View course schedule, grades, exam arrangements, etc.
4. Perform course evaluation and course selection operations

### Teacher Users
1. Select "Teacher Login" mode
2. Enter employee ID and password
3. View teaching arrangements and course information
4. Manage courses and view evaluation results

## 🔧 Development Guide

### Project Structure
```
csmu-mini-app/
├── pages/                 # Page files
├── static/                # Static resources
├── utils/                 # Utility functions
├── services/              # Service layer
├── components/            # Component library
├── docs/                  # Documentation directory
├── manifest.json          # Application configuration
├── pages.json             # Page configuration
└── uni.scss              # Global styles
```

### Core Utility Modules
- `utils/semester.js` - Semester and week calculation
- `utils/date-formatter.js` - Time formatting
- `utils/course-time.js` - Course time management
- `utils/secure-storage.js` - Secure storage
- `services/auth.js` - Authentication service

### Development Standards
- Use ES6+ syntax
- Follow Vue.js best practices
- Unified code formatting
- Comprehensive error handling

## 🤝 Contributing

We welcome all forms of contributions! Please read the [Contributing Guide](CONTRIBUTING.md) for detailed information.

### How to Contribute
1. Fork this repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact Us

- **Project Maintainer**: hj01857655
- **Email**: 1292548381@qq.com
- **GitHub**: [@hj01857655](https://github.com/hj01857655)

## 🙏 Acknowledgments

Thanks to all developers and users who have contributed to this project!

---

<div align="center">
  <p>If this project helps you, please give us a ⭐️</p>
  <p>Made with ❤️ by CSMU Development Team</p>
</div>
