import { NetInfo } from 'react-native';
import AppConfig from '../config';
import qs from 'qs'
const url = AppConfig.apiLoc;
var apiCalls = {};
// let error = 'Uh oh, something has gone wrong. Please tweet us @randomapi about the issue. Thank you.'

apiCalls.login = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          devicetoken: data.devicetoken,
          pushtoken: data.pushtoken,
          apptype: data.apptype
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      Alert.alert('No Internet', 'You are Offline. Please check your connection.')
    }
  });
}

apiCalls.forgotPassword = (email, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/forgotPassword', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.verifyOTP = (data, cb) => {
  console.log('varify-data', data);

  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/verifyOtp', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          otp: data.otp
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.resetPassword = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/resetPassword', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.emailVerification = (data, cb) => {
  console.log(data);
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/emailVerification', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          verification_code: data.verificationCode
        })
      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.editProfile = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/editProfile', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
          "authtoken": data.userToken
        },
        body: JSON.stringify({
          _id: data.userId,
          first_name: data.firstName,
          last_name: data.lastName,
          phone_no: data.phoneNo
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.register = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/register', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          password: data.password,
          phone_no: data.phoneNo,
          devicetoken: data.devicetoken,
          apptype: data.apptype
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.Privacy = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/cms?content_type=privacy_policy', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
        },
      })
       // .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson._bodyInit)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.termsCondition = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/cms?content_type=terms_condition', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
        },
      })
       // .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson._bodyInit)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.scanProducts = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/recyclingProductAdd', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'multipart/form-data',
          'Content-Type': 'application/json',
          "authtoken": data.userToken
        },
        body: JSON.stringify({
          user_id: data.userId,
          productType: data.productType,
          companyName: data.companyName,
          binCode: data.binCode,
          place: data.place,
          productImage: data.productImage,
          barCodeImage: data.barCodeImage
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.ProductListByUser = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/recyclingProductListByUser', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
          "authtoken": data.userToken
        },
        body: JSON.stringify({
          user_id: data.userId,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.recyclingProductTypeList = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/recyclingProductTypeList', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          authtoken: data.userToken
        },

      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.ProgramDetails = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/getPrograme', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: data.userId,
          authtoken: data.userToken,
          id: data.itemId
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.editProfileImage = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/editProfileImage', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'multipart/form-data',
          'authtoken': data.userToken
        },
        body: data.formData

      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.viewProfile = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/viewProfile', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
          "authtoken": data.userToken
        },
        body: JSON.stringify({
          _id: data.userId
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.changePassword = (data, cb) => {
  console.log('data', data)
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/changePassword', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
          'authtoken': data.userToken
        },
        body: JSON.stringify({
          _id: data.userId,
          currentpassword: data.currentpassword,
          password: data.newPassword
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log('data', responseJson)
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.causeList = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/causeList', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
          'authtoken': data.userToken
        },
        body: JSON.stringify({
          searchKey: data.searchKey
        }),

      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.causeDetail = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/causeDetail', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
          authtoken: data.userToken
        },
        body: JSON.stringify({
          _id: data.causesId,

        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.vendorListing = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/vendorList', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
          'authtoken': data.userToken
        },
        body: JSON.stringify({
          searchKey: data.searchKey
        }),

      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.vendorDetail = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/vendorDetail', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
          'authtoken': data.userToken
        },
        body: JSON.stringify({
          _id: data.vendorId
        }),

      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.home = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/home', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
          'authtoken': data.userToken
        },

      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.featuredAdsList = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/featuredAdsList', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
          'authtoken': data.userToken
        },

      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.productList = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/productList', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
          'authtoken': data.userToken
        },
        body: JSON.stringify({
          searchKey: data.searchKey,
          category: data.category,
          page_no: 1
        }),

      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.productCategoryList = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/productCategoryList', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
          "authtoken": data.userToken
        },

      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.productDetail = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/productDetail', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
          'authtoken': data.userToken
        },
        body: JSON.stringify({
          _id: data.productId
        }),

      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.addTocart = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/addTocart', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
          'authtoken': data.userToken
        },
        body: JSON.stringify({
          userId: data.userId,
          productId: data.productId,
          qty: data.qty
        }),

      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.cartList = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/cartList', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
          'authtoken': data.userToken
        },
        body: JSON.stringify({
          userId: data.userId,
        }),

      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}


apiCalls.cartProductDelete = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/cartProductDelete', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
          'authtoken': data.userToken
        },
        body: JSON.stringify({
          cartId: data.cartId,
          userId: data.userId
        }),

      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.cartQuatityUpdate = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/cartQuatityUpdate', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
          'authtoken': data.userToken
        },
        body: JSON.stringify({
          cartId: data.cartId,
          qty: data.qty,
          userId: data.userId
        }),

      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.addShippingAddress = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/addShippingAddress', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
          'authtoken': data.userToken
        },
        body: JSON.stringify({
          userId: data.userId,
          addressOne: data.addressOne,
          addressTwo: data.addressTwo,
          country: data.country,
          state: data.state,
          zipCode: data.zipCode,

        }),

      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.viewShippingAddress = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/viewShippingAddress', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
          'authtoken': data.userToken
        },
        body: JSON.stringify({
          userId: data.userId

        }),

      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.checkOut = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/checkOut', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
          'authtoken': data.userToken
        },
        body: JSON.stringify({
          userId: data.userId

        }),

      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.orderList = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/orderList', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
          'authtoken': data.userToken
        },
        body: JSON.stringify({
          userId: data.userId

        }),

      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.contactUs = (data, cb) => {
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/contactUs', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/json',
          'authtoken': data.userToken
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          message: data.message
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}

apiCalls.searchRecyclingProduct = (data, cb) => {
  console.log('Apidata',data)
  NetInfo.isConnected.fetch().then(isConnected => {
    if (isConnected) {
      fetch(url + '/searchRecyclingProduct', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          "cache-control": "no-cache",
          'Content-Type': 'application/x-www-form-urlencoded',
          'authtoken': data.userToken
        },
        body: qs.stringify({
          barcode: data.barCode,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          cb(null, responseJson)
        })
        .catch((error) => {
          cb(error);
        });
    }
    else {
      alert('You are Offline. Please check your connection.')
    }
  });
}


module.exports = apiCalls;