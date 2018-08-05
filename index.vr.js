import React from 'react';
import {
  AppRegistry,
  asset,
  Pano,
  View,
  Mesh,
  Image,
  VrButton
} from 'react-vr';

const DEFAULT_ANIMATION_BUTTON_RADIUS = 50;
const DEFAULT_ANIMATION_BUTTON_SIZE = 0.05;

var Directions = {
  North :       [0,     -0.4,   -1],
  NorthEast :   [0.7,   -0.4,   -0.7],
  East :        [1,     -0.4,   0],
  SouthEast :   [0.7,   -0.4,   0.7],
  South :       [0,     -0.4,   1],
  SouthWest :   [-0.7,  -0.4,   0.7],
  West:         [-1,    -0.4,   0],
  NorthWest:    [-0.7,  -0.4,   -0.7]
};

var _Directions = {
  North :       [0, -0.25, -0.75],
  NorthEast :   [0.55,-0.25, -0.55],
  East :        [0.75,-0.25,0],
  SouthEast :   [0.55,-0.25,0.55],
  South :       [0, -0.25, 0.75],
  SouthWest :   [-0.55,-0.25,0.55],
  West:         [-0.75,-0.25,0],
  NorthWest:    [-0.55,-0.25,-0.55]
};

const rotate = [90,0,0];

class CampusTour extends React.Component {

  constructor (props) {
    super(props);
    //var prep = getFromDB();
    //scenes: prep; //add PG
    this.state =  {
      scenes: [{scene_image: 'Entrance.jpg', step: 1, navigations: [{step:2, translate: Directions.West, rotation: rotate },
                                                                    {step:3, translate: Directions.SouthWest, rotation: rotate },
                                                                    {step:10, translate: Directions.East, rotation: rotate }] },
               {scene_image: 'Quadrangle.jpg', step: 2, navigations: [{step:1, translate: Directions.NorthEast, rotation: rotate },
                                                                    {step:3, translate: Directions.East, rotation: rotate },
                                                                    {step:4, translate: Directions.West, rotation: rotate }]},
               {scene_image: 'Hostel.jpg', step: 3, navigations: [{step:2, translate: Directions.SouthEast, rotation: rotate },
                                                                  {step:1, translate: Directions.West, rotation: rotate }]},
               {scene_image: 'M0.jpg', step: 4, navigations: [{step:8, translate: Directions.West, rotation: rotate },
                                                              {step:5, translate: Directions.East, rotation: rotate }]},
               {scene_image: 'M2.jpg', step: 5, navigations: [{step:6, translate: Directions.NorthEast, rotation: rotate },
                                                              {step:7, translate: Directions.North, rotation: rotate },
                                                              {step:4, translate: Directions.NorthWest, rotation: rotate }]},
               {scene_image: 'M2I.jpg', step: 6, navigations: [{step:5, translate: Directions.East, rotation: rotate }]},
               {scene_image: 'M3.jpg', step: 7, navigations: [{step:5, translate: Directions.South, rotation: rotate },
                                                              {step:9, translate: Directions.West, rotation: rotate }]},
               {scene_image: 'Ground.jpg', step: 8, navigations: [{step:4, translate: Directions.NorthWest, rotation: rotate }]},
               {scene_image: 'M3I.jpg', step: 9, navigations: [{step:7, translate: Directions.North, rotation: rotate }]},
               {scene_image: 'PGEntrance.jpg', step: 10, navigations: [{step:1, translate: Directions.NorthWest, rotation: rotate },
                                                                        {step:11, translate: Directions.South, rotation: rotate }]},
               {scene_image: 'PGQuadrangle.jpg', step: 11, navigations: [{step:10, translate: Directions.NorthWest, rotation: rotate },
                                                                          {step:12, translate: Directions.West, rotation: rotate },
                                                                          {step:13, translate: Directions.SouthWest, rotation: rotate }]},
               {scene_image: 'PGCanteen.jpg', step: 12, navigations: [{step:11, translate: Directions.East, rotation: rotate }]},
               {scene_image: 'PG1.jpg', step: 13, navigations: [{step:11, translate: Directions.South, rotation: rotate }]}],
      current_scene:{},
      animationWidth: DEFAULT_ANIMATION_BUTTON_SIZE,
      animationRadius: DEFAULT_ANIMATION_BUTTON_RADIUS
      };
      this.onNavigationClick = this.onNavigationClick.bind(this);
      this.onMainWindowMessage = this.onMainWindowMessage.bind(this);
      this.animatePointer = this.animatePointer.bind(this);
      this.sceneOnLoad = this.sceneOnLoad.bind(this);
      this.sceneOnLoadEnd = this.sceneOnLoadEnd.bind(this);
  }

