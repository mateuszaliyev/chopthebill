// React & Next
import { useContext } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

// Material UI
import { IconButton, Tooltip } from "@material-ui/core";
import PersonAddIcon from "@material-ui/icons/PersonAdd";

// Config
import { host } from "../../config";

// Contexts
import { UserContext } from "../auth/User";

function AddFriendButton({ color = "inherit", edge = false, id }) {
	const { t } = useTranslation(["common", "friends"]);

	const { accessToken } = useContext(UserContext);

	const router = useRouter();

	const addFriend = async () => {
		const res = await fetch(`${host}/friend`, {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				Authorization: `Bearer ${accessToken}`,
			},
			body: JSON.stringify({
				id,
			}),
		});
		if (res.ok) {
			router.reload();
		}
	};

	return (
		<>
			<Tooltip title={t("friends:add-friend")}>
				<IconButton edge={edge} onClick={addFriend}>
					<PersonAddIcon color={color} />
				</IconButton>
			</Tooltip>
		</>
	);
}

export default AddFriendButton;