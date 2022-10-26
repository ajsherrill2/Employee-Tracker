// Imports
const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "Ghostsakai#128",
    database: "employee_db",
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
          connection.end();
          console.log("Closing Program");
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
