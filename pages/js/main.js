/*
 * @Descripttion: vue前端项目
 * @version: 1.0.0
 * @Author: Baishaodong
 * @Date: 2022-03-30 17:21:30
 * @LastEditors: Baishaodong
 * @LastEditTime: 2022-03-30 18:32:25
 * @BlogSite: https://www.xiaobaibk.com
 */


let webusb = null
let adb = null

let init = async ()=>{
if(!navigator.usb){
    alert("抱歉，您的浏览器不支持使用本插件,请更换为chrome浏览器")
    return
}
try{
    webusb = await Adb.open("WebUSB")
}catch(error){
    if (error.message.indexOf("No device") != -1) { // 未选中设备
				return;
			} else if (error.message.indexOf("was disconnected") != -1) {
				alert("无法连接到此设备, 请尝试重新连接");
			} else {
				alert(error.message);
			}

}


}

let connect = async ()=>{
    await init()
    if (!webusb) {
		return;
	}
    //判断连接
    if (webusb.isAdb()) {
		try {
			adb = null;
			adb = await webusb.connectAdb("host::web1n1", () => {
				alert("请在您的 " + webusb.device.productName + " 设备上允许 ADB 调试");
			});

			if (adb != null) {
				let name = webusb.device.productName + ".";
				message("已连接到"+name)
                $("#disconnect").show()
				console.log(webusb.device);
			}
		} catch(error) {
			alert(error.message);
			adb = null;
		}
	}
}

let disconnect = async() => {
	if (!webusb) {
		return;
	}
	webusb.close();
	
	webusb = null;
	adb = null;

	message("未连接任何设备");
};

let message = async (message)=>{
     $("#connect").html(message)
}

$(function(){
    message("连接到设备")
    $("#disconnect").hide()
    $("#connect").click(()=>{
       message("连接中...")
       connect()
    
    })
    $("#disconnect").click(()=>{
        disconnect()
    })
})