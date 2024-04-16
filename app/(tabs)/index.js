import { Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  LayoutAnimation,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TokenItem from "../../components/TokenItem";
import { database } from "../../helpers/db-service";
import { updateTotp } from "../../helpers/utility";
import AddNewTokenModal from "../../components/new-token-modal";

const TokenTabPage = () => {
  const [tokenList, setTokenList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [newTokenModalVisible, setNewTokenModalVisible] = useState(false);

  let prevOpenedRow;

  useEffect(() => {
    database.getTokenList(setTokenList);
  }, []);

  const onRefreshData = () => {
    setRefreshing(true);
    getTokens(true);
  };

  const onModalClose = () => {
    getTokens();
    setNewTokenModalVisible(false);
  };

  const getTokens = async (isRefreshing) => {
    database.getTokenList(setTokenList);
    if (isRefreshing) setRefreshing(false);
  };

  const deleteItem = (index) => {
    Alert.alert("Rimuovi Token", "Sei sicuro di voler rimuovere il token?", [
      {
        text: "No",
        onPress: () => console.log("No Pressed"),
      },
      {
        text: "Si",
        onPress: () => {
          const updatedData = tokenList;
          let deletedItem = updatedData.splice(index, 1);
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          database.deleteTokenById(deletedItem[0].id, setTokenList, [
            ...updatedData,
          ]);
        },
      },
    ]);
  };

  const closeRow = (swipableRow) => {
    if (prevOpenedRow && prevOpenedRow !== swipableRow) {
      prevOpenedRow.close();
    }
    prevOpenedRow = swipableRow;
  };

  const listEmptyComponent = () => (
    <View
      style={{
        borderWidth: 1,
        height: "50%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Inserisci un nuovo servizio e lo vedrai qui!</Text>
    </View>
  );

  const renderItem = ({ item, index }) => {
    return (
      <TokenItem
        item={item}
        index={index}
        deleteItem={deleteItem}
        closeRow={closeRow}
      />
    );
  };

  const onTimerComplete = ({ totalElapsedTime }) => {
    updateTotp(tokenList, setTokenList);
    return {
      shouldRepeat: true,
      delay: 1.5,
    }; // repeat animation in 1.5 seconds
  };

  return (
    <>
      <Tabs.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={() => setNewTokenModalVisible(true)}>
              {({ pressed }) => (
                <Octicons
                  name="plus-circle"
                  size={30}
                  color="purple"
                  backgroundColor="#fff"
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
          headerLeft: () => (
            <View style={{ marginLeft: 15 }}>
              <CountdownCircleTimer
                isPlaying={true}
                size={33}
                duration={30}
                colors={["#004777", "#F7B801", "#A30000", "#A30000"]}
                colorsTime={[30, 5, 2, 0]}
                strokeWidth={4}
                onComplete={onTimerComplete}
              >
                {({ remainingTime }) => <Text>{remainingTime}</Text>}
              </CountdownCircleTimer>
            </View>
          ),
        }}
      />

      <GestureHandlerRootView style={styles.list}>
        <AddNewTokenModal
          isVisible={newTokenModalVisible}
          onClose={onModalClose}
        />
        <FlatList
          data={tokenList}
          refreshing={refreshing}
          onRefresh={() => onRefreshData()}
          ListEmptyComponent={() => listEmptyComponent()}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id}
        />
      </GestureHandlerRootView>
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
});

export default TokenTabPage;
