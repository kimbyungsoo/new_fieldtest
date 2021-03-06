var net = require('net');
var fs = require('fs');
var dev_ip = process.argv[2];
var dev_port = process.argv[3];
Date.prototype.format = function(f) {
    if (!this.valueOf()) return " ";
 
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;
     
    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|ms|a\/p)/gi, function($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
            case "ss": return d.getSeconds().zf(2);
            case "ms": return d.getMilliseconds().zf(3);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};
 
String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

var dt = new Date().format("yyyyMMdd-hh시mm분ss초ms");
var title = './result_emul_'+dt+'.txt';
//var title = './emul_msg4_USIMless.txt'; //test
var dut = net.connect({ port: dev_port, host: dev_ip });
var msg1 = new Buffer([0x12,0x33,0x07,0x00,0x0a,0x10,0x00,0x00,0xc8,0x2b,0x7e]);
var msg2 = new Buffer([0x12,0x33,0x13,0x00,0x50,0x10,0x08,0x00,0x00,0x00,0x00,0x00,0x75,0xa7,0xf8,0x4a,0x56,0x00,0x00,0x00,0xa0,0xb7,0x7e,0x12,0x33,0x07,0x00,0x00,0x10,0x04,0x00,0xa7,0x8f,0x7e]);
var msg3 = new Buffer([0x12,0x33,0x0b,0x00,0x05,0x00,0x04,0x00,0xff,0x00,0x00,0x00,0xbc,0x05,0x7e]);
var msg4 = new Buffer([0x12,0x33,0xd1,0x00,0x04,0x00,0xc8,0x00,0x00,0x00,0x00,0x00,0x68,0x00,0x00,0x00,0x60,0x00,0x70,0x00,0x17,0xe0,0x6c,0x18,0x58,0x58,0x07,0x00,0xe0,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x01,0x00,0x00,0x00,0xb8,0x00,0x00,0x00,0x07,0x7d,0x5e,0x0c,0xc0,0x00,0x00,0xaf,0xf7,0xff,0xdc,0x16,0x00,0x78,0x7d,0x5e,0x80,0x00,0x7f,0xf0,0xef,0xf8,0xfe,0x00,0xe0,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x02,0x00,0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x00,0x7f,0xfe,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x7f,0xc0,0xff,0xff,0xe6,0xfe,0xff,0xe0,0xff,0xff,0xff,0xc5,0x03,0x00,0x00,0x00,0x20,0x00,0x00,0x00,0xff,0xc0,0xff,0xf0,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x04,0x00,0x00,0x00,0x10,0x00,0x00,0x00,0x1d,0x80,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x72,0xf5,0x7e]);
var msg5 = new Buffer([0x12,0x33,0x07,0x00,0x00,0x10,0x04,0x00,0xa7,0x8f,0x7e]); 
//아마도 요청 CMD는 0x1233으로 예상된다. Log msg의 경우 0xFFFF이다.
//msg1 같은 크기의 메시지가 돌아오지만 알수는 없다. USIM의 존재 유무와 관계없이 똑같은 패킷이 응답으로 돌아온다.
//msg2 USIM의 존재 유무와 관계없이 똑같은 패킷이 응답으로 돌아온다. //가변적으로 변하는 메시지이다.
//msg3 USIM의 존재 유무와 관계없이 똑같은 패킷이 응답으로 돌아온다.
//msg4만 전송했을때 응답 메시지가 존재하지 않는다.
//msg5 칩정보를 요청하는 메시지
if(process.argv[3] == null){
    console.log("Usage : node [node file name] [ip addr] [port addr]")
}
dut.on('connect', function () {
    console.log('connected to server!');
    sendmsg(msg1);
    setTimeout(sendmsg, 240, msg2);
    setTimeout(sendmsg, 340, msg3);
    setTimeout(sendmsg, 940, msg4);
    //setTimeout(function(){setInterval(intervalsendmsg, 1000);}, 70);
    setInterval(intervalsendmsg, 1000);
});
// 서버로부터 받은 데이터를 화면에 출력 
dut.on('data', function (data) {
    var d = new Date().format("hh시mm분ss초ms");
    //console.log('device('+d+'):' + data);
    fs.writeFile(title,'device('+d+') : '+data.toString('hex')+"\n",{flag:'a'});
});
// 접속이 종료됬을때 메시지 출력 
dut.on('end', function () {
    console.log('DUT disconnected.');
}); // 에러가 발생할때 에러메시지 화면에 출력 
dut.on('error', function (err) {
    console.log('DUT' + err);
}); // connection에서 timeout이 발생하면 메시지 출력 
dut.on('timeout', function () {
    console.log('DUT connection timeout.');
});
function sendmsg(arg){
	dut.write(arg);
    var d = new Date().format("hh시mm분ss초ms");
    //console.log('emul_pro('+d+'):' + arg);
    fs.writeFile(title,'emul_pro('+d+') : '+arg.toString('hex')+"\n",{flag:'a'});
}
function intervalsendmsg()
{	
    sendmsg(msg5);
	setTimeout(sendmsg,70,msg1);
    //sendmsg(msg4);//test
}