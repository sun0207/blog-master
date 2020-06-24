import './index.less';
import './mobile.less';
import React, { Component } from 'react';
import SliderRight from '../components/slider/index';
import Nav from '../components/nav/nav';
import FooterBar from '../components/footer/footer';
import { Layout, BackTop,Icon } from 'antd';
import MusicPlear from '../components/music'
import { isMobileOrPc } from '../utils/utils';
const { Content, Sider } = Layout;
class Layouts extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isShowSlider: false,
		};
	}
	componentDidMount() {}
	render() {
		let isShowSlider = false;
		let isShowFooter = false;
		let pathName = this.props.location.pathname;
		if (pathName !== '/' && pathName !== '/about' && pathName!=='/photoAlbum' && pathName!=='/message' && pathName!=='/links' && !isMobileOrPc()) {
			isShowSlider = true;
		}
		if ( pathName!=='/photoAlbum' && !isMobileOrPc()) {
			isShowFooter = true;
		}
		return (
			<div className="Layouts">
				<Nav pathname={this.props.location.pathname} />
				<Layout className="layout">
					<Content>
						<Layout style={{ padding: '0 0 24px 0'}}>
							<Content style={{ minHeight: '80vh' }}>{this.props.children}</Content>
							{!isShowSlider ? (
								''
							) : (
								<Sider width={350} style={{marginLeft:"12px",marginTop:"24px"}}>
									<SliderRight />
								</Sider>
							)}
						</Layout>
					</Content>
				</Layout>
				{!isShowFooter?(
					''
				):(
					<FooterBar></FooterBar>
				)}
				<BackTop visibilityHeight={100}>
					<Icon type="up-circle"  theme="outlined" style={{ fontSize: '40px', color: '#bfbfbf' }} />
				</BackTop>
				<MusicPlear/>
			</div>
		);
	}
}

export default Layouts;
