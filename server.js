// Imports
const inquirer = require("inquirer");
const mysql = require("mysql2");
require("dotenv").config();
require("console.table");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: process.env.DB_USER,
    // MySQL password
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  console.log(`Connected to the employee_db database.`)
);

db.connect((err) => {
  if (err) throw err;
  startApp();
});

// Inquirer Prompts
startApp = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "rootQuery",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
      },
    ])
    .then((response) => {
      switch (response.rootQuery) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Departments":
          viewAllDepartments();
          break;
        case "Add Department":
          addDepartment();
          break;
        default:
          console.log("Closing Program");
          db.end();
          return;
      }
    });
};

function viewAllEmployees() {
  db.query(
    "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.dep_name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees manager ON manager.id = employees.manager_id;",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startApp();
    }
  );
}

function addEmployee() {
  db.query(`SELECT * FROM roles;`, (err, res) => {
    if (err) throw err;
    let roles = res.map((roles) => ({
      name: roles.title,
      value: roles.id,
    }));

    db.query(`SELECT * FROM employees;`, (err, res) => {
      if (err) throw err;
      let employees = res.map((employees) => ({
        name: employees.first_name + " " + employees.last_name,
        value: employees.id,
      }));
      employees.push("none");

      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?",
          },
          {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?",
          },
          {
            type: "list",
            name: "role",
            message: "What is the employee's role?",
            choices: roles,
          },
          {
            type: "list",
            name: "manager",
            message: "What is the employee's manager",
            choices: employees,
          },
        ])
        .then((response) => {
          if (response.manager === "none") response.manager = null;
          db.query(
            "INSERT INTO employees SET ?",
            {
              first_name: response.firstName,
              last_name: response.lastName,
              role_id: response.role,
              manager_id: response.manager,
            },
            (err, res) => {
              if (err) throw err;
              console.log(
                `Added ${response.firstName} ${response.lastName} to the database`
              );
              startApp();
            }
          );
        });
    });
  });
}

function updateEmployeeRole() {
  db.query(`SELECT * FROM roles;`, (err, res) => {
    if (err) throw err;
    let roles = res.map((roles) => ({
      name: roles.title,
      value: roles.id,
    }));

    db.query(`SELECT * FROM employees;`, (err, res) => {
      if (err) throw err;
      let employees = res.map((employees) => ({
        name: employees.first_name + " " + employees.last_name,
        value: employees.id,
      }));
      employees.push("none");

      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Which emmployee's role do you want to change?",
            choices: employees,
          },
          {
            type: "list",
            name: "role",
            message: "Which role do you want to assign the selected employee?",
            choices: roles,
          },
        ])
        .then((response) => {
          db.query(
            "UPDATE employees SET ? WHERE ?",
            [
              {
                role_id: response.role,
              },
              {
                id: response.employee,
              },
            ],
            (err, res) => {
              if (err) throw err;
              console.log("Updated employee's role");
              startApp();
            }
          );
        });
    });
  });
}

function viewAllRoles() {
  db.query(
    "SELECT roles.id, roles.title, departments.dep_name AS department, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id;",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startApp();
    }
  );
}

function addRole() {
  db.query("SELECT * FROM departments;", (err, res) => {
    if (err) throw err;
    let departments = res.map((departments) => ({
      name: departments.dep_name,
      value: departments.id,
    }));
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the name of the role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the Salary of the role?",
          validate: (numInput) => {
            if (isNaN(numInput)) {
              console.log("Please enter a number!");
              return false;
            } else {
              return true;
            }
          },
        },
        {
          type: "list",
          name: "department",
          message: "Which department does the role belong to?",
          choices: departments,
        },
      ])
      .then((response) => {
        db.query(
          "INSERT INTO roles SET ?",
          {
            title: response.title,
            salary: response.salary,
            department_id: response.department,
          },
          (err, res) => {
            if (err) throw err;
            console.log(`Added ${response.title} to database`);
            startApp();
          }
        );
      });
  });
}

function viewAllDepartments() {
  db.query(
    "SELECT departments.id, departments.dep_name AS name FROM departments;",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      startApp();
    }
  );
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the name of the department?",
      },
    ])
    .then((response) => {
      db.query(
        "INSERT INTO departments SET ?",
        {
          dep_name: response.department,
        },
        (err, res) => {
          if (err) throw err;
          console.log("Added department to database");
          startApp();
        }
      );
    });
}
