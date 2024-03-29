/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {
  StyleSheet,
  View,
  PermissionsAndroid,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Text,
  ImageBackground,
  TextProps,
  TextInput,
  EmitterSubscription,
} from 'react-native';
import AzureCalling from 'react-native-azure-calling';
import Config from '../config.json';

const win = Dimensions.get('window');
const TOKEN = Config.TOKEN;

const onPress = async () => {
  let result = await AzureCalling.ping('Anjul Garg');
  console.log(result);
};

const getPermissions = async () => {
  let permissions = [
    PermissionsAndroid.PERMISSIONS.CAMERA,
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  ];
  try {
    for (const perm of permissions) {
      const granted = await PermissionsAndroid.request(perm);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log(`${perm} Granted`);
      } else {
        console.log(`${perm} Denied`);
      }
    }
  } catch (err) {
    console.warn(err);
  }
};

const testCall = async () => {
  AzureCalling.createAgent(TOKEN);
  AzureCalling.callACSUsers(['8:echo123']);
};

const hangUpCall = async () => {
  AzureCalling.hangUpCall();
};

export default class App extends React.Component {
  phoneNumber: string;
  callStateListener!: EmitterSubscription;

  constructor(props: object) {
    super(props);
    this.phoneNumber = '';
  }

  componentDidMount() {
    this.callStateListener = AzureCalling.addCallStateListener((event) => {
      console.log('EVENT', event.callState);
    });
  }

  componentWillUnmount() {
    this.callStateListener.remove();
  }

  capturePhoneNumber(input: string) {
    this.phoneNumber = input;
    console.log(`Phone Number is ${this.phoneNumber}`);
  }

  async callPSTN() {
    let from = '+18332143419';
    let to = this.phoneNumber;
    console.log(`Calling PSTN from ${from} to ${to}`);
    AzureCalling.createAgent(TOKEN);
    AzureCalling.callPSTN(from, to);
  }

  render() {
    return (
      <View style={{ backgroundColor: 'white', flex: 1 }}>
        <ImageBackground
          source={require('./assets/images/bg-gradient.png')}
          style={{ flex: 1 }}
        >
          <StatusBar
            backgroundColor={COLOR_GRADIENT('0.8')}
            barStyle="dark-content"
          />

          <View
            style={{
              alignSelf: 'center',
              padding: 32,
              width: win.width,
            }}
          >
            <H1 style={{ textAlign: 'center', fontSize: 24 }}>
              React Native Azure Calling
            </H1>
            <H1 style={{ textAlign: 'center', opacity: 0.5 }}>Example App</H1>
          </View>

          <View style={{ marginLeft: 16, marginRight: 16, marginTop: 16 }}>
            <View />
            <View
              style={{
                width: win.width - 96,
                alignSelf: 'center',
              }}
            >
              <View style={{ marginTop: 16, marginBottom: 8 }}>
                <ButtonPrimary title="Test Library Binding" onPress={onPress} />
                <ButtonPrimary
                  title="Get Permissions"
                  onPress={getPermissions}
                />
                <ButtonPrimary
                  title="Make Test Voice Call"
                  onPress={testCall}
                />

                <View style={{ paddingBottom: 16 }} />

                <TextInput
                  placeholder="Phone Number"
                  style={{
                    borderBottomColor: '#aaa',
                    borderBottomWidth: 1,
                    textAlign: 'center',
                  }}
                  onChangeText={this.capturePhoneNumber.bind(this)}
                />
                <ButtonPrimary
                  title="Make a Phone Call"
                  onPress={this.callPSTN.bind(this)}
                />

                <View style={{ paddingBottom: 16 }} />

                <ButtonPrimary
                  style={{ backgroundColor: 'firebrick' }}
                  title="HangUp Call"
                  onPress={hangUpCall}
                />
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const COLOR_PRIMARY = '#399c7d';
const COLOR_GRADIENT = (alpha: string) => `rgba(243, 233, 210, ${alpha})`;

const styles = StyleSheet.create({
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    textAlignVertical: 'center',
    height: 48,
  },
  buttonDefault: {
    elevation: 4,
    borderRadius: 2,
    height: 48,
    marginTop: 8,
    marginBottom: 8,
  },
  buttonPrimary: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: COLOR_PRIMARY,
  },
  disabled: {
    backgroundColor: '#aaa',
    elevation: 0,
  },
});

class ButtonPrimary extends React.Component<any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        style={[styles.buttonDefault, styles.buttonPrimary, this.props.style]}
        onPress={this.props.onPress}
      >
        <Text style={styles.buttonText}>
          {this.props.children || this.props.title}
        </Text>
      </TouchableOpacity>
    );
  }
}

class H1 extends React.Component<TextProps> {
  render() {
    return (
      <Text
        style={[
          {
            fontFamily: 'Montserrat-SemiBold',
            color: '#333',
            fontSize: 20,
            marginTop: 2,
            marginBottom: 2,
            lineHeight: 32,
          },
          this.props.style,
        ]}
      >
        {this.props.children}
      </Text>
    );
  }
}
