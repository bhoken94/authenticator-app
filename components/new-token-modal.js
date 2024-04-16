import { Camera, CameraView } from "expo-camera/next";
import React, { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { database } from "../helpers/db-service";
import { parseURI } from "../helpers/utility";
import { MaterialIcons } from "@expo/vector-icons";

const AddNewTokenModal = ({ isVisible, onClose }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    let dataParsed = parseURI(data);
    let issuer = dataParsed.label.issuer
      ? dataParsed.label.issuer
      : dataParsed.query.issuer;
    let account = dataParsed.label.account
      ? dataParsed.label.account
      : dataParsed.query.account;
    await database.insertToken(
      dataParsed.query.secret,
      issuer,
      account,
      JSON.stringify(dataParsed),
      () => console.log
    );
    onClose();
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalContent}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Aggiungi nuovo servizio</Text>
          <Pressable onPress={onClose}>
            <MaterialIcons name="close" color="#fff" size={22} />
          </Pressable>
        </View>
        <CameraView
          style={StyleSheet.absoluteFill}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        ></CameraView>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  modalContent: {
    height: "50%",
    width: "100%",
    backgroundColor: "#25292e",
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    position: "absolute",
    bottom: 0,
  },
  titleContainer: {
    height: "16%",
    backgroundColor: "#464C55",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    color: "#fff",
    fontSize: 16,
  },
});
export default AddNewTokenModal;
