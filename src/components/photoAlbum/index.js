import './index.less';
import React, { Component } from 'react';
import m3D from './3D';
import { message, Spin } from 'antd';
import https from '../../utils/https';
import urls from '../../utils/urls';

class photoAlbum extends Component{
    constructor(props){
        super(props);
        this.state = {
			isLoading: true,
            timer:null,
            albumList:[],
            albumIndex:0,
        };
        this.initPhotoAlbum = this.initPhotoAlbum.bind(this);
        this.handelSearchAlbum = this.handelSearchAlbum.bind(this);
    }
    
    componentWillMount(){
        this.handelSearchAlbum();
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    componentDidMount(){
        this.initPhotoAlbum(0);
    }

    componentWillUnmount(){
        if(this.timer){
		    clearTimeout(this.timer)
        }
	}

    handelSearchAlbum = () => {
        https.get(
            urls.getAlbum,
            {
                params:{
                    
                }
            },
            { withCredentials: true },
        ).then(res=>{
            if(res.data.code===0){
                this.setState({
                    isLoading: false,
                });
                let albumList = this.state.albumList;
                this.setState({
                    albumList:albumList.concat(res.data.data)
                });
            }else{
                message.error(res.data.message)
                return false;
            }
        }).catch(err=>{
            message.error('服务器错误~')
        })
    }

    initPhotoAlbum = (i) => {
        let _this = this;
        _this.setState({
            isLoading: true,
            albumIndex: i || 0
        });
        _this.timer = setTimeout(()=>{
            clearTimeout(_this.timer);
            _this.setState({
                timer: null,
            });
            const screen = document.getElementById("screen");

            const bar = document.getElementById("bar");

            const urlInfo = document.getElementById("urlInfo");

            let imgData = [];
            if(this.state.albumList.length>0){
                imgData = this.state.albumList[i].album_photo;
                if(i===0){
                    const defaultData = [
                        {
                            photo_url:require('../../assets/index_banner.jpg')
                        },
                        {
                            photo_url:require('../../assets/000.jpg')
                        },
                        {
                            photo_url:require('../../assets/007.jpg')
                        },
                        {
                            photo_url:require('../../assets/012.jpg')
                        },
                        {
                            photo_url:require('../../assets/IMG_20190406_124144.jpg')
                        },
                        {
                            photo_url:require('../../assets/IMG_20190406_154239.jpg')
                        },
                        {
                            photo_url:require('../../assets/IMG_20190406_141749.jpg')
                        },
                        {
                            photo_url:require('../../assets/IMG_20190407_082641_BURST002.jpg')
                        },
                        {
                            photo_url:require('../../assets/IMG_20190406_113851.jpg')
                        },
                    ];
                    imgData = imgData.concat(defaultData)
                }
            }else{
                imgData = this.state.albumList[i].album_photo
            }
            m3D.destroy(screen,bar,function(){
                m3D.init(screen,bar,urlInfo,imgData);
                _this.setState({
                    isLoading: false,
                });
            });
        },1000)
    }

    render(){
        const albumItem = this.state.albumList.map((item,i)=>(
            <li className={this.state.albumIndex === i ? 'active' : ''} key={i} title={item.desc} onClick={(e) => this.initPhotoAlbum(i)}>
                {item.album_name}
            </li>
        ))
        const style = {
			zIndex:'99999',
			position:'absolute',
			top:'50%',
			left:'50%',
			color: '#999',
			textAlign: 'center',
			padding: 50,
			fontSize: 16,
			transform:'translate(-50%,-50%)'
		};
        return (
            <div className="photo-album">
                <div id="screen">
                    <div id="bar"></div>
				    {this.state.isLoading ? 
                        <div style={style}>
                            <Spin size="large" tip="加载中..."/>
                        </div> : ''
                    }    
                    <ul className="album-list">
                        {albumItem}
                    </ul>
                </div>
                <div id="urlInfo"></div>
            </div>
        )
    }
}
export default photoAlbum;