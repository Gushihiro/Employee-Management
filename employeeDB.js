const mysql = require('mysql');
const inquirer = require('inquirer');
const fs = require('fs');
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'cms_DB'
});

connection.connect((err) => {
    if (err) throw err;
    fs.readFile('ascii.txt', 'utf8', (err, data) => {
        if(err) throw err;
        console.log(data);
        mainMenu();
    })
})

const mainMenu = () => {
    inquirer.prompt({
        name: 'choices',
        type: 'list',
        message: 'Welcome to the Gushihiro Management Systems. What would you like to do?',
        choices: ["View All Departments", "View Roles", "View All Employees", "Add Department", "Add Role", "Add Employee", "Update Employee"]
    }).then(answers => {
        switch(answers.choices) {
            case "View All Departments":
                viewAllDepartments();
                break;
            case "View Roles":
                viewRoles();
                break;
            case "View All Employees":
                viewAllEmployees();
                break;
            case "Add Department":
                addDepartment();
                break;
            case "Add Role":
                addRole();
                break;
        }
    })
}

const viewAllDepartments = () => {
    connection.query(`
    SELECT department.name AS Department
    FROM department`,
        (err, res) => {
            if(err) throw err;
            console.table(res);
            mainMenu();
        })
}

const viewRoles = () => {
    connection.query(`
    SELECT title AS Title, 
           salary AS Salary, 
           department.name AS Department
    FROM role
    JOIN department
    ON role.department_id = department.id
    `,
        (err, res) => {
            if(err) throw err;
            console.table(res);
            mainMenu();
        })
}

const viewAllEmployees = () => {
    connection.query(`
    SELECT e.id AS 'Employee #', 
           CONCAT(e.first_name, ' ', e.last_name) AS 'Employee Name',
           role.title AS 'Job Title', 
           department.name AS 'Department', 
           role.salary AS 'Salary', 
           CONCAT(m.first_name, ' ', m.last_name) AS 'Manager'
    FROM employee e 
    LEFT JOIN role 
    ON e.role_id = role.id
    LEFT JOIN department 
    ON role.department_id = department.id
    LEFT JOIN employee m 
    ON e.manager_id = m.id;
    `,
        (err, res) => {
            if(err) throw err;
            console.table(res);
            mainMenu();
        })
}

const addDepartment = () => {
    inquirer.prompt({
        name: "dept",
        type: 'input',
        message: "Enter the name of the new department."
    }).then(answers => {
        connection.query('INSERT INTO department SET ?', {name: answers.dept}, (err) => {
            if (err) throw err;
            mainMenu();
        })
    })   
}

const addRole = () => {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        const deptArray = [];
        for (let i = 0; i < res.length; i++) {
            deptArray.push(res[i].id, res[i].name)
            
        }
    })
    inquirer.prompt([
        {
            name: 'role',
            type: 'input',
            message: 'What role are you adding?'
        },
        {
            name: 'salary',
            type: 'input',
            message: "What is this role's salary?",
            validate: (value) => {
                if (Number(value)) {
                    return true;
                }
                return false;
            }
        },
        {
            name: 'dept',
            type: 'list',
            message: 'Which department is this role in?',
            choices: deptArray
        }
    ]).then(answers => {
        connections.query(
            'INSERT INTO role SET ?',
            {
                title: answers.role,
                salary: answers.salary,
                department: answers.dept
            },
            (err) => {
                if(err) throw err;
                mainMenu();
            })
    }).catch(err => {
        if (err) throw err;
    })
}