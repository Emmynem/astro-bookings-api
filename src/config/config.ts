import crypto from 'crypto';

export const primary_domain: string = "https://example.com";
export const admin_domain: string = "https://admin.example.com";
export const test_primary_domain: string = "https://jovial-tiramisu-a984ba.netlify.app";
export const test_admin_domain: string = "https://sunny-pithivier-da6ed4.netlify.app";
export const mailer_url: string = "https://api.mailer.xnyder.com";

export const tag_root: string = "Root";
export const anonymous: string = "Anonymous";
export const tag_internal_api_key: string = "Internal";
export const db_start: string = "astrobookings_";
export const db_end: string = "_tbl";

export const astrobookings_header_key: string = "astrobookings-access-key";
export const astrobookings_telegram_id: string = "x-telegram-id";

// Default Actions
export const completed: string = "Completed";
export const processing: string = "Processing";
export const cancelled: string = "Cancelled";
export const refunded: string = "Refunded";
export const active: string = "Active";
export const pending: string = "Pending";
export const withdrawn: string = "Withdrawn";
// End - Default Actions

// Default Transaction Types
export const withdrawal: string = "Withdrawal";
export const referral_withdrawal: string = "Referral Withdrawal";
export const deposit: string = "Deposit";
export const earning: string = "Earning";
export const referral_earning: string = "Referral Earning";
export const payment: string = "Payment";
export const reversal: string = "Reversal";
export const fee: string = "Fee";
export const charges: string = "Charges";
export const transaction_types = { withdrawal, referral_withdrawal, deposit, earning, referral_earning, payment, reversal, fee, charges };
// End - Default Transaction Types

// Default Currency
export const currency: string = "USD"; // USD - US Dollar
// End - Default Currency

export const false_status: boolean = false;
export const true_status: boolean = true;

export const zero: number = 0;

export const default_status: number = 1;
export const default_delete_status: number = 0;
export const default_pending_status: number = 2;

export const check_length_TINYTEXT: number = 255;
export const check_length_TEXT: number = 65535;
export const check_length_MEDIUMTEXT: number = 16777215;
export const check_length_LONGTEXT: number = 4294967295;

// Accesses
export const access_granted = 1;
export const access_suspended = 2;
export const access_revoked = 3;
export const all_access = [access_granted, access_suspended, access_revoked];
// End - Accesses

export const paginate_limit: number = 1000;

export interface IPagination {
	page?: number;
	size?: number;
	orderBy?: string;
	sortBy?: string;
	search?: string;
};

export interface ISearch {
	[key: string]: any;
};

// File lengths
export const file_length_5Mb: number = 5000000;
export const file_length_10Mb: number = 10000000;
export const file_length_15Mb: number = 15000000;
export const file_length_20Mb: number = 20000000;
export const file_length_25Mb: number = 25000000;
export const file_length_30Mb: number = 30000000;
export const file_length_35Mb: number = 35000000;
export const file_length_40Mb: number = 40000000;
export const file_length_45Mb: number = 45000000;
export const file_length_50Mb: number = 50000000;
export const file_length_55Mb: number = 55000000;
export const file_length_60Mb: number = 60000000;
export const file_length_65Mb: number = 65000000;
export const file_length_70Mb: number = 70000000;
export const file_length_75Mb: number = 75000000;
export const file_length_80Mb: number = 80000000;
export const file_length_85Mb: number = 85000000;
export const file_length_90Mb: number = 90000000;
export const file_length_95Mb: number = 95000000;
export const file_length_100Mb: number = 100000000;

export const today_str = () => {
	const d = new Date();
	const date_str = d.getFullYear() + "-" + ((d.getUTCMonth() + 1) < 10 ? "0" + (d.getUTCMonth() + 1) : (d.getUTCMonth() + 1)) + "-" + (d.getDate() < 10 ? "0" + d.getDate() : d.getDate());
	return date_str;
};

export const today_str_alt = (date: Date) => {
	const d = new Date(date);
	const date_str = d.getFullYear() + "-" + ((d.getUTCMonth() + 1) < 10 ? "0" + (d.getUTCMonth() + 1) : (d.getUTCMonth() + 1)) + "-" + (d.getDate() < 10 ? "0" + d.getDate() : d.getDate());
	return date_str;
};

export const todays_date = () => {
	const d = new Date();
	return d.toDateString();
};

export const year_str = () => {
	const d = new Date();
	const date_str = d.getFullYear();
	return date_str;
};

export const timestamp_str = (date: any) => {
	const d = new Date(date * 1000);
	return {
		fulldate: d.toDateString() + " at " + d.toLocaleTimeString(),
		date: d.toDateString(),
		time: d.toLocaleTimeString(),
	};
};

export const timestamp_str_alt = (date: string) => {
	const d = new Date(date);
	const date_ = d.getFullYear() + "-" + ((d.getUTCMonth() + 1) < 10 ? "0" + (d.getUTCMonth() + 1) : (d.getUTCMonth() + 1)) + "-" + (d.getDate() < 10 ? "0" + d.getDate() : d.getDate());
	const time_ = (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) + ":" + (d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes()) + ":" + (d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds());
	return date_ + " " + time_;
};

export const time_zero_hundred = () => {
	const d = new Date();
	const time_str = (d.getHours() < 10 ? "0" + d.getHours() : d.getHours()) + "00";
	return time_str;
};

