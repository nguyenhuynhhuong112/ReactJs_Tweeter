import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: "row",
    // marginTop: 30,
    // marginBottom: 10,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  imageAvatar: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderRadius: 50,
  },
  container1: {
    width: "50%",
  },
  button: {
    height: 70,
    justifyContent: "center",
  },
  text: {
    color: "grey",
    fontSize: 20,
  },
  container2: {
    justifyContent: "center",
    alignItems: "center",
    width: "20%",
  },
  button20: {
    width: "20%",
  },
});
