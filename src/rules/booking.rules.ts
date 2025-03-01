import { Request, Response } from "express";
import { Op } from "sequelize";
import { check } from 'express-validator';
import moment from 'moment';
import BOOKING from "../models/booking.model";
import { default_status, default_delete_status, check_length_TEXT } from '../config/config';

export const BookingRules = {
	forFindingBookingInternal: [
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom(async (unique_id: string, { req: Request }) => {
				const data = await BOOKING.findOne({ where: { unique_id: unique_id } });
				if (!data) return Promise.reject('Booking not found!');
			})
	],
	forFindingBooking: [
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom(async (unique_id: string, { req: Request }) => {
				const data = await BOOKING.findOne({ where: { unique_id: unique_id, status: default_status } });
				if (!data) return Promise.reject('Booking not found!');
			})
	],
	forFindingBookingFalsy: [
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom(async (unique_id: string, { req: Request }) => {
				const data = await BOOKING.findOne({ where: { unique_id: unique_id, status: default_delete_status } });
				if (!data) return Promise.reject('Booking not found!');
			})
	],
	forFindingBookingAlt: [
		check('booking_unique_id', "Booking Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom(async (booking_unique_id: string, { req: Request }) => {
				const data = await BOOKING.findOne({ where: { unique_id: booking_unique_id, status: default_status } });
				if (!data) return Promise.reject('Booking not found!');
			})
	],
	forAdding: [
		check('fullname', "Fullname is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isString().isLength({ min: 1, max: 500 })
			.withMessage("Invalid length (1 - 500) characters"),
		check('email', "Email is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isEmail()
			.withMessage('Invalid email format'),
		check('phone_number')
			.optional({ checkFalsy: false })
			.bail()
			.isMobilePhone("any")
			.withMessage('Invalid phone number'),
		// check('priority', "Priority is required")
		// 	.exists({ checkNull: true })
		// 	.bail()
		// 	.isBoolean()
		// 	.withMessage("Value should be true or false"),
		check('details')
			.optional({ checkFalsy: false })
			.bail()
			.isString().isLength({ min: 1, max: check_length_TEXT })
			.withMessage("Invalid length (1 - check_length_TEXT) characters"),
		check('proof_image', "Proof Image is required")
			.exists({ checkNull: true })
			.bail()
			.isURL()
			.withMessage("Value must be a specified url"),
		check('proof_image_public_id', "Proof Image Public Id is required")
			.exists({ checkNull: true })
			.bail()
			.isLength({ min: 2, max: 500 })
			.withMessage(`Invalid length (2 - ${500}) characters`),
		check('topup_proof_image')
			.optional({ checkFalsy: false })
			.bail()
			.isURL()
			.withMessage("Value must be a specified url"),
		check('topup_proof_image_public_id')
			.optional({ checkFalsy: false })
			.bail()
			.isLength({ min: 2, max: 500 })
			.withMessage(`Invalid length (2 - ${500}) characters`),
	], 
	forFindingViaBookingStatus: [
		check('booking_status', "Booking Status is required")
			.exists({ checkNull: true, checkFalsy: true })
	], 
	forUpdatingTopupProof: [
		check('topup_proof_image')
			.optional({ checkFalsy: false })
			.bail()
			.isURL()
			.withMessage("Value must be a specified url"),
		check('topup_proof_image_public_id')
			.optional({ checkFalsy: false })
			.bail()
			.isLength({ min: 2, max: 500 })
			.withMessage(`Invalid length (2 - ${500}) characters`),
	]
}