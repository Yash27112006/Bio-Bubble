import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import GameParticipateScreen from '../screens/GameParticipateScreen';
import PlayerDetailsScreen  from '../screens/PlayerDetailsScreen';




export const AppStackNavigator = createStackNavigator({
  GameParticipateList : {
    screen : GameParticipateScreen,
    navigationOptions:{
      headerShown : false
    }
  },
  PlayerDetails : {
    screen : PlayerDetailsScreen,
    navigationOptions:{
      headerShown : false
    }
  }
},
  {
    initialRouteName: 'GameParticipateList'
  }
);