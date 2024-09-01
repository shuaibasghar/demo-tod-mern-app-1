/*

export const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
        });
        console.log("Database Connected");
    } catch (error) {
        console.log(error.message);
    }
};


export const responseReturn = (res, code, data) => {
    return res.status(code).json(data);
};

import jwt from "jsonwebtoken";
// ------------------
export const createToken = async (data) => {
    const token = await jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    return token;
};

        responseReturn(res, 500, { error: error.message });


// ---------------

                const token = await createToken({
                id: student.id,
                role: student.role,
            });
            res.cookie("accessToken", token, {
                expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });

            responseReturn(res, 201, { token, message: "Register Success" });



//---------------
              res.cookie("accessToken", token, {
                    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    httpOnly: true, // Makes the cookie inaccessible to JavaScript
                    secure: process.env.NODE_ENV === "production", // Ensures the cookie is only sent over HTTPS in production
                    sameSite: "strict", // Helps prevent CSRF attacks
                });
                responseReturn(res, 200, { token, message: " Login Success" }); 

// ---------------

// -----------------------------------------------

// =--------------------

import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
    const { accessToken } = req.cookies;

    if (!accessToken) {
        return res.status(409).json({ error: "Please Login First" });
    }

    try {
        const decodeToken = await jwt.verify(
            accessToken,
            process.env.JWT_SECRET
        );
        req.role = decodeToken.role;
        req.id = decodeToken.id;

        // Check if the role is admin
        if (req.role !== "admin") {
            return res.status(403).json({ error: "Access Denied" });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: "Failed to authenticate " });
    }
};


*/
