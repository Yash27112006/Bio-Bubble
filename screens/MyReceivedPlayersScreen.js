import React, { Component } from 'react';
import { View, StyleSheet, Text,Image, FlatList,TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements'
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';
import { RFValue } from "react-native-responsive-fontsize";

export default class MyReceivedPlayersScreen extends Component{
  constructor(){
    super()
    this.state = {
      userId  : firebase.auth().currentUser.email,
      receivedPlayersList : []
    }
  this.requestRef= null
  }

  getReceivedPlayersList =()=>{
    this.requestRef = db.collection("requested_games")
    .where('user_id','==',this.state.userId)
    .where("game_status", '==','received')
    .onSnapshot((snapshot)=>{
      var receivedPlayersList = snapshot.docs.map((doc) => doc.data())
      this.setState({
        receivedPlayersList : receivedPlayersList
      });
    })
  }

  componentDidMount(){
    this.getReceivedPlayersList()
  }

  componentWillUnmount(){
    this.requestRef();
  }

  keyExtractor = (item, index) => index.toString()

  renderItem = ( {item, i} ) =>{
    return (
      <ListItem
        key={i}
        title={item.game_name}
        subtitle={item.gameStatus}
        leftElement={
          <Image
            style={styles.LiImage}
            source={{
              uri: item.image_link,
            }}
            />
          }
        titleStyle={styles.titlestyle}
        bottomDivider
      />
    )
  }

  render(){
    return(
      <View style={{flex:1}}>
        <MyHeader title="Received Players" navigation ={this.props.navigation}/>
        <View style={{flex:1}}>
          {
            this.state.receivedPlayersList.length === 0
            ?(
              <View style={styles.subContainer}>
                <Text style={{ fontSize: 20}}>List Of All Received Players</Text>
              </View>
            )
            :(
              <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.receivedPlayersList}
                renderItem={this.renderItem}
              />
            )
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  subContainer:{
    flex:1,
    fontSize: 20,
    justifyContent:'center',
    alignItems:'center'
  },
  button:{
    width:100,
    height:30,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8
     }
  },
  LiImage:{
    height:RFValue(50),
    width:RFValue(50)
  },
  titlestyle:
  {
  color: 'black',
  fontWeight: 'bold'
},

})