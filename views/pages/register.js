// React & Next
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Components
import Meta from "../components/Meta";
import RegisterForm from "../components/auth/RegisterForm";

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, ["common", "register"])),
		},
	};
}

function Register() {
	const { t } = useTranslation(["common", "register"]);

	return (
		<>
			<Meta title={`${t("register:meta-title")} | ChopTheBill`} />
			<div className="center">
				<main className="auth-container">
					<div className="auth-logo"></div>
					<RegisterForm />
				</main>
			</div>
		</>
	);
}

export default Register;
