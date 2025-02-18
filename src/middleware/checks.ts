import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from 'uuid';
// import dotenv from 'dotenv';
import { UnauthorizedError, ForbiddenError, logger, BadRequestError, SuccessResponse } from '../common/index';
import API_KEY, { IApiKey } from "../models/apiKey.model";
import { 
	default_status, default_delete_status, astrobookings_header_key, astrobookings_telegram_id, tag_root, tag_internal_api_key, 
	access_granted, access_suspended
} from "../config/config";

// dotenv.config();

export interface IGetAuthTypesRequest extends Request {
	API_KEY: string,
	TELEGRAM_ID: string, 
}

const verifyKey = (req: IGetAuthTypesRequest, res: Response, next: NextFunction) => {
	const key = req.headers[astrobookings_header_key] || req.query.key || req.body.key || '';
	if (!key) {
		ForbiddenError(res, "No key provided!", null);
	} else {
		req.API_KEY = key;
		next();
	}
};

const keyExists = (req: IGetAuthTypesRequest, res: Response, next: NextFunction) => {
	API_KEY.findOne({
		where: {
			type: tag_root,
			api_key: req.API_KEY
		}
	}).then(api_key => {
		if (!api_key) {
			ForbiddenError(res, `Require ${tag_root} key!`, null);
		} else if (api_key.status === default_delete_status) {
			ForbiddenError(res, "Api key not available!", null);
		} else {
			SuccessResponse(res, "Key Exists!", { type: api_key.type });
		}
	});
};

const isRootKey = (req: IGetAuthTypesRequest, res: Response, next: NextFunction) => {
	API_KEY.findOne({
		where: {
			type: tag_root,
			api_key: req.API_KEY
		}
	}).then(api_key => {
		if (!api_key) {
			ForbiddenError(res, `Require ${tag_root} key!`, null);
		} else if (api_key.status === default_delete_status) {
			ForbiddenError(res, "Api key not available!", null);
		} else {
			next();
		}
	});
};

const isInternalKey = (req: IGetAuthTypesRequest, res: Response, next: NextFunction) => {
	API_KEY.findOne({
		where: {
			type: tag_internal_api_key,
			api_key: req.API_KEY
		}
	}).then(api_key => {
		if (!api_key) {
			ForbiddenError(res, `Require ${tag_internal_api_key} key!`, null);
		} else if (api_key.status === default_delete_status) {
			ForbiddenError(res, "Api key not available!", null);
		} else {
			next();
		}
	});
};

export default { verifyKey, keyExists, isRootKey, isInternalKey };