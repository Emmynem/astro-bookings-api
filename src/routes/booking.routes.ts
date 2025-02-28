import { Router } from "express";
import { checks } from "../middleware/index";
import { UserRules } from "../rules/user.rules";
import { BookingRules } from "../rules/booking.rules";
import { DefaultRules } from "../rules/default.rules";
import BookingController from "../controllers/booking.controller";

class BookingRoutes {
	router = Router();
	controller = new BookingController();

	constructor() {
		this.intializeRoutes();
	}

	intializeRoutes() {

		this.router.get("/root/bookings", [checks.verifyKey as any], this.controller.getBookings as any);
		this.router.get("/root/booking/stats", [checks.verifyKey as any], this.controller.getBookingStats as any);
		this.router.get("/root/bookings/via/user", [checks.verifyKey as any, UserRules.forFindingUserAlt], this.controller.getBookingsSpecifically as any);
		this.router.get("/root/bookings/via/status", [checks.verifyKey as any, BookingRules.forFindingViaBookingStatus], this.controller.getBookingsSpecifically as any);
		this.router.get("/root/search/bookings", [checks.verifyKey as any, DefaultRules.forSearching], this.controller.searchBookings as any);
		this.router.get("/root/booking", [checks.verifyKey as any, BookingRules.forFindingBooking], this.controller.getBooking as any);

		this.router.post("/add/booking", [UserRules.forFindingUserAlt, BookingRules.forAdding as any], this.controller.addBooking as any);
		
		this.router.put("/update/topup/proof", [BookingRules.forFindingBooking, BookingRules.forUpdatingTopupProof as any], this.controller.updateBookingTopupProof as any);
		this.router.put("/root/update/booking/status", [checks.verifyKey as any, BookingRules.forFindingBooking, BookingRules.forFindingViaBookingStatus], this.controller.updateBookingStatus as any);

		this.router.delete("/root/booking", [checks.verifyKey as any, BookingRules.forFindingBooking], this.controller.deleteBooking as any);
	}
}

export default new BookingRoutes().router;