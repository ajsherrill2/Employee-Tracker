// Imports
const db = require("./connection");
const inquirer = require("inquirer");

// Helper Functions
class Helpers {
  constructor() {}

  viewAllEmployees() {
    db.query(
      "SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.dep_name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id LEFT JOIN employees manager ON manager.id = employees.manager_id;",
      (err, res) => {
        if (err) console.log(err);
        console.table("\n", res);
        startApp();
      }
    );
  }

  viewAllEmployeesByManager() {
    db.query(`SELECT * FROM employees;`, (err, res) => {
      if (err) console.log(err);
      let employees = res.map((employees) => ({
        name: employees.first_name + " " + employees.last_name,
        value: employees.id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "manager",
            message: "Which employee do you want to see direct reports for?",
            choices: employees,
          },
        ])
        .then((response) => {
          db.query(
            "SELECT employees.id, employees.first_name, employees.last_name, departments.dep_name AS department, roles.title FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id WHERE ?",
            {
              manager_id: response.manager,
            },
            (err, res) => {
              if (err) console.log(err);
              console.table("\n", res);
              startApp();
            }
          );
        });
    });
  }

  viewAllEmployeesByDepartment() {
    db.query(`SELECT * FROM departments;`, (err, res) => {
      if (err) console.log(err);
      let departments = res.map((departments) => ({
        name: departments.dep_name,
        value: departments.id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "department",
            message: "Which department would you like to see employee's for?",
            choices: departments,
          },
        ])
        .then((response) => {
          db.query(
            "SELECT employees.id, employees.first_name, employees.last_name, roles.title FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON roles.department_id = departments.id WHERE ?",
            {
              department_id: response.department,
            },
            (err, res) => {
              if (err) console.log(err);
              console.table("\n", res);
              startApp();
            }
          );
        });
    });
  }

  addEmployee() {
    db.query(`SELECT * FROM roles;`, (err, res) => {
      if (err) console.log(err);
      let roles = res.map((roles) => ({
        name: roles.title,
        value: roles.id,
      }));

      db.query(`SELECT * FROM employees;`, (err, res) => {
        if (err) console.log(err);
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
                if (err) console.log(err);
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

  updateEmployeeRole() {
    db.query(`SELECT * FROM roles;`, (err, res) => {
      if (err) console.log(err);
      let roles = res.map((roles) => ({
        name: roles.title,
        value: roles.id,
      }));

      db.query(`SELECT * FROM employees;`, (err, res) => {
        if (err) console.log(err);
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
              message:
                "Which role do you want to assign the selected employee?",
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
                if (err) console.log(err);
                console.log("Updated employee's role");
                startApp();
              }
            );
          });
      });
    });
  }

  updateEmployeeManager() {
    db.query(`SELECT * FROM employees;`, (err, res) => {
      if (err) console.log(err);
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
            message: "Which employee's manager do you want to change?",
            choices: employees,
          },
          {
            type: "list",
            name: "manager",
            message:
              "Which manager do you want to assign the selected employee?",
            choices: employees,
          },
        ])
        .then((response) => {
          if (response.manager === "none") response.manager = null;
          db.query(
            "UPDATE employees SET ? WHERE ?",
            [
              {
                manager_id: response.manager,
              },
              {
                id: response.employee,
              },
            ],
            (err, res) => {
              if (err) console.log(err);
              console.log("Updated employee's manager");
              startApp();
            }
          );
        });
    });
  }

  viewAllRoles() {
    db.query(
      "SELECT roles.id, roles.title, departments.dep_name AS department, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id;",
      (err, res) => {
        if (err) console.log(err);
        console.table("\n", res);
        startApp();
      }
    );
  }

  addRole() {
    db.query("SELECT * FROM departments;", (err, res) => {
      if (err) console.log(err);
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
              if (err) console.log(err);
              console.log(`Added ${response.title} to database`);
              startApp();
            }
          );
        });
    });
  }

  viewAllDepartments() {
    db.query(
      "SELECT departments.id, departments.dep_name AS name FROM departments;",
      (err, res) => {
        if (err) console.log(err);
        console.table("\n", res);
        startApp();
      }
    );
  }

  addDepartment() {
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
            if (err) console.log(err);
            console.log("Added department to database");
            startApp();
          }
        );
      });
  }

  deleteEmployee() {
    db.query(`SELECT * FROM employees;`, (err, res) => {
      if (err) console.log(err);
      let employees = res.map((employees) => ({
        name: employees.first_name + " " + employees.last_name,
        value: employees.id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Which employee would you like to remove?",
            choices: employees,
          },
        ])
        .then((response) => {
          db.query(
            "DELETE FROM employees WHERE ?",
            {
              id: response.employee,
            },
            (err, res) => {
              if (err) console.log(err);
              console.log("Removed employee from the database");
              startApp();
            }
          );
        });
    });
  }

  deleteRole() {
    db.query(`SELECT * FROM roles;`, (err, res) => {
      if (err) console.log(err);
      let roles = res.map((roles) => ({
        name: roles.title,
        value: roles.id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "role",
            message: "Which role would you like to remove?",
            choices: roles,
          },
        ])
        .then((response) => {
          db.query(
            "DELETE FROM roles WHERE ?",
            {
              id: response.role,
            },
            (err, res) => {
              if (err) console.log(err);
              console.log("Removed role from the database");
              startApp();
            }
          );
        });
    });
  }

  deleteDepartment() {
    db.query(`SELECT * FROM departments;`, (err, res) => {
      if (err) console.log(err);
      let departments = res.map((departments) => ({
        name: departments.dep_name,
        value: departments.id,
      }));

      inquirer
        .prompt([
          {
            type: "list",
            name: "department",
            message: "Which department would you like to remove?",
            choices: departments,
          },
        ])
        .then((response) => {
          db.query(
            "DELETE FROM departments WHERE ?",
            {
              id: response.department,
            },
            (err, res) => {
              if (err) console.log(err);
              console.log("Removed department from the database");
              startApp();
            }
          );
        });
    });
  }
}

module.exports = { DB: new Helpers() };
