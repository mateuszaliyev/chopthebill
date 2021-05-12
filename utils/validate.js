// Validator
const validator = require("validator");

function registerValidate({
	email,
	username,
	password,
	hideEmail,
	language,
	theme,
}) {
	const issues = [];
	if (
		!validator.isEmail(email) ||
		!validator.isLength(email, { min: 3, max: 63 })
	) {
		issues.push("email-invalid");
	}

	if (username !== "") {
		if (!validator.isAlphanumeric(username)) {
			issues.push("username-invalid");
		}

		if (!validator.isLength(username, { min: 3, max: 63 })) {
			issues.push("username-length-invalid");
		}
	} else if (hideEmail) {
		issues.push("exclusion");
	}

	if (
		!validator.isStrongPassword(password, {
			minLength: 6,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 0,
		})
	) {
		issues.push("password-invalid");
	}

	if (!validator.isLength(language, { max: 15 })) {
		issues.push("language-invalid");
	}

	if (!validator.isLength(theme, { max: 63 })) {
		issues.push("theme-invalid");
	}

	return issues;
}

function loginValidate(email, password) {
	if (
		!validator.isEmail(email) ||
		!validator.isLength(email, { min: 3, max: 63 }) ||
		!validator.isLength(password, { min: 3, max: 63 })
	) {
		return false;
	}
	return true;
}

function resetPasswordValidate(password) {
	if (
		validator.isStrongPassword(password, {
			minLength: 6,
			minLowercase: 1,
			minUppercase: 1,
			minNumbers: 1,
			minSymbols: 0,
		})
	) {
		return true;
	}
	return false;
}

function settingsValidate({ email, username, hideEmail, language, theme }) {
	const issues = [];
	if (
		!validator.isEmail(email) ||
		!validator.isLength(email, { min: 3, max: 63 })
	) {
		issues.push("email-invalid");
	}

	if (username !== "") {
		if (!validator.isAlphanumeric(username)) {
			issues.push("username-invalid");
		}

		if (!validator.isLength(username, { min: 3, max: 63 })) {
			issues.push("username-length-invalid");
		}
	} else if (hideEmail) {
		issues.push("exclusion");
	}

	if (!validator.isLength(language, { max: 15 })) {
		issues.push("language-invalid");
	}

	if (!validator.isLength(theme, { max: 63 })) {
		issues.push("theme-invalid");
	}

	return issues;
}

module.exports = {
	registerValidate,
	loginValidate,
	resetPasswordValidate,
	settingsValidate,
};
