import './index.less';
import React,{Component} from 'react';
import {Carousel, message} from 'antd';
import IndexHeader from './indexHeader';
import RecordList from './recordList';
import https from '../../utils/https';
import urls from '../../utils/urls';

class Index extends Component{
    constructor(props){
        super(props);
        this.state = {
            code:'',
            isLoading:false,
            bannerList:[
                {
                    photo_desc:'第一张',
                    photo_url:require('../../assets/000.jpg')
                },
            ]
        };
        this.handelSearchBanner = this.handelSearchBanner.bind(this);
    }

    componentWillMount(){
        this.handelSearchBanner();
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }
    
    handelSearchBanner = () => {
        https.get(
            urls.getIndexBanner,
            {
                params:{
                    album_name:'distinctive'
                }
            },
            { withCredentials: true },
        ).then(res=>{
            if(res.data.code===0){
                this.setState({
                    isLoading: false,
                });
                let bannerList = this.state.bannerList;
                this.setState({
                    bannerList:bannerList.concat(res.data.data.album_photo)
                })
            }else{
                message.error(res.data.message);
                return false;
            }
        }).catch(err=>{
            message.error('服务器错误~')
        })
    }

    render(){
        const bannerItems = this.state.bannerList.map((item,i) => (
            <div key={i}>
                <div className="bg-img" style={{backgroundImage:'url('+item.photo_url+')'}}>
                    {item.photo_desc}
                </div>
            </div>
        ))
        return (
            <div>
                <div className="index">
                    <div className="banner">
                        <Carousel effect="scrollx" autoplay={2500} dots={false} easing="ease">
                            {bannerItems}
                        </Carousel>
                        <div className="content">
                            <h2>Record Our Story With Words.</h2>
                            <p className="autograph">流年以笑掷,未来诚可期!</p>
                            <p className="name">—— Khari & Yaru</p>
                        </div>
                    </div>
                </div>
                <IndexHeader/>
                <RecordList/>
            </div>
        )
    }
}
export default Index;