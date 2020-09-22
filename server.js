const inquirer = require('inquirer');
const express = require('express');
require('console.table');
const db = require('./db/connection')

const mysql = require('mysql2');

const PORT = process.env.PORT || 3030;
const app = express();

//middleware for express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Default response for any other requests Catch all
app.use((req, res) => {
    res.status(404).end();
});


db.connect(err => {
    if (err) throw err;
    companyPrompt();
});



//Function LIST
//View all departments
//View all roles
//View all employees
//Add a department
//Add a role
//Add an employee
// BONUS
// Update employee managers
// View employees by manager
// View employees by department
// Delete Departments, Roles, and Employees.
// View total salaries of a department.
// all with associated prompts

//Starting prompt
const companyPrompt = function () {
    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "What would you like to do?",
            choices: [
                "View all departments",
                "View all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Update employee managers",
                "View employees by manager",
                /*
                "View employees by department",
                "Delete departments",
                "Delete roles",
                "Delete employees",
                "View department budgets (total salary)"
                */
            ],
            validate: responseSelection => {
                if (responseSelection) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    ])
        .then((responses) => {
            const { selection } = responses;

            if (selection === "View all departments") {
                viewAllDepartments();
            }
            if (selection === "View all roles") {
                viewAllRoles();
            }
            if (selection === "View all employees") {
                viewAllEmployees();
            }
            if (selection === "Add a department") {
                addDepartment();
            }
            if (selection === "Add a role") {
                addRole();
            }
            if (selection === "Add an employee") {
                addEmployee();
            }
            if (selection === "Update employee managers") {
                updateEmployee();
            }
            if (selection === "View employees by manager") {
                viewEmployeesManager();
            }
            /*
            if (selection === "View employees by department") {
                viewEmployeesDepartment();
            }
            if (selection === "Delete departments") {
                deleteDepartments();
            }
            if (selection === "Delete roles") {
                deleteRoles();
            }
            if (selection === "Delete employees") {
                deleteEmployees();
            }
            if (selection === "View department budgets (total salary)") {
                viewBudget();
            }
            */
        });
}

//View all departments viewAllDepartments();
const viewAllDepartments = () => {
    const sql2 = `SELECT * FROM department ORDER BY name DESC`;
    console.log('Viewing all departments');

    db.query(sql2, (err, rows) => {
        if (err) throw err;
        console.table(rows);

    }).then(() => companyPrompt());
};

//View all roles viewAllRoles();
const viewAllRoles = () => {
    const sql2 = `SELECT roles.id, roles.title, roles.salary, 
                  department.name AS department
                  FROM roles
                  LEFT JOIN departments
                  ON role.department_id = department.id
                  ORDER BY title DESC`;

    db.promise().query(sql2, (err, rows) => {
        if (err) throw err;
        console.table(rows);

    }).then(() => companyPrompt());
}

