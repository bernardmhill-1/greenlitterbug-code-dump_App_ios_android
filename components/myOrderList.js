import React from 'react';
import {
  View,
  Text
} from 'react-native';
import { CustomButton } from './Button'
import * as Print from 'expo-print';

export default class OrderList extends React.Component {
  
  downloadInvoice = async() => {
      const {allItem} = this.props
      const options = {
        html: HTML(allItem)
      }
       await Print.printAsync(options);
  }


  render() {
    const { products, allItem } = this.props
    return (
      <View style={{}}>
        <View style={{ borderRadius: 10, bodercolor: '#b7b7b7', borderWidth: 1, paddingBottom: 40, paddingVertical: 10, marginHorizontal: 25 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 6, alignContent: 'center' }}>
            <Text style={{ color: '#24324c', fontFamily: 'WS-Medium', fontSize: 14 }}>Order Id: <Text style={{ textAlign: 'left', color: '#24324c', fontFamily: 'WS-Medium', fontSize: 14, marginBottom: 8 }}>{this.props.orderId}</Text></Text>
            <Text style={{ color: '#23334a', fontFamily: 'WS-Medium', fontSize: 14 }}>TotalQty: <Text style={{ textAlign: 'left', color: '#23334a', fontFamily: 'WS-Medium', fontSize: 14 }}>{this.props.totalQty}</Text></Text>
          </View>

          <View style={{ marginHorizontal: 20 }}>
            <Text style={{ color: '#24324c', fontFamily: 'WS-Medium', fontSize: 14, marginBottom: 4 }}>Order Date:  <Text style={{ textAlign: 'left', color: '#24324c', fontFamily: 'WS-Medium', fontSize: 14, marginBottom: 4 }}>{this.props.date}</Text></Text>
            {products ?
              products.map(product => {
                return (
                  <View key={product._id} style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6, }}>
                    <View style={{flex:0.5,alignItems:'flex-start'}}>
                      <Text style={{ color: '#23334a', fontFamily: 'WS-Medium', fontSize: 14, }}>{product.productName}</Text>
                    </View>
                    <View style={{flex:0.5,alignItems:'flex-start'}}>
                      <Text style={{ color: '#23334a', fontFamily: 'WS-Medium', fontSize: 14, }}>Qty: {product.qty}</Text>
                    </View>
                    {/* <Text  style={{color:'#23334a',fontFamily:'WS-Medium',fontSize:14,}}>{product.productName} <Text style={{ textAlign:'center',color:'#23334a',fontFamily:'WS-Medium',fontSize:14 }}>Qty: {product.qty}</Text></Text> */}
                  </View>
                )
              }) : null
            }
            <Text style={{ color: '#23334a', fontFamily: 'WS-Medium', fontSize: 14 }}>Points Redeemed: <Text style={{ textAlign: 'left', color: '#23334a', fontFamily: 'WS-Medium', fontSize: 14 }}>{this.props.points}</Text></Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', marginHorizontal: 30, position: 'relative', bottom: 25 }}>
          <View style={{ flex: 0.5, }}>
            <CustomButton
              onClick={this.downloadInvoice}
              text="Download Invoice"
              margin="zero"
              font="vary" />
          </View>

          <View style={{ flex: 0.5 }} >
            <CustomButton
              text={`Status - ${this.props.status}`}
              margin="zero"
              font="vary"
            />
          </View>

        </View>
      </View>

    );
  }
}
