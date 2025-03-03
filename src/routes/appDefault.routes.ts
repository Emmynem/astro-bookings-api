import { Router } from "express";
import { checks } from "../middleware/index";
import { AppDefaultRules } from "../rules/appDefault.rules";
import { DefaultRules } from "../rules/default.rules";
import AppDefaultController from "../controllers/appDefault.controller";

class AppDefaultRoutes {
	router = Router();
	controller = new AppDefaultController();

	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {

		this.router.get("/root/app/defaults", [checks.verifyKey as any], this.controller.getAppDefaults as any);
		this.router.get("/root/search/app/defaults", [checks.verifyKey as any, DefaultRules.forSearching], this.controller.searchAppDefaults as any);
		this.router.get("/root/app/default", [checks.verifyKey as any, AppDefaultRules.forFindingAppDefault], this.controller.getAppDefault as any);

		this.router.get("/search/app/defaults", [DefaultRules.forSearching as any], this.controller.publicSearchAppDefaults as any);
		this.router.get("/app/default", [AppDefaultRules.forFindingAppDefault as any], this.controller.publicGetAppDefault as any);

		this.router.post("/root/create/app/default", [checks.verifyKey as any, AppDefaultRules.forAddingAndUpdating], this.controller.addAppDefault as any);

		this.router.put("/root/update/app/default/details", [checks.verifyKey as any, AppDefaultRules.forFindingAppDefault, AppDefaultRules.forAddingAndUpdating], this.controller.updateAppDefaultDetails as any);

		this.router.delete("/root/app/default", [checks.verifyKey as any, AppDefaultRules.forFindingAppDefault], this.controller.deleteAppDefault as any);
	}
}

export default new AppDefaultRoutes().router;