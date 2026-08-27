// 虎皮椒支付 - 支付回调通知
const crypto = require('crypto');

const APPID = '201906186608';
const APPSECRET = '23b69e712345283ccef4b9e2f13aa96d';

// 验证签名
function verifyHash(params) {
  const keys = Object.keys(params).filter(k => k !== 'hash' && params[k] !== '' && params[k] !== null && params[k] !== undefined).sort();
  let str = '';
  keys.forEach((k, i) => {
    if (i > 0) str += '&';
    str += `${k}=${params[k]}`;
  });
  str += APPSECRET;
  const calculatedHash = crypto.createHash('md5').update(str).digest('hex');
  return calculatedHash === params.hash;
}

exports.handler = async (event, context) => {
  console.log('收到支付回调:', event.body);
  console.log('回调headers:', JSON.stringify(event.headers));

  try {
    // 解析form表单数据
    let params = {};
    if (event.body) {
      const bodyStr = event.body.toString();
      if (bodyStr.includes('=')) {
        // form表单格式
        const pairs = bodyStr.split('&');
        pairs.forEach(pair => {
          const [key, value] = pair.split('=');
          params[decodeURIComponent(key)] = decodeURIComponent(value || '');
        });
      } else {
        // JSON格式
        params = JSON.parse(bodyStr);
      }
    }

    console.log('解析后的回调参数:', JSON.stringify(params));

    // 验证签名
    const isValid = verifyHash(params);
    console.log('签名验证结果:', isValid);

    if (!isValid) {
      console.error('签名验证失败');
      return {
        statusCode: 200,
        body: 'fail' // 返回非success，虎皮椒会重试
      };
    }

    // 检查支付状态
    const status = params.status;
    const tradeOrderId = params.trade_order_id;
    const totalFee = params.total_fee;
    const attach = params.attach ? JSON.parse(params.attach) : {};

    console.log(`订单 ${tradeOrderId} 状态: ${status}, 金额: ${totalFee}, 设备: ${attach.deviceId}`);

    if (status === 'OD') {
      // 支付成功
      console.log(`订单 ${tradeOrderId} 支付成功！`);
      // 这里可以记录订单到数据库（如果有）
      // 由于是无服务器函数，前端会轮询查询订单状态，所以这里只需要返回success
    }

    // 返回success表示回调已收到
    return {
      statusCode: 200,
      body: 'success'
    };
  } catch (error) {
    console.error('回调处理错误:', error);
    return {
      statusCode: 200,
      body: 'fail' // 返回非success，虎皮椒会重试
    };
  }
};
