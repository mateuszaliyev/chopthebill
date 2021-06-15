// React & Next
import { useTranslation } from "next-i18next";

// Material UI
import {
	List,
	ListItem,
	ListItemAvatar,
	ListItemIcon,
	ListItemText,
	ListSubheader,
	makeStyles,
	Tooltip,
} from "@material-ui/core";
import amber from "@material-ui/core/colors/amber";
import StarIcon from "@material-ui/icons/Star";

// Components
import Avatar from "../Avatar";

import Link from "../Link";

// Hooks
import useWindowSize from "../hooks/useWindowSize";

// Styles
const useStyles = makeStyles((theme) => ({
	padding: {
		paddingBottom: "1rem",
		paddingTop: "1rem",
	},
}));

const MemberList = ({ group }) => {
	const { t } = useTranslation(["common", "groups"]);

	const classes = useStyles();
	const { width } = useWindowSize();

	return (
		<List dense={width <= 480}>
			<ListSubheader disableSticky>{t("groups:member-list")}</ListSubheader>
			{group.members.map((member) => (
				<div key={member.id}>
					<ListItem
						button
						className={member.email ? "" : classes.padding}
						color="inherit"
						component={Link}
						href={`/user/${member.id}`}
						underline="none"
					>
						<ListItemAvatar>
							<Avatar user={member} />
						</ListItemAvatar>
						<ListItemText
							primary={member.username}
							primaryTypographyProps={{ noWrap: true }}
							secondary={member.email}
							secondaryTypographyProps={{ noWrap: true }}
						/>
						<ListItemIcon style={{ minWidth: "2.5rem" }}>
							{member.owner && (
								<Tooltip title={t("groups:group-owner")}>
									<StarIcon style={{ color: amber[500] }} />
								</Tooltip>
							)}
						</ListItemIcon>
					</ListItem>
				</div>
			))}
		</List>
	);
};

export default MemberList;
