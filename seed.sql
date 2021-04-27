USE cms_DB;

INSERT into department (name) 
VALUES ('IT');

INSERT into role (title, salary, department_id) 
VALUES ('Software Engineer', 250000, 1), 
       ('Senior Engineer', 500000, 1),
       ('Big Boss', 900001, 1);

INSERT into employee (first_name, last_name, role_id) VALUES ('Hiroto', 'Robinson', 3);
INSERT into employee (first_name, last_name, role_id, manager_id) VALUES ('Patrick', 'Star', 1, 1), ('Gon', 'Freecs', 1, 1)
