import React, { Component } from 'react';
import {Row,Col} from 'antd';
import https from '../../utils/https';
import urls from '../../utils/urls';
import Loading from './../loading/loading';

import './index.less'

class AboutUs extends Component{
    constructor(props){
        super(props);
        this.state={
            isLoading:true,
            leftContent:"暂无内容",
            leftCoverImage:'',
            rightContent:"暂无内容",
            rightCoverImage:'',
        }
    }

    componentWillMount(){
        this.getLeftContent(0,0);
        this.getRightContent(1,0);
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    getLeftContent = (who,enabledState) =>{
        https
            .get(
                urls.getAboutDetail,
                {
                    params:{
                        who:who,
                        enabledState:enabledState,
                    }
                },
				{ withCredentials: true },
            ).then(res=>{
                this.setState({
                    isLoading:false
                })
                if(res.data.code===0){
                    this.setState({
                        leftContent:res.data.data.content || '暂无个人介绍',
                        leftCoverImage:res.data.data.img_url
                    })
                }else{
                    this.setState({
                        leftContent:'暂无个人介绍',
                        leftCoverImage:''
                    })
                }
            }).catch(err=>{
                console.error(err);
            })
    }
    getRightContent = (who,enabledState) =>{
        https
            .get(
                urls.getAboutDetail,
                {
                    params:{
                        who:who,
                        enabledState:enabledState,
                    }
                },
				{ withCredentials: true },
            ).then(res=>{
                if(res.data.code===0){
                    this.setState({
                        rightContent:res.data.data.content || '暂无个人介绍',
                        rightCoverImage:res.data.data.img_url
                    })
                }else{
                    this.setState({
                        rightContent:'暂无个人介绍',
                        rightCoverImage:''
                    })
                }
            }).catch(err=>{
                console.error(err);
            })
    }
    render(){
        return (
            <Row className="about-us">
                <Col className="banner-box" xl={12} lg={12} md={12} sm={12} xs={12}>
                    <h2>About Us</h2>
                    <p>我们很简单,了解一下咯~</p> 
                </Col>
                {this.state.isLoading?<Loading></Loading>:''}
                <Col className="content-box" xl={12} lg={12} md={12} sm={12} xs={12}>
                    {this.state.leftCoverImage?
                        <div className="cover-image" style={{backgroundImage:'url('+this.state.leftCoverImage+')'}}>
                            封面图
                        </div>
                        :''
                    }
                    <div className="content"
                        dangerouslySetInnerHTML={{
							__html: this.state.leftContent,
						}}>
                    </div> 
                    <span className="create-time"></span>
                </Col>
                <Col className="content-box" xl={12} lg={12} md={12} sm={12} xs={12}>
                    {this.state.rightCoverImage?
                        <div className="cover-image" style={{backgroundImage:'url('+this.state.rightCoverImage+')'}}>
                            封面图
                        </div>
                        :''
                    }
                    <div className="content"
                        dangerouslySetInnerHTML={{
                            __html: this.state.rightContent,
                        }}>
                    </div> 
                    <span className="create-time"></span>
                </Col>
            </Row>
        )
    }
}
export default AboutUs;