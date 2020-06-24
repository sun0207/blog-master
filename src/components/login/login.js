import React, { Component } from 'react';
import { Modal, Input, Icon, message, Button } from 'antd';
import { connect } from 'react-redux';
import https from '../../utils/https';
import urls from '../../utils/urls';
import { randomState } from '../../utils/utils';
import { loginSuccess, loginFailure } from '../../store/actions/user';
import './login.less'

const githubConfig = require('../../utils/github.config');
@connect(state => state.user, { loginSuccess, loginFailure })
class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loginType:'',
			email: '',
			password: '',
			githubState:'',
			qqState:''
		};
		this.login = this.login.bind(this);
		this.handleOk = this.handleOk.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.thirdPartyLogin = this.thirdPartyLogin.bind(this);
		this.handleGithubLogin = this.handleGithubLogin.bind(this);
		this.thirdPartyQQ = this.thirdPartyQQ.bind(this);
		this.handleGetQqUserInfo = this.handleGetQqUserInfo.bind(this);
	}

	componentDidMount() {
		let _this = this;
		// 监听小窗口回调,授权成功后关闭小窗，并刷新页面
		window.addEventListener('message', function (e) {
			if(typeof e.data === 'string'){
				let messageData = JSON.parse(e.data);
				_this.props.handleCancel();
				switch(_this.state.loginType){
					case 'github':
						_this.handleGithubLogin(messageData,_this.state.githubState);
						break;
					case 'qq':
						_this.handleGetQqUserInfo(messageData,_this.state.qqState);
						break;
					default:
						break;
				}
			}
		})
	}

	login({ email, password }) {
		https
			.post(
				urls.login,
				{
					email,
					password,
				},
				{ withCredentials: true },
			)
			.then(res => {
				if ( res.data.code === 0) {
					this.props.loginSuccess(res.data);
					let userInfo = {
						_id: res.data.data._id,
						name: res.data.data.name,
						avatar: res.data.data.avatar
					}
					window.sessionStorage.userInfo = JSON.stringify(userInfo)
					message.success(res.data.message, 1);
					this.props.handleCancel();
					this.setState({
						email: '',
						password: '',
					});
				} else {
					this.props.loginFailure(res.data.message);
					message.error(res.data.message, 1);
				}
			})
			.catch(err => {
				this.props.loginFailure(err.data.message);
				message.error(err.data.message, 1);
			});
	}

	thirdPartyQQ = async () => {
		let state = randomState();
		this.setState({
			qqState:state
		})
		let resData = await https.get(
				urls.qqLogin,
				{
					params:{
						 state,
					}
				}
			)
		return resData.data.data;
	}

	thirdPartyLogin = async (loginType) => {
		if(loginType !== 'github' && loginType !== 'qq'){
			message.warn('功能开发中~');
			return;
		}
		this.setState({
			loginType,
		})
		if(loginType === 'github'){
			let githubState = randomState();
			this.setState({
				githubState,
			})
			//重定向到认证接口,并配置参数
			let path = githubConfig.code_path;
			path += '?client_id=' + githubConfig.client_id;
			path += '&scope=' + githubConfig.scope;
			path += '&state=' + githubState;
			window.open(path,'_blank', 'width=600, height=400, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no');
		}else if(loginType === 'qq'){
			let qqLoginData = await this.thirdPartyQQ();
			window.open(qqLoginData.url,'_blank', 'width=600, height=400, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no');
		}
	}

	handleGithubLogin = ({code,state},webState) => {
		if(state !== webState){
			message.warn('授权已过期，请重新授权~');
			return;
		}
		https
			.get(
				urls.githubUserInfo,
				{
					params:{
						code,
						state,
					}
				},
				{ withCredentials: true },
			)
			.then(res => {
				if ( res.data.code === 0) {
					this.props.loginSuccess(res.data);
					let userInfo = {
						_id: res.data.data._id,
						name: res.data.data.name,
						avatar: res.data.data.avatar
					}
					window.sessionStorage.userInfo = JSON.stringify(userInfo)
					message.success(res.data.message, 1);
					this.props.handleCancel();
					this.setState({
						email: '',
						password: '',
					});
				} else {
					this.props.loginFailure(res.data.message);
					message.error(res.data.message, 1);
				}
			})
			.catch(err => {
				this.props.loginFailure('登录失败，请重新授权');
				message.error('登录失败，请重新授权', 1);
			});
	}

	handleGetQqUserInfo = ({code,state},webState) => {
		if(state !== webState){
			message.warn('授权已过期，请重新授权~');
			return;
		}
		https.post(
			urls.queryQqLoginUserInfo,
			{
				code,
				state
			},
			{ withCredentials: true },
		).then( res => {
			if(res.data.code === 0){
				this.props.loginSuccess(res.data);
				let userInfo = {
					_id: res.data.data._id,
					name: res.data.data.name,
					avatar: res.data.data.avatar
				}
				window.sessionStorage.userInfo = JSON.stringify(userInfo)
				message.success(res.data.message, 1);
				this.props.handleCancel();
			}else{
				message.success(res.data.message, 1);
			}
		}).catch( err => {

		})
	}

	handleOk() {
		const reg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$'); 
		if (!this.state.email) {
			message.warning('请输入邮箱！');
		} else if (!reg.test(this.state.email)) {
			message.warning('请输入正确的邮箱！');
		} else if (!this.state.password) {
			message.warning('请输入密码');
		} else {
			this.login(this.state);
		}
	}
	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	}
	render() {
		return (
			<Modal
				title="登录"
				style={{ top: '25%' }}
				visible={this.props.visible}
				onCancel={this.props.handleCancel}
				width={450}
				maskClosable={false}
				footer={null}
			>
				<div className="login-input">
					<Input
						style={{ marginBottom: 20,height:40 }}
						prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
						name="email"
						placeholder="请输入邮箱"
						value={this.state.email}
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
				</div>
				<div className="login-submit">
					<Button style={{ width: '100%',height:40 }} type="primary" onClick={this.handleOk}>
						登录
					</Button>
				</div>
				<h4 className="third-party-title">第三方账号登录：</h4>
				<div className="third-party">
					<Button className="github" type="primary" size="large" shape="circle" icon="github" onClick={(e) => this.thirdPartyLogin('github')} />
					<Button className="qq" type="primary" size="large" shape="circle" icon="qq" onClick={(e) => this.thirdPartyLogin('qq')} />
					<Button className="weibo" type="primary" size="large" shape="circle" icon="weibo" onClick={(e) => this.thirdPartyLogin('weibo')} />
				</div>
			</Modal>
		);
	}
}

export default Login;
