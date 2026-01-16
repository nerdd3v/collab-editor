import { Router } from "express";
import { fileModel, signupModel } from "../db/index.js";
export const regRouter = Router();
regRouter.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json({
            message: 'username or password is missing'
        });
    }
    const ifExists = await signupModel.findOne({
        username
    });
    if (ifExists != null) {
        return res.json({
            message: "user already exists"
        }).status(400);
    }
    try {
        const x = await signupModel.create({
            username,
            password
        });
        return res.json({
            id: x._id
        }).status(200);
    }
    catch (error) {
        return res.json("internal server error").status(500);
    }
});
regRouter.post('/createFile', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.json({
            message: "file name not found"
        }).status(400);
    }
    try {
        const x = await fileModel.create({
            name
        });
        return res.json({
            message: "file creation success"
        }).status(200);
    }
    catch (error) {
        return res.json({
            message: 'internal server error'
        }).status(500);
    }
});
//# sourceMappingURL=index.js.map