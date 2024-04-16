import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  I18nManager,
} from "react-native";
import { Swipeable, RectButton } from "react-native-gesture-handler";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import React from "react";

const AnimatedIcon = Animated.createAnimatedComponent(FontAwesome);

const TokenItem = ({ item, index, deleteItem, closeRow }) => {
  const { account, issuer, totp } = item;
  const firstPart = totp.slice(0, 3);
  const secondPart = totp.slice(3);

  let _swipableRow = null;

  const updateRef = (ref) => {
    _swipableRow = ref;
  };

  const close = () => {
    _swipableRow.close();
  };

  const renderRightAction = (progress) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
    });
    return (
      <View
        style={{
          width: 100,
          flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
        }}
      >
        <Animated.View style={{ flex: 1, transform: [{ translateX: 0 }] }}>
          <RectButton
            style={styles.rightAction}
            onPress={() => deleteItem(index)}
          >
            <AnimatedIcon
              name="trash"
              size={30}
              color="#fff"
              style={[styles.actionIcon]}
            />
          </RectButton>
        </Animated.View>
      </View>
    );
  };

  return (
    <Swipeable
      ref={updateRef}
      friction={2}
      rightThreshold={41}
      renderRightActions={renderRightAction}
      onSwipeableOpen={() => closeRow(_swipableRow)}
    >
      <View style={styles.itemContainer}>
        <View style={styles.itemContainerData}>
          <Image
            style={styles.itemImage}
            source={require("../assets/icon.png")}
          />
          <View>
            <Text style={styles.itemProvider}>{issuer}</Text>
            <Text style={styles.itemEmail}>{account}</Text>
          </View>
        </View>

        <Text style={styles.itemTokenActive}>
          {firstPart}&nbsp;{secondPart}
        </Text>
      </View>
    </Swipeable>
  );
};

export default TokenItem;

const styles = StyleSheet.create({
  itemContainer: {
    height: 80,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemContainerData: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  itemProvider: {
    fontWeight: "bold",
  },
  itemEmail: {
    color: "gray",
  },
  itemTokenActive: {
    fontSize: 30,
  },
  itemImage: {
    width: 50,
    height: 50,
  },
  rightAction: {
    alignItems: "center",
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    backgroundColor: "#dd2c00",
    flex: 1,
    justifyContent: "flex-end",
  },
  actionIcon: {
    width: 30,
    marginHorizontal: 10,
  },
});
