// require('normalize.css/normalize.css');
require('styles/main.scss');

import React from 'react';

var imageDatas = require('../data/imageDatas.json');

//利用自执行函数，将图片名信息转成图片URL路径
imageDatas = (function genImageURL(imageDataArr){
  for(var i = 0, j = imageDataArr.length; i < j;i++){
    var singleImageData = imageDataArr[i];
    singleImageData.imageURL = require('../images/'+imageDataArr[i].fileName);
    singleImageData.id = i;

    imageDataArr[i] = singleImageData;
  }

  return imageDataArr;
})(imageDatas);

//@return 计算范围为[low,high)的随机值
function getRangeRandom(low,high){

  return Math.floor(Math.random()*(high - low) + low);
}

//@return 计算范围为[-30,30)的随机角度值
function get30DegRandom(){

  return Math.floor(Math.random()*60 - 30);
}

var ImgFigure = React.createClass({

  handleClick: function(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  },

  render: function(){

    var styleObj = {};

    //如果props属性中指定了这张图片对应dom的样式，则使用
    if(this.props.arrange.pos){
      styleObj = this.props.arrange.pos;
    }

    if(this.props.arrange.rotate){
      (['MozTransform','msTransform','WebkitTransform','']).forEach(
        function(value){
          styleObj[value+'transform'] = 'rotate('+this.props.arrange.rotate+'deg)';
        }.bind(this)
      );
    }

    if(this.props.arrange.isCenter){
      styleObj.zIndex =11;
    }

    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    console.log('*************');
    console.log(this.props.data.imageURL);

    return (<figure className={imgFigureClassName} style={styleObj}
            ref={'imgFigure'+this.props.data.id} onClick={this.handleClick}>
              <img src={this.props.data.imageURL}
                   alt={this.props.data.title}
              />
              <figcaption>
                <h2 className="img-title">{this.props.data.title}</h2>
                <div className="img-back" onClick={this.handleClick}>
                  <p>
                    {this.props.data.desc}
                  </p>
              </div>
              </figcaption>
            </figure>);
  }
});

//控制组件
var ControllerUnits = React.createClass({
  handleClick: function(e){

    if(this.props.arrange.isCenter){
      this.props.inverse();
    }else{
      this.props.center();
    }
    e.preventDefault;
    e.stopPropagation;
  },

  render: function(){
    var className = 'controller-unit';
    if(this.props.arrange.isCenter){
      className += ' is-center';
      if(this.props.arrange.isInverse){
        className += ' is-inverse';
      }
    }
    return (
      <span className={className} onClick={this.handleClick}></span>
      );
  }
});

