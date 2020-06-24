import React, { Component } from 'react';
import { Modal, Input, Icon, message, Button } from 'antd';
import { connect } from 'react-redux';
import { registerSuccess, registerFailue } from '../../store/actions/user';
import https from '../../utils/https';
import urls from '../../utils/urls';
import './register.less';

@connect(state => state.user, { registerSuccess, registerFailue })
class Register extends Component {
	constructor(props) {
		super(props);
		this.state = {
			location:{
				address:'',
			},
			email: '',
			name: '',
			password: '',
			emailCode:'',
			emailBtnText:'发送验证码',
			emailBtnDisabled:false,
			phone: '',
			introduce: '',
			type: 1,
		};
		this.register = this.register.bind(this);
		this.handleOk = this.handleOk.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSendEmailCode = this.handleSendEmailCode.bind(this);
	}

	componentWillMount(){
        let script = document.createElement("script")
        script.src = "https://webapi.amap.com/maps?v=1.4.15&key=fec27ce3941c53a5166d2c3653e9cdc9&plugin=AMap.Geocoder"
        document.head.appendChild(script)
	}
	
	componentDidMount(){
		let _this = this;
		let timer = setInterval(function(){
			if(!window.AMap) return ;
			clearInterval(timer);
			//初始化地图对象，加载地图
			var map = new window.AMap.Map('registerMap', {
				resizeEnable: true
			});
			var geocoder = new window.AMap.Geocoder({
				city: "010", //城市设为北京，默认：“全国”
				radius: 1000 //范围，默认：500
			});

			window.AMap.plugin('AMap.Geolocation', function() {
				var geolocation = new window.AMap.Geolocation({
					enableHighAccuracy: true,//是否使用高精度定位，默认:true
					timeout: 10000,          //超过10秒后停止定位，默认：5s
					buttonPosition:'RB',    //定位按钮的停靠位置
					buttonOffset: new window.AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
					zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
				});
				map.addControl(geolocation);
				geolocation.getCurrentPosition(function(status,result){
					if(status ==='complete'){
						onComplete(result)
					}else{
						onError(result)
					}
				});
			});
			//解析定位结果
			function onComplete(data) {
				getAddress(data.position);
			}
			//解析定位错误信息
			function onError(data) {
				console.err('解析定位失败原因',data.message)
			}
			function getAddress(position){
				let coords = position.lng+','+position.lat;
				geocoder.getAddress(coords, function(status, result) {
					if (status === 'complete'&&result.regeocode) {
						let addressComponent = result.regeocode.addressComponent;
						// console.log(result.regeocode);
						_this.setState({
							location:{
								address:addressComponent.province + ' - ' +addressComponent.city + ' - ' + addressComponent.district
							}
						})
					}else{
						console.error('根据经纬度查询地址失败:',result)
					}
				});
			}
		},1500)
	}

	/**
	 * 注册
	 * @param {} params
	 */
	register({ email, name, password, emailCode, phone, introduce, type, }) {
		https
			.post(urls.register, {
				email,
				address:this.state.location.address,
				name,
				password,
				emailCode,
				phone,
				introduce,
				type,
			})
			.then(res => {
				if (res.status === 200 && res.data.code === 0) {
					this.props.registerSuccess(res.data.data);
					this.props.handleCancel();
					message.success('注册成功, 请前往登录~', 1);
					this.setState({
						email: '',
						name: '',
						password: '',
						emailCode: '',
						phone: '',
						introduce: '',
					});
				} else {
					message.error(res.data.message, 1);
					this.props.registerFailue(res.data.message);
				}
			})
			.catch(err => {
				console.log(err);
			});
	}

