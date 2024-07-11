export const updateProjectDetails = async (req, res) => {
    const projects = req.body; // Assuming the list of project is sent in the body
  
    // Validate input
    if (!Array.isArray(projects) || projects.length === 0) {
      return res.status(400).json({ message: "Invalid input" });
    }
  
    try {
      for (const project of projects) {
        const { projectId, projectName, aboutProject, startDate, endDate, projectSummery, resumeId } = project;
  
        // Check if the project with the same projectId already exists
        const [existingProject] = await db.promise().query(
          "SELECT * FROM personal_project WHERE projectId = ?",
          [projectId]
        );
  
        if (existingProject.length > 0) {
          // Update the existing project
          await db.promise().query(
            "UPDATE personal_project SET projectName = ?, aboutProject = ?, startDate = ?, endDate = ?, projectSummery = ? WHERE projectId = ?",
            [projectName, aboutProject, startDate, endDate, projectSummery, projectId]
          );
        } else {
          // Insert a new project
          await db.promise().query(
            "INSERT INTO personal_project (projectId, projectName, aboutProject, startDate, endDate, projectSummery, resumeId) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [projectId, projectName, aboutProject, startDate, endDate, projectSummery, resumeId]
          );
        }
      }
  
      // Fetch the updated or newly inserted records for response
      const [rows] = await db.promise().query("SELECT * FROM personal_project WHERE resumeId = ?", [projects[0].resumeId]);
  
      return res.status(200).json({
        message: "project details added/updated successfully",
        data: rows,
      });
    } catch (err) {
      console.error("Error updating project details:", err);
      return res.status(500).json({
        message: "Internal server error.",
        error: err.message,
      });
    }
  };
  