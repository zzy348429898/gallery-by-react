require('normalize.css/normalize.css');
require('styles/App.css');
require('styles/main.scss');


import React from 'react';

var imageDatas = require('../data/imageDatas.json');

//利用自执行函数，将图片名信息转成图片URL路径
imageDatas = (function genImageURL(imageDataArr){
  for(var i = 0, j = imageDataArr.length; i < j;i++){
    var singleImageData = imageDataArr[i];
    singleImageData.imageURL = require('../images/'+imageDataArr[i].fileName);

    imageDataArr[i] = singleImageData;
  }

  return imageDataArr;
})(imageDatas);

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage">
        <section className="img-sec">11
        </section>
        <nav className="controller-nav">
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
