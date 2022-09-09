import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useAppContext } from "../Context/AppContext";

function NotificationBadge({ screen }) {
	const { notificationBadges, marketplaceBadges, announcements, notices } =
		useAppContext();
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (screen) {
			switch (screen) {
				case "MarketplaceNavigator":
					setCount(marketplaceBadges.unseen.length);
					break;
				case "NotificationsNavigator":
					setCount(
						notificationBadges.unseen.length +
							announcements.count +
							notices.count
					);
					break;
			}
		}
	}, [notificationBadges, marketplaceBadges, announcements, notices]);

	if (count < 1) {
		return null;
	}

	return (
		<View
			style={{
				backgroundColor: "rgba(232, 72, 85, 1)",
				position: "absolute",
				top: 1,
				left: "50%",
				justifyContent: "center",
				alignItems: "center",
				paddingVertical: 2,
				paddingHorizontal: 6,
				borderRadius: 12,
			}}>
			<Text
				style={{
					fontWeight: "500",
					fontSize: 9,
					lineHeight: 13,
					color: "white",
				}}>
				{count}
			</Text>
		</View>
	);
}

export default NotificationBadge;
