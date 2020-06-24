import './index.less';
import './marked.css';
import logo from '../../assets/userLogo.jpeg';
import React, { Component } from 'react';
import Comment from '../comments/comment';
import CommentList from '../comments/list';
import { Icon, Avatar, message, Button } from 'antd';
import https from '../../utils/https';
import urls from '../../utils/urls';
import LoadingCom from '../loading/loading';
import marked from 'marked';
import hljs from 'highlight.js';
import { getQueryStringByName, timestampToTime } from '../../utils/utils';

class Articles extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
			isSubmitLoading: false,
			list: [],
			content: '',
			type: 1, //文章类型 => 1: 普通文章，2: 简历，3: 管理员介绍
			articleDetail: {
				_id: '',
				author: 'kangheng',
				category: [],
				comments: [],
				create_time: '',
				desc: '',
				id: 16,
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
		this.handleClick = this.handleClick.bind(this);
		this.handleSearch = this.handleSearch.bind(this);
		this.likeArticle = this.likeArticle.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleAddComment = this.handleAddComment.bind(this);
		this.refreshArticle = this.refreshArticle.bind(this);
	}

	handleAddComment() {
		if (!this.state.articleDetail._id) {
			message.error("该文章不存在！", 1);
			return;
		}
		if (!this.state.content) {
			message.warning("请输入内容!", 1);
			return;
		}
		let user_id = '';
		if (window.sessionStorage.userInfo) {
			let userInfo = JSON.parse(window.sessionStorage.userInfo);
			user_id = userInfo._id;
		} else {
			message.warning("登录才能评论，请先登录！", 1);
			return;
		}

		this.setState({
			isSubmitLoading: true,
		});
		https
			.post(
				urls.addComment,
				{
					article_id: this.state.articleDetail._id,
					user_id,
					content: this.state.content,
				},
				{ withCredentials: true },
			)
			.then(res => {
				// console.log('res:', res);
				if (res.status === 200 && res.data.code === 0) {
					message.success(res.data.message, 1);
					this.setState({
						isSubmitLoading: false,
						content: '',
					});
					let article_id = getQueryStringByName('article_id');
					this.handleSearch(article_id);
				} else {
					message.error(res.data.message, 1);
				}
			})
			.catch(err => {
				console.log(err);
			});
	}

	refreshArticle(){
		let article_id = getQueryStringByName('article_id');
		this.handleSearch(article_id);
	}

	handleChange(event) {
		// console.log('event :', event.target)
		this.setState({
			[event.target.name]: event.target.value,
		});
	}

	likeArticle() {
		if (!this.state.articleDetail._id) {
			message.error('该文章不存在！', 1);
			return;
		}
		let user_id = '';
		if (window.sessionStorage.userInfo) {
			let userInfo = JSON.parse(window.sessionStorage.userInfo);
			user_id = userInfo._id;
		} else {
			message.warning('登录才能点赞，请先登录！', 1);
			return;
		}
		this.setState({
			isLoading: true,
		});
		https
			.post(
				urls.likeArticle,
				{
					id: this.state.articleDetail._id,
					user_id,
				},
				{ withCredentials: true },
			)
			.then(res => {
				// console.log('res:', res);
				if (res.status === 200 && res.data.code === 0) {
					let articleDetail = this.state.articleDetail;
					++articleDetail.meta.likes;
					this.setState({
						isLoading: false,
						articleDetail,
					});
					message.success(res.data.message, 1);
				} else {
					message.error(res.data.message, 1);
				}
			})
			.catch(err => {
				console.log(err);
			});
	}

	handleSearch(article_id) {
		// if (!article_id) {
		// 	return;
		// }
		this.setState({
			isLoading: true,
		});
		https
			.post(
				urls.getArticleDetail,
				{
					id: article_id,
					type: this.state.type,
				},
				{ withCredentials: true },
			)
			.then(res => {
				// console.log('res:', res);
				if (res.status === 200 && res.data.code === 0) {
					// console.log('data length:', res.data.data.content.length);
					this.setState({
						articleDetail: res.data.data,
						isLoading: false,
					});
					let keyword = res.data.data.keyword.join(',');
					let description = res.data.data.desc;
					let title = res.data.data.title;
					document.title = title;
					document.getElementById('keywords').setAttribute('content', keyword);
					document.getElementById('description').setAttribute('content', description);
				} else {
					message.error(res.data.message, 1);
				}
			})
			.catch(err => {
				console.log(err);
			});
	}

	componentWillUnmount() {
		document.title = 'Khari & Yaru 爱的小窝';
		document.getElementById('keywords').setAttribute('content', 'Khari,Yaru,博客,生活,爱的小窝');
		document.getElementById('description').setAttribute('content', '记录生活');
	}

	handleClick(event) {
		this.setState({
			//   [event.target.name]: event.target.value
		});
	}
	
	componentWillMount() {
        document.body.scrollTop = document.documentElement.scrollTop = 0;
		// console.log('this.props.location.pathname :', this.props.location.pathname)
		if (this.props.location.pathname === '/about') {
			this.setState(
				{
					type: 3, // 文章类型: 3 是博主简介
				},
				() => {
					let article_id = getQueryStringByName('article_id');
					this.handleSearch(article_id);
				},
			);
		} else {
			let article_id = getQueryStringByName('article_id');
			this.handleSearch(article_id);
		}

		// marked相关配置
		marked.setOptions({
			renderer: new marked.Renderer(),
			gfm: true,
			tables: true,
			breaks: true,
			pedantic: false,
			sanitize: true,
			smartLists: true,
			smartypants: false,
			highlight: function(code) {
				return hljs.highlightAuto(code).value;
			},
		});
	}

	render() {
		const list = this.state.articleDetail.tags.map((item, i) => (
			<span key={item.id} className="tag">
				{item.name}
			</span>
		));

		return (
			<div className="article">
				<div className="header">
					<div className="title">{this.state.articleDetail.title}</div>
					<div className="author">
						<a className="avatar" href="">
							<Avatar className="auth-logo" src={logo} size={50} icon="user" />
						</a>{' '}
						<div className="info">
							<span className="name">
								<a href="">{this.state.articleDetail.author}</a>
							</span>
							<div props-data-classes="user-follow-button-header" data-author-follow-button="" />
							<div className="meta">
								<span className="publish-time">
									{this.state.articleDetail.create_time
										? timestampToTime(this.state.articleDetail.create_time, true)
										: ''}
								</span>
								<span className="wordage">字数 {this.state.articleDetail.numbers}</span>
								<span className="views-count">阅读 {this.state.articleDetail.meta.views}</span>
								<span className="comments-count">评论 {this.state.articleDetail.meta.comments}</span>
								<span className="likes-count">喜欢 {this.state.articleDetail.meta.likes}</span>
							</div>
						</div>
						<div className="tags " title="标签">
							<Icon type="tags" theme="outlined" />
							{list}
						</div>
						<span className="clearfix" />
					</div>
				</div>

				{this.state.isLoading ? <LoadingCom /> : ''}

				<div className="content">
					<div
						id="content"
						className="article-detail"
						dangerouslySetInnerHTML={{
							__html: this.state.articleDetail.content ? this.state.articleDetail.content : null,
						}}
					/>
				</div>
				<div className="heart">
					<Button
						type="danger"
						size="large"
						icon="heart"
						loading={this.state.isLoading}
						onClick={this.likeArticle}
					>
						点赞
					</Button>
				</div>
				<Comment
					content={this.state.content}
					isSubmitLoading={this.state.isSubmitLoading}
					handleChange={this.handleChange}
					handleAddComment={this.handleAddComment}
				/>
				<CommentList
					numbers={this.state.articleDetail.meta.comments}
					list={this.state.articleDetail.comments}
					article_id={this.state.articleDetail._id}
					refreshArticle={this.refreshArticle}
				/>
			</div>
		);
	}
}

export default Articles;
