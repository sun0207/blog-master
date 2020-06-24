import './MessageBoardList.less';
import React, { Component } from 'react';
import { message, Avatar, Spin, Icon } from 'antd';
import https from '../../utils/https';
import urls from '../../utils/urls';
import { timestampToTime } from '../../utils/utils';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ReplyMessageBoard from './ReplyMessageBoard';

class MessageBoardList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			visible: false,
			content: '',
			message_id: '',
			to_user: '',
			to_user_id:'',
			articleDetail: {
				_id: '',
				content: '',
				author: 'Khari',
				category: [],
				comments: [],
				create_time: '',
				desc: '',
				id: '',
				img_url: '',
				numbers: 0,
				keyword: [],
				like_users: [],
				meta: { views: 0, likes: 0, comments: 0 },
				origin: 0,
				state: 1,
				tags: [],
				title: '',
				update_time: '',
			},
		};
		this.handleAddOtherComment = this.handleAddOtherComment.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.showCommentModal = this.showCommentModal.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
	}

	handleCancel() {
		this.setState({
			visible: false,
		});
	}

	// 添加评论
	showCommentModal(item, secondItem) {
		if (!window.sessionStorage.userInfo) {
			message.warning('登录才能评论，请先登录！');
			return false;
		}
		// 添加三级评论
		if (secondItem) {
			this.setState({
				visible: true,
				message_id: item._id,
				to_user: secondItem.user,
				to_user_id:secondItem.user_id
			});
		} else {
			// 添加二级评论
			this.setState({
				visible: true,
				message_id: item._id,
				to_user: item.user,
				to_user_id:item.user_id
			});
		}
	}

	handleChange(event) {
		this.setState({
			[event.target.name]: event.target.value,
		});
	}

	componentWillMount() {

	}

	childRef = (ref) =>{
		this.child = ref;
	}

	initModel = (e) => {
        this.child.initModel()
    }

	handleAddOtherComment() {
		if (!this.state.message_id) {
			message.warning('该父评论不存在！');
			return;
		}
		if (!this.state.content) {
			message.warning('回复内容不能为空!');
			return;
		}
		let user_id = '';
		if (window.sessionStorage.userInfo) {
			let userInfo = JSON.parse(window.sessionStorage.userInfo);
			user_id = userInfo._id;
		} else {
			message.warning('登录才能评论，请先登录！');
			return;
		}
		this.setState({
			isLoading: true,
		});
		https
			.post(
				urls.addMessageBoard,
				{
					user_id,
					to_user_id:this.state.to_user_id,
					message_id: this.state.message_id,
					content: this.state.content,
					to_user: JSON.stringify(this.state.to_user),
				},
				{ withCredentials: true },
			)
			.then(res => {
				if (res.status === 200 && res.data.code === 0) {
					this.setState({
						content: '',
						visible: false,
						isLoading: false,
					});
					this.props.refreshMessageBoardList();
				} else {
					message.error(res.data.message);
				}
			})
			.catch(err => {
				this.setState({
					visible: false,
					isLoading: false,
				});
				console.error(err);
			});
	}

	render() {
		const list = this.props.messageBoardList.map(item => (
			<ReactCSSTransitionGroup
				key={item.id}
				transitionName="example"
				transitionAppear={true}
				transitionAppearTimeout={1000}
				transitionEnterTimeout={1000}
				transitionLeaveTimeout={1000}
			>
				<div className="item">
					<div className="item-header">
						<div className="author">
							<div className="avator">
								<Avatar size={42} src={item.avatar}/>
							</div>
						</div>
						<div className="info">
							<div className="name">
								<span className="blue">{item.user} {item.user_type === 0 ? '(管理员)' : ''}</span>
							</div>
							<div className="time">
								<Icon type="environment" size="14" twoToneColor="#969696"/>&nbsp;{item.address || 'CHINA'}&nbsp;&nbsp;&nbsp;{item.create_time ? timestampToTime(item.create_time,true) : ''}
							</div>
						</div>
					</div>
					<div className="comment-detail">
						<p dangerouslySetInnerHTML={{__html: item.content}}></p>
						<button onClick={() => this.showCommentModal(item)} className="message">
							&nbsp;&nbsp;回复
						</button>
					</div>
					{item.reply_list.map((e, index) => {
						return (
							<div key={e._id} className="item-other">
								<div className="item-header">
									<div className="author">
										<div className="avator">
											<Avatar size={38} src={e.avatar}/>
										</div>
									</div>
									<div className="info">
										<div className="name">
											<span className="blue">{e.user} {e.user_type === 0 ? '(管理员)' : ''}</span>
											&nbsp;回复&nbsp;
											<span className="blue">{e.to_user} {e.to_user_type === 0 ? '(管理员)' : ''}</span>：
										</div>
										<div className="time">
											<Icon type="environment" size="14" twoToneColor="#969696"/>&nbsp;{e.address || 'CHINA'}&nbsp;&nbsp;&nbsp;{e.create_time ? timestampToTime(e.create_time,true) : ''}
										</div>
									</div>
								</div>
								<div className="comment-detail">
									<p dangerouslySetInnerHTML={{__html: e.content}}></p>
									<button onClick={() => this.showCommentModal(item, e)} className="message">
										&nbsp;&nbsp;回复
									</button>
								</div>
							</div>
						);
					})}
				</div>
			</ReactCSSTransitionGroup>
		));

		return (
			<div className="comment-list">
				<div className="top-title">
					<span>{this.props.messageCount} 条留言</span>
				</div>
				<Spin spinning={this.state.isLoading}>{list}</Spin>
				<ReplyMessageBoard
					visible={this.state.visible}
					message_id={this.state.message_id}
					to_user={this.state.to_user}
					to_user_id={this.state.to_user_id}
					childRef={this.childRef}
					refreshMessageBoardList={this.props.refreshMessageBoardList}
					handleCancel={this.handleCancel}
				/>
			</div>
		);
	}
}

export default MessageBoardList;
