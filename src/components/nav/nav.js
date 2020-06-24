import './index.less';
import React, { Component } from 'react';
// import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import { Layout, Icon, Menu, Row, Col, Button, Drawer, Avatar, notification } from 'antd';
import Register from '../register/register';
import Login from '../login/login';
import { isMobileOrPc } from '../../utils/utils';
import https from '../../utils/https';
import urls from '../../utils/urls';
import messageController from '../../store/stores/message';
const W3CWebSocket  = require('websocket').w3cwebsocket;
const { Header } = Layout;
const SubMenu = Menu.SubMenu;
const socketUrl = ( process.env.NODE_ENV === 'development' ) ? 'ws://localhost:3355/' : 'wss://www.qianyaru.cn:3355/';
const client = new W3CWebSocket(socketUrl,'echo-protocol');
client.onerror = function(error) {
  console.error('Connection Error:' + error);
};

client.onclose = function() {
  console.log('%c webscoket服务已关闭',"color: gray;font-weight:bold;");
};


class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items:messageController.getAll(),
      isMobile: false,
      visible: false,
      placement: 'top',
      current: null,
      menuCurrent: '',
      login: false,
      register: false,
      CategoryKeyword:'生活',
      life_id:'',
      nav: '首页',
      navTitle: '首页',
    };
    this.menuClick = this.menuClick.bind(this);
    this.showLoginModal = this.showLoginModal.bind(this);
    this.showRegisterModal = this.showRegisterModal.bind(this);
    this.handleLoginCancel = this.handleLoginCancel.bind(this);
    this.handleRegisterCancel = this.handleRegisterCancel.bind(this);
    this.initMenu = this.initMenu.bind(this);
    this.handleMenu = this.handleMenu.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.showDrawer = this.showDrawer.bind(this);
    this.onClose = this.onClose.bind(this);
    this.handleAddVisit = this.handleAddVisit.bind(this);
    this._onChange = this._onChange.bind(this);
  }
  componentDidMount() {
    if (isMobileOrPc()) {
      this.setState({
        isMobile: true,
      });
    }
    this.handleSearchCategory();
    this.initMenu(this.props.pathname);
    this.handleAddVisit();    
    client.onopen = function() {//websocket发送
      console.log('%c WebSocket Client已连接','color: green;font-weight:bold;');
    };

    client.onmessage = function(e) {//websocket接收
      if (typeof e.data === 'string') {
          let data = JSON.parse(e.data);
          notification.info({
            className:'notifi-message',
            placement:'topBottom',
            top: 40,
            message:data.user+'留下了新足迹',
            description:<div dangerouslySetInnerHTML={{__html: data.content}}></div>,
            duration:3
          });
      }
    };
    messageController.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    messageController.removeChangeListener(this._onChange);
  }

  _onChange() {
      let messageBoardArr = messageController.getAll()
      this.setState({
          items: messageBoardArr
      });
      let messageInfo = messageBoardArr[messageBoardArr.length-1];
      client.send(JSON.stringify(messageInfo));
  }

  componentDidUpdate(nextProps,nextState){
    
  }

  /**
   * 数据统计
   */
  handleAddVisit = () => {
    https.post(
      urls.addVisit,
      {
          type:'visit'
      }
    ).then(res=>{
      return res;
    }).catch(err=>{
      console.error(err);
    })
  }

  handleSearchCategory = () =>{
    https.get(
      urls.getCategoryList,
      {
        params:{
          keyword:this.state.CategoryKeyword
        }
      },
      { withCredentials: true },
    ).then(res=>{
      this.setState({
        life_id:res.data.data.list[0]._id
      })
    }).catch(err=>{
      console.error(err);
    })
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  initMenu(name) {
    let key = '1';
    let navTitle = '';
    if (name === '/') {
      key = '1';
      navTitle = '精选文章';
    } else if (name === '/home') {
      key = '1';
      navTitle = '热门文章';
    } else if (name === '/hot') {
      key = '2';
      navTitle = '热门';
    } else if (name === '/timeLine') {
      key = '3';
      navTitle = '历程';
    } else if (name === '/message') {
      key = '4';
      navTitle = '留言';
    } else if (name === '/about') {
      key = '5';
      navTitle = '关于我';
    } else if (name === '/articles') {
      key = '10';
      navTitle = '文章归档';
    }else if (name === '/articleDetail') {
      key = '6';
      navTitle = '文章详情';
    } else if (name === '/project') {
      key = '7';
      navTitle = '项目';
    }else if (name === '/photoAlbum') {
      key = '8';
      navTitle = '照片墙';
    }else if (name === '/life') {
      key = '9';
      navTitle = '生活随笔';
    }else if (name === '/links') {
      key = '11';
      navTitle = '友情链接';
    }
    
    this.setState({
      navTitle,
      menuCurrent: key,
    });
  }

  componentWillReceiveProps(nextProps) {
    // console.log('next :', nextProps);
    this.initMenu(nextProps.pathname);
  }

  handleMenu = e => {
    // console.log('click ', e);
    this.setState({
      menuCurrent: e.key,
    });
  };

  handleLogout = e => {
    // console.log('click ', e);
    this.setState({
      current: e.key,
    });
    window.sessionStorage.userInfo = '';
    this.onClose();
  };

  showLoginModal() {
    this.onClose();
    // [event.target.name]: event.target.value
    this.setState({
      login: true,
    });
  }
  showRegisterModal() {
    this.onClose();
    this.setState({
      register: true,
    });
  }
  handleLoginCancel() {
    this.setState({
      login: false,
    });
  }
  handleRegisterCancel() {
    this.setState({
      register: false,
    });
  }
  menuClick({ key }) {
    this.setState({
      nav: key,
    });
  }
  render() {
    let userInfo = '';
    if (window.sessionStorage.userInfo) {
      userInfo = JSON.parse(window.sessionStorage.userInfo);
    }
    let lifeUrl = "/life?category_id="+this.state.life_id;
    return (
      <div className="left">
        {this.state.isMobile ? (
          <Header
            className="header"
            style={{
              position: 'fixed',
              zIndex: 99,
              top: 0,
              width: '100%',
              height: '66px',
              float: 'left',
              backgroundColor: 'rgba(0,0,0,.7)',
            }}
          >
            <Row className="container">
              <Col style={{ width: '25%', float: 'left', lineHeight: '66px' }}>
                <a href="https://www.qianyaru.cn/main.html">
                  <div className="logo">
                    <img src='https://file.qianyaru.cn/logo_blog.png' alt="logo" />
                  </div>
                </a>
              </Col>
              <Col style={{ textAlign: 'center', width: '50%', float: 'left' }}>
                <div className="nav-title"> {this.state.navTitle} </div>
              </Col>
              <Col style={{ textAlign: 'right', width: '25%', float: 'left' }}>
                <div>
                  <Icon
                    type="bars"
                    onClick={this.showDrawer}
                    style={{
                      fontSize: '40px',
                      marginRight: '10px',
                      marginTop: '10px',
                    }}
                  />
                </div>
              </Col>
            </Row>
          </Header>
        ) : (
          <Header
            className="header "
            style={{
              position: 'fixed',
              zIndex: 99,
              top: 0,
              width: '100%',
              minWidth: '1200px',
              height: '66px',
              float: 'left',
              backgroundColor: 'rgba(0,0,0,.7)',
            }}
          >
            <Row className="container">
              <Col style={{ width: '160px', float: 'left' }}>
                <a href="https://www.qianyaru.cn/main.html">
                  <div className="logo ">
                    <img src='https://file.qianyaru.cn/logo_blog.png' alt="logo" />
                  </div>
                </a>
              </Col>
              <Col style={{ width: '730px', float: 'left' }}>
                <Menu
                  theme="light"
                  mode="horizontal"
                  defaultSelectedKeys={['1']}
                  onClick={this.handleMenu}
                  selectedKeys={[this.state.menuCurrent]}
                  style={{ lineHeight: '66px', borderBottom: 'none',backgroundColor:"transparent" }}
                >
                  <Menu.Item key="1">
                    <Link to="/">
                      <Icon type="home" theme="outlined" />
                      首页
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="3">
                    <Link to="/timeLine">
                      <Icon type="hourglass" theme="outlined" />
                      历程
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="10">
                    <Link to="/articles">
                      <Icon type="profile" theme="outlined" />
                      文章
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="9">
                    <Link to={lifeUrl}>
                      <Icon type="coffee" theme="outlined" />
                      生活随笔
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="8">
                    <Link to="/photoAlbum">
                      <Icon type="picture" theme="outlined" />
                      照片墙
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="4">
                    <Link to="/message">
                      <Icon type="message" theme="outlined" />
                      留言
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="11">
                    <Link to="/links">
                      <Icon type="link" theme="outlined" />
                      友链
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="5">
                    <Link to="/about">
                      <Icon type="user" theme="outlined" />
                      关于我们
                    </Link>
                  </Menu.Item>
                </Menu>
              </Col>
              <Col
                style={{ textAlign: 'right', width: '300px', float: 'left' }}
              >
                {userInfo ? (
                  <Menu
                    onClick={this.handleLogout}
                    style={{
                      width: 180,
                      lineHeight: '66px',
                      display: 'inline-block',
                      background:"none"
                    }}
                    selectedKeys={[this.state.current]}
                    mode="horizontal"
                  >
                    <SubMenu
                      title={
                        <span className="submenu-title-wrapper">
                          <Avatar size={32} src={userInfo.avatar}/> {userInfo.name}
                        </span>
                      }
                    >
                        <Menu.Item key="logout"><Icon type="logout" size={18}/>退出登录</Menu.Item>
                    </SubMenu>
                  </Menu>
                ) : (
                  <div>
                    <Button
                      type="primary"
                      icon="login"
                      style={{ marginRight: '15px' }}
                      onClick={this.showLoginModal}
                    >
                      登 录
                    </Button>
                    <Button
                      type="danger"
                      icon="logout"
                      style={{ marginRight: '15px' }}
                      onClick={this.showRegisterModal}
                    >
                      注 册
                    </Button>
                  </div>
                )}
              </Col>
            </Row>
          </Header>
        )}

        <Drawer
          placement={this.state.placement}
          closable={false}
          onClose={this.onClose}
          visible={this.state.visible}
          height={335}
        >
          <div className="drawer">
            <p onClick={this.onClose}>
              <Link to="/">
                <Icon type="home" /> 首页
              </Link>
            </p>
            <p onClick={this.onClose}>
              <Link to="/timeLine">
                <Icon type="hourglass" onClick={this.showLoginModal} /> 历程
              </Link>
            </p>
            <p onClick={this.onClose}>
              <Link to={lifeUrl}>
                <Icon type="hourglass" onClick={this.showLoginModal} /> 生活随笔
              </Link>
            </p>
            <p onClick={this.onClose}>
              <Link to="/message">
                <Icon type="message" onClick={this.showLoginModal} /> 留言
              </Link>
            </p>
            <p onClick={this.onClose}>
              <Link to="/about">
                <Icon type="user" onClick={this.showLoginModal} /> 关于我们
              </Link>
            </p>

            {userInfo ? (
              <div onClick={this.handleLogout}>
                <p>{userInfo.name}</p>
                <p>
                  <Icon type="logout" /> 退出{' '}
                </p>
              </div>
            ) : (
              <div>
                <p onClick={this.showLoginModal}>
                  <Icon type="login" /> 登录
                </p>
                <p onClick={this.showRegisterModal}>
                  <Icon type="logout" /> 注册{' '}
                </p>
              </div>
            )}
          </div>
        </Drawer>
        <Login
          visible={this.state.login}
          handleCancel={this.handleLoginCancel}
        />
        <Register
          visible={this.state.register}
          handleCancel={this.handleRegisterCancel}
        />
      </div>
    );
  }
}

export default Nav;
