import React,{Component} from 'react';
import {Row,Col,message} from "antd";
import {Link} from 'react-router-dom';
import https from '../../utils/https';
import urls from '../../utils/urls';

import './footer.less';
class FooterBar extends Component{
    constructor(props){
        super(props);
        this.state={
            linksList:[],
            recommendLinksList:[
                {
                    url:'http://www.ytmp3.cn/',
                    name:'扬天音乐外链',
                    desc:'获取音乐Url',
                },
                {
                    url:'https://sm.ms/',
                    name:'SM.MS',
                    desc:'图片上传获取Url',
                },
                {
                    url:'https://www.gaoding.com/koutu',
                    name:'稿定抠图',
                    desc:'免费在线抠图',
                },
                {
                    url:'http://tool.oschina.net/',
                    name:'在线工具',
                    desc:'免费强大的各种在线工具',
                },
            ],
        }
        this.loadLink = this.loadLink.bind(this);
    }
    
    componentDidMount(){
		this.loadLink(1);
		this.loadLink(2);
    }

	loadLink = (type) => {
		https
			.get(urls.getLinkList, {
				params: {
					type: type || '',
					keyword: this.state.keyword,
					pageNum: this.state.pageNum,
					pageSize: this.state.pageSize,
				},
			})
			.then(res => {
				if (res.status === 200 && res.data.code === 0) {
                    if(type===1){
                        let linksList = this.state.linksList;
                        this.setState({
                            linksList: linksList.concat(res.data.data.list),
                        });
                    }else if(type===2){
                        let recommendLinksList = this.state.recommendLinksList;
                        this.setState({
                            recommendLinksList: recommendLinksList.concat(res.data.data.list),
                        });
                    }else{
                        return;
                    }
				} else {
					message.error(res.data.message);
				}
			})
			.catch(err => {
				console.log(err);
			});
    }
    
    render(){
        let linksList = this.state.linksList.length>=8?this.state.linksList.slice(0,7):this.state.linksList;
        const links = linksList.map((item,i)=>(
            <li key={i}>
                <a href={item.url.search(/http/g)>-1?item.url:'http://'+item.url} target="_blank" rel="noopener noreferrer" title={item.desc}>
                    {item.name}
                </a>
            </li>
        ))
        let recommendLinksList = this.state.recommendLinksList.length>=4?this.state.recommendLinksList.slice(0,3):this.state.recommendLinksList;
        const recommendLinks = recommendLinksList.map((item,i)=>(
            <li key={i}>
                <a href={item.url.search(/http/g)>-1?item.url:'http://'+item.url} target="_blank" rel="noopener noreferrer" title={item.desc}>
                    {item.name}
                </a>
            </li>
        ))
        return (
            <Row className="footer" style={{backgroundColor:"rgba(0,0,0,.7)"}}>
                <div className="links-box" style={{background:"none"}}>
                    <Row>
                        <Col span={4} className="station-link">
                            <h5>关于我们</h5>
                            <Link to="/about">
                                爱情档案
                            </Link>
                            <h5>历史文章</h5>
                            <Link to="/articles?tag_id=&tag_name=&category_id=&owner=1">
                                Khari
                            </Link>
                            <Link to="/articles?tag_id=&tag_name=&category_id=&owner=2">
                                Yaru
                            </Link>
                        </Col>
                        <Col className="links-list" span={14}>
                            <h5>友情链接</h5>
                            <ul>
                                {links}
                                {this.state.linksList.length<=8 &&
                                    <li>
                                        <Link to="/links">
                                            更多友链
                                        </Link>
                                    </li>
                                }
                            </ul>
                            <h5>博主推荐</h5>
                            <ul>
                                {recommendLinks}
                                {this.state.recommendLinksList.length>=4 &&
                                    <li>
                                        <Link to="/links">
                                            更多推荐
                                        </Link>
                                    </li>
                                }
                            </ul>
                        </Col>
                        <Col span={6} className="two-code">
                            <div>
                                <img src={require('../../assets/twocode-boy.jpg')} alt="博主微信二维码"/>
                                <br/>
                                <span>博主微信(无事勿扰)</span>
                            </div>
                            <div>
                                <img src={require('../../assets/twocode-girl.jpg')} alt="博主微信二维码"/>
                                <br/>
                                <span>博主微信(无事勿扰)</span>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="put-on-record">
                    版权所有© 2019-2020 Khari & Yaru的美好回忆 · <a target="_blank" rel="noopener noreferrer" href="http://www.beian.miit.gov.cn">ICP备案号：浙ICP备19049218号-1</a>
                </div>
            </Row>
        )
    }
}
export default FooterBar;