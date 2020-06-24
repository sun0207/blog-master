import './comment.less';
import React, { Component } from 'react';
import { Avatar } from 'antd';
import FroalaEditor from 'react-froala-wysiwyg';
import 'froala-editor/js/plugins/emoticons.min.js';
import 'froala-editor/js/plugins/colors.min.js';
import 'froala-editor/js/plugins/link.min.js';

class Comment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
            model: '',
			content: '',
		};
		this.handleCancelComment = this.handleCancelComment.bind(this);
	}

	componentDidMount() {
		this.props.childRef(this)
	}

	initModel = () =>{
		if(this.state.model !== ''){	
			this.setState({
				model:''
			})
		}
	}

	initConfig = () =>{
        return {
            theme:'royal',
            language: 'zh_cn',
            placeholderText:'开始输入评论内容',
            height: 160,
            toolbarButtons: [ 'bold', 'color','insertLink', 'emoticons', 'subscript', 'superscript', 'undo', 'redo', 'selectAll'],
			toolbarButtonsXS: [ 'bold', 'color', 'insertLink', 'emoticons', 'selectAll'],
			toolbarBottom: true,
			emoticonsStep:8,
			emoticonsUseImage:true
        }
    }

	handleModelChange = (model)=>{
        this.setState({
		  model: model
		});
		this.props.handleChange(model)
	}

	handleCancelComment(){
        this.setState({
			model: ''
		});
	}

	render() {
		let userInfo = {
			name: '',
		};
		if (window.sessionStorage.userInfo) {
			userInfo = JSON.parse(window.sessionStorage.userInfo);
		}
		return (
			<div className="comment-wrap">
				<span className="avatar">
					<Avatar className="auth-logo" size={50} src={userInfo.avatar} />
				</span>
				<div>
					
					{userInfo.name?
						(
							<h3>{userInfo.name}</h3>
						):(
							<h3>当前未登录</h3>						)
					}
					{/* <TextArea
						className="textarea"
						name="content"
						value={this.props.content}
						onChange={this.props.handleChange}
						placeholder="文明社会，理性评论..."
						rows={4}
					/> */}
					<FroalaEditor
							config={this.initConfig()}
							model={this.state.model}
							onModelChange={this.handleModelChange}
							></FroalaEditor>

					<div className="new-comment comment-send">
						<button onClick={this.handleCancelComment} className="cancel">取消</button>
						{this.props.isSubmitLoading ? (
							<button className="btn-send">发送中...</button>
						) : (
							<button onClick={this.props.handleAddComment} className="btn-send">评论</button>
						)}
					</div>
				</div>
			</div>
		);
	}
}

export default Comment;
