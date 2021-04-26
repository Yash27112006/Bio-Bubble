import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { ListItem } from "react-native-elements";
import firebase from "firebase";
import db from "../config";
import MyHeader from "../components/MyHeader";

export default class GameParticipateScreen extends Component {
  constructor() {
    super();
    this.state = {
      userId: firebase.auth().currentUser.email,
      requestedPlayersList: [],
    };
    this.requestRef = null;
  }

  getRequestedPlayerssList = () => {
    this.requestRef = db
      .collection("requested_games")
      .onSnapshot((snapshot) => {
        var requestedPlayersList = snapshot.docs.map((doc) => doc.data());
        this.setState({
          requestedPlayersList: requestedPlayersList,
        });
      });
  };

  componentDidMount() {
    this.getRequestedPlayerssList();
  }

  componentWillUnmount() {
  this.requestRef();
  }

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, i }) => {
    return (
      <ListItem
        key={i}
        title={item.game_name}
        subtitle={item.reason_to_request}
        titleStyle={{ color: "black", fontWeight: "bold" }}
        leftElement={
          <Image
            style={{ height: 50, width: 50 }}
            source={{
              uri: item.image_link,
            }}
          />
        }
        rightElement={
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              this.props.navigation.navigate("PlayerDetails", {
                details: item,
              });
            }}
          >
            <Text style={{ color: "#ffff" }}>View</Text>
          </TouchableOpacity>
        }
        bottomDivider
      />
    );
  };

  render() {
    return (
      <View style={styles.view}>
        <MyHeader title="Participate Games" navigation={this.props.navigation} />
        <View style={{ flex: 1 }}>
          {this.state.requestedPlayersList.length === 0 ? (
            <View style={styles.subContainer}>
              <Text style={{ fontSize: 20 }}>List Of All Requested Games</Text>
            </View>
          ) : (
            <FlatList
              keyExtractor={this.keyExtractor}
              data={this.state.requestedPlayersList}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  subContainer: {
    flex: 1,
    fontSize: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 100,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#32867d",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
  },
  view:{
    flex: 1,
    backgroundColor: "#fff"
  }
});