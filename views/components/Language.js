// React & Next
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// Material UI
import {
	Button,
	IconButton,
	Menu,
	MenuItem,
	useMediaQuery,
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TranslateIcon from "@material-ui/icons/Translate";

// Contexts
import { ThemeContext } from "./Theme";

// Components
import Link from "./Link";

function Language() {
	const { muiTheme } = useContext(ThemeContext);
	const { t } = useTranslation("common");

	const [languageAnchor, setLanguageAnchor] = useState(null);
	const router = useRouter();

	const matches = useMediaQuery(muiTheme.breakpoints.up("sm"));

	const handleClick = (event) => {
		setLanguageAnchor(event.currentTarget);
	};

	const handleClose = () => {
		setLanguageAnchor(null);
	};

	return (
		<>
			{matches ? (
				<Button
					aria-controls="simple-menu"
					aria-haspopup="true"
					color="inherit"
					endIcon={<ExpandMoreIcon />}
					startIcon={<TranslateIcon />}
					onClick={handleClick}
				>
					{t("language")}
				</Button>
			) : (
				<IconButton
					aria-controls="simple-menu"
					aria-haspopup="true"
					color="inherit"
					onClick={handleClick}
				>
					<TranslateIcon />
				</IconButton>
			)}
			<Menu
				id="simple-menu"
				anchorEl={languageAnchor}
				keepMounted
				open={Boolean(languageAnchor)}
				onClose={handleClose}
			>
				{router.locales.map((locale) => (
					<MenuItem key={locale} onClick={handleClose}>
						<Link color="inherit" href={router.asPath} locale={locale}>
							{t(locale)}
						</Link>
					</MenuItem>
				))}
			</Menu>
		</>
	);
}

export default Language;
