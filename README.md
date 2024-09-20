# CECS544_Project_Bughound

# Bughound - Bug Tracking Application

Bughound is a web-based bug tracking application developed using Spring Boot (back-end), RESTful API services, MySQL (database), and ReactJS (front-end). It helps developers and testers collaborate effectively by reporting and managing bugs encountered in applications under development.

---

## Introduction
Bughound enables developers and testers to report bugs, track their status, and resolve issues efficiently. It simplifies the bug reporting process and provides an intuitive interface for tracking and managing bug reports within projects. The application is role-based, meaning different users have access to specific functionalities based on their assigned roles.

---

## Features
- **Role-based Access**: Supports Admin, Developer, and Tester roles with unique privileges.
- **Bug Reporting**: Create detailed bug reports using the bug report form.
- **Bug Tracking**: Track the status of bugs and view assigned tasks.
- **Program Management**: Admins can manage programs, versions, and function areas.
- **Media Support**: Upload media files (e.g., screenshots, logs) to bug reports.
- **Commenting System**: Add comments to bug reports in a timeline view.
- **Input Validation**: Enforced validation ensures accuracy and consistency.
- **Dynamic Dropdowns**: Run-time generation of dropdown options based on context.

---

## Screenshorts

### Bug Report Template
![Bug_Report_Template](https://github.com/itsaravindanand/CECS544_Project_Bughound/blob/main/BugHound_Application/Screenshots/Bug_Report_Template.png)

### Login Page
![Login page](https://github.com/itsaravindanand/CECS544_Project_Bughound/blob/main/BugHound_Application/Screenshots/Login_Page.png)

### User Creation
![User_Creation page](https://github.com/itsaravindanand/CECS544_Project_Bughound/blob/main/BugHound_Application/Screenshots/User_Creation_Page.png)

### Bug Report
![Bug_Report page](https://github.com/itsaravindanand/CECS544_Project_Bughound/blob/main/BugHound_Application/Screenshots/Bug_Report_1.png)
![Bug_Report_page](https://github.com/itsaravindanand/CECS544_Project_Bughound/blob/main/BugHound_Application/Screenshots/Bug_Report_2.png)

### Admin Dashboard
![Admin page](https://github.com/itsaravindanand/CECS544_Project_Bughound/blob/main/BugHound_Application/Screenshots/Admin_Dashboard.png)

### Adding Programs and Version 
![Adding_Program_page](https://github.com/itsaravindanand/CECS544_Project_Bughound/blob/main/BugHound_Application/Screenshots/Adding_Programs_Page.png)

### Adding Function Areas for Programs 
![Adding_Function_Areas_page](https://github.com/itsaravindanand/CECS544_Project_Bughound/blob/main/BugHound_Application/Screenshots/Adding_Function_Areas_Page.png)

## Testing Videos

### [Part 1](https://www.youtube.com/watch?v=rJG6RzyZJU8)
### [Part 2](https://www.youtube.com/watch?v=FxGbGtscBV8)
### [Part 3](https://www.youtube.com/watch?v=zVdB5gBmDQQ)

## Installation
### Prerequisites
- Java 11+
- Node.js (for React)
- MySQL 5.7+
- Maven (for Spring Boot)

### Steps
1. **Clone the Repository**
- Clone the back-end maven project and update the SQL connection and database details in the application.properties file, execute the Schema and add a user with admin previlege for testing purposes, run the spring boot application and expose the APIs
- Clone the front-end react project and launch the application to test the UI
