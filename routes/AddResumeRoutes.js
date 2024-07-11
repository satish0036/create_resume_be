import express from "express";
import { addResume, getUserResumes ,updateResumeDetails, updateResumeSummary,updateExperienceDetails,
    updateEducationDetails,getResumeById,updateSkillDetails,
    getUserResumesByResumeId,updateTheme,
    deleteResumeById,
    updateProjectDetails} from "../controllers/AddResumeControllers.js";

    

const AddResumeRoutes = express.Router()

AddResumeRoutes.post("/addresume",addResume)
AddResumeRoutes.get("/getUserResumes",getUserResumes)
AddResumeRoutes.get("/getUserResumesByResumeId",getUserResumesByResumeId)

AddResumeRoutes.put("/updateResumeDetails",updateResumeDetails)
AddResumeRoutes.put("/updateResumeSummary",updateResumeSummary)
AddResumeRoutes.put("/updateExperienceDetails",updateExperienceDetails)

AddResumeRoutes.put("/updateProjectDetails",updateProjectDetails)


AddResumeRoutes.put("/updateEducationDetails",updateEducationDetails)
AddResumeRoutes.put("/updateSkillDetails",updateSkillDetails)

AddResumeRoutes.put("/updateTheme",updateTheme)

AddResumeRoutes.get("/getResumeById",getResumeById)


AddResumeRoutes.get("/deleteResumeById",deleteResumeById)












export default AddResumeRoutes
