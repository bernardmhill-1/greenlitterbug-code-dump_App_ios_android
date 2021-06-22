import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  AsyncStorage,
  Alert,
  AlertIOS,
  Dimensions,
  SafeAreaView

} from 'react-native';
import { MaterialIcons, } from '@expo/vector-icons';
import Loader from '../../../navigation/AuthLoadingScreen'
import { CartCount } from '../../../components/cartCounter'
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph
} from 'expo-chart-kit'
import Donut from "../../../components/circle"
const api = require('../../../api/index');

const screenWidth = Dimensions.get('window').width

var ts = new Date();
var i = 5;



const dataPie = [
  { name: 'Seoul', population: 21500000, color: 'rgba(131, 167, 234, 1)', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'Toronto', population: 2800000, color: '#F00', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'Beijing', population: 527612, color: 'red', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'New York', population: 8538000, color: '#ffffff', legendFontColor: '#7F7F7F', legendFontSize: 15 },
  { name: 'Moscow', population: 11920000, color: 'rgb(0, 0, 255)', legendFontColor: '#7F7F7F', legendFontSize: 15 }
]


export default class FootPrint extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;

    return {
      title: 'Foot Print',
      headerLeft: (
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          style={{ justifyContent: 'center', alignItems: 'center', padding: 8, marginLeft: 10, borderRadius: 25 }}
          underlayColor={"rgba(0,0,0,0.32)"}
        >
          <MaterialIcons
            name='dehaze'
            size={25}
            color='#fff'
          />
        </TouchableOpacity>
      ),
      headerRight: (
        <CartCount count={params.cartCount} onClick={() => navigation.navigate('myCartList')} />
      ),
      headerRightContainerStyle: {
        marginRight: 18
      },
      headerStyle: {
        backgroundColor: '#1d2b3a',
        height: 60,

      },
      headerTintColor: '#ffffff',
      headerTitleStyle: {
        fontFamily: 'WS-Light',
        fontSize: 18
      },

    }
  }


  state = {
    value: 'first',
    firstQuery: '',
    userId: '',
    userToken: '',
    message: '',
    data: [],
    totalReward: {},
    remainReward:"",
    totalWeight:"",
    barChartData:[],
    barChartlavel:[],
    pieChartDataOne:[],
    pieChartDataTwo:[],
    cartCount: 0,
    loading: true,
    isMounted: false
  }



  componentDidMount = async () => {
    this.willFocusListener = await this.props.navigation.addListener('willFocus', async () => {
      await AsyncStorage.multiGet(['userToken', 'userId', 'userCartCount'], (err, res) => {
        if (err) {
          // (Platform.OS === 'android' ? Alert : AlertIOS).alert(
          //   'Error', err,
          //   [
          //     {
          //       text: 'OK', onPress: () => this.setState({ loading: false})
          //     }
          //   ]
          // );
        } else {
          this.setState({
            userToken: JSON.parse(res[0][1]),
            userId: JSON.parse(res[1][1]),
            cartCount: JSON.parse(res[2][1])
          },
            () => {
              this.props.navigation.setParams({
                cartCount: this.state.cartCount,
              })
            });
          this.ProductListByUser();
          this.ProductBarChart();
          this.ProductPieChart()
        }
      })
    })

  }

  componentWillUnmount = () => {
    this.willFocusListener.remove();
  }


  ProductListByUser = async () => {
    this.setState({ loading: true })
    await api.ProductListByUser({
      userId: this.state.userId,
      userToken: this.state.userToken
    },
      (e, r) => {
        if (e) {
          this.setState({ loading: false, isMounted: true })
          // (Platform.OS === 'android' ? Alert : AlertIOS).alert(
          //   'Error', e,
          //   [
          //     {
          //       text: 'OK', onPress: () => this.setState({ loading: false})
          //     }
          //   ]
          // );
          //CATCH THE ERROR IN DEVELOPMENT 
        } else {
          if (r.response_code == 2000) {
            this.setState({
              data: r.response_data.list,
              totalReward: r.response_data.totalReward.totalReward,
              remainReward: r.response_data.totalReward.remainReward,
              totalWeight: r.response_data.totalWeight,
              loading: false,
              isMounted: true
            })
          } else {
            this.setState({ loading: false, isMounted: true });
            //CATCH THE ERROR IN DEVELOPMENT 

            // (Platform.OS === 'android' ? Alert : AlertIOS).alert(
            //   'Request failed', r.response_message,
            //   [
            //     {
            //       text: 'OK', onPress: () => this.setState({ loading: false})
            //     }
            //   ]
            // );
          }
        }
      })
  }


  ProductBarChart = async () => {
    this.setState({ loading: true })
    await api.ProductBarChart({
      userId: this.state.userId,
      userToken: this.state.userToken
    },
      (e, r) => {
        if (e) {
          this.setState({ loading: false, isMounted: true })
          // (Platform.OS === 'android' ? Alert : AlertIOS).alert(
          //   'Error', e,
          //   [
          //     {
          //       text: 'OK', onPress: () => this.setState({ loading: false})
          //     }
          //   ]
          // );
          //CATCH THE ERROR IN DEVELOPMENT 
        } else {
          if (r.response_code == 2000) {
            this.setState({
              barChartData: r.response_data.datasets[0],
              barChartlavel: r.response_data.labels,
              loading: false,
              isMounted: true
            })
          } else {
            this.setState({ loading: false, isMounted: true });
            //CATCH THE ERROR IN DEVELOPMENT 

            // (Platform.OS === 'android' ? Alert : AlertIOS).alert(
            //   'Request failed', r.response_message,
            //   [
            //     {
            //       text: 'OK', onPress: () => this.setState({ loading: false})
            //     }
            //   ]
            // );
          }
        }
      })
  }

  ProductPieChart = async () => {
    this.setState({ loading: true })
    await api.ProductPieChart({
      userId: this.state.userId,
      userToken: this.state.userToken
    },
      (e, r) => {
        if (e) {
          this.setState({ loading: false, isMounted: true })
          // (Platform.OS === 'android' ? Alert : AlertIOS).alert(
          //   'Error', e,
          //   [
          //     {
          //       text: 'OK', onPress: () => this.setState({ loading: false})
          //     }
          //   ]
          // );
          //CATCH THE ERROR IN DEVELOPMENT 
        } else {
          if (r.response_code == 2000) {
            this.setState({
              pieChartDataOne: r.response_data.graph1,
              pieChartDataTwo: r.response_data.graph2,
              loading: false,
              isMounted: true
            })
          } else {
            this.setState({ loading: false, isMounted: true });
            //CATCH THE ERROR IN DEVELOPMENT 

            // (Platform.OS === 'android' ? Alert : AlertIOS).alert(
            //   'Request failed', r.response_message,
            //   [
            //     {
            //       text: 'OK', onPress: () => this.setState({ loading: false})
            //     }
            //   ]
            // );
          }
        }
      })
  }

  



  render() {
    const { firstQuery, totalReward, data, remainReward,pieChartDataOne, pieChartDataTwo, barChartData,totalWeight, barChartlavel } = this.state;
    if (this.state.isMounted === false) {
      return (
        <View style={{ flex: 1, backgroundColor: '#334058' }}>
          <Loader loading={this.state.loading} navigation={this.props.navigation} />
        </View>
      )
    } else {
      return (
        <SafeAreaView style={{flex:1}}>
        <View style={{ flex: 1,marginTop: 30,backgroundColor:"white"}}>
          <ScrollView
            alwaysBounceVertical={true}
            keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 10 }}
          >

            <View style={{ backgroundColor: "#f1f5ee",flex:1,paddingVertical:10 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <Donut percentage={100} color={"#69d14b"} delay={500 + 100 * i} max={totalWeight ? totalWeight :0 } textColor="#ffffff" />
                <Donut percentage={100} color={"#69d14b"} delay={500 + 100 * i} max={totalReward ?totalReward :0 } textColor="#ffffff" />
                <Donut percentage={100} color={"#69d14b"} delay={500 + 100 * i} max={remainReward ? remainReward :0} textColor="#ffffff" />
              </View>
              <View style={{ flexDirection: "row",justifyContent:"space-between",marginHorizontal:10 }}>
                <Text style={{ color: "#175323", fontSize: 16, fontWeight: "bold", textAlign: "center" }}>GHG {'\n'} REDUCED</Text>
                <Text style={{ color: "#175323", fontSize: 16, fontWeight: "bold", textAlign: "center", marginLeft: 10 }}>ITEMS {'\n'} RECYCLED</Text>
                <Text style={{ color: "#175323", fontSize: 16, fontWeight: "bold", textAlign: "center" }}>POINTS {'\n'}  EARNED</Text>
              </View>
            </View>

            <ScrollView style={{ paddingVertical:15 }} horizontal={true}>
              <LineChart
                data={{
                  labels: barChartlavel.length != 0 ? barChartlavel : ["Bottle", "Can", "Candy", "Chips", "Cup", "Other", "Robins"],
                  datasets: [
                    {
                      data: barChartData.length != 0 ? barChartData.data : [0,0,0,0,0,0,0],
                    }
                  ],
                }}
                width={Dimensions.get('window').width} // from react-native
                height={220}
                chartConfig={{
                  backgroundColor: '#d3d7d0',
                  backgroundGradientFrom: '#1E2923',
                  backgroundGradientTo: '#08130D',
                  decimalPlaces: 2, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16
                  }
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16
                }}

              />
            </ScrollView>


            <ScrollView style={{marginBottom:10}} horizontal={true}>
              <BarChart
                // style={graphStyle}
                data={{
                  labels: barChartlavel.length != 0 ? barChartlavel : ["Bottle", "Can", "Candy", "Chips", "Cup", "Other", "Robins"],
                  datasets: [
                    {
                      data: barChartData.length != 0 ? barChartData.data : [0,0,0,0,0,0,0],
                    }
                  ],
                }}
                width={screenWidth}
                height={220}
                chartConfig={{
                  backgroundColor: '#d3d7d0',
                  backgroundGradientFrom: '#1E2923',
                  backgroundGradientTo: '#08130D',
                  decimalPlaces: 2, // optional, defaults to 2dp
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16
                  }
                }}
              />
            </ScrollView>

            <ScrollView horizontal={true}>
              <View style={{ backgroundColor: "#ffffff" }}>
                <PieChart
                  data={pieChartDataOne.length != 0 ? pieChartDataOne : dataPie }
                  width={screenWidth}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#d3d7d0',
                    backgroundGradientFrom: '#1E2923',
                    backgroundGradientTo: '#08130D',
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16
                    }
                  }}
                  accessor="quantity"
                  backgroundColor="transparent"
                  paddingLeft="15"
                />
              </View>

              <View style={{ backgroundColor: "#ffffff" }}>
                <PieChart
                 data={pieChartDataTwo.length != 0 ? pieChartDataTwo : dataPie }
                  width={screenWidth}
                  height={220}
                  chartConfig={{
                    backgroundColor: '#d3d7d0',
                    backgroundGradientFrom: '#1E2923',
                    backgroundGradientTo: '#08130D',
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                      borderRadius: 16
                    }
                  }}
                  accessor="quantity"
                  backgroundColor="transparent"
                  paddingLeft="15"
                />
              </View>

            </ScrollView>

          </ScrollView>
        </View >
        </SafeAreaView>
      );
    }
  }
}

