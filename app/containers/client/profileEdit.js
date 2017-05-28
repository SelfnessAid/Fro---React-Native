import React from 'react';
import {PropTypes} from "react";
import {StyleSheet, Text, View, ScrollView, ListView, TextInput, Image, TouchableOpacity, Dimensions, Platform} from "react-native";
import Button from 'react-native-button';
import { Actions as NavigationActions } from 'react-native-router-flux'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../../actions';

import Styles from '../../styles/hairSignupStyles'

import Modal from 'react-native-modalbox';

import DatePicker from 'react-native-datepicker'
import ImagePicker from 'react-native-image-crop-picker';
import RadioButton from 'radio-button-react-native';

const gender = [
  {label: 'Male', value: 'M' },
  {label: 'Female', value: 'F' },
  {label: 'Other', value: 'O' }
]
const language = [
  {label: 'English', value: 'en' },
  {label: 'Français', value: 'fr' }
]

class profileEdit extends React.Component {
    constructor(props) {
        super(props);
        this._getUser();

        const rowHasChanged = (r1, r2) => r1 !== r2
        const ds = new ListView.DataSource({rowHasChanged})

        this.state = {
          date:"2014-08-22",
          open: false,
          sub_open: false,
          modal_state: 0,
          sub_modal_state: 0,
          f_name: "David",
          l_name: "L'Heureux",
          image: require('../../img/david1.jpeg'),
          gender_dataSource: ds.cloneWithRows(gender),
          gender: 'M',
          lan_dataSource: ds.cloneWithRows(language),
          language: 'en',
          about: "About me",
          school: '',
          work: '',
          email: 'don_david_l@hotmail.com',
          phone: '+1(514) 449-4366'
        }
    }
  
    _getUser() {
      const { auth } = this.props;
      this.props.fetchUser(auth.user._id, auth.token).then(() => {
        const { api } = this.props;
        console.log("-------------User Info----------");
        console.log(api.user);
        console.log("-------------User End----------");
        this.setState({
          f_name: api.user.firstName,
          l_name: api.user.lastName,   
          about: api.user.description != null ? api.user.description : "About me",
          gender: api.user.gender != null ? api.user.gender : 'M',
          date: api.user.birthdate != null ? api.user.birthdate : "2014-08-22",
          language: api.user.language != null ? api.user.language : 'en',
          school: api.user.school != null ? api.user.school : '',
          work: api.user.work != null ? api.user.work : '',
          email: api.user.email != null ? api.user.email : 'don_david_l@hotmail.com',
          phone: api.user.phoneNumber != null ? api.user.phoneNumber : '+1(514) 449-4366'
        });
      });
    }

    _updateUser() {
      this.state.modal_state == 2 ? this.setState({open: false, sub_open: true, sub_modal_state: 1}) : this.setState({open: false})
      const { auth } = this.props;
      if (this.state.modal_state == 0) {
        this.props.editUserName(auth.token, this.state.f_name, this.state.l_name).then(() => {
          const { api } = this.props;
        });
      } else if (this.state.modal_state == 1){
        this.props.editUserDescription(auth.token, this.state.about).then(() => {
          const { api } = this.props;
        });
      } else if (this.state.modal_state == 3){
        this.props.editUserPhoneNumber(auth.token, this.state.phone).then(()=>{
          const { api } = this.props;
        });
      } else if (this.state.modal_state == 4){
        this.props.editUserSchool(auth.token, this.state.school).then(() => {
          const { api } = this.props;
        });
      } else if (this.state.modal_state == 5) {
        this.props.editUserWork(auth.token, this.state.work).then(() => {
          const { api } = this.props;
        });
      }
    }

    _updateUserEmail() {
      this.setState({sub_open: false});
      const { auth } = this.props;
      this.props.editUserEmail(auth.token, this.state.email).then(()=>{
        const { api } = this.props;
      });
    }

