import { db } from "../db.js";

export const addResume = async (req, res) => {
  const { title, resumeId, userEmail, userName } = req.body;

  const addContent = "INSERT INTO user_table (title, resumeId, userEmail, userName) VALUES (?, ?, ?, ?)";
  const values = [title, resumeId, userEmail, userName];

  try {
    const [result] = await db.promise().query(addContent, values);
    const id = resumeId;

    // Fetch the newly inserted record for response
    const [rows] = await db.promise().query("SELECT * FROM user_table WHERE resumeId = ?", [id]);

    return res.status(201).json({
      message: "Resume created successfully",
      data: rows[0], // Return the inserted row
    });
  } catch (err) {
    console.error("Error creating resume:", err);
    return res.status(500).json({
      message: "Internal server error.",
      error: err.message,
    });
  }
};









export const getUserResumes = async (req, res) => {
  // console.log(req.query)
  const {userEmail} = req.query;

  const addContent = "SELECT * FROM user_table WHERE userEmail = ?";
  const values =[userEmail];
  

  try {
    const [result] = await db.promise().query(addContent, values);
    return res.status(201).json({
      message: "All Resume Featched successfully",
      data: result, // Return the inserted row
    });
  } catch (err) {
    console.error("Error featching resume:", err);
    return res.status(500).json({
      message: "Internal server error.",
      error: err.message,
    });
  }
};



export const getUserResumesByResumeId = async (req, res) => {
  // console.log(req.query)
  const {resumeId} = req.query;

  const addContent = "SELECT * FROM user_table WHERE resumeId = ?";
  const values =[resumeId];

  try {
    const [result] = await db.promise().query(addContent, values);
    // console.log(result)
    return res.status(201).json({
      message: "Featched successfully",
      data: result[0], // Return the inserted row
    });
  } catch (err) {
    console.error("Error featching resume:", err);
    return res.status(500).json({
      message: "Internal server error.",
      error: err.message,
    });
  }
};



export const updateResumeDetails = async (req, res) => {
  // console.log(req.body)
  const { firstName, lastName, jobTitle, address, phone, email, resumeId } = req.body;
  const addContent = `
    INSERT INTO personal_detail (firstName, lastName, jobTitle, address, phone, email, resumeId)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      firstName = VALUES(firstName),
      lastName = VALUES(lastName),
      jobTitle = VALUES(jobTitle),
      address = VALUES(address),
      phone = VALUES(phone),
      email = VALUES(email)
  `;
  const values = [firstName, lastName, jobTitle, address, phone, email, resumeId];

  try {
    const [result] = await db.promise().query(addContent, values);

    // Fetch the updated or newly inserted record for response
    const [rows] = await db.promise().query("SELECT * FROM personal_detail WHERE resumeId = ?", [resumeId]);

    return res.status(200).json({
      message: "Resume personal details created/updated successfully",
      data: rows[0],
    });
  } catch (err) {
    console.error("Error fetching resume:", err);
    return res.status(500).json({
      message: "Internal server error.",
      error: err.message,
    });
  }
};

export const updateResumeSummary = async (req, res) => {

  const { summary, resumeId } = req.body;
  // console.log(req.body)

  // Assuming 'resumeId' is the primary key
  const addContent = `
    INSERT INTO profile_summary (summary, resumeId)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE
      summary = VALUES(summary)
  `;
  const values = [summary, resumeId];

  try {
    const [result] = await db.promise().query(addContent, values);

    // Fetch the updated or newly inserted record for response
    const [rows] = await db.promise().query("SELECT * FROM profile_summary WHERE resumeId = ?", [resumeId]);

    return res.status(200).json({
      message: "Summary added successfully",
      data: rows[0],
    });
  } catch (err) {
    console.error("Error updating summary:", err);
    return res.status(500).json({
      message: "Internal server error.",
      error: err.message,
    });
  }
};