//View all employees viewAllEmployees();
const viewAllEmployees = () => {
    const sql2 = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, 
                  department.name AS department,
                  role.salary,
                  CONCAT(manager.first_name, ' ', manager.last_name); `

    db.promise().query(sql2, (err, rows) => {
        if (err) throw err;
        console.table(rows);

    }).then(() => companyPrompt());
}

//Add a department addDepartment();
const addDepartment = () => {
    inquirer.prompt([
        {
            type: "input",
            message: "Please submit name of new department:",
            name: "addDepartment",
            validate: newDepartment => {
                if (newDepartment.match("[a-zA-Z]+$")) {
                    return true;
                } else {
                    console.log("Please re-enter the Department name");
                    return false;
                }
            }
        }
    ])
        .then(response => {
            const sql2 = `INSERT INTO department (name) 
        VALUES (?)`;
            db.query(sql2, response.addDepartment, (err, res) => {
                if (err) throw err;
                console.log("Department successfully added!: " + answer.addDepartment);
            })
                .then(() => companyPrompt());
        })
}
//Add a role addRole();
const addRole = () => {
    const sql2 = `SELECT name,
                            id FROM department`;

    db.query(sql2, (err, Added) => {
        if (err) throw err;

        const departments = Added.map(dept => {
            const departmentRole = {
                name: dept.name,
                value: dept.id
            };
            return departmentRole;
        })

        inquirer.prompt([
            {
                type: "input",
                message: "Please add role name:",
                name: "addedRole",
                validate: roleTitleInput => {
                    if (roleTitleInput.match("[a-zA-Z]+$")) {
                        return true;
                    } else {
                        console.log("Please enter the Title name as a string!");
                        return false;
                    }
                }
            },
            {
                type: "input",
                message: "Please add role salary:",
                name: "addedSalary",
                validate: salaryInput => {
                    if (salaryInput.match("[0-9]+$")) {
                        return true;
                    } else {
                        console.log("Please enter the Salary as a number!");
                        return false;
                    }
                }
            },
            {
                type: "list",
                message: "Which department does this role belong to?",
                name: "departmentSelection",
                choices: departments
            }
        ])
            .then(response => {
                const sql = `INSERT INTO role (title, salary, department_id) 
                                    VALUES (?, ?, ?)`;


                const params = [response.addedRole, response.addedSalary, response.departmentSelection]
                db.query(sql, params, (err, res) => {
                    if (err) throw err;
                    console.log("Added Role: " + answer.addedRole);
                })
            })
            .then(() => viewAllRoles(), viewallDepartments());
    })
};

//Add an employee addEmployee();
const addEmployee = () => {

    const infoToAdd = `SELECT id, title, salary, department_id FROM role`;
    const sql2 = `SELECT employee.manager_id, employee.first_name, employee.last_name, 
                         manager.first_name, manager.last_name, manager.id

                         FROM employee manager
                         LEFT JOIN employee employee ON employee.manager_id = manager.id 

                         WHERE employee.manager_id is NOT NULL;`



    db.query(infoToAdd, (err, roleTable) => {
        if (err)
            throw err;


        db.query(sql2, (err, managerTable) => {
            if (err)
                throw err;

            const roles = roleTable.map(role => {
                const roleChoice = {
                    name: role.title,
                    value: role.id
                };
                return roleChoice;
            })


            const managers = managerTable.map(manager => {
                const managerChoice = {
                    name: manager.first_name + manager.last_name,
                    value: manager.id
                };
                return managerChoice;
            })


            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the new employee's first name?",
                    name: "newEmployeeFN",
                    validate: firstName => {
                        if (firstName.match("[a-zA-Z]+$")) {
                            return true;
                        } else {
                            console.log("Please re-enter the employee's first name");
                            return false;
                        }
                    }
                },
                {
                    type: "input",
                    message: "What is the new employee's last name?",
                    name: "newEmployeeLN",
                    validate: lastName => {
                        if (lastName.match("[a-zA-Z]+$")) {
                            return true;
                        } else {
                            console.log("Please re-enter the employee's last name");
                            return false;
                        }
                    }
                },
                {
                    type: "list",
                    message: "Select from the list of roles ",
                    name: "newEmployeeRole",
                    choices: roles
                },
                {
                    type: "list",
                    message: "Select from the list of managers ",
                    name: "newEmployeeManager",
                    choices: managers
                }
            ])
                .then(response => {
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                                 VALUES (?, ?, ?, ?)`;
                    const params = [response.newEmployeeFN, response.newEmployeeLN, response.newEmployeeRole, response.newEmployeeManager]
                    db.query(sql, params, (err, result) => {
                        if (err) throw err;
                        console.log("Added Role: " + response.NewEmployeeFN + " " + answer.addEmployeeLastName);


                        companyPrompt();

                    })
                })

        })

    })

};

// Update employee managers updateEmployee();
const updateEmployee = () => {
    const employeeList = `SELECT * FROM employee`;
    const managerList = `SELECT employee.manager_id, employee.first_name, employee.last_name,
                                manager.first_name, manager.last_name, manager.id
                                
                                FROM employee manager
                                LEFT JOIN employee employee ON employee.manager_id = manager.id
                                
                                WHERE employee.manager_id is not null;`

    db.query(employeeList, (err, employeeListFunction) => {
        if (err) throw err;

        db.query(managerList, (err, managerListFunction) => {
            if (err) throw err;

            const employeeRoster = employeeListFunction.map(employee => {
                const employeeRoster = { name: (employee.first_name + " " + employee.last_name), value: employee.id };
                return employeeRoster;
            })

            const managerRoster = managerListFunction.map(manager => {
                const managerRoster = { name: manager.first_name + " " + manager.last_name, value: manager.id };
                return managerRoster;
            })

            inquirer.prompt([
                {
                    type: "list",
                    message: "'Which employee do you wish to edit?",
                    name: "employeeChoice",
                    choices: employeeRoster
                },
                {
                    type: "list",
                    message: "Choose a manager for the employee",
                    name: "managerChoice",
                    choices: managerRoster,
                }
            ])
                .then(answer => {
                    const sql = `UPDATE employee 
                         SET manager_id = ? 
                         WHERE id = ?`
                        ;

                    const params = [answer.managerChoice,
                    answer.employeeChoice]


                    db.query(sql, params, (err, res) => {
                        if (err) throw err;


                        console.log("Updated employee's manager: " + answer.employeeChoice + "was assigned to: " + answer.managerChoice);


                        companyPrompt();

                    })
                })
        })
    })
};

// View employees by manager viewEmployeesManager();
const viewEmployeesManager = () => {
    console.log('Showing all employees by manager...\n');
    //query to show employees by manager

    const sql2 = `SELECT employee.id, employee.first_name, employee.last_name, roles.title, 
    department.name AS department,
    role.salary,
    CONCAT(manager.first_name, ' ', manager.last_name); `

    db.promise().query(sql2, (err, rows) => {
        if (err) throw err;
        console.table(rows);

    }).then(() => companyPrompt());

    sql = `SELECT employee.manager_id, manager.first_name, manager.last_name, manager.role,
            FROM employee, manager
            WHERE empl.manager_id = manager.id;`
};

// View employees by department viewEmployeesDepartment();

// Delete Departments, Roles, and Employees. 
//deleteDepartments();
//deleteRoles();
//deleteEmployees();

// View total salaries of a department. viewBudget();
