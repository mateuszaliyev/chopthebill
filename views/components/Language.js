// React & Next
import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// Material UI
import { Button, Menu, MenuItem } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TranslateIcon from "@material-ui/icons/Translate";

// Components
import Link from "./Link";

function Language() {
	const router = useRouter();
	const [languageAnchor, setLanguageAnchor] = useState(null);
	const { t } = useTranslation("common");

	const handleClick = (event) => {
		setLanguageAnchor(event.currentTarget);
	};

	const handleClose = () => {
		setLanguageAnchor(null);
	};

	return (
		<>
			<Button
				aria-controls="simple-menu"
				aria-haspopup="true"
				endIcon={<ExpandMoreIcon />}
				startIcon={<TranslateIcon />}
				onClick={handleClick}
			>
				{t("language")}
			</Button>
			<Menu
				id="simple-menu"
				anchorEl={languageAnchor}
				keepMounted
				open={Boolean(languageAnchor)}
				onClose={handleClose}
			>
				{router.locales.map((locale) => (
					<MenuItem key={locale} onClick={handleClose}>
						<Link href={router.asPath} locale={locale}>
							{t(locale)}
						</Link>
					</MenuItem>
				))}
			</Menu>
		</>
	);
}

export default Language;
