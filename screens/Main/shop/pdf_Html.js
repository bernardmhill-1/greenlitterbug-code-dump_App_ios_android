
export default HTML = (orderList) => {
  const shippingAddress = orderList ? orderList.shippingAddress : {}
  const totalPoint = orderList ? orderList.totalPoint : 0
  const orderId = orderList ? orderList.orderId : 0
  console.log('totalpoint:', totalPoint)
  const products = orderList ? orderList.products : []
  renderProducts = products.map((data, i) => {
    return (
      '<tr>' +
      '<td style = "text-align: center;">' + Number(i + 1) + '</td>' +
      '<td style = "text-align: center;">' + data.productName + '</td>' +
      '<td style = "text-align: center;">' + data.qty + '</td>' +
      '<td style = "text-align: center;">' + data.unitPoint + '</td>' +
      '</tr>' +
      '<tr>'
    )
  }).join('')



  return (
    '<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">' +
    '<link href="./pdfStyle.css" rel="stylesheet"> ' +
    '<div class="container" >' +
    '<div class="row" style="margin-bottom:50px;border-bottom:1px dotted" >' +
    '<div class="col-5">' +
    '<h3>Company Name :- Brainium</h3>' +
    '<h5>Address :- brainium Infromation technowlodies,</h5>' +
    '<h5>Shakti tower 5th floor</h5>'+
    '<h5>En-60,Sector V </h5>'+
    '<h5>Kolkata, West Bengal 700091 </h5>'+
    '<h5>Contact : - 5616099590</h5>'+
    '<h5>Fax :- 5614232335</h5>'+
    '<h5>federal Tax ID 82-2296461</h5>'+
    '<h5 style="margin-bottom:40px;">www.flautoglass.com</h5>'+
    '</div>'+
    '</div>'+


    '<div class="col" style="margin-bottom:100px;">'+
    '<h2 style = "margin-bottom:25px;">Product Details :- </h2>'+
    '<h2 style = "margin-bottom:30px;">Order Id :- ' + orderId + ' </h2>'+
    '<table class="table table-bordered" style = "margin-bottom:30px;" >'+
    '<thead>'+
    '<tr>'+
    '<th style = "text-align: center;">#</th>'+
    '<th style = "text-align: center;">Product name</th>'+
    '<th style = "text-align: center;">Quantity</th>'+
    '<th style = "text-align: center;">Unit Point</th>'+
    '</tr>' +
    '</thead>'+
    '<tbody>'+
    renderProducts+
    '<tr>'+
    '<td colSpan="3" style = "text-align: center;">total Point</td>'+
    '<td style = "text-align: center;">' + totalPoint + '</td>'+
    '</tr>'+
    '</tbody>'+
    '</table>'+
    '</div>'+


    '<div class="row" style="margin-bottom:50px;border-bottom:1px dotted" >'+
    '<div class="col-5">'+
    '<h3>Shipping Address :- ' + shippingAddress.addressOne + '</h3>'+
    '<h5>Address :- ' + shippingAddress.addressTwo + ',</h5>'+
    '<h5>Country : - ' + shippingAddress.country + '</h5>'+
    '<h5>State :- ' + shippingAddress.state + '</h5>'+
    '<h5 style = "margin-bottom:50px;">Zipcode:- ' + shippingAddress.zipCode + '</h5>'+
    '</div>' +
    '</div>'
  )
}