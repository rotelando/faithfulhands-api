INSERT INTO roles (name, description) VALUES ('guardian', 'A guardian is a parent or guardian of a child');
INSERT INTO roles (name, description) VALUES ('staff', 'A staff member is a staff member of the school');
INSERT INTO roles (name, description) VALUES ('admin', 'An admin is an admin of the school');

INSERT INTO classes (name, code, capacity, description) VALUES ('Jeremiah', 'JER', 30, 'This is the Jeremiah class');
INSERT INTO classes (name, code, capacity, description) VALUES ('Daniel', 'DAN', 25, 'This is the Daniel class');
INSERT INTO classes (name, code, capacity, description) VALUES ('Joshua', 'JOS', 20, 'This is the Joshua class');

INSERT INTO parties (first_name, last_name, gender, email, phone, is_active, user_id) VALUES ('John', 'Doe', 'male', 'john.doe@faithfulhands.org', '+1 (555) 123-4567', true, null);
INSERT INTO parties (first_name, last_name, gender, email, phone, is_active, user_id) VALUES ('Jane', 'Smith', 'female', 'jane.smith@faithfulhands.org', '+1 (555) 123-4567', true, null);
INSERT INTO parties (first_name, last_name, gender, email, phone, is_active, user_id) VALUES ('Dr. Alan Turing', 'Turing', 'male', 'alan.turing@faithfulhands.org', '+1 (555) 123-4567', true, null);
INSERT INTO parties (first_name, last_name, gender, email, phone, is_active, user_id) VALUES ('Grace Hopper', 'Hopper', 'female', 'grace.hopper@faithfulhands.org', '+1 (555) 123-4567', true, null);
INSERT INTO parties (first_name, last_name, gender, email, phone, is_active, user_id) VALUES ('Maria Montessori', 'Montessori', 'female', 'maria.montessori@faithfulhands.org', '+1 (555) 123-4567', true, null);

INSERT INTO children (first_name, last_name, gender, date_of_birth, class_id) VALUES ('John', 'Doe', 'male', '1990-01-01', 1);
INSERT INTO children (first_name, last_name, gender, date_of_birth, class_id) VALUES ('Jane', 'Smith', 'female', '1990-01-01', 2);
INSERT INTO children (first_name, last_name, gender, date_of_birth, class_id) VALUES ('Dr. Alan Turing', 'Turing', 'male', '1990-01-01', 3);
INSERT INTO children (first_name, last_name, gender, date_of_birth, class_id) VALUES ('Grace Hopper', 'Hopper', 'female', '1990-01-01', 1);
INSERT INTO children (first_name, last_name, gender, date_of_birth, class_id) VALUES ('Maria Montessori', 'Montessori', 'female', '1990-01-01', 2);

INSERT INTO children_parties (child_id, party_id, relationship) VALUES (1, 1, 'parent');
INSERT INTO children_parties (child_id, party_id, relationship) VALUES (2, 2, 'parent');
INSERT INTO children_parties (child_id, party_id, relationship) VALUES (3, 4, 'parent');
INSERT INTO children_parties (child_id, party_id, relationship) VALUES (4, 1, 'parent');
INSERT INTO children_parties (child_id, party_id, relationship) VALUES (5, 2, 'parent');

INSERT INTO party_roles (party_id, role_id) VALUES (1, 1);
INSERT INTO party_roles (party_id, role_id) VALUES (2, 1);
INSERT INTO party_roles (party_id, role_id) VALUES (3, 2);
INSERT INTO party_roles (party_id, role_id) VALUES (4, 1);
INSERT INTO party_roles (party_id, role_id) VALUES (5, 3);

INSERT INTO attendance_sessions (child_id, class_id, checked_in_by, checked_out_by, date, status, notes) VALUES (1, 1, 1, 1, '2026-01-01', 'active', 'No notes');
INSERT INTO attendance_sessions (child_id, class_id, checked_in_by, checked_out_by, date, status, notes) VALUES (2, 2, 2, 2, '2026-01-01', 'active', 'No notes');