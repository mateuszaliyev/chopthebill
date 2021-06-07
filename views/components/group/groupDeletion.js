import { useState, useContext, useEffect } from "react";
import { UserContext } from "../auth/User";
import { useTranslation } from "next-i18next";
import {
	Dialog,
	DialogTitle,
	Button,
	Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from '@material-ui/icons/Delete';
import { host } from "../../config";

const useStyles = makeStyles((theme) => ({
	delete: {
		margin: "auto",
	},
}));

function GroupDeletionDialog({ onClose, open, setOpen, title, groupId, refreshGroupList }) {
	const { t } = useTranslation("common", "group");
	const classes = useStyles();

	const { accessToken, user } = useContext(UserContext);

	const deleteRequest = async () => {
		const res = await fetch(`${host}/groups/delete`, {
			method: "DELETE",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				"id_group": groupId,
				"id_user": user.id
			}),
		});
		if (res.ok) {
			const data = await res.json();
			if (data.result == "deleted") {
				setOpen(false);
			}
			refreshGroupList();
		}
	};

	return (
		<Dialog onClose={onClose} open={open}>
			<DialogTitle>{title}</DialogTitle>
                <Button variant="contained" color="primary" onClick={deleteRequest}>
					<Tooltip title={`Config`}>
                        <DeleteIcon />
					</Tooltip>
                    {`${t("groups:delete-button")}`}
                </Button>
		</Dialog>
	);
}

export default GroupDeletionDialog;
