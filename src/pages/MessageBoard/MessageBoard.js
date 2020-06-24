import React,{Component} from 'react';
import { connect } from 'react-redux';
import {message, Modal} from 'antd';
/**
 * 性能优化之froala_editor使用CDN加速  
 * froala_editor V3中如果使用小组件需要按需引入
 */
import 'froala-editor/js/plugins/emoticons.min.js';
import 'froala-editor/js/plugins/colors.min.js';
import 'froala-editor/js/plugins/link.min.js';
import FroalaEditor from 'react-froala-wysiwyg';
import './MessageBoard.less';
import MessageBoardList from './MessageBoardList';
import Loading from './../../components/loading/loading.js';
import LoadEnd from './../../components/loadEnd/loadEnd.js';
import {
	getScrollTop,
	getDocumentHeight,
	getWindowHeight
} from '../../utils/utils';

import https from './../../utils/https';
import urls from './../../utils/urls';

import { saveMessage } from '../../store/actions/message';


// @connect(state => state.message, { saveMessage })

class MessageBoard extends Component{
    constructor(props){
        super(props);
        this.state={
            emailVisible:false,
            email:'',
            isSubmitLoading:false,
            isLoading:true,
            isLoadEnd:false,
            messageBoardList:[],
            model: '',
            messageCount:0,
            pageNum:1
        }
        this.handleModelChange=this.handleModelChange.bind(this);
        this.handleAddMessageBoard=this.handleAddMessageBoard.bind(this);
        this.handleCancelComment=this.handleCancelComment.bind(this);
        this.handleSearch=this.handleSearch.bind(this);
        this.refreshMessageBoardList = this.refreshMessageBoardList.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSupplementEmailCancel = this.handleSupplementEmailCancel.bind(this);
        this.handleSupplementEmailOk = this.handleSupplementEmailOk.bind(this);
    }
    
    componentWillMount(){
        document.body.scrollTop = document.documentElement.scrollTop = 0;
    }

    componentDidMount(){
        this.handleSearch();
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

    handleModelChange = (model)=>{
        this.setState({
          model: model
        });
    }
    initConfig = () =>{
        return {
            theme:'royal',
            language: 'zh_cn',
            placeholderText:'开始输入留言信息',
            height: 200,
            // toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'insertLink','emoticons', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', 'quote', 'insertHR', 'undo', 'redo', 'clearFormatting', 'selectAll', 'html'],
            toolbarButtons: [ 'bold', 'color','insertLink', 'emoticons', 'subscript', 'superscript', 'undo', 'redo', 'selectAll'],
            toolbarButtonsXS: [ 'bold', 'color', 'insertLink', 'emoticons', 'selectAll'],
            toolbarBottom: true,
            // quickInsertButtons:['image'],
            // pluginsEnabled:['insertLink','emoticons', 'image'],
            emoticonsStep:8,
        }
    }

    /**
     * 添加留言
     */
    handleAddMessageBoard() {
        let user_id = '';
        let address = '';
		if (window.sessionStorage.userInfo) {
			let userInfo = JSON.parse(window.sessionStorage.userInfo);
            user_id = userInfo._id;
            address = userInfo.address;
		} else {
			message.warning("为了找寻您的足迹，请先登录哦~", 1);
			return;
        }
		if (!this.state.model) {
			message.warning("留言信息不能为空!", 1);
			return;
        }
		this.setState({
			isSubmitLoading: true,
		});
		https
			.post(
				urls.addMessageBoard,
				{
                    user_id,
                    address:address || 'CHINA',
					content: this.state.model,
				}
			)
			.then(res => {
				if (res.status === 200 && res.data.code === 0) {
					message.success(res.data.message, 1);
					this.setState({
						isSubmitLoading: false,
						model: '',
					});
                    this.handleSearch();
                    this.props.saveMessage(res.data.data);
				} else {
                    this.setState({
                        isSubmitLoading: false
                    });
                    if(res.data.code === 1){                    
                        message.error(res.data.message,1);
                        window.sessionStorage.userInfo = '';
                    }else{
                        this.setState({
                            emailVisible:true
                        })
                    }
				}
			})
			.catch(err => {
                this.setState({
                    isSubmitLoading: false
                });
                console.log(err);
			});
    }

    /**
     * 取消留言
     */
    handleCancelComment(){
        this.setState({
			model: ''
		});
	}

    /**
     * 查询留言列表
     */
    handleSearch = () => {
        let _this = this;
        _this.setState({
            isLoading:true
        })
        https
            .get(
                urls.getMessageBoardList,
                {
                    params:{
                        pageNum:_this.state.pageNum
                    }
                }
            ).then(res=>{
                if(res.data.data.results.length>0){
                    _this.setState({
                        isLoading:false,
                        pageNum:_this.state.pageNum+1,
                        messageCount:res.data.data.majorCount,
                        messageBoardList:_this.state.messageBoardList.concat(res.data.data.results),
                    })
                }else{
                    _this.setState({
                        isLoadEnd:true,
                        isLoading:false
                    })
                }
            }).catch(err=>{
                console.error(err);
                message.error(err)
            })
    }
    
    refreshMessageBoardList(){
		this.handleSearch();
	}

    handleInputChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	}

