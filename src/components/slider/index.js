import './index.less';
import logo from '../../assets/userLogo.jpeg';
import React, { Component } from 'react';
import { Avatar, message } from 'antd';
import { Link } from 'react-router-dom';
import https from '../../utils/https';
import urls from '../../utils/urls';
import {initTime} from '../../utils/time'

class SliderRight extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			keyword: '',
			type: 2, //1 :其他友情链接 2: 是管理员的个人链接 ,‘’ 代表所有链接
			pageNum: 1,
			pageSize: 50,
			siteData: {
				articleCount:'--',
				userCount:'--',
				visitCount:'--',
			},
			list: [],
			linkList: [],
			hotArticlesList:[],
			recommendArticlesList:[],
			isFixed:false,
		};
		this.handleScroll = this.handleScroll.bind(this);
		this.debounce = this.debounce.bind(this);
		this.throttle = this.throttle.bind(this);
		this.handleSearchTags = this.handleSearchTags.bind(this);
		this.handleGetSiteData = this.handleGetSiteData.bind(this);
		this.handleGetHotArticle = this.handleGetHotArticle.bind(this);
		this.handleGetRecommendArticle = this.handleGetRecommendArticle.bind(this);
		this.hotRef = React.createRef();
	}

	componentDidMount() {
		this.handleGetSiteData();
		this.handleSearchTags();
		this.handleGetHotArticle();
		this.handleGetRecommendArticle();
		let renderer=null,time = null;
		let _this = this;
		_this.timer = setTimeout(function(){
			clearTimeout(_this.timer)
			time = document.getElementById('time');
			renderer = initTime(time,13, 10, 16, 1);
			updateTime();
		},1000)
		function updateTime () {
			let currentDate = _this.timeDiff('2020-02-29 00:00:00');
			renderer.render(
			  '已运行 {{ year }} 年 {{ month }} 月 {{ day }} 日 {{ hour }}:{{ minute }}:{{ second }}  ~~',
			  {
				year: currentDate.year,
				month: currentDate.month,
				day: currentDate.day,
				hour: currentDate.hour,
				minute: currentDate.minute,
				second: currentDate.second,
			  }
			);
			setTimeout(updateTime, 1000);
		}
		window.addEventListener('scroll',this.throttle(this.handleScroll));
	}

	componentWillUnmount(){
		clearTimeout(this.timer)
	}

	/**
	 * 防抖
	 */
	debounce = (fn) => {
		let duration = 1000;
		let scrollTimer = null;
		return function(fn){
			if(scrollTimer){			
				clearTimeout(scrollTimer);
			}
			scrollTimer = setTimeout(()=>{
				clearTimeout(scrollTimer);
				fn.apply(this,arguments)
			},duration)
		}
	}

	/**
	 * 节流
	 */
	throttle = (fn) => {
		let duration = 500;
		let canRun = true;
		let scrollTimer = null;
		return function(){
			if(!canRun) return;
			canRun = false;
			scrollTimer = setTimeout(() => {
				fn.apply(this,arguments);
				clearTimeout(scrollTimer);
				canRun = true;
			},duration)
		}
	}

	handleScroll =  (e) => {
		let hotNode = this.hotRef.current;
		if(!hotNode){
			return;
		}
		let distanceTop	= hotNode.offsetTop + hotNode.clientHeight - 200;
		if(window.scrollY > distanceTop && !this.state.isFixed){
			this.setState({
				isFixed:true
			})
		}else if(window.scrollY<=distanceTop && this.state.isFixed){
			this.setState({
				isFixed:false
			})
		}
	}

	//获取时间差
	timeDiff = (startTime) => {
		startTime = new Date(startTime.replace(/-/g, "/"));
		var endTime = new Date(),
		runTime = parseInt((endTime.getTime() - startTime.getTime()) / 1000);
		var year = Math.floor(runTime / 86400 / 365);
		runTime = runTime % (86400 * 365);
		var month = Math.floor(runTime / 86400 / 30);
		runTime = runTime % (86400 * 30);
		var day = Math.floor(runTime / 86400);
		runTime = runTime % 86400;
		var hour = Math.floor(runTime / 3600);
		runTime = runTime % 3600;
		var minute = Math.floor(runTime / 60);
		runTime = runTime % 60;
		var second = runTime;
		return {year:year,month:month,day:day,hour:hour,minute:minute,second:second};
	}

	handleSearchTags = () => {
		https
			.get(urls.getTagList, {
				params: {
					keyword: this.state.keyword,
					pageNum: this.state.pageNum,
					pageSize: this.state.pageSize,
				},
			})
			.then(res => {
				if (res.status === 200 && res.data.code === 0) {
					this.setState({
						list: res.data.data.list,
					});
				} else {
					message.error(res.data.message);
				}
			})
			.catch(err => {
				console.log(err);
			});
	};

	handleGetSiteData = () => {
		https
			.get(urls.getSiteData,{
				params: {
					
				},
			}).then(res => {
				if (res.status === 200 && res.data.code === 0) {
					let visitCount = 0;
					for (let i = 0; i < res.data.data.visitList.length; i++) {
						visitCount += res.data.data.visitList[i].ipVisitNum;
					}
					this.setState({
						siteData:{
							articleCount:res.data.data.articleCount,
							userCount:res.data.data.userCount,
							visitCount:visitCount,
						}
					})
				} else {
					message.error(res.data.message);
				}
			})
			.catch(err => {
				console.log(err);
			});
	};

	handleGetHotArticle = () => {
		https
			.get(
				urls.getHotArticleList,
				{
					params: {
						likes: true,
					},
				},
				{ withCredentials: true },
			)
			.then(res => {
				if (res.status === 200 && res.data.code === 0) {
					this.setState({
						hotArticlesList: res.data.data.list,
					});
				} else {
					console.error(res.data.message)
				}
			})
			.catch(err => {
				console.error(err);
			});
	}

	handleGetRecommendArticle = () => {
		https
			.get(
				urls.getArticleList,
				{
					params: {
						recommend:1,
						pageNum: 1,
						pageSize: 10,
					},
				},
				{ withCredentials: true },
			)
			.then(res => {
				if (res.status === 200 && res.data.code === 0) {
					this.setState({
						recommendArticlesList: res.data.data.list,
					});
				} else {
					console.error(res.data.message)
				}
			})
			.catch(err => {
				console.error(err);
			});
	}
	render() {
		const list = this.state.list.map((item, i) => (
			<Link className="item" key={item._id} to={`/articles?tag_id=${item._id}&tag_name=${item.name}&category_id=`}>
				<span key={item._id}>{item.name}</span>
			</Link>
		));
		const hotArticlesList = this.state.hotArticlesList.map((item, i) => (
			<li className="item"  key={item._id} title={item.desc}>
				<Link to={`/articleDetail?article_id=${item._id}`}>
					<i>{(i+1)<10?'0'+(i+1):(i+1)}.</i>
					<span key={item._id}>{item.title}</span>
				</Link>
			</li>
		));
		const recommendArticlesList = this.state.recommendArticlesList.map((item, i) => (
			<li className="item"  key={item._id} title={item.desc}>
				<Link to={`/articleDetail?article_id=${item._id}`}>
					<i>{(i+1)<10?'0'+(i+1):(i+1)}.</i>
					<span key={item._id}>{item.title}</span>
				</Link>
			</li>
		));
		
		return (
			<div className="right">
				<div className={this.state.isFixed?"introduceFixed introduce":"introduce"}>
					<Avatar className="right-logo" src={logo} size={110} icon="user" />
					<div className="title">
						Khari(隼)
						<p>前端开发工程师</p>
					</div>
					<div id="time" ref="time"></div>
					<div className="right-content">
						<div className="item">
							<div className="num">{this.state.siteData.visitCount}</div>
							访问总数
						</div>
						<div className="item">
							<div className="num">{this.state.siteData.articleCount}</div>
							文章数量
						</div>
						<div className="item">
							<div className="num">{this.state.siteData.userCount}</div>
							粉丝数量
						</div>
					</div>
				</div>
				<div className="tags">
					<div className="title">标签云</div>
					<div className="list">
						{list}
					</div>	
				</div>
				{
					this.state.recommendArticlesList.length>0?
					<div className="recommend">
						<div className="title">推荐列表</div>
						<ul className="list">
							{recommendArticlesList}
						</ul>
					</div>
					:
					''
				}
				<div ref={this.hotRef} className="hot">
					<div className="title">热门阅读</div>
					<ul className="list">
						{hotArticlesList}
					</ul>
				</div>
			</div>
		);
	}
}

export default SliderRight;
