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
import { makeStyles, useTheme } from "@material-ui/core/styles";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import FolderSharedIcon from "@material-ui/icons/FolderShared";
import HomeIcon from "@material-ui/icons/Home";
import PeopleIcon from "@material-ui/icons/People";
import ReceiptIcon from "@material-ui/icons/Receipt";

// Components
import AvatarButton from "./AvatarButton";
import Loader from "../Loader";
import MoreButton from "./MoreButton";
import NotificationButton from "./NotificationButton";
import SearchButton from "./SearchButton";
import SideMenu from "./SideMenu";
import SwipeMenu from "./SwipeMenu";

// Contexts
import { ThemeContext } from "../Theme";

// Hooks
import useWindowSize from "../hooks/useWindowSize";

// Styles
const useStyles = makeStyles((theme) => ({
	appBar: {
		width: "calc(100% - 16rem)",
	},
	appBarMobile: {
		display: "flex",
		justifyContent: "center",
		height: "4rem",
	},
	container: {
		flexGrow: 1,
	},
	main: {
		display: "flex",
		flexDirection: "column",
		height: "calc(100vh - 4rem)",
		position: "relative",
	},
	marginDesktop: {
		marginLeft: "16rem",
	},
	marginMobile: {
		marginTop: "4rem",
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

// Mobile appbar
function AppBarMobile({ title }) {
	const { palette } = useContext(ThemeContext);
	const classes = useStyles();
	const { width } = useWindowSize();

	return (
		<header className={classes.root}>
			<AppBar
				className={classes.appBarMobile}
				color={palette === "light" ? "primary" : "inherit"}
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
					{width >= 360 ? (
						<>
							<SearchButton />
							<NotificationButton
								amount={1}
								color={palette === "light" ? "error" : "primary"}
							/>
							<AvatarButton />
						</>
					) : (
						<MoreButton color="inherit" />
					)}
				</Toolbar>
			</AppBar>
		</header>
	);
}

// Desktop appbar
function AppBarDesktop({ title }) {
	const classes = useStyles();

	return (
		<header className={classes.root}>
			<AppBar
				className={`${classes.appBar} ${classes.marginDesktop}`}
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
					<AvatarButton />
				</Toolbar>
			</AppBar>
		</header>
	);
}

function Layout({ children = null, title }) {
	const classes = useStyles();
	const theme = useTheme();

	const bpmd = useMediaQuery(theme.breakpoints.up("md"));

	return (
		<>
			{bpmd ? (
				<>
					<AppBarDesktop title={title} />
					<SideMenu items={menuItems} />
					<main className={`${classes.main} ${classes.marginDesktop}`}>
						<Divider variant="middle" />
						<Container className={classes.container} maxWidth="false">
							{children || <Loader size="4rem" />}
						</Container>
					</main>
				</>
			) : (
				<>
					<AppBarMobile title={title} />
					<main className={`${classes.main} ${classes.marginMobile}`}>
						{children || <Loader />}
					</main>
				</>
			)}
		</>
	);
}

export default Layout;
