import { Request, Response } from "express";
import { Op } from "sequelize";
import { validationResult, matchedData } from 'express-validator';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import USER, { IUser } from "../models/user.model";
import { IGetAuthTypesRequest } from "../middleware/checks";
import { ServerError, SuccessResponse, ValidationError, OtherSuccessResponse, NotFoundError, BadRequestError, logger } from '../common/index';
import {
	IPagination, ISearch, default_status, mailer_url, paginate, return_all_letters_uppercase, random_uuid, anonymous
} from '../config/config';
import { deleteImage } from '../middleware/uploads';

dotenv.config();

const { clouder_key, cloudy_name, cloudy_key, cloudy_secret } = process.env;

export default class UserController {
	async getUsers(req: IGetAuthTypesRequest, res: Response) {
		const api_key: string = req.API_KEY;

		const queryParams: IPagination = req.query;

		const total_records = await USER.count();
		const pagination = paginate(queryParams.page || parseInt(req.body.page), queryParams.size || parseInt(req.body.size), total_records);
		const orderBy = queryParams.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(queryParams.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		try {
			const response = await USER.findAndCountAll({
				attributes: { exclude: ['id','profile_image_public_id'] },
				order: [
					[orderBy, sortBy]
				],
				distinct: true,
				offset: pagination.start,
				limit: pagination.limit
			});

			if (response.count === 0) {
				return SuccessResponse(res, { unique_id: api_key, text: "Users Not found" }, []);
			} else {
				return SuccessResponse(res, { unique_id: api_key, text: "Users loaded" }, { ...response, pages: pagination.pages });
			}
		} catch (err: any) {
			return ServerError(res, { unique_id: api_key, text: err.message }, null);
		}
	}

	async getUserStats(req: IGetAuthTypesRequest, res: Response) {
		const api_key: string = req.API_KEY;

		try {
			const total_users = await USER.count();

			return SuccessResponse(res, { unique_id: api_key, text: "User Stats loaded" }, { total_users });
		} catch (err: any) {
			return ServerError(res, { unique_id: api_key, text: err.message }, null);
		}
	}

	async getUser(req: IGetAuthTypesRequest, res: Response) {
		const api_key: string = req.API_KEY;

		const errors = validationResult(req);
		const payload = matchedData(req);

		if (!errors.isEmpty()) {
			return ValidationError(res, { unique_id: api_key, text: "Validation Error Occured" }, errors.array())
		}

		try {
			const response = await USER.findOne({
				attributes: { exclude: ['id','profile_image_public_id'] },
				where: {
					...payload
				}
			});

			if (!response) {
				return SuccessResponse(res, { unique_id: api_key, text: "User Not found" }, null);
			} else {
				return SuccessResponse(res, { unique_id: api_key, text: "User loaded" }, response);
			}
		} catch (err: any) {
			return ServerError(res, { unique_id: api_key, text: err.message }, null);
		}
	}

	async searchUsers(req: IGetAuthTypesRequest, res: Response) {
		const api_key: string = req.API_KEY;

		const queryParams: IPagination = req.query;

		const total_records = await USER.count({
			where: {
				[Op.or]: [
					{
						fullname: { [Op.or]: { [Op.like]: `%${queryParams.search}`, [Op.startsWith]: `${queryParams.search}`, [Op.endsWith]: `${queryParams.search}`, [Op.substring]: `${queryParams.search}` } }
					},
				]
			}
		});
		const pagination = paginate(queryParams.page || parseInt(req.body.page), queryParams.size || parseInt(req.body.size), total_records);
		const orderBy = queryParams.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(queryParams.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		try {
			const response = await USER.findAndCountAll({
				attributes: { exclude: ['id','profile_image_public_id'] },
				where: {
					[Op.or]: [
						{
							fullname: { [Op.or]: { [Op.like]: `%${queryParams.search}`, [Op.startsWith]: `${queryParams.search}`, [Op.endsWith]: `${queryParams.search}`, [Op.substring]: `${queryParams.search}` } }
						},
					]
				},
				order: [
					[orderBy, sortBy]
				],
				distinct: true,
				offset: pagination.start,
				limit: pagination.limit
			});

			if (response.count === 0) {
				return SuccessResponse(res, { unique_id: api_key, text: "Users Not found" }, []);
			} else {
				return SuccessResponse(res, { unique_id: api_key, text: "Users loaded" }, { ...response, pages: pagination.pages });
			}
		} catch (err: any) {
			return ServerError(res, { unique_id: api_key, text: err.message }, null);
		}
	}

	async publicGetUsers(req: IGetAuthTypesRequest, res: Response) {
		const queryParams: IPagination = req.query;

		const total_records = await USER.count();
		const pagination = paginate(queryParams.page || parseInt(req.body.page), queryParams.size || parseInt(req.body.size), total_records);
		const orderBy = queryParams.orderBy || req.body.orderBy || "createdAt";
		const sortBy = return_all_letters_uppercase(queryParams.sortBy) || return_all_letters_uppercase(req.body.sortBy) || "DESC";

		try {
			const response = await USER.findAndCountAll({
				attributes: { exclude: ['id', 'profile_image_public_id', 'createdAt', 'updatedAt', 'status'] },
				order: [
					[orderBy, sortBy]
				],
				distinct: true,
				offset: pagination.start,
				limit: pagination.limit
			});

			if (response.count === 0) {
				return SuccessResponse(res, { unique_id: anonymous, text: "Users Not found" }, []);
			} else {
				return SuccessResponse(res, { unique_id: anonymous, text: "Users loaded" }, { ...response, pages: pagination.pages });
			}
		} catch (err: any) {
			return ServerError(res, { unique_id: anonymous, text: err.message }, null);
		}
	}

	async publicGetUser(req: IGetAuthTypesRequest, res: Response) {
		const errors = validationResult(req);
		const payload = matchedData(req);

		if (!errors.isEmpty()) {
			return ValidationError(res, { unique_id: anonymous, text: "Validation Error Occured" }, errors.array())
		}

		try {
			const response = await USER.findOne({
				attributes: { exclude: ['id', 'profile_image_public_id', 'createdAt', 'updatedAt', 'status'] },
				where: {
					...payload
				}
			});

			if (!response) {
				return SuccessResponse(res, { unique_id: anonymous, text: "User Not found" }, null);
			} else {
				return SuccessResponse(res, { unique_id: anonymous, text: "User loaded" }, response);
			}
		} catch (err: any) {
			return ServerError(res, { unique_id: anonymous, text: err.message }, null);
		}
	}

	async createUser(req: IGetAuthTypesRequest, res: Response) {
		const api_key: string = req.API_KEY;

		const errors = validationResult(req);
		const payload = matchedData(req);

		if (!errors.isEmpty()) {
			return ValidationError(res, { unique_id: api_key, text: "Validation Error Occured" }, errors.array())
		} 

		try {
			await USER.sequelize?.transaction(async (transaction) => {
				const response = await USER.create(
					{
						unique_id: uuidv4(),
						fullname: payload.fullname,
						description: payload.description ? payload.description : null,
						fee: parseFloat(payload.fee),
						priority_fee: payload.priority_fee ? parseFloat(payload.priority_fee) : null,
						profile_image: payload.profile_image ? payload.profile_image : null,
						profile_image_public_id: payload.profile_image_public_id ? payload.profile_image_public_id : null,
						status: default_status
					}, { transaction }
				);

				if (response) {
					return SuccessResponse(res, { unique_id: api_key, text: "User created successfully!" }, null);
				} else {
					throw new Error("Error creating user");
				}
			});
		} catch (err: any) {
			return ServerError(res, { unique_id: api_key, text: err.message }, null);
		}
	}

	async updateUserDetails(req: IGetAuthTypesRequest, res: Response) {
		const api_key: string = req.API_KEY;

		const errors = validationResult(req);
		const payload = matchedData(req);

		if (!errors.isEmpty()) {
			return ValidationError(res, { unique_id: api_key, text: "Validation Error Occured" }, errors.array())
		} 

		try {
			await USER.sequelize?.transaction(async (transaction) => {
				const response = await USER.update(
					{
						fullname: payload.description.fullname,
						fee: parseFloat(payload.fee),
						priority_fee: payload.priority_fee ? parseFloat(payload.priority_fee) : null,
					}, {
						where: {
							unique_id: payload.unique_id,
							status: default_status
						},
						transaction
					}
				);

				if (response[0] > 0) {
					return SuccessResponse(res, { unique_id: api_key, text: "Details updated successfully!" }, null);
				} else {
					throw new Error("Error updating details");
				}
			});
		} catch (err: any) {
			return ServerError(res, { unique_id: api_key, text: err.message }, null);
		}
	}

	async updateUserDescription(req: IGetAuthTypesRequest, res: Response) {
		const api_key: string = req.API_KEY;

		const errors = validationResult(req);
		const payload = matchedData(req);

		if (!errors.isEmpty()) {
			return ValidationError(res, { unique_id: api_key, text: "Validation Error Occured" }, errors.array())
		} 

		try {
			await USER.sequelize?.transaction(async (transaction) => {
				const response = await USER.update(
					{
						description: payload.description ? payload.description : null,
					}, {
						where: {
							unique_id: payload.unique_id,
							status: default_status
						},
						transaction
					}
				);

				if (response[0] > 0) {
					return SuccessResponse(res, { unique_id: api_key, text: "Details updated successfully!" }, null);
				} else {
					throw new Error("Error updating details");
				}
			});
		} catch (err: any) {
			return ServerError(res, { unique_id: api_key, text: err.message }, null);
		}
	}

	async updateUserProfileImage(req: IGetAuthTypesRequest, res: Response) {
		const api_key: string = req.API_KEY;

		const errors = validationResult(req);
		const payload = matchedData(req);

		if (!errors.isEmpty()) {
			return ValidationError(res, { unique_id: api_key, text: "Validation Error Occured" }, errors.array())
		} 

		try {
			const user_details = await USER.findOne({
				attributes: { exclude: ['id'] },
				where: { unique_id: payload.unique_id }
			});

			if (!user_details) {
				return BadRequestError(res, { unique_id: api_key, text: "User Not found" }, null);
			}

			await USER.sequelize?.transaction(async (transaction) => {
				const response = await USER.update(
					{
						profile_image: payload.profile_image ? payload.profile_image : null,
						profile_image_public_id: payload.profile_image_public_id ? payload.profile_image_public_id : null,
					}, {
						where: {
							unique_id: payload.unique_id,
							status: default_status
						},
						transaction
					}
				);

				if (response[0] > 0) {
					SuccessResponse(res, { unique_id: api_key, text: "Details updated successfully!" }, null);
					
					// Delete former image available
					if (user_details.profile_image_public_id !== null) {
						await deleteImage(clouder_key, { cloudinary_name: cloudy_name, cloudinary_key: cloudy_key, cloudinary_secret: cloudy_secret, public_id: user_details.profile_image_public_id });
					}
				} else {
					throw new Error("Error updating details");
				}
			});
		} catch (err: any) {
			return ServerError(res, { unique_id: api_key, text: err.message }, null);
		}
	}

	async deleteUser(req: IGetAuthTypesRequest, res: Response) {
		const api_key: string = req.API_KEY;

		const errors = validationResult(req);
		const payload = matchedData(req);

		if (!errors.isEmpty()) {
			return ValidationError(res, { unique_id: api_key, text: "Validation Error Occured" }, errors.array())
		}

		try {
			const user_details = await USER.findOne({
				attributes: { exclude: ['id'] },
				where: { unique_id: payload.unique_id }
			});

			if (!user_details) {
				return BadRequestError(res, { unique_id: api_key, text: "User Not found" }, null);
			}
			
			await USER.sequelize?.transaction(async (transaction) => {
				const response = await USER.destroy(
					{
						where: {
							unique_id: payload.unique_id,
							status: default_status
						}
					}
				);

				if (response > 0) {
					SuccessResponse(res, { unique_id: api_key, text: "User was deleted successfully!" }, null);

					// Delete former image available
					if (user_details.profile_image_public_id !== null) {
						await deleteImage(clouder_key, { cloudinary_name: cloudy_name, cloudinary_key: cloudy_key, cloudinary_secret: cloudy_secret, public_id: user_details.profile_image_public_id });
					}
				} else {
					throw new Error("Error deleting record");
				}
			});
		} catch (err: any) {
			return ServerError(res, { unique_id: api_key, text: err.message }, null);
		}
	}
};
