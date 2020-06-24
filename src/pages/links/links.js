import React,{Component} from 'react';
import {Col,Row,Icon,message} from 'antd';
import https from '../../utils/https';
import urls from '../../utils/urls';

import './links.less';
const LinkLogo = require('../../assets/link_logo.png');
class Links extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:true,
            FriendlyLinks:[],
            RecommendLinks:[],
            OtherLinks:[],
        }
    }

    componentWillMount(){
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    componentDidMount(){
        this.loadAllLink();
    }

    loadAllLink = (type) => {
		https
			.get(urls.getAllLinkList, {
				params: {},
			})
			.then(res => {
				if (res.status === 200 && res.data.code === 0) {
                    let FriendlyLinks = [];
                    let RecommendLinksList = [];
                    let OtherLinks = [];
                    res.data.data.list.forEach(item => {
                        if(item.type === 1){
                            FriendlyLinks.push(item)
                        }else if(item.type === 2){
                            RecommendLinksList.push(item)
                        }else{
                            OtherLinks.push(item)
                        }
                    });
                    this.setState({
                        FriendlyLinks: FriendlyLinks,
                        RecommendLinks: RecommendLinksList,
                        OtherLinks: OtherLinks,
                    });
				} else {
					message.error(res.data.message);
				}
			})
			.catch(err => {
                console.log(err);
                message.error('服务器异常!')
			});
    }

    render(){
        const FriendlyLinksList = this.state.FriendlyLinks.map((item,i)=>(
            <li key={i}>
                <a target="_blank" rel="noopener noreferrer" href={item.url.search(/http/g)>-1?item.url:'http://'+item.url}>
                    <div>
                        <img src={item.icon?item.icon:LinkLogo} alt="logo"/>
                        <h5>{item.name}</h5>
                    </div>
                    <p title={item.desc}>{item.desc}</p>
                </a>
            </li>        
        ))
        const RecommendLinksList = this.state.RecommendLinks.map((item,i)=>(
            <li key={i}>
                <a target="_blank" rel="noopener noreferrer" href={item.url.search(/http/g)>-1?item.url:'http://'+item.url}>
                    <div>
                        <img src={item.icon?item.icon:LinkLogo} alt="logo"/>
                        <h5>{item.name}</h5>
                    </div>
                    <p title={item.desc}>{item.desc}</p>
                </a>
            </li>        
        )) 
        const OtherLinksList = this.state.OtherLinks.map((item,i)=>(
            <li key={i}>
                <a target="_blank" rel="noopener noreferrer" href={item.url.search(/http/g)>-1?item.url:'http://'+item.url}>
                    <div>
                        <img src={item.icon?item.icon:LinkLogo} alt="logo"/>
                        <h5>{item.name}</h5>
                    </div>
                    <p title={item.desc}>{item.desc}</p>
                </a>
            </li>        
        )) 
        return (
            <Row className="links-wrap">
                <Col className="header-wrap" xl={24} lg={24} md={24} sm={24} xs={24}>
                        <h2>All Links</h2>
                        <p>当你经历七重的孤独，才能成为真正的强者！</p>                    
                </Col>
                <Col className="explain-wrap" xl={24} lg={24} md={24} sm={24} xs={24}>
                        <h3>申请友链说明</h3>
                        <p>
                            <Icon type="check-circle" theme="outlined" style={{ color: '#87d068' }}/>原创优先
                            <Icon type="check-circle" theme="outlined" style={{ color: '#87d068' }}/>技术优先
                            <Icon type="close-circle" theme="outlined" style={{ color: '#ff4d4f' }}/>经常宕机
                            <Icon type="close-circle" theme="outlined" style={{ color: '#ff4d4f' }}/>不合法规
                            <Icon type="close-circle" theme="outlined" style={{ color: '#ff4d4f' }}/>插边球站
                            <Icon type="close-circle" theme="outlined" style={{ color: '#ff4d4f' }}/>红标报毒
                        </p>
                        <p>
                            交换友链请在留言板留言（ps：留言需注册登录（或第三方登录）,邮箱必填，审核完成后，邮箱通知，排名不分先后）本站链接如下：<br />
                            名称：Khari & Yaru的美好记忆<br />
                            网址：https://www.qianyaru.cn<br />
                            图标：https://file.qianyaru.cn/logo_blog_favicon.ico<br />
                            描述：流年以笑掷，未来诚可期！<br />
                        </p>
                        提交申请后将在24小时内完成审核，如超时未通过，请私信我（kangheng0207@gmail.com）。  
                </Col>
                <Col className="links-list-wrap" xl={24} lg={24} md={24} sm={24} xs={24}>
                    <h4>友情链接 ({this.state.FriendlyLinks.length})</h4>
                    <ul>{FriendlyLinksList}</ul>
                </Col>
                <Col className="links-list-wrap" xl={24} lg={24} md={24} sm={24} xs={24}>
                    <h4>博主推荐 ({this.state.RecommendLinks.length})</h4>
                    <ul>{RecommendLinksList}</ul>
                </Col>
                <Col className="links-list-wrap" xl={24} lg={24} md={24} sm={24} xs={24}>
                    <h4>其他工具 ({this.state.OtherLinks.length})</h4>
                    <ul>{OtherLinksList}</ul>
                </Col>
            </Row>
        )
    }
}
export default Links;