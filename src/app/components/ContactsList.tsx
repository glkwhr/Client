import React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { View, Text, SectionList, TouchableOpacity } from 'react-native';
import sb from 'react-native-style-block';
import appConfig from '../src/config.app';
import { TIcon } from './TComponent';
import ConvItem from './ConvItem';
import { switchNav } from '../src/redux/actions/nav';

interface Props extends DispatchProp<any> {
  friends: any;
  groups: any;
}
interface State {
  list: any;
}
class ContactList extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      list: [
        {
          name: '好友',
          data: props.friends.toJS(),
          isShow: true,
          list: props.friends,
        },
        {
          name: '团',
          data: props.groups.toJS(),
          isShow: true,
          list: props.groups,
        },
      ],
    };
  }

  handleClickHeader(section) {
    if (section.isShow === false) {
      let _section = this.state.list.find((s) => s.name === section.name);
      _section.data = _section.list.toJS();
      _section.isShow = true;
      this.setState({
        list: this.state.list,
      });
    } else {
      let _section = this.state.list.find((s) => s.name === section.name);
      _section.data = [];
      _section.isShow = false;
      this.setState({
        list: this.state.list,
      });
    }
  }

  handleShowProfile(uuid, type, name) {
    if (type === 'user') {
      this.props.dispatch(
        switchNav('Profile', {
          uuid,
          type,
          name,
        })
      );
    } else if (type === 'group') {
      this.props.dispatch(
        switchNav('GroupProfile', {
          uuid,
          type,
          name,
        })
      );
    }
  }

  getHeader(section) {
    return (
      <TouchableOpacity
        style={styles.header}
        onPress={() => this.handleClickHeader(section)}
      >
        {section.isShow ? (
          <TIcon icon="&#xe60f;" style={styles.headerIcon} />
        ) : (
          <TIcon icon="&#xe60e;" style={styles.headerIcon} />
        )}
        <Text>{section.name}</Text>
      </TouchableOpacity>
    );
  }

  getCell(item) {
    let defaultAvatar = appConfig.defaultImg.user;

    return (
      <ConvItem
        icon={item.avatar || defaultAvatar}
        title={item.name}
        content={''}
        uuid={item.uuid}
        style={styles.cell}
        onPress={() => {
          this.handleShowProfile(item.uuid, item.type, item.name);
        }}
      />
    );
  }

  render() {
    if (this.props.friends.length === 0 && this.props.groups.length === 0) {
      return (
        <View>
          <Text>暂无联系人, 快去交♂朋♂友吧</Text>
        </View>
      );
    }
    return (
      <SectionList
        renderSectionHeader={({ section }) => this.getHeader(section)}
        renderItem={({ item }) => this.getCell(item)}
        scrollEnabled={true}
        sections={this.state.list}
        keyExtractor={(item, index) => item + index}
        style={styles.listContainer}
      />
    );
  }
}

const styles = {
  listContainer: [sb.bgColor()],
  header: [
    sb.direction(),
    sb.alignCenter(),
    sb.padding(10),
    sb.border('Bottom', 0.5, '#eeeeee'),
    sb.bgColor(),
  ],
  headerIcon: [{ fontSize: 12, marginRight: 4 }],
  cell: [{ marginLeft: 20, paddingLeft: 10 }],
};

export default connect((state: any) => {
  let usercache = state.getIn(['cache', 'user']);
  let friends = state.getIn(['user', 'friendList']);
  let groups = state.getIn(['group', 'groups']);

  return {
    friends: friends.map((f) => ({
      uuid: usercache.getIn([f, 'uuid']),
      avatar: usercache.getIn([f, 'avatar']),
      name:
        usercache.getIn([f, 'nickname']) || usercache.getIn([f, 'username']),
      type: 'user',
    })),
    groups: groups.map((g) => ({
      uuid: g.get('uuid'),
      avatar: g.get('avatar'),
      name: g.get('name'),
      type: 'group',
    })),
  };
})(ContactList);
