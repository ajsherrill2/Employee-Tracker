-- View all Employees
SELECT
    employees.id, employees.first_name, employees.last_name, roles.title, departments.dep_name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
FROM employees
LEFT JOIN roles ON employees.role_id = roles.id
LEFT JOIN departments ON roles.department_id = departments.id
LEFT JOIN employees manager ON manager.id = employees.manager_id;

-- View all Departments
SELECT
    departments.id, departments.dep_name AS name
FROM departments;

-- View all Roles
SELECT
    roles.id, roles.title, departments.dep_name AS department, roles.salary
FROM roles
JOIN departments ON roles.department_id = departments.id;