var GalleryByReactApp = React.createClass({
  Constant: {
    centerPos:{
      left: 0,
      top: 0
    },
    hPosRange: {
      leftSecX: [0,0],
      rightSecX: [0,0],
      topSecX: [0,0]
    },
    vPosRange: {
      leftSecY: [0,0],
      rightSecY: [0,0],
      topSecY: [0,0]
    }
  },

  /*
  翻转图片
  @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
  @return {Function} 这是一个闭包函数，期内return一个真正待被执行的函数
  */
  inverse: function(index){
    return function(){
      var imgsArrangeArr = this.state.imgsArrangeArr;

      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

      this.setState({
        imgsArrangeArr: imgsArrangeArr
      });
    }.bind(this);
  },
  /*
  利用 rearrange 函数，居中对应index的图片
  @param index， 需要被居中的图片对应的图片信息的数组的index值
  */
  center: function(index){
    return function(){
      this.rearrange(index);
    }.bind(this);
  },

  //重新排布图片位置
  // @param centerIndex 指定居中图片的index
  rearrange: function(centerIndex){
    var imgsArrangeArr = this.state.imgsArrangeArr;
    var Constant = this.Constant;
    var centerPos = Constant.centerPos;
    var hPosRangeLeftSec = Constant.hPosRange.leftSecX;
    var vPosRangeLeftSec = Constant.vPosRange.leftSecY;
    var hPosRangeRightSec = Constant.hPosRange.rightSecX;
    // var vPosRangeRightSec = Constant.vPosRange.rightSecY;
    var hPosRangeTopSec = Constant.hPosRange.topSecX;
    var vPosRangeTopSec = Constant.vPosRange.topSecY;

    var imgsArrangeTopArr = [];
    var topImgNum = Math.floor(Math.random()*2);//上区域图片数量为零个或者一个

    var topImgSpliceIndex = 0;

    var imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);

    //首先居中 centerIndex 的图片,居中图片不需要旋转
    imgsArrangeCenterArr[0].pos = centerPos;
    imgsArrangeCenterArr[0].rotate = 0;
    imgsArrangeCenterArr[0].isCenter = true;

    //取出要布局上册的图片的状态信息
    topImgSpliceIndex = Math.floor(Math.random()*(imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

    //布局位于上区域的图片
    imgsArrangeTopArr.forEach(function(value,index){
      imgsArrangeTopArr[index].pos = {
        top: getRangeRandom(vPosRangeTopSec[0],vPosRangeTopSec[1]),
        left: getRangeRandom(hPosRangeTopSec[0],hPosRangeTopSec[1])
      };
      imgsArrangeArr[index].rotate = get30DegRandom();
      imgsArrangeArr[index].isCenter = false;
    });

    //布局位于左右侧的图片
    for(var i = 0, j = imgsArrangeArr.length, k = j /2; i < j; i++){
      var hPosRange = null;

      if(i<k){
        hPosRange = hPosRangeLeftSec;
      }else{
        hPosRange = hPosRangeRightSec;
      }

      imgsArrangeArr[i].pos = {
        top: getRangeRandom(vPosRangeLeftSec[0], vPosRangeLeftSec[1]),
        left: getRangeRandom(hPosRange[0],hPosRange[1])
      };
      imgsArrangeArr[i].rotate = get30DegRandom();
      imgsArrangeArr[i].isCenter = false;
    }
    //将上册区域图片状态信息插入回数组
    if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0 ,imgsArrangeCenterArr[0]);
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    })
  },

  // 初始化state
  getInitialState: function(){
    return {
      imgsArrangeArr:[
/*        {
          pos: {
            left: 0,
            top: 0
          }，
          rotate: 0,
          isInverse: false,
          isCenter: false
        }*/
      ]
    };
  },
  // 组件家在以后，为每张图片计算其位一直的范围
  componentDidMount: function() {
    // 首先拿到舞台的大小
    var stageDOM = this.refs.stage;
    var stageW = stageDOM.scrollWidth;
    var stageH = stageDOM.scrollHeight;
    var halfStageW = Math.ceil(stageW / 2);
    var halfStageH = Math.ceil(stageH / 2);

    // 拿到一个imageFigure的大小
    var imgFigureDOM = this.refs.imgFigure0.refs.imgFigure0;
    var imgW = imgFigureDOM.scrollWidth;
    var imgH = imgFigureDOM.scrollHeight;
    var halfImgW = Math.ceil(imgW / 2);
    var halfImgH = Math.ceil(imgH / 2);

    // 计算中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };
    // 计算各区域图片位置的取值范围
    this.Constant.hPosRange.leftSecX = [-halfImgW, halfStageW - halfImgW*3];
    this.Constant.hPosRange.rightSecX = [halfStageW + halfImgW, stageW - halfImgW];
    this.Constant.hPosRange.topSecX = [halfStageW - halfImgW*2, halfStageW];
    this.Constant.vPosRange.leftSecY = [-halfImgH, stageH - halfImgH];
    this.Constant.vPosRange.rightSecY = [-halfImgH, stageH - halfImgH];
    this.Constant.vPosRange.topSecY = [-halfImgH, halfStageH - halfImgH*3];
    this.rearrange(0);
  },

  render: function() {
    var controllerUnits = [],
        imgFigures = [];

    imageDatas.forEach(function(value,index){

      if(!this.state.imgsArrangeArr[index]){
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: 0,
            top: 0
          },
          rotate: 0,
          isInverse: false,
          isCenter: false
        }
      }

      imgFigures.push(
        <ImgFigure data = {value} key={'imgFigure'+index}
        ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]}
        inverse={this.inverse(index)} center={this.center(index)}
        />
      );

      controllerUnits.push(
        <ControllerUnits data = {value} key={'controllerNav'+index}
        ref={'controllerNav'+index} arrange={this.state.imgsArrangeArr[index]}
        inverse={this.inverse(index)} center={this.center(index)}
        />
      );

    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
})

GalleryByReactApp.defaultProps = {
};

export default GalleryByReactApp;
