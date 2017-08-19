const React = require('react');
const { connect } = require('react-redux');

const ConverseDetail = require('./ConverseDetail');
const ConvItem = require('../../components/ConvItem');
const chat = require('../../redux/actions/chat');

require('./ConverseList.scss');

class ConverseList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedUUID: ''
    };
  }

  componentDidMount() {
    setTimeout(() => {
      console.log('add converse test....');
      this.props.dispatch(chat.addConverse({
        uuid: 'dasdasdqwdqw',
        name: '测试会话组',
        icon: 'http://img4.imgtn.bdimg.com/it/u=1627316970,161287288&fm=26&gp=0.jpg',
        lastMsg: 'lastMsg',
        lastTime: 'lastTime',
      }));
    },1000);

    setTimeout(() => {
      console.log('add message test....');
      this.props.dispatch(chat.addMsg('dasdasdqwdqw', {
        uuid: '12312412312',
        sender: 'admin',
        time: '2017-08-18 16:16:59',
        content: '你好',
      }));
    },3000);
  }

  _handleSelectConverse(uuid) {
    console.log("选择会话", uuid);
    this.setState({
      selectedUUID: uuid
    })
  }

  getConverseList() {
    let converses = this.props.converses.toArray().map((item, index) => {
      item = item.toJS();
      return (
        <ConvItem
          key={'converses#'+index}
          icon={item.icon}
          title={item.name}
          content={item.lastMsg}
          time={item.lastTime}
          uuid={item.uuid}
          isSelected={this.state.selectedUUID === item.uuid}
          onClick={() => this._handleSelectConverse(item.uuid)}
        />
      )
    });
    return converses;
  }

  render() {
    return (
      <div className="converse">
        <div className="list">
          {this.getConverseList()}
        </div>
        <div className="detail">
          <ConverseDetail uuid={this.state.selectedUUID} list={this.props.converses.getIn([this.state.selectedUUID, 'msgList'])}/>
        </div>
      </div>
    )
  }
}

module.exports = connect(
  state => ({
    converses: state.getIn(['chat', 'converses'])
  })
)(ConverseList);
