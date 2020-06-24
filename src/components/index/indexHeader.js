import React, { Component } from 'react'
import {Row,Col,Icon} from 'antd';
import {Link} from 'react-router-dom'

class IndexHeader extends Component{
    constructor(props){
        super(props);
        this.state={

        }
    }

    componentWillMount(){
        
    }
    
    render(){
        return (
            <Row className="our-info">
                <Col className="info-box" xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Link to="/articles?tag_id=&tag_name=&category_id=&owner=1">
                        <img src={require('../../assets/boy.jpg')} alt="头部"/>
                        <h3 className="name">
                            Khari
                        </h3>
                    </Link>
                    <p className="describe left">在强者的眼中，没有弱者的席位！不甘平凡，不留遗憾，在正确的道路上砥砺前行！</p>
                </Col>
                <Col className="info-box" xl={12} lg={12} md={12} sm={12} xs={12}>
                    <Link to="/articles?tag_id=&tag_name=&category_id=&owner=2">
                        <img src={require('../../assets/girl.jpg')} alt="头部"/>
                        <h3 className="name">
                            Yaru
                        </h3>
                    </Link>
                    <p className="describe right">记录每一段旅程，品味每一种生活，回忆每一份美好！流年以笑掷，未来诚可期！</p>
                </Col>
                <Icon type="heart" theme="filled" style={{ fontSize: '140px', color: '#ffc0cb' }}/>
            </Row>
        )
    }
}
export default IndexHeader;