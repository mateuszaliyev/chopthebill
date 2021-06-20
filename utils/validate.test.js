const {
	registerValidate,
	loginValidate,
	passwordValidate,
	settingsValidate,
	expenseValidate,
	groupValidate,
} = require("./validate");

test("validates register data", () => {
	const registerData = {
		email: "chopthebill@chopthebill.com",
		username: "chopthebill",
		password: "zaq1@WSX",
		passwordConfirm: "zaq1@WSX",
		hideEmail: false,
		language: "en",
		theme: "default-dark",
	};
	expect(
		registerValidate({
			...registerData,
			email: "",
		})
	).toContain("email-invalid");
	expect(
		registerValidate({
			...registerData,
			email:
				"chopthebillchopthebillchopthebillchopthebillchopthebillchopthebillchopthebill@chopthebill.com",
		})
	).toContain("email-invalid");
	expect(
		registerValidate({
			...registerData,
			username: "!@#$%^&*",
		})
	).toContain("username-invalid");
	expect(
		registerValidate({
			...registerData,
			username: "Łukasz",
		})
	).toContain("username-invalid");
	expect(
		registerValidate({
			...registerData,
			username: "Chop The Bill",
		})
	).toContain("username-invalid");
	expect(
		registerValidate({
			...registerData,
			username: "ch",
		})
	).toContain("username-length-invalid");
	expect(
		registerValidate({
			...registerData,
			username:
				"chopthebillchopthebillchopthebillchopthebillchopthebillchopthebillchopthebillchopthebillchopthebill",
		})
	).toContain("username-length-invalid");
	expect(
		registerValidate({
			...registerData,
			username: "",
			hideEmail: true,
		})
	).toContain("exclusion");
	expect(
		registerValidate({
			...registerData,
			password: "xsw2!QAZ",
		})
	).toContain("passwords-do-not-match");
	expect(
		registerValidate({
			...registerData,
			passwordConfirm: "xsw2!QAZ",
		})
	).toContain("passwords-do-not-match");
	expect(
		registerValidate({
			...registerData,
			password: "q1@W",
			passwordConfirm: "q1@W",
		})
	).toContain("password-invalid");
	expect(
		registerValidate({
			...registerData,
			password: "ZAQ1@WSX",
			passwordConfirm: "ZAQ1@WSX",
		})
	).toContain("password-invalid");
	expect(
		registerValidate({
			...registerData,
			password: "zaq1@wsx",
			passwordConfirm: "zaq1@wsx",
		})
	).toContain("password-invalid");
	expect(
		registerValidate({
			...registerData,
			password: "zaq!@WSX",
			passwordConfirm: "zaq!@WSX",
		})
	).toContain("password-invalid");
	expect(
		registerValidate({
			...registerData,
			language: "syryjski-aramejski",
		})
	).toContain("language-invalid");
	expect(
		registerValidate({
			...registerData,
			theme:
				"burgundowo-karmazynowo-łososiowo-amarantowo-oberżynowo-antracytowy-motyw",
		})
	).toContain("theme-invalid");
	expect(registerValidate(registerData)).toStrictEqual([]);
});

test("validates login data", () => {
	expect(loginValidate("chopthebill@chopthebill.com", "zaq1@WSX")).toBeTruthy();
	expect(
		loginValidate(
			"chopthebillchopthebillchopthebillchopthebillchopthebillchopthebillchopthebillchopthebillchopthebillchopthebill@chopthebill.com",
			"zaq1@WSX"
		)
	).toBeFalsy();
	expect(loginValidate("chopthebill", "zaq1@WSX")).toBeFalsy();
	expect(loginValidate("", "zaq1@WSX")).toBeFalsy();
	expect(loginValidate("chopthebill@chopthebill.com", "")).toBeFalsy();
});

test("validates password", () => {
	expect(passwordValidate("q1@W")).toBeFalsy();
	expect(passwordValidate("ZAQ1@WSX")).toBeFalsy();
	expect(passwordValidate("zaq1@wsx")).toBeFalsy();
	expect(passwordValidate("zaq!@WSX")).toBeFalsy();
	expect(passwordValidate("zaq1@WSX")).toBeTruthy();
});

test("validates settings", () => {
	const settingsData = {
		email: "chopthebill@chopthebill.com",
		username: "chopthebill",
		hideEmail: false,
		language: "en",
		theme: "default-dark",
	};

	expect(
		settingsValidate({
			...settingsData,
			email: "",
		})
	).toContain("email-invalid");
	expect(
		settingsValidate({
			...settingsData,
			email:
				"chopthebillchopthebillchopthebillchopthebillchopthebillchopthebillchopthebill@chopthebill.com",
		})
	).toContain("email-invalid");
	expect(
		settingsValidate({
			...settingsData,
			username: "!@#$%^&*",
		})
	).toContain("username-invalid");
	expect(
		settingsValidate({
			...settingsData,
			username: "Łukasz",
		})
	).toContain("username-invalid");
	expect(
		settingsValidate({
			...settingsData,
			username: "Chop The Bill",
		})
	).toContain("username-invalid");
	expect(
		settingsValidate({
			...settingsData,
			username: "ch",
		})
	).toContain("username-length-invalid");
	expect(
		settingsValidate({
			...settingsData,
			username:
				"chopthebillchopthebillchopthebillchopthebillchopthebillchopthebillchopthebillchopthebillchopthebill",
		})
	).toContain("username-length-invalid");
	expect(
		settingsValidate({
			...settingsData,
			username: "",
			hideEmail: true,
		})
	).toContain("exclusion");
	expect(
		settingsValidate({
			...settingsData,
			language: "syryjski-aramejski",
		})
	).toContain("language-invalid");
	expect(
		settingsValidate({
			...settingsData,
			theme:
				"burgundowo-karmazynowo-łososiowo-amarantowo-oberżynowo-antracytowy-motyw",
		})
	).toContain("theme-invalid");
	expect(settingsValidate(settingsData)).toStrictEqual([]);
});

test("validates expense", () => {
	expect(expenseValidate("w", "opis")).toContain("title-length-invalid");
	expect(
		expenseValidate(
			"wydatekwydatekwydatekwydatekwydatekwydatekwydatekwydatekwydatekwydatek",
			"opis"
		)
	).toContain("title-length-invalid");
	expect(
		expenseValidate(
			"wydatek",
			"opisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopis"
		)
	).toContain("description-length-invalid");
	expect(expenseValidate("wydatek", "opis")).toStrictEqual([]);
});

test("validates group", () => {
	expect(groupValidate("nazwa", "opis")).toStrictEqual([]);
	expect(groupValidate("Na", "opis")).toContain("name-length-invalid");
	expect(
		groupValidate(
			"nazwanazwanazwanazwanazwanazwanazwanazwanazwanazwanazwanazwanazw",
			"opis"
		)
	).toContain("name-length-invalid");
	expect(
		groupValidate(
			"nazwa",
			"opisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopisopis"
		)
	).toContain("description-length-invalid");
});
