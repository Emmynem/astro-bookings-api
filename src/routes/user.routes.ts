import { Router } from "express";
import { checks } from "../middleware/index";
import { UserRules } from "../rules/user.rules";
import { DefaultRules } from "../rules/default.rules";
import UserController from "../controllers/user.controller";

class UserRoutes {
	router = Router();
	controller = new UserController();

	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {

		this.router.get("/root/users", [checks.verifyKey as any], this.controller.getUsers as any);
		this.router.get("/root/user/stats", [checks.verifyKey as any], this.controller.getUserStats as any);
		this.router.get("/root/search/users", [checks.verifyKey as any, DefaultRules.forSearching], this.controller.searchUsers as any);
		this.router.get("/root/user", [checks.verifyKey as any, UserRules.forFindingUser], this.controller.getUser as any);
		
		this.router.get("/users", this.controller.publicGetUsers as any);
		this.router.get("/user", [UserRules.forFindingUser as any], this.controller.publicGetUser as any);
		
		this.router.post("/root/create/user", [checks.verifyKey as any, UserRules.forAdding], this.controller.createUser as any);
		
		this.router.put("/root/update/details", [checks.verifyKey as any, UserRules.forFindingUser, UserRules.forUpdatingDetails], this.controller.updateUserDetails as any);
		this.router.put("/root/update/description", [checks.verifyKey as any, UserRules.forFindingUser, UserRules.forUpdatingDescription], this.controller.updateUserDescription as any);
		this.router.put("/root/update/profile/image", [checks.verifyKey as any, UserRules.forFindingUser, UserRules.forUpdatingProfile], this.controller.updateUserProfileImage as any);

		this.router.delete("/root/user", [checks.verifyKey as any, UserRules.forFindingUser], this.controller.deleteUser as any);
	}
}

export default new UserRoutes().router;