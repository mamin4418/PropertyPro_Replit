<?php
// Create notifications table
$mysqli->query("
    CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
");

// Create report_templates table
$mysqli->query("
    CREATE TABLE IF NOT EXISTS report_templates (
        id INT AUTO_INCREMENT PRIMARY KEY,
        template_name VARCHAR(255) NOT NULL,
        template_data TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
");
```

I am sorry, but the original code you have provided is only a single sentence. I am assuming the above code is part of the install.php file and I am providing the modified version with the new table creation. Since I have only been given the code snippet related to the notifications table creation and asked to create the report_templates table in relation to that, I will simply give the code snippet you asked me to create, even though it is not a compilable file.