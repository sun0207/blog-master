import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import {Icon,Slider} from 'antd';
import Duration from './Duration';
import './index.less';
const musicUrlArr = [
    {
        url:'http://music.163.com/song/media/outer/url?id=385965.mp3',
        musicName:"知足",
        musicImg:"https://p2.music.126.net/_B1Fn_Z1WxHzqGLzLZDf-w==/109951163263882447.jpg?param=34y34",
        musicSinger:"( 五月天 )",
    },
    {
        url:'http://music.163.com/song/media/outer/url?id=386005.mp3',
        musicName:"倔强",
        musicImg:"https://p2.music.126.net/y90N3N2MabHpEThV0iFk9w==/109951164912216490.jpg?param=34y34",
        musicSinger:"( 五月天 )",
    },
    {
        url:'http://music.163.com/song/media/outer/url?id=467952048.mp3',
        musicName:"男孩(Live)",
        musicImg:"https://p3fx.kgimg.com/stdmusic/20170516/20170516174505104261.jpg",
        musicSinger:"( 梁博 )",
    },
    {
        url:'http://music.163.com/song/media/outer/url?id=413812448.mp3',
        musicName:"大鱼(Live)",
        musicImg:"https://p3fx.kgimg.com/stdmusic/20160520/20160520095519555110.jpg",
        musicSinger:"( 周深 )",
    },
    {
        url:'http://music.163.com/song/media/outer/url?id=29567193.mp3',
        musicName:"我们的时光",
        musicImg:"https://p3fx.kgimg.com/stdmusic/20150718/20150718023139930374.jpg",
        musicSinger:"( 赵雷 )",
    },
    {
        url:'http://music.163.com/song/media/outer/url?id=29567189.mp3',
        musicName:"理想",
        musicImg:"https://p3fx.kgimg.com/stdmusic/20150718/20150718023139930374.jpg",
        musicSinger:"( 赵雷 )",
    }
]


class MusicPlear extends Component{

    state = {
        prevIndex:0,
        nextIndex:0,
        active:true,
        voiceActive:false,
        url: null,
        pip: false,
        playing: false,
        controls: false,
        light: false,
        currentVolume:0,
        volume: 1,
        muted: false,
        played: 0,
        loaded: 0,
        duration: 0,
        playbackRate: 1.0,
        loop: false,
        musicInfo:{
            musicName:"",
            musicImg:"",
            musicSinger:"",
        }
    }

