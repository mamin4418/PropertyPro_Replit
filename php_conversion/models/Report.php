<?php
class Report {
    private $db;

    public function __construct($db) {
        $this->db = $db;
    }

    /**
     * Save a report template
     *
     * @param string $templateName The name of the template
     * @param string $templateData JSON string of the template data
     * @return bool Success or failure
     */
    public function saveReportTemplate($templateName, $templateData) {
        $stmt = $this->db->prepare("
            INSERT INTO report_templates (template_name, template_data, created_at)
            VALUES (?, ?, NOW())
        ");

        $stmt->bind_param("ss", $templateName, $templateData);

        return $stmt->execute();
    }

    /**
     * Get all report templates
     *
     * @return array Array of report templates
     */
    public function getReportTemplates() {
        $result = $this->db->query("
            SELECT id, template_name, template_data, created_at
            FROM report_templates
            ORDER BY template_name ASC
        ");

        $templates = [];

        while ($row = $result->fetch_assoc()) {
            $templates[] = $row;
        }

        return $templates;
    }

    /**
     * Get a report template by ID
     *
     * @param int $id The template ID
     * @return array|null The template data or null if not found
     */
    public function getReportTemplateById($id) {
        $stmt = $this->db->prepare("
            SELECT id, template_name, template_data, created_at
            FROM report_templates
            WHERE id = ?
        ");

        $stmt->bind_param("i", $id);
        $stmt->execute();

        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            return null;
        }

        return $result->fetch_assoc();
    }

    /**
     * Delete a report template
     *
     * @param int $id The template ID
     * @return bool Success or failure
     */
    public function deleteReportTemplate($id) {
        $stmt = $this->db->prepare("
            DELETE FROM report_templates
            WHERE id = ?
        ");

        $stmt->bind_param("i", $id);

        return $stmt->execute();
    }

    /**
     * Generate a financial report
     *
     * @param string $startDate Start date in YYYY-MM-DD format
     * @param string $endDate End date in YYYY-MM-DD format
     * @param int $propertyId Optional property ID to filter by
     * @return array The report data
     */
    public function generateFinancialReport($startDate, $endDate, $propertyId = null) {
        $sql = "
            SELECT 
                p.property_name,
                SUM(CASE WHEN pm.payment_type = 'rent' THEN pm.amount ELSE 0 END) as rent_income,
                SUM(CASE WHEN pm.payment_type = 'deposit' THEN pm.amount ELSE 0 END) as security_deposits,
                SUM(CASE WHEN e.expense_category_id IS NOT NULL THEN e.amount ELSE 0 END) as expenses,
                SUM(CASE WHEN pm.payment_type = 'rent' THEN pm.amount ELSE 0 END) - 
                SUM(CASE WHEN e.expense_category_id IS NOT NULL THEN e.amount ELSE 0 END) as net_income
            FROM 
                properties p
            LEFT JOIN 
                units u ON p.id = u.property_id
            LEFT JOIN 
                leases l ON u.id = l.unit_id
            LEFT JOIN 
                payments pm ON l.id = pm.lease_id AND pm.payment_date BETWEEN ? AND ?
            LEFT JOIN 
                expenses e ON p.id = e.property_id AND e.expense_date BETWEEN ? AND ?
        ";

        $groupBy = " GROUP BY p.id ORDER BY p.property_name";

        if ($propertyId !== null) {
            $sql .= " WHERE p.id = ?";
            $stmt = $this->db->prepare($sql . $groupBy);
            $stmt->bind_param("ssssi", $startDate, $endDate, $startDate, $endDate, $propertyId);
        } else {
            $stmt = $this->db->prepare($sql . $groupBy);
            $stmt->bind_param("ssss", $startDate, $endDate, $startDate, $endDate);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        $report = [];
        while ($row = $result->fetch_assoc()) {
            $report[] = $row;
        }

        return $report;
    }

    /**
     * Generate an occupancy report
     *
     * @param int $propertyId Optional property ID to filter by
     * @return array The report data
     */
    public function generateOccupancyReport($propertyId = null) {
        $sql = "
            SELECT 
                p.property_name,
                COUNT(u.id) as total_units,
                SUM(CASE WHEN u.status = 'occupied' THEN 1 ELSE 0 END) as occupied_units,
                SUM(CASE WHEN u.status = 'vacant' THEN 1 ELSE 0 END) as vacant_units,
                ROUND((SUM(CASE WHEN u.status = 'occupied' THEN 1 ELSE 0 END) / COUNT(u.id)) * 100, 2) as occupancy_rate,
                AVG(u.rent_amount) as average_rent
            FROM 
                properties p
            LEFT JOIN 
                units u ON p.id = u.property_id
        ";

        $groupBy = " GROUP BY p.id ORDER BY p.property_name";

        if ($propertyId !== null) {
            $sql .= " WHERE p.id = ?";
            $stmt = $this->db->prepare($sql . $groupBy);
            $stmt->bind_param("i", $propertyId);
        } else {
            $stmt = $this->db->prepare($sql . $groupBy);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        $report = [];
        while ($row = $result->fetch_assoc()) {
            $report[] = $row;
        }

        return $report;
    }

    /**
     * Generate a maintenance report
     *
     * @param string $startDate Start date in YYYY-MM-DD format
     * @param string $endDate End date in YYYY-MM-DD format
     * @param int $propertyId Optional property ID to filter by
     * @return array The report data
     */
    public function generateMaintenanceReport($startDate, $endDate, $propertyId = null) {
        $sql = "
            SELECT 
                p.property_name,
                u.unit_number,
                COUNT(m.id) as total_requests,
                SUM(CASE WHEN m.status = 'open' THEN 1 ELSE 0 END) as open_requests,
                SUM(CASE WHEN m.status = 'in_progress' THEN 1 ELSE 0 END) as in_progress_requests,
                SUM(CASE WHEN m.status = 'completed' THEN 1 ELSE 0 END) as completed_requests,
                AVG(CASE WHEN m.completed_date IS NOT NULL 
                    THEN DATEDIFF(m.completed_date, m.reported_date) 
                    ELSE DATEDIFF(NOW(), m.reported_date) 
                END) as avg_days_to_resolve
            FROM 
                properties p
            LEFT JOIN 
                units u ON p.id = u.property_id
            LEFT JOIN 
                maintenance_requests m ON u.id = m.unit_id AND m.reported_date BETWEEN ? AND ?
        ";

        $groupBy = " GROUP BY p.id, u.id ORDER BY p.property_name, u.unit_number";

        if ($propertyId !== null) {
            $sql .= " WHERE p.id = ?";
            $stmt = $this->db->prepare($sql . $groupBy);
            $stmt->bind_param("ssi", $startDate, $endDate, $propertyId);
        } else {
            $stmt = $this->db->prepare($sql . $groupBy);
            $stmt->bind_param("ss", $startDate, $endDate);
        }

        $stmt->execute();
        $result = $stmt->get_result();

        $report = [];
        while ($row = $result->fetch_assoc()) {
            $report[] = $row;
        }

        return $report;
    }
}