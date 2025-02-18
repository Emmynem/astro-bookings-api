import { Request, Response } from "express";
import { Op } from "sequelize";
import { check } from 'express-validator';
import moment from 'moment';
import USER from "../models/user.model";
import { default_status, default_delete_status, check_length_TEXT } from '../config/config';

export const UserRules = {
	forFindingUserInternal: [
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom(async (unique_id: string, { req: Request }) => {
				const data = await USER.findOne({ where: { unique_id: unique_id } });
				if (!data) return Promise.reject('User not found!');
			})
	],
	forFindingUser: [
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom(async (unique_id: string, { req: Request }) => {
				const data = await USER.findOne({ where: { unique_id: unique_id, status: default_status } });
				if (!data) return Promise.reject('User not found!');
			})
	],
	forFindingUserFalsy: [
		check('unique_id', "Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom(async (unique_id: string, { req: Request }) => {
				const data = await USER.findOne({ where: { unique_id: unique_id, status: default_delete_status } });
				if (!data) return Promise.reject('User not found!');
			})
	],
	forFindingUserAlt: [
		check('user_unique_id', "User Unique Id is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.custom(async (user_unique_id: string, { req: Request }) => {
				const data = await USER.findOne({ where: { unique_id: user_unique_id, status: default_status } });
				if (!data) return Promise.reject('User not found!');
			})
	],
	forAdding: [
		check('fullname', "Fullname is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isString().isLength({ min: 1, max: 500 })
			.withMessage("Invalid length (1 - 500) characters"),
		check('description')
			.optional({ checkFalsy: false })
			.bail()
			.isString().isLength({ min: 1, max: check_length_TEXT })
			.withMessage("Invalid length (1 - check_length_TEXT) characters"),
		check('fee', "Fee is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isFloat()
			.custom(fee => {
				if (fee < 0) return false;
				else return true;
			})
			.withMessage("Fee invalid"),
		check('priority_fee')
			.optional({ checkFalsy: false })
			.bail()
			.isFloat()
			.custom(priority_fee => {
				if (priority_fee < 0) return false;
				else return true;
			})
			.withMessage("Fee invalid"),
		check('profile_image')
			.optional({ checkFalsy: false })
			.bail()
			.isURL()
			.withMessage("Value must be a specified url"),
		check('profile_image_public_id')
			.optional({ checkFalsy: false })
			.bail()
			.isLength({ min: 2, max: 500 })
			.withMessage(`Invalid length (2 - ${500}) characters`),
	],
	forUpdatingDetails: [
		check('fullname', "Fullname is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isString().isLength({ min: 1, max: 500 })
			.withMessage("Invalid length (1 - 500) characters"),
		check('fee', "Fee is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isFloat()
			.custom(fee => {
				if (fee < 0) return false;
				else return true;
			})
			.withMessage("Fee invalid"),
		check('priority_fee')
			.optional({ checkFalsy: false })
			.bail()
			.isFloat()
			.custom(priority_fee => {
				if (priority_fee < 0) return false;
				else return true;
			})
			.withMessage("Fee invalid"),
	], 
	forUpdatingDescription: [
		check('description', "Description is required")
			.exists({ checkNull: true, checkFalsy: true })
			.bail()
			.isString().isLength({ min: 1, max: check_length_TEXT })
			.withMessage("Invalid length (1 - check_length_TEXT) characters"),
	], 
	forUpdatingProfile: [
		check('profile_image')
			.optional({ checkFalsy: false })
			.bail()
			.isURL()
			.withMessage("Value must be a specified url"),
		check('profile_image_public_id')
			.optional({ checkFalsy: false })
			.bail()
			.isLength({ min: 2, max: 500 })
			.withMessage(`Invalid length (2 - ${500}) characters`),
	]
}