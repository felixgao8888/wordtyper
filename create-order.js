// 虎皮椒支付 - 创建订单
const crypto = require('crypto');

const APPID = '201906186608';
const APPSECRET = '23b69e712345283ccef4b9e2f13aa96d';
const PAY_API = 'https://api.xunhupay.com/payment/do.html';

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
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { deviceId, payType } = body;

    if (!deviceId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, msg: '缺少设备ID' })
      };
    }

    // 生成唯一订单号
    const tradeOrderId = `WT${Date.now()}${Math.floor(Math.random() * 10000)}`;
    const time = Math.floor(Date.now() / 1000).toString();
    const nonceStr = generateNonceStr();

    // 获取当前域名作为回调地址
    const host = event.headers.host || 'wordtyper-pro.netlify.app';
    const protocol = event.headers['x-forwarded-proto'] || 'https';
    const baseUrl = `${protocol}://${host}`;
    const notifyUrl = `${baseUrl}/.netlify/functions/pay-callback`;

    const params = {
      version: '1.1',
      appid: APPID,
      trade_order_id: tradeOrderId,
      total_fee: '9.6',
      title: '英语单词打字大冒险-永久激活',
      time: time,
      notify_url: notifyUrl,
      nonce_str: nonceStr,
      attach: JSON.stringify({ deviceId, payType: payType || 'wechat' })
    };

    params.hash = generateHash(params);

    console.log('创建订单参数:', JSON.stringify(params));

    // 调用虎皮椒API
    const response = await fetch(PAY_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    const result = await response.json();
    console.log('虎皮椒返回:', JSON.stringify(result));

    if (result.errcode === 0 && result.url_qrcode) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          orderId: tradeOrderId,
          qrCode: result.url_qrcode,
          payUrl: result.url || '',
          msg: '订单创建成功'
        })
      };
    } else {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          msg: result.errmsg || '创建订单失败',
          errcode: result.errcode
        })
      };
    }
  } catch (error) {
    console.error('创建订单错误:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, msg: '服务器错误: ' + error.message })
    };
  }
};
