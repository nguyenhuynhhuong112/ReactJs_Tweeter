import { StyleSheet } from "react-native";

export const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 30,
    padding: 5,
    margin: 5,
    // shadowColor: "grey",
    // shadowOffset: {
    //   width: 3,
    //   height: 3,
    // },
    // shadowRadius: 5,
  },
  button1: {
    width: "20%",
    paddingLeft: 30,
    alignItems: "center",
  },
  imageAvatar: {
    width: 50,
    height: 50,
    borderWidth: 0.5,
    borderRadius: 30,
  },
  container2: {
    width: "80%",
  },
  container3: {
    flexDirection: "row",
    gap: 5,
  },
  contentWithoutImage: {
    height: "auto",
    backgroundColor: "white",
    flex: 1,
    width: 296,
    textAlignVertical: "top",
  },
  textName: {
    fontWeight: "bold",
  },
  textUsername: {
    color: "#B1B1B1",
  },
  button2: {
    paddingTop: 10,
  },
  imageTweet: {
    width: 280,
    height: 300,
    resizeMode: "cover",
    //borderWidth: 0.5,
    borderRadius: 20,
    //borderColor:'white'
  },
  container4: {
    alignItems: "center",
    padding: 10,
    flexDirection: "row",
    gap: 20,
  },
  button3: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  button4: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  button5: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  container5: {
    flex: 2,
    flexDirection: "row",
    marginTop: 5,
    gap: 10,
    alignItems: "center",
  },
  imageAvatarComment: {
    width: 35,
    height: 35,
    borderWidth: 1,
    borderRadius: 50,
  },
  textInputComment: {
    width: 180,
    height: 50,
    backgroundColor: "white",
    flex: 1,
    textAlignVertical: "top",
  },
});
