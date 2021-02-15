// M.AutoInit();
'use strict';
var payment = module.exports.payment = function (order,hash,resp) {
    bolt.launch({
        key: '7c2pT33E',
        txnid: order.id,
        hash: hash,
        amount: order.amount,
        firstname: order.fname,
        email: order.email,
        phone: order.mobile,
        productinfo: order.pinfo,
        udf5: order.udf5,
        surl : 'http://localhost:4200/profile',
        furl: 'http://localhost:4200/'
      },{ responseHandler: function(BOLT){
        resp(false,BOLT);
      },
        catchException: function(BOLT){
           resp(BOLT,"err");
        }
      });
}
