import { connect } from 'react-redux';
import MainScene from '../components/mainScene';
import { push, pop } from '../actions/navigation';
export default connect(
  state => ({navigation: state.navReducer}),
  {
    pushRoute: (route) => push(route),
    popRoute: () => pop()
  }
)(MainScene);
