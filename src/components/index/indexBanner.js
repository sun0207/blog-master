import './index.less';
import React from 'react';
import {Carousel} from 'antd';
const imgUrl = require('../../assets/img1.jpg');

class IndexBanner extends React.Component{
    constructor(props){
        super(props);
        this.state={
            default:''
        }
    }

    componentDidMount(){

    }

    render (){
        return (
            <div className="banner">
                <Carousel effect="scrollx" autoplay={2500} dots={false} easing="ease">
                    <div>
                        <div className="bg-img" style={{backgroundImage:'url('+imgUrl+')'}}>
                            背景图
                        </div>
                    </div>
                    <div>
                        <div className="bg-img" style={{backgroundImage:'url('+require('../../assets/002.jpg')+')'}}>
                            背景图
                        </div>
                    </div>
                    <div>
                        <div className="bg-img" style={{backgroundImage:'url('+require('../../assets/003.jpg')+')'}}>
                            背景图
                        </div>
                    </div>
                    <div>
                        <div className="bg-img" style={{backgroundImage:'url('+require('../../assets/004.jpg')+')'}}>
                            背景图
                        </div>
                    </div>
                </Carousel>
                <div className="content">
                    <h2>Record Our Story With Words.</h2>
                    <p className="autograph">流年以笑掷,未来诚可期!</p>
                    <p className="name">—— Khari & Yaru</p>
                </div>
            </div>
        )
    }
}
export default IndexBanner;