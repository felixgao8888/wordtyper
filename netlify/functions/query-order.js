// 虎皮椒支付 - 查询订单状态
const crypto = require('crypto');

const APPID = '201906186608';
const APPSECRET = '23b69e712345283ccef4b9e2f13aa96d';
const QUERY_API = 'https://api.xunhupay.com/payment/query.html';

// 生成签名
function generateHash(params) {
  const keys = Object.keys(params).filter(k => k !== 'hash' && params[k] !== '' && params[k] !== null && params[k] !== undefined).sort();
  let str = '';
  keys.forEach((k, i) => {
    if (i > 0) str += '&';
    str += `${k}=${params[k]}`;
  });
  str += APPSECRET;
  return crypto.createHash('md5').update(str).digest('hex');
}

// 生成随机字符串
function generateNonceStr() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    let orderId = '';
    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      orderId = body.orderId;
    } else {
      orderId = event.queryStringParameters?.orderId || '';
    }

    if (!orderId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, paid: false, msg: '缺少订单号' })
      };
    }

    const time = Math.floor(Date.now() / 1000).toString();
    const nonceStr = generateNonceStr();

    const params = {
      appid: APPID,
      out_trade_order: orderId,
      time: time,
      nonce_str: nonceStr
    };

    params.hash = generateHash(params);

    console.log('查询订单参数:', JSON.stringify(params));

    const response = await fetch(QUERY_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    const result = await response.json();
    console.log('查询结果:', JSON.stringify(result));

    if (result.errcode === 0 && result.data) {
      const status = result.data.status;
      const paid = status === 'OD'; // OD=已支付, WP=待支付, CD=已取消
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          paid: paid,
          status: status,
          orderId: orderId,
          transactionId: result.data.transaction_id || '',
          msg: paid ? '支付成功' : (status === 'WP' ? '等待支付' : '订单状态: ' + status)
        })
      };
    } else {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          paid: false,
          msg: result.errmsg || '查询失败',
          errcode: result.errcode
        })
      };
    }
  } catch (error) {
    console.error('查询订单错误:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, paid: false, msg: '服务器错误: ' + error.message })
    };
  }
};
