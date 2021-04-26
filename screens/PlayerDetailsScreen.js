import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Card, Header, Icon } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";
import db from "../config.js";
import firebase from "firebase";

export default class PlayerDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: firebase.auth().currentUser.email,
      userName: "",
      playerId: this.props.navigation.getParam("details")["user_id"],
      requestId: this.props.navigation.getParam("details")["request_id"],
      gameName: this.props.navigation.getParam("details")["game_name"],
      equipmentsIhave: this.props.navigation.getParam("details")["equipments_i_have"],
      playersIhave: this.props.navigation.getParam("details")["players_i_have"],
      playTime: this.props.navigation.getParam("details")["play_time"],
      playLocation: this.props.navigation.getParam("details")["play_location"],
      reason_for_requesting: this.props.navigation.getParam("details")[
        "reason_to_request"
      ],
      playerName: "",
      playerContact: "",
      playerAge: "",
      playerAddress: "",
      playerNearestPark: "",
      playerNearestPlayground: "",
      playerRequestDocId: "",
    };
  }

  getPlayerDetails() {
    db.collection("users")
      .where("email_id", "==", this.state.playerId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            playerName: doc.data().first_name,
            playerContact: doc.data().contact,
            playerAddress: doc.data().address,
            playerNearestPark: doc.data().nearest_park,
            playerNearestPlayground: doc.data().nearest_playground,
            playerAge: doc.data().age
          });
        });
      });

    db.collection("requested_games")
      .where("request_id", "==", this.state.requestId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            playerRequestDocId: doc.id
          });
        });
      });
  }

  getUserDetails = (userId) => {
    db.collection("users")
      .where("email_id", "==", userId)
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          this.setState({
            userName: doc.data().first_name + " " + doc.data().last_name,
          });
        });
      });
  };

  updateGameStatus = () => {
    db.collection("all_participations").add({
      game_name: this.state.gameName,
      request_id: this.state.requestId,
      requested_by: this.state.playerName,
      participant_id: this.state.userId,
      request_status: "Participant Interested",
    });
  };

  addNotification = () => {
    var message =
      this.state.userName + " has shown interest in playing with you.";
    db.collection("all_notifications").add({
      targeted_user_id: this.state.playerId,
      participant_id: this.state.userId,
      request_id: this.state.requestId,
      game_name: this.state.gameName,
      date: firebase.firestore.FieldValue.serverTimestamp(),
      notification_status: "unread",
      message: message,
    });
  };

  componentDidMount() {
    this.getPlayerDetails();
    this.getUserDetails(this.state.userId);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.1 }}>
          <Header
            leftComponent={
              <Icon
                name="arrow-left"
                type="feather"
                color="#ffffff"
                onPress={() => this.props.navigation.goBack()}
              />
            }
            centerComponent={{
              text: "Donate Books",
              style: {
                color: "#ffffff",
                fontSize: RFValue(20),
                fontWeight: "bold",
              },
            }}
            backgroundColor="#32867d"
          />
        </View>
        <View style={{ flex: 0.9 }}>
          <View
            style={{
              flex: 0.3,
              flexDirection: "row",
              paddingTop: RFValue(30),
              paddingLeft: RFValue(10),
            }}
          >
            
            <View
              style={{
                flex: 0.6,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: RFValue(25),
                  textAlign: "center",
                }}
              >
                {this.state.gameName}
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: RFValue(15),
                  textAlign: "center",
                  marginTop: RFValue(15),
                }}
              >
                {this.state.reason_for_requesting}
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: RFValue(15),
                  textAlign: "center",
                  marginTop: RFValue(15),
                }}
              >
                {this.state.equipmentsIhave}
                </Text>
                <Text
                style={{
                  fontWeight: "400",
                  fontSize: RFValue(15),
                  textAlign: "center",
                  marginTop: RFValue(15),
                }}
              >
                {this.state.playersIhave}
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: RFValue(15),
                  textAlign: "center",
                  marginTop: RFValue(15),
                }}
              >
                {this.state.playTime}
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: RFValue(15),
                  textAlign: "center",
                  marginTop: RFValue(15),
                }}
              >
                {this.state.playLocation}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 0.7,
              padding: RFValue(20),
            }}
          >
            <View style={{ flex: 0.7 ,justifyContent:'center',alignItems:'center',marginTop:RFValue(50),borderWidth:1,borderColor:'#deeedd',padding:RFValue(10)}}>
              <Text
                style={{
                  fontWeight: "500",
                  fontSize: RFValue(30),
                }}
              >
                Player Information
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: RFValue(20),
                  marginTop: RFValue(30),
                }}
              >
                Name : {this.state.playerName}
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: RFValue(20),
                  marginTop: RFValue(30),
                }}
              >
                Contact: {this.state.playerContact}
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: RFValue(20),
                  marginTop: RFValue(30),
                }}
              >
                Age: {this.state.playerAge}
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: RFValue(20),
                  marginTop: RFValue(30),
                }}
              >
                Address: {this.state.recieverAddress}
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: RFValue(20),
                  marginTop: RFValue(30),
                }}
              >
                Nearest Playground: {this.state.playerNearestPlayground}
              </Text>
              <Text
                style={{
                  fontWeight: "400",
                  fontSize: RFValue(20),
                  marginTop: RFValue(30),
                }}
              >
                Nearest Park: {this.state.playerNearestPark}
              </Text>
            </View>
            <View
              style={{
                flex: 0.3,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {this.state.playerId !== this.state.userId ? (
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => {
                    this.updateGameStatus();
                    this.addNotification();
                    this.props.navigation.navigate("My Participations");
                  }}
                >
                  <Text>I want to play</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "75%",
    height: RFValue(60),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: RFValue(60),
    backgroundColor: "#ff5722",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 16,
  },
});