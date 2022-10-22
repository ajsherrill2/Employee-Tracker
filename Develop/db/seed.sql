INSERT INTO departments (name)
VALUES  ('Sales'),
        ('Engineering'),
        ('Finance'),
        ('Legal'),

INSERT INTO roles (title, salary)
VALUES  ('Sales Lead', 100000),
        ('Salesperson', 80000),
        ('Lead Engineer', 150000),
        ('Software Engineer', 120000),
        ('Account Manager', 160000),
        ('Accountant', 125000),
        ('Legal Team Lead', 250000),
        ('Lawyer', 190000),

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES  ('John', 'Doe', 1),          
        ('Mike', 'Chan', 2, 1),
        ('Ashley', 'Rodriguez', 3),
        ('Kevin', 'Tupik', 4, 3),
        ('Kunal', 'Singh', 5),
        ('Malia', 'Brown', 6, 5),
        ('Sarah', 'Lourd', 7),
        ('Tom', 'Allen', 8, 7),