export const updateExperienceDetails = async (req, res) => {
  const experiences = req.body; // Assuming the list of experiences is sent in the body

  // Validate input
  if (!Array.isArray(experiences) || experiences.length === 0) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    for (const experience of experiences) {
      const { expId, title, companyName, city, state, startDate, endDate, currentlyWorking, workSummery, resumeId } = experience;

      // Check if the experience with the same expId already exists
      const [existingExperience] = await db.promise().query(
        "SELECT * FROM personal_experience WHERE expId = ?",
        [expId]
      );

      if (existingExperience.length > 0) {
        // Update the existing experience
        await db.promise().query(
          "UPDATE personal_experience SET title = ?, companyName = ?, city = ?, state = ?, startDate = ?, endDate = ?, currentlyWorking = ?, workSummery = ? WHERE expId = ?",
          [title, companyName, city, state, startDate, endDate, currentlyWorking, workSummery, expId]
        );
      } else {
        // Insert a new experience
        await db.promise().query(
          "INSERT INTO personal_experience (expId, title, companyName, city, state, startDate, endDate, currentlyWorking, workSummery, resumeId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
          [expId, title, companyName, city, state, startDate, endDate, currentlyWorking, workSummery, resumeId]
        );
      }
    }

    // Fetch the updated or newly inserted records for response
    const [rows] = await db.promise().query("SELECT * FROM personal_experience WHERE resumeId = ?", [experiences[0].resumeId]);

    return res.status(200).json({
      message: "Experience details added/updated successfully",
      data: rows,
    });
  } catch (err) {
    console.error("Error updating experience details:", err);
    return res.status(500).json({
      message: "Internal server error.",
      error: err.message,
    });
  }
};





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










export const updateEducationDetails = async (req, res) => {
  const education = req.body; // Assuming the list of experiences is sent in the body

  // Validate input
  if (!Array.isArray(education) || education.length === 0) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    for (const experience of education) {
      const { eduId, universityName, degree, major, description, startDate, endDate, resumeId } = experience;

      // Check if the experience with the same eduId already exists
      const [existingExperience] = await db.promise().query(
        "SELECT * FROM personal_education WHERE eduId = ?",
        [eduId]
      );

      if (existingExperience.length > 0) {
        // Update the existing experience
        await db.promise().query(
          "UPDATE personal_education SET universityName = ?, degree = ?, major = ?, description = ?, startDate = ?, endDate = ? WHERE eduId = ?",
          [universityName, degree, major, description, startDate, endDate, eduId]
        );
      } else {
        // Insert a new experience
        await db.promise().query(
          "INSERT INTO personal_education (eduId, universityName, degree, major, description, startDate, endDate, resumeId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [eduId, universityName, degree, major, description, startDate, endDate, resumeId]
        );
      }
    }

    // Fetch the updated or newly inserted records for response
    const [rows] = await db.promise().query("SELECT * FROM personal_education WHERE resumeId = ?", [education[0].resumeId]);

    return res.status(200).json({
      message: "Experience details added/updated successfully",
      data: rows,
    });
  } catch (err) {
    console.error("Error updating experience details:", err);
    return res.status(500).json({
      message: "Internal server error.",
      error: err.message,
    });
  }
};





export const updateSkillDetails = async (req, res) => {
  const skill = req.body; // Assuming the list of experiences is sent in the body

  // Validate input
  if (!Array.isArray(skill) || skill.length === 0) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    for (const experience of skill) {
      const { skillId, name, rating, resumeId } = experience;

      // Check if the experience with the same skillId already exists
      const [existingExperience] = await db.promise().query(
        "SELECT * FROM personal_skill WHERE skillId = ?",
        [skillId]
      );

      if (existingExperience.length > 0) {
        // Update the existing experience
        await db.promise().query(
          "UPDATE personal_skill SET name = ?, rating = ? WHERE skillId = ?",
          [name, rating, skillId]
        );
      } else {
        // Insert a new experience
        await db.promise().query(
          "INSERT INTO personal_skill (skillId, name, rating, resumeId) VALUES (?, ?, ?, ?)",
          [skillId, name, rating, resumeId]
        );
      }
    }

    // Fetch the updated or newly inserted records for response
    const [rows] = await db.promise().query("SELECT * FROM personal_skill WHERE resumeId = ?", [skill[0].resumeId]);

    return res.status(200).json({
      message: "Skill details added/updated successfully",
      data: rows,
    });
  } catch (err) {
    console.error("Error updating Skill details:", err);
    return res.status(500).json({
      message: "Internal server error.",
      error: err.message,
    });
  }
};



