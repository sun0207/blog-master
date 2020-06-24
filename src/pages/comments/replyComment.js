import './replyComment.less';
import React, { Component } from 'react';
import { Modal ,message } from 'antd';
import https from '../../utils/https';
import urls from '../../utils/urls';

import FroalaEditor from 'react-froala-wysiwyg';

class Comment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoading: false,
            model: '',
			content: '',
		};
		this.handleCancelComment = this.handleCancelComment.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.handleAddOtherComment = this.handleAddOtherComment.bind(this)
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
            placeholderText:'开始输入回复内容',
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
	}

	handleCancelComment(){
        this.setState({
			model: ''
        });
        this.hideModal();
	}

    hideModal = () => {
        this.props.handleCancel();
    }

    handleAddOtherComment() {
		if (!this.props.comment_id) {
			message.warning('该父评论不存在！');
			return;
		}
		if (!this.state.model) {
			message.warning('回复内容不能为空!');
			return;
		}
		let user_id = '';
		if (window.sessionStorage.userInfo) {
			let userInfo = JSON.parse(window.sessionStorage.userInfo);
			user_id = userInfo._id;
		} else {
			message.warning('登录才能评论，请先登录！');
			return;
		}
		this.setState({
			isLoading: true,
		});
		https
			.post(
				urls.addThirdComment,
				{
					article_id: this.props.article_id,
					user_id,
					comment_id: this.props.comment_id,
					content: this.state.model,
					to_user: JSON.stringify(this.props.to_user),
				},
				{ withCredentials: true },
			)
			.then(res => {
				if (res.status === 200 && res.data.code === 0) {
					this.setState({
						model: '',
						visible: false,
						isLoading: false,
                    });
                    this.hideModal();
					this.props.refreshArticle();
				} else {
					message.error(res.data.message);
				}
			})
			.catch(err => {
				this.setState({
					visible: false,
					isLoading: false,
				});
				console.error(err);
			});
	}

	render() {
		return (
            <Modal
				title={'回复：'+this.props.to_user.name}
				style={{ top: '20%' }}
                width={800}
                visible={this.props.visible}
                onCancel={this.props.handleCancel}
				onOk={this.props.handleOk}
                maskClosable={false}
                footer={null}
			>
                <div className="comment-reply-wrap">
                    <FroalaEditor
                            config={this.initConfig()}
                            model={this.state.model}
                            onModelChange={this.handleModelChange}
                            ></FroalaEditor>
                    <div className="new-comment comment-reply-send">
                        <button onClick={this.handleCancelComment} className="cancel">取消</button>
                        {this.props.isSubmitLoading ? (
                            <button className="btn-send">发送中...</button>
                        ) : (
                            <button onClick={this.handleAddOtherComment} className="btn-send">回复</button>
                        )}
                    </div>
                </div>
            </Modal>
		);
	}
}

export default Comment;