  componentWillMount(){
    window.addEventListener('message', this.onMainWindowMessage);
    this.setState({current_scene: this.state.scenes[0]})
  }

  componentWillUnmount(){
    if (this.frameHandle) {
       cancelAnimationFrame(this.frameHandle);
       this.frameHandle = null;
      }
  }

  componentDidMount(){
    this.animatePointer();
  }

  onMainWindowMessage(e){
      switch (e.data.type) {
        case 'newCoordinates':
          var scene_navigation = this.state.current_scene.navigations[0];
          this.state.current_scene.navigations[0]['translate'] = [e.data.coordinates.x,e.data.coordinates.y,e.data.coordinates.z]
          this.forceUpdate();
        break;
        default:
        return;
      }
  }

  onPanoInput(e){
    // if (e.nativeEvent.inputEvent.eventType === 'keydown'){
    //   this.rotatePointer(e.nativeEvent.inputEvent)
    // }
  }

  onNavigationClick(item,e){
    if(e.nativeEvent.inputEvent.eventType === "mousedown" && e.nativeEvent.inputEvent.button === 0){
      cancelAnimationFrame(this.frameHandle);
      var new_scene = this.state.scenes.find(i => i['step'] === item.step);
      this.setState({current_scene: new_scene});
      postMessage({ type: "sceneChanged"})
      this.state.animationWidth = DEFAULT_ANIMATION_BUTTON_SIZE;
      this.state.animationRadius = DEFAULT_ANIMATION_BUTTON_RADIUS;
      this.animatePointer();
    }
  }

  animatePointer(){
    var delta = this.state.animationWidth + 0.002;
    var radius = this.state.animationRadius + 10;
    if(delta >= 0.13){
      delta = DEFAULT_ANIMATION_BUTTON_SIZE;
      radius = DEFAULT_ANIMATION_BUTTON_RADIUS;
    }
    this.setState({animationWidth: delta, animationRadius: radius})
    this.frameHandle = requestAnimationFrame(this.animatePointer);
  }

  sceneOnLoad(){
    postMessage({ type: "sceneLoadStart"})
  }

  sceneOnLoadEnd(){
    postMessage({ type: "sceneLoadEnd"})
  }

  render() {
    var that = this;
    return (
      <View>
        <Pano source={asset(this.state.current_scene['scene_image'])} onInput={this.onPanoInput.bind(this)}
          onLoad={this.sceneOnLoad} onLoadEnd={this.sceneOnLoadEnd}
          style={{ transform: [{translate: [0, 0, 0]}] }}/>
        {this.state.current_scene['navigations'].map(function(item,i){
              return  <Mesh  key={i}
                            style={{
                                layoutOrigin: [0.5, 0.5],
                                transform: [{translate: item['translate']},
                                            {rotateX: item['rotation'][0]},
                                            {rotateY: item['rotation'][1]},
                                            {rotateZ: item['rotation'][2]}]
                            }}
                      onInput={ e => that.onNavigationClick(item,e)}>
                              <VrButton
                                     style={{ width: 0.15,
                                            height:0.15,
                                            borderRadius: 50,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderStyle: 'solid',
                                            borderColor: '#FFFFFF80',
                                            borderWidth: 0.01
                                     }}>
                                     <VrButton
                                            style={{ width: that.state.animationWidth,
                                                   height:that.state.animationWidth,
                                                   borderRadius: that.state.animationRadius,
                                                   backgroundColor: '#FFFFFFD9'
                                            }}>
                                     </VrButton>
                              </VrButton>
                      </Mesh>
          })}
      </View>
    );
  }
};

AppRegistry.registerComponent('CampusTour', () => CampusTour);
