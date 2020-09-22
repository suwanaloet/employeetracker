INSERT INTO department (name)

VALUES
    ('Finance'),
    ('Marketing'),
    ('HR'),
    ('Legal'),
    ('Development');

INSERT INTO role (title, salary, department_id)

VALUES
    ('Controller', 130000, 1),
    ('Accountant', 80000, 1),
    ('Sales Manager', 90000, 2),
    ('Salesperson', 70000, 2),
    ('HR Officer', 120000, 3),
    ('HR Staff', 80000, 3),
    ('Senior Partner', 220000, 4),
    ('Junior Partner', 120000, 4),
    ('Engineer', 90000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)

VALUES
    ('Jane', 'Doe', 1, NULL),
    ('John', 'Doe', 1, 1),
    ('Kelly', 'Chan', 2, 2),
    ('Marcus', 'Aldiez', 2, NULL),
    ('Jim', 'Zyn', 3, NULL),
    ('Chris', 'Reeves', 3, 3),
    ('Rebecca', 'Anderson', 4, NULL),
    ('Tali', 'Singh', 4, 4),
    ('Andrew', 'Huang', 5, 5),
    ('Deborah', 'Liu', 5, NULL)