	/**
	 * 发送邮箱验证码
	 */
	handleSendEmailCode = () => {
		const emailReg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$'); //正则表达式
		if (!this.state.email) {
			message.warn('请输入邮箱！');
			return;
		}
		if(!emailReg.test(this.state.email)) {
			message.warn('请输入正确的邮箱！');
			return;
		} 
		https
			.get(urls.sendEmailCode, {
				params:{
					email:this.state.email,
				},
				withCredentials:true,
			})
			.then(res => {
				if (res.status === 200 && res.data.code === 0) {
					let countDownTime = 60;
					this.setState({
						emailBtnText: countDownTime + 's之后可再发送',
						emailBtnDisabled:true
					})
					let emailCodeTimer = setInterval(()=>{
						countDownTime --;
						if(countDownTime <= 0){
							this.setState({
								emailBtnText: '发送验证码',
								emailBtnDisabled:false
							},()=>{
								clearInterval(emailCodeTimer);
							})
						}else{
							this.setState({
								emailBtnText: countDownTime + 's之后可再发送',
							})
						}
					},1000)
					message.success(res.data.message, 1);
				} else {
					message.error(res.data.message, 1);
				}
			})
			.catch(err => {
				console.log(err);
			});
	}

	/**
	 * 提交注册
	 */
	handleOk() {
		const reg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$'); //正则表达式
		const re = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(19[0-9]{1}))+\d{8})$/;
		if (this.state.phone && !re.test(this.state.phone)) {
			message.warn('请输入正确的手机号!');
			return false;
		}
		if (!this.state.email) {
			message.warn('请输入邮箱！');
		} else if (!reg.test(this.state.email)) {
			message.warn('请输入正确的邮箱！');
		} else if (!this.state.name) {
			message.warn('请输入用户名！');
		} else if (!this.state.password) {
			message.warn('请输入密码！');
		} else if (!this.state.emailCode) {
			message.warn('请输入验证码！');
		} else {
			this.register(this.state);
		}
	}
	
	/**
	 * 双向绑定
	 * @param {*} event 
	 */
	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value,
		});
	}
	/**
	 * 渲染函数
	 */
	render() {
		return (
			<Modal
				title="注册"
				style={{ top: '15%' }}
				visible={this.props.visible}
				onCancel={this.props.handleCancel}
				width={450}
				maskClosable={false}
				footer={null}
			>
				<div className="register-input">
					<Input
						style={{ marginBottom: 20,height:40}}
						prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
						name="email"
						placeholder="请输入邮箱"
						value={this.state.email}
						onChange={this.handleChange}
					/>
					<Input
						style={{ marginBottom: 20,height:40 }}
						prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
						name="name"
						placeholder="请输入用户名"
						value={this.state.name}
						onChange={this.handleChange}
					/>
					<Input
						style={{ marginBottom: 20,height:40 }}
						prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
						type="password"
						name="password"
						placeholder="请输入密码"
						value={this.state.password}
						onChange={this.handleChange}
					/>
					<div className="form-wrap" style={{ marginBottom: 20,height:40 }}>
						<Input
							style={{ height:40 }}
							prefix={<Icon type="code" style={{ color: 'rgba(0,0,0,.25)' }} />}
							type="tel"
							name="emailCode"
							placeholder="请输入邮箱验证码"
							maxLength={6}
							value={this.state.emailCode}
							onChange={this.handleChange}
						/>
						<Button 
							disabled={this.state.emailBtnDisabled}
							style={{ height:40 }} 
							type="primary" 
							onClick={this.handleSendEmailCode}
						>
							{this.state.emailBtnText}
						</Button>
					</div>
					<Input
						style={{ marginBottom: 20,height:40 }}
						prefix={<Icon type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
						name="phone"
						placeholder="请输入手机（选填）"
						value={this.state.phone}
						onChange={this.handleChange}
					/>
					<Input
						style={{ marginBottom: 40,height:40 }}
						prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
						name="introduce"
						placeholder="请输入个人介绍（选填）"
						value={this.state.introduce}
						onChange={this.handleChange}
					/>
					<div id="registerMap" style={{display:'none'}}></div>
				</div>
				<div className="register-submit">
					<Button style={{ width: '100%',height:40 }} type="primary" onClick={this.handleOk}>
						注册
					</Button>
				</div>
			</Modal>
		);
	}
}

export default Register;
