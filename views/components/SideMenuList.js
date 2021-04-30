// React & Next
import { useTranslation } from "next-i18next";

// Material UI
import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import CloseIcon from "@material-ui/icons/Close";
import FolderSharedIcon from "@material-ui/icons/FolderShared";
import PeopleIcon from "@material-ui/icons/People";
import ReceiptIcon from "@material-ui/icons/Receipt";

// Components
import Link from "./Link";

const useStyles = makeStyles({
	list: {
		width: 250,
	},
});

function SideMenuList({ toggleSideMenu }) {
	const classes = useStyles();
	const { t } = useTranslation("common");

	return (
		<List
			className={classes.list}
			onClick={toggleSideMenu(false)}
			onKeyDown={toggleSideMenu(false)}
		>
			<ListItem button>
				<ListItemIcon>
					<CloseIcon />
				</ListItemIcon>
			</ListItem>
			<Link color="inherit" href="/friends">
				<ListItem button>
					<ListItemIcon>
						<PeopleIcon />
					</ListItemIcon>
					<ListItemText primary={t("friends")} />
				</ListItem>
			</Link>
			<Link color="inherit" href="/groups">
				<ListItem button>
					<ListItemIcon>
						<FolderSharedIcon />
					</ListItemIcon>
					<ListItemText primary={t("groups")} />
				</ListItem>
			</Link>
			<Link color="inherit" href="/expenses">
				<ListItem button>
					<ListItemIcon>
						<ReceiptIcon />
					</ListItemIcon>
					<ListItemText primary={t("expenses")} />
				</ListItem>
			</Link>
			<Link color="inherit" href="/obligations">
				<ListItem button>
					<ListItemIcon>
						<AttachMoneyIcon />
					</ListItemIcon>
					<ListItemText primary={t("obligations")} />
				</ListItem>
			</Link>
		</List>
	);
}

export default SideMenuList;
