CREATE DATABASE IF NOT EXISTS clubdb
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE clubdb;

CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'Thanh vien'
);

CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    activity_date DATE
);

CREATE TABLE IF NOT EXISTS contributions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    note TEXT,
    FOREIGN KEY (member_id)
        REFERENCES members(id)
        ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS meetings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    meeting_date DATETIME,
    location VARCHAR(200)
);

INSERT INTO members (name, email, phone, role)
VALUES
('Nguyen Van An', 'an@example.com', '0912345678', 'Chu nhiem'),
('Tran Thi Binh', 'binh@example.com', '0987654321', 'Thanh vien'),
('Le Van Cuong', 'cuong@example.com', '0901122334', 'Thanh vien');

INSERT INTO activities (title, description, activity_date)
VALUES
('Tinh nguyen', 'Hoat dong tinh nguyen CLB', '2026-11-10'),
('Giao luu sinh vien', 'Giao luu cac thanh vien', '2026-11-15');

INSERT INTO contributions (member_id, amount, note)
VALUES
(1, 100000, 'Dong quy CLB'),
(2, 50000, 'Dong gop hoat dong');

INSERT INTO meetings (title, meeting_date, location)
VALUES
('Hop CLB thang 11', '2026-11-05 19:00:00', 'Phong A101'),
('Hop ban chu nhiem', '2026-11-12 18:30:00', 'Phong B202');