    componentWillMount(){
        const index = this.state.nextIndex;

        this.load(musicUrlArr[index].url);
        this.setState({
            prevIndex:index-1<0?(musicUrlArr.length-1):(index-1),
            nextIndex:index+1>(musicUrlArr.length-1)?0:(index+1),
            musicInfo:{
                musicName:musicUrlArr[index].musicName,
                musicImg:musicUrlArr[index].musicImg,
                musicSinger:musicUrlArr[index].musicSinger,
            }
        })
    }
    toggleModule = () =>{
        this.setState({ active: !this.state.active })
    }
    load = url => {
        this.setState({
          url,
          played: 0,
          loaded: 0,
          pip: false
        })
    }
    prevMusic = () =>{
        const index = this.state.prevIndex;
        this.load(musicUrlArr[index].url);
        this.setState({
            prevIndex:index-1<0?(musicUrlArr.length-1):(index-1),
            nextIndex:index+1>(musicUrlArr.length-1)?0:(index+1),
            musicInfo:{
                musicName:musicUrlArr[index].musicName,
                musicImg:musicUrlArr[index].musicImg,
                musicSinger:musicUrlArr[index].musicSinger,
            }
        })
        if(!this.state.playing){
            this.setState({
                playing:true
            })
        }
    }
    nextMusic = () =>{
        const index = this.state.nextIndex;
        this.load(musicUrlArr[index].url);
        this.setState({
            prevIndex:index-1<0?(musicUrlArr.length-1):(index-1),
            nextIndex:index+1>(musicUrlArr.length-1)?0:(index+1),
            musicInfo:{
                musicName:musicUrlArr[index].musicName,
                musicImg:musicUrlArr[index].musicImg,
                musicSinger:musicUrlArr[index].musicSinger,
            }
        })
        if(!this.state.playing){
            this.setState({
                playing:true
            })
        }
    }
    playPause = () => {
        this.setState({ playing: !this.state.playing })
    }
    toggleControls = () => {
        const url = this.state.url
        this.setState({
            controls: !this.state.controls,
            url: null
        }, () => this.load(url))
    }
    toggleMuted = () => {
        if(this.state.volume!==0){
            this.setState({
                currentVolume:this.state.volume,
            }) 
        }
        this.setState({ 
            muted: !this.state.muted,
            volume:this.state.volume===0?this.state.currentVolume : 0,
        })
    }
    onProgress = state => {
        if (!this.state.seeking) {
          this.setState(state)
        }
    }
    onDuration = (duration) => {
        this.setState({ duration })
    }
    onSeekChange = (value) => {
        this.setState({ played: parseFloat(value/100) })
    }
    onAfterChange = (value) =>{
        this.setState({ seeking: false })
        this.player.seekTo(parseFloat(value/100))
    }
    onEnded = () => {
        const index = this.state.nextIndex;
        this.load(musicUrlArr[index].url);
        this.setState({
            prevIndex:index-1<0?(musicUrlArr.length-1):(index-1),
            nextIndex:index+1>(musicUrlArr.length-1)?0:(index+1),
            musicInfo:{
                musicName:musicUrlArr[index].musicName,
                musicImg:musicUrlArr[index].musicImg,
                musicSinger:musicUrlArr[index].musicSinger,
            }
        })
        console.log(musicUrlArr[index].url)
    }
    formatter = (value) => {
        return `${value}%`;
    }
    adjustVolumeChange = (value) =>{
        this.setState({
            volume:value,
            currentVolume:value
        })
    }
    adjustVolume = (value) =>{
        this.setState({
            volume:value
        })
    }
    onDownload = url =>{
        
    }
    ref = player => {
        this.player = player;
    }
    render(){
        const {active,voiceActive , url, playing, light, volume, muted, played, duration, playbackRate, musicInfo } = this.state;
        const svgUrl = volume===0?require("../../assets/svg/mute.svg"):volume<=.5?require("../../assets/svg/voice_two.svg"):require("../../assets/svg/voice_three.svg")
        return (
            <div className={active?"controls-box active":"controls-box"}>
                <Icon onClick={this.toggleModule} className="music-up" type={active?"down-circle":"up-circle"} theme="outlined" style={{fontSize:"20px",color:"#ff57a0",position:"absolute",top:'-15px',right:'50px',cursor:"pointer"}}/>
                <div className="module-bg"></div>
                <div className="player-module">
                    <ReactPlayer
                        ref={this.ref}
                        url={url} 
                        playing={playing}
                        width={0} 
                        height={0}
                        light={light}
                        playbackRate={playbackRate}
                        volume={volume}
                        muted={muted}
                        onEnded={this.onEnded}
                        onSeek={e => console.log('onSeek', e)}
                        onProgress={this.onProgress}
                        onDuration={this.onDuration}
                        />
                    <div className="play-controls">
                        <Icon onClick={this.prevMusic} type="backward" theme="outlined" style={{fontSize:"20px",color:"#ffffff",cursor:"pointer"}}/>
                        <Icon onClick={this.playPause} type={playing?"pause-circle":"play-circle"} theme="outlined" style={{fontSize:"30px",color:"#ffffff",margin:"0 20px 0 20px",cursor:"pointer"}}/>
                        <Icon onClick={this.nextMusic} type="forward" theme="outlined" style={{fontSize:"20px",color:"#ffffff",cursor:"pointer"}}/>
                    </div>
                    <div className="slide-controls">
                        <img src={musicInfo.musicImg} alt="暂无"/>
                        <div>
                            <div>
                                <span>{musicInfo.musicName} {musicInfo.musicSinger}</span>
                                <span><Duration seconds={duration * played} /> / <Duration seconds={duration} /></span>
                            </div>
                            <Slider 
                                value={Number(played)===0?0:Number((played*100).toFixed(3))} 
                                min={0} 
                                max={100} 
                                onChange={this.onSeekChange} 
                                onAfterChange={this.onAfterChange} 
                                tipFormatter={null}
                                />
                        </div>
                    </div>
                    <div className="voice-controls">
                        <div
                            onMouseEnter={()=>{this.setState({voiceActive:true})}} 
                            onMouseLeave={()=>{this.setState({voiceActive:false})}} 
                            style={{position:"relative",height:"100%",display:"flex",alignItems:"center"}}>
                            <img 
                                onClick={this.toggleMuted} 
                                src={svgUrl} 
                                style={{width:"20px",height:"20px",cursor:"pointer"}}
                                alt="暂无"
                                />
                            <div className={voiceActive?"volume-controls active":'volume-controls'}>
                                <Slider
                                    vertical 
                                    max={1} 
                                    step={0.01} 
                                    value = {volume}
                                    tipFormatter={null}
                                    onChange={this.adjustVolumeChange} 
                                    style={{padding:"0 0 0 0"}}
                                    />
                            </div>
                        </div>
                        <a href={url} download={musicInfo.musicName+".mp3"}>
                            <Icon onClick={this.onDownload} type="download" theme="outlined" style={{fontSize:"20px",color:"#c4c3c3",cursor:"pointer"}}/>
                        </a>
                    </div>
                    <ul className="music-list"></ul>
                </div>
                <div className="put-on-record">
                    版权所有© 2019-2020 Khari & Yaru的美好回忆 · <a target="_blank" rel="noopener noreferrer" href="http://www.beian.miit.gov.cn">ICP备案号：浙ICP备19049218号-1</a>
                </div>
            </div>
        )
    }
}
export default MusicPlear;