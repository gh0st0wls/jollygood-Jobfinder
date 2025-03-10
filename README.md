# jollygood-Jobfinder

Description

The Employee Tracker is a command-line application that helps businesses manage their company database. It allows users to view, add, and update information about departments, roles, and employees within an organization using an interactive prompt.

Video https://drive.google.com/file/d/19KNagi0YmOnPSEeBOtH57SAo4djOgLxC/view?usp=sharingLinks to an external site.

Features

View all departments, roles, and employees table

Add new departments, roles, and employees

Update employee roles

Technologies Used Inquirer, pg, dotenv,

Installation

Clone the repository:

git clone

Navigate to the project directory:

cd Workforce Watcher

Install dependencies:

npm install

Database Setup

Configure the database connection in a .env file:

DB_USER='your_username' DB_PASSWORD='your_password' DB_NAME='your_database' DB_HOST='localhost' DB_PORT=3306 # or 5432 for PostgreSQL

Create and seed the database: psql -U postgres \i schema.sql; \i seed.sql; node db/setup.js

Usage

Start the application npm start

Example Commands

View all employees

Add a department

Update an employee role

Future Enhancements

Implement employee manager tracking

Allow salary updates

Generate employee reports

License

This project is licensed under the MIT License.