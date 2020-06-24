import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Row,Col,Icon, message} from 'antd';
import {Link} from 'react-router-dom'
import {
	timestampToTime,
} from '../../utils/utils';
import urls from '../../utils/urls';
import https from '../../utils/https';
class RecordList extends Component{
    constructor(props){
        super(props);
        this.state={
            isLoading:true,
            leftArticleList:[],
            rightArticleList:[]
        }
        this.handleQueryArticle = this.handleQueryArticle.bind(this)
    }

    componentWillMount(){
        this.handleQueryArticle(1);
        this.handleQueryArticle(2);
    }

    handleQueryArticle = (owner) => {
        this.setState({
			isLoading: true,
		});
        https.get(
            urls.getArticleList,
            {
                params:{
                    owner,                 
                    pageNum: 1,
                    pageSize: 20,
                }
            },
            { withCredentials: true },
        ).then(res=>{
            if(res.data.code===0){
                if(owner===1){
                    this.setState({
                        leftArticleList:res.data.data.list
                    })
                }else{
                    this.setState({
                        rightArticleList:res.data.data.list
                    })
                }
                this.setState({
                    isLoading: false,
                });
            }else{
                message.error('获取首页文章失败')
                return false;
            }
        }).catch(err=>{
            message.error('服务器错误~')
        })
    }

    render(){
		const leftList = this.state.leftArticleList.map((item, i) => (
			<ReactCSSTransitionGroup
				key={i}
				transitionName="example"
				transitionAppear={true}
				transitionAppearTimeout={1000}
				transitionEnterTimeout={1000}
				transitionLeaveTimeout={1000}
			>
				<li key={i} className="list-img left">
					<div className="box">
                        <Link className="content-box" to={`/articleDetail?article_id=${item._id}`}>
                            <h3>{item.title}</h3>
                            <div className="img-blur-done" data-src={item.img_url} style={{backgroundImage:"url("+item.img_url+")"}}>
                               图片
                            </div>
                            <p className="abstract" title={item.desc}>{item.desc}</p>                        
                        </Link>
                        <div className="meta-info">
                            <span><Icon type="clock-circle" theme="outlined" /> {item.create_time ? timestampToTime(item.create_time,true) : ''}</span>
                            <span><Icon type="user-add" theme="outlined" /> {item.owner===1?'Khari':'Yaru'}</span>
                            <span><Icon type="tag" theme="outlined" /> {item.tagsName || ''}</span>
                        </div>
                    </div>
                    <span className="camera"><Icon type="camera" theme="outlined" style={{fontSize:"25px",color:"#ffffff"}}/></span>
				</li>
			</ReactCSSTransitionGroup>
        ));
        const rightList = this.state.rightArticleList.map((item, i) => (
			<ReactCSSTransitionGroup
				key={i}
				transitionName="example"
				transitionAppear={true}
				transitionAppearTimeout={1000}
				transitionEnterTimeout={1000}
				transitionLeaveTimeout={1000}
			>
				<li key={i} className="list-img right">
					<div className="box">
                        <Link className="content-box" to={`/articleDetail?article_id=${item._id}`}>
                            <h3>{item.title}</h3>
                            <div className="img-blur-done" data-src={item.img_url} style={{backgroundImage:"url("+item.img_url+")"}}>
                               图片
                            </div>
                            <p className="abstract" title={item.desc}>{item.desc}</p>                        
                        </Link>
                        <div className="meta-info">
                            <span><Icon type="clock-circle" theme="outlined" /> {item.create_time ? timestampToTime(item.create_time,true) : ''}</span>
                            <span><Icon type="user-add" theme="outlined" /> {item.owner===2?'Yaru':'Khari'}</span>
                            <span><Icon type="tag" theme="outlined" /> {item.tagsName || ''}</span>
                        </div>
                    </div>
                    <span className="camera"><Icon type="camera" theme="outlined" style={{fontSize:"20px",color:"#ffffff"}}/></span>
				</li>
			</ReactCSSTransitionGroup>
		));
        return (
            <Row className="record-list">
                <Col className="list-box" xl={12} lg={12} md={12} sm={12} xs={12}>
                    {leftList}
                </Col>
                <Col className="list-box" xl={12} lg={12} md={12} sm={12} xs={12}>
                    {rightList}
                </Col>
                <div className="line"></div>
            </Row>
        )
    }
}
export default RecordList;