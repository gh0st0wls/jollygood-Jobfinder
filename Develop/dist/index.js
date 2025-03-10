import inquirer from 'inquirer';
import { pool, connectToDb } from './db/connection.js';
async function viewAllEmployees() {
    try {
        const result = await pool.query(`
            SELECT
                e.id AS employee_id,
                e.first_name,
                e.last_name,
                r.title AS role,
                d.name AS department,
                r.salary,
                e.manager_id,
                CONCAT(m.first_name, ' ', m.last_name) AS manager_name
            FROM employees e
            JOIN roles r ON e.role_id = r.id
            JOIN departments d ON r.department_id = d.id
            LEFT JOIN employees m ON e.manager_id = m.id
            `);
        console.table(result.rows);
    }
    catch (error) {
        console.error('Error fetching employees. Try again.', error);
    }
}
export async function addEmployee() {
    try {
        const roles = await pool.query('SELECT * FROM roles;');
        const employees = await pool.query('SELECT * FROM employees;');
        const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
            { type: 'input', name: 'first_name', message: 'Enter first name:' },
            { type: 'input', name: 'last_name', message: 'Enter last name:' },
            { type: 'list', name: 'role_id', message: 'Select role:', choices: roles.rows.map((r) => ({ name: r.title, value: r.id })) },
            { type: 'list', name: 'manager_id', message: 'Select manager:', choices: [...employees.rows.map((e) => ({ name: `${e.first_name} ${e.last_name}`, value: e.id })), { name: 'None', value: null }] }
        ]);
        await pool.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4);', [first_name, last_name, role_id, manager_id]);
        console.log(`Employee "${first_name} ${last_name}" added!`);
    }
    catch (err) {
        console.error('Error adding employee:', err);
    }
}
export async function updateEmployeeRole() {
    try {
        const employees = await pool.query('SELECT * FROM employees;');
        const roles = await pool.query('SELECT * FROM roles;');
        const { employees_id, roles_id } = await inquirer.prompt([
            { type: 'list', name: 'employee_id', message: 'Select employee:',
                choices: employees.rows.map((e) => ({ name: `${e.first_name} ${e.last_name}`, value: e.id })) },
            { type: 'list', name: 'role_id', message: 'Select new role:',
                choices: roles.rows.map((r) => ({ name: r.title, value: r.id })) }
        ]);
        await pool.query('UPDATE employees SET role_id = $1 WHERE id = $2;', [roles_id, employees_id]);
        console.log('Employee role updated successfully!');
    }
    catch (err) {
        console.error('Error updating employee role:', err);
    }
}
async function viewAllRoles() {
    try {
        const result = await pool.query('SELECT * FROM roles');
        console.table(result.rows);
    }
    catch (error) {
        console.error('Error viewing roles:', error);
    }
}
export async function addRole() {
    try {
        const departments = await pool.query('SELECT * FROM departments;');
        const { title, salary, department_id } = await inquirer.prompt([
            { type: 'input',
                name: 'title',
                message: 'Enter role title:' },
            { type: 'input',
                name: 'salary',
                message: 'Enter salary:',
                validate: input => !isNaN(input) || 'Please enter a valid number' },
            { type: 'list',
                name: 'department_id',
                message: 'Select department:',
                choices: departments.rows.map((d) => ({ name: d.name, value: d.id })) }
        ]);
        await pool.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3);', [title, parseFloat(salary), department_id]);
        console.log(`Role "${title}" added!`);
    }
    catch (err) {
        console.error('Error adding role:', err);
    }
}
async function viewAllDepartments() {
    try {
        const result = await pool.query('SELECT * FROM departments');
        console.table(result.rows);
    }
    catch (error) {
        console.error('Error viewing departments:', error);
    }
}
async function addDepartment() {
    // Prompt for department selection
    const { departmentsName } = await inquirer.prompt([
        {
            type: 'input',
            name: 'departmentsName',
            message: 'Enter the name of the departments you would like to add:',
            validate: (input) => input.trim() !== '' || 'Departments name cannot be empty.',
        },
    ]);
    try {
        const existingDepartmentResult = await pool.query('SELECT * FROM departments WHERE name = $1', [departmentsName]);
        if (existingDepartmentResult.rows.length > 0) {
            console.log(`Department ${departmentsName} already exists.`);
            return;
        }
        // Insert department data into the departments table
        const existingDepartment = await pool.query('SELECT * FROM departments WHERE name = $1', [departmentsName]);
        if (existingDepartment.rows.length > 0) {
            console.log(`Department ${departmentsName} already exists.`);
        }
        else {
            await pool.query('INSERT INTO departments (name) VALUES ($1)', [departmentsName]);
            console.log(`Department ${departmentsName} added successfully.`);
        }
        console.log(`Departments ${departmentsName} added successfully.`);
    }
    catch (error) {
        console.error('Error adding department:', error);
    }
}
async function mainMenu() {
    const { action } = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Quit',],
        },
    ]);
    switch (action) {
        case 'View All Employees':
            await viewAllEmployees();
            break;
        case 'Add Employee':
            await addEmployee();
            break;
        case 'Update Employee Role':
            await updateEmployeeRole();
            break;
        case 'View All Roles':
            await viewAllRoles();
            break;
        case 'Add Role':
            await addRole();
            break;
        case 'View All Departments':
            await viewAllDepartments();
            break;
        case 'Add Department':
            await addDepartment();
            break;
        case 'Quit':
            process.exit();
    }
    await mainMenu();
}
(async () => {
    await connectToDb();
    await mainMenu();
})();