    handleSupplementEmailCancel(){
        this.setState({
            emailVisible:false
        })
    }

    handleSupplementEmailOk(){
        let user_id = '';
		if (window.sessionStorage.userInfo) {
			let userInfo = JSON.parse(window.sessionStorage.userInfo);
            user_id = userInfo._id;
		} else {
			message.warning("为了找寻您的足迹，请先登录哦~", 1);
			return;
        }
        let emailRegexp = new RegExp('^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9]{2,3}){1,2})$');
        if(!this.state.email){
            message.warning('请输入邮箱');
        }
        if(!emailRegexp.test(this.state.email)){
            message.warning('请输入正确的邮箱');
        }
        https.post(
            urls.updateUser,
            {
                id:user_id,
                email:this.state.email
            }
        ).then(res => {
            if(res.data.code === 0){
                this.setState({
                    emailVisible:false,
                })
                message.success(res.data.message,1)
            }else{
                message.error(res.data.message,1)
            }
        })
    }

    render(){
        return (
            <div className="message-wrap">
                {this.state.isLoading ? <Loading /> : ''}
                <div className="message-input-wrap">
                    <h5 className="title">留言</h5>
                    <p className="describe">倾听彼心,你我更亲近</p>
                    <FroalaEditor
                        config={this.initConfig()}
                        model={this.state.model}
                        onModelChange={this.handleModelChange}
                        ></FroalaEditor>
                    <div className="new-message message-send">
                        {this.state.isSubmitLoading ? (
							<button className="btn-send">发送中...</button>
						) : (
							<button onClick={this.handleAddMessageBoard} className="btn-send">留言</button>
						)}
						<button onClick={this.handleCancelComment} className="cancel">取消</button>
					</div>
                </div>
                <div className="message-board-list">
                    <MessageBoardList
                        messageCount={this.state.messageCount}
                        messageBoardList={this.state.messageBoardList}
                        refreshMessageBoardList={this.refreshMessageBoardList}
                    />
                </div>
                {this.state.isLoadEnd ? <LoadEnd /> : ''}
                <Modal
                    title='补填邮箱'
                    width={600}
                    visible={this.state.emailVisible}
                    onCancel={this.handleSupplementEmailCancel}
                    maskClosable={false}
                    footer={false}
                >
                    <div className="supplement-email-wrap">
                        <h5>请补充邮箱信息,只用作接收回复信息,不作它用,请放心填写</h5>
                        <p>暂不支持修改,请谨慎填写</p>
                        <input className="email-input" name="email" type="text" value={this.state.email} onChange={this.handleInputChange} placeholder="请输入邮箱"/>
                        {this.state.isSubmitLoading ? (
							<button className="btn-send">提交中...</button>
						) : (
							<button onClick={this.handleSupplementEmailOk} className="btn-send">立即提交</button>
						)}
                    </div> 
                </Modal>
            </div>
        )
    }
}
export default connect(
    null,
    { saveMessage }
  )(MessageBoard);