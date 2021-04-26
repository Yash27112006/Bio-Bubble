import React, { Component } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TouchableHighlight,
  Alert,
  Image,
} from "react-native";
import db from "../config";
import firebase from "firebase";
import { RFValue } from "react-native-responsive-fontsize";
import { SearchBar, ListItem, Input } from "react-native-elements";

import MyHeader from "../components/MyHeader";
import { BookSearch } from "react-native-google-books";

export default class PlayerRequestScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      gameName: "",
      reasonToRequest: "",
      equipmentsIhave: "",
      playersIhave: "",
      playTime: "",
      playLocation: "",
      IsPlayerRequestActive: "",
      requestedGameName: "",
      gameStatus: "",
      requestId: "",
      userDocId: "",
      docId: "",
      Imagelink: "#",
      dataSource: "",
      requestedImageLink: "",
      showFlatlist: false,
    };
  }

  createUniqueId() {
    return Math.random().toString(36).substring(7);
  }

  addRequest = async (gameName, reasonToRequest) => {
    var userId = this.state.userId;
    var randomRequestId = this.createUniqueId();


    db.collection("requested_games").add({
      user_id: userId,
      game_name: gameName,
      reason_to_request: reasonToRequest,
      equipments_i_have: equipmentsIhave,
      players_i_have: playersIhave,
      play_time: playTime,
      play_location: playLocation,
      request_id: randomRequestId,
      game_status: "requested",
      date: firebase.firestore.FieldValue.serverTimestamp(),
    });

    await this.getPlayerRequest();
    db.collection("users")
      .where("email_id", "==", userId)
      .get()
      .then()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          db.collection("users").doc(doc.id).update({
            IsPlayerRequestActive: true,
          });
        });
      });

    this.setState({
      gameName: "",
      reasonToRequest: "",
      equipmentsIhave: "",
      playersIhave: "",
      playTime: "",
      playLocation: "",
      requestId: randomRequestId,
    });

    return Alert.alert("Player Requested Successfully");
  };

  receivedPlayers = (gameName) => {
    var userId = this.state.userId;
    var requestId = this.state.requestId;
    db.collection("received_players").add({
      user_id: userId,
      game_name: gameName,
      request_id: requestId,
      gameStatus: "received",
    });
  };

  getIsPlayerRequestActive() {
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.setState({
            IsPlayerRequestActive: doc.data().IsPlayerRequestActive,
            userDocId: doc.id,
          });
        });
      });
  }

  getPlayerRequest = () => {
    // getting the requested book
    var gameRequest = db
      .collection("requested_players")
      .where("user_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().book_status !== "received") {
            this.setState({
              requestId: doc.data().request_id,
              requestedGameName: doc.data().game_name,
              gameStatus: doc.data().game_status,
              requestedImageLink: doc.data().image_link,
              docId: doc.id,
            });
          }
        });
      });
  };

  sendNotification = () => {
    //to get the first name and last name
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          var name = doc.data().first_name;
          var lastName = doc.data().last_name;

          db.collection("all_notifications")
            .where("request_id", "==", this.state.requestId)
            .get()
            .then((snapshot) => {
              snapshot.forEach((doc) => {
                var participantId = doc.data().participant_id;
                var gameName = doc.data().game_name;

                db.collection("all_notifications").add({
                  targeted_user_id: participantId,
                  message:
                    name + " " + lastName + " says 'THANK YOU for playing " + gameName + " with me'",
                  notification_status: "unread",
                  game_name: gameName,
                });
              });
            });
        });
      });
  };

  componentDidMount() {
    this.getPlayerRequest();
    this.getIsPlayerRequestActive();
  }

  updatePlayerRequestStatus = () => {
    //updating the book status after receiving the book
    db.collection("requested_players").doc(this.state.docId).update({
      game_status: "participated",
    });

    //getting the  doc id to update the users doc
    db.collection("users")
      .where("email_id", "==", this.state.userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          //updating the doc
          db.collection("users").doc(doc.id).update({
            IsPlayerRequestActive: false,
          });
        });
      });
  };

  

  //render Items  functionto render the books from api
  renderItem = ({ item, i }) => {


    let obj = {
      title: item.volumeInfo.title,
      selfLink: item.selfLink,
      buyLink: item.saleInfo.buyLink,
      imageLink: item.volumeInfo.imageLinks,
    };

    return (
      <TouchableHighlight
        style={styles.touchableopacity}
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={() => {
          this.setState({
            showFlatlist: false,
            gameName: item.volumeInfo.title,
          });
        }}
        bottomDivider
      >
        <Text> {item.volumeInfo.title} </Text>
      </TouchableHighlight>
    );
  };

  render() {
    if (this.state.IsPlayerRequestActive === true) {
      return (
        <View style={{ flex: 1}}>
          <View
            style={{
              flex: 0.1,
            }}
          >
            <MyHeader title="Game Status" navigation={this.props.navigation} />
          </View>
          <View
            style={styles.ImageView}
          >
            
          </View>
          <View
            style={styles.bookstatus}
          >
            <Text
              style={{
                fontSize: RFValue(20),

              }}
            >
              Name of the Game
            </Text>
            <Text
              style={styles.requestedGameName}
            >
              {this.state.requestedGameName}
            </Text>
            <Text
              style={styles.status}
            >
              Status
            </Text>
            <Text
              style={styles.bookStatus}
            >
              {this.state.gameStatus}
            </Text>
          </View>
          <View
            style={styles.buttonView}
          >
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                this.sendNotification();
                this.updatePlayerRequestStatus();
                this.receivedPlayers(this.state.requestedGameName);
              }}
            >
              <Text
                style={styles.buttontxt}
              >
                Player Recived
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.1 }}>
          <MyHeader title="Request Player" navigation={this.props.navigation} />
        </View>
        <View style={{ flex: 0.9 }}>
          <Input
            style={styles.formTextInput2}
            label={"Game Name"}
            placeholder={"Game name"}
            containerStyle={{ marginTop: RFValue(60) }}
            value={this.state.gameName}
          />
          {this.state.showFlatlist ? (
            <FlatList
              data={this.state.dataSource}
              renderItem={this.renderItem}
              enableEmptySections={true}
              style={{ marginTop: RFValue(10) }}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <View style={{ alignItems: "center" }}>
              <Input
                style={styles.formTextInput}
                containerStyle={{ marginTop: RFValue(30) }}
                multiline = {true}
                numberOfLines={2}
                label={"Reason"}
                placeholder={"Why do you need the book"}
                onChangeText={(text) => {
                  this.setState({
                    reasonToRequest: text,
                  });
                }}
                value={this.state.reasonToRequest}
              />
              <Input
                style={styles.formTextInput}
                containerStyle={{ marginTop: RFValue(30) }}
                label={"Equipments"}
                placeholder={"Equipments you have for the game"}
                onChangeText={(text) => {
                  this.setState({
                    equipmentsIhave: text,
                  });
                }}
                value={this.state.equipmentsIhave}
              />
              <Input
                style={styles.formTextInput}
                containerStyle={{ marginTop: RFValue(30) }}
                label={"Players"}
                placeholder={"Players you have for the game"}
                onChangeText={(text) => {
                  this.setState({
                    playersIhave: text,
                  });
                }}
                value={this.state.playersIhave}
              />
              <Input
                style={styles.formTextInput}
                containerStyle={{ marginTop: RFValue(30) }}
                label={"Time"}
                placeholder={"Tell the time to play"}
                onChangeText={(text) => {
                  this.setState({
                    playTime: text,
                  });
                }}
                value={this.state.playTime}
              />
              <Input
                style={styles.formTextInput}
                containerStyle={{ marginTop: RFValue(30) }}
                label={"Location"}
                placeholder={"Tell the location to play"}
                onChangeText={(text) => {
                  this.setState({
                    playLocation: text,
                  });
                }}
                value={this.state.playLocation}
              />
              <TouchableOpacity
                style={[styles.button, { marginTop: RFValue(30) }]}
                onPress={() => {
                  this.addRequest(
                    this.state.gameName,
                    this.state.reasonToRequest,
                    this.state.playLocation,
                    this.state.playTime,
                    this.state.equipmentsIhave,
                    this.state.playersIhave
                  );
                }}
              >
                <Text
                  style={styles.requestbuttontxt}
                >
                  Request
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  keyBoardStyle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  formTextInput: {
    width: "75%",
    height: RFValue(205),
    borderWidth: 1,
    padding: 10,
  },
  formTextInput2: {
    width: "75%",
    height: RFValue(50),
    borderWidth: 1,
    padding: 10,
  },
  ImageView:{
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginTop:20
  },
  imageStyle:{
    height: RFValue(150),
    width: RFValue(150),
    alignSelf: "center",
    borderWidth: 5,
    borderRadius: RFValue(10),
  },
  bookstatus:{
    flex: 0.4,
    alignItems: "center",

  },
  requestedbookName:{
    fontSize: RFValue(30),
    fontWeight: "500",
    padding: RFValue(10),
    fontWeight: "bold",
    alignItems:'center',
    marginLeft:RFValue(60)
  },
  status:{
    fontSize: RFValue(20),
    marginTop: RFValue(30),
  },
  bookStatus:{
    fontSize: RFValue(30),
    fontWeight: "bold",
    marginTop: RFValue(10),
  },
  buttonView:{
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  buttontxt:{
    fontSize: RFValue(18),
    fontWeight: "bold",
    color: "#fff",
  },
  touchableopacity:{
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    width: "90%",
  },
  requestbuttontxt:{
    fontSize: RFValue(20),
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    width: "75%",
    height: RFValue(60),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(50),
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
  },
});