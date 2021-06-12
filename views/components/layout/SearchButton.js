// React & Next
import { useState } from "react";
import { useTranslation } from "next-i18next";

// Material UI
import { IconButton, Tooltip } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

// Components
import SearchDialog from "./SearchDialog";

function SearchButton() {
	const { t } = useTranslation("common");

	const [open, setOpen] = useState(false);

	const handleClick = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Tooltip title={t("search")}>
				<IconButton color="inherit" onClick={handleClick}>
					<SearchIcon />
				</IconButton>
			</Tooltip>
			<SearchDialog
				expenses
				onClose={handleClose}
				open={open}
				placeholder={t("search-anything")}
				redirect
				title={t("search")}
				users
			/>
		</>
	);
}

export default SearchButton;