export const random_uuid = (length: number) => {
	if (length === undefined || length === null || length === 0) {
		let values = crypto.randomBytes(20).toString('hex');
		return values;
	} else {
		let values = crypto.randomBytes(length).toString('hex');
		return values;
	}
};

export const random_numbers = (length: number) => {
	if (length === undefined || length === null || length === 0) {
		return 0;
	} else {
		let rand_number = "";
		for (let index = 0; index < length; index++) {
			rand_number += Math.floor(Math.random() * 10);
		}
		return rand_number;
	}
};

export const test_all_regex = (data: any, regex: RegExp) => {
	if (!data) {
		return false;
	}

	const valid = regex.test(data);
	if (!valid) {
		return false;
	}

	return true;
};

export const digit_filter = (digits: number) => {
	return digits.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const strip_text = (text: string) => {
	//Lower case everything
	let string = text.toLowerCase();
	//Make alphanumeric (removes all other characters)
	string = string.replace(/[^a-z0-9_\s-]/g, "");
	//Clean up multiple dashes or whitespaces
	string = string.replace(/[\s-]+/g, " ");
	//Convert whitespaces and underscore to dash
	string = string.replace(/[\s_]/g, "-");
	return string;
};

export const unstrip_text = (text: string) => {
	let string = text.replace(/[-_]/g, " ");
	return string;
};

export const unstrip_text_alt = (text: string) => {
	let string = text.replace(/[-_]/g, "");
	return string;
};

export const filterBytes = (bytes: any) => {
	if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '0 bytes';
	var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
		number = Math.floor(Math.log(bytes) / Math.log(1024));
	return (bytes / Math.pow(1024, Math.floor(number))).toFixed(1) + " " + units[number];
};

export const getFileExtension = (filename: string) => {
	let lastDot = filename.lastIndexOf('.');
	let ext = filename.substring(lastDot + 1);
	return ext;
};

export const strip_text_underscore = (text: string) => {
	let string = text.replace(/[\s]/g, "_");
	return string;
};

export const return_first_letter_uppercase = (str: any) => {
	return str.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, (letter: string) => letter.toUpperCase());
};

export const return_first_letter_uppercase_alt = (_str: any) => {
	const str = unstrip_text(_str);
	return str.toLowerCase().replace(/(^\w{1})|(\s+\w{1})/g, (letter: string) => letter.toUpperCase());
};

export const return_all_letters_uppercase = (str: any) => {
	return str ? str.toUpperCase() : str;
};

export const return_all_letters_lowercase = (str: any) => {
	return str ? str.toLowerCase() : str;
};

export const return_trimmed_data = (str: any) => {
	return str.trim();
};

export const return_sort_by = (str: any) => {
	if (!str) return "desc";
	else if (str.toLowerCase() !== "asc" && str.toLowerCase() !== "desc") return "desc";
	else return str.toLowerCase();
};

export const return_order_by_for_others = (str: any) => {
	if (!str) return "createdAt";
	else if (str !== "updatedAt") return "createdAt";
	else return (str === "updatedAt") ? str : str.toLowerCase();
};

export const validate_future_date = (date: any) => {
	const d = new Date(date);
	const today = new Date();
	if (typeof d === "string" && d === "Invalid Date") return false;
	if (today.getTime() > d.getTime()) return false;
	return true;
};

export const validate_past_date = (date: any) => {
	const d = new Date(date);
	const today = new Date();
	if (typeof d === "string" && d === "Invalid Date") return false;
	if (today.getTime() < d.getTime()) return false;
	return true;
};

export const validate_future_end_date = (_start: any, _end: any) => {
	const start = new Date(_start);
	const end = new Date(_end);
	if (typeof start === "string" && start === "Invalid Date") return false;
	if (typeof end === "string" && end === "Invalid Date") return false;
	if (start.getTime() >= end.getTime()) return false;
	return true;
};

export const validate_future_end_date_alt = (_start: any, _end: any) => {
	const start = new Date(_start);
	const end = new Date(_end * 1000);
	if (typeof start === "string" && start === "Invalid Date") return false;
	if (typeof end === "string" && end === "Invalid Date") return false;
	if (start.getTime() >= end.getTime()) return false;
	return true;
};

export const validate_transaction_types = (obj: any) => {
	const method = obj;
	if (
		method !== transaction_types.charges &&
		method !== transaction_types.deposit &&
		method !== transaction_types.payment &&
		method !== transaction_types.earning &&
		method !== transaction_types.withdrawal &&
		method !== transaction_types.fee &&
		method !== transaction_types.reversal
	) return false;
	return true;
};

export const paginate = (page: number, _records: number, total_records: number) => {
	// Get total pages available for the amount of records needed in each page with total records
	const records = !_records || _records < paginate_limit ? paginate_limit : _records;
	const pages = Math.ceil(total_records / records);
	// return false if page is less than 1 (first page) or greater than pages (last page)
	if (page < 1 || page > pages || !page) {
		return {
			start: 0,
			end: total_records < records ? total_records : records,
			pages: pages,
			limit: total_records < records ? total_records : records,
		};
	}

	// get the end limit
	const end = pages === page ? total_records : (page === 1 ? page * records : page * records);
	// get start limit
	// if records are uneven at the last page, show all records from last ending to the end
	const start = page === 1 ? 0 : (pages === page ? ((total_records - records) - (total_records - (page * records))) : end - records);

	// return object
	return {
		start: start,
		end: end,
		pages: pages,
		limit: end - start,
	};
};
