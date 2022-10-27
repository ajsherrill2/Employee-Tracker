// Imports
const inquirer = require("inquirer");
const db = require("./db/connection");
const { DB } = require("./db/index");
require("console.table");

db.connect((err) => {
  if (err) console.log(err);
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
          "View All Employees By Manager",
          "View All Employees By Department",
          "Add Employee",
          "Update Employee Role",
          "Update Employee Manager",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Remove Employee",
          "Remove Role",
          "Remove Department",
          "Quit",
        ],
      },
    ])
    .then((response) => {
      switch (response.rootQuery) {
        case "View All Employees":
          DB.viewAllEmployees();
          break;
        case "View All Employees By Manager":
          DB.viewAllEmployeesByManager();
          break;
        case "View All Employees By Department":
          DB.viewAllEmployeesByDepartment();
          break;
        case "Add Employee":
          DB.addEmployee();
          break;
        case "Update Employee Role":
          DB.updateEmployeeRole();
          break;
        case "Update Employee Manager":
          DB.updateEmployeeManager();
          break;
        case "View All Roles":
          DB.viewAllRoles();
          break;
        case "Add Role":
          DB.addRole();
          break;
        case "View All Departments":
          DB.viewAllDepartments();
          break;
        case "Add Department":
          DB.addDepartment();
          break;
        case "Remove Employee":
          DB.deleteEmployee();
          break;
        case "Remove Role":
          DB.deleteRole();
          break;
        case "Remove Department":
          DB.deleteDepartment();
          break;
        default:
          console.log("Closing Program");
          db.end();
          return;
      }
    });
};