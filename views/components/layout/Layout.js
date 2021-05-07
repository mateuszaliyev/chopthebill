// React & Next
import { useContext } from "react";

// Material UI
import {
	AppBar,
	Container,
	Divider,
	Toolbar,
	Typography,
	useMediaQuery,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import FolderSharedIcon from "@material-ui/icons/FolderShared";
import HomeIcon from "@material-ui/icons/Home";
import PeopleIcon from "@material-ui/icons/People";
import ReceiptIcon from "@material-ui/icons/Receipt";

// Components
import AvatarButton from "./AvatarButton";
import NotificationButton from "./NotificationButton";
import SearchButton from "./SearchButton";
import SideMenu from "./SideMenu";
import SwipeMenu from "./SwipeMenu";

// Contexts
import { ThemeContext } from "../Theme";

// Styles
const useStyles = makeStyles((theme) => ({
	appBar: {
		marginLeft: "16rem",
		width: "calc(100% - 16rem)",
	},
	menuButton: {
		marginRight: theme.spacing(2),
	},
	root: {
		flexGrow: 1,
	},
	title: {
		flexGrow: 1,
	},
	titlexs: {
		marginLeft: theme.spacing(2),
	},
}));

// List items
const avatarItems = [
	{
		href: "/user",
		text: "profile",
	},
	{
		href: "/logout",
		text: "logout",
	},
];

const menuItems = [
	{
		href: "/dashboard",
		icon: <HomeIcon />,
		text: "dashboard",
	},
	{
		href: "/friends",
		icon: <PeopleIcon />,
		text: "friends",
	},
	{
		href: "/groups",
		icon: <FolderSharedIcon />,
		text: "groups",
	},
	{
		href: "/expenses",
		icon: <ReceiptIcon />,
		text: "expenses",
	},
	{
		href: "/obligations",
		icon: <AttachMoneyIcon />,
		text: "obligations",
	},
];

function AppBarxs({ title }) {
	const { palette } = useContext(ThemeContext);
	const classes = useStyles();

	return (
		<header className={classes.root}>
			<AppBar
				color={palette === "light" ? "primary" : "inherit"}
				position="static"
			>
				<Toolbar>
					<SwipeMenu className={classes.menuButton} items={menuItems} />
					<Typography
						className={`${classes.title} ${classes.titlexs}`}
						noWrap
						variant="h6"
					>
						{title}
					</Typography>
					<SearchButton />
					<NotificationButton
						amount={1}
						color={palette === "light" ? "secondary" : "primary"}
					/>
					<AvatarButton items={avatarItems} />
				</Toolbar>
			</AppBar>
		</header>
	);
}

function AppBarmd({ title }) {
	const classes = useStyles();

	return (
		<header className={classes.root}>
			<AppBar
				className={classes.appBar}
				color="transparent"
				elevation={0}
				position="static"
			>
				<Toolbar>
					<Typography className={classes.title} noWrap variant="h6">
						{title}
					</Typography>
					<SearchButton />
					<NotificationButton amount={1} color="primary" />
					<AvatarButton items={avatarItems} />
				</Toolbar>
			</AppBar>
		</header>
	);
}

function Layout({ children, title }) {
	const { muiTheme } = useContext(ThemeContext);

	// Breakpoints
	const bp360 = useMediaQuery("(min-width:360px)");
	const bpsm = useMediaQuery(muiTheme.breakpoints.up("sm"));
	const bpmd = useMediaQuery(muiTheme.breakpoints.up("md"));
	const bplg = useMediaQuery(muiTheme.breakpoints.up("lg"));
	const bpxl = useMediaQuery(muiTheme.breakpoints.up("xl"));

	return (
		<>
			{bpmd ? (
				<>
					<AppBarmd title={title} />
					<SideMenu items={menuItems} />
					<main style={{ marginLeft: "16rem" }}>
						<Divider variant="middle" />
						<Container maxWidth="xl">{children}</Container>
					</main>
				</>
			) : (
				<>
					<AppBarxs title={title} />
					<Container component="main">{children}</Container>
				</>
			)}
		</>
	);
}

export default Layout;
