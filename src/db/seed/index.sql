INSERT INTO roles (name, description) VALUES ('guardian', 'A guardian is a parent or guardian of a child');
INSERT INTO roles (name, description) VALUES ('staff', 'A staff member is a staff member of the school');
INSERT INTO roles (name, description) VALUES ('admin', 'An admin is an admin of the school');

INSERT INTO care_session_statuses (name, description) VALUES ('active', 'The care session is active');
INSERT INTO care_session_statuses (name, description) VALUES ('cancelled', 'The care session has been cancelled');
INSERT INTO care_session_statuses (name, description) VALUES ('completed', 'The care session has been completed');

INSERT INTO care_sessions_children_statuses (name, description) VALUES ('active', 'The child is active in the care session');
INSERT INTO care_sessions_children_statuses (name, description) VALUES ('picked_up', 'The child has been picked up from the care session');
INSERT INTO care_sessions_children_statuses (name, description) VALUES ('cancelled', 'The child has been cancelled from the care session');

INSERT INTO token_statuses (name, description) VALUES ('active', 'The token is active');
INSERT INTO token_statuses (name, description) VALUES ('used', 'The token has been used');
INSERT INTO token_statuses (name, description) VALUES ('expired', 'The token has expired');
INSERT INTO token_statuses (name, description) VALUES ('revoked', 'The token has been revoked');

INSERT INTO classes (name, code, capacity, description) VALUES 
('Jeremiah', 'JER', 30, 'This is the Jeremiah class'),
('Daniel', 'DAN', 25, 'This is the Daniel class'),
('Joshua', 'JOS', 20, 'This is the Joshua class');

INSERT INTO parties (first_name, last_name, gender, email, phone, is_active, user_id) VALUES
('John', 'Doe', 'male', 'john.doe@faithfulhands.org', '+1 (555) 123-4567', true, null),
('Jane', 'Smith', 'female', 'jane.smith@faithfulhands.org', '+1 (555) 123-4567', true, null),
('Dr. Alan Turing', 'Turing', 'male', 'alan.turing@faithfulhands.org', '+1 (555) 123-4567', true, null),
('Grace Hopper', 'Hopper', 'female', 'grace.hopper@faithfulhands.org', '+1 (555) 123-4567', true, null),
('Maria Montessori', 'Montessori', 'female', 'maria.montessori@faithfulhands.org', '+1 (555) 123-4567', true, null);

INSERT INTO children (first_name, last_name, gender, date_of_birth, class_id) VALUES 
('John', 'Doe', 'male', '1990-01-01', 1),
('Jane', 'Smith', 'female', '1990-01-01', 2),
('Dr. Alan Turing', 'Turing', 'male', '1990-01-01', 3),
('Grace Hopper', 'Hopper', 'female', '1990-01-01', 1),
('Maria Montessori', 'Montessori', 'female', '1990-01-01', 2);

INSERT INTO children_parties (child_id, party_id, relationship) VALUES
(1, 1, 'parent'),
(2, 2, 'parent'),
(3, 4, 'parent'),
(4, 1, 'parent'),
(5, 2, 'parent');

INSERT INTO party_roles (party_id, role_id) VALUES
(1, 1),
(2, 1),
(3, 2),
(4, 1),
(5, 3);

INSERT INTO care_sessions (name, short_name, class_id, start_time, end_time, care_session_status_id, date, notes) VALUES
('Covenant Day of Business Breakthrough', 'CDOBB', 1, '2026-01-01 09:00:00', '2026-01-01 17:00:00', 1, '2026-01-01', 'No notes'),
('Prophetic Entrance Service', 'PESVC', 2, '2026-01-02 09:00:00', '2026-01-02 17:00:00', 1, '2026-01-02', 'No notes'),
('Covenant Day of Open Doors', 'CDOOD', 3, '2026-01-03 09:00:00', '2026-01-03 17:00:00', 1, '2026-01-03', 'No notes');

INSERT INTO care_sessions_children (care_session_id, child_id, checked_in_at, checked_in_by, checked_out_at, checked_out_by, care_sessions_children_status_id, notes) VALUES
((SELECT id FROM care_sessions WHERE short_name = 'CDOBB'), 1, '2026-01-01 09:00:00', 1, null, null, 1, 'No notes'),
((SELECT id FROM care_sessions WHERE short_name = 'PESVC'), 2, '2026-01-02 09:00:00', 2, null, null, 1, 'No notes'),
((SELECT id FROM care_sessions WHERE short_name = 'CDOOD'), 3, '2026-01-03 09:00:00', 3, null, null, 1, 'No notes'),
((SELECT id FROM care_sessions WHERE short_name = 'CDOBB'), 4, '2026-01-01 09:00:00', 1, null, null, 1, 'No notes'),
((SELECT id FROM care_sessions WHERE short_name = 'PESVC'), 5, '2026-01-02 09:00:00', 2, null, null, 1, 'No notes');