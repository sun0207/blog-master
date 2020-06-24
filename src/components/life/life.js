import './life.less';
import React, { Component } from 'react';
import { Icon } from 'antd';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import https from '../../utils/https';
import urls from '../../utils/urls';
import LoadingCom from '../loading/loading';
import LoadEndCom from '../loadEnd/loadEnd';
import {
	getScrollTop,
	getDocumentHeight,
	getWindowHeight,
	getQueryStringByName,
	timestampToTime,
} from '../../utils/utils';
/*actions*/
import { saveArticlesList } from '../../store/actions/articles';

const PandaSvg = () => (
	<svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor">
	  <circle cx="520" cy="500" r="400" stroke="currentColor" strokeWidth="72" fill="white" />
	  <path
	  	d="M500 500 L500 270 Z"
		fill="currentColor"
		stroke="currentColor" 
		strokeWidth="72"
	  />
	  <path
	  	d="M500 500 L640 680 Z"
		fill="currentColor"
		stroke="currentColor" 
		strokeWidth="72"
	  />
	</svg>
);
const PandaIcon = props => <Icon component={PandaSvg} {...props} />;
@connect(state => state.articles, { saveArticlesList })
class Life extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoadEnd: false,
			isLoading: false,
			keyword: '',
			likes: '', // 是否是热门文章
			state: 1, // 文章发布状态 => 0 草稿，1 已发布,'' 代表所有文章
			category_id: getQueryStringByName('category_id'),
			pageNum: 1,
			pageSize: 10,
			articlesList: [],
			total: 0,
		};
		this.handleSearch = this.handleSearch.bind(this);
		this.getBlog = this.getBlog.bind(this);
	}

	getBlog() {
		let params = {
			keyword: this.state.keyword,
			likes: this.state.likes,
			state: this.state.state,
			pageNum: this.state.pageNum,
			pageSize: this.state.pageSize,
		};
		this.props.getBlogList(params);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.location.search !== this.props.location.search) {
			this.setState(
				{
					pageNum: 1,
					articlesList: [],
					category_id: getQueryStringByName('category_id'),
				},
				() => {
					this.handleSearch();
				},
			);
		}
	}

	componentWillMount(){
        document.body.scrollTop = document.documentElement.scrollTop = 0;
	}
	
	componentDidMount() {
		// console.log('location.pathname', this.props.location.pathname);
		if (this.props.location.pathname === '/hot') {
			this.setState(
				{
					likes: true,
				},
				() => {
					this.handleSearch();
				},
			);
		} else {
			this.handleSearch();
		}
		window.onscroll = () => {
			if (getScrollTop() + getWindowHeight() > getDocumentHeight() - 100) {
				// 如果不是已经没有数据了，都可以继续滚动加载
				if (this.state.isLoadEnd === false && this.state.isLoading === false) {
					this.handleSearch();
				}
			}
		};
	}

	componentWillUnmount(){
        window.removeEventListener('scroll', function (event) {
            event.preventDefault();
        },false);
    }

	handleSearch() {
		this.setState({
			isLoading: true,
		});
		https
			.get(
				urls.getArticleList,
				{
					params: {
						keyword: this.state.keyword,
						likes: this.state.likes,
						state: this.state.state,
						category_id: this.state.category_id,
						pageNum: this.state.pageNum,
						pageSize: this.state.pageSize,
					},
				},
				{ withCredentials: true },
			)
			.then(res => {
				// console.log(res);
				let num = this.state.pageNum;
				if (res.status === 200 && res.data.code === 0) {
					this.setState(preState =>({
						articlesList: [...preState.articlesList, ...res.data.data.list],
						total: res.data.data.count,
						pageNum: ++num,
						isLoading: false,
					}));
					if (this.state.total === this.state.articlesList.length) {
						this.setState({
							isLoadEnd: true,
						});
					}
				} else {
				}
			})
			.catch(err => {
				console.error(err);
			});
	}

	render() {
		// console.log('blog articlesList:', this.props.articlesList);
		const list = this.state.articlesList.map((item, i) => (
			<ReactCSSTransitionGroup
				key={item._id}
				transitionName="example"
				transitionAppear={true}
				transitionAppearTimeout={1000}
				transitionEnterTimeout={1000}
				transitionLeaveTimeout={1000}
			>
				<li key={item._id} className="have-img">
					<Link className="wrap-img" to={`/articleDetail?article_id=${item._id}`}>
						<div className="img-blur-done" data-src={item.img_url} style={{backgroundImage:'url('+item.img_url+')'}}>
							图片
						</div>
					</Link>
					<Link className="content" to={`/articleDetail?article_id=${item._id}`}>
						<div>
							<h3 className="title">{item.title}</h3>
							<p className="abstract">{item.desc}</p>
						</div>
						<div className="meta">
							<Icon type="eye" theme="outlined" /> 
							<span>{item.meta.views}{' '}</span>
							<Icon type="message" theme="outlined" />
							<span>{item.meta.comments}{' '}</span>
							<Icon type="heart" theme="outlined" />
							<span>{item.meta.likes}</span>
							<PandaIcon />
							<span className="time">{item.create_time ? timestampToTime(item.create_time,true) : ''}</span>
						</div>
					</Link>
				</li>
			</ReactCSSTransitionGroup>
		));

		return (
			<div className="left" style={{paddingTop:24}}>
				<ul className="note-list">{list}</ul>
				{this.state.isLoading ? <LoadingCom /> : ''}
				{this.state.isLoadEnd && this.state.articlesList.length>3 ? <LoadEndCom /> : ''}
			</div>
		);
	}
}

export default Life;