export const updateTheme = async (req, res) => {
  const { themeLayout, themeColor, resumeId } = req.body;
  // console.log(req.body);

  try {
    // Check if a row with the given resumeId exists
    const [existingRows] = await db.promise().query(
      "SELECT * FROM theme WHERE resumeId = ?",
      [resumeId]
    );

    if (existingRows.length > 0) {
      // Update the existing row
      const [updateResult] = await db.promise().query(
        "UPDATE theme SET themeLayout = ?, themeColor = ? WHERE resumeId = ?",
        [themeLayout, themeColor, resumeId]
      );
      // console.log("Update result:", updateResult);
    } else {
      // Insert a new row
      const [insertResult] = await db.promise().query(
        "INSERT INTO theme (themeLayout, themeColor, resumeId) VALUES (?, ?, ?)",
        [themeLayout, themeColor, resumeId]
      );
      // console.log("Insert result:", insertResult);
    }

    // Fetch the updated or newly inserted record for response
    const [rows] = await db.promise().query(
      "SELECT * FROM theme WHERE resumeId = ?",
      [resumeId]
    );

    return res.status(200).json({
      message: "Theme created/updated successfully",
      data: rows[0],
    });
  } catch (err) {
    console.error("Error updating Theme:", err);
    return res.status(500).json({
      message: "Internal server error.",
      error: err.message,
    });
  }
};




export const deleteResumeById = async (req, res) => {
  const { resumeId } = req.query;
  // console.log(req.query);


  try {
    // Delete the resume from the user_table
    const [deleteResult] = await db.promise().query(
      "DELETE FROM user_table WHERE resumeId = ?",
      [resumeId]
    );

    // console.log("Delete result:", deleteResult);

    if (deleteResult.affectedRows > 0) {
      return res.status(200).json({
        message: "Resume deleted successfully",
      });
    } else {
      return res.status(404).json({
        message: "Resume not found",
      });
    }
  } catch (err) {
    console.error("Error deleting resume:", err);
    return res.status(500).json({
      message: "Internal server error.",
      error: err.message,
    });
  }
};


















export const getResumeById = async (req, res) => {
  // console.log(req.query);
  const { resumeId } = req.query;
  const values = [resumeId];
  const getDetails = "SELECT * FROM personal_detail WHERE resumeId = ?";
  const getEducation = "SELECT * FROM personal_education WHERE resumeId = ?";
  const getExperience = "SELECT * FROM personal_experience WHERE resumeId = ?";
  const getSummary = "SELECT * FROM profile_summary WHERE resumeId = ?";
  const getSkill = "SELECT * FROM personal_skill WHERE resumeId = ?";
  const getTheme= "SELECT * FROM theme WHERE resumeId = ?";
  const getProject= "SELECT * FROM personal_project WHERE resumeId = ?";




  try {
    const [result1] = await db.promise().query(getDetails, values);
    const [result2] = await db.promise().query(getEducation, values);
    const [result3] = await db.promise().query(getExperience, values);
    const [result4] = await db.promise().query(getSummary, values);
    const [result5] = await db.promise().query(getSkill, values);
    const [result6] = await db.promise().query(getTheme, values);
    const [result7] = await db.promise().query(getProject, values);


    



    const resumeData = {
      firstName: result1[0]?.firstName,
      lastName: result1[0]?.lastName,
      jobTitle: result1[0]?.jobTitle,
      address: result1[0]?.address,
      phone: result1[0]?.phone,
      email: result1[0]?.email,
      themeColor: result6[0]?.themeColor,
      themeLayout: result6[0]?.themeLayout,
      summery: result4[0]?.summary,
      Details:result1[0],
      Experience: result3?.map((exp) => ({
        id: exp.id,
        title: exp.title,
        companyName: exp.companyName,
        city: exp.city,
        state: exp.state,
        startDate: exp.startDate,
        endDate: exp.endDate,
        currentlyWorking: exp.currentlyWorking,
        workSummery: exp.workSummery,
      })),
      Project: result7?.map((exp) => ({
        id: exp.id,
        projectName: exp.projectName,
        aboutProject: exp.aboutProject,
        startDate: exp.startDate,
        endDate: exp.endDate,
        projectSummery: exp.projectSummery,
      })),
      education: result2?.map((edu) => ({
        id: edu.id,
        universityName: edu.universityName,
        startDate: edu.startDate,
        endDate: edu.endDate,
        degree: edu.degree,
        major: edu.major,
        description: edu.description,
      })),
      skills: result5?.map((skill) => ({
        id: skill.id,
        name: skill.name,
        rating: skill.rating,
      })),
      // skills: [
      //   { id: 1, name: "Angular", rating: 80 },
      //   { id: 2, name: "React", rating: 100 },
      //   { id: 3, name: "MySQL", rating: 80 },
      //   { id: 4, name: "React Native", rating: 100 },
      // ],
    };
// console.log(resumeData)
    return res.status(200).json({
      message: "Fetched updated resume data successfully",
      data: resumeData,
    });
  } catch (err) {
    console.error("Error fetching updated resume data :", err);
    return res.status(500).json({
      message: "Internal server error.",
      error: err.message,
    });
  }
};





