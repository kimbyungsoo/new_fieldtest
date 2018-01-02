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
var title = './packetdump_'+dt+'.txt';
var dut = net.connect({ port: dev_port, host: dev_ip });
var server = net.createServer();
var serverSocket;
if(process.argv[3] == null){
    console.log("Usage : node [filename] [ip addr] [port addr]")
}
server.on('connection', function (socket) {
    
    socket.on("data", function (data) {
        dut.write(data);
        var d = new Date().format("hh시mm분ss초ms");
        //console.log('FieldtestS/W('+d+'):' + data);
        fs.writeFile(title,'FieldtestS/W('+d+') : '+data.toString('hex')+"\n",{flag:'a'});
    });
    serverSocket = socket;
});
server.on('close', function () {
    console.log('client closed.');
});

dut.on('connect', function () {
    console.log('connected to server!');
    server.listen(9090, function () {
        console.log('listening on 9090...');
    });
});
// 서버로부터 받은 데이터를 화면에 출력 
dut.on('data', function (data) {
    var d = new Date().format("hh시mm분ss초ms");
    //console.log('device('+d+'):' + data);
    serverSocket.write(data);
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
