// React & Next
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// Material UI
import {
	IconButton,
	ListSubheader,
	makeStyles,
	Snackbar,
	Tooltip,
	Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";

// Components
import Auth from "../../components/auth/Auth";
import ExpenseAddButton from "../../components/expenses/ExpenseAddButton";
import ExpenseList from "../../components/expenses/ExpenseList";
import GroupDeleteDialog from "../../components/groups/GroupDeleteDialog";
import GroupDialog from "../../components/groups/GroupDialog";
import Layout from "../../components/layout/Layout";
import Loader from "../../components/Loader";
import Meta from "../../components/Meta";
import MemberList from "../../components/groups/MemberList";

// Config
import { host } from "../../config";

// Contexts
import { UserContext } from "../../components/auth/User";

// Lodash
import cloneDeep from "lodash/cloneDeep";

// Styles
const useStyles = makeStyles((theme) => ({
	buttons: {
		display: "flex",
		flexDirection: "column",
		marginLeft: "auto",
		padding: "0 1rem",
	},
	padding: {
		paddingBottom: "1rem",
		paddingTop: "1rem",
	},
	red: {
		color: theme.palette.error.main,
		"&:hover": {
			backgroundColor: `${theme.palette.error.main}${parseInt(
				255 * theme.palette.action.hoverOpacity
			)
				.toString(16)
				.padStart(2, "0")}`,
		},
	},
	root: {
		paddingTop: "1rem",
		width: "100%",
	},
	title: {
		alignItems: "center",
		display: "flex",
		paddingLeft: "1rem",
	},
}));

export async function getServerSideProps({ locale }) {
	return {
		props: {
			...(await serverSideTranslations(locale, [
				"common",
				"expenses",
				"groups",
			])),
		},
	};
}

function Group() {
	const { t } = useTranslation();

	const [group, setGroup] = useState(null);
	const [groupDialogOpen, setGroupDialogOpen] = useState(false);
	const [groupDeleteDialogOpen, setGroupDeleteDialogOpen] = useState(false);
	const [loading, setLoading] = useState(true);
	const [snackbarSeverity, setSnackbarSeverity] = useState("success");
	const [snackbarText, setSnackbarText] = useState(null);

	const { accessToken, user } = useContext(UserContext);

	const router = useRouter();
	const { id } = router.query;

	const classes = useStyles();

	const getGroup = async () => {
		const res = await fetch(`${host}/groups/${id}`, {
			method: "GET",
			credentials: "include",
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
		});

		if (res.ok) {
			const group = await res.json();
			setGroup({
				...group,
				expenses: group.expenses.map((expense) => ({
					...expense,
					expense: {
						...expense.expense,
						date: new Date(expense.expense.date),
					},
				})),
			});
			setLoading(false);
		} else {
			router.replace("/dashboard");
		}
	};

	const handleGroupDeleteDialogClose = (response) => {
		if (response === "success") {
			router.replace("/groups");
		}
		setGroupDeleteDialogOpen(false);
		setSnackbarSeverity(response || "info");
		setSnackbarText(
			response === "success"
				? t("groups:group-deleted-successfully")
				: response === "error"
				? `${t("something-went-wrong")}. ${t("try-again")}.`
				: null
		);
	};

	const handleGroupDialogClose = (data) => {
		if (data.group) {
			setGroup(data.group);
		}
		setGroupDialogOpen(false);
		setSnackbarSeverity(data.response || "info");
		setSnackbarText(
			data.response === "success"
				? t("groups:group-modified-successfully")
				: data.response === "error"
				? `${t("something-went-wrong")}. ${t("try-again")}.`
				: null
		);
	};

	useEffect(() => {
		if (accessToken) {
			getGroup();
		}
	}, [accessToken]);

	return (
		<Auth>
			{group?.name && <Meta title={`${group.name} | ChopTheBill`} />}
			<Layout title={`${t("group")}`}>
				{loading ? (
					<Loader size="4rem" />
				) : (
					<div className={classes.root}>
						<div className={classes.title}>
							<div>
								<Typography component="h1" gutterBottom variant="h4">
									{group.name}
								</Typography>
								<Typography color="textSecondary">
									{group.description}
								</Typography>
							</div>
							{group.members.some(
								(member) => member.id === user.id && member.owner
							) && (
								<div className={classes.buttons}>
									<Tooltip title={t("edit")}>
										<IconButton onClick={() => setGroupDialogOpen(true)}>
											<EditIcon />
										</IconButton>
									</Tooltip>
									<Tooltip title={t("delete")}>
										<IconButton
											className={classes.red}
											onClick={() => setGroupDeleteDialogOpen(true)}
										>
											<DeleteForeverIcon />
										</IconButton>
									</Tooltip>
								</div>
							)}
						</div>
						<MemberList group={group} />
						{group.expenses.length > 0 && (
							<>
								<ListSubheader disableSticky>{t("expenses")}</ListSubheader>
								<ExpenseList expenses={group.expenses} groupId={id} />
							</>
						)}
						<ExpenseAddButton groupId={group.id} />
						{group.members.some(
							(member) => member.id === user.id && member.owner
						) && (
							<>
								<GroupDeleteDialog
									group={group}
									onClose={handleGroupDeleteDialogClose}
									open={groupDeleteDialogOpen}
								/>
								<GroupDialog
									edit={cloneDeep(group)}
									onClose={handleGroupDialogClose}
									open={groupDialogOpen}
								/>
								<Snackbar
									autoHideDuration={6000}
									onClose={() => setSnackbarText(null)}
									open={Boolean(snackbarText)}
								>
									<Alert
										elevation={6}
										onClose={() => setSnackbarText(null)}
										severity={snackbarSeverity}
										variant="filled"
									>
										{snackbarText}
									</Alert>
								</Snackbar>
							</>
						)}
					</div>
				)}
			</Layout>
		</Auth>
	);
}

export default Group;