    _updateUserBirthDay(date) {
      this.setState({date: date})
      const { auth } = this.props;
      this.props.editUserBirthDay(auth.token, date).then(() => {
        const { api } = this.props;
      });
    }
  
    _setData() {
      this.setState({
        f_name: "David",
        l_name: "L'Heureux",
      });
    }

    setFirstName(event) {
      let f_name = event.nativeEvent.text;
      this.setState({f_name})
    }
    setLastName(event) {
      let l_name = event.nativeEvent.text;
      this.setState({l_name})
    }
    setAbout(event) {
      let about = event.nativeEvent.text;
      this.setState({about})
    }
    setSchool(event) {
      let school = event.nativeEvent.text;
      this.setState({school})
    }
    setWork(event) {
      let work = event.nativeEvent.text;
      this.setState({work})
    }
    setEmail(event) {
      let email = event.nativeEvent.text;
      this.setState({email})
    }
    setPhone(event) {
      let phone = event.nativeEvent.text;
      this.setState({phone})
    }
    takePhoto(){
      this.setState({sub_open: false})
      ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true
      }).then(image => {
        let source = {uri: image.path};
        this.setState({image:source});
      }).catch(e => {
        console.log(e);
      });
    }
    chooseImage(){
      this.setState({sub_open: false})
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true
      }).then(image => {
        let source = {uri: image.path};
        this.setState({image:source});
      }).catch(e => {
        console.log(e);
      });
    }

    genderPress(value){
      this.setState({sub_open: false, gender: value})
      const { auth } = this.props;
      this.props.editUserGender(auth.token, value).then(() => {
        const { api } = this.props;
      });
    }
    gender_renderRow (rowData) {
      return (
        <TouchableOpacity  onPress={() => this.genderPress(rowData.value)} >
          <View style={styles.private_sub_view}>
            <Text style={styles.private_text}>{rowData.label}</Text>
            <View  style={styles.right_arrow}>
              <RadioButton currentValue={this.state.gender} value={rowData.value} onPress={() => this.genderPress(rowData.value)} outerCircleColor='#f26c4f' outerCircleSize={18} outerCircleWidth={2} innerCircleColor='#f26c4f' innerCircleSize={10}/>
            </View>
          </View>
        </TouchableOpacity>
      )
    }

    languagePress(value){
      this.setState({sub_open: false, language: value})
      const { auth } = this.props;
      this.props.editUserLanguage(auth.token, value).then(() => {
        const { api } = this.props;
      });
    }

    lan_renderRow (rowData) {
      return (
        <TouchableOpacity  onPress={() => this.languagePress(rowData.value)} >
          <View style={styles.private_sub_view}>
            <Text style={styles.private_text}>{rowData.label}</Text>
            <View  style={styles.right_arrow}>
              <RadioButton currentValue={this.state.language} value={rowData.value} onPress={() => this.languagePress(rowData.value)} outerCircleColor='#f26c4f' outerCircleSize={18} outerCircleWidth={2} innerCircleColor='#f26c4f' innerCircleSize={10}/>
            </View>
          </View>
        </TouchableOpacity>
      )
    }

    render() {
        return (
          <View style={styles.container}>
            <View style={styles.navBar}>
              <TouchableOpacity  style={{width: 50, alignSelf: 'center', padding: 15, marginTop: 15}} onPress={NavigationActions.pop}>
                <Image source={require('../../img/back_white.png')}  style={{width: 15,height: 15}}/>
              </TouchableOpacity>
              <Text style={{fontFamily: 'Montserrat', fontSize: 20, color: 'white', textAlign: 'center', width: Dimensions.get('window').width - 95, marginTop: 25}}>Profile</Text>
            </View>
            <ScrollView style={{flexDirection:'column', backgroundColor: '#f1f0f0'}}>
              <Image source={this.state.image} style={{width: Dimensions.get('window').width, height: Dimensions.get('window').width*3/5}}>
                <TouchableOpacity  style={styles.photo_view} onPress={() => this.setState({sub_open: true, sub_modal_state: 0})}>
                  <Image source={require('../../img/camera.png')} style={{width: 25, height: 25}}/>
                </TouchableOpacity>
              </Image>
              <View style={{flexDirection:'column', width: Dimensions.get('window').width - 30, alignSelf: 'center', alignItems: 'center', height: 70, borderBottomWidth: 0.2}}>
                <Text style={{fontFamily: 'Montserrat', width:Dimensions.get('window').width - 30, fontSize: 24, marginTop:5, textAlign: 'center',height: 40, alignSelf: 'center'}}>{this.state.f_name + ' ' + this.state.l_name}</Text>
                <TouchableOpacity onPress={() => this.setState({open: true, modal_state: 0})}>
                  <Text style={styles.edit_text}>Edit name</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection:'column', width: Dimensions.get('window').width - 30, alignSelf: 'center', alignItems: 'center', height: 100, borderBottomWidth: 0.2}}>
                <Text style={{fontFamily: 'Montserrat', width:Dimensions.get('window').width - 30, fontSize: 12, marginTop:5, textAlign: 'left', height: 70}}>{this.state.about}</Text>
                <TouchableOpacity onPress={() => this.setState({open: true, modal_state: 1, about: ''})}>
                  <Text style={styles.edit_text}>Edit about me</Text>
                </TouchableOpacity>
              </View>
              <Text style={{fontFamily: 'Montserrat', fontSize: 12, marginTop: 30, alignSelf: 'center', textAlign: 'center'}}>Private Details</Text>
              <View style={styles.private_details}>
                <View style={styles.private_sub_view}>
                  <Text style={styles.private_text}>Gender</Text>
                  <TouchableOpacity  style={styles.right_arrow} onPress={() => this.setState({sub_open: true, sub_modal_state: 2})}>
                    <Text style={styles.edit_text}>{gender.find(item=>item.value==this.state.gender).label}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.private_sub_view}>
                  <Text style={styles.private_text}>Birth Date</Text>
                  <DatePicker
                    style={{position: "absolute", right: -35}}
                    date={this.state.date}
                    showIcon={false}
                    customStyles={{
                      dateInput: {
                        borderWidth: 0,
                      },
                      dateText: {
                          color: '#f26c4f',
                          fontSize: 12
                      },
                    }}
                    mode="date"
                    format="YYYY-MM-DD"
                    confirmBtnText="OKAY"
                    cancelBtnText="CANCEL"
                    onDateChange={(date) => this._updateUserBirthDay(date)}
                  />
                </View>
                <View style={styles.private_sub_view}>
                  <Text style={styles.private_text}>Email</Text>
                  <TouchableOpacity  style={styles.right_arrow} onPress={() => this.setState({open: true, modal_state: 2})}>
                    <Text style={styles.edit_text}>{this.state.email}</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.private_sub_view}>
                  <Text style={styles.private_text}>Phone</Text>
                  <TouchableOpacity  style={styles.right_arrow} onPress={() => this.setState({open: true, modal_state: 3})}>
                    <Text style={styles.edit_text}>{this.state.phone}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row',width: Dimensions.get('window').width - 60,alignSelf: 'center',height: 40,}} >
                  <Text style={styles.private_text}>Location</Text>
                  <TouchableOpacity  style={styles.right_arrow} onPress={this.props.press}>
                    <Image source={require('../../img/right-arrow.png')}  style={{width: 15,height: 15}}/>
                  </TouchableOpacity>
                </View>
              </View>


              <Text style={{fontFamily: 'Montserrat', fontSize: 12, marginTop: 20, alignSelf: 'center', textAlign: 'center'}}>Optional Details</Text>
              <View style={styles.optional_details}>
                <View style={styles.private_sub_view}>
                  <Text style={styles.private_text}>School</Text>
                  <TouchableOpacity  style={styles.right_arrow} onPress={() => this.setState({open: true, modal_state: 4})}>
                    { this.state.school != '' ? (<Text style={styles.edit_text}>{this.state.school}</Text>) : (<Image source={require('../../img/right-arrow.png')}  style={{width: 15,height: 15}}/>)}
                  </TouchableOpacity>
                </View>
                <View style={styles.private_sub_view}>
                  <Text style={styles.private_text}>Work</Text>
                  <TouchableOpacity  style={styles.right_arrow} onPress={() => this.setState({open: true, modal_state: 5})}>
                    { this.state.work != '' ? (<Text style={styles.edit_text}>{this.state.work}</Text>) : (<Image source={require('../../img/right-arrow.png')}  style={{width: 15,height: 15}}/>)}
                  </TouchableOpacity>
                </View>
                <View style={{flexDirection:'row',width: Dimensions.get('window').width - 60,alignSelf: 'center',height: 40,}} >
                  <Text style={styles.private_text}>Language</Text>
                  <TouchableOpacity  style={styles.right_arrow} onPress={() => this.setState({sub_open: true, sub_modal_state: 3})}>
                    <Text style={styles.edit_text}>{language.find(item=>item.value==this.state.language).label}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            <Modal isOpen={this.state.open} onClosed={() => this.setState({open: false})} style={styles.modal} position={"bottom"}>
              <View style={styles.sub_form}>
                <View style={{flexDirection:'row', height: 70, backgroundColor: "#63b7b7",shadowColor: "#000000",shadowOpacity: 0.8,shadowRadius: 2,shadowOffset: {height: 1,width: 0}}}>
                  <TouchableOpacity  onPress={() => this._updateUser()}>
                    <Image source={require('../../img/checked_white.png')}  style={{marginTop: 35,marginLeft: 25,width: 22,height: 22}}/>
                  </TouchableOpacity>
                  <Text style={{fontFamily: 'Montserrat', fontSize: 17,marginTop: 35,marginLeft: 20,color: 'white',textAlign: 'center'}}>Done</Text>
                </View>

                { this.state.modal_state == 0 ? (
                  <View style={{flexDirection: 'column', marginTop: 20}}>
                    <Text style={{fontFamily: 'Montserrat', fontSize:14, alignSelf:'center'}}>First Name</Text>
                    <TextInput
                      style={styles.textinput}
                      value={this.state.f_name}
                      onChange={this.setFirstName.bind(this)}
                    />
                    <Text style={{fontFamily: 'Montserrat', fontSize:14, alignSelf:'center', marginTop: 20}}>Last Name</Text>
                    <TextInput
                      style={styles.textinput}
                      value={this.state.l_name}
                      onChange={this.setLastName.bind(this)}
                    />
                  </View>) : this.state.modal_state == 1 ? (
                    <View style={{flexDirection: 'column', marginTop: 20}}>
                      <Text style={{fontFamily: 'Montserrat', fontSize:14, alignSelf:'center'}}>About me</Text>
                      <TextInput
                        style={styles.textinput_about}
                        multiline = {true}
                        placeholder = "I've been a hairstylist for 5 years and I'm a braiding expert."
                        value={this.state.about}
                        onChange={this.setAbout.bind(this)}
                      />
                    </View>) : this.state.modal_state == 2 ? (
                      <View style={{flexDirection: 'column', marginTop: 20}}>
                        <Text style={{fontFamily: 'Montserrat', fontSize:14, alignSelf:'center'}}>Email</Text>
                        <TextInput
                          style={styles.textinput}
                          placeholder="don_david_l@hotmail.com"
                          value={this.state.email}
                          onChangeText={text => {
                            if(!text){
                            }
                          }}
                          onChange={this.setEmail.bind(this)}
                        />
                        <Text style={{fontFamily: 'Montserrat', fontSize:14, marginTop: 10, alignSelf:'center'}}>This is used for login and emails from Fro, and is not shared with other users.</Text>
                      </View>) : this.state.modal_state == 3 ? (
                        <View style={{flexDirection: 'column', marginTop: 20}}>
                          <Text style={{fontFamily: 'Montserrat', fontSize:14, alignSelf:'center'}}>Phone</Text>
                          <TextInput
                            style={styles.textinput}
                            placeholder="+1(514) 449-4366"
                            value={this.state.phone}
                            onChangeText={text => {
                              if(!text){
                              }
                            }}
                            onChange={this.setPhone.bind(this)}
                          />
                        </View>) : this.state.modal_state == 4 ? (
                          <View style={{flexDirection: 'column', marginTop: 20}}>
                            <Text style={{fontFamily: 'Montserrat', fontSize:14, alignSelf:'center'}}>School</Text>
                            <TextInput
                              style={styles.textinput}
                              placeholder = "Your schools"
                              value={this.state.school}
                              onChange={this.setSchool.bind(this)}
                            />
                          </View>) : this.state.modal_state == 5 ? (
                            <View style={{flexDirection: 'column', marginTop: 20}}>
                              <Text style={{fontFamily: 'Montserrat', fontSize:14, alignSelf:'center'}}>Work</Text>
                              <TextInput
                                style={styles.textinput}
                                placeholder = "Your works"
                                value={this.state.work}
                                onChange={this.setWork.bind(this)}
                              />
                            </View>) : null
                }
              </View>
            </Modal>

            <Modal isOpen={this.state.sub_open} onClosed={() => this.setState({sub_open: false})} style={this.state.sub_modal_state == 2 ? styles.gender_modal : this.state.sub_modal_state == 3 ? styles.lan_modal : styles.sub_modal} position={"center"}>
              {
                this.state.sub_modal_state == 1 ? (
                  <View style={{flexDirection:'column',alignItems:'center'}}>
                    <Text style={styles.modal_text}>Changing your email address will also change your Fro email login. Are you sure you want to continue?</Text>
                    <View style={{flexDirection:'row', height: 30, alignSelf: 'center', }}>
                      <Button onPress={() => this.setState({sub_open: false})} style={{fontFamily: 'Montserrat', fontSize: 14,alignSelf: 'center', color:'black'}}>CANCEL</Button>
                      <Button onPress={() => this._updateUserEmail()} style={{fontFamily: 'Montserrat', fontSize: 14,alignSelf: 'center', color:'#f26c4f', marginLeft: 15}}>CONTINUE</Button>
                    </View>
                  </View>
                ) : this.state.sub_modal_state == 2 ? (
                  <View style={{flex:1}}>
                    <ListView
                      dataSource={this.state.gender_dataSource}
                      renderRow={this.gender_renderRow.bind(this)}
                    />
                  </View>
                ) : this.state.sub_modal_state == 3 ? (
                  <View style={{flex:1}}>
                    <ListView
                      dataSource={this.state.lan_dataSource}
                      renderRow={this.lan_renderRow.bind(this)}
                    />
                  </View>
                ) : (
                  <View style={{flexDirection:'column',alignItems:'center'}}>
                    <Text style={{fontFamily: 'Montserrat', fontSize: 18, paddingLeft: 15, width: Dimensions.get('window').width - 60, alignSelf: 'center'}}>Take Picture</Text>
                    <Text style={styles.modal_text}>Take a new photo or select one from your existing photo library.</Text>
                    <View style={{flexDirection:'row',position: "absolute", bottom: 5, right: 20}}>
                      <Button onPress={this.chooseImage.bind(this)} style={{fontFamily: 'Montserrat', fontSize: 14,alignSelf: 'center', color:'#63b7b7'}}>GALLERY</Button>
                      <Button onPress={this.takePhoto.bind(this)} style={{fontFamily: 'Montserrat', fontSize: 14,alignSelf: 'center', color:'#63b7b7', marginLeft: 15}}>CAMERA</Button>
                    </View>
                  </View>
                )
              }
            </Modal>
          </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sub_form: {
    flex:1,
    flexDirection:'column',
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height,
  },
  navBar: {
    flexDirection:'row',
    height: 60,
    width: Dimensions.get('window').width,
    backgroundColor: "#63b7b7",
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {height: 1,width: 0},
    zIndex: 0,
  },
  profile: {
    width: 80,
    height: 80
  },
  profile_view: {
    width: Dimensions.get('window').width/3,
    alignItems: 'center',
    alignSelf: 'center'
  },
  icon: {
    width: 25,
    height: 25
  },
  text: {
    fontFamily: 'Montserrat', fontSize: 18, alignSelf: 'center', width:Dimensions.get('window').width*4/5,  marginLeft: 30
  },
  icon_view: {
    width: Dimensions.get('window').width/5 - 60,
    alignItems: 'center',
    alignSelf: 'center'
  },
  photo_view: {
    width: 32, alignItems: 'center', height: 25, position: "absolute", bottom: 5, right: 5
  },
  edit_text: {
    fontFamily: 'Montserrat', fontSize: 12, color: '#f26c4f', alignSelf: 'center', textAlign: 'center'
  },
  private_details: {
    flexDirection:'column',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 15,
    height: 200,
    width: Dimensions.get('window').width - 30,
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    borderRadius: 2,
    shadowOffset: {height: 0.1,width: 0},
  },
  optional_details: {
    flexDirection:'column',
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: 15,
    height: 120,
    width: Dimensions.get('window').width - 30,
    backgroundColor: "#ffffff",
    shadowColor: "#000000",
    shadowOpacity: 0.5,
    shadowRadius: 2,
    borderRadius: 2,
    shadowOffset: {height: 0.1,width: 0},
    marginBottom: 30
  },
  private_sub_view: {
    flexDirection:'row',
    width: Dimensions.get('window').width - 60,
    alignSelf: 'center',
    height: 40,
    borderBottomWidth: 0.2
  },
  private_text: {
    fontFamily: 'Montserrat', fontSize: 12, alignSelf: 'center'
  },
  right_arrow: {
    alignSelf: 'center', position: "absolute", right: 0
  },
  number: {
    fontFamily: 'Montserrat',
    width: Dimensions.get('window').width/2 * 1.6,
    height: 37,
    fontSize:12,
    color: '#f26c4f',
    textAlign: 'right',
    alignSelf: 'center', position: "absolute", right: 0
  },

  modal: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f0f0',
  },
  textinput: {
    fontFamily: 'Montserrat',
    width:Dimensions.get('window').width - 30,
    fontSize: 14,
    backgroundColor: 'white',
    paddingLeft: 10,
    borderWidth:0.8,
    borderColor:'#808080',
    borderRadius:2,
    marginTop:10,
    textAlign: 'left',
    height: 50,
    alignSelf: 'center'
  },
  textinput_about: {
    fontFamily: 'Montserrat',
    width:Dimensions.get('window').width - 30,
    fontSize: 14,
    backgroundColor: 'white',
    paddingLeft: 10,
    borderWidth:0.8,
    borderColor:'#808080',
    borderRadius:2,
    marginTop:10,
    textAlign: 'left',
    height: 100,
    alignSelf: 'center'
  },
  sub_modal: {
    justifyContent: 'center',
    alignItems: 'center',
    width:Dimensions.get('window').width - 50,
    height: 140,
    borderRadius: 2
  },
  modal_text: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    alignSelf: 'center',
    padding: 15,
    width: Dimensions.get('window').width - 60,
    height: 100
  },
  gender_modal: {
    justifyContent: 'center',
    alignItems: 'center',
    width:Dimensions.get('window').width - 50,
    height: 119,
    borderRadius: 2
  },
  lan_modal: {
    justifyContent: 'center',
    alignItems: 'center',
    width:Dimensions.get('window').width - 50,
    height: 79,
    borderRadius: 2
  },
});



const mapStateToProps = (state) => {
  const {api} = state;
  const { auth } = state;
  
  return {auth, api};
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(profileEdit);